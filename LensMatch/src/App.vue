<template>
  <div class="container">
    <!-- Container 1 -->
    <div class="container1">
      <div class="left">
        <div class="lichtkegel">
          <img class="kegel" src="/public/images/Kegel_01.png" alt="Kegel">
          <img class="kegelSensor ok" src="/public/images/Kegel_und_Sensor_01.png" alt="Kegel und Sensor">
          <img class="kegelSensor nichtOk" src="/public/images/Kegel_und_Sensor_02.png" alt="Kegel und Sensor">
        </div>
        <canvas id="lensCanvas"></canvas>

      </div>
      <div class="right">
        <div ref="rendererBackground" id="threeSceneBackground"></div>
        <div class="layer overlay"></div>
        <div ref="rendererHighlight" id="threeSceneHighlight"></div>      
      </div>
    </div>

    <!-- Container 2 -->
    <div class="container2">
      <!-- Left Third -->
      <div class="third left-third">
        <div class="block">
          <div class="group">
            <h3>BILDSENSOR</h3>
          </div>
          <div class="group">
            <label for="cropFactor">Cropfaktor</label>
            <input class="result border-top" id="cropFactor" v-model="cropFactor" type="text">
            <input type="range" id="cropFactorSlider" min="0" max="10" step="1" v-model="cropFactor">
          </div>
          <div class="group">
            <label for="aspectRatio">Seitenformat</label>
            <select id="aspectRatioSelect" class="border-bottom" v-model="aspectRatio">
              <option value="2.76:1">2.76:1</option>
              <option value="2.39:1">2.39:1</option>
              <option value="2.35:1">2.35:1</option>
              <option value="2.20:1">2.20:1</option>
              <option value="2:1">2:1</option>
              <option value="1.85:1">1.85:1</option>
              <option value="16:9">16:9</option>
              <option value="4:3">4:3</option>
              <option value="3:2">3:2</option>
              <option value="1:1">1:1</option>
              <option value="4:5">4:5</option>
              <option value="9:16">9:16</option>
            </select>
            <input type="range" id="aspectRatioSlider" min="0" max="11" step="1" v-model="aspectRatio">
          </div>
          <div class="group">
            <h3>OBJEKTIV</h3>
          </div>
          <div class="group">
            <label for="imageCone">Bildkegel</label>
            <select class="border-top" id="imageConeSelect" v-model="imageCone">
              <option value="5.67">5.67 mm</option>
              <option value="7.03">7.03 mm</option>
              <option value="9.28">9.28 mm</option>
              <option value="8.64">8.64 mm</option>
              <option value="11">11 mm</option>
              <option value="21.6">21.6 mm</option>
              <option value="26.8">26.8 mm</option>
              <option value="28.2">28.2 mm</option>
              <option value="43.3">43.3 mm</option>
              <option value="55">55 mm</option>
              <option value="75">75 mm</option>
            </select>
            <input type="range" id="imageConeSlider" min="0" max="10" step="1" v-model="imageCone">
          </div>
          <div class="group">
            <label for="focalLength">Brennweite</label>
            <select id="focalLengthSelect" v-model="focalLength">
              <option value="8">8 mm</option>
              <option value="10">10 mm</option>
              <option value="14">14 mm</option>
              <option value="18">18 mm</option>
              <option value="28">28 mm</option>
              <option value="35">35 mm</option>
              <option value="50">50 mm</option>
              <option value="80">80 mm</option>
              <option value="135">135 mm</option>
              <option value="200">200 mm</option>
              <option value="270">270 mm</option>
              <option value="280">280 mm</option>
              <option value="325">325 mm</option>
              <option value="400">400 mm</option>
              <option value="480">480 mm</option>
              <option value="500">500 mm</option>
              <option value="600">600 mm</option>
              <option value="800">800 mm</option>
              <option value="1000">1000 mm</option>
            </select>
            <input type="range" id="focalLengthSlider" min="0" max="18" step="1" v-model="focalLength">
          </div>
          <div class="group">
            <label for="aperture">Blendenwert</label>
            <select class="border-bottom" id="apertureSelect" v-model="aperture">
              <option value="0.95">0.95</option>
              <option value="1">1</option>
              <option value="1.2">1.2</option>
              <option value="1.4">1.4</option>
              <option value="1.8">1.8</option>
              <option value="2">2</option>
              <option value="2.8">2.8</option>
              <option value="3.2">3.2</option>
              <option value="3.5">3.5</option>
              <option value="4">4</option>
              <option value="4.5">4.5</option>
              <option value="5.6">5.6</option>
              <option value="8">8</option>
            </select>
            <input type="range" id="apertureSlider" min="0" max="12" step="1" v-model="aperture">
          </div>
        </div>
      </div>

      <!-- Middle Third -->
      <div class="third middle-third">
        <div class="block">
          <div class="group">
            <h3>ÄQUIVALENTES OBJEKTIV</h3>
          </div>
          <div class="group">
            <label for="targetCropFactor">Ziel-Cropfaktor</label>
            <input class="result border-top" id="targetCropFactorInput" v-model="targetCropFactor" type="text">
            <input type="range" id="targetCropFactorSlider" min="0" max="10" step="1" v-model="targetCropFactor">
          </div>
          <div class="group">
            <label for="targetFocalLength">Brennweite</label>
            <select id="targetFocalLengthSelect" v-model="targetFocalLength">
              <option value="8">8 mm</option>
              <option value="10">10 mm</option>
              <option value="14">14 mm</option>
              <option value="18">18 mm</option>
              <option value="28">28 mm</option>
              <option value="35">35 mm</option>
              <option value="50">50 mm</option>
              <option value="80">80 mm</option>
              <option value="135">135 mm</option>
              <option value="200">200 mm</option>
              <option value="270">270 mm</option>
              <option value="280">280 mm</option>
              <option value="325">325 mm</option>
              <option value="400">400 mm</option>
              <option value="480">480 mm</option>
              <option value="500">500 mm</option>
              <option value="600">600 mm</option>
              <option value="800">800 mm</option>
              <option value="1000">1000 mm</option>
            </select>
            <input type="range" id="targetFocalLengthSlider" min="0" max="18" step="1" v-model="targetFocalLength">
          </div>
          <div class="group">
            <label for="targetAperture">Blendenwert</label>
            <select class="border-bottom" id="targetApertureSelect" v-model="targetAperture">
              <option value="0.95">0.95</option>
              <option value="1">1</option>
              <option value="1.2">1.2</option>
              <option value="1.4">1.4</option>
              <option value="1.8">1.8</option>
              <option value="2">2</option>
              <option value="2.8">2.8</option>
              <option value="3.2">3.2</option>
              <option value="3.5">3.5</option>
              <option value="4">4</option>
              <option value="4.5">4.5</option>
              <option value="5.6">5.6</option>
              <option value="8">8</option>
            </select>
            <input type="range" id="targetApertureSlider" min="0" max="12" step="1" v-model="targetAperture">
          </div>
        </div>
      </div>

      <!-- Right Third -->
      <div class="third right-third">
        <div class="group calculate">
          <h3>BERECHNUNGEN</h3>
        </div>
        <div class="calculation">
          <div class="left-column">
            <p>Blendenöffnung:</p>
            <p>max. Blickwinkel:</p>
            <p>Diagonale:</p>
            <p>Realisierbar:</p>
          </div>
          <div class="right-column">
            <p id="apertureOpening">10.7 cm</p>
            <p id="maxAngle">8.25°</p>
            <p id="diagonal">43.3 mm</p>
            <p id="realizable">Ja</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { BokehPass } from "three/examples/jsm/postprocessing/BokehPass";
import { initLensScene } from "@/scripts/objektiv.js";
import { initSliders } from "@/scripts/slider.js";

export default {
  data() {
    return {
      cropFactor: 1.5,
      aspectRatio: "16:9",
      imageCone: "43.3",
      focalLength: 50,
      aperture: 8,
      focus: 5.729, // Globaler Focus-Wert: 5.729 (Haus), 0.9337 (linkes von 3 Fässern), 0.387 (liegendes Fass)
    };
  },
  watch: {
    targetCropFactor(value) {
        const cropFactor = parseFloat(value);
        if (!isNaN(cropFactor)) {
            this.update3DScene(cropFactor);
        }
    }
},
methods: {
    update3DScene(cropFactor) {
        const equivalentFocalLength = this.focalLength * cropFactor;
        const equivalentAperture = this.aperture * cropFactor;

        // Update Kamera- und Bokeh-Einstellungen
        this.setCameraFocalLength(equivalentFocalLength);
        this.setCameraAperture(equivalentAperture);

        console.log(`Updated 3D Scene with CropFactor=${cropFactor}`);
  },
  updateValue(field, value) {
    console.log(`Updated ${field} to ${value}`);
    this[field] = value;
  },
},
  name: "ThreeScene",
  mounted() {
    let fieldOfView = 50; // Bildkegel in mm
    let focalLength = this.focalLength;
    const cropFactor = this.cropFactor;
    const aspectRatio = 16 / 9;
    const aperture = this.aperture;
    const focus = this.focus; // Verwenden des globalen Focus-Werts

    const rendererBackground = new THREE.WebGLRenderer({ antialias: true });
    const rendererHighlight = new THREE.WebGLRenderer({ antialias: true });

    const containerBackground = this.$refs.rendererBackground;
    const containerHighlight = this.$refs.rendererHighlight;

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

    const cameraBackground = new THREE.PerspectiveCamera(
      75,
      containerBackground.clientWidth / containerBackground.clientHeight,
      0.1,
      1000
    );
    const cameraHighlight = new THREE.PerspectiveCamera(
      75,
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
        focus: focus, // Verwenden des globalen Focus-Werts
        aperture: (aperture / focalLength) * 0.05,
        maxblur: 0.01,
      });
      composerBackground.addPass(bokehPassBackground);

      const bokehPassHighlight = new BokehPass(sceneHighlight, cameraHighlight, {
        focus: focus, // Verwenden des globalen Focus-Werts
        aperture: (aperture / focalLength) * 0.05,
        maxblur: 0.01,
      });
      composerHighlight.addPass(bokehPassHighlight);

      const setCameraFocalLength = (newFocalLength) => {
        if (cameraBackground && newFocalLength > 0) {
          focalLength = newFocalLength;
          const fov =
            (2 * Math.atan(fieldOfView / (2 * focalLength))) * (180 / Math.PI);
          cameraBackground.fov = fov;
          cameraHighlight.fov = fov;
          cameraBackground.updateProjectionMatrix();
          cameraHighlight.updateProjectionMatrix();
        }
      };

      const setCameraFieldOfView = (newFieldOfView) => {
        if (cameraBackground && newFieldOfView > 0) {
          fieldOfView = newFieldOfView;
          const fov =
            (2 * Math.atan(fieldOfView / (2 * focalLength))) * (180 / Math.PI);
          cameraBackground.fov = fov;
          cameraHighlight.fov = fov;
          cameraBackground.updateProjectionMatrix();
          cameraHighlight.updateProjectionMatrix();
        }
      };

      const setCameraAperture = (apertureValue) => {
        if (apertureValue > 0) {
          bokehPassBackground.uniforms.aperture.value =
            (apertureValue / focalLength) * 0.05;
          bokehPassHighlight.uniforms.aperture.value =
            (apertureValue / focalLength) * 0.05;
        }
      };

      const setCameraFocus = (focusValue) => {
        this.focus = focusValue; // Aktualisieren des globalen Focus-Werts
        bokehPassBackground.uniforms.focus.value = focusValue;
        bokehPassHighlight.uniforms.focus.value = focusValue;
      };

      setCameraFocalLength(focalLength);
      setCameraFieldOfView(fieldOfView);
      setCameraAperture(aperture);
      setCameraFocus(focus);

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

      cameraBackground.updateProjectionMatrix();
      cameraHighlight.updateProjectionMatrix();
    };
    window.addEventListener("resize", resizeRenderer);
    resizeRenderer();

    initLensScene("lensCanvas");
    initSliders();
  },
};
</script>
