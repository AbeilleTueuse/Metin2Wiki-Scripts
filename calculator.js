function removeAccent(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function pseudoFormat(str) {
  return removeAccent(str).replace(/[^A-Za-z0-9 \(\)\+_-]+/g, "");
}

function isValueInArray(value, array) {
  return array.indexOf(value) !== -1;
}

function splitFirst(value, delimiter) {
  var parts = value.split(delimiter);
  var first = parts[0];
  var rest = parts.slice(1).join(delimiter);
  return [first, rest];
}

function isElementBelowHalfPage(element) {
  var rect = element.getBoundingClientRect();
  var elementCenterY = rect.top + rect.height / 2;
  var halfViewportHeight = window.innerHeight / 2;

  return elementCenterY > halfViewportHeight;
}

function copyObject(object) {
  var copy = {};
  for (var key in object) {
    copy[key] = object[key];
  }
  return copy;
}

function compareNumbers(a, b) {
  return b - a;
}

function isChecked(attribute) {
  return attribute === "on";
}

function floorMultiplication(firstFactor, secondFactor) {
  return Math.floor((firstFactor * secondFactor).toFixed(8));
}

function truncateNumber(number, precision) {
  return Math.floor(number * 10 ** precision) / 10 ** precision;
}

function newChangeEvent() {
  return new Event("change", { bubbles: true });
}

function addKeyValue(object, key, value) {
  if (object.hasOwnProperty(key)) {
    object[key] += value;
  } else {
    object[key] = value;
  }
}

function openTargetTab(target) {
  var tabberContainer = target.closest(".tabber-container");

  if (!tabberContainer) {
    return;
  }

  var [buttonsContainer, tabsContainer] = tabberContainer.children;
  var buttons = buttonsContainer.children;
  var tabs = tabsContainer.children;

  for (var index = 0; index < tabs.length; index++) {
    var tab = tabs[index];
    if (tab.contains(target) && !tab.checkVisibility()) {
      buttons[index].click();
      break;
    }
  }
}

function openTargetCollapsible(target) {
  var collapsible = target.closest(".improved-collapsible");

  if (!collapsible) {
    return;
  }

  var span = collapsible.firstElementChild;

  if (!span.classList.contains("mw-collapsible-toggle-expanded")) {
    span.click();
  }
}

function editTableResultRow(row, valuesToDisplay, numberFormat) {
  row.innerHTML = "";
  for (var index = 0; index < valuesToDisplay.length; index++) {
    var cell = row.insertCell();
    var textContent;

    if (index >= 3) {
      textContent = numberFormat.format(valuesToDisplay[index]);
    } else {
      textContent = valuesToDisplay[index];
    }

    cell.textContent = textContent;
  }

  return row;
}

function addRowToTableResultHistory(
  tableResultHistory,
  valuesToDisplay,
  deleteFightTemplate,
  numberFormat
) {
  var row = tableResultHistory.insertRow();
  editTableResultRow(row, valuesToDisplay, numberFormat);
  var cell = row.insertCell();
  cell.appendChild(deleteFightTemplate.cloneNode(true));
}

function calcMeanDamages(damagesWeightedByType, totalCardinal) {
  var sumDamages = 0;

  for (var damagesTypeName in damagesWeightedByType) {
    if (damagesTypeName === "miss") {
      continue;
    }

    var damagesWeighted = damagesWeightedByType[damagesTypeName];

    for (var damages in damagesWeighted) {
      sumDamages += damages * damagesWeighted[damages];
    }
  }

  return sumDamages / totalCardinal;
}

function prepareDamagesData(
  damagesWeightedByType,
  possibleDamagesCountTemp,
  totalCardinal
) {
  var minDamages = Infinity;
  var maxDamages = 0;
  var scatterDataByType = {};
  var sumDamages = 0;
  var possibleDamagesCount = 0;
  var uniqueDamagesCount = 0;

  for (var damagesTypeName in damagesWeightedByType) {
    if (damagesTypeName === "miss") {
      scatterDataByType.miss = damagesWeightedByType.miss;
      possibleDamagesCount++;
      uniqueDamagesCount++;
      continue;
    }

    var firstIteration = true;
    var damagesWeighted = damagesWeightedByType[damagesTypeName];
    var scatterData = [];
    scatterDataByType[damagesTypeName] = scatterData;

    for (var damages in damagesWeighted) {
      damages = +damages;

      if (firstIteration) {
        if (damages < minDamages) {
          minDamages = damages;
        }
        firstIteration = false;
      }

      var weight = damagesWeighted[damages];
      var probability = weight / totalCardinal;

      sumDamages += damages * weight;
      damagesWeighted[damages] = probability;
      scatterData.push({ x: damages, y: probability });
    }

    var scatterDataLength = scatterData.length;

    possibleDamagesCount += possibleDamagesCountTemp;
    uniqueDamagesCount += scatterDataLength;

    if (damages > maxDamages) {
      maxDamages = damages;
    }
  }

  if (minDamages === Infinity) {
    minDamages = 0;
  }

  return [
    sumDamages / totalCardinal,
    minDamages,
    maxDamages,
    scatterDataByType,
    possibleDamagesCount,
    uniqueDamagesCount,
  ];
}

function aggregateDamages(scatterData, maxPoints) {
  var dataLength = scatterData.length;
  var remainingData = dataLength;
  var aggregateScatterData = [];

  for (var groupIndex = 0; groupIndex < maxPoints; groupIndex++) {
    var groupLength = Math.floor(remainingData / (maxPoints - groupIndex));
    var startIndex = dataLength - remainingData;
    var aggregateDamages = 0;
    var aggregateProbability = 0;

    for (var index = startIndex; index < startIndex + groupLength; index++) {
      var { x: damages, y: probability } = scatterData[index];
      aggregateDamages += damages * probability;
      aggregateProbability += probability;
    }

    aggregateScatterData.push({
      x: aggregateDamages / aggregateProbability,
      y: aggregateProbability,
    });

    remainingData -= groupLength;
  }

  return aggregateScatterData;
}

function addToDamagesChart(
  scatterDataByType,
  damagesChart,
  isReducePointsChecked
) {
  var { chart, datasetsStyle, maxPoints, reduceChartPointsContainer } =
    damagesChart;
  var isFirstDataset = true;
  var datasets = chart.data.datasets;

  datasets.length = 0;

  for (var index = 0; index < datasetsStyle.length; index++) {
    var dataset = copyObject(datasetsStyle[index]);

    if (!scatterDataByType.hasOwnProperty(dataset.name)) {
      continue;
    }

    var scatterData = scatterDataByType[dataset.name];
    var canBeReduced = scatterData.length > 2 * maxPoints;

    dataset.hidden = !isFirstDataset;
    dataset.canBeReduced = canBeReduced;

    if (canBeReduced && isReducePointsChecked) {
      dataset.data = aggregateDamages(scatterData, maxPoints);
    } else {
      dataset.data = scatterData;
    }

    if (isFirstDataset) {
      isFirstDataset = false;

      if (canBeReduced) {
        showElement(reduceChartPointsContainer);

        if (!isReducePointsChecked) {
          handleChartAnimations(chart, false);
        }
      } else {
        hideElement(reduceChartPointsContainer);
        handleChartAnimations(chart, true);
      }
    }

    datasets.push(dataset);
  }

  chart.data.missPercentage = scatterDataByType.miss;
  chart.update();
}

function addToBonusVariationChart(
  damagesByBonus,
  augmentationByBonus,
  xLabel,
  chart
) {
  chart.data.datasets[0].data = damagesByBonus;
  chart.data.datasets[1].data = augmentationByBonus;
  chart.options.scales.x.title.text = xLabel;
  chart.update();
}

function handleChartAnimations(chart, addAnimations) {
  chart.options.animation = addAnimations;
  chart.options.animations.colors = addAnimations;
  chart.options.animations.x = addAnimations;
  chart.options.transitions.active.animation.duration = addAnimations * 1000;
}

function updateDamagesChartDescription(
  uniqueDamagesCounters,
  uniqueDamagesCount,
  formatNumber
) {
  uniqueDamagesCounters.forEach(function (element) {
    if (uniqueDamagesCount <= 1) {
      hideElement(element.parentElement);
    } else {
      showElement(element.parentElement);
      element.textContent = formatNumber.format(uniqueDamagesCount);
    }
  });
}

function getMonsterName(monsterVnum) {
  var monsterAttributes = monsterData[monsterVnum];
  return monsterAttributes[monsterAttributes.length - 1];
}

function filterClass(selectedRace, classChoice, selectValueIsChanged = false) {
  showElement(classChoice.parentElement);

  for (var option of classChoice.options) {
    if (option.getAttribute("data-race") === selectedRace) {
      if (!selectValueIsChanged) {
        classChoice.value = option.value;
        selectValueIsChanged = true;
      }
      showElement(option);
    } else {
      hideElement(option);
    }
  }
  if (selectedRace == "lycan") {
    hideElement(classChoice.parentElement);
  }
}

function filterWeapon(
  selectedRace,
  weaponElement,
  weaponCategory,
  allowedWeaponsPerRace,
  selectValueIsChanged = false
) {
  var allowedWeapons = allowedWeaponsPerRace[selectedRace];

  if (!selectValueIsChanged) {
    var weaponType = createWeapon(weaponElement.value).type;

    if (!isValueInArray(weaponType, allowedWeapons)) {
      weaponElement.value = 0;
    }
  }

  var children = weaponCategory.children;

  for (var index = 0; index < children.length; index++) {
    var child = children[index];

    if (isValueInArray(index, allowedWeapons)) {
      showElement(child);
    } else {
      hideElement(child);
    }
  }
}

function changePolymorphValues(characterCreation, monsterVnum, monsterImage) {
  var { polymorphMonster, polymorphMonsterImage } = characterCreation;

  polymorphMonster.value = monsterVnum;
  polymorphMonsterImage.value = monsterImage;

  polymorphMonster.dispatchEvent(newChangeEvent());
}

function resetImageFromWiki(image) {
  image.removeAttribute("srcset");
  image.removeAttribute("data-file-width");
  image.removeAttribute("data-file-height");
}

function handleImageFromWiki(image, newSrc) {
  image.src = newSrc;
  image.alt = newSrc.split("/").pop();
}

function handlePolymorphDisplay(polymorphDisplay, monsterVnum, monsterSrc) {
  var oldImage = polymorphDisplay.firstChild;
  var oldLink = oldImage.nextElementSibling;
  var monsterName = getMonsterName(monsterVnum);
  var newLink = createWikiLink(monsterName);

  resetImageFromWiki(oldImage);
  handleImageFromWiki(oldImage, monsterSrc);

  polymorphDisplay.replaceChild(newLink, oldLink);
}

function createWikiLink(pageName) {
  var wikiLink = document.createElement("a");

  wikiLink.href = mw.util.getUrl(pageName);
  wikiLink.title = pageName;
  wikiLink.textContent = pageName;

  return wikiLink;
}

function getSelectedWeapon(weaponCategory) {
  return weaponCategory.querySelector("input[type='radio']:checked");
}

function handleWeaponDisplay(
  weaponCategory,
  weaponDisplay,
  weaponVnum,
  newWeapon
) {
  var newWeapon = newWeapon || getSelectedWeapon(weaponCategory);

  var newImage = newWeapon.nextElementSibling;
  var newText = document.createElement("span");
  var oldImage = weaponDisplay.firstChild;
  var oldText = oldImage.nextElementSibling;
  var weaponName = newImage.nextElementSibling.dataset.o;

  if (weaponVnum == 0) {
    newText.textContent = weaponName;
  } else {
    var weaponLink = createWikiLink(weaponName);
    newText.appendChild(weaponLink);
  }

  weaponDisplay.replaceChild(newImage.cloneNode(), oldImage);
  weaponDisplay.replaceChild(newText, oldText);
}

function filterUpgrade(
  weaponUpgrade,
  weaponVnum,
  randomAttackValue,
  randomMagicAttackValue
) {
  var weapon = createWeapon(weaponVnum);
  var currentUpgrade = Number(weaponUpgrade.value);
  var weaponUpgradeChildren = weaponUpgrade.children;

  if (weapon.isSerpent) {
    showElement(randomAttackValue);

    if (weapon.isMagic) {
      showElement(randomMagicAttackValue);
    }
  } else {
    hideElement(randomAttackValue);
    hideElement(randomMagicAttackValue);
  }

  if (weapon.maxUpgrade < 1) {
    hideElement(weaponUpgrade.parentElement);
  } else {
    showElement(weaponUpgrade.parentElement);
  }

  for (var upgrade = 0; upgrade <= weapon.maxUpgrade; upgrade++) {
    showElement(weaponUpgradeChildren[upgrade]);
  }

  for (
    var upgrade = weapon.maxUpgrade + 1;
    upgrade < weaponUpgradeChildren.length;
    upgrade++
  ) {
    hideElement(weaponUpgradeChildren[upgrade]);
  }

  if (currentUpgrade > weapon.maxUpgrade) {
    weaponUpgrade.value = weapon.maxUpgrade;
  }
}

function filterCheckbox(checkbox, element) {
  if (checkbox.checked) {
    showElement(element);
  } else {
    hideElement(element);
  }
}

function filterSkills(selectedClass, skillElementsToFilter) {
  for (var element of skillElementsToFilter) {
    if (isValueInArray(selectedClass, element.dataset.class)) {
      showElement(element);
    } else {
      hideElement(element);
    }
  }
}

function filterForm(characters, battle) {
  var { saveButton, characterCreation } = characters;
  var allowedWeaponsPerRace = battle.constants.allowedWeaponsPerRace;
  var battleChoice = battle.battleChoice;

  characterCreation.addEventListener("change", function (event) {
    var target = event.target;
    var targetName = target.name;

    saveButtonOrange(saveButton);
    characters.unsavedChanges = true;

    switch (targetName) {
      case "race":
        var selectedRace = target.value;
        var classChoice = characterCreation.class;
        var weaponElement = characterCreation.weapon;

        filterClass(selectedRace, classChoice);
        filterWeapon(
          selectedRace,
          weaponElement,
          characters.weaponCategory,
          allowedWeaponsPerRace
        );
        handleWeaponDisplay(
          characters.weaponCategory,
          characters.weaponDisplay,
          weaponElement.value
        );
        filterUpgrade(
          characterCreation.weaponUpgrade,
          weaponElement.value,
          characters.randomAttackValue,
          characters.randomMagicAttackValue
        );
        filterSkills(classChoice.value, characters.skillElementsToFilter);
        handleBonusVariationUpdate(
          characterCreation,
          characters.bonusVariation,
          true
        );

        battleChoice.resetAttackType = true;
        break;
      case "class":
        filterSkills(target.value, characters.skillElementsToFilter);
        handleBonusVariationUpdate(
          characterCreation,
          characters.bonusVariation,
          true
        );

        battleChoice.resetAttackType = true;
        break;
      case "weapon":
        var weaponElement = characterCreation.weapon;

        handleWeaponDisplay(
          characters.weaponCategory,
          characters.weaponDisplay,
          weaponElement.value,
          target
        );
        filterUpgrade(
          characterCreation.weaponUpgrade,
          target.value,
          characters.randomAttackValue,
          characters.randomMagicAttackValue
        );
        handleBonusVariationUpdate(
          characterCreation,
          characters.bonusVariation
        );
        break;
      case "isRiding":
        battleChoice.resetAttackType = true;
        break;
      case "isPolymorph":
        filterCheckbox(target, characters.polymorphCreation);
        battleChoice.resetAttackType = true;
        break;
      case "lowRank":
        filterCheckbox(target, characters.rankSelection);
        break;
      case "isBlessed":
        filterCheckbox(target, characters.blessingCreation);
        break;
      case "onYohara":
        filterCheckbox(target, characters.yoharaCreation);
        break;
      case "isMarried":
        filterCheckbox(target, characters.marriageCreation);
        break;
      case "useBonusVariation":
        filterCheckbox(target, characters.bonusVariation.container);
        break;
    }

    if (
      targetName.startsWith("attackSkill") ||
      targetName.startsWith("horseSkill")
    ) {
      battleChoice.resetAttackType = true;
    }
  });
}

function addUniquePseudo(characterDataObject, savedCharactersPseudo) {
  var characterPseudo = String(characterDataObject.name);
  var originalPseudo = characterPseudo;
  var count = 0;

  var regex = /(.*)(\d)$/;
  var match = characterPseudo.match(regex);

  if (match) {
    originalPseudo = match[1];
    count = match[2];
  }

  while (isValueInArray(characterPseudo, savedCharactersPseudo)) {
    characterPseudo = originalPseudo + count;
    count++;
  }

  characterDataObject.name = characterPseudo;
  return [characterDataObject, characterPseudo];
}

function convertToNumber(value) {
  var valueNumber = Number(value);
  return isNaN(valueNumber) ? value : valueNumber;
}

function getLocalStorageValue(key, defaultValue) {
  var storedValue = localStorage.getItem(key);

  if (storedValue) {
    return JSON.parse(storedValue);
  }

  return defaultValue;
}

function getSavedCharacters() {
  return getLocalStorageValue("savedCharactersCalculator", {});
}

function getSavedMonsters() {
  var savedMonsters = getLocalStorageValue("savedMonstersCalculator", {});

  if (Array.isArray(savedMonsters)) {
    return {};
  }

  var filteredMonsters = {};

  for (var vnum in savedMonsters) {
    if (
      String(Number(vnum)) === vnum &&
      savedMonsters[vnum].hasOwnProperty("category")
    ) {
      filteredMonsters[vnum] = savedMonsters[vnum];
    }
  }

  updateSavedMonsters(filteredMonsters);

  return filteredMonsters;
}

function getSavedFights() {
  return getLocalStorageValue("savedFightsCalculator", []);
}

function saveToLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function updateSavedCharacters(savedCharacters) {
  saveToLocalStorage("savedCharactersCalculator", savedCharacters);
}

function updateSavedMonsters(savedMonsters) {
  saveToLocalStorage("savedMonstersCalculator", savedMonsters);
}

function updateSavedFights(savedFights) {
  saveToLocalStorage("savedFightsCalculator", savedFights);
}

function saveCharacter(
  savedCharacters,
  characterCreation,
  battle,
  newCharacter,
  characterDataObject
) {
  if (!characterDataObject) {
    var characterData = new FormData(characterCreation);
    var characterDataObject = {};

    characterData.forEach(function (value, key) {
      characterDataObject[key] = convertToNumber(value);
    });
  }

  var characterPseudo = characterDataObject.name;
  var { battleChoice } = battle;

  savedCharacters[characterPseudo] = characterDataObject;
  updateSavedCharacters(savedCharacters);

  if (newCharacter) {
    addBattleChoice(battleChoice, characterPseudo, characterDataObject);
  } else {
    updateBattleChoiceImage(
      battleChoice,
      characterPseudo,
      characterDataObject.race
    );
  }

  if (battleChoice.resetAttackType) {
    if (isCharacterSelected(characterPseudo, battleChoice.attacker.selected)) {
      filterAttackTypeSelectionCharacter(
        characterDataObject,
        battleChoice.attackType
      );
    }
    battleChoice.resetAttackType = false;
  }
}

function saveButtonGreen(saveButton) {
  saveButton.classList.remove("unsaved-character");
}

function saveButtonOrange(saveButton) {
  saveButton.classList.add("unsaved-character");
}

function characterCreationListener(characters, battle) {
  var { characterCreation, saveButton, weaponCategory } = characters;

  characterCreation.addEventListener("submit", handleSubmitForm);
  characterCreation.addEventListener("invalid", handleInvalidInput, true);
  document.addEventListener("keydown", handleSaveShortcut);
  weaponCategory.addEventListener("mouseover", handleTooltipOverflow);

  function handleSubmitForm(event) {
    event.preventDefault();

    if (characters.unsavedChanges) {
      saveCharacter(characters.savedCharacters, characterCreation, battle);
      saveButtonGreen(saveButton);
      characters.unsavedChanges = false;
    }
  }

  function handleInvalidInput(event) {
    var target = event.target;

    if (target.checkVisibility()) {
      return;
    }

    var autoCorrectInput = target.closest(".auto-correct-input");

    if (
      autoCorrectInput &&
      autoCorrectInput.classList.contains("tabber-noactive")
    ) {
      target.value = target.defaultValue;
      return;
    }

    openTargetTab(target);
    openTargetCollapsible(target);
  }

  function handleSaveShortcut(event) {
    if (event.ctrlKey && event.key === "s") {
      event.preventDefault();
      saveButton.click();
    }
  }

  function handleTooltipOverflow(event) {
    label = event.target.closest("label");

    if (label) {
      var tooltip = label.lastChild;

      if (tooltip.classList.contains("popContenu")) {
        var tooltipRect = tooltip.getBoundingClientRect();
        var modalRect = weaponCategory.getBoundingClientRect();

        if (tooltipRect.right > modalRect.right) {
          tooltip.style.left = "-100%";
        } else if (tooltipRect.left < modalRect.left) {
          tooltip.style.left = "200%";
        }
      }
    }
  }
}

function downloadData(content, type, filename) {
  var link = document.createElement("a");
  var blob = new Blob([content], { type: type });
  var blobURL = URL.createObjectURL(blob);

  link.href = blobURL;
  link.download = filename;
  document.body.appendChild(link);

  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(blobURL);
}

function uploadCharacter(
  selectedFiles,
  characters,
  characterTemplate,
  charactersContainer,
  battle
) {
  var selectFilesLength = selectedFiles.length;

  for (var fileIndex = 0; fileIndex < selectFilesLength; fileIndex++) {
    var selectedFile = selectedFiles[fileIndex];

    if (selectedFile.type === "text/plain") {
      var reader = new FileReader();
      reader.onload = function (e) {
        var fileContent = e.target.result;
        try {
          var characterDataObject = JSON.parse(fileContent);

          if (characterDataObject.hasOwnProperty("name")) {
            var characterPseudo = String(characterDataObject.name);

            hideElement(characters.characterCreation);
            characterPseudo = validPseudo(characterPseudo);

            [characterDataObject, characterPseudo] = addUniquePseudo(
              characterDataObject,
              Object.keys(characters.savedCharacters)
            );
            var selectedCharacter = handleNewCharacter(
              characters,
              characterTemplate,
              charactersContainer,
              battle,
              characterPseudo
            )[0];

            if (selectFilesLength === 1) {
              updateForm(
                characterDataObject,
                characters.characterCreation,
                characters,
                selectedCharacter,
                battle
              );
            }

            saveCharacter(
              characters.savedCharacters,
              characters.characterCreation,
              battle,
              true,
              characterDataObject
            );
          }
        } catch (error) {
          console.log(error);
          if (error.name === "TypeError") {
            // delete the character
          }
        }
      };
      reader.readAsText(selectedFile);
    }
  }
}

function handleUploadCharacter(
  characters,
  characterTemplate,
  charactersContainer,
  battle
) {
  var characterInput = characters.characterInput;
  var dropZone = characters.dropZone;

  characterInput.accept = ".txt";
  characterInput.multiple = true;
  dropZone.setAttribute("tabindex", "0");

  dropZone.addEventListener("click", function () {
    characterInput.click();
  });

  dropZone.addEventListener("dragover", function (event) {
    event.preventDefault();
    dropZone.classList.add("drop-zone--dragover");
  });

  ["dragleave", "dragend"].forEach(function (type) {
    dropZone.addEventListener(type, function () {
      dropZone.classList.remove("drop-zone--dragover");
    });
  });

  dropZone.addEventListener("drop", function (event) {
    event.preventDefault();
    uploadCharacter(
      event.dataTransfer.files,
      characters,
      characterTemplate,
      charactersContainer,
      battle
    );
    dropZone.classList.remove("drop-zone--dragover");
  });

  characterInput.addEventListener("change", function (event) {
    uploadCharacter(
      event.target.files,
      characters,
      characterTemplate,
      charactersContainer,
      battle
    );
  });
}

function deleteCharacter(characters, pseudo, element, battle) {
  delete characters.savedCharacters[pseudo];
  element.remove();

  updateSavedCharacters(characters.savedCharacters);
  removeBattleChoice(battle.battleChoice, pseudo, "character");

  if (
    !Object.keys(characters.savedCharacters).length ||
    characters.characterCreation.name.value === pseudo
  ) {
    saveButtonGreen(characters.saveButton);
    characters.unsavedChanges = false;
    hideElement(characters.characterCreation);
    showElement(characters.characterCreation.previousElementSibling);
  }
}

function deleteMonster(characters, battle, monsterVnum) {
  var monsterElements = characters.monsterElements;
  var monsterType = characters.savedMonsters[monsterVnum].category;

  if (monsterElements.hasOwnProperty(monsterVnum)) {
    monsterElements[monsterVnum].remove();
    delete monsterElements[monsterVnum];
  }

  delete characters.savedMonsters[monsterVnum];

  updateSavedMonsters(characters.savedMonsters);
  removeBattleChoice(battle.battleChoice, monsterVnum, monsterType);
}

function handleStyle(characters, selectedElement) {
  var currentCharacter = characters.currentCharacter;

  if (currentCharacter) {
    currentCharacter.classList.remove("selected-character");
  }

  selectedElement.classList.add("selected-character");
  characters.currentCharacter = selectedElement;
}

function updateForm(
  formData,
  characterCreation,
  characters,
  selectedElement,
  battle
) {
  saveButtonGreen(characters.saveButton);
  hideElement(characterCreation.previousElementSibling);
  showElement(characterCreation);
  handleStyle(characters, selectedElement);

  characterCreation.reset();

  for (var [name, value] of Object.entries(formData)) {
    var formElement = characterCreation[name];

    if (!formElement) {
      continue;
    }

    if (formElement.type === "checkbox") {
      if (isChecked(value)) {
        formElement.checked = true;
      }
    } else {
      formElement.value = value;
    }
  }
  var selectedRace = characterCreation.race.value;
  var classChoice = characterCreation.class;
  var weaponElement = characterCreation.weapon;

  filterClass(selectedRace, classChoice, true);
  filterWeapon(
    selectedRace,
    weaponElement,
    characters.weaponCategory,
    battle.constants.allowedWeaponsPerRace,
    true
  );
  handlePolymorphDisplay(
    characters.polymorphDisplay,
    characterCreation.polymorphMonster.value,
    characterCreation.polymorphMonsterImage.value
  );
  handleWeaponDisplay(
    characters.weaponCategory,
    characters.weaponDisplay,
    weaponElement.value
  );
  filterUpgrade(
    characterCreation.weaponUpgrade,
    weaponElement.value,
    characters.randomAttackValue,
    characters.randomMagicAttackValue
  );
  filterCheckbox(characterCreation.isPolymorph, characters.polymorphCreation);
  filterCheckbox(characterCreation.lowRank, characters.rankSelection);
  filterCheckbox(characterCreation.onYohara, characters.yoharaCreation);
  filterCheckbox(characterCreation.isBlessed, characters.blessingCreation);
  filterCheckbox(characterCreation.isMarried, characters.marriageCreation);
  filterCheckbox(
    characterCreation.useBonusVariation,
    characters.bonusVariation.container
  );
  filterSkills(classChoice.value, characters.skillElementsToFilter);
  handleBonusVariationUpdate(characterCreation, characters.bonusVariation);
}

function handleClickOnCharacter(
  spanInput,
  target,
  characters,
  characterElement,
  battle,
  edition
) {
  var displayedPseudo = characters.characterCreation.name.value;
  var pseudo = spanInput.dataset.name;

  if (edition) {
    if (!characters.unsavedChanges) {
      updateForm(
        characters.savedCharacters[pseudo],
        characters.characterCreation,
        characters,
        characterElement,
        battle
      );
    } else if (displayedPseudo === pseudo) {
      // pass
    } else {
      var result = confirm(
        "Voulez-vous continuer ? Les dernières modifications ne seront pas sauvegardées."
      );

      if (result) {
        updateForm(
          characters.savedCharacters[pseudo],
          characters.characterCreation,
          characters,
          characterElement,
          battle
        );
        characters.unsavedChanges = false;
      }
    }
  } else {
    if (target.tagName === "path") {
      target = target.parentElement;
    }

    switch (target.dataset.icon) {
      case "duplicate":
        if (!characters.unsavedChanges) {
          addNewCharacter(
            characters,
            characters.newCharacterTemplate,
            characters.charactersContainer,
            battle,
            pseudo
          );
        } else {
          var result = confirm(
            "Voulez-vous continuer ? Les dernières modifications ne seront pas sauvegardées."
          );

          if (result) {
            addNewCharacter(
              characters,
              characters.newCharacterTemplate,
              characters.charactersContainer,
              battle,
              pseudo
            );
            saveButtonGreen(characters.saveButton);
            characters.unsavedChanges = false;
          }
        }
        break;

      case "download":
        var character = characters.savedCharacters[pseudo];
        downloadData(
          JSON.stringify(character),
          "text/plain",
          character.name + ".txt"
        );
        break;

      case "delete":
        var result = confirm(
          "Voulez-vous vraiment supprimer définitivement le personnage " +
            pseudo +
            " ?"
        );
        if (result) {
          deleteCharacter(characters, pseudo, characterElement, battle);
        }
        break;
    }
  }
}

function handleNewCharacter(
  characters,
  characterTemplate,
  charactersContainer,
  battle,
  pseudo
) {
  var newCharacterTemplate = characterTemplate.cloneNode(true);
  var spanInput = newCharacterTemplate.querySelector("span.input");

  newCharacterTemplate.setAttribute("tabindex", "0");
  charactersContainer.appendChild(newCharacterTemplate);

  if (pseudo) {
    spanInput.textContent = pseudo;
    spanInput.setAttribute("data-name", pseudo);
  }

  newCharacterTemplate.addEventListener("click", function (event) {
    var target = event.target;

    if (target.tagName === "path" || target.tagName === "svg") {
      handleClickOnCharacter(
        spanInput,
        target,
        characters,
        newCharacterTemplate,
        battle
      );
    } else {
      handleClickOnCharacter(
        spanInput,
        null,
        characters,
        newCharacterTemplate,
        battle,
        true
      );
    }
  });

  newCharacterTemplate.addEventListener("keydown", function (event) {
    if (event.keyCode === 13) {
      event.target.click();
    }
  });

  return [newCharacterTemplate, spanInput];
}

function validPseudo(pseudo) {
  var newPseudo = pseudoFormat(pseudo);

  if (!newPseudo) {
    return "Pseudo";
  }

  return newPseudo;
}

function addNewCharacter(
  characters,
  characterTemplate,
  charactersContainer,
  battle,
  pseudoToDuplicate
) {
  function editAndSetCharacterPseudoInput(selectedCharacter, spanInput) {
    var maxPseudoLength = 20;

    var selection = window.getSelection();
    var range = document.createRange();

    if (pseudoToDuplicate) {
      spanInput.textContent = pseudoToDuplicate;
    }

    spanInput.contentEditable = true;
    spanInput.focus();
    range.selectNodeContents(spanInput);
    selection.removeAllRanges();
    selection.addRange(range);

    function pseudoValidation() {
      var characterPseudo = validPseudo(spanInput.textContent);
      var characterDataObject = { name: characterPseudo };

      if (pseudoToDuplicate) {
        characterDataObject = copyObject(
          characters.savedCharacters[pseudoToDuplicate]
        );
        characterDataObject.name = characterPseudo;
      }

      [characterDataObject, characterPseudo] = addUniquePseudo(
        characterDataObject,
        Object.keys(characters.savedCharacters)
      );

      selection.removeAllRanges();
      spanInput.contentEditable = false;
      spanInput.textContent = characterPseudo;
      spanInput.setAttribute("data-name", characterPseudo);

      updateForm(
        characterDataObject,
        characters.characterCreation,
        characters,
        selectedCharacter,
        battle
      );
      saveCharacter(
        characters.savedCharacters,
        characters.characterCreation,
        battle,
        true
      );
    }

    function handleMaxLength(event) {
      if (spanInput.textContent.length > maxPseudoLength) {
        spanInput.textContent = spanInput.textContent.slice(0, maxPseudoLength);
        range.setStart(spanInput.childNodes[0], maxPseudoLength);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }

    function handleBlur() {
      spanInput.removeEventListener("blur", handleBlur);
      spanInput.removeEventListener("input", handleMaxLength);
      pseudoValidation();
    }

    function handleKeyDown(event) {
      if (event.key === "Enter") {
        event.preventDefault();

        spanInput.removeEventListener("keydown", handleKeyDown);
        spanInput.removeEventListener("blur", handleBlur);
        spanInput.removeEventListener("input", handleMaxLength);

        pseudoValidation();
      }
    }

    spanInput.addEventListener("input", handleMaxLength);
    spanInput.addEventListener("keydown", handleKeyDown);
    spanInput.addEventListener("blur", handleBlur);
  }

  hideElement(characters.characterCreation);
  var [selectedCharacter, spanInput] = handleNewCharacter(
    characters,
    characterTemplate,
    charactersContainer,
    battle
  );

  editAndSetCharacterPseudoInput(selectedCharacter, spanInput);
}

function handleFocus() {
  var tooltipLinks = document.querySelectorAll("div.tooltip a");
  tooltipLinks.forEach(function (link) {
    link.setAttribute("tabindex", -1);
  });
}

function resetBonusVariation(bonusVariation) {
  function resetInput(input) {
    input.removeAttribute("min");
    input.removeAttribute("max");
    input.defaultValue = 0;
    input.value = input.defaultValue;
  }
  var { minValue, maxValue, checkbox, container, disabledText, selectedText } =
    bonusVariation;

  resetInput(minValue);
  resetInput(maxValue);
  showElement(disabledText);
  hideElement(selectedText);
  hideElement(container);
  checkbox.checked = false;
}

function handleBonusVariationUpdate(
  characterCreation,
  bonusVariation,
  resetSkill
) {
  var selectedBonus = characterCreation.bonusVariation.value;
  var displayName = characterCreation.bonusVariationName.value;

  if (
    resetSkill &&
    (selectedBonus.startsWith("attackSkill") ||
      selectedBonus.startsWith("horseSkill") ||
      selectedBonus.startsWith("skillBonus"))
  ) {
    resetBonusVariation(bonusVariation);
    return;
  }

  if (
    characterCreation.hasOwnProperty(selectedBonus) &&
    selectedBonus != 0 &&
    displayName != 0
  ) {
    handleBonusVariation(
      characterCreation[selectedBonus],
      bonusVariation,
      displayName
    );
  } else {
    resetBonusVariation(bonusVariation);
  }
}

function getTargetContent(targetParent, targetName, isSkill) {
  var targetContent = "";

  if (targetParent.children.length <= 1) {
    targetContent = targetParent.textContent;
  } else if (targetName === "weaponUpgrade") {
    targetContent = targetParent.children[1].textContent;
  } else if (targetName === "level") {
    targetContent = targetParent.textContent.replace("Lv", "").trim();
  } else if (isSkill) {
    var container = targetParent.children[1];

    for (var index = 0; index < container.children.length; index++) {
      var element = container.children[index];

      if (element.checkVisibility()) {
        targetContent += element.textContent;
      }
    }
  } else {
    for (var index = 1; index < targetParent.children.length; index++) {
      var element = targetParent.children[index];

      if (element.checkVisibility()) {
        targetContent += element.textContent;
      }
    }
  }

  return targetContent;
}

function handleBonusVariation(target, bonusVariation, displayName) {
  var {
    minValue,
    maxValue,
    checkbox,
    container,
    disabledText,
    selectedText,
    displaySpan,
  } = bonusVariation;

  var {
    min: targetMin,
    max: targetMax,
    name: targetName,
    value: targetValue,
    parentElement: targetParent,
    tagName,
  } = target;

  targetMin = Number(targetMin);
  targetMax = Number(targetMax);
  targetValue = Number(targetValue);

  var isSkill = tagName === "SELECT";

  if (isSkill) {
    var options = target.options;

    targetMin = options[0].value;
    targetMax = options[options.length - 1].value;
  }

  minValue.min = targetMin;
  minValue.max = targetMax;
  minValue.defaultValue = targetMin;

  maxValue.min = targetMin;
  maxValue.max = targetMax;
  maxValue.defaultValue = targetMin;

  hideElement(disabledText);
  showElement(selectedText);

  if (displayName) {
    minValue.value = Math.min(Math.max(minValue.value, targetMin), targetMax);
    maxValue.value = Math.max(Math.min(maxValue.value, targetMax), targetMin);

    displaySpan.textContent = displayName;
  } else {
    var { input, inputName, tabButton } = bonusVariation;
    var targetContent = getTargetContent(targetParent, targetName, isSkill);

    input.value = targetName;
    inputName.value = targetContent;
    displaySpan.textContent = targetContent;

    minValue.value = Math.max(targetValue - 10, targetMin);
    maxValue.value = Math.min(targetValue + 10, targetMax);

    showElement(container);
    checkbox.checked = true;

    tabButton.click();
    tabButton.scrollIntoView(true);

    input.dispatchEvent(newChangeEvent());
  }
}

function characterManagement(characters, battle) {
  var {
    newCharacterTemplate: characterTemplate,
    charactersContainer,
    addNewCharacterButton,
    saveButton,
    characterCreation,
    bonusVariation,
  } = characters;

  Object.keys(characters.savedCharacters).forEach(function (pseudo) {
    handleNewCharacter(
      characters,
      characterTemplate,
      charactersContainer,
      battle,
      pseudo
    );
  });

  addNewCharacterButton.addEventListener("click", function (event) {
    if (!characters.unsavedChanges) {
      addNewCharacter(
        characters,
        characterTemplate,
        charactersContainer,
        battle
      );
    } else {
      var result = confirm(
        "Voulez-vous continuer ? Les dernières modifications ne seront pas sauvegardées."
      );

      if (result) {
        addNewCharacter(
          characters,
          characterTemplate,
          charactersContainer,
          battle
        );
        saveButtonGreen(saveButton);
        characters.unsavedChanges = false;
      }
    }
  });

  handleUploadCharacter(
    characters,
    characterTemplate,
    charactersContainer,
    battle
  );

  function handleLongPress(target) {
    if (target.tagName !== "INPUT" && target.tagName !== "SELECT") {
      target = target.querySelector("input");
    }

    if (
      !target ||
      (target.type !== "number" &&
        !target.classList.contains("skill-select") &&
        target.name !== "weaponUpgrade") ||
      target.classList.contains("disabled-variation")
    ) {
      return;
    }

    handleBonusVariation(target, bonusVariation, null);
  }

  characterCreation.addEventListener("click", function (event) {
    if (event.shiftKey || event.ctrlKey) {
      handleLongPress(event.target);
    }
  });

  var longPressTimer;

  characterCreation.addEventListener("touchstart", function (event) {
    longPressTimer = setTimeout(function () {
      handleLongPress(event.target);
    }, 800);
  });

  characterCreation.addEventListener("touchend", function () {
    clearTimeout(longPressTimer);
  });

  characterCreation.addEventListener("touchmove", function () {
    clearTimeout(longPressTimer);
  });

  filterForm(characters, battle);
  characterCreationListener(characters, battle);
  handleFocus();

  window.addEventListener("beforeunload", function (event) {
    if (characters.unsavedChanges) {
      event.preventDefault();
      return "";
    }
  });
}

function addMonsterElement(characters, battle, monsterVnum, iframeInfo) {
  var { monsterTemplate, monstersContainer } = characters;
  var monsterElement = monsterTemplate.cloneNode(true);
  var spanInput = monsterElement.querySelector("span.input");
  var deleteSvg = monsterElement.querySelector("svg");
  var monsterName = getMonsterName(monsterVnum);
  var link = createWikiLink(monsterName);

  monsterElement.setAttribute("tabindex", "0");
  spanInput.appendChild(link);
  monstersContainer.appendChild(monsterElement);
  characters.monsterElements[monsterVnum] = monsterElement;

  deleteSvg.addEventListener("click", function () {
    var monster = characters.savedMonsters[monsterVnum];
    iframeInfo[monster.category].shouldBeUpdated = true;

    deleteMonster(characters, battle, monsterVnum);
  });
}

function addNewMonster(
  characters,
  battle,
  monsterVnum,
  monsterImage,
  iframeInfo,
  category
) {
  if (isValueInArray(monsterVnum, Object.keys(characters.savedMonsters)))
    return;

  var newMonster = {
    image: monsterImage,
    category: category,
  };

  characters.savedMonsters[monsterVnum] = newMonster;

  addMonsterElement(characters, battle, monsterVnum, iframeInfo);
  updateSavedMonsters(characters.savedMonsters);
  addBattleChoice(battle.battleChoice, monsterVnum, newMonster, true);
}

function addButtonsToCards(characters, iframeDoc, iframeInfo, category) {
  var buttonTemplates = characters.monsterButtonTemplates.children[0];
  var cardToEdit = iframeDoc.getElementById("cards-container").children;
  var { nameToVnum } = iframeInfo;
  var vnumToButtons = iframeInfo[category].vnumToButtons;

  for (var cardIndex = 0; cardIndex < cardToEdit.length; cardIndex++) {
    var card = cardToEdit[cardIndex];
    var cardName = card.querySelector("[data-name]").firstChild.title;
    var buttonTemplatesClone = buttonTemplates.cloneNode(true);

    cardName = cardName.replace(/\s/g, " ");

    if (!nameToVnum.hasOwnProperty(cardName)) {
      continue;
    }

    var monsterVnum = nameToVnum[cardName];

    buttonTemplatesClone.dataset.monsterId = monsterVnum;
    card.lastElementChild.appendChild(buttonTemplatesClone);
    vnumToButtons[monsterVnum] = buttonTemplatesClone.children;
  }
}

function updateiFrameButtons(characters, iframeInfo, category) {
  var addedMonsters = Object.keys(characters.savedMonsters);
  var { currentiFrameIsMonster } = iframeInfo;
  var vnumToButtons = iframeInfo[category].vnumToButtons;
  var isPolymorphModal = category === "monster" && !currentiFrameIsMonster;

  for (var monsterVnum in vnumToButtons) {
    var [addButton, deleteButton, selectButton] = vnumToButtons[monsterVnum];

    if (isPolymorphModal) {
      hideElement(addButton);
      hideElement(deleteButton);
      showElement(selectButton);
      continue;
    }

    if (isValueInArray(monsterVnum, addedMonsters)) {
      hideElement(addButton);
      showElement(deleteButton);
      hideElement(selectButton);
    } else {
      showElement(addButton);
      hideElement(deleteButton);
      hideElement(selectButton);
    }
  }

  iframeInfo.lastiFrameIsMonster = currentiFrameIsMonster;
}

function getMonsterImage(buttonsContainer) {
  var elder = buttonsContainer.parentElement.firstElementChild;
  var image = elder.querySelector("img");

  if (image) {
    return image.getAttribute("src") || "";
  }

  return "";
}

function handleiFrame(iframeInfo, category) {
  var { characters, battle } = iframeInfo;
  var iframeInfoCategory = iframeInfo[category];
  var { iframe, pageName, vnumToButtons } = iframeInfoCategory;
  var loadingAnimation = iframeInfoCategory.iframe.previousElementSibling;

  iframe.src = mw.util.getUrl(pageName);

  iframe.addEventListener("load", function () {
    var iframeDoc = this.contentDocument || this.contentWindow.document;
    var iframeBody = iframeDoc.body;

    content = iframeDoc.getElementById("show-after-loading");

    iframeBody.firstElementChild.replaceWith(content);

    iframeBody.style.background = "transparent";
    iframeBody.style.paddingRight = "10px";

    addButtonsToCards(characters, iframeDoc, iframeInfo, category);
    updateiFrameButtons(characters, iframeInfo, category);

    iframeInfoCategory.loadIsFinished = true;

    hideElement(loadingAnimation);
    showElement(iframe);

    iframeDoc.addEventListener("click", handleButtonClick);

    function handleButtonClick(event) {
      var target = event.target;
      var link = target.closest("a");
      var buttonsContainer = target.closest(".handle-monster");

      if (link) {
        event.preventDefault();
        window.open(link.href, "_blank");
      } else if (buttonsContainer) {
        var { monsterId: monsterVnum } = buttonsContainer.dataset;

        // polymorph iframe
        if (category === "monster" && !iframeInfo.currentiFrameIsMonster) {
          var monsterImage = getMonsterImage(buttonsContainer);
          changePolymorphValues(
            characters.characterCreation,
            monsterVnum,
            monsterImage
          );
          handlePolymorphDisplay(
            characters.polymorphDisplay,
            monsterVnum,
            monsterImage
          );
          iframe.dispatchEvent(newChangeEvent());
        } else {
          var addedMonsters = Object.keys(characters.savedMonsters);
          var [addButton, deleteButton] = vnumToButtons[monsterVnum];

          if (isValueInArray(monsterVnum, addedMonsters)) {
            deleteMonster(characters, battle, monsterVnum);
            showElement(addButton);
            hideElement(deleteButton);
          } else {
            var monsterImage = getMonsterImage(buttonsContainer);
            addNewMonster(
              characters,
              battle,
              monsterVnum,
              monsterImage,
              iframeInfo,
              category
            );
            hideElement(addButton);
            showElement(deleteButton);
          }
        }
      }
    }
  });
}

function getNameToVnumMapping() {
  var nameToVnum = {};

  for (var monsterVnum in monsterData) {
    nameToVnum[monsterData[monsterVnum][monsterData[monsterVnum].length - 1]] =
      monsterVnum;
  }

  return nameToVnum;
}

function monsterManagement(characters, battle) {
  var { monsteriFrame, stoneiFrame } = characters;
  var monsterVnums = Object.keys(monsterData);

  var iframeInfo = {
    lastiFrameIsMonster: false,
    currentiFrameIsMonster: false,
    characters: characters,
    battle: battle,
    nameToVnum: getNameToVnumMapping(),
    monster: {
      isLoaded: false,
      loadIsFinished: false,
      shouldBeUpdated: false,
      vnumToButtons: {},
      pageName: "Monstres",
      iframe: monsteriFrame,
    },
    stone: {
      isLoaded: false,
      loadIsFinished: false,
      shouldBeUpdated: false,
      vnumToButtons: {},
      pageName: "Pierres Metin",
      iframe: stoneiFrame,
    },
  };

  document.addEventListener("modalOpen", function (event) {
    var modalName = event.detail.name;

    if (modalName === "monster" || modalName === "stone") {
      handleModal(event.target, modalName);
    }
  });

  function handleModal(target, modalName) {
    var iframeInfoCategory = iframeInfo[modalName];

    if (modalName === "monster") {
      var isMonsteriFrame = target.id === "add-new-monster";
      iframeInfo.currentiFrameIsMonster = isMonsteriFrame;

      if (
        iframeInfoCategory.loadIsFinished &&
        ((isMonsteriFrame && !iframeInfo.lastiFrameIsMonster) ||
          (!isMonsteriFrame && iframeInfo.lastiFrameIsMonster))
      ) {
        iframeInfoCategory.shouldBeUpdated = true;
      }
    }

    if (!iframeInfoCategory.isLoaded) {
      handleiFrame(iframeInfo, modalName);
      iframeInfoCategory.isLoaded = true;
    }

    if (
      iframeInfoCategory.loadIsFinished &&
      iframeInfoCategory.shouldBeUpdated
    ) {
      updateiFrameButtons(characters, iframeInfo, modalName);
      iframeInfoCategory.shouldBeUpdated = false;
    }
  }

  Object.keys(characters.savedMonsters)
    .slice()
    .forEach(function (monsterVnum) {
      if (isValueInArray(monsterVnum, monsterVnums)) {
        addMonsterElement(characters, battle, monsterVnum, iframeInfo);
      } else {
        deleteMonster(characters, battle, monsterVnum);
      }
    });
}

function hideAttackType(container, input, attackType) {
  hideElement(container);

  if (input.checked) {
    var defaultInput = attackType.defaultInput;

    input.checked = false;
    defaultInput.checked = true;
    defaultInput.dispatchEvent(newChangeEvent());
  }
}

function filterAttackTypeSelectionCharacter(attacker, attackType) {
  var attackerClass = attacker.class;
  var attackerIsNotPolymorph = !isPolymorph(attacker);
  var { elements: attackTypeElements } = attackType;

  for (var index = 0; index < attackTypeElements.length; index++) {
    var { container, input, inputClass, inputValue } =
      attackTypeElements[index];

    if (
      attackerIsNotPolymorph &&
      attacker[inputValue] &&
      (attackerClass === inputClass ||
        (inputValue.startsWith("horseSkill") &&
          isRiding(attacker) &&
          (!inputClass || isValueInArray(attackerClass, inputClass))))
    ) {
      showElement(container);
    } else {
      hideAttackType(container, input, attackType);
    }
  }
}

function filterAttackTypeSelectionMonster(attackType) {
  var attackTypeElements = attackType.elements;

  for (var index = 0; index < attackTypeElements.length; index++) {
    var { container, input } = attackTypeElements[index];
    hideAttackType(container, input, attackType);
  }
}

function setupDropdowns(battleChoice) {
  var { form, buttons } = battleChoice;
  var lastInvalidTime = 0;

  buttons.forEach(function (button) {
    var dropdown = button.nextElementSibling;

    button.addEventListener("click", handleClick);
    document.addEventListener("mousedown", handleMouseDown);
    dropdown.addEventListener("change", handleChange);

    function handleClick() {
      toggleElement(dropdown);

      if (isElementBelowHalfPage(button)) {
        dropdown.classList.add("above");
        dropdown.classList.remove("below");
      } else {
        dropdown.classList.add("below");
        dropdown.classList.remove("above");
      }
    }

    function handleMouseDown(event) {
      if (!button.contains(event.target) && !dropdown.contains(event.target)) {
        hideElement(dropdown);
      }
    }

    function handleChange() {
      hideElement(dropdown);
    }
  });

  form.addEventListener("invalid", handleInvalidInput, true);

  function handleInvalidInput(event) {
    var currentTime = Date.now();

    if (currentTime - lastInvalidTime < 100) {
      return;
    }

    lastInvalidTime = currentTime;

    var target = event.target;
    var dropdownContainer = target.closest(".dropdown-container");

    if (dropdownContainer) {
      showElement(dropdownContainer);
    }
  }
}

function removeBattleElement(battleChoice, nameOrVnum, category, type) {
  var elements = battleChoice[category][type].elements;

  if (elements.hasOwnProperty(nameOrVnum)) {
    elements[nameOrVnum].container.remove();
    delete elements[nameOrVnum];
    battleChoice[category][type].count--;
  }
}

function removeBattleChoice(battleChoice, nameOrVnum, type) {
  battleChoice.categories.forEach(function (category) {
    if (category === "attacker" && type === "stone") {
      return;
    }
    var selected = battleChoice[category].selected;

    if (selected) {
      var { type: selectedType, nameOrVnum: selectedNameOrVnum } =
        parseTypeAndName(selected);

      if (nameOrVnum === selectedNameOrVnum && type === selectedType) {
        resetBattleChoiceButton(battleChoice, category, selected);
        battleChoice[category].selected = null;
      }
    }

    removeBattleElement(battleChoice, nameOrVnum, category, type);
    updateBattleChoiceText(battleChoice, category, type);
  });
}

function addBattleElement(
  battleChoice,
  pseudoOrVnum,
  characterOrMonster,
  category,
  isMonster
) {
  var { template, raceToImage } = battleChoice;
  var battleChoiceCategory = battleChoice[category];
  var templateClone = template.cloneNode(true);
  var label = templateClone.firstElementChild;
  var [input, image, span] = label.children;
  var imageSrc;
  var name;
  var type;

  if (isMonster) {
    type = characterOrMonster.category;

    if (type === "stone" && category === "attacker") {
      return;
    }
    imageSrc = characterOrMonster.image;
    name = getMonsterName(pseudoOrVnum);
  } else {
    type = "character";
    imageSrc = raceToImage[characterOrMonster.race];
    name = pseudoOrVnum;
    label.classList.add("notranslate");
  }

  var value = type + "-" + pseudoOrVnum;
  var id = category + "-" + value;
  var currentBattleChoice = battleChoiceCategory[type];

  label.setAttribute("for", id);
  input.value = value;
  input.id = id;
  input.name = category;
  span.textContent = name;

  handleImageFromWiki(image, imageSrc);

  currentBattleChoice.container.appendChild(templateClone);
  currentBattleChoice.count++;
  currentBattleChoice.elements[pseudoOrVnum] = {
    container: templateClone,
    image: image,
    name: name,
  };

  updateBattleChoiceText(battleChoice, category, type);
}

function addBattleChoice(
  battleChoice,
  pseudoOrVnum,
  characterOrMonster,
  isMonster = false
) {
  addBattleElement(
    battleChoice,
    pseudoOrVnum,
    characterOrMonster,
    "attacker",
    isMonster
  );
  addBattleElement(
    battleChoice,
    pseudoOrVnum,
    characterOrMonster,
    "victim",
    isMonster
  );
}

function updateBattleChoiceImage(battleChoice, characterName, newRace) {
  var imageSrc = battleChoice.raceToImage[newRace];

  battleChoice.categories.forEach(function (category) {
    handleImageFromWiki(
      battleChoice[category].character.elements[characterName].image,
      imageSrc
    );

    var selected = battleChoice[category].selected;

    if (isCharacterSelected(characterName, selected)) {
      updateBattleChoiceButton(battleChoice, category, selected);
    }
  });
}

function updateBattleChoiceText(battleChoice, category, type) {
  var { count, container } = battleChoice[category][type];
  var parentContainer = container.parentElement;

  if (count === 0) {
    hideElement(parentContainer);
    showElement(parentContainer.nextElementSibling);
  } else if (count === 1) {
    showElement(parentContainer);
    hideElement(parentContainer.nextElementSibling);
  }
}

function updateBattleChoice(characters, battleChoice) {
  var templateImage = battleChoice.template.querySelector("img");
  var attackerImage = battleChoice.attacker.buttonContent.querySelector("img");
  var victimImage = battleChoice.victim.buttonContent.querySelector("img");

  resetImageFromWiki(templateImage);
  resetImageFromWiki(attackerImage);
  resetImageFromWiki(victimImage);
  setupDropdowns(battleChoice);

  for (var [pseudo, character] of Object.entries(characters.savedCharacters)) {
    addBattleChoice(battleChoice, pseudo, character);
  }

  for (var [vnum, monster] of Object.entries(characters.savedMonsters)) {
    addBattleChoice(battleChoice, vnum, monster, true);
  }
}

function updateBattleChoiceButton(battleChoice, category, data) {
  var battleChoiceCategory = battleChoice[category];
  var { defaultButtonContent, buttonContent } = battleChoiceCategory;
  var [buttonImage, buttonSpan] = buttonContent.firstElementChild.children;
  var { type, nameOrVnum } = parseTypeAndName(data);
  var { name, image } = battleChoiceCategory[type].elements[nameOrVnum];

  hideElement(defaultButtonContent);
  showElement(buttonContent);

  buttonSpan.textContent = name;
  buttonImage.src = image.src;
  battleChoiceCategory.selected = data;
}

function resetBattleChoiceButton(battleChoice, category) {
  var { defaultButtonContent, buttonContent } = battleChoice[category];

  showElement(defaultButtonContent);
  hideElement(buttonContent);

  if (category === "attacker") {
    filterAttackTypeSelectionMonster(battleChoice.attackType);
  }
}

function isPC(character) {
  if (character.race === 0 || character.race === 1) {
    return false;
  }
  return true;
}

function isBoss(character) {
  return character.race === 0 && character.rank >= 5;
}

function isStone(character) {
  return character.race === 1;
}

function isMeleeAttacker(monster) {
  return monster.attack == 0;
}

function isRangeAttacker(monster) {
  return monster.attack == 1;
}

function isMagicAttacker(monster) {
  return monster.attack == 2;
}

function isMagicClass(character) {
  return character.race === "shaman" || character.class === "black_magic";
}

function isDispell(character, skillId) {
  return character.class === "weaponary" && skillId === 6;
}

function isPolymorph(character) {
  return isChecked(character.isPolymorph);
}

function isRiding(character) {
  return isChecked(character.isRiding);
}

function isBow(weaponType) {
  return weaponType === 2;
}

function calcAttackFactor(attacker, victim) {
  function calcCoeffK(dex, level) {
    return Math.min(90, Math.floor((2 * dex + level) / 3));
  }

  var K1 = calcCoeffK(attacker.polymorphDex, attacker.level);
  var K2 = calcCoeffK(victim.polymorphDex, attacker.level);

  var AR = (K1 + 210) / 300;
  var ER = (((2 * K2 + 5) / (K2 + 95)) * 3) / 10;

  return truncateNumber(AR - ER, 8);
}

function calcMainAttackValue(attacker) {
  var leadership = 0;
  var weaponGrowth = 0;

  if (isPC(attacker)) {
    weaponGrowth = attacker.weapon.growth;
    leadership = attacker.leadership;
  }

  return 2 * (attacker.level + weaponGrowth) + leadership;
}

function calcStatAttackValue(character) {
  switch (character.race) {
    case "warrior":
    case "sura":
      return 2 * character.str;
    case "ninja":
      return Math.floor((1 / 4) * (character.str + 7 * character.dex));
    case "shaman":
      return Math.floor((1 / 3) * (5 * character.int + character.dex));
    case "lycan":
      return character.vit + 2 * character.dex;
    default:
      return 2 * character.str;
  }
}

function calcSecondaryAttackValue(attacker) {
  var attackValueOther = 0;

  var minAttackValue = 0;
  var maxAttackValue = 0;

  var minAttackValueSlash = 0;
  var maxAttackValueSlash = 0;

  if (isPC(attacker)) {
    var { type, isSerpent, minAttackValue, maxAttackValue, growth } =
      attacker.weapon;

    if (isSerpent) {
      minAttackValue = Math.max(0, attacker.minAttackValueRandom - growth);
      maxAttackValue = Math.max(
        minAttackValue,
        attacker.maxAttackValueRandom - growth
      );
    }

    minAttackValueSlash = Math.min(
      attacker.minAttackValueSlash,
      attacker.maxAttackValueSlash
    );
    maxAttackValueSlash = Math.max(
      attacker.minAttackValueSlash,
      attacker.maxAttackValueSlash
    );

    attackValueOther += attacker.attackValue;

    if (isBow(type) && !isPolymorph(attacker)) {
      attackValueOther += 25;
    }
  } else {
    minAttackValue = attacker.minAttackValue;
    maxAttackValue = attacker.maxAttackValue;
  }

  minAttackValue += attacker.minAttackValuePolymorph;
  maxAttackValue += attacker.maxAttackValuePolymorph;

  attackValueOther += attacker.statAttackValue;
  attackValueOther += attacker.horseAttackValue;

  var weaponInterval = maxAttackValue - minAttackValue + 1;
  var slashInterval = maxAttackValueSlash - minAttackValueSlash + 1;

  var totalCardinal = weaponInterval * slashInterval * 1_000_000;
  var minInterval = Math.min(weaponInterval, slashInterval);

  minAttackValue += minAttackValueSlash;
  maxAttackValue += maxAttackValueSlash;

  return {
    minAttackValue: minAttackValue,
    maxAttackValue: maxAttackValue,
    attackValueOther: attackValueOther,
    totalCardinal: totalCardinal,
    weights: calcWeights(minAttackValue, maxAttackValue, minInterval),
    possibleDamagesCount: maxAttackValue - minAttackValue + 1,
  };
}

function calcMagicAttackValue(attacker) {
  var minMagicAttackValueSlash = 0;
  var maxMagicAttackValueSlash = 0;

  var { isSerpent, minMagicAttackValue, maxMagicAttackValue, growth } =
    attacker.weapon;

  if (isSerpent) {
    minMagicAttackValue = Math.max(0, attacker.minMagicAttackValueRandom);
    maxMagicAttackValue = Math.max(
      minMagicAttackValue,
      attacker.maxMagicAttackValueRandom
    );
  } else {
    minMagicAttackValue += growth;
    maxMagicAttackValue += growth;
  }

  minMagicAttackValueSlash = Math.min(
    attacker.minMagicAttackValueSlash,
    attacker.maxMagicAttackValueSlash
  );
  maxMagicAttackValueSlash = Math.max(
    attacker.minMagicAttackValueSlash,
    attacker.maxMagicAttackValueSlash
  );

  var weaponInterval = maxMagicAttackValue - minMagicAttackValue + 1;
  var slashInterval = maxMagicAttackValueSlash - minMagicAttackValueSlash + 1;

  var totalCardinal = weaponInterval * slashInterval * 1_000_000;
  var minInterval = Math.min(weaponInterval, slashInterval);

  minMagicAttackValue += minMagicAttackValueSlash;
  maxMagicAttackValue += maxMagicAttackValueSlash;

  return {
    minMagicAttackValue: minMagicAttackValue,
    maxMagicAttackValue: maxMagicAttackValue,
    magicAttackValueAugmentation: getMagicAttackValueAugmentation(
      minMagicAttackValue,
      maxMagicAttackValue,
      attacker.magicAttackValue
    ),
    totalCardinal: totalCardinal,
    weights: calcWeights(minMagicAttackValue, maxMagicAttackValue, minInterval),
    possibleDamagesCount: maxMagicAttackValue - minMagicAttackValue + 1,
  };
}

function getPolymorphPower(polymorphPoint, polymorphPowerTable) {
  return polymorphPowerTable[polymorphPoint];
}

function getSkillPower(skillPoint, skillPowerTable) {
  return skillPowerTable[skillPoint];
}

function getMarriageBonusValue(character, marriageTable, itemName) {
  var index;
  var lovePoint = character.lovePoint;

  if (lovePoint < 65) {
    index = 0;
  } else if (lovePoint < 80) {
    index = 1;
  } else if (lovePoint < 100) {
    index = 2;
  } else {
    index = 3;
  }

  return marriageTable[itemName][index];
}

function calcDamageWithPrimaryBonuses(damages, bonusValues) {
  damages = Math.floor((damages * bonusValues.attackValueCoeff) / 100);

  damages += bonusValues.attackValueMarriage;

  damages = Math.floor(
    (damages * bonusValues.monsterResistanceMarriageCoeff) / 100
  );
  damages = Math.floor((damages * bonusValues.monsterResistanceCoeff) / 100);

  damages += Math.floor((damages * bonusValues.typeBonusCoeff) / 100);
  damages +=
    Math.floor((damages * bonusValues.raceBonusCoeff) / 100) -
    Math.floor((damages * bonusValues.raceResistanceCoeff) / 100);
  damages += Math.floor((damages * bonusValues.stoneBonusCoeff) / 100);
  damages += Math.floor((damages * bonusValues.monsterBonusCoeff) / 100);

  var elementBonusCoeff = bonusValues.elementBonusCoeff;

  damages +=
    Math.trunc((damages * elementBonusCoeff[0]) / 10000) +
    Math.trunc((damages * elementBonusCoeff[1]) / 10000) +
    Math.trunc((damages * elementBonusCoeff[2]) / 10000) +
    Math.trunc((damages * elementBonusCoeff[3]) / 10000) +
    Math.trunc((damages * elementBonusCoeff[4]) / 10000) +
    Math.trunc((damages * elementBonusCoeff[5]) / 10000);

  damages = Math.floor(damages * bonusValues.damageMultiplier);

  return damages;
}

function calcDamageWithSecondaryBonuses(
  damages,
  bonusValues,
  damagesType,
  minPiercingDamages,
  damagesWithPrimaryBonuses
) {
  damages = Math.floor(damages * bonusValues.magicResistanceCoeff);
  damages = Math.trunc((damages * bonusValues.weaponDefenseCoeff) / 100);
  damages = Math.floor((damages * bonusValues.tigerStrengthCoeff) / 100);
  damages = Math.floor((damages * bonusValues.blessingBonusCoeff) / 100);

  if (damagesType.criticalHit) {
    damages *= 2;
  }

  if (damagesType.piercingHit) {
    damages += bonusValues.defenseBoost + Math.min(0, minPiercingDamages);
    damages += Math.floor(
      (damagesWithPrimaryBonuses * bonusValues.extraPiercingHitCoeff) / 1000
    );
  }

  damages = Math.floor((damages * bonusValues.averageDamageCoeff) / 100);
  damages = Math.floor(
    (damages * bonusValues.averageDamageResistanceCoeff) / 100
  );
  damages = Math.floor(
    (damages * bonusValues.skillDamageResistanceCoeff) / 100
  );

  damages = Math.floor((damages * bonusValues.rankBonusCoeff) / 100);
  damages = Math.max(0, damages + bonusValues.defensePercent);
  damages += Math.min(
    300,
    Math.floor((damages * bonusValues.damageBonusCoeff) / 100)
  );
  damages = Math.floor((damages * bonusValues.empireMalusCoeff) / 10);
  damages = Math.floor((damages * bonusValues.sungMaStrBonusCoeff) / 10000);
  damages -= Math.floor(damages * bonusValues.sungmaStrMalusCoeff);

  damages = Math.floor((damages * bonusValues.whiteDragonElixirCoeff) / 100);
  damages = Math.floor((damages * bonusValues.steelDragonElixirCoeff) / 100);

  return damages;
}

function calcSkillDamageWithSecondaryBonuses(
  damages,
  bonusValues,
  damagesType,
  minPiercingDamages
) {
  damages = Math.floor(damages * bonusValues.magicResistanceCoeff);
  damages = Math.trunc((damages * bonusValues.weaponDefenseCoeff) / 100);

  damages -= bonusValues.defense;

  damages = floorMultiplication(damages, bonusValues.skillWardCoeff);
  damages = floorMultiplication(damages, bonusValues.skillBonusCoeff);

  var tempDamages = Math.floor(
    (damages * bonusValues.skillBonusByBonusCoeff) / 100
  );

  damages = Math.floor(
    (tempDamages * bonusValues.magicAttackValueCoeff) / 100 + 0.5
  );
  damages = Math.floor((damages * bonusValues.tigerStrengthCoeff) / 100);

  if (damagesType.criticalHit) {
    damages *= 2;
  }

  if (damagesType.piercingHit) {
    damages += bonusValues.defenseBoost + Math.min(0, minPiercingDamages);
    damages += Math.floor(
      (tempDamages * bonusValues.extraPiercingHitCoeff) / 1000
    );
  }

  damages = Math.floor((damages * bonusValues.skillDamageCoeff) / 100);
  damages = Math.floor(
    (damages * bonusValues.skillDamageResistanceCoeff) / 100
  );
  damages = Math.floor((damages * bonusValues.rankBonusCoeff) / 100);

  damages = Math.max(0, damages + bonusValues.defensePercent);
  damages += Math.min(
    300,
    Math.floor((damages * bonusValues.damageBonusCoeff) / 100)
  );
  damages = Math.floor((damages * bonusValues.empireMalusCoeff) / 10);
  damages = Math.floor((damages * bonusValues.sungMaStrBonusCoeff) / 10000);
  damages -= Math.floor(damages * bonusValues.sungmaStrMalusCoeff);

  damages = Math.floor((damages * bonusValues.whiteDragonElixirCoeff) / 100);
  damages = Math.floor((damages * bonusValues.steelDragonElixirCoeff) / 100);

  return damages;
}

function computePolymorphPoint(attacker, victim, polymorphPowerTable) {
  attacker.polymorphDex = attacker.dex;
  victim.polymorphDex = victim.dex;

  attacker.minAttackValuePolymorph = 0;
  attacker.maxAttackValuePolymorph = 0;

  if (isPC(attacker) && isPolymorph(attacker)) {
    var polymorphPowerPct =
      getPolymorphPower(attacker.polymorphPoint, polymorphPowerTable) / 100;
    var polymorphMonster = createMonster(attacker.polymorphMonster, null, true);

    var polymorphStr = floorMultiplication(
      polymorphPowerPct,
      polymorphMonster.str
    );

    attacker.polymorphDex += floorMultiplication(
      polymorphPowerPct,
      polymorphMonster.dex
    );

    attacker.minAttackValuePolymorph = floorMultiplication(
      polymorphPowerPct,
      polymorphMonster.minAttackValue
    );
    attacker.maxAttackValuePolymorph = floorMultiplication(
      polymorphPowerPct,
      polymorphMonster.maxAttackValue
    );

    if (!attacker.weapon) {
      attacker.maxAttackValuePolymorph += 1;
    }

    attacker.attackValue = 0;

    if (isMagicClass(attacker)) {
      attacker.statAttackValue = 2 * (polymorphStr + attacker.int);
    } else {
      attacker.statAttackValue = 2 * (polymorphStr + attacker.str);
    }
  }
}

function computeHorse(attacker) {
  attacker.horseAttackValue = 0;

  if (isPC(attacker) && isRiding(attacker) && !isPolymorph(attacker)) {
    var horseConstant = 30;

    if (attacker.class === "weaponary") {
      horseConstant = 60;
    }

    attacker.horseAttackValue = floorMultiplication(
      2 * attacker.level + attacker.statAttackValue,
      attacker.horsePoint / horseConstant
    );
  }
}

function getRankBonus(attacker) {
  if (!isChecked(attacker.lowRank)) {
    return 0;
  }

  switch (attacker.rank) {
    case "aggressive":
      return 1;
    case "fraudulent":
      return 2;
    case "malicious":
      return 3;
    case "cruel":
      return 5;
  }

  return 0;
}

function calcElementCoeffPvP(elementBonus, mapping, attacker, victim) {
  var minElementMalus = 0;
  var maxDifference = 0;
  var savedElementDifferences = [];
  var elementBonusIndex = 0;

  for (var index = 0; index < elementBonus.length; index++) {
    if (!attacker[mapping.elementBonus[index]]) {
      continue;
    }

    var elementDifference =
      attacker[mapping.elementBonus[index]] -
      victim[mapping.elementResistance[index]];

    if (elementDifference >= 0) {
      elementBonus[elementBonusIndex] = 10 * elementDifference;
      minElementMalus -= elementDifference;
      maxDifference = Math.max(maxDifference, elementDifference);
      elementBonusIndex++;
    } else {
      savedElementDifferences.push(elementDifference);
    }
  }

  if (!savedElementDifferences.length) {
    return;
  }

  minElementMalus += maxDifference;
  savedElementDifferences.sort(compareNumbers);

  for (var index = 0; index < savedElementDifferences.length; index++) {
    var elementDifference = savedElementDifferences[index];

    elementBonus[elementBonusIndex + index] =
      10 * Math.max(minElementMalus, elementDifference);

    minElementMalus = Math.min(
      0,
      Math.max(minElementMalus, minElementMalus - elementDifference)
    );
  }
}

function skillChanceReduction(value) {
  if (value <= 9) {
    return Math.floor(value / 2);
  }
  return 5 + Math.floor((value - 10) / 4);
}

function magicResistanceToCoeff(magicResistance) {
  if (magicResistance) {
    return 2000 / (6 * magicResistance + 1000) - 1;
  }
  return 1;
}

function createBattleValues(attacker, victim, battle, skillType) {
  var { mapping, constants } = battle;
  var calcAttackValues;

  var missPercentage = 0;
  var attackValueMeleeMagic = 0;
  var attackValueMarriage = 0;
  var monsterResistanceMarriage = 0;
  var monsterResistance = 0;
  var typeBonus = 0;
  var raceBonus = 0;
  var raceResistance = 0;
  var stoneBonus = 0;
  var monsterBonus = 0;
  var elementBonus = [0, 0, 0, 0, 0, 0]; // fire, ice, lightning, earth, darkness, wind, order doesn't matter
  var defenseMarriage = 0;
  var damageMultiplier = 1;
  var useDamages = 1;
  var defense = victim.defense;
  var defenseBoost = defense;
  var magicResistance = 0;
  var weaponDefense = 0;
  var tigerStrength = 0;
  var blessingBonus = 0;
  var magicAttackValueMeleeMagic = 0;
  var criticalHitPercentage = attacker.criticalHit;
  var piercingHitPercentage = attacker.piercingHit;
  var extraPiercingHitPercentage = Math.max(0, piercingHitPercentage - 100);
  var averageDamage = 0;
  var averageDamageResistance = 0;
  var skillDamage = 0;
  var skillDamageResistance = 0;
  var rankBonus = 0;
  var defensePercent = 0;
  var damageBonus = 0;
  var empireMalus = 0;
  var sungMaStrBonus = 0;
  var sungmaStrMalus = 0;
  var whiteDragonElixir = 0;
  var steelDragonElixir = 0;

  attacker.statAttackValue = calcStatAttackValue(attacker);

  computePolymorphPoint(attacker, victim, constants.polymorphPowerTable);
  computeHorse(attacker);

  if (isPC(attacker)) {
    if (weaponData.hasOwnProperty(attacker.weapon)) {
      attacker.weapon = createWeapon(attacker.weapon);
    } else {
      attacker.weapon = createWeapon(0);
    }

    attacker.weapon.getValues(attacker.weaponUpgrade);

    attackValueMeleeMagic =
      attacker.attackValuePercent + Math.min(100, attacker.attackMeleeMagic);

    var weaponType = attacker.weapon.type;

    if (skillType && attacker.class === "archery") {
      if (weaponType !== 2) {
        useDamages = 0;
        weaponType = 2;
      }
      defense = 0;
    }

    var weaponDefenseName = mapping.defenseWeapon[weaponType];
    var weaponDefenseBreakName = mapping.breakWeapon[weaponType];

    if (victim.hasOwnProperty(weaponDefenseName)) {
      weaponDefense = victim[weaponDefenseName];
    }

    if (isChecked(attacker.whiteDragonElixir)) {
      whiteDragonElixir = 10;
    }

    if (isPC(victim)) {
      if (!skillType) {
        if (weaponType === 2 && !isPolymorph(attacker)) {
          missPercentage = victim.arrowBlock;
        } else {
          missPercentage = victim.meleeBlock;
        }
        missPercentage +=
          victim.meleeArrowBlock -
          (missPercentage * victim.meleeArrowBlock) / 100;

        blessingBonus = calcBlessingBonus(constants.skillPowerTable, victim);
        averageDamageResistance = victim.averageDamageResistance;
      }

      typeBonus = Math.max(1, attacker.humanBonus - victim.humanResistance);
      raceBonus = attacker[mapping.raceBonus[victim.race]];
      raceResistance = victim[mapping.raceResistance[attacker.race]];

      calcElementCoeffPvP(elementBonus, mapping, attacker, victim);

      if (weaponType !== 2 && attacker.hasOwnProperty(weaponDefenseBreakName)) {
        weaponDefense -= attacker[weaponDefenseBreakName];
      }

      criticalHitPercentage = 0;
    } else {
      if (isChecked(attacker.isMarried)) {
        if (isChecked(attacker.loveNecklace)) {
          attackValueMarriage = getMarriageBonusValue(
            attacker,
            constants.marriageTable,
            "loveNecklace"
          );
        }

        if (isChecked(attacker.loveEarrings)) {
          criticalHitPercentage += getMarriageBonusValue(
            attacker,
            constants.marriageTable,
            "loveEarrings"
          );
        }

        if (isChecked(attacker.harmonyEarrings)) {
          piercingHitPercentage += getMarriageBonusValue(
            attacker,
            constants.marriageTable,
            "harmonyEarrings"
          );
        }
      }

      if (isChecked(attacker.tigerStrength)) {
        tigerStrength = 40;
      }

      for (var index = 0; index < elementBonus.length; index++) {
        var elementBonusName = mapping.elementBonus[index];
        var elementResistanceName = mapping.elementResistance[index];

        if (attacker[elementBonusName] && victim[elementBonusName]) {
          elementBonus[index] =
            50 * (attacker[elementBonusName] - victim[elementResistanceName]);
        } else {
          elementBonus[index] = 5 * attacker[elementBonusName];
        }
      }

      var victimType = victim.type;

      if (victimType !== -1) {
        typeBonus = attacker[mapping.typeFlag[victimType]];
      }

      monsterBonus = attacker.monsterBonus;

      if (isStone(victim)) {
        stoneBonus = attacker.stoneBonus;
      }

      if (isBoss(victim)) {
        if (skillType) {
          skillDamage += attacker.skillBossDamage;
        } else {
          averageDamage += attacker.bossDamage;
        }
      }

      if (isChecked(attacker.onYohara)) {
        var sungmaStrDifference = attacker.sungmaStr - attacker.sungmaStrMalus;

        if (sungmaStrDifference >= 0) {
          sungMaStrBonus = sungmaStrDifference;
        } else {
          sungmaStrMalus = 0.5;
        }
      }
    }

    if (skillType) {
      skillDamage += attacker.skillDamage;
    } else {
      averageDamage += attacker.averageDamage;
    }

    rankBonus = getRankBonus(attacker);
    damageBonus = attacker.damageBonus;

    if (isChecked(attacker.empireMalus)) {
      empireMalus = 1;
    }
  } else {
    if (isPC(victim)) {
      if (isChecked(victim.isMarried)) {
        if (isChecked(victim.harmonyBracelet)) {
          monsterResistanceMarriage = getMarriageBonusValue(
            victim,
            constants.marriageTable,
            "harmonyBracelet"
          );
        }

        if (isChecked(victim.harmonyNecklace) && !skillType) {
          defenseMarriage = getMarriageBonusValue(
            victim,
            constants.marriageTable,
            "harmonyNecklace"
          );
        }
      }

      monsterResistance = victim.monsterResistance;

      for (var index = 0; index < elementBonus.length; index++) {
        var elementBonusName = mapping.elementBonus[index];
        var elementResistanceName = mapping.elementResistance[index];

        if (attacker[elementBonusName]) {
          elementBonus[index] =
            80 * (attacker[elementBonusName] - victim[elementResistanceName]);
        }
      }

      if (!skillType) {
        if (isMeleeAttacker(attacker)) {
          missPercentage = victim.meleeBlock;
          averageDamageResistance = victim.averageDamageResistance;
          blessingBonus = calcBlessingBonus(constants.skillPowerTable, victim);
        } else if (isRangeAttacker(attacker)) {
          missPercentage = victim.arrowBlock;
          weaponDefense = victim.arrowDefense;
          averageDamageResistance = victim.averageDamageResistance;
          blessingBonus = calcBlessingBonus(constants.skillPowerTable, victim);
        } else if (isMagicAttacker(attacker)) {
          missPercentage = victim.arrowBlock;
          skillDamageResistance = victim.skillDamageResistance;
          magicResistance = victim.magicResistance;
        }

        missPercentage +=
          victim.meleeArrowBlock -
          (missPercentage * victim.meleeArrowBlock) / 100;
      }
    }

    typeBonus = 1;
    damageMultiplier = attacker.damageMultiplier;
  }

  if (skillType) {
    criticalHitPercentage = skillChanceReduction(criticalHitPercentage);
    piercingHitPercentage = skillChanceReduction(piercingHitPercentage);
  }

  if (isPC(victim)) {
    if (!skillType && isChecked(victim.biologist70)) {
      defenseBoost = Math.floor((defenseBoost * 110) / 100);
    }

    criticalHitPercentage = Math.max(
      0,
      criticalHitPercentage - victim.criticalHitResistance
    );
    piercingHitPercentage = Math.max(
      0,
      piercingHitPercentage - victim.piercingHitResistance
    );

    if (skillType) {
      skillDamageResistance = victim.skillDamageResistance;
    }

    if (isMagicClass(victim)) {
      defensePercent = (-2 * victim.magicDefense * victim.defensePercent) / 100;
    } else {
      defensePercent = (-2 * defenseBoost * victim.defensePercent) / 100;
    }

    if (isChecked(victim.steelDragonElixir)) {
      steelDragonElixir = 10;
    }
  }

  if (skillType === "magic") {
    attackValueMeleeMagic = 0;
    magicAttackValueMeleeMagic =
      attacker.attackMagic + Math.min(100, attacker.attackMeleeMagic);
    attackValueMarriage = 0;
    defense = 0;
    if (isDispell(attacker, 6)) {
      typeBonus = 0;
      raceBonus = 0;
      raceResistance = 0;
      stoneBonus = 0;
      monsterBonus = 0;
      for (var index = 0; index < elementBonus.length; index++) {
        elementBonus[index] = 0;
      }
    } else {
      magicResistance = victim.magicResistance;
    }
    weaponDefense = 0;
    calcAttackValues = calcMagicAttackValue;
  } else {
    calcAttackValues = calcSecondaryAttackValue;
  }

  missPercentage = Math.min(100, missPercentage);

  var bonusValues = {
    missPercentage: missPercentage,
    weaponBonusCoeff: 1,
    attackValueCoeff: 100 + attackValueMeleeMagic,
    attackValueMarriage: attackValueMarriage,
    monsterResistanceMarriageCoeff: 100 - monsterResistanceMarriage,
    monsterResistanceCoeff: 100 - monsterResistance,
    typeBonusCoeff: typeBonus,
    raceBonusCoeff: raceBonus,
    raceResistanceCoeff: raceResistance,
    stoneBonusCoeff: stoneBonus,
    monsterBonusCoeff: monsterBonus,
    elementBonusCoeff: elementBonus,
    damageMultiplier: damageMultiplier,
    useDamages: useDamages,
    defense: defense,
    defenseBoost: defenseBoost,
    defenseMarriage: defenseMarriage,
    tigerStrengthCoeff: 100 + tigerStrength,
    magicResistanceCoeff: magicResistanceToCoeff(magicResistance),
    weaponDefenseCoeff: 100 - weaponDefense,
    blessingBonusCoeff: 100 - blessingBonus,
    magicAttackValueCoeff: 100 + magicAttackValueMeleeMagic,
    extraPiercingHitCoeff: 5 * extraPiercingHitPercentage,
    averageDamageCoeff: 100 + averageDamage,
    averageDamageResistanceCoeff: 100 - Math.min(99, averageDamageResistance),
    skillDamageCoeff: 100 + skillDamage,
    skillDamageResistanceCoeff: 100 - Math.min(99, skillDamageResistance),
    rankBonusCoeff: 100 + rankBonus,
    defensePercent: Math.floor(defensePercent),
    damageBonusCoeff: Math.min(20, damageBonus),
    empireMalusCoeff: 10 - empireMalus,
    sungMaStrBonusCoeff: 10000 + sungMaStrBonus,
    sungmaStrMalusCoeff: sungmaStrMalus,
    whiteDragonElixirCoeff: 100 + whiteDragonElixir,
    steelDragonElixirCoeff: 100 - steelDragonElixir,
  };

  criticalHitPercentage = Math.min(criticalHitPercentage, 100);
  piercingHitPercentage = Math.min(piercingHitPercentage, 100);

  var damagesTypeCombinaison = [
    {
      criticalHit: false,
      piercingHit: false,
      weight:
        (100 - criticalHitPercentage) *
        (100 - piercingHitPercentage) *
        (100 - missPercentage),
      name: "normalHit",
    },
    {
      criticalHit: true,
      piercingHit: false,
      weight:
        criticalHitPercentage *
        (100 - piercingHitPercentage) *
        (100 - missPercentage),
      name: "criticalHit",
    },
    {
      criticalHit: false,
      piercingHit: true,
      weight:
        (100 - criticalHitPercentage) *
        piercingHitPercentage *
        (100 - missPercentage),
      name: "piercingHit",
    },
    {
      criticalHit: true,
      piercingHit: true,
      weight:
        criticalHitPercentage * piercingHitPercentage * (100 - missPercentage),
      name: "criticalPiercingHit",
    },
  ];

  return {
    attacker: attacker,
    victim: victim,
    attackFactor: calcAttackFactor(attacker, victim),
    mainAttackValue: calcMainAttackValue(attacker),
    attackValues: calcAttackValues(attacker),
    bonusValues: bonusValues,
    damagesTypeCombinaison: damagesTypeCombinaison,
  };
}

function updateBattleValues(battleValues, skillFormula, skillInfo) {
  var weaponBonus = 0;
  var skillWard = 0;
  var skillBonus = 0;
  var skillBonusByBonus = 0;
  var { attacker: attacker, bonusValues: bonusValues } = battleValues;
  var {
    range: [minVariation, maxVariation],
  } = skillInfo;
  var variationLength = maxVariation - minVariation + 1;

  if (skillInfo.hasOwnProperty("weaponBonus")) {
    var [weaponType, weaponBonusValue] = skillInfo.weaponBonus;

    if (weaponType === attacker.weapon.type) {
      weaponBonus = weaponBonusValue;
    }
  }

  if (skillInfo.skillBonus) {
    skillBonus = skillInfo.skillBonus;
  }

  if (skillInfo.skillWard) {
    skillWard = skillInfo.skillWard;
  }

  if (skillInfo.skillBonusByBonus) {
    skillBonusByBonus = skillInfo.skillBonusByBonus;
  }

  if (skillInfo.removeWeaponReduction) {
    bonusValues.weaponDefenseCoeff = 100;
  }

  bonusValues.weaponBonusCoeff = 100 + weaponBonus;
  bonusValues.skillWardCoeff = 1 - skillWard / 100;
  bonusValues.skillBonusCoeff = 1 + skillBonus / 100;
  bonusValues.skillBonusByBonusCoeff = 100 + skillBonusByBonus;

  battleValues.skillFormula = skillFormula;
  battleValues.skillRange = skillInfo.range;
  battleValues.attackValues.totalCardinal *= variationLength;
  battleValues.attackValues.possibleDamagesCount *= variationLength;
}

function calcWeights(minValue, maxValue, minInterval) {
  var firstWeightLimit = minValue + minInterval - 1;
  var lastWeightsLimit = maxValue - minInterval + 1;
  var weights = [];

  for (var value = minValue; value < firstWeightLimit; value++) {
    weights.push(value - minValue + 1);
  }

  for (var value = firstWeightLimit; value <= lastWeightsLimit; value++) {
    weights.push(minInterval);
  }

  for (var value = lastWeightsLimit + 1; value <= maxValue; value++) {
    weights.push(maxValue - value + 1);
  }

  return weights;
}

function calcBlessingBonus(skillPowerTable, victim) {
  if (!isChecked(victim.isBlessed)) {
    return 0;
  }

  var int = victim.intBlessing;
  var dex = victim.dexBlessing;
  var skillPower = getSkillPower(victim["skillBlessing"], skillPowerTable);

  if (!skillPower) {
    return 0;
  }

  var blessingBonus = floorMultiplication(
    ((int * 0.3 + 5) * (2 * skillPower + 0.5) + 0.3 * dex) / (skillPower + 2.3),
    1
  );

  if (victim.class === "dragon" && isChecked(ictim.blessingOnself)) {
    blessingBonus = floorMultiplication(blessingBonus, 1.1);
  }

  return blessingBonus;
}

function getSkillFormula(battle, skillId, battleValues, removeSkillVariation) {
  var { attacker, victim, attackFactor } = battleValues;
  var skillPowerTable = battle.constants.skillPowerTable;

  var skillFormula;
  var skillInfo = { range: [0, 0] };

  var { class: attackerClass, level: lv, vit, str, int, dex } = attacker;

  if (skillId <= 9) {
    var skillPower = getSkillPower(
      attacker["attackSkill" + skillId],
      skillPowerTable
    );

    var improvedBySkillBonus = false;
    var improvedByBonus = false;

    if (attackerClass === "body") {
      switch (skillId) {
        // Triple lacération
        case 1:
          skillFormula = function (atk) {
            return floorMultiplication(
              1.1 * atk + (0.5 * atk + 1.5 * str) * skillPower,
              1
            );
          };
          improvedByBonus = true;
          break;
        // Moulinet à l'épée
        case 2:
          skillFormula = function (atk) {
            return floorMultiplication(
              3 * atk + (0.8 * atk + 5 * str + 3 * dex + vit) * skillPower,
              1
            );
          };
          improvedByBonus = true;
          improvedBySkillBonus = true;
          break;
        // Accélération
        case 5:
          skillFormula = function (atk) {
            return floorMultiplication(
              2 * atk + (atk + dex * 3 + str * 7 + vit) * skillPower,
              1
            );
          };
          improvedByBonus = true;
          break;
        // Volonté de vivre
        case 6:
          skillFormula = function (atk) {
            return floorMultiplication(
              (3 * atk + (atk + 1.5 * str) * skillPower) * 1.07,
              1
            );
          };
          break;
        // Tremblement de terre
        case 9:
          skillFormula = function (atk, variation) {
            return floorMultiplication(
              3 * atk +
                (0.9 * atk + variation + 5 * str + 3 * dex + lv) * skillPower,
              1
            );
          };
          skillInfo.range = [1, 1000];
          break;
      }
    } else if (attackerClass === "mental") {
      switch (skillId) {
        // Attaque de l'esprit
        case 1:
          skillFormula = function (atk) {
            return floorMultiplication(
              2.3 * atk + (4 * atk + 4 * str + vit) * skillPower,
              1
            );
          };
          improvedByBonus = true;
          improvedBySkillBonus = true;
          break;
        // Attaque de la paume
        case 2:
          skillFormula = function (atk) {
            return floorMultiplication(
              2.3 * atk + (3 * atk + 4 * str + 3 * vit) * skillPower,
              1
            );
          };
          improvedByBonus = true;
          break;
        // Charge
        case 3:
          skillFormula = function (atk) {
            return floorMultiplication(
              2 * atk + (2 * atk + 2 * dex + 2 * vit + 4 * str) * skillPower,
              1
            );
          };
          break;
        // Coup d'épée
        case 5:
          skillFormula = function (atk) {
            return floorMultiplication(
              2 * atk + (atk + 3 * dex + 5 * str + vit) * skillPower,
              1
            );
          };
          improvedByBonus = true;
          break;
        // Orbe de l'épée
        case 6:
          skillFormula = function (atk) {
            return floorMultiplication(
              (2 * atk + (2 * atk + 2 * dex + 2 * vit + 4 * str) * skillPower) *
                1.1,
              1
            );
          };
          break;
        // Tremblement de terre
        case 9:
          skillFormula = function (atk, variation) {
            return floorMultiplication(
              3 * atk +
                (0.9 * atk + variation + 5 * str + 3 * dex + lv) * skillPower,
              1
            );
          };
          skillInfo.range = [1, 1000];
          break;
      }
    } else if (attackerClass === "blade_fight") {
      switch (skillId) {
        // Embuscade
        case 1:
          skillFormula = function (atk, variation) {
            return floorMultiplication(
              atk + (1.2 * atk + variation + 4 * dex + 4 * str) * skillPower,
              1
            );
          };
          skillInfo.weaponBonus = [1, 50];
          skillInfo.range = [500, 700];
          improvedByBonus = true;
          improvedBySkillBonus = true;
          break;
        // Attaque rapide
        case 2:
          skillFormula = function (atk, variation) {
            return floorMultiplication(
              atk + (1.6 * atk + variation + 7 * dex + 7 * str) * skillPower,
              1
            );
          };
          skillInfo.weaponBonus = [1, 35];
          skillInfo.range = [200, 300];
          improvedByBonus = true;
          break;
        // Dague filante
        case 3:
          skillFormula = function (atk) {
            return floorMultiplication(
              2 * atk + (0.5 * atk + 9 * dex + 7 * str) * skillPower,
              1
            );
          };
          improvedByBonus = true;
          break;
        // Brume empoisonnée
        case 5:
          skillFormula = function (atk) {
            return floorMultiplication(
              2 * lv + (atk + 3 * str + 18 * dex) * skillPower,
              1
            );
          };
          improvedByBonus = true;
          break;
        // Poison insidieux
        case 6:
          skillFormula = function (atk) {
            return floorMultiplication(
              (2 * lv + (atk + 3 * str + 18 * dex) * skillPower) * 1.1,
              1
            );
          };
          break;
        // Étoiles brillantes
        case 9:
          skillFormula = function (atk, variation) {
            return floorMultiplication(
              atk + (1.7 * atk + variation + 6 * dex + 5 * lv) * skillPower,
              1
            );
          };
          skillInfo.range = [1, 1000];
          break;
      }
    } else if (attackerClass === "archery") {
      switch (skillId) {
        // Tir à répétition
        // case 1:
        //   skillFormula = function (atk) {
        //     return floorMultiplication(
        //       atk + 0.2 * atk * Math.floor(2 + 6 * skillPower) + (0.8 * atk + 8 * dex * attackFactor + 2 * int) * skillPower,
        //       1
        //     );
        //   };
        //   improvedByBonus = true;
        //   break;
        // Pluie de flèches
        case 2:
          skillFormula = function (atk) {
            return floorMultiplication(
              atk + (1.7 * atk + 5 * dex + str) * skillPower,
              1
            );
          };
          improvedByBonus = true;
          break;
        // Flèche de feu
        case 3:
          skillFormula = function (atk, variation) {
            return floorMultiplication(
              1.5 * atk + (2.6 * atk + 0.9 * int + variation) * skillPower,
              1
            );
          };
          skillInfo.range = [100, 300];
          improvedByBonus = true;
          improvedBySkillBonus = true;
          break;
        // Foulée de plume
        case 4:
          skillFormula = function (atk) {
            return floorMultiplication(
              (3 * dex + 200 + 2 * str + 2 * int) * skillPower,
              1
            );
          };
          skillInfo.removeWeaponReduction = true;
          break;
        // Flèche empoisonnée
        case 5:
          skillFormula = function (atk, variation) {
            return floorMultiplication(
              atk +
                (1.4 * atk + variation + 7 * dex + 4 * str + 4 * int) *
                  skillPower,
              1
            );
          };
          skillInfo.range = [100, 200];
          improvedByBonus = true;
          break;
        // Coup étincelant
        case 6:
          skillFormula = function (atk, variation) {
            return floorMultiplication(
              (atk +
                (1.2 * atk + variation + 6 * dex + 3 * str + 3 * int) *
                  skillPower) *
                1.2,
              1
            );
          };
          skillInfo.range = [100, 200];
          improvedByBonus = true;
          break;
        // Tir tempête
        case 9:
          skillFormula = function (atk, variation) {
            return floorMultiplication(
              1.9 * atk + (2.6 * atk + variation) * skillPower,
              1
            );
          };
          skillInfo.range = [1, 1000];
          break;
      }
    } else if (attackerClass === "weaponary") {
      switch (skillId) {
        // Toucher brûlant
        case 1:
          skillFormula = function (atk) {
            return floorMultiplication(
              atk +
                2 * lv +
                2 * int +
                (2 * atk + 4 * str + 14 * int) * skillPower,
              1
            );
          };
          improvedByBonus = true;
          improvedBySkillBonus = true;
          break;
        // Tourbillon du dragon
        case 2:
          skillFormula = function (atk) {
            return floorMultiplication(
              1.1 * atk +
                2 * lv +
                2 * int +
                (1.5 * atk + str + 12 * int) * skillPower,
              1
            );
          };
          improvedByBonus = true;
          break;
        // Contre-sort
        case 6:
          skillFormula = function (mav, variation) {
            return floorMultiplication(
              40 +
                5 * lv +
                2 * int +
                (10 * int + 7 * mav + variation) * attackFactor * skillPower,
              1
            );
          };
          skillInfo.range = [50, 100];
          break;
        // Coup démoniaque
        case 9:
          skillFormula = function (atk, variation) {
            return floorMultiplication(
              1.9 * atk + (2.6 * atk + variation) * skillPower,
              1
            );
          };
          skillInfo.range = [1, 1000];
          break;
      }
    } else if (attackerClass === "black_magic") {
      switch (skillId) {
        // Attaque des ténèbres
        case 1:
          skillFormula = function (mav, variation) {
            return floorMultiplication(
              40 +
                5 * lv +
                2 * int +
                (13 * int + 6 * mav + variation) * attackFactor * skillPower,
              1
            );
          };
          skillInfo.range = [50, 100];
          improvedByBonus = true;
          improvedBySkillBonus = true;
          break;
        // Attaque de flammes
        // case 2:
        //   skillFormula = function (mav, variation) {
        //     return floorMultiplication(
        //       5 * lv + 2 * int + (7 * int + 8 * mav + 4 * str + 2 * vit + variation) * skillPower,
        //       1
        //     );
        //   };
        //   skillInfo.range = [180, 100];
        //   improvedByBonus = true;
        //   break;
        // Esprit de flammes
        case 3:
          skillFormula = function (mav, variation) {
            return floorMultiplication(
              30 +
                2 * lv +
                2 * int +
                (7 * int + 6 * mav + variation) * attackFactor * skillPower,
              1
            );
          };
          skillInfo.range = [200, 500];
          break;
        // Frappe de l'esprit
        // case 5:
        //   skillFormula = function (mav, variation) {
        //     return floorMultiplication(
        //       40 + 2 * lv + 2 * int + (2 * vit + 2 * dex + 13 * int + 6 * mav + variation) * attackFactor * skillPower,
        //       1
        //     );
        //   };
        //   skillInfo.range = [180, 200];
        //   break;
        // Orbe des ténèbres
        case 6:
          skillFormula = function (mav) {
            return floorMultiplication(
              120 +
                6 * lv +
                (5 * vit + 5 * dex + 29 * int + 9 * mav) *
                  attackFactor *
                  skillPower,
              1
            );
          };
          improvedByBonus = true;
          break;
        // Vague mortelle
        case 9:
          skillFormula = function (mav, variation) {
            return floorMultiplication(
              120 +
                6 * lv +
                (5 * vit + 5 * dex + 30 * int + variation + 9 * mav) *
                  attackFactor *
                  skillPower,
              1
            );
          };
          skillInfo.range = [1, 1000];
          break;
      }
    } else if (attackerClass === "dragon") {
      switch (skillId) {
        // Talisman volant
        case 1:
          skillFormula = function (mav) {
            return floorMultiplication(
              70 +
                5 * lv +
                (18 * int + 7 * str + 5 * mav + 50) * attackFactor * skillPower,
              1
            );
          };
          skillInfo.weaponBonus = [4, 10];
          improvedByBonus = true;
          break;
        // Dragon chassant
        case 2:
          skillFormula = function (mav) {
            return floorMultiplication(
              60 +
                5 * lv +
                (16 * int + 6 * dex + 6 * mav + 120) *
                  attackFactor *
                  skillPower,
              1
            );
          };
          skillInfo.weaponBonus = [4, 10];
          improvedByBonus = true;
          improvedBySkillBonus = true;
          break;
        // Rugissement du dragon
        case 3:
          skillFormula = function (mav) {
            return floorMultiplication(
              70 +
                3 * lv +
                (20 * int + 3 * str + 10 * mav + 100) *
                  attackFactor *
                  skillPower,
              1
            );
          };
          skillInfo.weaponBonus = [4, 10];
          improvedByBonus = true;
          break;
        // Météore
        case 9:
          skillFormula = function (mav, variation) {
            return floorMultiplication(
              120 +
                6 * lv +
                (5 * vit + 5 * dex + 30 * int + variation + 9 * mav) *
                  attackFactor *
                  skillPower,
              1
            );
          };
          skillInfo.range = [1, 1000];
          break;
      }
    } else if (attackerClass === "heal") {
      switch (skillId) {
        // Jet de foudre
        case 1:
          skillFormula = function (mav, variation) {
            return floorMultiplication(
              60 +
                5 * lv +
                (8 * int + 2 * dex + 8 * mav + variation) *
                  attackFactor *
                  skillPower,
              1
            );
          };
          skillInfo.weaponBonus = [6, 10];
          skillInfo.range = [5 * int, 15 * int];
          improvedByBonus = true;
          break;
        // Invocation de foudre
        case 2:
          skillFormula = function (mav, variation) {
            return floorMultiplication(
              40 +
                4 * lv +
                (13 * int + 2 * str + 10 * mav + variation) *
                  attackFactor *
                  skillPower,
              1
            );
          };
          skillInfo.weaponBonus = [6, 10];
          skillInfo.range = [5 * int, 16 * int];
          improvedByBonus = true;
          improvedBySkillBonus = true;
          break;
        // Griffe de foudre
        case 3:
          skillFormula = function (mav, variation) {
            return floorMultiplication(
              50 +
                5 * lv +
                (8 * int + 2 * str + 8 * mav + variation) *
                  attackFactor *
                  skillPower,
              1
            );
          };
          skillInfo.range = [1, 800];
          improvedByBonus = true;
          break;
      }
    } else if (attackerClass === "lycan") {
      switch (skillId) {
        // Déchiqueter
        // case 1:
        //   skillFormula = function (atk) {
        //     return floorMultiplication(
        //       1.1 * atk + (0.3 * atk + 1.5 * str) * skillPower,
        //       1
        //     );
        //   };
        //   skillInfo.weaponBonus = [5, 54];
        //   improvedByBonus = true;
        //   break;
        // Souffle de loup
        case 2:
          skillFormula = function (atk) {
            return floorMultiplication(
              2 * atk + (atk + 3 * dex + 5 * str + vit) * skillPower,
              1
            );
          };
          skillInfo.weaponBonus = [5, 35];
          improvedByBonus = true;
          improvedBySkillBonus = true;
          break;
        // Bond de loup
        case 3:
          skillFormula = function (atk) {
            return floorMultiplication(
              atk + (1.6 * atk + 200 + 7 * dex + 7 * str) * skillPower,
              1
            );
          };
          skillInfo.weaponBonus = [5, 35];
          improvedByBonus = true;
          break;
        // Griffe de loup
        case 4:
          skillFormula = function (atk) {
            return floorMultiplication(
              3 * atk + (0.8 * atk + 6 * str + 2 * dex + vit) * skillPower,
              1
            );
          };
          improvedByBonus = true;
          break;
        // Tempête cinglante
        case 9:
          skillFormula = function (atk, variation) {
            return floorMultiplication(
              1.8 * atk +
                (atk + 6 * dex + variation + 3 * str + lv) * skillPower,
              1
            );
          };
          skillInfo.range = [1, 1000];
          break;
      }
    }
    if (improvedBySkillBonus) {
      skillInfo.skillBonus =
        16 * getSkillPower(attacker.skillBonus, skillPowerTable);

      var skillWardChoice = victim.skillWardChoice;

      if (skillWardChoice && skillWardChoice === attackerClass) {
        skillInfo.skillWard =
          24 * getSkillPower(victim.skillWard, skillPowerTable);
      }
    }

    if (improvedByBonus) {
      skillInfo.skillBonusByBonus = attacker["skillBonus" + skillId];
    }

    if (removeSkillVariation) {
      var averageVariation = (skillInfo.range[0] + skillInfo.range[0]) / 2;
      skillInfo.range = [averageVariation, averageVariation];
    }
  } else {
    var skillPower = getSkillPower(
      attacker["horseSkill" + skillId],
      skillPowerTable
    );

    switch (skillId) {
      // Combat équestre
      case 137:
        skillFormula = function (atk) {
          return floorMultiplication(atk + 2 * atk * skillPower, 1);
        };
        break;
      // Charge à cheval
      case 138:
        skillFormula = function (atk) {
          return floorMultiplication(
            2.4 * (200 + 1.5 * lv) + 600 * skillPower,
            1
          );
        };
        break;
      // Vague de Pouvoir
      case 139:
        skillFormula = function (atk) {
          return floorMultiplication(
            2 * (200 + 1.5 * lv) + 600 * skillPower,
            1
          );
        };
        break;
      // Grêle de flèches
      case 140:
        skillFormula = function (atk) {
          return floorMultiplication(atk + 2 * atk * skillPower, 1);
        };
        break;
    }
  }

  updateBattleValues(battleValues, skillFormula, skillInfo);
}

function calcMagicAttackValueAugmentation(
  magicAttackValueWeapon,
  magicAttackValueBonus
) {
  if (magicAttackValueBonus) {
    return Math.max(
      1,
      0.0025056 *
        magicAttackValueBonus ** 0.602338 *
        magicAttackValueWeapon ** 1.20476
    );
  }
  return 0;
}

function getMagicAttackValueAugmentation(
  minMagicAttackValue,
  maxMagicAttackValue,
  magicAttackValueBonus
) {
  var magicAttackValueAugmentation = [];

  for (
    var magicAttackValue = minMagicAttackValue;
    magicAttackValue <= maxMagicAttackValue;
    magicAttackValue++
  ) {
    magicAttackValueAugmentation.push(
      calcMagicAttackValueAugmentation(magicAttackValue, magicAttackValueBonus)
    );
  }

  return magicAttackValueAugmentation;
}

function calcPhysicalDamages(battleValues) {
  var {
    attackFactor,
    mainAttackValue,
    attackValues: { minAttackValue, maxAttackValue, attackValueOther, weights },
    bonusValues,
    damagesTypeCombinaison,
  } = battleValues;

  var damagesWeightedByType = {};

  if (bonusValues.missPercentage) {
    damagesWeightedByType.miss = bonusValues.missPercentage / 100;
  }

  for (var damagesType of damagesTypeCombinaison) {
    if (!damagesType.weight) {
      continue;
    }

    var damagesWeighted = {};
    damagesWeightedByType[damagesType.name] = damagesWeighted;

    for (
      var attackValue = minAttackValue;
      attackValue <= maxAttackValue;
      attackValue++
    ) {
      var weight = weights[attackValue - minAttackValue] * damagesType.weight;

      var secondaryAttackValue = 2 * attackValue + attackValueOther;
      var rawDamages =
        mainAttackValue +
        floorMultiplication(attackFactor, secondaryAttackValue);

      var damagesWithPrimaryBonuses = calcDamageWithPrimaryBonuses(
        rawDamages,
        bonusValues
      );

      var minPiercingDamages =
        damagesWithPrimaryBonuses -
        bonusValues.defenseBoost -
        bonusValues.defenseMarriage;

      if (minPiercingDamages <= 2) {
        for (var damages = 1; damages <= 5; damages++) {
          var finalDamages = calcDamageWithSecondaryBonuses(
            damages,
            bonusValues,
            damagesType,
            minPiercingDamages,
            damagesWithPrimaryBonuses
          );

          addKeyValue(damagesWeighted, finalDamages, weight / 5);
        }
      } else {
        var finalDamages = calcDamageWithSecondaryBonuses(
          minPiercingDamages,
          bonusValues,
          damagesType,
          minPiercingDamages,
          damagesWithPrimaryBonuses
        );

        addKeyValue(damagesWeighted, finalDamages, weight);
      }
    }
  }

  return damagesWeightedByType;
}

function calcPhysicalSkillDamages(battleValues) {
  var {
    attackFactor,
    mainAttackValue,
    attackValues: { minAttackValue, maxAttackValue, attackValueOther, weights },
    bonusValues,
    damagesTypeCombinaison,
    skillFormula,
    skillRange: [minVariation, maxVariation],
  } = battleValues;

  var damagesWeightedByType = {};

  for (var damagesType of damagesTypeCombinaison) {
    if (!damagesType.weight) {
      continue;
    }

    var damagesWeighted = {};
    var savedDamages = {};

    damagesWeightedByType[damagesType.name] = damagesWeighted;

    for (
      var attackValue = minAttackValue;
      attackValue <= maxAttackValue;
      attackValue++
    ) {
      var weight = weights[attackValue - minAttackValue] * damagesType.weight;

      var secondaryAttackValue = 2 * attackValue + attackValueOther;
      var rawDamages =
        mainAttackValue +
        floorMultiplication(attackFactor, secondaryAttackValue);

      var damagesWithPrimaryBonuses = calcDamageWithPrimaryBonuses(
        rawDamages,
        bonusValues
      );

      for (
        var variation = minVariation;
        variation <= maxVariation;
        variation++
      ) {
        if (damagesWithPrimaryBonuses <= 2) {
          for (var damages = 1; damages <= 5; damages++) {
            var damagesWithFormula = skillFormula(
              damages * bonusValues.useDamages,
              variation
            );

            damagesWithFormula = Math.floor(
              (damagesWithFormula * bonusValues.weaponBonusCoeff) / 100
            );

            var finalDamages = calcSkillDamageWithSecondaryBonuses(
              damagesWithFormula,
              bonusValues,
              damagesType,
              damagesWithPrimaryBonuses
            );

            addKeyValue(damagesWeighted, finalDamages, weight / 5);
          }
        } else {
          var damagesWithFormula = skillFormula(
            damagesWithPrimaryBonuses * bonusValues.useDamages,
            variation
          );

          if (savedDamages.hasOwnProperty(damagesWithFormula)) {
            var finalDamages = savedDamages[damagesWithFormula];
            damagesWeighted[finalDamages] += weight;
            continue;
          }

          var finalDamages = Math.floor(
            (damagesWithFormula * bonusValues.weaponBonusCoeff) / 100
          );

          finalDamages = calcSkillDamageWithSecondaryBonuses(
            finalDamages,
            bonusValues,
            damagesType,
            damagesWithPrimaryBonuses
          );

          savedDamages[damagesWithFormula] = finalDamages;
          addKeyValue(damagesWeighted, finalDamages, weight);
        }
      }
    }
  }

  return damagesWeightedByType;
}

function calcMagicSkillDamages(battleValues) {
  var {
    attackValues: {
      minMagicAttackValue,
      maxMagicAttackValue,
      magicAttackValueAugmentation,
      weights,
    },
    bonusValues,
    damagesTypeCombinaison,
    skillFormula,
    skillRange: [minVariation, maxVariation],
  } = battleValues;

  var damagesWeightedByType = {};

  for (var damagesType of damagesTypeCombinaison) {
    if (!damagesType.weight) {
      continue;
    }

    var damagesWeighted = {};
    var savedDamages = {};

    damagesWeightedByType[damagesType.name] = damagesWeighted;

    for (
      var magicAttackValue = minMagicAttackValue;
      magicAttackValue <= maxMagicAttackValue;
      magicAttackValue++
    ) {
      var index = magicAttackValue - minMagicAttackValue;
      var weight = weights[index] * damagesType.weight;

      for (
        var variation = minVariation;
        variation <= maxVariation;
        variation++
      ) {
        var rawDamages = skillFormula(
          magicAttackValue + magicAttackValueAugmentation[index],
          variation
        );

        if (savedDamages.hasOwnProperty(rawDamages)) {
          var finalDamages = savedDamages[rawDamages];
          damagesWeighted[finalDamages] += weight;
          continue;
        }

        var damagesWithPrimaryBonuses = Math.floor(
          (rawDamages * bonusValues.weaponBonusCoeff) / 100
        );

        damagesWithPrimaryBonuses = calcDamageWithPrimaryBonuses(
          damagesWithPrimaryBonuses,
          bonusValues
        );

        if (damagesWithPrimaryBonuses <= 2) {
          for (var damages = 1; damages <= 5; damages++) {
            var finalDamages = calcSkillDamageWithSecondaryBonuses(
              damages,
              bonusValues,
              damagesType,
              damagesWithPrimaryBonuses
            );
            addKeyValue(damagesWeighted, finalDamages, weight / 5);
          }
        } else {
          var finalDamages = calcSkillDamageWithSecondaryBonuses(
            damagesWithPrimaryBonuses,
            bonusValues,
            damagesType,
            damagesWithPrimaryBonuses
          );

          savedDamages[rawDamages] = finalDamages;
          addKeyValue(damagesWeighted, finalDamages, weight);
        }
      }
    }
  }

  return damagesWeightedByType;
}

function calcDamages(
  attacker,
  victim,
  attackType,
  battle,
  removeSkillVariation
) {
  var damagesCalculator, skillId, skillType;

  if (attackType === "physical") {
    damagesCalculator = calcPhysicalDamages;
  } else if (attackType.startsWith("attackSkill")) {
    skillId = Number(attackType.split("attackSkill")[1]);

    if (isMagicClass(attacker) || isDispell(attacker, skillId)) {
      skillType = "magic";
      damagesCalculator = calcMagicSkillDamages;
    } else {
      skillType = "physical";
      damagesCalculator = calcPhysicalSkillDamages;
    }
  } else if (attackType.startsWith("horseSkill")) {
    skillType = "physical";
    skillId = Number(attackType.split("horseSkill")[1]);
    damagesCalculator = calcPhysicalSkillDamages;
  }

  var battleValues = createBattleValues(attacker, victim, battle, skillType);

  if (skillId) {
    getSkillFormula(battle, skillId, battleValues, removeSkillVariation);
  }

  var {
    attackValues: { totalCardinal, possibleDamagesCount },
  } = battleValues;

  return {
    damagesWeightedByType: damagesCalculator(battleValues),
    totalCardinal: totalCardinal,
    possibleDamagesCount: possibleDamagesCount,
    skillType: skillType,
  };
}

function damagesWithoutVariation(
  attacker,
  victim,
  attackType,
  battle,
  characters
) {
  startDamagesTime = performance.now();

  var {
    damagesWeightedByType,
    totalCardinal,
    possibleDamagesCount,
    skillType,
  } = calcDamages(attacker, victim, attackType, battle);

  endDamagesTime = performance.now();

  possibleDamagesCount = displayResults(
    possibleDamagesCount,
    totalCardinal,
    damagesWeightedByType,
    battle,
    attacker.name,
    victim.name
  );

  endDisplayTime = performance.now();

  displayFightInfo(
    possibleDamagesCount,
    endDamagesTime - startDamagesTime,
    endDisplayTime - endDamagesTime,
    battle
  );
  addPotentialErrorInformation(
    battle.errorInformation,
    attacker,
    victim,
    skillType,
    characters
  );

  hideElement(battle.bonusVariationResultContainer);
  showElement(battle.fightResultTitle);
  showElement(battle.fightResultContainer);
}

function damagesWithVariation(
  attacker,
  victim,
  attackType,
  battle,
  entity,
  entityVariation
) {
  startTime = performance.now();
  var damagesByBonus = [];
  var augmentationByBonus = [];
  var {
    bonusVariationMinValue: minVariation,
    bonusVariationMaxValue: maxVariation,
  } = entity;
  var step = Math.ceil((maxVariation - minVariation + 1) / 500);
  var simulationCount = 0;
  var simulationTime;

  for (
    var bonusValue = minVariation;
    bonusValue <= maxVariation;
    bonusValue += step
  ) {
    entity[entityVariation] = bonusValue;

    var { damagesWeightedByType, totalCardinal } = calcDamages(
      copyObject(attacker),
      copyObject(victim),
      attackType,
      battle,
      true
    );

    var meanDamages = calcMeanDamages(damagesWeightedByType, totalCardinal);

    if (bonusValue === minVariation) {
      var firstDamages = Math.max(meanDamages, 1e-3);
    }

    damagesByBonus.push({ x: bonusValue, y: meanDamages });
    augmentationByBonus.push({
      x: bonusValue,
      y: meanDamages / firstDamages - 1,
    });
    simulationCount++;
  }

  endTime = performance.now();

  battle.damagesByBonus = damagesByBonus.concat(entityVariation);

  addToBonusVariationChart(
    damagesByBonus,
    augmentationByBonus,
    entity.bonusVariationDisplay,
    battle.bonusVariationChart
  );

  simulationCount = battle.numberFormats.default.format(simulationCount);
  simulationTime = battle.numberFormats.second.format(
    (endTime - startTime) / 1000
  );

  battle.simulationCounter.textContent = simulationCount;
  battle.simulationTime.textContent = simulationTime;

  hideElement(battle.fightResultContainer);
  showElement(battle.fightResultTitle);
  showElement(battle.bonusVariationResultContainer);

  if (
    isChecked(attacker.useBonusVariation) &&
    isChecked(victim.useBonusVariation)
  ) {
    showElement(battle.errorInformation["attacker-victim-variation"]);
  } else {
    hideElement(battle.errorInformation["attacker-victim-variation"]);
  }
}

function changeMonsterValues(monster, instance, attacker) {
  switch (instance) {
    case "SungMahiTower":
      var sungMahiFloor = 1;
      var sungMahiStep = 1;
      var rawDefense = 120;

      if (isPC(attacker)) {
        sungMahiFloor = attacker.sungMahiFloor;
        sungMahiStep = attacker.sungMahiStep;
      }

      if (monster.rank === 5) {
        monster.level = 121;
        monster.dex = 75;
        rawDefense += 1;
      } else if (monster.rank === 6) {
        monster.level = 123;
        monster.dex = 75;
        rawDefense += 1;
      } else {
        monster.level = 120;
        monster.dex = 68;
      }
      monster.vit = 100;
      monster.rawDefense = rawDefense + (sungMahiStep - 1) * 6;
      monster.fistDefense = 0;
      monster.swordDefense = 0;
      monster.twoHandedSwordDefense = 0;
      monster.daggerDefense = 0;
      monster.bellDefense = 0;
      monster.fanDefense = 0;
      monster.arrowDefense = 0;
      monster.clawDefense = 0;
      monster.magicResistance = 0;
      monster.fireResistance = -20;
  }

  // Alastor
  if (monster.vnum === 6790) {
    monster.iceResistance = 0;
    monster.iceBonus = 0;
    monster.lightningResistance = -10;
    monster.lightningBonus = 65;
  }
}

function createWeapon(vnum) {
  var weapon = copyObject(weaponData[vnum]);
  var serpentVnums = [360, 380, 1210, 2230, 3250, 5200, 6150, 7330];
  var weaponValues = weapon[1];
  var isSerpent = isValueInArray(Number(vnum), serpentVnums);
  var isSpecial = Array.isArray(weaponValues[0]);
  var isMagic;

  if (isSpecial) {
    isMagic = weaponValues[0][1] > 0;
  } else {
    isMagic = weaponValues[1] > 0;
  }

  return {
    type: weapon[0],
    maxUpgrade: weapon[2].length - 1,
    isSerpent: isSerpent,
    isMagic: isMagic,
    getValues: function (upgrade) {
      var currentWeaponValues = weaponValues;

      if (upgrade === undefined) {
        // rare bug when weaponUpgrade is deleted
        console.warn("WeaponUpgrade is missing.");
        upgrade = this.maxUpgrade;
      }
      upgrade = Math.min(upgrade, this.maxUpgrade);

      if (isSpecial) {
        currentWeaponValues = weaponValues[upgrade];
      }

      this.minAttackValue = currentWeaponValues[2];
      this.maxAttackValue = currentWeaponValues[3];
      this.minMagicAttackValue = currentWeaponValues[0];
      this.maxMagicAttackValue = currentWeaponValues[1];
      this.growth = weapon[2][upgrade];
    },
  };
}

function createMonster(monsterVnum, attacker, polymorphMonster) {
  var monsterAttributes = monsterData[monsterVnum];

  var monster = {
    vnum: Number(monsterVnum),
    name: monsterAttributes[36],
    rank: monsterAttributes[0],
    race: monsterAttributes[1],
    attack: monsterAttributes[2],
    level: monsterAttributes[3],
    type: monsterAttributes[4],
    str: monsterAttributes[5],
    dex: monsterAttributes[6],
    vit: monsterAttributes[7],
    int: monsterAttributes[8],
    minAttackValue: monsterAttributes[9],
    maxAttackValue: monsterAttributes[10],
    rawDefense: monsterAttributes[11],
    criticalHit: monsterAttributes[12],
    piercingHit: monsterAttributes[13],
    fistDefense: monsterAttributes[14],
    swordDefense: monsterAttributes[15],
    twoHandedSwordDefense: monsterAttributes[16],
    daggerDefense: monsterAttributes[17],
    bellDefense: monsterAttributes[18],
    fanDefense: monsterAttributes[19],
    arrowDefense: monsterAttributes[20],
    clawDefense: monsterAttributes[21],
    fireResistance: monsterAttributes[22],
    lightningResistance: monsterAttributes[23],
    magicResistance: monsterAttributes[24],
    windResistance: monsterAttributes[25],
    lightningBonus: monsterAttributes[26],
    fireBonus: monsterAttributes[27],
    iceBonus: monsterAttributes[28],
    windBonus: monsterAttributes[29],
    earthBonus: monsterAttributes[30],
    darknessBonus: monsterAttributes[31],
    darknessResistance: monsterAttributes[32],
    iceResistance: monsterAttributes[33],
    earthResistance: monsterAttributes[34],
    damageMultiplier: monsterAttributes[35],
  };

  // monster.instance = 0;

  // if (attacker && monster.instance === 0) {
  //   changeMonsterValues(monster, "SungMahiTower", attacker);
  // }
  if (!polymorphMonster) {
    changeMonsterValues(monster);
  }

  monster.defense = monster.rawDefense + monster.level + monster.vit;

  return monster;
}

function addPotentialErrorInformation(
  errorInformation,
  attacker,
  victim,
  skillType,
  characters
) {
  for (var error of Object.values(errorInformation)) {
    hideElement(error);
  }

  if (isPC(attacker)) {
    if (isRiding(attacker)) {
      if (attacker.horsePoint === 0) {
        showElement(errorInformation["horse-level"]);
      }
      showElement(errorInformation["horse-stat"]);
    }

    if (isPolymorph(attacker)) {
      if (attacker.polymorphPoint === 0) {
        showElement(errorInformation["polymorph-level"]);
      }

      if (
        (attacker.polymorphPoint <= 39 && attacker.attackValuePercent <= 199) ||
        (attacker.polymorphPoint === 40 && attacker.attackValuePercent <= 299)
      ) {
        showElement(errorInformation["polymorph-bonus"]);
      }
    }
    if (skillType === "magic") {
      if (attacker.magicAttackValue) {
        showElement(errorInformation["magic-attack-value-bonus"]);
      }
      if (victim.magicResistance) {
        showElement(errorInformation["magic-resistance"]);
      }
    }
  } else {
    showElement(errorInformation["monster-attacker"]);
    if (isMagicAttacker(attacker) && victim.magicResistance) {
      showElement(errorInformation["magic-resistance"]);
    }
  }

  if (isPC(victim)) {
    if (isRiding(victim)) {
      showElement(errorInformation["horse-stat"]);
    }
    if (isPolymorph(victim)) {
      if (attacker.polymorphPoint === 0) {
        showElement(errorInformation["polymorph-level"]);
      }
      showElement(errorInformation["polymorph-defense"]);
    }
  }

  if (characters.unsavedChanges) {
    showElement(errorInformation["save"]);
  }
}

function reduceChartPointsListener(battle) {
  var {
    reduceChartPointsContainer,
    reduceChartPoints,
    numberFormats: { second: numberFormat },
    displayTime,
  } = battle;

  reduceChartPoints.addEventListener("change", function () {
    reduceChartPoints.disabled = true;

    var startDisplayTime = performance.now();
    var scatterDataByType = battle.scatterDataByType;
    var {
      chart,
      maxPoints,
      chart: {
        data: { datasets },
      },
    } = battle.damagesChart;
    var addAnimations = false;

    for (var index = 0; index < datasets.length; index++) {
      var dataset = datasets[index];
      var scatterData = scatterDataByType[dataset.name];

      if (dataset.canBeReduced && reduceChartPoints.checked) {
        dataset.data = aggregateDamages(scatterData, maxPoints);
        addAnimations = true;
      } else {
        dataset.data = scatterData;
      }
    }

    handleChartAnimations(chart, addAnimations);
    chart.update();

    displayTime.textContent = numberFormat.format(
      (performance.now() - startDisplayTime) / 1000
    );

    setTimeout(function () {
      reduceChartPoints.disabled = false;
    }, 1000);
  });

  reduceChartPointsContainer.addEventListener("pointerup", function (event) {
    if (event.pointerType === "mouse") {
      if (event.target.closest("label")) {
        return;
      }
      reduceChartPoints.click();
    }
  });
}

function downloadRawDataListener(battle) {
  var { downLoadRawData, downLoadRawDataVariation } = battle;
  var fileType = "text/csv;charset=utf-8;";

  downLoadRawData.addEventListener("click", function () {
    var damagesWeightedByType = battle.damagesWeightedByType;
    var filename = "raw_damages.csv";
    var csvContent = "damage,probabilities,damageType\n";

    for (var damagesType in damagesWeightedByType) {
      var damagesWeighted = damagesWeightedByType[damagesType];

      for (var damages in damagesWeighted) {
        csvContent +=
          damages + "," + damagesWeighted[damages] + "," + damagesType + "\n";
      }
    }

    downloadData(csvContent, fileType, filename);
  });

  downLoadRawDataVariation.addEventListener("click", function () {
    var damagesByBonus = battle.damagesByBonus;
    var damagesByBonusLength = damagesByBonus.length;
    var filename = "damages_variation.csv";

    if (!damagesByBonusLength) {
      return;
    }

    var csvContent =
      damagesByBonus[damagesByBonusLength - 1] + ",averageDamage\n";

    for (var index = 0; index < damagesByBonusLength - 1; index++) {
      var row = damagesByBonus[index];

      csvContent += row.x + "," + row.y + "\n";
    }

    downloadData(csvContent, fileType, filename);
  });
}

function displayResults(
  possibleDamagesCount,
  totalCardinal,
  damagesWeightedByType,
  battle,
  attackerName,
  victimName
) {
  var [
    meanDamages,
    minDamages,
    maxDamages,
    scatterDataByType,
    possibleDamagesCount,
    uniqueDamagesCount,
  ] = prepareDamagesData(
    damagesWeightedByType,
    possibleDamagesCount,
    totalCardinal
  );

  addToDamagesChart(
    scatterDataByType,
    battle.damagesChart,
    battle.reduceChartPoints.checked
  );
  updateDamagesChartDescription(
    battle.uniqueDamagesCounters,
    uniqueDamagesCount,
    battle.numberFormats.default
  );
  displayFightResults(
    battle,
    attackerName,
    victimName,
    meanDamages,
    minDamages,
    maxDamages
  );
  battle.damagesWeightedByType = damagesWeightedByType;
  battle.scatterDataByType = scatterDataByType;

  return possibleDamagesCount;
}

function displayFightResults(
  battle,
  attackerName,
  victimName,
  meanDamages,
  minDamages,
  maxDamages
) {
  var {
    tableResultFight,
    tableResultHistory,
    savedFights,
    numberFormats: { default: numberFormat },
    deleteFightTemplate,
  } = battle;

  hideElement(tableResultHistory.rows[1]);

  var valuesToDisplay = [
    attackerName,
    victimName,
    battle.battleChoice.attackType.selectedText,
    meanDamages,
    minDamages,
    maxDamages,
  ];

  savedFights.push(valuesToDisplay);
  updateSavedFights(savedFights);

  editTableResultRow(tableResultFight.rows[1], valuesToDisplay, numberFormat);
  addRowToTableResultHistory(
    tableResultHistory,
    valuesToDisplay,
    deleteFightTemplate,
    numberFormat
  );
}

function displayFightInfo(
  possibleDamagesCount,
  damagesTime,
  displayTime,
  battle
) {
  var container = battle.possibleDamagesCounter.parentElement;

  if (possibleDamagesCount <= 1) {
    hideElement(container);
    return;
  } else {
    showElement(container);
  }

  var { numberFormats, possibleDamagesCounter, damagesTime, displayTime } =
    battle;

  possibleDamagesCount = numberFormats.default.format(possibleDamagesCount);
  damagesTime = numberFormats.second.format(damagesTime / 1000);
  displayTime = numberFormats.second.format(displayTime / 1000);

  possibleDamagesCounter.textContent = possibleDamagesCount;
  damagesTime.textContent = damagesTime;
  displayTime.textContent = displayTime;
}

function parseTypeAndName(data) {
  [type, nameOrVnum] = splitFirst(data, "-");

  return {
    type: type,
    nameOrVnum: nameOrVnum,
    isCharacter: type === "character",
  };
}

function isCharacterSelected(characterName, selected) {
  if (!selected) {
    return false;
  }

  var { nameOrVnum, isCharacter } = parseTypeAndName(selected);

  return nameOrVnum === characterName && isCharacter;
}

function useBonusVariationMode(character, variation) {
  return (
    isChecked(character.useBonusVariation) &&
    character.hasOwnProperty(variation) &&
    character.bonusVariationMinValue < character.bonusVariationMaxValue
  );
}

function createBattle(characters, battle) {
  var battleChoice = battle.battleChoice;
  var battleForm = battleChoice.form;

  battleForm.addEventListener("change", handleBattleFormChange);
  battleForm.addEventListener("submit", handleBattleFormSubmit);

  function handleBattleFormChange(event) {
    var target = event.target;
    var { name: targetName, value: targetValue, type: targetType } = target;

    if (targetType !== "radio") {
      return;
    }

    if (targetName === "attackType") {
      battleChoice.attackType.selectedText =
        target.previousElementSibling.dataset.o;
    } else {
      updateBattleChoiceButton(battleChoice, targetName, targetValue);

      if (targetName === "attacker") {
        filterAttackTypeSelection(characters, battleChoice, targetValue);
      }
    }
  }

  function handleBattleFormSubmit(event) {
    event.preventDefault();

    // auto save
    if (characters.unsavedChanges) {
      characters.saveButton.click();
    }

    var battleInfo = new FormData(event.target);
    var attackerData = battleInfo.get("attacker");
    var attackType = battleInfo.get("attackType");
    var victimData = battleInfo.get("victim");
    var attackerVariation;
    var victimVariation;

    if (!attackerData && !attackType && !victimData) {
      return;
    }

    var { nameOrVnum: attackerNameOrVnum, isCharacter: attackerIsPlayer } =
      parseTypeAndName(attackerData);
    var { nameOrVnum: victimNameOrVnum, isCharacter: victimIsPlayer } =
      parseTypeAndName(victimData);

    if (attackerIsPlayer) {
      var attacker = copyObject(characters.savedCharacters[attackerNameOrVnum]);
      attackerVariation = attacker.bonusVariation;
    } else {
      var attacker = createMonster(attackerNameOrVnum);
    }

    if (victimIsPlayer) {
      var victim = copyObject(characters.savedCharacters[victimNameOrVnum]);
      victimVariation = victim.bonusVariation;
    } else {
      var victim = createMonster(victimNameOrVnum, attacker);
    }

    if (useBonusVariationMode(attacker, attackerVariation)) {
      damagesWithVariation(
        attacker,
        victim,
        attackType,
        battle,
        attacker,
        attackerVariation
      );
    } else if (useBonusVariationMode(victim, victimVariation)) {
      damagesWithVariation(
        attacker,
        victim,
        attackType,
        battle,
        victim,
        victimVariation
      );
    } else {
      damagesWithoutVariation(attacker, victim, attackType, battle, characters);
    }
  }
}

function createMapping() {
  mapping = {
    typeFlag: [
      "animalBonus", // 0
      "humanBonus", // 1
      "orcBonus", // 2
      "mysticBonus", // 3
      "undeadBonus", // 4
      "insectBonus", // 5
      "desertBonus", // 6
      "devilBonus", // 7
    ],
    raceBonus: {
      warrior: "warriorBonus",
      sura: "suraBonus",
      ninja: "ninjaBonus",
      shaman: "shamanBonus",
      lycan: "lycanBonus",
    },
    raceResistance: {
      warrior: "warriorResistance",
      sura: "suraResistance",
      ninja: "ninjaResistance",
      shaman: "shamanResistance",
      lycan: "lycanResistance",
    },
    defenseWeapon: [
      "swordDefense", // 0
      "daggerDefense", // 1
      "arrowDefense", // 2
      "twoHandedSwordDefense", // 3
      "bellDefense", // 4
      "clawDefense", // 5
      "fanDefense", // 6
      "swordDefense", // 7
      "fistDefense", // 8
    ],
    breakWeapon: [
      "breakSwordDefense", // 0
      "breakDaggerDefense", // 1
      "breakArrowDefense", // 2
      "breakTwoHandedSwordDefense", // 3
      "breakBellDefense", // 4
      "breakClawDefense", // 5
      "breakFanDefense", // 6
      "breakSwordDefense", // 7
    ],
    elementBonus: [
      "fireBonus", // 0
      "iceBonus", // 1
      "windBonus", // 2
      "lightningBonus", // 3
      "earthBonus", // 4
      "darknessBonus", // 5
    ],
    elementResistance: [
      "fireResistance", // 0
      "iceResistance", // 1
      "windResistance", // 2
      "lightningResistance", // 3
      "earthResistance", // 4
      "darknessResistance", // 5
    ],
  };
  return mapping;
}

function createConstants() {
  var constants = {
    polymorphPowerTable: [
      10, 11, 11, 12, 13, 13, 14, 15, 16, 17, 18, 19, 20, 22, 23, 24, 26, 27,
      29, 31, 33, 35, 37, 39, 41, 44, 46, 49, 52, 55, 59, 62, 66, 70, 74, 79,
      84, 89, 94, 100, 0,
    ],
    skillPowerTable: [
      0, 0.05, 0.06, 0.08, 0.1, 0.12, 0.14, 0.16, 0.18, 0.2, 0.22, 0.24, 0.26,
      0.28, 0.3, 0.32, 0.34, 0.36, 0.38, 0.4, 0.5, 0.52, 0.54, 0.56, 0.58, 0.6,
      0.63, 0.66, 0.69, 0.72, 0.82, 0.85, 0.88, 0.91, 0.94, 0.98, 1.02, 1.06,
      1.1, 1.15, 1.25,
    ],
    marriageTable: {
      harmonyEarrings: [4, 5, 6, 8],
      loveEarrings: [4, 5, 6, 8],
      harmonyBracelet: [4, 5, 6, 8],
      loveNecklace: [20, 25, 30, 40],
      harmonyNecklace: [12, 16, 20, 30],
    },
    allowedWeaponsPerRace: {
      warrior: [0, 3, 8],
      ninja: [0, 1, 2, 8],
      sura: [0, 7, 8],
      shaman: [4, 6, 8],
      lycan: [5, 8],
    },
    translation: {
      fr: {
        damages: "Dégâts",
        percentage: "Pourcentage",
        miss: "Miss",
        normalHit: "Coup classique",
        criticalHit: "Coup critique",
        piercingHit: "Coup perçant",
        criticalPiercingHit: "Coup critique perçant",
        damagesRepartition: "Distribution des dégâts",
        averageDamages: "Dégâts moyens",
        damagesAugmentation: "Augmentation des dégâts",
        bonusVariationTitle: [
          "Évolution des dégâts moyens",
          "par rapport à la valeur d'un bonus",
        ],
      },
      en: {
        damages: "Damage",
        percentage: "Percentage",
        miss: "Miss",
        normalHit: "Normal Hit",
        criticalHit: "Critical Hit",
        piercingHit: "Piercing Hit",
        criticalPiercingHit: "Critical Piercing Hit",
        damagesRepartition: "Damage Repartition",
        averageDamages: "Average Damage",
        damagesAugmentation: "Damage Augmentation",
        bonusVariationTitle: [
          "Evolution of Average Damage",
          "Relative to a Bonus Value",
        ],
      },
      tr: {
        damages: "Hasar",
        percentage: "Yüzde",
        miss: "Miss Vuruş",
        normalHit: "Düz Vuruş",
        criticalHit: "Kritik Vuruş",
        piercingHit: "Delici Vuruş",
        criticalPiercingHit: "Kritikli Delici Vuruş",
        damagesRepartition: "Hasar Dağılımı",
        averageDamages: "Ortalama Hasar",
        damagesAugmentation: "Ortalama Hasar Artışı",
        bonusVariationTitle: [
          "Bir bonusun değerine kıyasla",
          "Ortalama Hasar Çizelgesi",
        ],
      },
      ro: {
        damages: "Daune",
        percentage: "Procent",
        miss: "Miss",
        normalHit: "Lovitura normala",
        criticalHit: "Lovitura critica",
        piercingHit: "Lovitura patrunzatoare",
        criticalPiercingHit: "Lovitura critica si patrunzatoare",
        damagesRepartition: "Distribuția daunelor",
        averageDamages: "Media damageului",
        damagesAugmentation: "Damage imbunatatit",
        bonusVariationTitle: [
          "Evolutia mediei damageului",
          "relativ la o valoare bonus",
        ],
      },
      de: {
        damages: "Schäden",
        percentage: "Prozentsatz",
        miss: "Verfehlen",
        normalHit: "Normaler Treffer",
        criticalHit: "Kritischer Treffer",
        piercingHit: "Durchdringender Treffer",
        criticalPiercingHit: "Kritischer durchdringender Treffer",
        damagesRepartition: "Schadensverteilung",
        averageDamages: "Durchschnittlicher Schaden",
        damagesAugmentation: "Schadenserhöhung",
        bonusVariationTitle: [
          "Entwicklung des durchschnittlichen Schadens",
          "im Verhältnis zu einem Bonus",
        ],
      },
      pt: {
        damages: "Dano",
        percentage: "Percentagem",
        miss: "Miss",
        normalHit: "Dano normal",
        criticalHit: "Dano crítico",
        piercingHit: "Dano perfurante",
        criticalPiercingHit: "Dano crítico perfurante",
        damagesRepartition: "Repartição de dano",
        averageDamages: "Dano médio",
        damagesAugmentation: "Aumento de dano",
        bonusVariationTitle: ["Evolução do dano médio", "relativo a um bónus"],
      },
      // es: {
      //   damages: "Daño",
      //   percentage: "Porcentaje",
      //   miss: "Miss",
      //   normalHit: "Daño normal",
      //   criticalHit: "Daño crítico",
      //   piercingHit: "Daño perforante",
      //   criticalPiercingHit: "Daño crítico perforante",
      //   damagesRepartition: "Repartición de daños",
      //   averageDamages: "Daño medio",
      //   damagesAugmentation: "Aumento de daño",
      //   bonusVariationTitle: ["Evolución del daño medio", "Relativo a una bonificación"]
      // },
    },
  };
  return constants;
}

function initResultTableHistory(battle) {
  var {
    tableResultHistory,
    savedFights,
    deleteFightTemplate,
    numberFormats: { default: numberFormat },
  } = battle;
  var startIndex = 3;

  if (savedFights.length) {
    hideElement(tableResultHistory.rows[1]);

    for (var savedFight of savedFights) {
      addRowToTableResultHistory(
        tableResultHistory,
        savedFight,
        deleteFightTemplate,
        numberFormat
      );
    }
  }

  tableResultHistory.addEventListener("click", function (event) {
    var deleteButton = event.target.closest(".svg-icon-delete");

    if (deleteButton) {
      var row = deleteButton.closest("tr");

      if (row) {
        savedFights.splice(row.rowIndex - startIndex, 1);
        updateSavedFights(savedFights);

        row.remove();

        if (tableResultHistory.rows.length === startIndex) {
          showElement(tableResultHistory.rows[1]);
        }
      }
    }
  });
}

function initDamagesChart(battle) {
  var { translation, reduceChartPointsContainer, reduceChartPoints } = battle;
  var percentFormat = battle.numberFormats.percent;
  var customPlugins = {
    id: "customPlugins",
    afterDraw(chart) {
      var missPercentage = chart.data.missPercentage;

      if (!missPercentage) {
        return;
      }

      var {
        ctx,
        chartArea: { top, right },
      } = chart;
      ctx.save();
      var text =
        translation.miss + " : " + percentFormat.format(missPercentage);
      var padding = 4;
      var fontSize = 14;

      ctx.font = fontSize + "px Helvetica Neue";

      var textWidth = ctx.measureText(text).width;
      var xPosition = right - textWidth - 5;
      var yPosition = top + 5;

      ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
      ctx.fillRect(
        xPosition - padding,
        yPosition - padding,
        textWidth + 2 * padding,
        fontSize + 2 * padding
      );

      ctx.strokeStyle = "red";
      ctx.strokeRect(
        xPosition - padding,
        yPosition - padding,
        textWidth + 2 * padding,
        fontSize + 2 * padding
      );

      ctx.fillStyle = "#666";
      ctx.textBaseline = "top";
      ctx.fillText(text, xPosition, yPosition + 1);

      ctx.restore();
    },
  };

  Chart.register(customPlugins);

  var ctx = battle.plotDamages.getContext("2d");
  var maxLabelsInTooltip = 10;
  var nullLabelText = " ...";

  var chart = new Chart(ctx, {
    type: "scatter",
    data: {
      missPercentage: 0,
      datasets: [],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          onHover: function (e) {
            e.native.target.style.cursor = "pointer";
          },
          onLeave: function (e) {
            e.native.target.style.cursor = "default";
          },
          onClick: function (e, legendItem, legend) {
            var currentIndex = legendItem.datasetIndex;
            var ci = legend.chart;
            var isCurrentDatasetVisible = ci.isDatasetVisible(currentIndex);
            var datasets = ci.data.datasets;
            var hideReducePoints = true;
            var isReducePointsChecked = reduceChartPoints.checked;

            datasets[currentIndex].hidden = isCurrentDatasetVisible;
            legendItem.hidden = isCurrentDatasetVisible;

            for (var index in datasets) {
              if (ci.isDatasetVisible(index) && datasets[index].canBeReduced) {
                showElement(reduceChartPointsContainer);
                hideReducePoints = false;
                break;
              }
            }

            if (hideReducePoints) {
              hideElement(reduceChartPointsContainer);
              handleChartAnimations(ci, true);
            } else {
              handleChartAnimations(ci, isReducePointsChecked);
            }

            ci.update();
          },
        },
        title: {
          display: true,
          text: translation.damagesRepartition,
          font: {
            size: 20,
          },
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              if (context.label === null) {
                return nullLabelText;
              }

              var xValue = battle.numberFormats.default.format(
                context.parsed.x
              );
              var yValue = battle.numberFormats.percent.format(
                context.parsed.y
              );

              label =
                " " +
                context.dataset.label +
                " : (" +
                xValue +
                ", " +
                yValue +
                ")";

              return label;
            },
            beforeBody: function (tooltipItems) {
              if (tooltipItems.length > maxLabelsInTooltip + 1) {
                tooltipItems.splice(maxLabelsInTooltip + 1);
                tooltipItems[maxLabelsInTooltip].label = null;
              }
            },
          },
          caretPadding: 10,
        },
      },
      scales: {
        x: {
          type: "linear",
          position: "bottom",
          title: {
            display: true,
            text: translation.damages,
            font: {
              size: 16,
            },
          },
        },
        y: {
          title: {
            display: true,
            text: translation.percentage,
            font: {
              size: 16,
            },
          },
          ticks: {
            format: {
              style: "percent",
            },
          },
        },
      },
      elements: {
        point: {
          borderWidth: 1,
          radius: 3,
          hitRadius: 3,
          hoverRadius: 6,
          hoverBorderWidth: 2,
        },
      },
    },
  });

  var datasetsStyle = [
    {
      name: "normalHit",
      canBeReduced: false,
      label: translation.normalHit,
      backgroundColor: "rgba(75, 192, 192, 0.2)",
      borderColor: "rgba(75, 192, 192, 1)",
    },
    {
      name: "piercingHit",
      canBeReduced: false,
      label: translation.piercingHit,
      backgroundColor: "rgba(192, 192, 75, 0.2)",
      borderColor: "rgba(192, 192, 75, 1)",
    },
    {
      name: "criticalHit",
      canBeReduced: false,
      label: translation.criticalHit,
      backgroundColor: "rgba(192, 75, 192, 0.2)",
      borderColor: "rgba(192, 75, 192, 1)",
    },
    {
      name: "criticalPiercingHit",
      canBeReduced: false,
      label: translation.criticalPiercingHit,
      backgroundColor: "rgba(75, 75, 192, 0.2)",
      borderColor: "rgba(75, 75, 192, 1)",
    },
  ];
  battle.damagesChart = {
    chart: chart,
    datasetsStyle: datasetsStyle,
    maxPoints: 500,
    reduceChartPointsContainer: reduceChartPointsContainer,
  };
}

function initBonusVariationChart(battle) {
  var translation = battle.translation;

  var ctx = battle.plotBonusVariation.getContext("2d");

  var chart = new Chart(ctx, {
    type: "line",
    data: {
      datasets: [
        {
          label: translation.averageDamages,
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          fill: true,
        },
        {
          label: translation.damagesAugmentation,
          backgroundColor: "rgba(192, 192, 75, 0.2)",
          borderColor: "rgba(192, 192, 75, 1)",
          hidden: true,
          yTicksFormat: { style: "percent" },
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          onHover: function (e) {
            e.native.target.style.cursor = "pointer";
          },
          onLeave: function (e) {
            e.native.target.style.cursor = "default";
          },
          onClick: function (e, legendItem, legend) {
            var currentIndex = legendItem.datasetIndex;
            var ci = legend.chart;
            var datasets = ci.data.datasets;
            var isCurrentDatasetVisible = ci.isDatasetVisible(currentIndex);
            var yAxis = ci.options.scales.y;

            var otherIndex = currentIndex === 0 ? 1 : 0;
            var visibleDataset = isCurrentDatasetVisible
              ? datasets[otherIndex]
              : datasets[currentIndex];

            datasets[currentIndex].hidden = isCurrentDatasetVisible;
            datasets[otherIndex].hidden = !isCurrentDatasetVisible;

            yAxis.title.text = visibleDataset.label;
            yAxis.ticks.format = visibleDataset.yTicksFormat;

            ci.update();
          },
        },
        title: {
          display: true,
          text: translation.bonusVariationTitle,
          font: {
            size: 18,
          },
        },
        tooltip: {
          caretPadding: 10,
        },
      },
      scales: {
        x: {
          type: "linear",
          position: "bottom",
          title: {
            display: true,
            text: "Bonus",
            font: {
              size: 16,
            },
          },
          ticks: {
            callback: function (value) {
              if (Number.isInteger(value)) {
                return Number(value);
              }
            },
          },
        },
        y: {
          title: {
            display: true,
            text: translation.averageDamages,
            font: {
              size: 16,
            },
          },
        },
      },
      elements: {
        point: {
          borderWidth: 1,
          radius: 3,
          hitRadius: 3,
          hoverRadius: 6,
          hoverBorderWidth: 2,
        },
      },
    },
  });

  battle.bonusVariationChart = chart;
}

function filterAttackTypeSelection(characters, battleChoice, targetValue) {
  var { nameOrVnum: attackerNameOrVnum, isCharacter: isAttackerPlayer } =
    parseTypeAndName(targetValue);

  if (isAttackerPlayer) {
    var attacker = characters.savedCharacters[attackerNameOrVnum];
    filterAttackTypeSelectionCharacter(attacker, battleChoice.attackType);
  } else {
    filterAttackTypeSelectionMonster(battleChoice.attackType);
  }
}

function getTranslation(translation) {
  var userLanguage = navigator.language;
  var langToUse = "en";

  for (var lang in translation) {
    if (userLanguage.startsWith(lang)) {
      langToUse = lang;
      break;
    }
  }

  return translation[langToUse];
}

function addBattleData(battle) {
  var errorElements = document.querySelectorAll("[data-error]");
  var { elements: attackTypeElements, container: attackTypeContainer } =
    battle.battleChoice.attackType;
  var attackTypeChilds = attackTypeContainer.children;

  for (var index = 0; index < errorElements.length; index++) {
    var errorElement = errorElements[index];
    battle.errorInformation[errorElement.dataset.error] = errorElement;
  }

  for (var index = 1; index < attackTypeChilds.length - 1; index++) {
    var attackTypeChild = attackTypeChilds[index];
    var input = attackTypeChild.querySelector("input");

    attackTypeElements.push({
      container: attackTypeChild,
      input: input,
      inputClass: input.dataset.class,
      inputValue: input.value,
    });
  }
}

function createDamageCalculatorInformation(chartSource) {
  var characters = {
    unsavedChanges: false,
    savedCharacters: {},
    currentCharacter: null,
    savedMonsters: getSavedMonsters(),
    monsterElements: {},
    characterCreation: document.getElementById("character-creation"),
    addNewCharacterButton: document.getElementById("add-new-character"),
    dropZone: document.getElementById("character-drop-zone"),
    characterInput: document.getElementById("character-input"),
    newCharacterTemplate: document.getElementById("new-character-template")
      .children[0],
    charactersContainer: document.getElementById("characters-container"),
    monsterButtonTemplates: document.getElementById("monster-button-templates"),
    monsterTemplate: document.getElementById("new-monster-template")
      .children[0],
    monstersContainer: document.getElementById("monsters-container"),
    monsteriFrame: document.getElementById("monster-iframe"),
    stoneiFrame: document.getElementById("stone-iframe"),
    saveButton: document.getElementById("save-character"),
    weaponCategory: document.getElementById("weapon-category"),
    weaponDisplay: document.getElementById("weapon-display"),
    randomAttackValue: document.getElementById("random-attack-value"),
    randomMagicAttackValue: document.getElementById(
      "random-magic-attack-value"
    ),
    polymorphDisplay: document.getElementById("polymorph-display"),
    polymorphCreation: document.getElementById("polymorph-creation"),
    yoharaCreation: document.getElementById("yohara-creation"),
    rankSelection: document.getElementById("rank-selection"),
    blessingCreation: document.getElementById("blessing-creation"),
    marriageCreation: document.getElementById("marriage-creation"),
    bonusVariation: {
      tabButton: document.getElementById("Variation"),
      checkbox: document.getElementById("use-bonus-variation"),
      input: document.getElementById("bonus-variation"),
      inputName: document.getElementById("bonus-variation-name"),
      container: document.getElementById("bonus-variation-creation"),
      minValue: document.getElementById("bonus-variation-min-value"),
      maxValue: document.getElementById("bonus-variation-max-value"),
      disabledText: document.getElementById("bonus-variation-disabled"),
      selectedText: document.getElementById("bonus-variation-selected"),
      displaySpan: document.getElementById("bonus-variation-display"),
    },
    skillElementsToFilter: document.querySelectorAll(
      "#skill-container [data-class]"
    ),
  };

  for (var [pseudo, character] of Object.entries(getSavedCharacters())) {
    characters.savedCharacters[pseudo] = character;
  }

  var constants = createConstants();

  var battle = {
    savedFights: getSavedFights(),
    battleChoice: {
      buttons: document.querySelectorAll(".dropdown-trigger"),
      resetAttackType: false,
      form: document.getElementById("create-battle"),
      template: document.getElementById("battle-selection-template")
        .children[0],
      raceToImage: {
        warrior: "/images/0/0f/Bandeaurougehomme.png",
        ninja: "/images/0/0e/Queuedechevalclair.png",
        sura: "/images/3/37/Couperespectablerouge.png",
        shaman: "/images/6/6a/Coupeeleganteclairfemme.png",
        lycan: "/images/4/4e/Protectionfrontalerouge.png",
      },
      categories: ["attacker", "victim"],
      attacker: {
        character: {
          count: 0,
          container: document.getElementById("attacker-selection-characters"),
          elements: {},
        },
        monster: {
          count: 0,
          container: document.getElementById("attacker-selection-monsters"),
          elements: {},
        },
        button: document.getElementById("attacker-trigger"),
        defaultButtonContent: document.getElementById(
          "attacker-default-button-content"
        ),
        buttonContent: document.getElementById("attacker-button-content"),
        container: document.getElementById("attacker-selection"),
        selected: null,
      },
      victim: {
        character: {
          count: 0,
          container: document.getElementById("victim-selection-characters"),
          elements: {},
        },
        monster: {
          count: 0,
          container: document.getElementById("victim-selection-monsters"),
          elements: {},
        },
        stone: {
          count: 0,
          container: document.getElementById("victim-selection-stones"),
          elements: {},
        },
        button: document.getElementById("victim-trigger"),
        defaultButtonContent: document.getElementById(
          "victim-default-button-content"
        ),
        buttonContent: document.getElementById("victim-button-content"),
        selected: null,
      },
      attackType: {
        container: document.getElementById("attack-type-selection"),
        elements: [],
        defaultInput: document.getElementById("physical-attack"),
        selectedText: "",
      },
    },
    damagesWeightedByType: {},
    scatterDataByType: {},
    damagesByBonus: [],
    tableResultFight: document.getElementById("result-table-fight"),
    tableResultHistory: document.getElementById("result-table-history"),
    deleteFightTemplate: document.getElementById("delete-fight-template")
      .children[0],
    errorInformation: {},
    fightResultTitle: document.getElementById("fight-result-title"),
    fightResultContainer: document.getElementById("fight-result-container"),
    downLoadRawData: document.getElementById("download-raw-data"),
    downLoadRawDataVariation: document.getElementById(
      "download-raw-data-variation"
    ),
    bonusVariationResultContainer: document.getElementById(
      "bonus-variation-result-container"
    ),
    reduceChartPointsContainer: document.getElementById(
      "reduce-chart-points-container"
    ),
    reduceChartPoints: document.getElementById("reduce-chart-points"),
    plotDamages: document.getElementById("plot-damages"),
    plotBonusVariation: document.getElementById("plot-bonus-variation"),
    uniqueDamagesCounters: document.querySelectorAll(".unique-damages-counter"),
    possibleDamagesCounter: document.getElementById("possible-damages-counter"),
    damagesTime: document.getElementById("damages-time"),
    displayTime: document.getElementById("display-time"),
    simulationCounter: document.getElementById("simulation-counter"),
    simulationTime: document.getElementById("simulation-time"),
    numberFormats: {
      default: new Intl.NumberFormat(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
      }),
      percent: new Intl.NumberFormat(undefined, {
        style: "percent",
        maximumFractionDigits: 3,
      }),
      second: new Intl.NumberFormat(undefined, {
        style: "unit",
        unit: "second",
        unitDisplay: "long",
        maximumFractionDigits: 3,
      }),
    },
    mapping: createMapping(),
    constants: constants,
    translation: getTranslation(constants.translation),
  };

  addBattleData(battle);
  initResultTableHistory(battle);
  addScript(chartSource, function () {
    initDamagesChart(battle);
    initBonusVariationChart(battle);
  });
  reduceChartPointsListener(battle);
  downloadRawDataListener(battle);

  return [characters, battle];
}

function loadStyle(src) {
  var link = document.createElement("link");
  link.href = src;
  link.rel = "stylesheet";

  document.head.appendChild(link);
}

(function () {
  var javascriptSource =
    "/index.php?title=Utilisateur:Ankhseram/Calculator.js&action=raw&ctype=text/javascript";
  var cssSource =
    "/index.php?title=Utilisateur:Ankhseram/Style.css&action=raw&ctype=text/css";
  var chartSource = "https://cdn.jsdelivr.net/npm/chart.js";

  loadStyle(cssSource);

  function main() {
    var [characters, battle] = createDamageCalculatorInformation(chartSource);

    characterManagement(characters, battle);
    monsterManagement(characters, battle);

    updateBattleChoice(characters, battle.battleChoice);
    createBattle(characters, battle);
  }
  addScript(javascriptSource, main);
})();
