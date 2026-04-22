const SIMPLEX_NOISE_GLSL = `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`;

const VERTEX_SHADER = `
uniform float uTime;
uniform vec2  uPokeTrail;
uniform float uPokeDepth;

varying vec3 vNormal;
varying vec3 vViewPos;
varying float vDisp;

${SIMPLEX_NOISE_GLSL}

float liquidDisp(vec3 p) {
  float n1 = snoise(p * 0.55 + vec3(0.0, uTime * 0.12, 0.0));
  float n2 = snoise(p * 1.10 + vec3(uTime * 0.08, 0.0, uTime * 0.06)) * 0.28;
  return (n1 + n2) * 0.22;
}

void main() {
  vec3 pos = position;

  vec4 viewPosInit = modelViewMatrix * vec4(pos, 1.0);
  vec3 viewP = viewPosInit.xyz;

  float disp = liquidDisp(pos);

  vec2 screenXY = viewP.xy;
  float pokeDist = length(screenXY - uPokeTrail);
  float frontFacing = smoothstep(-4.0, -2.2, viewP.z);
  float poke = exp(-pokeDist * pokeDist * 5.0) * uPokeDepth * frontFacing;
  disp -= poke;

  vec3 displaced = pos + normal * disp;

  float eps = 0.01;
  vec3 tangent1 = normalize(cross(normal, vec3(0.0, 1.0, 0.0) + vec3(0.001)));
  vec3 tangent2 = normalize(cross(normal, tangent1));
  vec3 p1 = pos + tangent1 * eps;
  vec3 p2 = pos + tangent2 * eps;
  vec3 d1 = p1 + normal * liquidDisp(p1);
  vec3 d2 = p2 + normal * liquidDisp(p2);
  vec3 newNormal = normalize(cross(d1 - displaced, d2 - displaced));

  vec4 mv = modelViewMatrix * vec4(displaced, 1.0);
  vViewPos = -mv.xyz;
  vNormal  = normalize(normalMatrix * newNormal);
  vDisp    = disp;

  gl_Position = projectionMatrix * mv;
}
`;

const FRAGMENT_SHADER = `
precision highp float;

uniform vec3  uColorDeep;
uniform vec3  uColorShallow;
uniform vec3  uColorRim;
uniform vec3  uColorAccent;
uniform float uTime;

varying vec3 vNormal;
varying vec3 vViewPos;
varying float vDisp;

${SIMPLEX_NOISE_GLSL}

void main() {
  vec3 N = normalize(vNormal);
  vec3 V = normalize(vViewPos);

  float fres = pow(1.0 - max(dot(V, N), 0.0), 2.4);

  float depth = smoothstep(-0.2, 0.6, N.y + vDisp * 0.6);
  vec3 base   = mix(uColorDeep, uColorShallow, depth);

  vec3 lightDir = normalize(vec3(0.5, 0.85, 0.7));
  vec3 halfDir  = normalize(lightDir + V);
  float spec    = pow(max(dot(N, halfDir), 0.0), 56.0) * 0.4;

  float reflRaw  = snoise(N * 0.8 + vec3(uTime * 0.05, 0.0, 0.0));
  float reflMask = smoothstep(0.62, 0.88, reflRaw);
  vec3  reflCol  = mix(uColorRim, uColorAccent, 0.5 + 0.5 * sin(uTime * 0.1));

  vec3 color = base;
  color = mix(color, reflCol, reflMask * 0.55);
  color = mix(color, uColorRim, fres * 0.85);
  color += spec;

  float alpha = 0.06 + fres * 0.55 + reflMask * 0.22 + spec * 0.9;
  alpha = clamp(alpha, 0.0, 0.92);

  gl_FragColor = vec4(color, alpha);
}
`;

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
      (c.getContext("webgl") || c.getContext("experimental-webgl"))
    );
  } catch (_e) {
    return false;
  }
}

function waitForThree(timeoutMs = 4000) {
  return new Promise((resolve) => {
    const start = performance.now();
    const tick = () => {
      if (window.THREE) return resolve(window.THREE);
      if (performance.now() - start > timeoutMs) return resolve(null);
      requestAnimationFrame(tick);
    };
    tick();
  });
}

async function initWaterSphere() {
  const host = document.querySelector("[data-hero-sphere]");
  if (!host) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reduceMotion.matches) {
    document.body.classList.add("no-webgl");
    return;
  }

  if (!hasWebGL()) {
    document.body.classList.add("no-webgl");
    return;
  }

  const THREE = await waitForThree();
  if (!THREE) {
    document.body.classList.add("no-webgl");
    return;
  }

  const canvas = host.querySelector(".hero-sphere__canvas");
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
  renderer.setClearColor(0x000000, 0);
  if ("outputColorSpace" in renderer && THREE.SRGBColorSpace) {
    renderer.outputColorSpace = THREE.SRGBColorSpace;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0, 3.2);
  camera.lookAt(0, 0, 0);

  const geometry = new THREE.IcosahedronGeometry(1, 64);

  const uniforms = {
    uTime:         { value: 0 },
    uPokeTrail:    { value: new THREE.Vector2(0, 0) },
    uPokeDepth:    { value: 0 },
    uColorDeep:    { value: new THREE.Color(0x0b1a3a) },
    uColorShallow: { value: new THREE.Color(0x5cc8ff) },
    uColorRim:     { value: new THREE.Color(0xb8fff5) },
    uColorAccent:  { value: new THREE.Color(0x8a6bff) },
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: VERTEX_SHADER,
    fragmentShader: FRAGMENT_SHADER,
    transparent: true,
    depthWrite: false,
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const pointerTarget = { x: 0, y: 0, hover: 0 };

  const desktopQuery = window.matchMedia("(min-width: 1024px)");
  const travelState = {
    lastScrollY: window.scrollY || 0,
    velocity: 0,
    currentX: 0,
    currentYDrift: 0,
  };

  function resize() {
    const rect = host.getBoundingClientRect();
    const w = Math.max(1, Math.round(rect.width));
    const h = Math.max(1, Math.round(rect.height));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();

  if ("ResizeObserver" in window) {
    const ro = new ResizeObserver(resize);
    ro.observe(host);
  } else {
    window.addEventListener("resize", resize);
  }

  const HOVER_PAD = 80;
  window.addEventListener("pointermove", (e) => {
    if (e.pointerType === "touch") return;
    const rect = host.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    pointerTarget.x = x;
    pointerTarget.y = y;
    const inside =
      e.clientX >= rect.left - HOVER_PAD &&
      e.clientX <= rect.right + HOVER_PAD &&
      e.clientY >= rect.top - HOVER_PAD &&
      e.clientY <= rect.bottom + HOVER_PAD;
    pointerTarget.hover = inside ? 1 : 0;
  }, { passive: true });
  window.addEventListener("pointerout", (e) => {
    if (!e.relatedTarget) pointerTarget.hover = 0;
  });

  const clock = new THREE.Clock();
  let running = false;
  let rafId = null;

  function loop() {
    if (!running) return;
    const dt = clock.getDelta();
    uniforms.uTime.value += dt;

    const lerp = (a, b, t) => a + (b - a) * t;
    uniforms.uPokeTrail.value.x = lerp(uniforms.uPokeTrail.value.x, pointerTarget.x, 0.05);
    uniforms.uPokeTrail.value.y = lerp(uniforms.uPokeTrail.value.y, pointerTarget.y, 0.05);

    const targetDepth = pointerTarget.hover * 0.35;
    const depthRate = pointerTarget.hover > 0 ? 0.04 : 0.02;
    uniforms.uPokeDepth.value = lerp(uniforms.uPokeDepth.value, targetDepth, depthRate);

    mesh.rotation.y += dt * 0.04;
    mesh.rotation.x = Math.sin(uniforms.uTime.value * 0.12) * 0.04;

    const dyScroll = window.scrollY - travelState.lastScrollY;
    travelState.lastScrollY = window.scrollY;
    travelState.velocity = travelState.velocity * 0.85 + dyScroll * 0.15;

    if (desktopQuery.matches) {
      const docEl = document.documentElement;
      const scrollable = Math.max(1, docEl.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, window.scrollY / scrollable));
      const phase = Math.cos(progress * Math.PI * 7);
      const vw = window.innerWidth;
      const sphereW = host.offsetWidth;
      const margin = vw * 0.04;
      const halfRange = Math.max(0, vw / 2 - sphereW / 2 - margin);
      const targetX = phase * halfRange;
      const maxDrift = 55;
      const targetYDrift = Math.max(
        -maxDrift,
        Math.min(maxDrift, travelState.velocity * 1.4)
      );
      travelState.currentX = lerp(travelState.currentX, targetX, 0.11);
      travelState.currentYDrift = lerp(travelState.currentYDrift, targetYDrift, 0.14);
      host.style.transform = `translate(calc(-50% + ${travelState.currentX.toFixed(
        2
      )}px), calc(-50% + ${travelState.currentYDrift.toFixed(2)}px))`;
    }

    renderer.render(scene, camera);
    rafId = requestAnimationFrame(loop);
  }

  function start() {
    if (running) return;
    running = true;
    clock.getDelta();
    rafId = requestAnimationFrame(loop);
  }

  function stop() {
    running = false;
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  start();

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else start();
  });

  const handleReduceMotion = (event) => {
    if (!event.matches) return;
    stop();
    document.body.classList.add("no-webgl");
  };
  if (typeof reduceMotion.addEventListener === "function") {
    reduceMotion.addEventListener("change", handleReduceMotion);
  } else if (typeof reduceMotion.addListener === "function") {
    reduceMotion.addListener(handleReduceMotion);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initWaterSphere);
} else {
  initWaterSphere();
}
