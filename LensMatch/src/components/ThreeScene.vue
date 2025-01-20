<template>
  <div>
    <div ref="rendererContainer" id="threeScene"></div>
  </div>
</template>

<script>
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { BokehPass } from "three/examples/jsm/postprocessing/BokehPass";
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { SepiaShader } from 'three/examples/jsm/shaders/SepiaShader';

export default {
  name: "ThreeScene",
  mounted() {
    // Benutzerdefinierte Kameraeinstellungen
    const cropFactor = 1.0; // Cropfaktor (z. B. 1.0 für Vollformat, 1.5 für APS-C)
    const aspectRatio = 16 / 9; // Seitenverhältnis
    let fieldOfView = 50; // Bildkegel in mm
    let focalLength = 50; // Brennweite in mm
    const aperture = 8; // Start-Blendenwert (realistische Werte, z. B. f/1.8 - f/16)

    // Szene, Kamera, Renderer
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x008eff);
    renderer.shadowMap.enabled = true;
    this.$refs.rendererContainer.appendChild(renderer.domElement);

    // Kamera definieren
    let camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.aspect = aspectRatio; // Seitenverhältnis setzen
    camera.position.set(-2.01, 0.32, 3.32);

    const euler = new THREE.Euler(
      THREE.MathUtils.degToRad(0),
      THREE.MathUtils.degToRad(-17.5),
      THREE.MathUtils.degToRad(0),
      "XYZ"
    );
    camera.quaternion.setFromEuler(euler);

    scene.add(camera);

    // Beleuchtung
    const ambientLight = new THREE.AmbientLight(0xffffff, 3);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048; // Schattenauflösung erhöhen
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    scene.add(directionalLight);

    const additionalLight = new THREE.PointLight(0xffffff, 10, 0);
    additionalLight.position.set(0, 5, 5);
    scene.add(additionalLight);

    const sunLight = new THREE.DirectionalLight(0xffdd88, 1.5);
    sunLight.position.set(10, 50, -10);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048; // Schattenauflösung erhöhen
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 100;
    scene.add(sunLight);

    // SepiaShader: fügt den Sepia-Look hinzu
    const sepiaPass = new ShaderPass(SepiaShader);
    sepiaPass.uniforms['amount'].value = 0.5; // Sepia-Intensität (0.0 bis 1.0)
    composer.addPass(sepiaPass);

    // GLTFLoader für das Laden der 3D-Szene
    const loader = new GLTFLoader();

    loader.load("/3D-Objekte/3D-Szene/szene.glb", (gltf) => {
      const blenderScene = gltf.scene;
      blenderScene.traverse((node) => {
        if (node.isMesh) {
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });
      scene.add(blenderScene);

      const composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));

      const bokehPass = new BokehPass(scene, camera, {
        focus: 5.729, // Standard-Fokus (realistisch angepasst)
        aperture: (aperture / focalLength) * 0.05, // Realistischere Blendenberechnung
        maxblur: 0.01, // Maximale Unschärfe
      });
      composer.addPass(bokehPass);

      // Funktion zur Anpassung der Brennweite
      const setCameraFocalLength = (newFocalLength) => {
        if (camera && newFocalLength > 0) {
          focalLength = newFocalLength;
          const fov =
            (2 * Math.atan(fieldOfView / (2 * focalLength))) * (180 / Math.PI); // Berechnung des FOV
          camera.fov = fov;
          camera.updateProjectionMatrix();
          console.log(
            `Brennweite gesetzt: ${focalLength}mm, berechnetes FOV: ${fov.toFixed(
              2
            )}°`
          );
        }
      };

      // Funktion zur Anpassung des Bildkegels
      const setCameraFieldOfView = (newFieldOfView) => {
        if (camera && newFieldOfView > 0) {
          fieldOfView = newFieldOfView;
          const fov =
            (2 * Math.atan(fieldOfView / (2 * focalLength))) * (180 / Math.PI); // Berechnung des FOV
          camera.fov = fov;
          camera.updateProjectionMatrix();
          console.log(`Bildkegel gesetzt: ${fieldOfView}mm`);
        }
      };

      // Funktion zur Anpassung der Blende
      const setCameraAperture = (apertureValue) => {
        if (apertureValue > 0) {
          bokehPass.uniforms.aperture.value = (apertureValue / focalLength) * 0.05; // Realistischer Zusammenhang
          console.log(`Blende gesetzt: f/${apertureValue}, Bokeh-Effekt angepasst.`);
        }
      };

      // Kamera-Einstellungen setzen
      setCameraFocalLength(focalLength);
      setCameraFieldOfView(fieldOfView);
      setCameraAperture(aperture);

      // Animations-Schleife
      const animate = () => {
        requestAnimationFrame(animate);
        composer.render();
        updateCameraInfo();
      };
      animate();
    });

    // Kamera-Info aktualisieren
    const updateCameraInfo = () => {
      if (camera) {
        document.getElementById("camera-position").innerText = `x: ${camera.position.x.toFixed(2)}, y: ${camera.position.y.toFixed(2)}, z: ${camera.position.z.toFixed(2)}`;
        document.getElementById("camera-rotation").innerText = `x: ${THREE.MathUtils.radToDeg(camera.rotation.x).toFixed(2)}°, y: ${THREE.MathUtils.radToDeg(camera.rotation.y).toFixed(2)}°, z: ${THREE.MathUtils.radToDeg(camera.rotation.z).toFixed(2)}°`;
      }
    };

    // Fenster-Resize-Event
    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  },
};
</script>


<style scoped>
#threeScene {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
}
</style>