function showElement(element) {
  element.classList.remove("tabber-noactive");
}

function hideElement(element) {
  element.classList.add("tabber-noactive");
}

function removeAccent(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function toNormalForm(str) {
  return removeAccent(str)
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .toLowerCase();
}

function pseudoFormat(str) {
  return removeAccent(str).replace(/[^A-Za-z0-9 \(\)\+_-]+/g, "");
}

function isValueInArray(value, array) {
  return array.indexOf(value) !== -1;
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

function floorMultiplication(firstFactor, secondFactor) {
  return Math.floor((firstFactor * secondFactor).toFixed(8));
}

function truncateNumber(number, precision) {
  return Math.floor(number * 10 ** precision) / 10 ** precision;
}

function addKeyValue(object, key, value) {
  if (object.hasOwnProperty(key)) {
    object[key] += value;
  } else {
    object[key] = value;
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

function addToTableResult(
  battle,
  damagesWeightedByType,
  damagesCount,
  totalCardinal
) {
  var numberFormatDefault = battle.numberFormats.default;
  var numberFormatPercent = battle.numberFormats.percent;
  var constants = battle.constants;
  var tableResult = battle.tableResult;
  var noTableResult = battle.noTableResult;
  var displayReducePoints = false;
  var maxPoints = battle.damagesChart.maxPoints;

  function addSpanRow(value) {
    var newRow = tableResult.insertRow(-1);
    var firstCell = newRow.insertCell(0);

    firstCell.textContent = value;
    firstCell.colSpan = 2;

    newRow.style.fontWeight = "bold";
  }

  function addRowWithResults(damages, weight) {
    var newRow = tableResult.insertRow(-1);

    var firstCell = newRow.insertCell(0);
    firstCell.textContent = numberFormatDefault.format(damages);

    var secondCell = newRow.insertCell(1);
    secondCell.textContent = numberFormatPercent.format(weight);
  }

  var translation = battle.translation;
  var minDamages = Infinity;
  var maxDamages = 0;
  var addToTable = damagesCount <= 201;
  var displayThisDamagesType = true;
  var scatterDataByType = {};

  if (addToTable) {
    showElement(tableResult);
    hideElement(noTableResult);

    if (damagesWeightedByType.hasOwnProperty("miss")) {
      addSpanRow(translation.miss);
      addRowWithResults(0, damagesWeightedByType.miss[0]);
    }
  } else {
    hideElement(tableResult);
    showElement(noTableResult);
  }

  constants.damagesTypeOrder.forEach(function (damagesTypeName) {
    if (!damagesWeightedByType.hasOwnProperty(damagesTypeName)) {
      return;
    }

    var firstIteration = true;
    var damagesWeighted = damagesWeightedByType[damagesTypeName];
    var scatterData = [];
    scatterDataByType[damagesTypeName] = {
      display: displayThisDamagesType,
      scatterData: scatterData,
    };

    if (addToTable) {
      addSpanRow(translation[damagesTypeName]);
    }

    for (var damages in damagesWeighted) {
      damages = +damages;

      if (firstIteration) {
        if (damages < minDamages) {
          minDamages = damages;
        }
        firstIteration = false;
      }

      var weight = damagesWeighted[damages] / totalCardinal;
      damagesWeighted[damages] = weight;
      scatterData.push({ x: damages, y: weight });

      if (addToTable) {
        addRowWithResults(damages, weight);
      }
    }

    if (scatterData.length >= 2 * maxPoints) {
      displayReducePoints = true;
    }

    if (damages > maxDamages) {
      maxDamages = damages;
    }

    displayThisDamagesType = false;
  });

  if (minDamages === Infinity) {
    minDamages = 0;
  }

  if (displayReducePoints) {
    showElement(battle.reduceChartPointsContainer);
  } else {
    hideElement(battle.reduceChartPointsContainer);
  }

  return [minDamages, maxDamages, scatterDataByType, displayReducePoints];
}

function aggregateDamages(scatterData, maxPoints, reducePoints) {
  var dataLength = scatterData.length;

  if (dataLength <= 2 * maxPoints || !reducePoints) {
    return scatterData;
  }

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

function addToDamagesChart(scatterDataByType, damagesChart, reducePoints) {
  for (var damagesTypeName in scatterDataByType) {
    var dataset = copyObject(damagesChart.dataset[damagesTypeName]);
    var { display: display, scatterData: scatterData } =
      scatterDataByType[damagesTypeName];

    if (scatterData.length >= 10) {
      dataset.data = aggregateDamages(
        scatterData,
        damagesChart.maxPoints,
        reducePoints
      );
      damagesChart.chart.data.datasets.push(dataset);

      if (display) {
        dataset.hidden = false;
      }
    }
  }
}

function clearDamageChart(damagesChart) {
  damagesChart.chart.data.datasets = [];
}

function displayDamagesChart(damagesChart, chartContainer) {
  if (damagesChart.chart.data.datasets.length) {
    showElement(chartContainer);
    damagesChart.chart.update();
  } else {
    hideElement(chartContainer);
  }
}

function clearTableResult(tableResult) {
  var tableHeaderRowCount = 1;
  var rowCount = tableResult.rows.length;

  for (var rowIndex = tableHeaderRowCount; rowIndex < rowCount; rowIndex++) {
    tableResult.deleteRow(tableHeaderRowCount);
  }
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
  weapon,
  weaponCategory,
  allowedWeaponsPerRace,
  selectValueIsChanged = false
) {
  var allowedWeapons = allowedWeaponsPerRace[selectedRace];

  if (!selectValueIsChanged) {
    var weaponType = weaponData[weapon.value][1];

    if (!isValueInArray(weaponType, allowedWeapons)) {
      weapon.value = 0;
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

function getSelectedWeapon(weaponCategory) {
  return weaponCategory.querySelector("input[type='radio']:checked");
}

function handleWeaponDisplay(weaponDisplay, newWeapon, weaponValue) {
  var newImage = newWeapon.nextElementSibling.cloneNode();
  var newText = document.createElement("span");
  var oldImage = weaponDisplay.firstChild;
  var oldText = oldImage.nextElementSibling;
  var weaponName = weaponData[weaponValue][0];

  if (weaponValue == 0) {
    newText.textContent = " " + weaponName + " ";
  } else {
    var weaponLink = document.createElement("a");
    weaponLink.href = mw.util.getUrl(weaponName);
    weaponLink.title = weaponName;
    weaponLink.textContent = weaponName;

    newText.appendChild(document.createTextNode(" "));
    newText.appendChild(weaponLink);
    newText.appendChild(document.createTextNode(" "));
  }

  weaponDisplay.replaceChild(newImage, oldImage);
  weaponDisplay.replaceChild(newText, oldText);
}

function filterUpgrade(
  selectedRace,
  weaponUpgrade,
  weaponValue,
  randomAttackValue,
  randomMagicAttackValue,
  currentUpgrade
) {
  var weapon = weaponData[weaponValue];

  if (isValueInArray("serpent", weapon[0].toLowerCase())) {
    showElement(randomAttackValue);

    if (selectedRace === "sura" || selectedRace === "shaman") {
      showElement(randomMagicAttackValue);
    }
  } else {
    hideElement(randomAttackValue);
    hideElement(randomMagicAttackValue);
  }

  var upgradeNumber = weapon[3].length;

  if (upgradeNumber <= 1) {
    hideElement(weaponUpgrade.parentElement);
  } else {
    showElement(weaponUpgrade.parentElement);

    weaponUpgrade.innerHTML = "";

    for (var upgrade = 0; upgrade < upgradeNumber; upgrade++) {
      var option = document.createElement("option");
      option.value = upgrade;
      option.textContent = "+" + upgrade;
      weaponUpgrade.appendChild(option);
    }
    if (currentUpgrade === undefined) {
      option.selected = true;
    } else {
      weaponUpgrade.value = currentUpgrade;
      currentUpgrade = undefined;
    }
  }
}

function filterState(selectedState, polymorphMonster) {
  if (selectedState === "polymorph") {
    showElement(polymorphMonster.parentElement);
  } else {
    hideElement(polymorphMonster.parentElement);
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

function filterAttackTypeSelection(attacker, attackTypeSelection) {
  var attackerClass = attacker.class;
  var selectedOption =
    attackTypeSelection.options[attackTypeSelection.selectedIndex];
  var attackerIsNotPolymorph = !isPolymorph(attacker);

  for (var index = 2; index < attackTypeSelection.options.length; index++) {
    var option = attackTypeSelection.options[index];
    var optionClass = option.dataset.class;
    var optionValue = option.value;

    if (
      attackerIsNotPolymorph &&
      attacker[optionValue] &&
      (attackerClass === optionClass ||
        (optionValue.startsWith("horseSkill") &&
          isRiding(attacker) &&
          (!optionClass || isValueInArray(attackerClass, optionClass))))
    ) {
      showElement(option);
    } else {
      hideElement(option);

      if (selectedOption === option) {
        attackTypeSelection.selectedIndex = 0;
      }
    }
  }
}

function filterAttackTypeSelectionMonster(attackTypeSelection) {
  for (var index = 2; index < attackTypeSelection.options.length; index++) {
    hideElement(attackTypeSelection.options[index]);
  }

  if (attackTypeSelection.selectedIndex !== 1) {
    attackTypeSelection.selectedIndex = 0;
  }
}

function filterForm(characters, battle) {
  var characterCreation = characters.characterCreation;
  var allowedWeaponsPerRace = battle.constants.allowedWeaponsPerRace;

  characterCreation.addEventListener("change", function (event) {
    var target = event.target;
    var targetName = target.name;

    switch (targetName) {
      case "race":
        var selectedRace = target.value;
        var classChoice = characterCreation.class;
        var weapon = characterCreation.weapon;

        filterClass(selectedRace, classChoice);
        filterWeapon(
          selectedRace,
          weapon,
          characters.weaponCategory,
          allowedWeaponsPerRace
        );

        var newWeapon = getSelectedWeapon(characters.weaponCategory);
        handleWeaponDisplay(characters.weaponDisplay, newWeapon, weapon.value);
        filterUpgrade(
          selectedRace,
          characterCreation.weaponUpgrade,
          weapon.value,
          characters.randomAttackValue,
          characters.randomMagicAttackValue
        );
        filterSkills(classChoice.value, characters.skillElementsToFilter);

        if (characterCreation.name.value === battle.attackerSelection.value) {
          battle.resetAttackType = true;
        }
        break;
      case "class":
        filterSkills(target.value, characters.skillElementsToFilter);

        if (characterCreation.name.value === battle.attackerSelection.value) {
          battle.resetAttackType = true;
        }
        break;
      case "weapon":
        handleWeaponDisplay(
          characters.weaponDisplay,
          target,
          characterCreation.weapon.value
        );
        filterUpgrade(
          characterCreation.race.value,
          characterCreation.weaponUpgrade,
          target.value,
          characters.randomAttackValue,
          characters.randomMagicAttackValue
        );
        break;
      case "state":
        filterState(target.value, characterCreation.polymorphMonster);
        if (characterCreation.name.value === battle.attackerSelection.value) {
          battle.resetAttackType = true;
        }
        break;
      case "lowRank":
        filterCheckbox(target, characterCreation.playerRank.parentElement);
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
    }

    if (
      targetName.startsWith("attackSkill") ||
      targetName.startsWith("horseSkill")
    ) {
      battle.resetAttackType = true;
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
  return getLocalStorageValue("savedMonstersCalculator", []).filter(function (
    num
  ) {
    return !isNaN(Number(num));
  });
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

  savedCharacters[characterDataObject.name] = characterDataObject;
  updateSavedCharacters(savedCharacters);

  if (newCharacter) {
    addBattleChoice(battle, characterDataObject.name);
  }

  if (battle.resetAttackType) {
    filterAttackTypeSelection(characterDataObject, battle.attackTypeSelection);
    battle.resetAttackType = false;
  }
}

function saveButtonGreen(saveButton) {
  saveButton.classList.remove("unsaved-character");
}

function saveButtonOrange(saveButton) {
  saveButton.classList.add("unsaved-character");
}

function characterCreationListener(characters, battle) {
  characters.characterCreation.addEventListener("submit", function (event) {
    event.preventDefault();

    if (characters.unsavedChanges) {
      saveCharacter(
        characters.savedCharacters,
        characters.characterCreation,
        battle
      );
      saveButtonGreen(characters.saveButton);
      characters.unsavedChanges = false;
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.ctrlKey && event.key === "s") {
      event.preventDefault();
      characters.saveButton.click();
    }
  });
}

function downloadCharacter(character) {
  var content = JSON.stringify(character);
  var link = document.createElement("a");
  var blob = new Blob([content], { type: "text/plain" });
  var blobURL = URL.createObjectURL(blob);

  link.href = blobURL;
  link.download = character.name + ".txt";
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
  battle.battleForm.reset();
  delete characters.savedCharacters[pseudo];
  element.remove();

  updateSavedCharacters(characters.savedCharacters);
  removeBattleChoice(battle, pseudo);

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

function deleteMonster(characters, monsterVnum, element, battle) {
  battle.battleForm.reset();
  characters.savedMonsters.splice(
    characters.savedMonsters.indexOf(monsterVnum),
    1
  );

  if (element) {
    element.remove();
  }

  updateSavedMonsters(characters.savedMonsters);
  removeBattleChoice(battle, monsterVnum);
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
      if (value === "on") {
        formElement.checked = true;
      }
    } else {
      formElement.value = value;
    }
  }
  var selectedRace = characterCreation.race.value;
  var classChoice = characterCreation.class;
  var weapon = characterCreation.weapon;

  filterClass(selectedRace, classChoice, true);
  filterWeapon(
    selectedRace,
    weapon,
    characters.weaponCategory,
    battle.constants.allowedWeaponsPerRace,
    true
  );

  var newWeapon = getSelectedWeapon(characters.weaponCategory);

  handleWeaponDisplay(characters.weaponDisplay, newWeapon, weapon.value);
  filterUpgrade(
    selectedRace,
    characterCreation.weaponUpgrade,
    weapon.value,
    characters.randomAttackValue,
    characters.randomMagicAttackValue,
    formData.weaponUpgrade
  );
  filterState(
    characterCreation.state.value,
    characterCreation.polymorphMonster
  );
  filterCheckbox(
    characterCreation.lowRank,
    characterCreation.playerRank.parentElement
  );
  filterCheckbox(characterCreation.onYohara, characters.yoharaCreation);
  filterCheckbox(characterCreation.isBlessed, characters.blessingCreation);
  filterCheckbox(characterCreation.isMarried, characters.marriageCreation);
  filterSkills(classChoice.value, characters.skillElementsToFilter);
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
        downloadCharacter(characters.savedCharacters[pseudo]);
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

function characterManagement(characters, battle) {
  var characterTemplate = characters.newCharacterTemplate;
  var charactersContainer = characters.charactersContainer;

  Object.keys(characters.savedCharacters).forEach(function (pseudo) {
    handleNewCharacter(
      characters,
      characterTemplate,
      charactersContainer,
      battle,
      pseudo
    );
  });

  characters.addNewCharacterButton.addEventListener("click", function (event) {
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
        saveButtonGreen(characters.saveButton);
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

  characters.characterCreation.addEventListener("change", function () {
    saveButtonOrange(characters.saveButton);
    characters.unsavedChanges = true;
  });

  filterForm(characters, battle);
  characterCreationListener(characters, battle);
  handleFocus();

  window.addEventListener("beforeunload", function (event) {
    if (characters.unsavedChanges) {
      event.preventDefault();
      event.returnValue = "";
      return "";
    }
  });
}

function handleNewMonster(
  characters,
  monsterTemplate,
  monstersContainer,
  battle,
  monsterVnum,
  monsterList
) {
  var newMonsterTemplate = monsterTemplate.cloneNode(true);
  var spanInput = newMonsterTemplate.querySelector("span.input");
  var deleteSvg = newMonsterTemplate.querySelector("svg");
  var monsterName = getMonsterName(monsterVnum);

  var link = document.createElement("a");
  link.href = mw.util.getUrl(monsterName);
  link.title = monsterName;
  link.textContent = monsterName;

  spanInput.appendChild(link);
  monstersContainer.appendChild(newMonsterTemplate);

  newMonsterTemplate.setAttribute("tabindex", "0");
  newMonsterTemplate.setAttribute("data-name", monsterVnum);
  monstersContainer.appendChild(newMonsterTemplate);

  deleteSvg.addEventListener("click", function (event) {
    deleteMonster(characters, monsterVnum, newMonsterTemplate, battle);
    var inputMonster = monsterList.querySelector(
      "input[name='" + monsterVnum + "']"
    );
    inputMonster.checked = false;
  });
}

function monsterManagement(characters, battle) {
  function handleDropdown(searchMonster, monsterList) {
    searchMonster.addEventListener("focus", function (event) {
      showElement(monsterList);
    });

    document.addEventListener("mousedown", function (event) {
      var target = event.target;
      if (!monsterList.contains(target) && !searchMonster.contains(target)) {
        hideElement(monsterList);
      }
    });
  }

  function addMonsterNames(monsterList) {
    var lastMonsterAttributeIndex = monsterData[101].length - 1;

    for (var monsterVnum in monsterData) {
      var li = document.createElement("li");
      var label = document.createElement("label");
      var input = document.createElement("input");
      var textNode = document.createTextNode(
        monsterData[monsterVnum][lastMonsterAttributeIndex]
      );

      label.htmlFor = "monster" + monsterVnum;
      input.id = "monster" + monsterVnum;
      input.type = "checkbox";

      input.name = monsterVnum;

      label.appendChild(input);
      label.appendChild(textNode);
      li.appendChild(label);
      monsterList.appendChild(li);
    }
  }

  function filterNames(searchMonster, monsterList) {
    var debounceTimer;

    searchMonster.addEventListener("input", function (event) {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function () {
        var value = toNormalForm(event.target.value);
        for (var element of monsterList.children) {
          if (!isValueInArray(value, toNormalForm(element.textContent))) {
            hideElement(element);
          } else {
            showElement(element);
          }
        }
      }, 500);
    });
  }

  var monsterTemplate = characters.newMonsterTemplate;
  var monstersContainer = characters.monstersContainer;
  var monsterList = characters.monsterList;
  var searchMonster = characters.searchMonster;
  var monsterListForm = characters.monsterListForm;

  document
    .getElementById("monster-link")
    .querySelector("a")
    .setAttribute("target", "_blank");

  handleDropdown(searchMonster, monsterList);
  addMonsterNames(monsterList, characters.monsterListTemplate);
  filterNames(searchMonster, monsterList);

  characters.savedMonsters.slice().forEach(function (monsterVnum) {
    var inputMonster = monsterList.querySelector(
      "input[name='" + monsterVnum + "']"
    );

    if (inputMonster) {
      handleNewMonster(
        characters,
        monsterTemplate,
        monstersContainer,
        battle,
        monsterVnum,
        monsterList
      );
      inputMonster.checked = true;
    } else {
      deleteMonster(characters, monsterVnum, null, battle);
    }
  });

  monsterListForm.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  monsterListForm.addEventListener("change", function (event) {
    var target = event.target;
    var monsterVnum = target.name;

    if (monsterVnum === "search-monster") {
      return;
    }

    if (target.checked) {
      handleNewMonster(
        characters,
        monsterTemplate,
        monstersContainer,
        battle,
        monsterVnum,
        monsterList
      );

      characters.savedMonsters.push(monsterVnum);
      updateSavedMonsters(characters.savedMonsters);
      addBattleChoice(battle, monsterVnum, true);
    } else {
      var currentMonsterTemplate = monstersContainer.querySelector(
        "[data-name='" + monsterVnum + "']"
      );
      deleteMonster(characters, monsterVnum, currentMonsterTemplate, battle);
    }
  });

  addEventListener("storage", function (event) {
    if (event.key === "newMonsterCalculator") {
      var monsterVnum = Number(event.newValue);

      if (!monsterVnum) {
        return;
      }

      var inputMonster = monsterList.querySelector(
        "input[name='" + Math.abs(monsterVnum) + "']"
      );

      if (inputMonster) {
        if (
          (monsterVnum > 0 && !inputMonster.checked) ||
          (monsterVnum < 0 && inputMonster.checked)
        ) {
          inputMonster.click();
        }
      }
    }
  });
}

function removeBattleChoice(battle, name) {
  var battleSelects = [battle.attackerSelection, battle.victimSelection];

  battleSelects.forEach(function (battleSelect) {
    for (
      var optionIndex = 0;
      optionIndex < battleSelect.options.length;
      optionIndex++
    ) {
      if (battleSelect.options[optionIndex].value === name) {
        battleSelect.remove(optionIndex);
        break;
      }
    }
  });
}

function addBattleChoice(battle, name, isMonster = false) {
  function createOption(text, vnum) {
    var option = document.createElement("option");
    option.textContent = text;
    option.value = vnum;

    if (!isMonster) {
      option.classList.add("notranslate");
    }

    return option;
  }

  var vnum = name;

  if (isMonster) {
    name = getMonsterName(name);
  }

  if (isMonster && monsterData[vnum][1]) {
    // pass
  } else {
    battle.attackerSelection.appendChild(createOption(name, vnum));
  }

  battle.victimSelection.appendChild(createOption(name, vnum));
}

function updateBattleChoice(characters, battle) {
  var keys = Object.keys(characters.savedCharacters);

  for (var index = 0; index < keys.length; index++) {
    var pseudo = keys[index];
    addBattleChoice(battle, pseudo);
  }

  characters.savedMonsters.forEach(function (monsterVnum) {
    addBattleChoice(battle, monsterVnum, true);
  });
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

function isMagicClass(character) {
  return character.race === "shaman" || character.class === "black_magic";
}

function isDispell(character, skillId) {
  return character.class === "weaponary" && skillId === 6;
}

function isPolymorph(character) {
  return character.state === "polymorph";
}

function isRiding(character) {
  return character.state === "horse";
}

function isBow(weapon) {
  return weapon[1] === 2;
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

function calcMainAttackValue(attacker, attackerWeapon) {
  var leadership = 0;
  var rawWeaponAttackValue = 0;

  if (isPC(attacker)) {
    var rawWeaponAttackValue = attackerWeapon[3][attacker.weaponUpgrade];

    if (!rawWeaponAttackValue) {
      rawWeaponAttackValue = 0;
    }

    leadership = attacker.leadership;
  }

  return 2 * (attacker.level + rawWeaponAttackValue) + leadership;
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

function calcSecondaryAttackValue(attacker, attackerWeapon) {
  var attackValueOther = 0;

  var minAttackValue = 0;
  var maxAttackValue = 0;

  var minAttackValueSlash = 0;
  var maxAttackValueSlash = 0;

  if (isPC(attacker)) {
    if (isValueInArray("serpent", attackerWeapon[0].toLowerCase())) {
      var rawAttackValue = attackerWeapon[3][attacker.weaponUpgrade];

      minAttackValue = attacker.minAttackValueRandom - rawAttackValue;
      maxAttackValue = attacker.maxAttackValueRandom - rawAttackValue;

      minAttackValue = Math.max(0, minAttackValue);
      maxAttackValue = Math.max(minAttackValue, maxAttackValue);
    } else {
      minAttackValue = attackerWeapon[2][2];
      maxAttackValue = attackerWeapon[2][3];
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

    if (isBow(attackerWeapon) && !isPolymorph(attacker)) {
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

  return [
    minAttackValue,
    maxAttackValue,
    attackValueOther,
    minInterval,
    totalCardinal,
  ];
}

function calcMagicAttackValue(attacker, attackerWeapon) {
  var minMagicAttackValue = 0;
  var maxMagicAttackValue = 0;

  var minMagicAttackValueSlash = 0;
  var maxMagicAttackValueSlash = 0;

  if (isValueInArray("serpent", attackerWeapon[0].toLowerCase())) {
    minMagicAttackValue = attacker.minMagicAttackValueRandom;
    maxMagicAttackValue = attacker.maxMagicAttackValueRandom;

    maxMagicAttackValue = Math.max(minMagicAttackValue, maxMagicAttackValue);
  } else {
    var rawWeaponAttackValue = attackerWeapon[3][attacker.weaponUpgrade];

    if (!rawWeaponAttackValue) {
      rawWeaponAttackValue = 0;
    }

    minMagicAttackValue = attackerWeapon[2][0] + rawWeaponAttackValue;
    maxMagicAttackValue = attackerWeapon[2][1] + rawWeaponAttackValue;
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

  return [minMagicAttackValue, maxMagicAttackValue, minInterval, totalCardinal];
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

function calcDamageWithPrimaryBonuses(damages, battleValues) {
  damages = Math.floor(
    (damages * battleValues.attackValueCoeff) / 100 + battleValues.adjustCoeff
  );

  damages += battleValues.attackValueMarriage;

  damages = Math.floor(
    (damages * battleValues.monsterResistanceMarriageCoeff) / 100
  );
  damages = Math.floor((damages * battleValues.monsterResistanceCoeff) / 100);

  damages += Math.floor((damages * battleValues.typeBonusCoeff) / 100);
  damages +=
    Math.floor((damages * battleValues.raceBonusCoeff) / 100) -
    Math.floor((damages * battleValues.raceResistanceCoeff) / 100);
  damages += Math.floor((damages * battleValues.stoneBonusCoeff) / 100);
  damages += Math.floor((damages * battleValues.monsterBonusCoeff) / 100);

  var elementBonusCoeff = battleValues.elementBonusCoeff;

  damages +=
    Math.trunc((damages * elementBonusCoeff[0]) / 10000) +
    Math.trunc((damages * elementBonusCoeff[1]) / 10000) +
    Math.trunc((damages * elementBonusCoeff[2]) / 10000) +
    Math.trunc((damages * elementBonusCoeff[3]) / 10000) +
    Math.trunc((damages * elementBonusCoeff[4]) / 10000) +
    Math.trunc((damages * elementBonusCoeff[5]) / 10000);

  damages = Math.floor(damages * battleValues.damageMultiplier);

  return damages;
}

function calcDamageWithSecondaryBonuses(
  damages,
  battleValues,
  damagesType,
  minPiercingDamages,
  damagesWithPrimaryBonuses
) {
  damages = Math.floor(damages * battleValues.magicResistanceCoeff);
  damages = Math.trunc((damages * battleValues.weaponDefenseCoeff) / 100);
  damages = Math.floor((damages * battleValues.tigerStrengthCoeff) / 100);
  damages = Math.floor((damages * battleValues.blessingBonusCoeff) / 100);

  if (damagesType.criticalHit) {
    damages *= 2;
  }

  if (damagesType.piercingHit) {
    damages += battleValues.defenseBoost + Math.min(0, minPiercingDamages);
    damages += Math.floor(
      (damagesWithPrimaryBonuses * battleValues.extraPiercingHitCoeff) / 1000
    );
  }

  damages = Math.floor((damages * battleValues.averageDamageCoeff) / 100);
  damages = Math.floor(
    (damages * battleValues.averageDamageResistanceCoeff) / 100
  );
  damages = Math.floor(
    (damages * battleValues.skillDamageResistanceCoeff) / 100
  );

  damages = Math.floor((damages * battleValues.rankBonusCoeff) / 100);
  damages = Math.max(0, damages + battleValues.defensePercent);
  damages += Math.min(
    300,
    Math.floor((damages * battleValues.damageBonusCoeff) / 100)
  );
  damages = Math.floor((damages * battleValues.empireMalusCoeff) / 10);
  damages = Math.floor((damages * battleValues.sungMaStrBonusCoeff) / 10000);
  damages -= Math.floor(damages * battleValues.sungmaStrMalusCoeff);

  damages = Math.floor((damages * battleValues.whiteDragonElixirCoeff) / 100);
  damages = Math.floor((damages * battleValues.steelDragonElixirCoeff) / 100);

  return damages;
}

function calcSkillDamageWithSecondaryBonuses(
  damages,
  battleValues,
  damagesType,
  minPiercingDamages
) {
  damages = Math.floor(damages * battleValues.magicResistanceCoeff);
  damages = Math.trunc((damages * battleValues.weaponDefenseCoeff) / 100);

  damages -= battleValues.defense;

  damages = floorMultiplication(damages, battleValues.skillWardCoeff);
  damages = floorMultiplication(damages, battleValues.skillBonusCoeff);

  var tempDamages = Math.floor(
    (damages * battleValues.skillBonusByBonusCoeff) / 100
  );

  damages = Math.floor((tempDamages * battleValues.tigerStrengthCoeff) / 100);

  if (damagesType.criticalHit) {
    damages *= 2;
  }

  if (damagesType.piercingHit) {
    damages += battleValues.defenseBoost + Math.min(0, minPiercingDamages);
    damages += Math.floor(
      (tempDamages * battleValues.extraPiercingHitCoeff) / 1000
    );
  }

  damages = Math.floor((damages * battleValues.skillDamageCoeff) / 100);
  damages = Math.floor(
    (damages * battleValues.skillDamageResistanceCoeff) / 100
  );
  damages = Math.floor((damages * battleValues.rankBonusCoeff) / 100);

  damages = Math.max(0, damages + battleValues.defensePercent);
  damages += Math.min(
    300,
    Math.floor((damages * battleValues.damageBonusCoeff) / 100)
  );
  damages = Math.floor((damages * battleValues.empireMalusCoeff) / 10);
  damages = Math.floor((damages * battleValues.sungMaStrBonusCoeff) / 10000);
  damages -= Math.floor(damages * battleValues.sungmaStrMalusCoeff);

  damages = Math.floor((damages * battleValues.whiteDragonElixirCoeff) / 100);
  damages = Math.floor((damages * battleValues.steelDragonElixirCoeff) / 100);

  return damages;
}

function computePolymorphPoint(attacker, victim, polymorphPowerTable) {
  attacker.statAttackValue = 0;

  attacker.polymorphDex = attacker.dex;
  victim.polymorphDex = victim.dex;

  attacker.minAttackValuePolymorph = 0;
  attacker.maxAttackValuePolymorph = 0;

  if (isPC(attacker) && isPolymorph(attacker)) {
    var polymorphPowerPct =
      getPolymorphPower(attacker.polymorphPoint, polymorphPowerTable) / 100;
    var polymorphMonster = createMonster(attacker.polymorphMonster);

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
  } else {
    attacker.statAttackValue = calcStatAttackValue(attacker);
  }
}

function computeHorse(attacker) {
  attacker.horseAttackValue = 0;

  if (isPC(attacker) && isRiding(attacker)) {
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
  if (attacker.lowRank !== "on") {
    return 0;
  }

  switch (attacker.playerRank) {
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

function createBattleValues(
  attacker,
  attackerWeapon,
  victim,
  mapping,
  constants,
  skillType
) {
  var missPercentage = 0;
  var adjustCoeff = 0;
  var attackValuePercent = 0;
  var attackMeleeMagic = 0;
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

  computePolymorphPoint(attacker, victim, constants.polymorphPowerTable);
  computeHorse(attacker);

  if (isPC(attacker)) {
    attackValuePercent = attacker.attackValuePercent;
    attackMeleeMagic = attacker.attackMeleeMagic;

    var weaponType = attackerWeapon[1];

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

    if (attacker.whiteDragonElixir === "on") {
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
      if (attacker.isMarried === "on") {
        if (attacker.loveNecklace === "on") {
          attackValueMarriage = getMarriageBonusValue(
            attacker,
            constants.marriageTable,
            "loveNecklace"
          );
        }

        if (attacker.loveEarrings === "on") {
          criticalHitPercentage += getMarriageBonusValue(
            attacker,
            constants.marriageTable,
            "loveEarrings"
          );
        }

        if (attacker.harmonyEarrings === "on") {
          piercingHitPercentage += getMarriageBonusValue(
            attacker,
            constants.marriageTable,
            "harmonyEarrings"
          );
        }
      }

      if (attacker.tigerStrength === "on") {
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

      if (attacker.onYohara === "on") {
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

    if (attacker.empireMalus === "on") {
      empireMalus = 1;
    }
  } else {
    if (isPC(victim)) {
      if (victim.isMarried === "on") {
        if (victim.harmonyBracelet === "on") {
          monsterResistanceMarriage = getMarriageBonusValue(
            victim,
            constants.marriageTable,
            "harmonyBracelet"
          );
        }

        if (victim.harmonyNecklace === "on" && !skillType) {
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
        if (attacker.attack == 0) {
          missPercentage = victim.meleeBlock;
          averageDamageResistance = victim.averageDamageResistance;
          blessingBonus = calcBlessingBonus(constants.skillPowerTable, victim);
        } else if (attacker.attack == 1) {
          missPercentage = victim.arrowBlock;
          weaponDefense = victim.arrowDefense;
          averageDamageResistance = victim.averageDamageResistance;
          blessingBonus = calcBlessingBonus(constants.skillPowerTable, victim);
        } else {
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
    if (!skillType && victim.biologist70 === "on") {
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

    if (victim.steelDragonElixir === "on") {
      steelDragonElixir = 10;
    }
  }

  if (skillType === "magic") {
    adjustCoeff = 0.5;
    attackValuePercent = attacker.attackMagic;
    attackValueMarriage = 0;
    defense = 0;
    if (!isDispell(attacker, 6)) {
      magicResistance = victim.magicResistance;
    }
    weaponDefense = 0;
  }

  missPercentage = Math.min(100, missPercentage);

  var battleValues = {
    missPercentage: missPercentage,
    weaponBonusCoeff: 1,
    adjustCoeff: adjustCoeff,
    attackValueCoeff:
      100 + attackValuePercent + Math.min(100, attackMeleeMagic),
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
    extraPiercingHitCoeff: 5 * extraPiercingHitPercentage,
    averageDamageCoeff: 100 + averageDamage,
    averageDamageResistanceCoeff: 100 - Math.min(99, averageDamageResistance),
    skillDamageCoeff: 100 + skillDamage,
    skillDamageResistanceCoeff: 100 - Math.min(99, skillDamageResistance),
    rankBonusCoeff: 100 + rankBonus,
    defensePercent: Math.floor(defensePercent),
    damageBonusCoeff: damageBonus,
    empireMalusCoeff: 10 - empireMalus,
    sungMaStrBonusCoeff: 10000 + sungMaStrBonus,
    sungmaStrMalusCoeff: sungmaStrMalus,
    whiteDragonElixirCoeff: 100 + whiteDragonElixir,
    steelDragonElixirCoeff: 100 - steelDragonElixir,
  };

  criticalHitPercentage = Math.min(criticalHitPercentage, 100);
  piercingHitPercentage = Math.min(piercingHitPercentage, 100);

  battleValues.damagesTypeCombinaison = [
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

  return battleValues;
}

function updateBattleValues(battleValues, skillInfo, attackerWeapon) {
  var weaponBonus = 0;
  var skillWard = 0;
  var skillBonus = 0;
  var skillBonusByBonus = 0;

  if (skillInfo.hasOwnProperty("weaponBonus")) {
    var [weaponType, weaponBonusValue] = skillInfo.weaponBonus;

    if (weaponType === attackerWeapon[1]) {
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
    battleValues.weaponDefenseCoeff = 1;
  }

  battleValues.weaponBonusCoeff = 100 + weaponBonus;
  battleValues.skillWardCoeff = 1 - skillWard / 100;
  battleValues.skillBonusCoeff = 1 + skillBonus / 100;
  battleValues.skillBonusByBonusCoeff = 100 + skillBonusByBonus;
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

function calcRemainingWeight(weights, currentIndex) {
  var remainingWeight = 0;

  for (var index = 0; index <= currentIndex; index++) {
    remainingWeight += weights[index];
  }

  return remainingWeight;
}

function calcBlessingBonus(skillPowerTable, victim) {
  if (victim.isBlessed !== "on") {
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

  if (victim.class === "dragon" && victim.blessingOnself === "on") {
    blessingBonus = floorMultiplication(blessingBonus, 1.1);
  }

  return blessingBonus;
}

function getSkillFormula(
  skillPowerTable,
  skillId,
  attacker,
  attackFactor,
  victim
) {
  var skillFormula;
  var skillInfo = { range: [0, 0] };

  var attackerClass = attacker.class;
  var lv = attacker.level;
  var vit = attacker.vit;
  var str = attacker.str;
  var int = attacker.int;
  var dex = attacker.dex;

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
      }
    } else if (attackerClass === "heal") {
      switch (skillId) {
        // Jet de foudre
        case 1:
          skillFormula = function (mav, varation) {
            return floorMultiplication(
              60 +
                5 * lv +
                (8 * int + 2 * dex + 8 * mav + varation) *
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

  return [skillFormula, skillInfo];
}

function calcPhysicalDamages(attacker, attackerWeapon, victim, battleValues) {
  var sumDamages = 0;
  var damagesCount = 0;
  var damagesWeightedByType = {};

  var attackFactor = calcAttackFactor(attacker, victim);
  var mainAttackValue = calcMainAttackValue(attacker, attackerWeapon);
  var [
    minAttackValue,
    maxAttackValue,
    attackValueOther,
    minInterval,
    totalCardinal,
  ] = calcSecondaryAttackValue(attacker, attackerWeapon);

  var weights = calcWeights(minAttackValue, maxAttackValue, minInterval);

  if (battleValues.missPercentage) {
    damagesWeightedByType.miss = { 0: battleValues.missPercentage / 100 };
  }

  for (var damagesType of battleValues.damagesTypeCombinaison) {
    if (!damagesType.weight) {
      continue;
    }

    var damagesWeighted = {};
    damagesWeightedByType[damagesType.name] = damagesWeighted;

    for (
      var attackValue = maxAttackValue;
      attackValue >= minAttackValue;
      attackValue--
    ) {
      var weight = weights[attackValue - minAttackValue] * damagesType.weight;

      var secondaryAttackValue = 2 * attackValue + attackValueOther;
      var rawDamages =
        mainAttackValue +
        floorMultiplication(attackFactor, secondaryAttackValue);

      var damagesWithPrimaryBonuses = calcDamageWithPrimaryBonuses(
        rawDamages,
        battleValues
      );

      var minPiercingDamages =
        damagesWithPrimaryBonuses -
        battleValues.defenseBoost +
        battleValues.defenseMarriage;

      if (minPiercingDamages <= 2) {
        if (damagesType.piercingHit) {
          for (var damages = 1; damages <= 5; damages++) {
            var finalDamages = calcDamageWithSecondaryBonuses(
              damages,
              battleValues,
              damagesType,
              minPiercingDamages,
              damagesWithPrimaryBonuses
            );

            addKeyValue(damagesWeighted, finalDamages, weight / 5);
            sumDamages += (finalDamages * weight) / 5;
            damagesCount++;
          }
        } else {
          var remainingWeight =
            calcRemainingWeight(weights, attackValue - minAttackValue) *
            damagesType.weight;

          for (var damages = 1; damages <= 5; damages++) {
            var finalDamages = calcDamageWithSecondaryBonuses(
              damages,
              battleValues,
              damagesType,
              minPiercingDamages,
              damagesWithPrimaryBonuses
            );

            addKeyValue(damagesWeighted, finalDamages, remainingWeight / 5);
            sumDamages += (finalDamages * remainingWeight) / 5;
            damagesCount += attackValue - minAttackValue + 1;
          }
          break;
        }
      } else {
        var finalDamages = calcDamageWithSecondaryBonuses(
          minPiercingDamages,
          battleValues,
          damagesType,
          minPiercingDamages,
          damagesWithPrimaryBonuses
        );

        addKeyValue(damagesWeighted, finalDamages, weight);
        sumDamages += finalDamages * weight;
        damagesCount++;
      }
    }
  }

  return [sumDamages, totalCardinal, damagesCount, damagesWeightedByType];
}

function calcPhysicalSkillDamages(
  attacker,
  attackerWeapon,
  victim,
  battleValues,
  constants,
  skillId
) {
  var sumDamages = 0;
  var damagesCount = 0;
  var damagesWeightedByType = {};

  var attackFactor = calcAttackFactor(attacker, victim);
  var mainAttackValue = calcMainAttackValue(attacker, attackerWeapon);
  var [
    minAttackValue,
    maxAttackValue,
    attackValueOther,
    minInterval,
    totalCardinal,
  ] = calcSecondaryAttackValue(attacker, attackerWeapon);

  var weights = calcWeights(minAttackValue, maxAttackValue, minInterval);

  var [skillFormula, skillInfo] = getSkillFormula(
    constants.skillPowerTable,
    skillId,
    attacker,
    attackFactor,
    victim
  );

  var [minVariation, maxVariation] = skillInfo.range;

  totalCardinal *= maxVariation - minVariation + 1;

  updateBattleValues(battleValues, skillInfo, attackerWeapon);

  for (var damagesType of battleValues.damagesTypeCombinaison) {
    if (!damagesType.weight) {
      continue;
    }

    var damagesWeighted = {};
    var savedDamages = {};

    damagesWeightedByType[damagesType.name] = damagesWeighted;

    for (
      var attackValue = maxAttackValue;
      attackValue >= minAttackValue;
      attackValue--
    ) {
      var weight = weights[attackValue - minAttackValue] * damagesType.weight;

      var secondaryAttackValue = 2 * attackValue + attackValueOther;
      var rawDamages =
        mainAttackValue +
        floorMultiplication(attackFactor, secondaryAttackValue);

      var damagesWithPrimaryBonuses = calcDamageWithPrimaryBonuses(
        rawDamages,
        battleValues
      );

      for (
        var variation = minVariation;
        variation <= maxVariation;
        variation++
      ) {
        if (damagesWithPrimaryBonuses <= 2) {
          if (damagesType.piercingHit) {
            for (var damages = 1; damages <= 5; damages++) {
              damages *= battleValues.useDamages;

              var damagesWithFormula = skillFormula(damages, variation);

              damagesWithFormula = Math.floor(
                (damagesWithFormula * battleValues.weaponBonusCoeff) / 100
              );

              var finalDamages = calcSkillDamageWithSecondaryBonuses(
                damagesWithFormula,
                battleValues,
                damagesType,
                damagesWithPrimaryBonuses
              );

              addKeyValue(damagesWeighted, finalDamages, weight / 5);
              sumDamages += (finalDamages * weight) / 5;
              damagesCount++;
            }
          } else {
            var remainingWeight =
              calcRemainingWeight(weights, attackValue - minAttackValue) *
              damagesType.weight;

            for (var damages = 1; damages <= 5; damages++) {
              damages *= battleValues.useDamages;

              var damagesWithFormula = skillFormula(damages, variation);

              damagesWithFormula = Math.floor(
                (damagesWithFormula * battleValues.weaponBonusCoeff) / 100
              );

              var finalDamages = calcSkillDamageWithSecondaryBonuses(
                damagesWithFormula,
                battleValues,
                damagesType,
                damagesWithPrimaryBonuses
              );

              addKeyValue(damagesWeighted, finalDamages, remainingWeight / 5);
              sumDamages += (finalDamages * remainingWeight) / 5;
              damagesCount += attackValue - minAttackValue + 1;
            }
            break;
          }
        } else {
          damagesWithPrimaryBonuses *= battleValues.useDamages;

          var damagesWithFormula = skillFormula(
            damagesWithPrimaryBonuses,
            variation
          );

          if (savedDamages.hasOwnProperty(damagesWithFormula)) {
            var finalDamages = savedDamages[damagesWithFormula];
            damagesWeighted[finalDamages] += weight;
            sumDamages += finalDamages * weight;
            damagesCount++;
            continue;
          }

          var finalDamages = Math.floor(
            (damagesWithFormula * battleValues.weaponBonusCoeff) / 100
          );

          finalDamages = calcSkillDamageWithSecondaryBonuses(
            finalDamages,
            battleValues,
            damagesType,
            damagesWithPrimaryBonuses
          );

          savedDamages[damagesWithFormula] = finalDamages;
          damagesWeighted[finalDamages] = weight;
          sumDamages += finalDamages * weight;
          damagesCount++;
        }
      }
    }
  }

  return [sumDamages, totalCardinal, damagesCount, damagesWeightedByType];
}

function calcMagicSkillDamages(
  attacker,
  attackerWeapon,
  victim,
  battleValues,
  constants,
  skillId
) {
  var sumDamages = 0;
  var damagesCount = 0;
  var damagesWeightedByType = {};

  var attackFactor = calcAttackFactor(attacker, victim);
  var [minMagicAttackValue, maxMagicAttackValue, minInterval, totalCardinal] =
    calcMagicAttackValue(attacker, attackerWeapon);

  var weights = calcWeights(
    minMagicAttackValue,
    maxMagicAttackValue,
    minInterval
  );

  var [skillFormula, skillInfo] = getSkillFormula(
    constants.skillPowerTable,
    skillId,
    attacker,
    attackFactor,
    victim
  );

  var [minVariation, maxVariation] = skillInfo.range;

  totalCardinal *= maxVariation - minVariation + 1;

  updateBattleValues(battleValues, skillInfo, attackerWeapon);

  for (var damagesType of battleValues.damagesTypeCombinaison) {
    if (!damagesType.weight) {
      continue;
    }

    var damagesWeighted = {};
    var savedDamages = {};

    damagesWeightedByType[damagesType.name] = damagesWeighted;

    for (
      var magicAttackValue = maxMagicAttackValue;
      magicAttackValue >= minMagicAttackValue;
      magicAttackValue--
    ) {
      var weight =
        weights[magicAttackValue - minMagicAttackValue] * damagesType.weight;

      for (
        var variation = minVariation;
        variation <= maxVariation;
        variation++
      ) {
        var rawDamages = skillFormula(magicAttackValue, variation);

        if (savedDamages.hasOwnProperty(rawDamages)) {
          var finalDamages = savedDamages[rawDamages];
          damagesWeighted[finalDamages] += weight;
          sumDamages += finalDamages * weight;
          damagesCount++;
          continue;
        }

        var damagesWithPrimaryBonuses = Math.floor(
          (rawDamages * battleValues.weaponBonusCoeff) / 100
        );

        damagesWithPrimaryBonuses = calcDamageWithPrimaryBonuses(
          damagesWithPrimaryBonuses,
          battleValues
        );

        if (damagesWithPrimaryBonuses <= 2) {
          if (damagesType.piercingHit) {
            for (var damages = 1; damages <= 5; damages++) {
              var finalDamages = calcSkillDamageWithSecondaryBonuses(
                damages,
                battleValues,
                damagesType,
                damagesWithPrimaryBonuses
              );
              addKeyValue(damagesWeighted, finalDamages, weight / 5);
              sumDamages += (finalDamages * weight) / 5;
              damagesCount++;
            }
          } else {
            var remainingWeight =
              calcRemainingWeight(
                weights,
                magicAttackValue - minMagicAttackValue
              ) * damagesType.weight;

            for (var damages = 1; damages <= 5; damages++) {
              var finalDamages = calcSkillDamageWithSecondaryBonuses(
                damages,
                battleValues,
                damagesType,
                damagesWithPrimaryBonuses
              );

              addKeyValue(damagesWeighted, finalDamages, remainingWeight / 5);
              sumDamages += (finalDamages * remainingWeight) / 5;
              damagesCount++;
            }
          }
        } else {
          var finalDamages = calcSkillDamageWithSecondaryBonuses(
            damagesWithPrimaryBonuses,
            battleValues,
            damagesType,
            damagesWithPrimaryBonuses
          );

          savedDamages[rawDamages] = finalDamages;
          damagesWeighted[finalDamages] = weight;
          sumDamages += finalDamages * weight;
          damagesCount++;
        }
      }
    }
  }

  return [sumDamages, totalCardinal, damagesCount, damagesWeightedByType];
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
}

function createMonster(monsterVnum, attacker) {
  var monsterAttributes = monsterData[monsterVnum];

  var monster = {
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

  monster.defense = monster.rawDefense + monster.level + monster.vit;

  return monster;
}

function addPotentialErrorInformation(
  errorInformation,
  attacker,
  victim,
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
    } else if (isPolymorph(attacker)) {
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
  } else {
    showElement(errorInformation["monster-attacker"]);
  }

  if (isPC(victim)) {
    if (isRiding(victim)) {
      showElement(errorInformation["horse-stat"]);
    } else if (isPolymorph(victim)) {
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
  var checkbox = battle.reduceChartPoints;
  var numberFormat = battle.numberFormats.second;
  var displayTime = battle.displayTime;

  checkbox.addEventListener("change", function (event) {
    var damagesChart = battle.damagesChart;
    var startDisplayTime = performance.now();

    clearDamageChart(damagesChart);
    addToDamagesChart(
      battle.scatterDataByType,
      damagesChart,
      event.target.checked
    );
    displayDamagesChart(damagesChart, battle.chartContainer);

    displayTime.textContent = numberFormat.format(
      (performance.now() - startDisplayTime) / 1000
    );
  });
}

function downloadRawDataListener(battle) {
  var button = document.getElementById("download-raw-data");

  button.addEventListener("click", function (e) {
    var damagesWeightedByType = battle.damagesWeightedByType;

    if (!damagesWeightedByType) {
      return;
    }

    var csvContent = "damages,probabilities,damagesType\n";

    for (var damagesType in damagesWeightedByType) {
      var damagesWeighted = damagesWeightedByType[damagesType];

      for (var damages in damagesWeighted) {
        csvContent +=
          damages + "," + damagesWeighted[damages] + "," + damagesType + "\n";
      }
    }

    var link = document.createElement("a");
    var blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    var blobURL = URL.createObjectURL(blob);

    link.href = blobURL;
    link.download = "raw_damages.csv";
    document.body.appendChild(link);

    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobURL);
  });
}

function displayResults(
  sumDamages,
  totalCardinal,
  damagesWeightedByType,
  damagesCount,
  battle,
  attackerName,
  victimName
) {
  var [minDamages, maxDamages, scatterDataByType, reducePoints] =
    addToTableResult(
      battle,
      damagesWeightedByType,
      damagesCount,
      totalCardinal
    );
  reducePoints &&= battle.reduceChartPoints.checked;

  addToDamagesChart(scatterDataByType, battle.damagesChart, reducePoints);
  displayDamagesChart(battle.damagesChart, battle.chartContainer);
  displayFightResults(
    battle,
    attackerName,
    victimName,
    sumDamages / totalCardinal,
    minDamages,
    maxDamages
  );
  battle.damagesWeightedByType = damagesWeightedByType;
  battle.scatterDataByType = scatterDataByType;
}

function displayFightResults(
  battle,
  attackerName,
  victimName,
  meanDamages,
  minDamages,
  maxDamages
) {
  var tableResultFight = battle.tableResultFight;
  var tableResultHistory = battle.tableResultHistory;
  var attackTypeSelection = battle.attackTypeSelection;
  var savedFights = battle.savedFights;
  var numberFormat = battle.numberFormats.default;

  showElement(tableResultFight.parentElement);
  hideElement(tableResultHistory.rows[1]);

  var valuesToDisplay = [
    attackerName,
    victimName,
    attackTypeSelection.options[attackTypeSelection.selectedIndex].textContent,
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
    battle.deleteFightTemplate,
    numberFormat
  );
}

function displayFightInfo(damagesCount, damagesTime, displayTime, battle) {
  var container = battle.damagesCount.parentElement;

  if (damagesCount <= 1) {
    hideElement(container);
    return;
  } else {
    showElement(container);
  }

  damagesCount = battle.numberFormats.default.format(damagesCount);
  damagesTime = battle.numberFormats.second.format(damagesTime / 1000);
  displayTime = battle.numberFormats.second.format(displayTime / 1000);

  battle.damagesCount.textContent = damagesCount;
  battle.damagesTime.textContent = damagesTime;
  battle.displayTime.textContent = displayTime;
}

function isPseudoSaved(characters, pseudo) {
  return characters.savedCharacters.hasOwnProperty(pseudo);
}

function createBattle(characters, battle) {
  battle.battleForm.addEventListener("submit", function (event) {
    event.preventDefault();

    startDamagesTime = performance.now();

    // auto save
    if (characters.unsavedChanges) {
      characters.saveButton.click();
    }

    var battleInfo = new FormData(event.target);
    var attackerName = battleInfo.get("attacker");
    var attackType = battleInfo.get("attackTypeSelection");
    var victimName = battleInfo.get("victim");

    if (!attackerName && !attackType && !victimName) {
      return;
    }

    var attackerWeapon = null;

    if (isPseudoSaved(characters, attackerName)) {
      var attacker = copyObject(characters.savedCharacters[attackerName]);

      if (weaponData.hasOwnProperty(attacker.weapon)) {
        attackerWeapon = weaponData[attacker.weapon];
      } else {
        attackerWeapon = weaponData[0];
      }
    } else {
      var attacker = createMonster(attackerName);
    }

    if (isPseudoSaved(characters, victimName)) {
      var victim = copyObject(characters.savedCharacters[victimName]);
    } else {
      var victim = createMonster(victimName, attacker);
    }

    var calcDamages, skillId, skillType;

    if (attackType === "physical") {
      calcDamages = calcPhysicalDamages;
    } else if (attackType.startsWith("attackSkill")) {
      skillId = Number(attackType.split("attackSkill")[1]);

      if (isMagicClass(attacker) || isDispell(attacker, skillId)) {
        skillType = "magic";
        calcDamages = calcMagicSkillDamages;
      } else {
        skillType = "physical";
        calcDamages = calcPhysicalSkillDamages;
      }
    } else if (attackType.startsWith("horseSkill")) {
      skillType = "physical";
      skillId = Number(attackType.split("horseSkill")[1]);
      calcDamages = calcPhysicalSkillDamages;
    }

    clearTableResult(battle.tableResult);
    clearDamageChart(battle.damagesChart);

    var battleValues = createBattleValues(
      attacker,
      attackerWeapon,
      victim,
      battle.mapping,
      battle.constants,
      skillType
    );

    var [sumDamages, totalCordinal, damagesCount, damagesWeightedByType] =
      calcDamages(
        attacker,
        attackerWeapon,
        victim,
        battleValues,
        battle.constants,
        skillId
      );

    endDamagesTime = performance.now();

    displayResults(
      sumDamages,
      totalCordinal,
      damagesWeightedByType,
      damagesCount,
      battle,
      attacker.name,
      victim.name
    );

    endDisplayTime = performance.now();

    displayFightInfo(
      damagesCount,
      endDamagesTime - startDamagesTime,
      endDisplayTime - endDamagesTime,
      battle
    );
    addPotentialErrorInformation(
      battle.errorInformation,
      attacker,
      victim,
      characters
    );
    showElement(battle.fightResultContainer);
  });
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
      },
      en: {
        damages: "Damages",
        percentage: "Percentage",
        miss: "Miss",
        normalHit: "Normal hit",
        criticalHit: "Critical hit",
        piercingHit: "Piercing hit",
        criticalPiercingHit: "Critical piercing hit",
        damagesRepartition: "Damages repartition"
      },
      tr: {
        damages: "Hasar",
        percentage: "Yüzde",
        miss: "Miss Vuruş",
        normalHit: "Düz Vuruş",
        criticalHit: "Kritik Vuruş",
        piercingHit: "Delici Vuruş",
        criticalPiercingHit: "Kritikli Delici Vuruş",
      },
      ro: {
        damages: "Daune",
        percentage: "Procent",
        miss: "Miss",
        normalHit: "Lovitura normala",
        criticalHit: "Lovitura critica",
        piercingHit: "Lovitura patrunzatoare",
        criticalPiercingHit: "Lovitura critica si patrunzatoare",
      },
      de: {
        damages: "Schäden",
        percentage: "Prozentsatz",
        miss: "Verfehlen",
        normalHit: "Normaler Treffer",
        criticalHit: "Kritischer Treffer",
        piercingHit: "Durchdringender Treffer",
        criticalPiercingHit: "Kritischer durchdringender Treffer",
      },
    },
    damagesTypeOrder: [
      "normalHit",
      "criticalHit",
      "piercingHit",
      "criticalPiercingHit",
    ],
  };
  return constants;
}

function initResultTableHistory(battle) {
  var tableResultHistory = battle.tableResultHistory;
  var savedFights = battle.savedFights;
  var startIndex = 3;

  if (savedFights.length) {
    hideElement(tableResultHistory.rows[1]);

    for (var savedFight of battle.savedFights) {
      addRowToTableResultHistory(
        tableResultHistory,
        savedFight,
        battle.deleteFightTemplate,
        battle.numberFormats.default
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

function initChart(battle, chartSource) {
  function createChart() {
    var translation = battle.translation;
    var ctx = battle.plotDamages.getContext("2d");
    var chart = new Chart(ctx, {
      type: "scatter",
      data: {
        datasets: [],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
          },
          title: {
            display: true,
            text: "Répartition des dégâts",
            font: {
              size: 20,
            },
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                var xValue = battle.numberFormats.default.format(
                  context.parsed.x
                );
                var yValue = battle.numberFormats.percent.format(
                  context.parsed.y
                );

                return (label =
                  " " +
                  context.dataset.label +
                  " : (" +
                  xValue +
                  ", " +
                  yValue +
                  ")");
              },
            },
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

    var dataset = {
      normalHit: {
        label: translation.normalHit,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
      },
      piercingHit: {
        label: translation.piercingHit,
        backgroundColor: "rgba(192, 192, 75, 0.2)",
        borderColor: "rgba(192, 192, 75, 1)",
        hidden: true,
      },
      criticalHit: {
        label: translation.criticalHit,
        backgroundColor: "rgba(192, 75, 192, 0.2)",
        borderColor: "rgba(192, 75, 192, 1)",
        hidden: true,
      },
      criticalPiercingHit: {
        label: translation.criticalPiercingHit,
        backgroundColor: "rgba(75, 75, 192, 0.2)",
        borderColor: "rgba(75, 75, 192, 1)",
        hidden: true,
      },
    };
    battle.damagesChart = {
      chart: chart,
      dataset: dataset,
      maxPoints: 500,
    };
  }

  loadScript(chartSource, createChart);
}

function attackSelectonListener(
  characters,
  attackerSelection,
  attackTypeSelection
) {
  attackerSelection.addEventListener("change", function (event) {
    var attackerName = event.target.value;

    if (isPseudoSaved(characters, attackerName)) {
      var attacker = characters.savedCharacters[attackerName];
      filterAttackTypeSelection(attacker, attackTypeSelection);
    } else {
      filterAttackTypeSelectionMonster(attackTypeSelection);
    }
  });
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

function createDamageCalculatorInformation(chartSource) {
  var characters = {
    unsavedChanges: false,
    savedCharacters: {},
    currentCharacter: null,
    savedMonsters: getSavedMonsters(),
    characterCreation: document.getElementById("character-creation"),
    addNewCharacterButton: document.getElementById("add-new-character"),
    dropZone: document.getElementById("character-drop-zone"),
    characterInput: document.getElementById("character-input"),
    newCharacterTemplate: document.getElementById("new-character-template")
      .children[0],
    charactersContainer: document.getElementById("characters-container"),
    newMonsterTemplate: document.getElementById("new-monster-template")
      .children[0],
    monstersContainer: document.getElementById("monsters-container"),
    monsterListForm: document.getElementById("monster-list-form"),
    searchMonster: document.getElementById("search-monster"),
    monsterList: document.getElementById("monster-list"),
    saveButton: document.getElementById("save-character"),
    weaponCategory: document.getElementById("weapon-category"),
    weaponDisplay: document.getElementById("weapon-display"),
    randomAttackValue: document.getElementById("random-attack-value"),
    randomMagicAttackValue: document.getElementById(
      "random-magic-attack-value"
    ),
    yoharaCreation: document.getElementById("yohara-creation"),
    blessingCreation: document.getElementById("blessing-creation"),
    marriageCreation: document.getElementById("marriage-creation"),
  };

  delete characters.newCharacterTemplate.dataset.click;

  for (var [pseudo, character] of Object.entries(getSavedCharacters())) {
    characters.savedCharacters[pseudo] = character;
  }

  var skillContainer = document.getElementById("skill-container");
  characters.skillElementsToFilter =
    skillContainer.querySelectorAll("[data-class]");

  var mapping = createMapping();
  var constants = createConstants();

  var battle = {
    resetAttackType: false,
    savedFights: getSavedFights(),
    battleForm: document.getElementById("create-battle"),
    attackerSelection: document.getElementById("attacker-selection"),
    attackTypeSelection: document.getElementById("attack-type-selection"),
    victimSelection: document.getElementById("victim-selection"),
    damagesWeightedByType: {},
    scatterDataByType: {},
    tableResultFight: document.getElementById("result-table-fight"),
    tableResultHistory: document.getElementById("result-table-history"),
    deleteFightTemplate: document.getElementById("delete-fight-template")
      .children[0],
    errorInformation: {},
    fightResultContainer: document.getElementById("fight-result-container"),
    tableResult: document.getElementById("result-table-details"),
    noTableResult: document.getElementById("no-result-table-details"),
    reduceChartPointsContainer: document.getElementById(
      "reduce-chart-points-container"
    ),
    reduceChartPoints: document.getElementById("reduce-chart-points"),
    chartContainer: document.getElementById("chart-container"),
    plotDamages: document.getElementById("plot-damages"),
    damagesCount: document.getElementById("damages-count"),
    damagesTime: document.getElementById("damages-time"),
    displayTime: document.getElementById("display-time"),
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
    mapping: mapping,
    constants: constants,
    translation: getTranslation(constants.translation),
  };

  attackSelectonListener(
    characters,
    battle.attackerSelection,
    battle.attackTypeSelection
  );
  initResultTableHistory(battle);
  initChart(battle, chartSource);
  reduceChartPointsListener(battle);
  downloadRawDataListener(battle);

  var errorElements = document
    .getElementById("error-information")
    .querySelectorAll("li[data-error]");

  for (var index = 0; index < errorElements.length; index++) {
    var errorElement = errorElements[index];
    battle.errorInformation[errorElement.dataset.error] = errorElement;
  }

  return [characters, battle];
}

function loadScript(src, callback) {
  var script = document.createElement("script");
  script.src = src;

  function onComplete() {
    if (script.parentNode) {
      script.parentNode.removeChild(script);
    }
    if (callback) {
      callback();
    }
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

function loading() {
  var mainContainer = document.getElementById("hide-all");
  var loadingAnimation = document.getElementById("loading-animation");

  mainContainer.classList.remove("tabber-noactive");
  loadingAnimation.classList.add("tabber-noactive");
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

    updateBattleChoice(characters, battle);
    createBattle(characters, battle);

    loading();
  }
  loadScript(javascriptSource, main);
})();
