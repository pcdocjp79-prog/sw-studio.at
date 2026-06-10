import * as THREE from "three";

const VISUAL_SELECTOR = "[data-ai-brain-visual]";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const PARTICLE_COUNT = 8200;
const SYNAPSE_NODE_COUNT = 220;
const MAX_PIXEL_RATIO = 1.6;

const createGlowTexture = () => {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;

  const context = canvas.getContext("2d");
  if (!context) return null;

  const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
  gradient.addColorStop(0.2, "rgba(200, 230, 255, 0.82)");
  gradient.addColorStop(0.42, "rgba(0, 150, 255, 0.44)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

  context.fillStyle = gradient;
  context.fillRect(0, 0, 64, 64);

  return new THREE.CanvasTexture(canvas);
};

const createBrainForm = (brainGroup) => {
  const particleGeometry = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(PARTICLE_COUNT * 3);
  const particleColors = new Float32Array(PARTICLE_COUNT * 3);
  const particleSizes = new Float32Array(PARTICLE_COUNT);
  const synapsePositions = [];
  const baseColorLeft = new THREE.Color(0x00f3ff);
  const baseColorRight = new THREE.Color(0xb026ff);
  const colorMix = new THREE.Color();
  const scale = 72;

  let particleIndex = 0;

  while (particleIndex < PARTICLE_COUNT) {
    const x = (Math.random() - 0.5) * 2;
    const y = (Math.random() - 0.5) * 2;
    const z = (Math.random() - 0.5) * 2;
    let xRadius = 0.85 - z * 0.1;
    let yRadius = 0.75;
    const zRadius = 1.15;

    if (y < 0) {
      const temporalDrop = Math.max(0, 1 - Math.abs(z * 1.5));
      yRadius += temporalDrop * 0.15;

      if (z > 0) {
        yRadius -= z * 0.15;
      }
    }

    const distance =
      (x * x) / (xRadius * xRadius) +
      (y * y) / (yRadius * yRadius) +
      (z * z) / (zRadius * zRadius);

    if (distance <= 0.45 || distance > 1 || Math.abs(x) < 0.04) continue;

    const noise =
      Math.sin(x * 18) * Math.cos(y * 18) +
      Math.sin(y * 18) * Math.cos(z * 18) +
      Math.sin(z * 18) * Math.cos(x * 18);
    const pinch = Math.abs(x) < 0.25 ? 1 - (0.25 - Math.abs(x)) * 0.35 : 1;
    const radiusMod = 1 + noise * 0.035;
    const finalX = x * scale * radiusMod * pinch;
    const finalY = y * scale * radiusMod * pinch;
    const finalZ = z * scale * radiusMod * pinch;
    const positionIndex = particleIndex * 3;

    particlePositions[positionIndex] = finalX;
    particlePositions[positionIndex + 1] = finalY;
    particlePositions[positionIndex + 2] = finalZ;

    colorMix.copy(baseColorLeft).lerp(baseColorRight, (x + 1) / 2);
    colorMix.offsetHSL(0, 0, (Math.random() - 0.5) * 0.18);
    particleColors[positionIndex] = colorMix.r;
    particleColors[positionIndex + 1] = colorMix.g;
    particleColors[positionIndex + 2] = colorMix.b;
    particleSizes[particleIndex] = 1.1 + Math.random() * 1.8;

    if (particleIndex % Math.floor(PARTICLE_COUNT / SYNAPSE_NODE_COUNT) === 0) {
      synapsePositions.push(new THREE.Vector3(finalX, finalY, finalZ));
    }

    particleIndex += 1;
  }

  particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
  particleGeometry.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));
  particleGeometry.setAttribute("size", new THREE.BufferAttribute(particleSizes, 1));

  const particleMaterial = new THREE.PointsMaterial({
    size: 2.2,
    map: createGlowTexture(),
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    transparent: true,
    vertexColors: true,
    opacity: 0.82,
  });

  const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
  brainGroup.add(particleSystem);
  createSynapses(brainGroup, synapsePositions, baseColorLeft, baseColorRight);
};

const createSynapses = (brainGroup, nodes, colorLeft, colorRight) => {
  const linePositions = [];
  const lineColors = [];
  const maxDistance = 22;

  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = i + 1; j < nodes.length; j += 1) {
      const distance = nodes[i].distanceTo(nodes[j]);

      if (distance >= maxDistance || nodes[i].x * nodes[j].x <= -50) continue;

      linePositions.push(nodes[i].x, nodes[i].y, nodes[i].z);
      linePositions.push(nodes[j].x, nodes[j].y, nodes[j].z);

      const colorA = new THREE.Color().copy(colorLeft).lerp(colorRight, (nodes[i].x / 72 + 1) / 2);
      const colorB = new THREE.Color().copy(colorLeft).lerp(colorRight, (nodes[j].x / 72 + 1) / 2);

      lineColors.push(colorA.r, colorA.g, colorA.b);
      lineColors.push(colorB.r, colorB.g, colorB.b);
    }
  }

  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
  lineGeometry.setAttribute("color", new THREE.Float32BufferAttribute(lineColors, 3));

  brainGroup.add(
    new THREE.LineSegments(
      lineGeometry,
      new THREE.LineBasicMaterial({
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.18,
        depthWrite: false,
      })
    )
  );
};

const initBrainVisual = (container) => {
  const reducedMotionQuery = window.matchMedia(REDUCED_MOTION_QUERY);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  const brainGroup = new THREE.Group();
  const clock = new THREE.Clock();
  let frameId = null;
  let isVisible = true;

  camera.position.z = 330;
  scene.fog = new THREE.FogExp2(0x030308, 0.0016);
  scene.add(brainGroup);
  brainGroup.rotation.x = -0.08;
  brainGroup.rotation.y = -0.24;
  brainGroup.scale.setScalar(0.92);

  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO));
  container.appendChild(renderer.domElement);
  createBrainForm(brainGroup);

  const render = () => {
    const elapsedTime = clock.getElapsedTime();
    brainGroup.rotation.y += reducedMotionQuery.matches ? 0 : 0.0018;

    if (!reducedMotionQuery.matches) {
      const pulseScale = 0.92 + Math.sin(elapsedTime * 1.8) * 0.018;
      brainGroup.scale.setScalar(pulseScale);
    }

    renderer.render(scene, camera);
  };

  const stop = () => {
    if (frameId === null) return;
    window.cancelAnimationFrame(frameId);
    frameId = null;
  };

  const animate = () => {
    render();

    if (reducedMotionQuery.matches || !isVisible) {
      frameId = null;
      return;
    }

    frameId = window.requestAnimationFrame(animate);
  };

  const start = () => {
    if (frameId !== null) return;
    frameId = window.requestAnimationFrame(animate);
  };

  const resize = () => {
    const rect = container.getBoundingClientRect();
    const width = Math.max(Math.round(rect.width), 1);
    const height = Math.max(Math.round(rect.height), 1);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    render();
  };

  const resizeObserver =
    "ResizeObserver" in window
      ? new ResizeObserver(() => resize())
      : null;
  resizeObserver?.observe(container);

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries.some((entry) => entry.isIntersecting);

        if (isVisible && !reducedMotionQuery.matches) {
          start();
          return;
        }

        stop();
        render();
      },
      { threshold: 0.05 }
    );
    observer.observe(container);
  }

  const handleMotionChange = () => {
    stop();
    render();

    if (!reducedMotionQuery.matches && isVisible) {
      start();
    }
  };

  if (typeof reducedMotionQuery.addEventListener === "function") {
    reducedMotionQuery.addEventListener("change", handleMotionChange);
  } else if (typeof reducedMotionQuery.addListener === "function") {
    reducedMotionQuery.addListener(handleMotionChange);
  }

  resize();
  container.classList.add("is-ready");

  if (reducedMotionQuery.matches) {
    render();
    return;
  }

  start();
};

document.querySelectorAll(VISUAL_SELECTOR).forEach((container) => {
  try {
    initBrainVisual(container);
  } catch (_error) {
    container.classList.add("is-static");
  }
});
