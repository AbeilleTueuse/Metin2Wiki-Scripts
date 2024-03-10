function camelToKebab(str) {
  return str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

function copyProperties(source, target, allowedProps) {
  var sourceKeys = Object.keys(source);

  for (var keyIndex = 0; keyIndex < sourceKeys.length; keyIndex++) {
    var property = sourceKeys[keyIndex];
    var propValue = source[property];

    if (property === "viewBox") {
      target.setAttribute(property, propValue);
    } else if (
      property.indexOf("data") === 0 ||
      allowedProps.indexOf(property) !== -1
    ) {
      target.setAttribute(camelToKebab(property), propValue);
    }
  }
}

function createElement(
  elementsToReplace,
  elementsNS,
  allowedProperties,
  elementDataset,
  elementType
) {
  if (elementsNS.indexOf(elementType) !== -1) {
    var newElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      elementType
    );
  } else {
    var newElement = document.createElement(elementType);
  }

  var childdNodes = elementsToReplace.childNodes;

  copyProperties(elementDataset, newElement, allowedProperties);

  for (var childIndex = 0; childIndex < childdNodes.length; childIndex++) {
    newElement.appendChild(childdNodes[childIndex].cloneNode(true));
  }

  return newElement;
}

function replaceElement(
  elementsToReplace,
  allowedElements,
  elementsNS,
  allowedProperties
) {
  var elementDataset = elementsToReplace.dataset;
  var elementType = elementDataset.element;

  if (allowedElements.indexOf(elementType) !== -1) {
    var newElement = createElement(
      elementsToReplace,
      elementsNS,
      allowedProperties,
      elementDataset,
      elementType
    );

    elementsToReplace.parentNode.replaceChild(newElement, elementsToReplace);
  } else {
    elementsToReplace.remove();
  }
}

function addCollapsible(toggleButton) {
  toggleButton.setAttribute("tabindex", 0);
  var collapsibleContent = toggleButton.nextElementSibling.nextElementSibling;
  var expandedClass = "mw-collapsible-toggle-expanded";
  var isCollapsed = false;
  toggleButton.addEventListener("click", function (event) {
    if (isCollapsed) {
      this.classList.remove(expandedClass);
      collapsibleContent.style.maxHeight = null;
      collapsibleContent.style.overflow = "hidden";
    } else {
      this.classList.add(expandedClass);
      collapsibleContent.classList.remove("tabber-noactive");
      collapsibleContent.style.maxHeight =
        collapsibleContent.scrollHeight + 100 + "px";
    }
    isCollapsed = !isCollapsed;
  });
  toggleButton.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
      this.click();
    }
  });
  collapsibleContent.addEventListener("transitionend", function (event) {
    if (isCollapsed) {
      this.style.overflow = "visible";
    } else {
      this.classList.add("tabber-noactive");
    }
  });
}

(function () {
  var allowedElements = [
    "input",
    "button",
    "select",
    "option",
    "label",
    "form",
    "svg",
    "path",
    "title",
  ];
  var elementsNS = ["svg", "path", "title"];
  var allowedProperties = [
    "id",
    "class",
    "type",
    "name",
    "ariaHaspopup",
    "ariaExpanded",
    "ariaControls",
    "for",
    "min",
    "max",
    "value",
    "style",
    "pattern",
    "required",
    "selected",
    "disabled",
    "checked",
    "tabindex",
    "placeholder",
    "xmlns",
    "height",
    "viewBox",
    "width",
    "fill",
    "d",
    "title",
  ];

  var elementsToReplace = document.querySelector("div[data-element]");

  while (elementsToReplace) {
    replaceElement(
      elementsToReplace,
      allowedElements,
      elementsNS,
      allowedProperties
    );
    elementsToReplace = document.querySelector("div[data-element]");
  }

  var toggleButtons = document.querySelectorAll(
    ".improved-collapsible.custom-js > .mw-collapsible-toggle"
  );

  for (var toggleButton of toggleButtons) {
    addCollapsible(toggleButton);
  }
})();
