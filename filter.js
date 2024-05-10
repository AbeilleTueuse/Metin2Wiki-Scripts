function hideElement(element) {
  element.classList.add("tabber-noactive");
}

function showElement(element) {
  element.classList.remove("tabber-noactive");
}

function removeAccent(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function toNormalForm(str) {
  return removeAccent(str).replace(/[^a-zA-Z0-9 ]/g, "");
}

function addValueToObject(object, key, value) {
  if (object[key]) {
    object[key].push(value);
  } else {
    object[key] = [value];
  }
}

function loading() {
  var mainContainer = document.getElementById("hide-all");
  var loadingAnimation = document.getElementById("loading-animation");

  mainContainer.classList.remove("tabber-noactive");
  loadingAnimation.classList.add("tabber-noactive");
}

function handleDropdowns(filterInformation) {
  var form = filterInformation.form;
  var activeButton = null;

  function toggleDropdown(button, dropdownMenu) {
    if (button === activeButton) {
      hideElement(dropdownMenu);
      activeButton = null;
    } else {
      if (activeButton) {
        hideElement(activeButton.nextElementSibling);
      }
      showElement(dropdownMenu);
      activeButton = button;
    }
  }

  function closeDropdowns() {
    if (activeButton) {
      hideElement(activeButton.nextElementSibling);
      activeButton = null;
    }
  }

  form.addEventListener("click", function (event) {
    var target = event.target;
    var button = target.closest("button");

    if (button) {
      var dropdownMenu = button.nextElementSibling;

      toggleDropdown(button, dropdownMenu);
    } else if (!target.closest(".dropdown-menu")) {
      closeDropdowns();
    }
  });

  document.addEventListener("mousedown", function (event) {
    if (!form.contains(event.target)) {
      closeDropdowns();
    }
  });
}

function incrementCounter(counterElement, counterValue) {
  if (counterValue === 0) {
    showElement(counterElement);
  }

  counterElement.textContent = counterValue + 1;
}

function decrementCounter(counterElement, counterValue) {
  if (counterValue === 1) {
    hideElement(counterElement);
  }

  counterElement.textContent = counterValue - 1;
}

function filterItems(filterInformation, cardInformation) {
  function showCounter() {
    var checkbox = filterInformation.checkbox;

    for (var filterName in checkbox) {
      var values = checkbox[filterName].values;

      for (var filterValue in values) {
        var span = values[filterValue].span;

        span.textContent = " (" + values[filterValue].value + ")";
        values[filterValue].value = 0;
      }
    }
  }

  function addCount(cardParameters, checkboxNames, parameter) {
    cardParameters[parameter].split(" ").forEach(function (cardValue) {
      checkboxNames[parameter].values[cardValue].value += 1;
    });
  }

  function isObjectValuesInRangeFilter(parameters, rangeFilter) {
    return Object.keys(rangeFilter).every(function (property) {
      var propertyValue = parameters[property];
      return (
        rangeFilter[property].min <= propertyValue &&
        rangeFilter[property].max >= propertyValue
      );
    });
  }

  function filterByName(parameters, filterName) {
    if (filterName) {
      return parameters.name.indexOf(filterName) !== -1;
    }
    return true;
  }

  function isObjectValuesInFilter(parameters, filter) {
    return Object.keys(filter).every(function (property) {
      return parameters[property].split(" ").some(function (value) {
        return filter[property].indexOf(value) !== -1;
      });
    });
  }

  function isObjectValuesInFilters(
    parameters,
    filter,
    rangeFilter,
    filterName
  ) {
    return (
      isObjectValuesInFilter(parameters, filter) &&
      filterByName(parameters, filterName) &&
      isObjectValuesInRangeFilter(parameters, rangeFilter)
    );
  }

  var filter = filterInformation.filters.filter;
  var rangeFilter = filterInformation.filters.rangeFilter;
  var filterName = filterInformation.filters.filterName;
  var checkboxNames = filterInformation.checkbox;
  var listToFilter = cardInformation.listToFilter.children;
  var cardData = cardInformation.data;

  if (filterInformation.reverse) {
    var parent = cardInformation.listToFilter;
    for (
      var reverseIndex = 1;
      reverseIndex < listToFilter.length;
      reverseIndex++
    ) {
      parent.insertBefore(listToFilter[reverseIndex], parent.firstChild);
    }
    cardInformation.data.reverse();
    filterInformation.reverse = false;
  }

  for (var cardIndex = 0; cardIndex < listToFilter.length; cardIndex++) {
    var card = listToFilter[cardIndex];
    var cardParameters = cardData[cardIndex];
    if (
      isObjectValuesInFilters(cardParameters, filter, rangeFilter, filterName)
    ) {
      showElement(card);
      for (var parameter in checkboxNames) {
        addCount(cardParameters, checkboxNames, parameter);
      }
    } else {
      hideElement(card);
    }
  }
  showCounter();
}

function updateFilterObject(filterInformation, cardInformation) {
  function updateFilter(event, filterByName = false) {
    function handleNumberType(target) {
      var [filterName, extremum] = target.id.split("-");
      var currentValue = Number(target.value);
      var counterElement = filterInformation.range[filterName].counter;
      var counterValue = Number(counterElement.textContent);
      var initialRange = filterInformation.range[filterName].init;
      var rangeFilter = filterInformation.filters.rangeFilter;

      if (rangeFilter[filterName]) {
        rangeFilter[filterName][extremum] = currentValue;
      } else {
        incrementCounter(counterElement, counterValue);
        rangeFilter[filterName] = {
          min: initialRange.min,
          max: initialRange.max,
        };
        rangeFilter[filterName][extremum] = currentValue;
      }
      if (
        rangeFilter[filterName].max === initialRange.max &&
        rangeFilter[filterName].min === initialRange.min
      ) {
        decrementCounter(counterElement, counterValue);
        delete rangeFilter[filterName];
      }
    }

    function handleCheckbox(target) {
      var filterName = target.id.split("-")[0];
      var filter = filterInformation.filters.filter;
      var filterValue = target.dataset.filter;
      var counterElement = filterInformation.checkbox[filterName].counter;
      var counterValue = Number(counterElement.textContent);

      if (target.checked) {
        incrementCounter(counterElement, counterValue);
        addValueToObject(filter, filterName, filterValue);
      } else {
        decrementCounter(counterElement, counterValue);
        var index = filter[filterName].indexOf(filterValue);
        if (index !== -1) {
          if (filter[filterName].length === 1) {
            delete filter[filterName];
          } else {
            filter[filterName].splice(index, 1);
          }
        }
      }
    }

    var target = event.target;

    if (filterByName) {
      filterInformation.filters.filterName = toNormalForm(target.value);
    } else {
      var type = target.type;

      if (type === "number") {
        handleNumberType(target);
      } else if (type === "checkbox") {
        if (target.id === "filter-reverse") {
          filterInformation.reverse = true;
        } else {
          handleCheckbox(target);
        }
      }
    }
    filterItems(filterInformation, cardInformation);
  }

  var form = filterInformation.form;
  var debounceTimer;

  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  form.addEventListener("change", function (event) {
    updateFilter(event);
  });

  form.addEventListener("input", function (event) {
    if (event.target.id === "filter-name") {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function () {
        updateFilter(event, true);
      }, 500);
    }
  });
}

function filterInitialization() {
  function createSpan() {
    var span = document.createElement("span");
    span.style.color = "#9F9F9F";
    span.style.fontSize = "12px";
    return span;
  }

  function handlefilterParameters(filterParameters, param, filterName) {
    if (param === "levels") {
      addValueToObject(filterParameters, "levels", filterName);
    } else if (param.startsWith("replace_")) {
      var replace = param.split("replace_")[1].replace("_", " ");

      if (!filterParameters["replace"]) {
        filterParameters["replace"] = {};
      }
      filterParameters["replace"][filterName] = { value: replace };
    } else if (param === "elem") {
      filterParameters["elem"] = filterName;
    }
  }

  var form = document.getElementById("filter-form");
  var filters = { filterName: "", filter: {}, rangeFilter: {} };
  var filterInformation = {
    form: form,
    filters: filters,
    range: {},
    checkbox: {},
    reverse: false,
  };
  var allButton = form.querySelectorAll("button");
  var filterParameters = {};

  allButton.forEach(function (button) {
    var buttonSibling = button.nextElementSibling;

    if (!buttonSibling) return;

    var filterName = buttonSibling.id;
    var counter = buttonSibling.nextElementSibling;
    var param = buttonSibling.dataset.param;

    if (!filterName || !counter || !param) return;

    var infoType = filterName.endsWith("-range") ? "range" : "checkbox";
    var filterName = filterName.replace("-range", "");
    var filterObj = (filterInformation[infoType][filterName] = {
      counter: counter,
    });

    handlefilterParameters(filterParameters, param, filterName);

    if (infoType === "checkbox") {
      filterObj.values = {};
      var allInput = buttonSibling.querySelectorAll("input");
      allInput.forEach(function (input) {
        var filterValue = input.dataset.filter;

        if (!filterValue) return;

        var span = createSpan();
        input.parentElement.appendChild(span);
        filterObj.values[filterValue] = { value: 0, span: span };
      });
    } else if (infoType === "range") {
      filterObj.init = {};
      filterObj.init.min = Number(buttonSibling.children[0].firstChild.min);
      filterObj.init.max = Number(buttonSibling.children[0].firstChild.max);
    }
  });

  return [filterInformation, filterParameters];
}

function getCardInformation(filterParameters) {
  function createDataSelector(name) {
    return "[data-" + name + "]";
  }

  var listToFilter = document.getElementById("list-to-filter");
  var listToFilterChildren = listToFilter.children;
  var allCardInformation = [];
  var filterLevelsNames = filterParameters["levels"];
  var filterWithReplace = filterParameters["replace"];
  var filterElementName = filterParameters["elem"];

  if (filterLevelsNames) {
    var [level0, level1] = filterLevelsNames;
    var levelsSelector = createDataSelector(level0);
  }

  if (filterWithReplace) {
    for (var replaceName in filterWithReplace) {
      filterWithReplace[replaceName].selector = createDataSelector(replaceName);
    }
  }

  if (filterElementName) {
    var elementSelector = createDataSelector(filterElementName);
  }

  for (
    var cardIndex = 0;
    cardIndex < listToFilterChildren.length;
    cardIndex++
  ) {
    var card = listToFilterChildren[cardIndex];
    var cardInformation = {};
    var cardNameElement = card.querySelector("[data-name]");
    cardInformation.name = toNormalForm(cardNameElement.textContent);
    cardInformation.trueName = cardNameElement.firstChild.title;

    if (filterLevelsNames) {
      var levelsElement = card.querySelector(levelsSelector);
      var [levelValue0, levelValue1] = levelsElement.textContent
        .slice(1, -1)
        .split(", ");
      cardInformation[level0] = Number(levelValue0);
      cardInformation[level1] = removeAccent(levelValue1);
    }

    if (filterElementName) {
      var elementChild = card.querySelector(elementSelector).children;
      var elementValue = "";
      if (elementChild.length) {
        for (
          var elementIndex = 0;
          elementIndex < elementChild.length;
          elementIndex++
        ) {
          elementValue += elementChild[elementIndex].title + " ";
        }
      }
      elementValue = elementValue.trim() || "Aucun";
      cardInformation[filterElementName] = removeAccent(elementValue);
    }

    if (filterWithReplace) {
      for (var replaceName in filterWithReplace) {
        var replaceInformation = filterWithReplace[replaceName];
        var replaceValue = card
          .querySelector(replaceInformation.selector)
          .textContent.replace(replaceInformation.value, "");
        cardInformation[replaceName] = removeAccent(replaceValue);
      }
    }

    allCardInformation.push(cardInformation);
  }
  allCardInformation = { listToFilter: listToFilter, data: allCardInformation };

  return allCardInformation;
}

function editCardInformation(cardInformation) {
  var listToFilterChildren = cardInformation.listToFilter.children;

  for (
    var cardIndex = 0;
    cardIndex < listToFilterChildren.length;
    cardIndex++
  ) {
    var card = listToFilterChildren[cardIndex];
    var cardName = card.querySelector("[data-name]").textContent;
    cardInformation.data[cardIndex].name = toNormalForm(cardName);
  }
}

function observeLanguageChange(cardInformation) {
  var filterName = document.getElementById("filter-name");

  if (!filterName) {
    return;
  }

  var observer = new MutationObserver(function (mutation) {
    editCardInformation(cardInformation);
  });

  observer.observe(filterName, { attributes: true });
}

function getSavedMonsters() {
  var savedMonsters = localStorage.getItem("savedMonstersCalculator");

  if (savedMonsters) {
    return JSON.parse(savedMonsters);
  }
  return [];
}

function writeMonster(monsterVnum) {
  localStorage.setItem("newMonsterCalculator", monsterVnum);
}

function handleDamageSimulator(cardInformation) {
  var addMonster = document.getElementById("add-monster");
  var cardToEdit = cardInformation.listToFilter.children;
  var cardData = cardInformation.data;
  var savedMonsters = getSavedMonsters();

  addMonster.removeAttribute("id");
  addMonster = addMonster.parentElement;
  addMonster.classList.remove("tabber-noactive");

  var nameToVnum = {};
  var monsterParametersLength = monsterData[101].length;

  for (monsterVnum in monsterData) {
    nameToVnum[monsterData[monsterVnum][monsterParametersLength - 1]] =
      monsterVnum;
  }

  for (var cardIndex = 0; cardIndex < cardToEdit.length; cardIndex++) {
    var card = cardToEdit[cardIndex];
    var cardName = cardData[cardIndex].trueName;

    if (!nameToVnum.hasOwnProperty(cardName)) {
      continue;
    }

    var addMonsterClone = addMonster.cloneNode(true);
    var monsterVnum = nameToVnum[cardName];

    addMonsterClone.dataset.monsterId = monsterVnum;
    card.lastElementChild.appendChild(addMonsterClone);

    if (savedMonsters.indexOf(monsterVnum) !== -1) {
        addMonsterClone.firstChild.classList.add("svg-delete-monster");
    }
  }

  addMonster.remove();
  var addMonsterText = "Ajouter ce monstre au simulateur de dégâts";
  var deleteMonsterText = "Supprimer ce monstre du simulateur de dégâts";

  document.addEventListener("click", function (event) {
    var target = event.target.closest(".add-monster");

    if (target) {
      var savedMonsters = getSavedMonsters();
      var monsterVnum = target.dataset.monsterId;
      target = target.firstChild;

      if (target.classList.contains("svg-delete-monster")) {
        // delete monster
        target.firstChild.textContent = addMonsterText;

        var monsterIndex = savedMonsters.indexOf(monsterVnum);

        if (monsterIndex !== -1) {
          writeMonster("-" + monsterVnum);
        } else {
          writeMonster(0);
        }
      } else {
        // add monster
        target.firstChild.textContent = deleteMonsterText;

        if (savedMonsters.indexOf(monsterVnum) === -1) {
          writeMonster(monsterVnum);
        } else {
          writeMonster(0);
        }
      }

      target.classList.toggle("svg-delete-monster");
    }
  });
}

function filterWithUrl(filterInformation, cardInformation) {
  function processParameter(key, value, filters) {
    if (key === "name") {
      var filterName = document.getElementById("filter-name");
      filterName.value = toNormalForm(value);
      filters.filterName = value;
    } else if (Object.keys(filterInformation.checkbox).indexOf(key) !== -1) {
      var checkboxElement = document.getElementById(key + "-" + value);
      if (!checkboxElement) return;
      var counterElement = filterInformation.checkbox[key].counter;
      var counterValue = Number(counterElement.textContent);
      incrementCounter(counterElement, counterValue);
      checkboxElement.checked = true;
      addValueToObject(filters.filter, key, value);
    } else if (key === "reverse") {
      if (value === "1") {
        filterInformation.reverse = true;
        var reverseElement = document.getElementById("filter-reverse");
        if (reverseElement) {
          reverseElement.checked = true;
        }
      }
    } else if (key === "simulator" && value === "1") {
      var javascriptSource =
        "/index.php?title=Utilisateur:Ankhseram/Calculator.js&action=raw&ctype=text/javascript";
      var cssSource =
        "/index.php?title=Utilisateur:Ankhseram/Style.css&action=raw&ctype=text/css";
      loadStyle(cssSource);
      loadScript(javascriptSource, function () {
        handleDamageSimulator(cardInformation);
      });
    } else {
      var splitKey = key.split("-")[0];
      if (Object.keys(filterInformation.range).indexOf(splitKey) !== -1) {
        var rangeElement = document.getElementById(key);
        if (!rangeElement) return;
        rangeElement.value = value;
        var rangeInformation = filterInformation.range[splitKey];
        incrementCounter(rangeInformation.counter, 0);
        var extremum = key.split("-")[1];
        var rangeFilter = filters.rangeFilter;
        if (rangeFilter[splitKey]) {
          rangeFilter[splitKey][extremum] = value;
        } else {
          rangeFilter[splitKey] = {
            min: rangeInformation.init.min,
            max: rangeInformation.init.max,
          };
          rangeFilter[splitKey][extremum] = value;
        }
      }
    }
  }

  var url = new URL(window.location.href);
  var urlHash = url.hash;
  var useParams = true;
  var filters = filterInformation.filters;

  if (urlHash) {
    var start = ".3F";
    var equal = ".3D";
    var and = ".26";
    var startParametersIndex = urlHash.indexOf(start);

    if (startParametersIndex !== -1) {
      useParams = false;
      var parameters = urlHash.slice(startParametersIndex + start.length);

      parameters.split(and).forEach(function (keyValue) {
        var [key, value] = keyValue.split(equal);
        processParameter(key, value, filters);
      });
    }
  }

  if (useParams) {
    var URLparams = new URLSearchParams(url.search);

    for (var [key, value] of URLparams.entries()) {
      processParameter(key, value, filters);
    }
  }
}

function loadScript(src, callback) {
  var script = document.createElement("script");
  script.src = src;

  function onComplete() {
    if (script.parentNode) {
      script.parentNode.removeChild(script);
    }
    callback();
  }

  document.head.appendChild(script);

  script.onload = onComplete;
  script.onerror = onComplete;
}

function loadStyle(src) {
  var link = document.createElement("link");
  link.href = src;
  link.rel = "stylesheet";

  document.head.appendChild(link);
}

(function () {
  var [filterInformation, filterParameters] = filterInitialization();
  var cardInformation = getCardInformation(filterParameters);

  observeLanguageChange(cardInformation);
  handleDropdowns(filterInformation);
  filterWithUrl(filterInformation, cardInformation);
  filterItems(filterInformation, cardInformation);
  updateFilterObject(filterInformation, cardInformation);
  loading();
})();
