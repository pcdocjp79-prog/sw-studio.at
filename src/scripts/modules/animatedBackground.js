export const initAnimatedBackgroundFeature = () => {
  // Mark document as JS-enabled so CSS can apply progressive enhancement.
  document.documentElement.classList.add("js");
  // Leave empty to keep the static background; set a valid .glb path to enable 3D mode.
  const animatedBackgroundModelPath = "";
  
  function initAnimatedBackground() {
    const backgroundContainer = document.getElementById("animated-background");
    if (!backgroundContainer) return;
    if (!animatedBackgroundModelPath) return;
  
    const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotionQuery.matches) return;
  
    if (!window.THREE || !window.THREE.GLTFLoader) return;
  
    const hasWebGL = (() => {
      try {
        const canvas = document.createElement("canvas");
        return Boolean(
          window.WebGLRenderingContext &&
            (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
        );
      } catch (_error) {
        return false;
      }
    })();
  
    if (!hasWebGL) return;
  
    const scene = new window.THREE.Scene();
    const camera = new window.THREE.PerspectiveCamera(
      38,
      window.innerWidth / window.innerHeight,
      0.1,
      120
    );
    camera.position.set(0, 0, 5);
  
    const renderer = new window.THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
  
    if ("outputColorSpace" in renderer && window.THREE.SRGBColorSpace) {
      renderer.outputColorSpace = window.THREE.SRGBColorSpace;
    }
  
    backgroundContainer.appendChild(renderer.domElement);
  
    const ambientLight = new window.THREE.AmbientLight(0xffffff, 1.35);
    const keyLight = new window.THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(2.1, 1.8, 3);
    const rimLight = new window.THREE.DirectionalLight(0x88b6ff, 0.65);
    rimLight.position.set(-2.6, -1.3, -1.8);
    scene.add(ambientLight, keyLight, rimLight);
  
    const loader = new window.THREE.GLTFLoader();
    const clock = new window.THREE.Clock();
    let model = null;
    let mixer = null;
    let frameId = null;
    let isRunning = false;
  
    const fitCameraToModel = (object3d) => {
      const bounds = new window.THREE.Box3().setFromObject(object3d);
      if (bounds.isEmpty()) return;
  
      const size = bounds.getSize(new window.THREE.Vector3());
      const center = bounds.getCenter(new window.THREE.Vector3());
      object3d.position.sub(center);
  
      const maxDimension = Math.max(size.x, size.y, size.z);
      const fovRad = window.THREE.MathUtils.degToRad(camera.fov);
      const cameraDistance =
        maxDimension > 0
          ? (maxDimension / (2 * Math.tan(fovRad / 2))) * 1.35
          : 4;
  
      camera.position.set(0, maxDimension * 0.08, cameraDistance);
      camera.near = Math.max(cameraDistance / 100, 0.01);
      camera.far = Math.max(cameraDistance * 100, 120);
      camera.updateProjectionMatrix();
      camera.lookAt(0, 0, 0);
    };
  
    const render = () => {
      if (!isRunning) return;
  
      const delta = clock.getDelta();
      if (mixer) mixer.update(delta);
  
      if (model) {
        model.rotation.y += delta * 0.24;
        model.rotation.x = Math.sin(clock.elapsedTime * 0.35) * 0.08;
      }
  
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(render);
    };
  
    const startRendering = () => {
      if (isRunning) return;
      isRunning = true;
      clock.getDelta();
      frameId = requestAnimationFrame(render);
    };
  
    const stopRendering = () => {
      isRunning = false;
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
        frameId = null;
      }
    };
  
    loader.load(
      animatedBackgroundModelPath,
      (gltf) => {
        model = gltf.scene;
        fitCameraToModel(model);
        scene.add(model);
  
        if (Array.isArray(gltf.animations) && gltf.animations.length > 0) {
          mixer = new window.THREE.AnimationMixer(model);
          gltf.animations.forEach((clip) => {
            mixer.clipAction(clip).play();
          });
        }
  
        document.body.classList.add("has-animated-bg");
        startRendering();
      },
      undefined,
      (_error) => {
        stopRendering();
      }
    );
  
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
  
    window.addEventListener("resize", handleResize);
  
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        stopRendering();
      } else if (document.body.classList.contains("has-animated-bg")) {
        startRendering();
      }
    });
  
    const handleReduceMotionChange = (event) => {
      if (!event.matches) return;
      stopRendering();
      document.body.classList.remove("has-animated-bg");
    };
  
    if (typeof reduceMotionQuery.addEventListener === "function") {
      reduceMotionQuery.addEventListener("change", handleReduceMotionChange);
    } else if (typeof reduceMotionQuery.addListener === "function") {
      reduceMotionQuery.addListener(handleReduceMotionChange);
    }
  }
  
  initAnimatedBackground();
};

