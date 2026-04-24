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
uniform vec2 uPokeTrail;
uniform float uPokeDepth;
uniform float uOrbScale;

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
  vec2 pokeDelta = (screenXY - uPokeTrail) / max(uOrbScale, 0.001);
  float frontFacing = smoothstep(-14.0, -4.0, viewP.z);

  float radial = length(pokeDelta);
  float angle = atan(pokeDelta.y, pokeDelta.x);
  float ripple = 0.72 + 0.28 * sin(angle * 6.0 + uTime * 1.3);
  float coreImpact = exp(-radial * radial * 12.0);
  float splashRing = exp(-pow(radial - 0.28, 2.0) * 40.0) * ripple;
  float outerSpray = exp(-pow(radial - 0.52, 2.0) * 20.0) * (0.78 + 0.22 * sin(angle * 10.0 - uTime * 0.9));
  float recoil = exp(-pow(radial - 0.16, 2.0) * 26.0);

  float inwardCut = (coreImpact * 0.42 + recoil * 0.1) * uPokeDepth * frontFacing;
  float outwardBurst = (splashRing * 0.28 + outerSpray * 0.12) * uPokeDepth * frontFacing;

  disp -= inwardCut;
  disp += outwardBurst;

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
  vNormal = normalize(normalMatrix * newNormal);
  vDisp = disp;

  gl_Position = projectionMatrix * mv;
}
`;

const FRAGMENT_SHADER = `
precision highp float;

uniform vec3 uColorDeep;
uniform vec3 uColorShallow;
uniform vec3 uColorRim;
uniform vec3 uColorAccent;
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
  vec3 base = mix(uColorDeep, uColorShallow, depth);

  vec3 lightDir = normalize(vec3(0.5, 0.85, 0.7));
  vec3 halfDir = normalize(lightDir + V);
  float spec = pow(max(dot(N, halfDir), 0.0), 56.0) * 0.4;

  float reflRaw = snoise(N * 0.8 + vec3(uTime * 0.05, 0.0, 0.0));
  float reflMask = smoothstep(0.62, 0.88, reflRaw);
  vec3 reflCol = mix(uColorRim, uColorAccent, 0.5 + 0.5 * sin(uTime * 0.1));

  vec3 color = base;
  color = mix(color, reflCol, reflMask * 0.55);
  color = mix(color, uColorRim, fres * 0.85);
  color += spec;

  float alpha = 0.06 + fres * 0.55 + reflMask * 0.22 + spec * 0.9;
  alpha = clamp(alpha, 0.0, 0.92);

  gl_FragColor = vec4(color, alpha);
}
`;

const ORB_CONFIGS = {
  desktop: [
    {
      key: "cyan-violet",
      interactive: true,
      hoverDepth: 0.2,
      hoverRadius: 0.9,
      colors: [0x0e1d47, 0x77d2ff, 0xc7fff8, 0x8b6fff],
      baseX: -0.84,
      baseY: 0.78,
      scale: 4.75,
      depth: -3.6,
      driftX: 0.12,
      driftY: 0.07,
      driftSpeed: 0.28,
      driftPhase: 0.4,
      rotationSpeed: 0.08,
      pulse: 0.04,
    },
    {
      key: "magenta",
      interactive: true,
      hoverDepth: 0.18,
      hoverRadius: 0.92,
      colors: [0x29113a, 0xff77dc, 0xffd8fb, 0x8d6eff],
      baseX: 0.84,
      baseY: -0.68,
      scale: 3.95,
      depth: -4.2,
      driftX: 0.08,
      driftY: 0.12,
      driftSpeed: 0.24,
      driftPhase: 1.6,
      rotationSpeed: 0.06,
      pulse: 0.05,
    },
    {
      key: "aqua",
      interactive: true,
      hoverDepth: 0.16,
      hoverRadius: 1.02,
      colors: [0x0d2242, 0x9aefff, 0xd6fff7, 0x68b8ff],
      baseX: -0.96,
      baseY: -0.86,
      scale: 1.55,
      depth: -2.6,
      driftX: 0.06,
      driftY: 0.05,
      driftSpeed: 0.42,
      driftPhase: 2.2,
      rotationSpeed: 0.11,
      pulse: 0.06,
    },
    {
      key: "blue",
      interactive: true,
      hoverDepth: 0.17,
      hoverRadius: 0.98,
      colors: [0x13285c, 0x74c8ff, 0xcbf5ff, 0x7c75ff],
      baseX: 0.74,
      baseY: 0.42,
      scale: 1.82,
      depth: -2.9,
      driftX: 0.05,
      driftY: 0.08,
      driftSpeed: 0.34,
      driftPhase: 3.1,
      rotationSpeed: 0.09,
      pulse: 0.04,
    },
    {
      key: "cyan-violet-lower",
      interactive: false,
      colors: [0x0e1d47, 0x77d2ff, 0xc7fff8, 0x8b6fff],
      baseX: 0.62,
      baseY: -1.35,
      scale: 3.2,
      depth: -3.8,
      driftX: 0.1,
      driftY: 0.08,
      driftSpeed: 0.26,
      driftPhase: 2.8,
      rotationSpeed: 0.07,
      pulse: 0.04,
    },
    {
      key: "magenta-lower",
      interactive: false,
      colors: [0x29113a, 0xff77dc, 0xffd8fb, 0x8d6eff],
      baseX: -0.78,
      baseY: -2.05,
      scale: 3.6,
      depth: -4.0,
      driftX: 0.09,
      driftY: 0.1,
      driftSpeed: 0.22,
      driftPhase: 4.1,
      rotationSpeed: 0.05,
      pulse: 0.05,
    },
    {
      key: "aqua-lower",
      interactive: false,
      colors: [0x0d2242, 0x9aefff, 0xd6fff7, 0x68b8ff],
      baseX: 0.92,
      baseY: -1.78,
      scale: 1.45,
      depth: -2.6,
      driftX: 0.05,
      driftY: 0.06,
      driftSpeed: 0.38,
      driftPhase: 5.4,
      rotationSpeed: 0.1,
      pulse: 0.05,
    },
    {
      key: "blue-lower",
      interactive: false,
      colors: [0x13285c, 0x74c8ff, 0xcbf5ff, 0x7c75ff],
      baseX: -0.22,
      baseY: -2.55,
      scale: 1.7,
      depth: -2.9,
      driftX: 0.06,
      driftY: 0.07,
      driftSpeed: 0.3,
      driftPhase: 6.0,
      rotationSpeed: 0.08,
      pulse: 0.04,
    },
  ],
  tablet: [
    {
      key: "cyan-violet",
      interactive: false,
      colors: [0x0e1d47, 0x77d2ff, 0xc7fff8, 0x8b6fff],
      baseX: -0.82,
      baseY: 0.74,
      scale: 4.0,
      depth: -3.6,
      driftX: 0.1,
      driftY: 0.06,
      driftSpeed: 0.26,
      driftPhase: 0.4,
      rotationSpeed: 0.07,
      pulse: 0.04,
    },
    {
      key: "magenta",
      interactive: false,
      colors: [0x29113a, 0xff77dc, 0xffd8fb, 0x8d6eff],
      baseX: 0.86,
      baseY: -0.62,
      scale: 3.35,
      depth: -4.0,
      driftX: 0.07,
      driftY: 0.1,
      driftSpeed: 0.22,
      driftPhase: 1.6,
      rotationSpeed: 0.055,
      pulse: 0.045,
    },
    {
      key: "blue",
      interactive: false,
      colors: [0x13285c, 0x74c8ff, 0xcbf5ff, 0x7c75ff],
      baseX: 0.68,
      baseY: 0.36,
      scale: 1.6,
      depth: -2.9,
      driftX: 0.05,
      driftY: 0.07,
      driftSpeed: 0.32,
      driftPhase: 3.1,
      rotationSpeed: 0.08,
      pulse: 0.04,
    },
    {
      key: "cyan-violet-lower",
      interactive: false,
      colors: [0x0e1d47, 0x77d2ff, 0xc7fff8, 0x8b6fff],
      baseX: 0.58,
      baseY: -1.4,
      scale: 2.8,
      depth: -3.8,
      driftX: 0.08,
      driftY: 0.07,
      driftSpeed: 0.24,
      driftPhase: 2.8,
      rotationSpeed: 0.06,
      pulse: 0.04,
    },
    {
      key: "magenta-lower",
      interactive: false,
      colors: [0x29113a, 0xff77dc, 0xffd8fb, 0x8d6eff],
      baseX: -0.76,
      baseY: -2.0,
      scale: 3.1,
      depth: -4.0,
      driftX: 0.08,
      driftY: 0.09,
      driftSpeed: 0.2,
      driftPhase: 4.1,
      rotationSpeed: 0.05,
      pulse: 0.045,
    },
    {
      key: "aqua-lower",
      interactive: false,
      colors: [0x0d2242, 0x9aefff, 0xd6fff7, 0x68b8ff],
      baseX: 0.2,
      baseY: -2.5,
      scale: 1.4,
      depth: -2.7,
      driftX: 0.05,
      driftY: 0.06,
      driftSpeed: 0.3,
      driftPhase: 5.6,
      rotationSpeed: 0.08,
      pulse: 0.04,
    },
  ],
  mobile: [
    {
      key: "cyan-violet",
      interactive: false,
      colors: [0x0e1d47, 0x77d2ff, 0xc7fff8, 0x8b6fff],
      baseX: -0.86,
      baseY: 0.78,
      scale: 3.6,
      depth: -3.4,
      driftX: 0.08,
      driftY: 0.05,
      driftSpeed: 0.24,
      driftPhase: 0.4,
      rotationSpeed: 0.06,
      pulse: 0.03,
    },
    {
      key: "magenta",
      interactive: false,
      colors: [0x29113a, 0xff77dc, 0xffd8fb, 0x8d6eff],
      baseX: 0.92,
      baseY: -0.62,
      scale: 2.85,
      depth: -3.8,
      driftX: 0.06,
      driftY: 0.08,
      driftSpeed: 0.2,
      driftPhase: 1.6,
      rotationSpeed: 0.05,
      pulse: 0.035,
    },
    {
      key: "cyan-violet-lower",
      interactive: false,
      colors: [0x0e1d47, 0x77d2ff, 0xc7fff8, 0x8b6fff],
      baseX: 0.52,
      baseY: -1.5,
      scale: 2.4,
      depth: -3.6,
      driftX: 0.07,
      driftY: 0.07,
      driftSpeed: 0.22,
      driftPhase: 3.2,
      rotationSpeed: 0.05,
      pulse: 0.035,
    },
    {
      key: "magenta-lower",
      interactive: false,
      colors: [0x29113a, 0xff77dc, 0xffd8fb, 0x8d6eff],
      baseX: -0.78,
      baseY: -2.1,
      scale: 2.6,
      depth: -3.8,
      driftX: 0.07,
      driftY: 0.08,
      driftSpeed: 0.18,
      driftPhase: 4.6,
      rotationSpeed: 0.04,
      pulse: 0.04,
    },
  ],
};

const SCENE_HALF_HEIGHT = 5;
const ORB_FIELD_MULTIPLIER = 2;
const HOVER_PAD = 100;
const ENABLE_ORB_HOVER = false;

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch (_error) {
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

function createOrbMaterial(THREE, config) {
  const uniforms = {
    uTime: { value: 0 },
    uPokeTrail: { value: new THREE.Vector2(0, 0) },
    uPokeDepth: { value: 0 },
    uOrbScale: { value: 1 },
    uColorDeep: { value: new THREE.Color(config.colors[0]) },
    uColorShallow: { value: new THREE.Color(config.colors[1]) },
    uColorRim: { value: new THREE.Color(config.colors[2]) },
    uColorAccent: { value: new THREE.Color(config.colors[3]) },
  };

  return new THREE.ShaderMaterial({
    uniforms,
    vertexShader: VERTEX_SHADER,
    fragmentShader: FRAGMENT_SHADER,
    transparent: true,
    depthWrite: false,
  });
}

async function initWaterSphere() {
  const host = document.querySelector("[data-orb-parallax-layer]");
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

  const canvas = host.querySelector(".orb-parallax__canvas");
  if (!canvas) return;

  document.body.classList.remove("no-webgl");

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setClearColor(0x000000, 0);
  if ("outputColorSpace" in renderer && THREE.SRGBColorSpace) {
    renderer.outputColorSpace = THREE.SRGBColorSpace;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 40);
  camera.position.set(0, 0, 12);
  camera.lookAt(0, 0, 0);

  const desktopQuery = window.matchMedia("(min-width: 1200px)");
  const tabletQuery = window.matchMedia("(min-width: 700px) and (max-width: 1199.98px)");
  const getTier = () =>
    desktopQuery.matches ? "desktop" : tabletQuery.matches ? "tablet" : "mobile";

  const pointerTarget = { x: 0, y: 0, inside: false, hasPointer: false };
  const worldPointer = new THREE.Vector2(0, 0);
  const orbEntries = [];
  let geometry = null;

  const lerp = (start, end, amount) => start + (end - start) * amount;
  const createGeometry = () => {
    const tier = getTier();
    const detail = tier === "desktop" ? 56 : tier === "tablet" ? 46 : 36;
    return new THREE.IcosahedronGeometry(1, detail);
  };

  const setCameraFrustum = (width, height) => {
    const aspect = width / Math.max(height, 1);
    camera.top = SCENE_HALF_HEIGHT;
    camera.bottom = -SCENE_HALF_HEIGHT;
    camera.right = SCENE_HALF_HEIGHT * aspect;
    camera.left = -SCENE_HALF_HEIGHT * aspect;
    camera.updateProjectionMatrix();
  };

  const rebuildOrbs = () => {
    while (orbEntries.length > 0) {
      const entry = orbEntries.pop();
      scene.remove(entry.mesh);
      entry.material.dispose();
    }

    if (geometry) {
      geometry.dispose();
    }
    geometry = createGeometry();

    const nextConfigs = ORB_CONFIGS[getTier()] || ORB_CONFIGS.mobile;
    nextConfigs.forEach((config, index) => {
      const material = createOrbMaterial(THREE, config);
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.z = config.depth;
      mesh.renderOrder = index;
      scene.add(mesh);
      orbEntries.push({
        config,
        mesh,
        material,
        hoverStrength: 0,
        hoverRadius: config.scale,
        pokeTrail: new THREE.Vector2(0, 0),
      });
    });
  };

  const resize = () => {
    const width = Math.max(1, window.innerWidth);
    const height = Math.max(1, window.innerHeight);
    renderer.setSize(width, height, false);
    setCameraFrustum(width, height);
  };

  resize();
  rebuildOrbs();

  window.addEventListener("resize", resize);

  const updatePointer = (event) => {
    if (!ENABLE_ORB_HOVER) return;
    if (event.pointerType === "touch") return;

    const rect = host.getBoundingClientRect();
    const inside =
      event.clientX >= rect.left - HOVER_PAD &&
      event.clientX <= rect.right + HOVER_PAD &&
      event.clientY >= rect.top - HOVER_PAD &&
      event.clientY <= rect.bottom + HOVER_PAD;

    pointerTarget.hasPointer = true;
    pointerTarget.inside = inside;

    const relativeX = ((event.clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1;
    const relativeY = -((((event.clientY - rect.top) / Math.max(rect.height, 1)) * 2) - 1);
    pointerTarget.x = Math.max(-1.4, Math.min(1.4, relativeX));
    pointerTarget.y = Math.max(-1.4, Math.min(1.4, relativeY));
  };

  window.addEventListener("pointermove", updatePointer, { passive: true });
  window.addEventListener("pointerout", (event) => {
    if (!ENABLE_ORB_HOVER) return;
    if (!event.relatedTarget) {
      pointerTarget.inside = false;
      pointerTarget.hasPointer = false;
    }
  });
  window.addEventListener("blur", () => {
    if (!ENABLE_ORB_HOVER) return;
    pointerTarget.inside = false;
    pointerTarget.hasPointer = false;
  });

  const clock = new THREE.Clock();
  let running = false;
  let rafId = null;
  let elapsedTime = 0;

  const syncWorldPointer = () => {
    worldPointer.x = pointerTarget.x * camera.right;
    worldPointer.y = pointerTarget.y * camera.top;
  };

  const updateOrbTransforms = (time, delta) => {
    if (ENABLE_ORB_HOVER) {
      syncWorldPointer();
    }
    let hoveredEntry = null;
    let hoveredRatio = Number.POSITIVE_INFINITY;

    const scrollState = window.__orbParallaxState;
    const rawProgress = scrollState && typeof scrollState.progress === "number"
      ? scrollState.progress
      : 0;
    const progress = Math.max(0, Math.min(1, rawProgress));
    const scrollOffsetY =
      progress * SCENE_HALF_HEIGHT * 2 * (ORB_FIELD_MULTIPLIER - 1);

    orbEntries.forEach((entry) => {
      const { config, mesh, material } = entry;
      const phase = time * config.driftSpeed + config.driftPhase;
      const pulse = 1 + Math.sin(time * (config.driftSpeed * 1.6) + config.driftPhase) * config.pulse;
      const driftX = Math.sin(phase) * config.driftX;
      const driftY = Math.cos(phase * 0.92) * config.driftY;

      mesh.position.x = (config.baseX + driftX) * camera.right;
      mesh.position.y = (config.baseY + driftY) * camera.top + scrollOffsetY;
      mesh.position.z = config.depth;
      mesh.scale.setScalar(config.scale * pulse);
      mesh.rotation.y += delta * config.rotationSpeed;
      mesh.rotation.x = Math.sin(time * (config.driftSpeed * 0.85) + config.driftPhase) * 0.12;

      material.uniforms.uTime.value = time;
      material.uniforms.uOrbScale.value = config.scale * pulse;
      entry.hoverRadius = config.scale * pulse * (config.hoverRadius || 0.94);

      if (
        !ENABLE_ORB_HOVER ||
        !desktopQuery.matches ||
        !config.interactive ||
        !pointerTarget.hasPointer ||
        !pointerTarget.inside
      ) {
        return;
      }

      const dx = worldPointer.x - mesh.position.x;
      const dy = worldPointer.y - mesh.position.y;
      const dist = Math.hypot(dx, dy);
      const distRatio = dist / Math.max(entry.hoverRadius, 0.001);

      if (distRatio <= 1 && distRatio < hoveredRatio) {
        hoveredEntry = entry;
        hoveredRatio = distRatio;
      }
    });

    orbEntries.forEach((entry) => {
      const { config, mesh, material, pokeTrail } = entry;
      const isHovered = entry === hoveredEntry && desktopQuery.matches && config.interactive;
      const targetTrailX = isHovered ? worldPointer.x : mesh.position.x;
      const targetTrailY = isHovered ? worldPointer.y : mesh.position.y;
      const targetDepth = isHovered ? (config.hoverDepth || 0.18) : 0;
      const trailLerp = isHovered ? 0.22 : 0.1;
      const depthLerp = isHovered ? 0.2 : 0.075;

      pokeTrail.x = lerp(pokeTrail.x, targetTrailX, trailLerp);
      pokeTrail.y = lerp(pokeTrail.y, targetTrailY, trailLerp);
      entry.hoverStrength = lerp(entry.hoverStrength, targetDepth, depthLerp);

      material.uniforms.uPokeTrail.value.copy(pokeTrail);
      material.uniforms.uPokeDepth.value = entry.hoverStrength;
    });
  };

  const loop = () => {
    if (!running) return;
    const delta = clock.getDelta();
    elapsedTime += delta;
    updateOrbTransforms(elapsedTime, delta);
    renderer.render(scene, camera);
    rafId = requestAnimationFrame(loop);
  };

  const start = () => {
    if (running) return;
    running = true;
    clock.start();
    clock.getDelta();
    rafId = requestAnimationFrame(loop);
  };

  const stop = () => {
    running = false;
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    clock.stop();
  };

  const handleTierChange = () => {
    rebuildOrbs();
    resize();
  };

  [desktopQuery, tabletQuery].forEach((query) => {
    if (typeof query.addEventListener === "function") {
      query.addEventListener("change", handleTierChange);
    } else if (typeof query.addListener === "function") {
      query.addListener(handleTierChange);
    }
  });

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
