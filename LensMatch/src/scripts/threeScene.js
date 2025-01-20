import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { BokehPass } from "three/examples/jsm/postprocessing/BokehPass";

// Zentrale Werte: Bildkegel, Brennweite, Blendenwert, Fokus
let fieldOfView = 300; 
let focalLength = 25; // Brennweite in mm
let aperture = 3; // Blendenwert
let focus = 5.729; // Fokus in mm

export const initializeThreeScene = (refs, data) => {
  const aspectRatio = 16 / 9; // Standard-Seitenverhältnis der Kamera

  const rendererBackground = new THREE.WebGLRenderer({ antialias: true });
  const rendererHighlight = new THREE.WebGLRenderer({ antialias: true });

  const containerBackground = refs.rendererBackground;
  const containerHighlight = refs.rendererHighlight;

  rendererBackground.setPixelRatio(window.devicePixelRatio);
  rendererHighlight.setPixelRatio(window.devicePixelRatio);

  rendererBackground.setClearColor(0x008eff);
  rendererHighlight.setClearColor(0x008eff);

  rendererBackground.shadowMap.enabled = true;
  rendererHighlight.shadowMap.enabled = true;

  containerBackground.appendChild(rendererBackground.domElement);
  containerHighlight.appendChild(rendererHighlight.domElement);

  const sceneBackground = new THREE.Scene();
  const sceneHighlight = new THREE.Scene();

  // Berechnung des Bildkegels basierend auf Brennweite
  const calculateFieldOfView = (focalLength, sensorHeight = 24) => {
    // Sensorhöhe standardmäßig auf 24mm (Vollformat) gesetzt
    return (3 * Math.atan((sensorHeight / 2) / focalLength)) * (180 / Math.PI); // FOV in Grad
  };

  // Initiale FOV-Berechnung
  fieldOfView = calculateFieldOfView(focalLength);

  const cameraBackground = new THREE.PerspectiveCamera(
    fieldOfView, // Berechneter FOV
    containerBackground.clientWidth / containerBackground.clientHeight,
    0.1,
    1000
  );
  const cameraHighlight = new THREE.PerspectiveCamera(
    fieldOfView, // Berechneter FOV
    containerHighlight.clientWidth / containerHighlight.clientHeight,
    0.1,
    1000
  );

  cameraBackground.aspect = aspectRatio;
  cameraHighlight.aspect = aspectRatio;

  cameraBackground.position.set(-2.01, 0.32, 3.32);
  cameraHighlight.position.set(-2.01, 0.32, 3.32);

  cameraBackground.quaternion.setFromEuler(
    new THREE.Euler(
      THREE.MathUtils.degToRad(0),
      THREE.MathUtils.degToRad(-17.5),
      THREE.MathUtils.degToRad(0),
      "XYZ"
    )
  );
  cameraHighlight.quaternion.copy(cameraBackground.quaternion);

  sceneBackground.add(cameraBackground);
  sceneHighlight.add(cameraHighlight);

  const ambientLight = new THREE.AmbientLight(0xffffff, 3);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
  directionalLight.position.set(5, 10, 5);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;

  const sunLight = new THREE.DirectionalLight(0xffdd88, 3);
  sunLight.position.set(10, 50, -10);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;

  sceneBackground.add(ambientLight.clone());
  sceneHighlight.add(ambientLight.clone());
  sceneBackground.add(directionalLight.clone());
  sceneHighlight.add(directionalLight.clone());
  sceneBackground.add(sunLight.clone());
  sceneHighlight.add(sunLight.clone());

  const loader = new GLTFLoader();

  loader.load("/3D-Objekte/3D-Szene/szene.glb", (gltf) => {
    const blenderScene = gltf.scene;
    blenderScene.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });

    sceneBackground.add(blenderScene.clone());
    sceneHighlight.add(blenderScene.clone());

    const composerBackground = new EffectComposer(rendererBackground);
    composerBackground.addPass(new RenderPass(sceneBackground, cameraBackground));

    const composerHighlight = new EffectComposer(rendererHighlight);
    composerHighlight.addPass(new RenderPass(sceneHighlight, cameraHighlight));

    const bokehPassBackground = new BokehPass(sceneBackground, cameraBackground, {
      focus: focus,
      aperture: (aperture / focalLength) * 0.05,
      maxblur: 0.01,
    });
    composerBackground.addPass(bokehPassBackground);

    const bokehPassHighlight = new BokehPass(sceneHighlight, cameraHighlight, {
      focus: focus,
      aperture: (aperture / focalLength) * 0.05,
      maxblur: 0.01,
    });
    composerHighlight.addPass(bokehPassHighlight);

    const animate = () => {
      requestAnimationFrame(animate);
      composerBackground.render();
      composerHighlight.render();
    };
    animate();
  });

  const resizeRenderer = () => {
    const width = containerBackground.offsetWidth;
    const height = containerBackground.offsetHeight;

    rendererBackground.setSize(width, height);
    rendererHighlight.setSize(width, height);

    cameraBackground.aspect = width / height;
    cameraHighlight.aspect = width / height;
      
    cameraBackground.fov = fieldOfView; // Aktualisierung des FOV
    cameraHighlight.fov = fieldOfView; // Aktualisierung des FOV

    cameraBackground.updateProjectionMatrix();
    cameraHighlight.updateProjectionMatrix();
  };
  window.addEventListener("resize", resizeRenderer);
  resizeRenderer();
};

// Getter für die aktuellen Werte
export const getThreeSceneValues = () => ({
  fieldOfView,
  focalLength,
  aperture,
  focus,
});

// Setter für die aktuellen Werte
export const setThreeSceneValues = (values) => {
    if (values.focalLength !== undefined) {
        focalLength = values.focalLength;
        fieldOfView = (3 * Math.atan((24 / 2) / focalLength)) * (180 / Math.PI);

        cameraBackground.fov = fieldOfView;
        cameraHighlight.fov = fieldOfView;

        cameraBackground.updateProjectionMatrix();
        cameraHighlight.updateProjectionMatrix();

        // Hier die Renderer explizit neu aufrufen
        resizeRenderer();
        composerBackground.render();
        composerHighlight.render();
    }
};



