const syncSelectAndSlider = (selectId, sliderId, values) => {
    const select = document.getElementById(selectId);
    const slider = document.getElementById(sliderId);

    slider.addEventListener('input', () => {
        const index = parseInt(slider.value, 10);
        select.selectedIndex = index;
        applyFocusStyle(select);
    });

    select.addEventListener('change', () => {
        slider.value = select.selectedIndex;
        applyFocusStyle(select);
    });

    const initialIndex = parseInt(slider.value, 10);
    select.selectedIndex = initialIndex;
};

const applyFocusStyle = (element) => {
    element.style.outline = '1px solid #22cce0';
    element.style.backgroundColor = '#333';
    element.style.color = '#22cce0';
};

const resetFocusStyles = () => {
    document.querySelectorAll('select, input.result').forEach(element => {
        element.style.outline = '';
        element.style.backgroundColor = '#555';
        element.style.color = '#9f9f9f';
    });
};

document.addEventListener('click', (event) => {
    const isInputOrSlider = event.target.matches('select, input.result, input[type="range"]');
    if (!isInputOrSlider) {
        resetFocusStyles();
    }
});

const aspectRatioValues = [
    "2.76:1", "2.39:1", "2.35:1", "2.20:1", "2:1", 
    "1.85:1", "16:9", "4:3", "3:2", "1:1", "4:5", "9:16"
];
syncSelectAndSlider('aspectRatioSelect', 'aspectRatioSlider', aspectRatioValues);

const imageConeValues = [5.67, 7.03, 9.28, 8.64, 11, 21.6, 26.8, 28.2, 43.3, 55, 75];
syncSelectAndSlider('imageConeSelect', 'imageConeSlider', imageConeValues);

const focalLengthValues = [8, 10, 14, 18, 28, 35, 50, 80, 135, 200, 270, 280, 325, 400, 480, 500, 600, 800, 1000];
syncSelectAndSlider('focalLengthSelect', 'focalLengthSlider', focalLengthValues);

const targetFocalLengthValues = [8, 10, 14, 18, 28, 35, 50, 80, 135, 200, 270, 280, 325, 400, 480, 500, 600, 800, 1000];
syncSelectAndSlider('targetFocalLengthSelect', 'targetFocalLengthSlider', targetFocalLengthValues);

const apertureValues = [0.95, 1, 1.2, 1.4, 1.8, 2, 2.8, 3.2, 3.5, 4, 4.5, 5.6, 8];
syncSelectAndSlider('apertureSelect', 'apertureSlider', apertureValues);

const targetApertureValues = [0.95, 1, 1.2, 1.4, 1.8, 2, 2.8, 3.2, 3.5, 4, 4.5, 5.6, 8];
syncSelectAndSlider('targetApertureSelect', 'targetApertureSlider', targetApertureValues);

const cropFactorValues = [7.63, 6.15, 4.66, 5.01, 3.93, 2.00, 1.61, 1.53, 1.00, 0.79, 0.58];
const cropFactorInput = document.getElementById('cropFactor');
const cropFactorSlider = document.getElementById('cropFactorSlider');

cropFactorSlider.addEventListener('input', () => {
    const index = parseInt(cropFactorSlider.value, 10);
    if (index >= 0 && index < cropFactorValues.length) {
        cropFactorInput.value = cropFactorValues[index].toFixed(2);
        applyFocusStyle(cropFactorInput);
    }
});

cropFactorInput.addEventListener('input', () => {
    const inputValue = parseFloat(cropFactorInput.value.replace(',', '.'));
    if (!isNaN(inputValue)) {
        const closestValue = cropFactorValues.reduce((prev, curr) =>
            Math.abs(curr - inputValue) < Math.abs(prev - inputValue) ? curr : prev
        );
        const closestIndex = cropFactorValues.indexOf(closestValue);
        cropFactorSlider.value = closestIndex;
        applyFocusStyle(cropFactorInput);
    } else {
        cropFactorSlider.value = 0;
    }
});

cropFactorInput.value = cropFactorValues[parseInt(cropFactorSlider.value, 10)].toFixed(2);

const targetCropFactorValues = [7.63, 6.15, 4.66, 5.01, 3.93, 2.00, 1.61, 1.53, 1.00, 0.79, 0.58];
const targetCropFactorInput = document.getElementById('targetCropFactorInput');
const targetCropFactorSlider = document.getElementById('targetCropFactorSlider');

targetCropFactorSlider.addEventListener('input', () => {
    const index = parseInt(targetCropFactorSlider.value, 10);
    if (index >= 0 && index < targetCropFactorValues.length) {
        targetCropFactorInput.value = targetCropFactorValues[index].toFixed(2);
        applyFocusStyle(targetCropFactorInput);
    }
});

targetCropFactorInput.addEventListener('input', () => {
    const inputValue = parseFloat(targetCropFactorInput.value.replace(',', '.'));
    if (!isNaN(inputValue)) {
        const closestValue = targetCropFactorValues.reduce((prev, curr) =>
            Math.abs(curr - inputValue) < Math.abs(prev - inputValue) ? curr : prev
        );
        const closestIndex = targetCropFactorValues.indexOf(closestValue);
        targetCropFactorSlider.value = closestIndex;
        applyFocusStyle(targetCropFactorInput);
    } else {
        targetCropFactorSlider.value = 0;
    }
});

targetCropFactorInput.value = targetCropFactorValues[parseInt(targetCropFactorSlider.value, 10)].toFixed(2);