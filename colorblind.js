class SpawnLayerManager {
  static SPAWN_COLOR_KEY = "mt2.spawn.color";
  static OPTION_MAPPING = {
    0: "🟥 Rouge",
    50: "🟫 Marron",
    140: "🟩 Vert",
    230: "🟦 Bleu",
    290: "🟪 Violet",
    black: "⬛ Noir",
    white: "⬜ Blanc",
  };
  static STYLE_MAPPING = {
    position: "absolute",
    top: "0",
    left: "0",
    margin: "4px",
    background: "#434242b3",
    color: "white",
    borderRadius: "5px",
    cursor: "pointer",
    border: "1px white solid",
  };

  constructor(containerSelector = ".spawn-map-container") {
    this.containerSelector = containerSelector;
    this.currentFilter = null;
    this.selects = [];
    this.spawnLayers = [];
    this.isClipboardImageSupported = this._isClipboardImageSupported();
    this._initialize();
  }

  _isClipboardImageSupported() {
    return !!(navigator.clipboard?.write && window.ClipboardItem);
  }

  _initialize() {
    const containers = this._getContainers();
    if (!containers.length) return;

    containers.forEach((container) => this._setupContainer(container));

    const savedColor = this._getSavedColor();
    if (savedColor) this._applyColor(savedColor);
  }

  _getContainers() {
    return document.querySelectorAll(this.containerSelector);
  }

  _getSavedColor() {
    return localStorage.getItem(SpawnLayerManager.SPAWN_COLOR_KEY);
  }

  _saveColor(value) {
    localStorage.setItem(SpawnLayerManager.SPAWN_COLOR_KEY, value);
  }

  _setupContainer(container) {
    const [mapContainer, spawnContainer] = container.children;

    if (!mapContainer || !spawnContainer) return;

    const map = mapContainer.querySelector("img");
    const spawnLayer = spawnContainer.querySelector("img");

    if (!map || !spawnLayer) return;

    const select = this._createColorSelect();
    spawnContainer.appendChild(select);

    this.selects.push(select);
    this.spawnLayers.push(spawnLayer);

    select.addEventListener("change", (e) => this._onColorChange(e));

    if (this.isClipboardImageSupported) {
      this._setupCopyButton(spawnContainer, map, spawnLayer);
    }
  }

  _createColorSelect() {
    const select = document.createElement("select");

    for (const [value, label] of Object.entries(
      SpawnLayerManager.OPTION_MAPPING
    )) {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = label;
      select.appendChild(option);
    }

    Object.assign(select.style, SpawnLayerManager.STYLE_MAPPING);
    return select;
  }

  _onColorChange(event) {
    const value = event.target.value;
    this._applyColor(value);
  }

  _applyColor(value) {
    if (!SpawnLayerManager.OPTION_MAPPING.hasOwnProperty(value)) return;

    const filter = this._getFilterForValue(value);
    this.currentFilter = filter;

    this.selects.forEach((select) => (select.value = value));
    this.spawnLayers.forEach((layer) => (layer.style.filter = filter));
    this._saveColor(value);
  }

  _getFilterForValue(value) {
    switch (value) {
      case "black":
        return "invert(1) brightness(0) contrast(100%)";
      case "white":
        return "invert(1) sepia(1) saturate(100%) brightness(3)";
      default:
        return `hue-rotate(${value}deg)`;
    }
  }

  _setupCopyButton(spawnContainer, map, spawnLayer) {
    const copyButton = spawnContainer.querySelector(".copy-to-clipboard");

    if (!copyButton) return;

    const defaultEmoji = copyButton.querySelector("[data-default]");
    const clickedEmoji = copyButton.querySelector("[data-clicked]");

    if (!defaultEmoji || !clickedEmoji) return;

    showElement(copyButton);

    copyButton.addEventListener("click", () => {
      this._copyCombinedImageToClipboard(map, spawnLayer);
      this._copyAnimation(defaultEmoji, clickedEmoji);
    });
  }

  _copyCombinedImageToClipboard(map, spawnLayer) {
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(map.naturalWidth, spawnLayer.naturalWidth);
    canvas.height = Math.max(map.naturalHeight, spawnLayer.naturalHeight);

    const ctx = canvas.getContext("2d");
    ctx.drawImage(map, 0, 0);

    const filteredLayer = this._drawFilteredLayer(spawnLayer);
    ctx.drawImage(filteredLayer, 0, 0);

    this._copyCanvasContentsToClipboard(canvas);
  }

  _drawFilteredLayer(layer) {
    const canvas = document.createElement("canvas");
    canvas.width = layer.naturalWidth;
    canvas.height = layer.naturalHeight;

    const ctx = canvas.getContext("2d");
    ctx.filter = this.currentFilter || "none";
    ctx.drawImage(layer, 0, 0);

    return canvas;
  }

  async _getBlobFromCanvas(canvas) {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Canvas toBlob failed"));
        }
      });
    });
  }

  async _copyCanvasContentsToClipboard(canvas) {
    try {
      const blob = await this._getBlobFromCanvas(canvas);
      const data = [new ClipboardItem({ [blob.type]: blob })];
      await navigator.clipboard.write(data);
    } catch (error) {
      console.error(error);
    }
  }

  _copyAnimation(defaultEmoji, clickedEmoji) {
    hideElement(defaultEmoji);
    showElement(clickedEmoji);

    setTimeout(() => {
      hideElement(clickedEmoji);
      showElement(defaultEmoji);
    }, 1500);
  }
}

new SpawnLayerManager();
