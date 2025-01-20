<template>
  <div class="container">
    <!-- Container 1 -->
    <div class="container1">
      <div class="left">
        <div class="lichtkegel">
          <img class="kegel" src="/public/images/Kegel_01.png" alt="Kegel">
          <img class="kegelSensor ok" src="/public/images/Kegel_v2/Kegel_und_Sensor_01.png" alt="Kegel und Sensor">
          <img class="kegelSensor nichtOk" src="/public/images/Kegel_v2/Kegel_und_Sensor_02.png" alt="Kegel und Sensor">
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
            <input class="result border-top" id="cropFactor" v-model="cropFactor" type="text" />
            <input type="range" id="cropFactorSlider" min="0" max="10" step="1" v-model="cropFactorSliderValue" />
          </div>

          <div class="group">
            <label for="aspectRatio">Seitenformat</label>
            <select id="aspectRatioSelect" v-model="aspectRatio" class="border-bottom">
              <option v-for="(value, index) in aspectRatioValues" :key="index" :value="value">{{ value }}</option>
            </select>
            <input type="range" id="aspectRatioSlider" min="0" :max="aspectRatioValues.length - 1" step="1" v-model="aspectRatioSliderValue" />
          </div>

          <div class="group">
            <h3>OBJEKTIV</h3>
          </div>
          <div class="group">
            <label for="imageCone">Bildkegel</label>
            <select id="imageConeSelect" v-model="imageCone" class="border-top">
              <option v-for="(value, index) in imageConeValues" :key="index" :value="value">{{ value }} mm</option>
            </select>
            <input type="range" id="imageConeSlider" min="0" :max="imageConeValues.length - 1" step="1" v-model="imageConeSliderValue" />
          </div>
          <div class="group">
            <label for="focalLength">Brennweite</label>
            <select id="focalLengthSelect" v-model="focalLength">
              <option v-for="(value, index) in focalLengthValues" :key="index" :value="value">{{ value }} mm</option>
            </select>
            <input type="range" id="focalLengthSlider" min="0" :max="focalLengthValues.length - 1" step="1" v-model="focalLengthSliderValue" />
          </div>
          <div class="group">
            <label for="aperture">Blendenwert</label>
            <select id="apertureSelect" v-model="aperture" class="border-bottom">
              <option v-for="(value, index) in apertureValues" :key="index" :value="value">{{ value }}</option>
            </select>
            <input type="range" id="apertureSlider" min="0" :max="apertureValues.length - 1" step="1" v-model="apertureSliderValue" />
          </div>
        </div>
      </div>
      <div class="third middle-third">
          <div class="block">
              <div class="group">
                  <h3>ÄQUIVALENTES OBJEKTIV</h3>
              </div>
              <div class="group">
                  <label for="targetCropFactor">Ziel-Cropfaktor</label>
                  <input class="result border-top" id="targetCropFactorInput" value="1.00" type="text">
                  <input type="range" id="targetCropFactorSlider" min="0" max="10" step="1" value="8">
              </div>
              <div class="group">
                  <label for="targetFocalLength">Brennweite</label>
                  <select id="targetFocalLengthSelect">
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
                  <input type="range" id="targetFocalLengthSlider" min="0" max="18" step="1" value="9">
              </div>
              <div class="group">
                  <label for="targetAperture">Blendenwert</label>
                  <select id="targetApertureSelect" class="border-bottom">
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
                      <option value="5.6" selected>5.6</option>
                      <option value="8">8</option>
                  </select>
                  <input type="range" id="targetApertureSlider" min="0" max="12" step="1" value="11">
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
import { initializeThreeScene, getThreeSceneValues } from "@/scripts/threeScene.js"; // Korrekt importieren
import { initLensScene } from "@/scripts/objektiv.js";
import { initSliders } from "@/scripts/slider.js";

export default {
  data() {
    // Abrufen der zentral definierten Werte aus threeScene.js
    const { fieldOfView, focalLength, aperture } = getThreeSceneValues();

    return {
      cropFactor: 1,
      cropFactorSliderValue: 8,
      aspectRatio: "16:9",
      aspectRatioSliderValue: 6,
      imageCone: fieldOfView.toString(),
      imageConeSliderValue: 8,
      focalLength: focalLength,
      focalLengthSliderValue: 9,
      aperture: aperture,
      apertureSliderValue: 11,

      // Wertearrays
      aspectRatioValues: ["2.76:1", "2.39:1", "2.35:1", "2.20:1", "2:1", "1.85:1", "16:9", "4:3", "3:2", "1:1", "4:5", "9:16"],
      imageConeValues: [5.67, 7.03, 9.28, 8.64, 11, 21.6, 26.8, 28.2, 43.3, 55, 75],
      focalLengthValues: [8, 10, 14, 18, 28, 35, 50, 80, 135, 200, 270, 280, 325, 400, 480, 500, 600, 800, 1000],
      apertureValues: [0.95, 1, 1.2, 1.4, 1.8, 2, 2.8, 3.2, 3.5, 4, 4.5, 5.6, 8],

      calculatedDiagonal: null, // Berechnete Diagonale
    };
  },
  watch: {
    cropFactorSliderValue(val) {
      const cropFactorMapping = [7.63, 6.15, 4.66, 5.01, 3.93, 2.0, 1.61, 1.53, 1.0, 0.79, 0.58];
      this.cropFactor = cropFactorMapping[val] || this.cropFactor;
    },
    cropFactor(val) {
      this.updateCalculations();
    },
    aspectRatioSliderValue(val) {
      this.aspectRatio = this.aspectRatioValues[val] || this.aspectRatio;
    },
    aspectRatio(val) {
      this.updateCalculations();
    },
    imageConeSliderValue(val) {
      this.imageCone = this.imageConeValues[val] || this.imageCone;
    },
    imageCone(val) {
      this.updateCalculations();
    },
    focalLengthSliderValue(val) {
      this.focalLength = this.focalLengthValues[val] || this.focalLength;
    },
    focalLength(val) {
      this.updateCalculations();
    },
    apertureSliderValue(val) {
      this.aperture = this.apertureValues[val] || this.aperture;
    },
    aperture(val) {
      this.updateCalculations();
    },
    focalLength(val) {
    this.updateCalculations();
    setThreeSceneValues({ focalLength: val }); // Aktualisiere die Szene
},

  },
  methods: {
    updateCalculations() {
      const apertureOpening = (this.focalLength / this.aperture).toFixed(2);

      const benchmarkDiagonal = 12 * Math.sqrt(13);
      const calculatedDiagonal = benchmarkDiagonal / this.cropFactor;
      const maxAngle = (
        2 *
        Math.atan(calculatedDiagonal / (2 * this.focalLength)) *
        (180 / Math.PI)
      ).toFixed(2);

      this.calculatedDiagonal = calculatedDiagonal.toFixed(2);

      const realizable = parseFloat(apertureOpening) >= parseFloat(this.calculatedDiagonal) ? "Ja" : "Nein";

      document.getElementById("apertureOpening").textContent = `${apertureOpening} mm`;
      document.getElementById("maxAngle").textContent = `${maxAngle}°`;
      document.getElementById("diagonal").textContent = `${this.calculatedDiagonal} mm`;
      document.getElementById("realizable").textContent = realizable;

      const okImage = document.querySelector(".kegelSensor.ok");
      const notOkImage = document.querySelector(".kegelSensor.nichtOk");

      if (realizable === "Ja") {
        okImage.style.display = "block";
        notOkImage.style.display = "none";
      } else {
        okImage.style.display = "none";
        notOkImage.style.display = "block";
      }
    },
  },
  mounted() {
    initializeThreeScene(this.$refs, this.$data);
    initLensScene("lensCanvas");
    initSliders(this);
    this.updateCalculations(); // Initiale Berechnung
  },
};
</script>
