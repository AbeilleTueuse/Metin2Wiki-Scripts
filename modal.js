const SPAWN_LAYER_COLOR = "spawnLayerColor";

function createModalInteraction(content) {
    const boutonModal = content.querySelector(".button");
    const modalContent = content.querySelector(".modal");
    const boutonClose = content.querySelector(".close");

    const openModal = () => {
        boutonModal.classList.add("tabber-active");
        modalContent.classList.add("gen-active");
        window.addEventListener("click", handleClickOutside);
    };

    const closeModal = () => {
        boutonModal.classList.remove("tabber-active");
        modalContent.classList.remove("gen-active");
        window.removeEventListener("click", handleClickOutside);
    };

    const handleClickOutside = (event) => {
        if (event.target === modalContent) {
            closeModal();
        }
    };

    boutonModal.addEventListener("click", openModal);
    boutonClose.addEventListener("click", closeModal);
}

function changeSpawnLayerColor(value, selects, spawnLayers, optionMapping) {
    if (!optionMapping.hasOwnProperty(value)) {
        return;
    }

    let filter;

    if (value === "black") {
        filter = "invert(1) brightness(0) contrast(100%)";
    } else if (value === "white") {
        filter = "invert(1) sepia(1) saturate(100%) brightness(3)";
    } else {
        filter = `hue-rotate(${value}deg)`;
    }

    selects.forEach(select => select.value = value);
    spawnLayers.forEach(spawnLayer => spawnLayer.style.filter = filter);

    localStorage.setItem(SPAWN_LAYER_COLOR, value);
}

function createSelectColor(optionMapping, styleMapping) {
    const select = document.createElement("select");
    Object.entries(optionMapping).forEach(([key, value]) => {
        const option = document.createElement("option");
        option.value = key;
        option.textContent = value;
        select.appendChild(option);
    });
    Object.entries(styleMapping).forEach(([property, value]) => {
        select.style[property] = value;
    });

    return select;
}

function initializeSpawnLayers(spawnLayerContainers) {
    const optionMapping = {
        0: "🟥 Rouge",
        50: "🟫 Marron",
        140: "🟩 Vert",
        230: "🟦 Bleu",
        290: "🟪 Violet",
        black: "⬛ Noir",
        white: "⬜ Blanc"
    }
    const styleMapping = {
        position: "absolute",
        left: "0",
        margin: "0",
        background: "#434242b3",
        color: "white",
        borderRadius: "5px",
    }

    const selects = [];
    const spawnLayers = [];
    const spawnLayerColor = localStorage.getItem(SPAWN_LAYER_COLOR);

    spawnLayerContainers.forEach((spawnLayerContainer) => {
        const selectColor = createSelectColor(optionMapping, styleMapping);
        const spawnLayer = spawnLayerContainer.querySelector("img");

        spawnLayerContainer.appendChild(selectColor);
        selects.push(selectColor);
        spawnLayers.push(spawnLayer);
    });

    const handleChange = (event) => {
        changeSpawnLayerColor(event.target.value, selects, spawnLayers, optionMapping);
    };

    selects.forEach(select => {
        select.addEventListener("change", handleChange);
    });

    if (spawnLayerColor) {
        changeSpawnLayerColor(spawnLayerColor, selects, spawnLayers, optionMapping);
    }
}

(() => {
    const modalContainers = document.querySelectorAll("div#mw-content-text div.modalContainer");
    const spawnLayerContainers = content.querySelectorAll("div.modalContainer .spawn-layer");

    modalContainers.forEach(createModalInteraction);

    if (spawnLayerContainers.length) {
        initializeSpawnLayers(spawnLayerContainers);
    }
})();
