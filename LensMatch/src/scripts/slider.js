export const initSliders = () => {
    // Wertearrays
    const aspectRatioValues = [
      "2.76:1", "2.39:1", "2.35:1", "2.20:1", "2:1",
      "1.85:1", "16:9", "4:3", "3:2", "1:1", "4:5", "9:16"
    ];
    const imageConeValues = [5.67, 7.03, 9.28, 8.64, 11, 21.6, 26.8, 28.2, 43.3, 55, 75];
    const focalLengthValues = [8, 10, 14, 18, 28, 35, 50, 80, 135, 200, 270, 280, 325, 400, 480, 500, 600, 800, 1000];
    const targetFocalLengthValues = [8, 10, 14, 18, 28, 35, 50, 80, 135, 200, 270, 280, 325, 400, 480, 500, 600, 800, 1000];
    const apertureValues = [0.95, 1, 1.2, 1.4, 1.8, 2, 2.8, 3.2, 3.5, 4, 4.5, 5.6, 8];
    const cropFactorValues = [7.63, 6.15, 4.66, 5.01, 3.93, 2.00, 1.61, 1.53, 1.00, 0.79, 0.58];
    const targetCropFactorValues = [7.63, 6.15, 4.66, 5.01, 3.93, 2.00, 1.61, 1.53, 1.00, 0.79, 0.58];
  
    // Synchronisation von Select und Slider
    const syncSelectAndSlider = (selectId, sliderId, values) => {
      const select = document.getElementById(selectId);
      const slider = document.getElementById(sliderId);
  
      slider.addEventListener("input", () => {
        const index = parseInt(slider.value, 10);
        select.selectedIndex = index;
        applyFocusStyle(select);
        resetOtherStyles(select);
        checkAndSyncEquivalentLensValues();
        calculateDynamicValues();
      });
  
      select.addEventListener("change", () => {
        slider.value = select.selectedIndex;
        applyFocusStyle(select);
        resetOtherStyles(select);
        checkAndSyncEquivalentLensValues();
        calculateDynamicValues();
      });
  
      const initialIndex = parseInt(slider.value, 10);
      select.selectedIndex = initialIndex;
    };
  
    // Styling für fokussierte Elemente
    const applyFocusStyle = (element) => {
      element.style.outline = "1px solid #22cce0";
      element.style.backgroundColor = "#333";
      element.style.color = "#22cce0";
    };
  
    const resetFocusStyles = () => {
      document.querySelectorAll("select, input.result, input[type='range']").forEach((element) => {
        element.style.outline = "";
        element.style.backgroundColor = "#555";
        element.style.color = "#9f9f9f";
      });
    };
  
    const resetOtherStyles = (currentElement) => {
      document.querySelectorAll("select, input.result, input[type='range']").forEach((element) => {
        if (element !== currentElement) {
          element.style.outline = "";
          element.style.backgroundColor = "#555";
          element.style.color = "#9f9f9f";
        }
      });
    };
  
    // Funktion zur Synchronisation oder Berechnung äquivalenter Werte
    const checkAndSyncEquivalentLensValues = () => {
      const cropFactorInput = parseFloat(document.getElementById("cropFactor").value);
      const targetCropFactorInput = parseFloat(document.getElementById("targetCropFactorInput").value);
  
      const focalLengthSelect = document.getElementById("focalLengthSelect");
      const targetFocalLengthSelect = document.getElementById("targetFocalLengthSelect");
      const targetFocalLengthSlider = document.getElementById("targetFocalLengthSlider");
  
      const apertureSelect = document.getElementById("apertureSelect");
      const targetApertureSelect = document.getElementById("targetApertureSelect");
      const targetApertureSlider = document.getElementById("targetApertureSlider");
  
      if (cropFactorInput === targetCropFactorInput) {
        targetFocalLengthSelect.selectedIndex = focalLengthSelect.selectedIndex;
        targetFocalLengthSlider.value = focalLengthSelect.selectedIndex;
  
        targetApertureSelect.selectedIndex = apertureSelect.selectedIndex;
        targetApertureSlider.value = apertureSelect.selectedIndex;
      } else {
        const currentFocalLength = parseFloat(focalLengthSelect.value);
        const calculatedFocalLength = currentFocalLength * (targetCropFactorInput / cropFactorInput);
  
        const currentAperture = parseFloat(apertureSelect.value);
        const calculatedAperture = currentAperture * (targetCropFactorInput / cropFactorInput);
  
        const closestFocalLengthIndex = findClosestIndex(calculatedFocalLength, targetFocalLengthValues);
        targetFocalLengthSelect.selectedIndex = closestFocalLengthIndex;
        targetFocalLengthSlider.value = closestFocalLengthIndex;
  
        const closestApertureIndex = findClosestIndex(calculatedAperture, apertureValues);
        targetApertureSelect.selectedIndex = closestApertureIndex;
        targetApertureSlider.value = closestApertureIndex;
      }
      calculateDynamicValues();
    };
  
    // Berechnung dynamischer Werte
    const calculateDynamicValues = () => {
      const focalLength = parseFloat(document.getElementById("focalLengthSelect").value);
      const aperture = parseFloat(document.getElementById("apertureSelect").value);
      const cropFactor = parseFloat(document.getElementById("cropFactor").value);
      const imageCone = parseFloat(document.getElementById("imageConeSelect").value);
  
      const apertureOpening = (focalLength / aperture).toFixed(2); // Blendenöffnung
      const maxAngle = (2 * Math.atan(imageCone / (2 * focalLength)) * (180 / Math.PI)).toFixed(2); // Maximaler Blickwinkel
      const diagonal = imageCone.toFixed(2); // Diagonale
      const realizable = cropFactor <= 1 ? "Ja" : "Nein"; // Realisierbarkeit
  
      document.getElementById("apertureOpening").textContent = `${apertureOpening} mm`;
      document.getElementById("maxAngle").textContent = `${maxAngle}°`;
      document.getElementById("diagonal").textContent = `${diagonal} mm`;
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
    };
  
    const findClosestIndex = (value, array) => {
      return array.reduce((closestIndex, currentValue, index) =>
        Math.abs(currentValue - value) < Math.abs(array[closestIndex] - value) ? index : closestIndex,
        0
      );
    };
  
    syncSelectAndSlider("aspectRatioSelect", "aspectRatioSlider", aspectRatioValues);
    syncSelectAndSlider("imageConeSelect", "imageConeSlider", imageConeValues);
    syncSelectAndSlider("focalLengthSelect", "focalLengthSlider", focalLengthValues);
    syncSelectAndSlider("apertureSelect", "apertureSlider", apertureValues);
  };
  