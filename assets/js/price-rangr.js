  
(function ($) {
    "use strict";

    $(document).ready(function () {
        // Only run if the slider container is present
        const sliderTrack = document.getElementById('slider-track');
        if (!sliderTrack) return;

        const rangeMin = document.getElementById('range-min');
        const rangeMax = document.getElementById('range-max');
        const tooltipMin = document.getElementById('tooltip-min');
        const tooltipMax = document.getElementById('tooltip-max');

        // Check all required elements inside the slider
        if (!rangeMin || !rangeMax || !tooltipMin || !tooltipMax) return;

        function updateSlider(event) {
            let minVal = parseInt(rangeMin.value);
            let maxVal = parseInt(rangeMax.value);

            // Prevent overlap
            if (maxVal - minVal <= 50) {
                if (event?.target?.id === "range-min") {
                    rangeMin.value = maxVal - 50;
                } else {
                    rangeMax.value = minVal + 50;
                }
                minVal = parseInt(rangeMin.value);
                maxVal = parseInt(rangeMax.value);
            }

            const percentMin = (minVal / 1000) * 100;
            const percentMax = (maxVal / 1000) * 100;

            // Set background and tooltip positions
            sliderTrack.style.background = `linear-gradient(to right, #ddd ${percentMin}%, #0066ff ${percentMin}%, #0066ff ${percentMax}%, #ddd ${percentMax}%)`;

            tooltipMin.innerText = `$${minVal}`;
            tooltipMax.innerText = `$${maxVal}`;
            tooltipMin.style.left = `calc(${percentMin}% - 20px)`;
            tooltipMax.style.left = `calc(${percentMax}% - 20px)`;
        }

        // Initial update
        updateSlider();

        // Event listeners
        rangeMin.addEventListener("input", updateSlider);
        rangeMax.addEventListener("input", updateSlider);
    });
})(jQuery);
