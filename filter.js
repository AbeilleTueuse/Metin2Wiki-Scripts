function removeAccent(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function toNormalForm(str) {
  return removeAccent(str).replace(/[^a-zA-Z0-9 ]/g, "");
}

function editCardData(cardsData) {
  for (let cardIndex = 0; cardIndex < cardsData.length; cardIndex++) {
    const cardData = cardsData[cardIndex];
    const cardName = cardData.card.querySelector("[data-name]").textContent;

    cardData.name = toNormalForm(cardName);
  }
}

function observeLanguageChange(filterName, cardsData) {
  if (!filterName) {
    return;
  }

  var observer = new MutationObserver(function (mutation) {
    editCardData(cardsData);
  });

  observer.observe(filterName, { attributes: true });
}

function openFilter() {
  const filterButton = document.getElementById("open-filter");
  const filterDropdown = filterButton.nextElementSibling;

  hideElement(filterDropdown);

  filterButton.addEventListener("click", handleDropdown);

  function handleDropdown() {
    toggleElement(filterDropdown);
  }

  document.addEventListener("mousedown", function (event) {
    if (
      !filterButton.contains(event.target) &&
      !filterDropdown.contains(event.target)
    ) {
      hideElement(filterDropdown);
    }
  });
}

function fillData(filter, filterData) {
  const { filter: category, value } = filter.dataset;

  if (filter.type === "checkbox") {
    const span = filter.parentElement.lastElementChild;
    const filterInfo = { value: 0, span };
    const { checkbox } = filterData;

    checkbox[category] = checkbox[category] || {};
    checkbox[category][value] = filterInfo;
  } else if (filter.type === "number") {
    const { range } = filterData;
    if (range.hasOwnProperty(category)) {
      return;
    }
    const init = { min: Number(filter.min), max: Number(filter.max) };
    range[category] = { init: init };
  }
}

function extractInitData(card, cardData) {
  const cardNameElement = card.querySelector("[data-name]");

  cardData.card = card;
  cardData.name = toNormalForm(cardNameElement.textContent);
  cardData.trueName = cardNameElement.firstChild.title;
}

function extractLevelData(card, cardData) {
  const levelElement = card.querySelector("[data-level]");
  const [level, rank] = levelElement.textContent.slice(1, -1).split(", ");

  cardData["level"] = Number(level);
  cardData["rank"] = removeAccent(rank);
}

function extractElementData(card, cardData) {
  const elementChild = card.querySelector("[data-elem]").children;
  let elementValue = "";
  if (elementChild.length) {
    for (
      let elementIndex = 0;
      elementIndex < elementChild.length;
      elementIndex++
    ) {
      elementValue += elementChild[elementIndex].title + " ";
    }
  }
  elementValue = elementValue.trim() || "Aucun";
  cardData.elem = removeAccent(elementValue);
}

function extractTypeData(card, cardData) {
  const typeElement = card.querySelector("[data-type]");
  cardData.type = removeAccent(typeElement.textContent.split(" ")[0]);
}

function extractDamageData(card, cardData) {
  const damageElement = card.querySelector("[data-damage]");
  cardData.damage = removeAccent(damageElement.textContent.replace(" + ", " "));
}

function getCardData(cardsContainer, filterData, dataExtractionMapping) {
  const cards = cardsContainer.children;
  const activeExtractors = [extractInitData];

  for (const [key, extractorFunction] of Object.entries(
    dataExtractionMapping
  )) {
    if (
      filterData.range.hasOwnProperty(key) ||
      filterData.checkbox.hasOwnProperty(key)
    ) {
      activeExtractors.push(extractorFunction);
    }
  }

  const cardsData = [];

  for (let cardIndex = 0; cardIndex < cards.length; cardIndex++) {
    const card = cards[cardIndex];
    const cardData = {};

    for (const extractor of activeExtractors) {
      extractor(card, cardData);
    }

    cardsData.push(cardData);
  }

  return cardsData;
}

function filterInitialization(filterForm) {
  const filterData = {
    form: filterForm,
    filters: { filterName: "", filter: {}, rangeFilter: {} },
    range: {},
    checkbox: {},
    reverse: false,
  };
  const filters = filterForm.querySelectorAll("[data-filter]");

  filters.forEach((filter) => fillData(filter, filterData));

  return filterData;
}

function displayCounterValue(checkbox) {
  for (let filterCategory in checkbox) {
    const category = checkbox[filterCategory];

    for (let filterValue in category) {
      const valueData = category[filterValue];

      valueData.span.textContent = " (" + valueData.value + ")";
      valueData.value = 0;
    }
  }
}

function updateCounter(cardData, checkbox, filterCategory) {
  cardData[filterCategory].split(" ").forEach((cardValue) => {
    checkbox[filterCategory][cardValue].value += 1;
  });
}

function isObjectValuesInRangeFilter(parameters, rangeFilter) {
  return Object.entries(rangeFilter).every(
    ([property, { min, max }]) =>
      parameters[property] >= min && parameters[property] <= max
  );
}

function filterByName(parameters, filterName) {
  if (filterName) {
    return parameters.name.includes(filterName);
  }
  return true;
}

function isObjectValuesInFilter(parameters, filter) {
  return Object.entries(filter).every(([property, values]) =>
    parameters[property].split(" ").some((value) => values.includes(value))
  );
}

function isObjectValuesInFilters(parameters, filter, rangeFilter, filterName) {
  return (
    isObjectValuesInFilter(parameters, filter) &&
    filterByName(parameters, filterName) &&
    isObjectValuesInRangeFilter(parameters, rangeFilter)
  );
}

function filterCards(cardsContainer, filterData, cardsData) {
  const { filters, checkbox } = filterData;
  const { filter, rangeFilter, filterName } = filters;

  if (filterData.reverse) {
    for (
      var reverseIndex = 1;
      reverseIndex < cardsData.length;
      reverseIndex++
    ) {
      cardsContainer.insertBefore(
        cardsData[reverseIndex].card,
        cardsContainer.firstChild
      );
    }
    cardsData.reverse();
    filterData.reverse = false;
  }

  for (let cardIndex = 0; cardIndex < cardsData.length; cardIndex++) {
    const cardData = cardsData[cardIndex];

    if (isObjectValuesInFilters(cardData, filter, rangeFilter, filterName)) {
      showElement(cardData.card);
      for (let filterCategory in checkbox) {
        updateCounter(cardData, checkbox, filterCategory);
      }
    } else {
      hideElement(cardData.card);
    }
  }

  displayCounterValue(checkbox);
}

function handleCheckbox(target, filter) {
  const { filter: category, value } = target.dataset;

  if (target.checked) {
    filter[category] = filter[category] || [];
    filter[category].push(value);
  } else {
    const index = filter[category].indexOf(value);
    if (index !== -1) {
      filter[category].splice(index, 1);
    }
    if (!filter[category].length) {
      delete filter[category];
    }
  }
}

function handleNumberType(target, rangeFilter, range) {
  const { filter: category, value: extremum } = target.dataset;
  const currentValue = Number(target.value);
  const initialRange = range[category].init;

  if (rangeFilter[category]) {
    rangeFilter[category][extremum] = currentValue;
  } else {
    rangeFilter[category] = {
      min: initialRange.min,
      max: initialRange.max,
    };
    rangeFilter[category][extremum] = currentValue;
  }
  if (
    rangeFilter[category].max === initialRange.max &&
    rangeFilter[category].min === initialRange.min
  ) {
    delete rangeFilter[category];
  }
}

function handleFormEvents(cardsContainer, filterForm, filterData, cardsData) {
  const { filters, range } = filterData;
  let debounceTimer;

  filterForm.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  filterForm.addEventListener("change", updateFilter);

  filterForm.addEventListener("input", function (event) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      if (event.target.id === "filter-name") {
        updateFilter(event, true);
      }
    }, 500);
  });

  function updateFilter(event, filterByName = false) {
    const target = event.target;
    const targetType = target.type;

    if (filterByName) {
      filters.filterName = toNormalForm(target.value);
    } else if (targetType === "checkbox") {
      handleCheckbox(target, filters.filter);
    } else if (targetType === "number") {
      handleNumberType(target, filters.rangeFilter, range);
    }

    filterCards(cardsContainer, filterData, cardsData);
  }
}

function processParameter(filterName, filterData, key, value) {
  const { filters } = filterData;

  if (key === "name") {
    filterName.value = toNormalForm(value);
    filters.filterName = value;
  } else if (Object.keys(filterData.checkbox).indexOf(key) !== -1) {
    const checkboxElement = document.getElementById(key + "-" + value);

    if (!checkboxElement) return;

    checkboxElement.checked = true;
    filters.filter[key] = filters.filter[key] || [];
    filters.filter[key].push(value);
  } else if (key === "reverse") {
    if (value === "1") {
      filterData.reverse = true;
      const reverseElement = document.getElementById("filter-reverse");
      if (reverseElement) {
        reverseElement.checked = true;
      }
    }
  } else {
    const [splitKey, extremum] = key.split("-");

    if (Object.keys(filterData.range).indexOf(splitKey) !== -1) {
      const rangeElement = document.getElementById(key);

      if (!rangeElement) return;

      rangeElement.value = value;

      const rangeData = filterData.range[splitKey];
      const rangeFilter = filters.rangeFilter;

      if (rangeFilter[splitKey]) {
        rangeFilter[splitKey][extremum] = value;
      } else {
        rangeFilter[splitKey] = {
          min: rangeData.init.min,
          max: rangeData.init.max,
        };
        rangeFilter[splitKey][extremum] = value;
      }
    }
  }
}

function filterWithUrl(filterName, filterData) {
  const url = new URL(window.location.href);
  const { hash, search } = url;
  let useParams = true;

  if (hash) {
    const start = ".3F";
    const equal = ".3D";
    const and = ".26";
    const startParametersIndex = hash.indexOf(start);

    if (startParametersIndex !== -1) {
      const parameters = hash.slice(startParametersIndex + start.length);

      parameters.split(and).forEach(function (keyValue) {
        const [key, value] = keyValue.split(equal);
        processParameter(filterName, filterData, key, value);
      });

      useParams = false;
    }
  }

  if (useParams) {
    const URLparams = new URLSearchParams(search);

    for (const [key, value] of URLparams.entries()) {
      processParameter(filterName, filterData, key, value);
    }
  }
}

function main_filter() {
  const filterForm = document.getElementById("filter-form");
  const filterName = document.getElementById("filter-name");
  const cardsContainer = document.getElementById("cards-container");

  const dataExtractionMapping = {
    level: extractLevelData,
    elem: extractElementData,
    type: extractTypeData,
    damage: extractDamageData,
  };

  const filterData = filterInitialization(filterForm);
  const cardsData = getCardData(
    cardsContainer,
    filterData,
    dataExtractionMapping
  );

  observeLanguageChange(filterName, cardsData);
  openFilter();
  filterWithUrl(filterName, filterData);
  filterCards(cardsContainer, filterData, cardsData);
  handleFormEvents(cardsContainer, filterForm, filterData, cardsData);
}

main_filter();
