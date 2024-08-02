function referenceCalculation(attacker, victim, attackType, battle) {
  function isValueInArray(value, array) {
    return array.indexOf(value) !== -1;
  }

  function compareNumbers(a, b) {
    return b - a;
  }

  function floorMultiplication(firstFactor, secondFactor) {
    return Math.floor((firstFactor * secondFactor).toFixed(8));
  }

  function floorMultiplicationWithNegative(firstFactor, secondFactor) {
    if (firstFactor < 0) {
      if (secondFactor < 0) {
        return floorMultiplication(-firstFactor, -secondFactor);
      } else {
        return -floorMultiplication(-firstFactor, secondFactor);
      }
    } else {
      if (secondFactor < 0) {
        return -floorMultiplication(firstFactor, -secondFactor);
      } else {
        return floorMultiplication(firstFactor, secondFactor);
      }
    }
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

    var totalCardinal = weaponInterval * slashInterval * 1000000;
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

    var totalCardinal = weaponInterval * slashInterval * 1000000;
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
    damages = floorMultiplication(
      damages * battleValues.attackValueCoeff + battleValues.adjustCoeff,
      1
    );
    damages += battleValues.attackValueMarriage;
    damages = floorMultiplication(
      damages,
      battleValues.monsterResistanceMarriageCoeff
    );
    damages = floorMultiplication(damages, battleValues.monsterResistanceCoeff);
    damages = floorMultiplication(damages, battleValues.typeBonusCoeff);
    damages +=
      floorMultiplication(damages, battleValues.raceBonusCoeff) -
      floorMultiplication(damages, battleValues.raceResistanceCoeff);
    damages = floorMultiplication(damages, battleValues.stoneBonusCoeff);
    damages = floorMultiplication(damages, battleValues.monsterBonusCoeff);

    var elementDamages = 0;
    for (var elementBonusCoeff of battleValues.elementBonusCoeff) {
      elementDamages += floorMultiplicationWithNegative(
        damages,
        elementBonusCoeff
      );
    }
    damages += elementDamages;

    damages = floorMultiplication(damages, battleValues.damageMultiplier);

    return damages;
  }

  function calcDamageWithSecondaryBonuses(
    damages,
    battleValues,
    damagesType,
    minPiercingDamages,
    damagesWithPrimaryBonuses
  ) {
    damages = floorMultiplication(damages, battleValues.magicResistanceCoeff);
    damages = floorMultiplication(damages, battleValues.weaponDefenseCoeff);
    damages = floorMultiplication(damages, battleValues.tigerStrengthCoeff);
    damages = floorMultiplication(damages, battleValues.blessingBonusCoeff);

    if (damagesType.criticalHit) {
      damages *= 2;
    }

    if (damagesType.piercingHit) {
      damages += battleValues.defense + Math.min(0, minPiercingDamages);
      damages += floorMultiplication(
        damagesWithPrimaryBonuses,
        battleValues.extraPiercingHitCoeff
      );
    }

    damages = floorMultiplication(damages, battleValues.averageDamageCoeff);
    damages = floorMultiplication(
      damages,
      battleValues.averageDamageResistanceCoeff
    );
    damages = floorMultiplication(
      damages,
      battleValues.skillDamageResistanceCoeff
    );

    damages = floorMultiplication(damages, battleValues.rankBonusCoeff);
    damages = Math.max(0, damages + battleValues.defensePercent);
    damages += Math.min(
      300,
      floorMultiplication(damages, battleValues.damageBonusCoeff)
    );
    damages = floorMultiplication(damages, battleValues.empireMalusCoeff);
    damages = floorMultiplication(damages, battleValues.sungMaStrBonusCoeff);
    damages -= floorMultiplication(damages, battleValues.sungmaStrMalusCoeff);

    damages = floorMultiplication(damages, battleValues.whiteDragonElixirCoeff);
    damages = floorMultiplication(damages, battleValues.steelDragonElixirCoeff);

    return damages;
  }

  function calcSkillDamageWithSecondaryBonuses(
    damages,
    battleValues,
    damagesType,
    minPiercingDamages
  ) {
    damages = floorMultiplication(damages, battleValues.magicResistanceCoeff);
    damages = floorMultiplication(damages, battleValues.weaponDefenseCoeff);

    damages -= battleValues.defense;

    damages = floorMultiplication(damages, battleValues.skillWardCoeff);
    damages = floorMultiplication(damages, battleValues.skillBonusCoeff);

    var tempDamages = floorMultiplication(
      damages,
      battleValues.skillBonusByBonusCoeff
    );

    damages = floorMultiplication(tempDamages, battleValues.tigerStrengthCoeff);

    if (damagesType.criticalHit) {
      damages *= 2;
    }

    if (damagesType.piercingHit) {
      damages +=
        battleValues.piercingHitDefense + Math.min(0, minPiercingDamages);
      damages += floorMultiplication(
        tempDamages,
        battleValues.extraPiercingHitCoeff
      );
    }

    damages = floorMultiplication(damages, battleValues.skillDamageCoeff);
    damages = floorMultiplication(
      damages,
      battleValues.skillDamageResistanceCoeff
    );

    damages = floorMultiplication(damages, battleValues.rankBonusCoeff);
    damages = Math.max(0, damages + battleValues.defensePercent);
    damages += Math.min(
      300,
      floorMultiplication(damages, battleValues.damageBonusCoeff)
    );
    damages = floorMultiplication(damages, battleValues.empireMalusCoeff);
    damages = floorMultiplication(damages, battleValues.sungMaStrBonusCoeff);
    damages -= floorMultiplication(damages, battleValues.sungmaStrMalusCoeff);

    damages = floorMultiplication(damages, battleValues.whiteDragonElixirCoeff);
    damages = floorMultiplication(damages, battleValues.steelDragonElixirCoeff);

    return damages;
  }

  function computePolymorphPoint(attacker, victim, polymorphPowerTable) {
    attacker.statAttackValue = 0;

    attacker.polymorphDex = attacker.dex;
    victim.polymorphDex = victim.dex;

    attacker.minAttackValuePolymorph = 0;
    attacker.maxAttackValuePolymorph = 0;

    if (isPC(attacker) && isPolymorph(attacker) && polymorphPowerTable) {
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
        elementBonus[elementBonusIndex] = elementDifference / 1000;
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
        Math.max(minElementMalus, elementDifference) / 1000;

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

  function createPhysicalBattleValues(
    attacker,
    attackerWeapon,
    victim,
    mapping,
    polymorphPowerTable,
    marriageTable,
    skillPowerTable
  ) {
    var missPercentage = 0;
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
    var magicResistance = 0;
    var weaponDefense = 0;
    var tigerStrength = 0;
    var blessingBonus = 0;
    var criticalHitPercentage = attacker.criticalHit;
    var piercingHitPercentage = attacker.piercingHit;
    var extraPiercingHitPercentage = Math.max(0, piercingHitPercentage - 100);
    var averageDamage = 0;
    var averageDamageResistance = 0;
    var skillDamageResistance = 0;
    var rankBonus = 0;
    var defensePercent = 0;
    var damageBonus = 0;
    var empireMalus = 0;
    var sungMaStrBonus = 0;
    var sungmaStrMalus = 0;
    var whiteDragonElixir = 0;
    var steelDragonElixir = 0;

    computePolymorphPoint(attacker, victim, polymorphPowerTable);
    computeHorse(attacker);

    if (isPC(attacker)) {
      attackValuePercent = attacker.attackValuePercent;
      attackMeleeMagic = attacker.attackMeleeMagic;

      var weaponType = attackerWeapon[1];

      var weaponDefenseName = mapping.defenseWeapon[weaponType];
      var weaponDefenseBreakName = mapping.breakWeapon[weaponType];

      if (victim.hasOwnProperty(weaponDefenseName)) {
        weaponDefense = victim[weaponDefenseName];
      }

      if (attacker.whiteDragonElixir === "on") {
        whiteDragonElixir = 10;
      }

      if (isPC(victim)) {
        if (weaponType === 2 && !isPolymorph(attacker)) {
          missPercentage = victim.arrowBlock;
        } else {
          missPercentage = victim.meleeBlock;
        }

        missPercentage +=
          victim.meleeArrowBlock -
          (missPercentage * victim.meleeArrowBlock) / 100;

        typeBonus = Math.max(1, attacker.humanBonus - victim.humanResistance);
        raceBonus = attacker[mapping.raceBonus[victim.race]];
        raceResistance = victim[mapping.raceResistance[attacker.race]];

        calcElementCoeffPvP(elementBonus, mapping, attacker, victim);

        if (weaponType !== 2 && attacker.hasOwnProperty(weaponDefenseBreakName)) {
          weaponDefense -= attacker[weaponDefenseBreakName];
        }

        criticalHitPercentage = 0;
        blessingBonus = calcBlessingBonus(skillPowerTable, victim);
        averageDamageResistance = victim.averageDamageResistance;
      } else {
        if (attacker.isMarried === "on") {
          if (attacker.loveNecklace === "on") {
            attackValueMarriage = getMarriageBonusValue(
              attacker,
              marriageTable,
              "loveNecklace"
            );
          }

          if (attacker.loveEarrings === "on") {
            criticalHitPercentage += getMarriageBonusValue(
              attacker,
              marriageTable,
              "loveEarrings"
            );
          }

          if (attacker.harmonyEarrings === "on") {
            piercingHitPercentage += getMarriageBonusValue(
              attacker,
              marriageTable,
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
              (attacker[elementBonusName] - victim[elementResistanceName]) / 200;
          } else {
            elementBonus[index] = attacker[elementBonusName] / 2000;
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
          averageDamage += attacker.bossDamage;
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

      averageDamage += attacker.averageDamage;
      rankBonus = getRankBonus(attacker);
      damageBonus = attacker.damageBonus;

      if (attacker.empireMalus === "on") {
        empireMalus = 10;
      }
    } else {
      if (isPC(victim)) {
        if (victim.isMarried === "on") {
          if (victim.harmonyBracelet === "on") {
            monsterResistanceMarriage = getMarriageBonusValue(
              victim,
              marriageTable,
              "harmonyBracelet"
            );
          }

          if (victim.harmonyNecklace === "on") {
            defenseMarriage = getMarriageBonusValue(
              victim,
              marriageTable,
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
              (attacker[elementBonusName] - victim[elementResistanceName]) / 125;
          }
        }

        if (attacker.attack == 0) {
          missPercentage = victim.meleeBlock;
          averageDamageResistance = victim.averageDamageResistance;
          blessingBonus = calcBlessingBonus(skillPowerTable, victim);
        } else if (attacker.attack == 1) {
          missPercentage = victim.arrowBlock;
          weaponDefense = victim.arrowDefense;
          averageDamageResistance = victim.averageDamageResistance;
          blessingBonus = calcBlessingBonus(skillPowerTable, victim);
        } else {
          missPercentage = victim.arrowBlock;
          skillDamageResistance = victim.skillDamageResistance;
          magicResistance = victim.magicResistance;
        }

        missPercentage +=
          victim.meleeArrowBlock -
          (missPercentage * victim.meleeArrowBlock) / 100;
      }

      typeBonus = 1;
      damageMultiplier = attacker.damageMultiplier;
    }

    if (isPC(victim)) {
      if (victim.biologist70 === "on") {
        victim.defense = floorMultiplication(victim.defense, 1.1);
      }
      criticalHitPercentage = Math.max(
        0,
        criticalHitPercentage - victim.criticalHitResistance
      );
      piercingHitPercentage = Math.max(
        0,
        piercingHitPercentage - victim.piercingHitResistance
      );

      if (isMagicClass(victim)) {
        defensePercent = (-2 * victim.magicDefense * victim.defensePercent) / 100;
      } else {
        defensePercent = (-2 * victim.defense * victim.defensePercent) / 100;
      }

      if (victim.steelDragonElixir === "on") {
        steelDragonElixir = 10;
      }
    }

    missPercentage = Math.min(100, missPercentage);

    var battleValues = {
      missPercentage: missPercentage,
      adjustCoeff: 0,
      attackValueCoeff:
        1 + (attackValuePercent + Math.min(100, attackMeleeMagic)) / 100,
      attackValueMarriage: attackValueMarriage,
      monsterResistanceMarriageCoeff: 1 - monsterResistanceMarriage / 100,
      monsterResistanceCoeff: 1 - monsterResistance / 100,
      typeBonusCoeff: 1 + typeBonus / 100,
      raceBonusCoeff: raceBonus / 100,
      raceResistanceCoeff: raceResistance / 100,
      monsterBonusCoeff: 1 + monsterBonus / 100,
      stoneBonusCoeff: 1 + stoneBonus / 100,
      elementBonusCoeff: elementBonus,
      damageMultiplier: damageMultiplier,
      defense: victim.defense,
      defenseMarriage: defenseMarriage,
      magicResistanceCoeff: magicResistanceToCoeff(magicResistance),
      weaponDefenseCoeff: 1 - weaponDefense / 100,
      tigerStrengthCoeff: 1 + tigerStrength / 100,
      blessingBonusCoeff: 1 - blessingBonus / 100,
      extraPiercingHitCoeff: extraPiercingHitPercentage / 200,
      averageDamageCoeff: 1 + averageDamage / 100,
      averageDamageResistanceCoeff:
        1 - Math.min(99, averageDamageResistance) / 100,
      skillDamageResistanceCoeff: 1 - Math.min(99, skillDamageResistance) / 100,
      rankBonusCoeff: 1 + rankBonus / 100,
      defensePercent: Math.floor(defensePercent),
      damageBonusCoeff: damageBonus / 100,
      empireMalusCoeff: 1 - empireMalus / 100,
      sungMaStrBonusCoeff: 1 + sungMaStrBonus / 10000,
      sungmaStrMalusCoeff: sungmaStrMalus,
      whiteDragonElixirCoeff: 1 + whiteDragonElixir / 100,
      steelDragonElixirCoeff: 1 - steelDragonElixir / 100,
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

  function createSkillBattleValues(
    attacker,
    attackerWeapon,
    victim,
    mapping,
    marriageTable,
    magicSkill
  ) {
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
    var damageMultiplier = 1;
    var useDamages = 1;
    var defense = victim.defense;
    var magicResistance = 0;
    var weaponDefense = 0;
    var tigerStrength = 0;
    var criticalHitPercentage = attacker.criticalHit;
    var piercingHitPercentage = attacker.piercingHit;
    var extraPiercingHitPercentage = Math.max(0, piercingHitPercentage - 100);
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

    computePolymorphPoint(attacker, victim);
    computeHorse(attacker);

    if (isPC(attacker)) {
      attackValuePercent = attacker.attackValuePercent;
      attackMeleeMagic = attacker.attackMeleeMagic;

      var weaponType = attackerWeapon[1];

      if (attacker.class === "archery") {
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
              marriageTable,
              "loveNecklace"
            );
          }

          if (attacker.loveEarrings === "on") {
            criticalHitPercentage += getMarriageBonusValue(
              attacker,
              marriageTable,
              "loveEarrings"
            );
          }

          if (attacker.harmonyEarrings === "on") {
            piercingHitPercentage += getMarriageBonusValue(
              attacker,
              marriageTable,
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
              (attacker[elementBonusName] - victim[elementResistanceName]) / 200;
          } else {
            elementBonus[index] = attacker[elementBonusName] / 2000;
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
          skillDamage += attacker.skillBossDamage;
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

      skillDamage += attacker.skillDamage;
      rankBonus = getRankBonus(attacker);
      damageBonus = attacker.damageBonus;

      if (attacker.empireMalus === "on") {
        empireMalus = 10;
      }
    } else {
      if (isPC(victim)) {
        if (victim.isMarried === "on" && victim.harmonyBracelet === "on") {
          monsterResistanceMarriage = getMarriageBonusValue(
            victim,
            marriageTable,
            "harmonyBracelet"
          );
        }

        monsterResistance = victim.monsterResistance;

        for (var index = 0; index < elementBonus.length; index++) {
          var elementBonusName = mapping.elementBonus[index];
          var elementResistanceName = mapping.elementResistance[index];

          if (attacker[elementBonusName]) {
            elementBonus[index] =
              (attacker[elementBonusName] - victim[elementResistanceName]) / 125;
          }
        }
      }

      typeBonus = 1;
      damageMultiplier = attacker.damageMultiplier;
    }

    criticalHitPercentage = skillChanceReduction(criticalHitPercentage);
    piercingHitPercentage = skillChanceReduction(piercingHitPercentage);

    if (isPC(victim)) {
      criticalHitPercentage = Math.max(
        0,
        criticalHitPercentage - victim.criticalHitResistance
      );
      piercingHitPercentage = Math.max(
        0,
        piercingHitPercentage - victim.piercingHitResistance
      );
      skillDamageResistance = victim.skillDamageResistance;

      if (isMagicClass(victim)) {
        defensePercent = (-2 * victim.magicDefense * victim.defensePercent) / 100;
      } else {
        defensePercent = (-2 * victim.defense * victim.defensePercent) / 100;
      }

      if (victim.steelDragonElixir === "on") {
        steelDragonElixir = 10;
      }
    }

    if (magicSkill) {
      adjustCoeff = 0.5;
      attackValuePercent = attacker.attackMagic;
      attackValueMarriage = 0;
      defense = 0;
      if (!isDispell(attacker, 6)) {
        magicResistance = victim.magicResistance;
      }
      weaponDefense = 0;
    }

    var battleValues = {
      weaponBonusCoeff: 1,
      adjustCoeff: adjustCoeff,
      attackValueCoeff:
        1 + (attackValuePercent + Math.min(100, attackMeleeMagic)) / 100,
      attackValueMarriage: attackValueMarriage,
      monsterResistanceMarriageCoeff: 1 - monsterResistanceMarriage / 100,
      monsterResistanceCoeff: 1 - monsterResistance / 100,
      typeBonusCoeff: 1 + typeBonus / 100,
      raceBonusCoeff: raceBonus / 100,
      raceResistanceCoeff: raceResistance / 100,
      monsterBonusCoeff: 1 + monsterBonus / 100,
      stoneBonusCoeff: 1 + stoneBonus / 100,
      elementBonusCoeff: elementBonus,
      damageMultiplier: damageMultiplier,
      useDamages: useDamages,
      defense: defense,
      tigerStrengthCoeff: 1 + tigerStrength / 100,
      piercingHitDefense: victim.defense,
      magicResistanceCoeff: magicResistanceToCoeff(magicResistance),
      weaponDefenseCoeff: 1 - weaponDefense / 100,
      extraPiercingHitCoeff: extraPiercingHitPercentage / 200,
      skillDamageCoeff: 1 + skillDamage / 100,
      skillDamageResistanceCoeff: 1 - Math.min(99, skillDamageResistance) / 100,
      rankBonusCoeff: 1 + rankBonus / 100,
      defensePercent: Math.floor(defensePercent),
      damageBonusCoeff: damageBonus / 100,
      empireMalusCoeff: 1 - empireMalus / 100,
      sungMaStrBonusCoeff: 1 + sungMaStrBonus / 10000,
      sungmaStrMalusCoeff: sungmaStrMalus,
      whiteDragonElixirCoeff: 1 + whiteDragonElixir / 100,
      steelDragonElixirCoeff: 1 - steelDragonElixir / 100,
    };

    criticalHitPercentage = Math.min(criticalHitPercentage, 100);
    piercingHitPercentage = Math.min(piercingHitPercentage, 100);

    battleValues.damagesTypeCombinaison = [
      {
        criticalHit: false,
        piercingHit: false,
        weight: (100 - criticalHitPercentage) * (100 - piercingHitPercentage) * 100,
        name: "normalHit",
      },
      {
        criticalHit: true,
        piercingHit: false,
        weight: criticalHitPercentage * (100 - piercingHitPercentage) * 100,
        name: "criticalHit",
      },
      {
        criticalHit: false,
        piercingHit: true,
        weight: (100 - criticalHitPercentage) * piercingHitPercentage * 100,
        name: "piercingHit",
      },
      {
        criticalHit: true,
        piercingHit: true,
        weight: criticalHitPercentage * piercingHitPercentage * 100,
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

    battleValues.weaponBonusCoeff = 1 + weaponBonus / 100;
    battleValues.skillWardCoeff = 1 - skillWard / 100;
    battleValues.skillBonusCoeff = 1 + skillBonus / 100;
    battleValues.skillBonusByBonusCoeff = 1 + skillBonusByBonus / 100;
  }

  function calcPhysicalDamages(
    attacker,
    attackerWeapon,
    victim,
    tableResult,
    mapping,
    constants,
    damagesChart,
    numberFormat
  ) {
    var battleValues = createPhysicalBattleValues(
      attacker,
      attackerWeapon,
      victim,
      mapping,
      constants.polymorphPowerTable,
      constants.marriageTable,
      constants.skillPowerTable
    );

    var attackFactor = calcAttackFactor(attacker, victim);
    var mainAttackValue = calcMainAttackValue(attacker, attackerWeapon);
    var [
      minAttackValue,
      maxAttackValue,
      attackValueOther,
      minInterval,
      totalCardinal,
    ] = calcSecondaryAttackValue(attacker, attackerWeapon);

    var damagesWeightedByType = {};

    if (battleValues.missPercentage) {
      damagesWeightedByType.miss = battleValues.missPercentage / 100;
    }

    var lastWeightsLimit = maxAttackValue - minInterval + 1;
    var firstWeightLimit = minAttackValue + minInterval - 1;

    for (var damagesType of battleValues.damagesTypeCombinaison) {
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
        var weight;

        if (attackValue > lastWeightsLimit) {
          weight = maxAttackValue - attackValue + 1;
        } else if (attackValue < firstWeightLimit) {
          weight = attackValue - minAttackValue + 1;
        } else {
          weight = minInterval;
        }

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
          battleValues.defense +
          battleValues.defenseMarriage;

        if (minPiercingDamages <= 2) {
          for (var damages = 1; damages <= 5; damages++) {
            var finalDamages = calcDamageWithSecondaryBonuses(
              damages,
              battleValues,
              damagesType,
              minPiercingDamages,
              damagesWithPrimaryBonuses
            );

            addKeyValue(
              damagesWeighted,
              finalDamages,
              (weight * damagesType.weight) / 5
            );
          }
        } else {
          var finalDamages = calcDamageWithSecondaryBonuses(
            minPiercingDamages,
            battleValues,
            damagesType,
            minPiercingDamages,
            damagesWithPrimaryBonuses
          );

          addKeyValue(damagesWeighted, finalDamages, weight * damagesType.weight);
        }
      }
    }

    return { damagesWeightedByType: damagesWeightedByType, totalCardinal: totalCardinal };
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
    var skillInfo = {};

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
          case 9:
            skillFormula = function (atk) {
              return floorMultiplication(
                3 * atk +
                (0.9 * atk + 500.5 + 5 * str + 3 * dex + lv) * skillPower,
                1
              );
            };
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
            skillFormula = function (atk) {
              return floorMultiplication(
                3 * atk +
                (0.9 * atk + 500.5 + 5 * str + 3 * dex + lv) * skillPower,
                1
              );
            };
            break;
        }
      } else if (attackerClass === "blade_fight") {
        switch (skillId) {
          // Embuscade
          case 1:
            skillFormula = function (atk) {
              return floorMultiplication(
                atk + (1.2 * atk + 600 + 4 * dex + 4 * str) * skillPower,
                1
              );
            };
            skillInfo.weaponBonus = [1, 50];
            improvedByBonus = true;
            improvedBySkillBonus = true;
            break;
          // Attaque rapide
          case 2:
            skillFormula = function (atk) {
              return floorMultiplication(
                atk + (1.6 * atk + 250 + 7 * dex + 7 * str) * skillPower,
                1
              );
            };
            skillInfo.weaponBonus = [1, 35];
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
            skillFormula = function (atk) {
              return floorMultiplication(
                atk + (1.7 * atk + 500.5 + 6 * dex + 5 * lv) * skillPower,
                1
              );
            };
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
            skillFormula = function (atk) {
              return floorMultiplication(
                1.5 * atk + (2.6 * atk + 0.9 * int + 200) * skillPower,
                1
              );
            };
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
            skillFormula = function (atk) {
              return floorMultiplication(
                atk +
                (1.4 * atk + 150 + 7 * dex + 4 * str + 4 * int) * skillPower,
                1
              );
            };
            improvedByBonus = true;
            break;
          // Coup étincelant
          case 6:
            skillFormula = function (atk) {
              return floorMultiplication(
                (atk +
                  (1.2 * atk + 150 + 6 * dex + 3 * str + 3 * int) * skillPower) *
                1.2,
                1
              );
            };
            improvedByBonus = true;
            break;
          // Tir tempête
          case 9:
            skillFormula = function (atk) {
              return floorMultiplication(
                1.9 * atk + (2.6 * atk + 500.5) * skillPower,
                1
              );
            };
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
            skillFormula = function (mav) {
              return floorMultiplication(
                40 +
                5 * lv +
                2 * int +
                (10 * int + 7 * mav + 75) * attackFactor * skillPower,
                1
              );
            };
            break;
          // Coup démoniaque
          case 9:
            skillFormula = function (atk) {
              return floorMultiplication(
                1.9 * atk + (2.6 * atk + 500.5) * skillPower,
                1
              );
            };
            break;
        }
      } else if (attackerClass === "black_magic") {
        switch (skillId) {
          // Attaque des ténèbres
          case 1:
            skillFormula = function (mav) {
              return floorMultiplication(
                40 +
                5 * lv +
                2 * int +
                (13 * int + 6 * mav + 75) * attackFactor * skillPower,
                1
              );
            };
            improvedByBonus = true;
            improvedBySkillBonus = true;
            break;
          // Attaque de flammes
          // case 2:
          //   skillFormula = function (mav) {
          //     return floorMultiplication(
          //       5 * lv + 2 * int + (7 * int + 8 * mav + 4 * str + 2 * vit + 190) * skillPower,
          //       1
          //     );
          //   };
          //   improvedByBonus = true;
          //   break;
          // Esprit de flammes
          case 3:
            skillFormula = function (mav) {
              return floorMultiplication(
                30 +
                2 * lv +
                2 * int +
                (7 * int + 6 * mav + 350) * attackFactor * skillPower,
                1
              );
            };
            break;
          // Frappe de l'esprit
          // case 5:
          //   skillFormula = function (mav) {
          //     return floorMultiplication(
          //       40 + 2 * lv + 2 * int + (2 * vit + 2 * dex + 13 * int + 6 * mav + 190) * attackFactor * skillPower,
          //       1
          //     );
          //   };
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
            skillFormula = function (mav) {
              return floorMultiplication(
                60 +
                5 * lv +
                (8 * int + 2 * dex + 8 * mav + 10 * int) *
                attackFactor *
                skillPower,
                1
              );
            };
            skillInfo.weaponBonus = [6, 10];
            improvedByBonus = true;
            break;
          // Invocation de foudre
          case 2:
            skillFormula = function (mav) {
              return floorMultiplication(
                40 +
                4 * lv +
                (13 * int + 2 * str + 10 * mav + 10.5 * int) *
                attackFactor *
                skillPower,
                1
              );
            };
            skillInfo.weaponBonus = [6, 10];
            improvedByBonus = true;
            improvedBySkillBonus = true;
            break;
          // Griffe de foudre
          case 3:
            skillFormula = function (mav) {
              return floorMultiplication(
                50 +
                5 * lv +
                (8 * int + 2 * str + 8 * mav + 400.5) *
                attackFactor *
                skillPower,
                1
              );
            };
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

  function calcPhysicalSkillDamages(
    attacker,
    attackerWeapon,
    victim,
    tableResult,
    mapping,
    constants,
    damagesChart,
    numberFormat,
    skillId
  ) {
    var battleValues = createSkillBattleValues(
      attacker,
      attackerWeapon,
      victim,
      mapping,
      constants.marriageTable
    );

    var attackFactor = calcAttackFactor(attacker, victim);
    var mainAttackValue = calcMainAttackValue(attacker, attackerWeapon);
    var [
      minAttackValue,
      maxAttackValue,
      attackValueOther,
      minInterval,
      totalCardinal,
    ] = calcSecondaryAttackValue(attacker, attackerWeapon);

    var lastWeightsLimit = maxAttackValue - minInterval + 1;
    var firstWeightLimit = minAttackValue + minInterval - 1;

    var [skillFormula, skillInfo] = getSkillFormula(
      constants.skillPowerTable,
      skillId,
      attacker,
      attackFactor,
      victim
    );

    updateBattleValues(battleValues, skillInfo, attackerWeapon);

    var damagesWeightedByType = {};

    for (var damagesType of battleValues.damagesTypeCombinaison) {
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
        var weight;

        if (attackValue > lastWeightsLimit) {
          weight = maxAttackValue - attackValue + 1;
        } else if (attackValue < firstWeightLimit) {
          weight = attackValue - minAttackValue + 1;
        } else {
          weight = minInterval;
        }

        var secondaryAttackValue = 2 * attackValue + attackValueOther;
        var rawDamages =
          mainAttackValue +
          floorMultiplication(attackFactor, secondaryAttackValue);

        var damagesWithPrimaryBonuses = calcDamageWithPrimaryBonuses(
          rawDamages,
          battleValues
        );

        if (damagesWithPrimaryBonuses <= 2) {
          for (var damages = 1; damages <= 5; damages++) {
            damages *= battleValues.useDamages;

            var damagesWithFormula = skillFormula(damages);

            damagesWithFormula = floorMultiplication(
              damagesWithFormula,
              battleValues.weaponBonusCoeff
            );

            var finalDamages = calcSkillDamageWithSecondaryBonuses(
              damagesWithFormula,
              battleValues,
              damagesType,
              damagesWithPrimaryBonuses
            );

            addKeyValue(
              damagesWeighted,
              finalDamages,
              (weight * damagesType.weight) / 5
            );
          }
        } else {
          damagesWithPrimaryBonuses *= battleValues.useDamages;

          var damagesWithFormula = skillFormula(damagesWithPrimaryBonuses);

          damagesWithFormula = floorMultiplication(
            damagesWithFormula,
            battleValues.weaponBonusCoeff
          );

          var finalDamages = calcSkillDamageWithSecondaryBonuses(
            damagesWithFormula,
            battleValues,
            damagesType,
            damagesWithPrimaryBonuses
          );

          addKeyValue(
            damagesWeighted,
            finalDamages,
            (weight * damagesType.weight)
          );
        }
      }
    }

    return { damagesWeightedByType: damagesWeightedByType, totalCardinal: totalCardinal };
  }

  function calcMagicSkillDamages(
    attacker,
    attackerWeapon,
    victim,
    tableResult,
    mapping,
    constants,
    damagesChart,
    numberFormat,
    skillId
  ) {
    var battleValues = createSkillBattleValues(
      attacker,
      attackerWeapon,
      victim,
      mapping,
      constants.marriageTable,
      true
    );

    var attackFactor = calcAttackFactor(attacker, victim);
    var [minMagicAttackValue, maxMagicAttackValue, minInterval, totalCardinal] =
      calcMagicAttackValue(attacker, attackerWeapon);

    var lastWeightsLimit = maxMagicAttackValue - minInterval + 1;
    var firstWeightLimit = minMagicAttackValue + minInterval - 1;

    var [skillFormula, skillInfo] = getSkillFormula(
      constants.skillPowerTable,
      skillId,
      attacker,
      attackFactor,
      victim
    );

    updateBattleValues(battleValues, skillInfo, attackerWeapon);

    var damagesWeightedByType = {};

    for (var damagesType of battleValues.damagesTypeCombinaison) {
      if (!damagesType.weight) {
        continue;
      }

      var damagesWeighted = {};
      damagesWeightedByType[damagesType.name] = damagesWeighted;

      for (
        var magicAttackValue = minMagicAttackValue;
        magicAttackValue <= maxMagicAttackValue;
        magicAttackValue++
      ) {
        var weight;

        if (magicAttackValue > lastWeightsLimit) {
          weight = maxMagicAttackValue - magicAttackValue + 1;
        } else if (magicAttackValue < firstWeightLimit) {
          weight = magicAttackValue - minMagicAttackValue + 1;
        } else {
          weight = minInterval;
        }

        var rawDamages = skillFormula(magicAttackValue);

        rawDamages = floorMultiplication(
          rawDamages,
          battleValues.weaponBonusCoeff
        );

        var damagesWithPrimaryBonuses = calcDamageWithPrimaryBonuses(
          rawDamages,
          battleValues
        );

        if (damagesWithPrimaryBonuses <= 2) {
          for (var damages = 1; damages <= 5; damages++) {
            var finalDamages = calcSkillDamageWithSecondaryBonuses(
              damages,
              battleValues,
              damagesType,
              damagesWithPrimaryBonuses,
              skillFormula
            );

            addKeyValue(
              damagesWeighted,
              finalDamages,
              (weight * damagesType.weight) / 5
            )
          }
        } else {
          var finalDamages = calcSkillDamageWithSecondaryBonuses(
            damagesWithPrimaryBonuses,
            battleValues,
            damagesType,
            damagesWithPrimaryBonuses,
            skillFormula
          );

          addKeyValue(
            damagesWeighted,
            finalDamages,
            (weight * damagesType.weight)
          );
        }
      }
    }

    return { damagesWeightedByType: damagesWeightedByType, totalCardinal: totalCardinal };
  }

  function calcDamages(attacker, victim, attackType, battle) {
    var damagesCalculator;
    var skillId = 0;

    var attackerWeapon = null;

    if (isPC(attacker)) {
      if (weaponData.hasOwnProperty(attacker.weapon)) {
        attackerWeapon = weaponData[attacker.weapon];
      } else {
        attackerWeapon = weaponData[0];
      }
    }

    if (attackType === "physical") {
      damagesCalculator = calcPhysicalDamages;
    } else if (attackType.startsWith("attackSkill")) {
      skillId = Number(attackType.split("attackSkill")[1]);

      if (isMagicClass(attacker) || isDispell(attacker, skillId)) {
        damagesCalculator = calcMagicSkillDamages;
      } else {
        damagesCalculator = calcPhysicalSkillDamages;
      }
    } else if (attackType.startsWith("horseSkill")) {
      skillId = Number(attackType.split("horseSkill")[1]);
      damagesCalculator = calcPhysicalSkillDamages;
    }

    var damagesWeightedByType = damagesCalculator(
      attacker,
      attackerWeapon,
      victim,
      battle.tableResult,
      battle.mapping,
      battle.constants,
      battle.damagesChart,
      battle.numberFormat,
      skillId
    );

    return damagesWeightedByType;
  }

  return calcDamages(attacker, victim, attackType, battle);
}

const WARRIOR = "warrior",
  NINJA = "ninja",
  SURA = "sura",
  SHAMAN = "shaman",
  LYCAN = "lycan",

  BODY = "body",
  MENTAL = "mental",
  BLACK_MAGIC = "black_magic",
  WEAPONARY = "weaponary",
  BLADE_FIGHT = "blade_fight",
  ARCHERY = "archery",
  DRAGON = "dragon",
  HEAL = "heal",
  LYCAN_CLASS = "lycan",

  NORMAL = "normal",
  HORSE = "horse",
  POLYMORPH = "polymorph",

  POLYMORPH_MONSTER_101 = 101,
  POLYMORPH_MONSTER_502 = 502,
  POLYMORPH_MONSTER_2001 = 2001,
  POLYMORPH_MONSTER_2051 = 2051,

  UNCHECKED = "",
  CHECKED = "on",

  NEUTRAL = "neutral",
  AGGRESSIVE = "aggressive",
  FRAUDULENT = "fraudulent",
  MALICIOUS = "malicious",
  CRUEL = "cruel",

  NO_WARD = 0,
  BODY_WARD = "body",
  MENTAL_WARD = "mental",
  BLADE_FIGHT_WARD = "blade_fight",
  ARCHERY_WARD = "archery",
  WEAPONARY_WARD = "weaponary",
  BLACK_MAGIC_WARD = "black_magic",
  DRAGON_WARD = "dragon",
  HEAL_WARD = "heal",
  LYCAN_WARD = "lycan",

  ATTACK_SKILL_1 = "attackSkill1",
  ATTACK_SKILL_2 = "attackSkill2",
  ATTACK_SKILL_3 = "attackSkill3",
  ATTACK_SKILL_4 = "attackSkill4",
  ATTACK_SKILL_5 = "attackSkill5",
  ATTACK_SKILL_6 = "attackSkill6",
  ATTACK_SKILL_9 = "attackSkill9",
  HORSE_SKILL_137 = "horseSkill137",
  HORSE_SKILL_138 = "horseSkill138",
  HORSE_SKILL_139 = "horseSkill139",
  HORSE_SKILL_140 = "horseSkill140"

function createRange(min, max) {
  const range = [];

  for (let value = min; value <= max; value++) {
    range.push(value);
  }

  return range;
}

const RANGE_5 = createRange(0, 5),
  RANGE_10 = createRange(0, 10),
  RANGE_20 = createRange(0, 20),
  RANGE_40 = createRange(0, 40),
  RANGE_50 = createRange(0, 50),
  RANGE_100 = createRange(0, 100),
  RANGE_200 = createRange(0, 200),
  RANGE_300 = createRange(1, 200),
  RANGE_400 = createRange(0, 400),
  RANGE_500 = createRange(0, 500),
  RANGE_2000 = createRange(0, 2000)

const ALLOWED_VALUES = {
  race: [WARRIOR, NINJA, SURA, SHAMAN, LYCAN],
  level: createRange(1, 120),
  state: [NORMAL, HORSE, POLYMORPH],
  polymorphMonster: [
    POLYMORPH_MONSTER_101,
    POLYMORPH_MONSTER_502,
    POLYMORPH_MONSTER_2001,
    POLYMORPH_MONSTER_2051,
  ],
  vit: RANGE_300,
  int: RANGE_300,
  str: RANGE_300,
  dex: RANGE_300,
  defense: createRange(0, 5000),
  magicDefense: createRange(0, 3000),
  attackSpeed: RANGE_300,
  sungmaStr: RANGE_500,
  sungmaStrMalus: RANGE_100,
  minAttackValueRandom: RANGE_2000,
  maxAttackValueRandom: RANGE_2000,
  minMagicAttackValueRandom: RANGE_2000,
  maxMagicAttackValueRandom: RANGE_2000,
  minAttackValueSlash: RANGE_500,
  maxAttackValueSlash: RANGE_500,
  minMagicAttackValueSlash: RANGE_200,
  maxMagicAttackValueSlash: RANGE_200,
  stoneBonus: RANGE_200,
  humanBonus: RANGE_200,
  humanResistance: RANGE_100,
  orcBonus: RANGE_500,
  undeadBonus: RANGE_500,
  monsterBonus: RANGE_200,
  zodiacBonus: RANGE_100,
  monsterResistance: RANGE_50,
  animalBonus: RANGE_500,
  mysticBonus: RANGE_500,
  devilBonus: RANGE_500,
  desertBonus: RANGE_500,
  insectBonus: RANGE_500,
  attackValuePercent: RANGE_400,
  attackValue: createRange(0, 6000),
  defensePercent: RANGE_100,
  defenseUseless: RANGE_100,
  averageDamage: createRange(-55, 200),
  averageDamageResistance: RANGE_200,
  skillDamage: createRange(-27, 200),
  skillDamageResistance: RANGE_200,
  attackMeleeMagic: RANGE_200,
  attackMagic: RANGE_200,
  magicAttackValue: RANGE_200,
  criticalHit: RANGE_200,
  piercingHit: RANGE_200,
  criticalHitResistance: RANGE_50,
  piercingHitResistance: RANGE_50,
  magicResistance: RANGE_200,
  antiMagic: RANGE_200,
  lightningResistance: RANGE_400,
  fireResistance: RANGE_400,
  iceResistance: RANGE_400,
  windResistance: RANGE_400,
  earthResistance: RANGE_400,
  darknessResistance: RANGE_400,
  lightningBonus: RANGE_400,
  fireBonus: RANGE_400,
  iceBonus: RANGE_400,
  windBonus: RANGE_400,
  earthBonus: RANGE_400,
  darknessBonus: RANGE_400,
  warriorBonus: RANGE_200,
  ninjaBonus: RANGE_200,
  suraBonus: RANGE_200,
  shamanBonus: RANGE_200,
  lycanBonus: RANGE_200,
  warriorResistance: RANGE_200,
  ninjaResistance: RANGE_200,
  suraResistance: RANGE_200,
  shamanResistance: RANGE_200,
  lycanResistance: RANGE_200,
  swordDefense: RANGE_100,
  twoHandedSwordDefense: RANGE_100,
  daggerDefense: RANGE_100,
  clawDefense: RANGE_100,
  bellDefense: RANGE_100,
  fanDefense: RANGE_100,
  arrowDefense: RANGE_100,
  breakSwordDefense: RANGE_10,
  breakTwoHandedSwordDefense: RANGE_10,
  breakDaggerDefense: RANGE_10,
  breakBellDefense: RANGE_10,
  breakFanDefense: RANGE_10,
  breakArrowDefense: RANGE_10,
  breakClawDefense: RANGE_10,
  meleeBlock: RANGE_200,
  arrowBlock: RANGE_200,
  precision: RANGE_200,
  leadership: RANGE_100,
  bossDamage: RANGE_20,
  skillBossDamage: RANGE_20,
  damageBonus: RANGE_10,
  meleeArrowBlock: RANGE_10,
  biologist70: [UNCHECKED, CHECKED],
  empireMalus: [UNCHECKED, CHECKED],
  tigerStrength: [UNCHECKED, CHECKED],
  whiteDragonElixir: [UNCHECKED, CHECKED],
  steelDragonElixir: [UNCHECKED, CHECKED],
  lowRank: [UNCHECKED, CHECKED],
  playerRank: [NEUTRAL, AGGRESSIVE, FRAUDULENT, MALICIOUS, CRUEL],
  attackSkill1: RANGE_40,
  attackSkill2: RANGE_40,
  attackSkill3: RANGE_40,
  attackSkill4: RANGE_40,
  attackSkill5: RANGE_40,
  attackSkill6: RANGE_40,
  attackSkill9: RANGE_40,
  skillBlessing: [UNCHECKED, CHECKED],
  intBlessing: RANGE_300,
  dexBlessing: RANGE_300,
  blessingOnself: [UNCHECKED, CHECKED],
  skillWardChoice: [
    NO_WARD,
    BODY_WARD,
    MENTAL_WARD,
    BLADE_FIGHT_WARD,
    ARCHERY_WARD,
    WEAPONARY_WARD,
    BLACK_MAGIC_WARD,
    DRAGON_WARD,
    HEAL_WARD,
    LYCAN_WARD,
  ],
  skillWard: RANGE_40,
  skillBonus: RANGE_40,
  polymorphPoint: RANGE_40,
  horsePoint: RANGE_40,
  horseSkill137: RANGE_20,
  horseSkill138: RANGE_20,
  horseSkill139: RANGE_20,
  horseSkill140: RANGE_20,
  skillBonus1: RANGE_5,
  skillBonus2: RANGE_5,
  skillBonus3: RANGE_5,
  skillBonus4: RANGE_5,
  skillBonus5: RANGE_5,
  skillBonus6: RANGE_5,
  isMarried: [UNCHECKED, CHECKED],
  lovePoint: createRange(50, 100),
  harmonyBracelet: [UNCHECKED, CHECKED],
  loveNecklace: [UNCHECKED, CHECKED],
  harmonyNecklace: [UNCHECKED, CHECKED],
  loveEarrings: [UNCHECKED, CHECKED],
  harmonyEarrings: [UNCHECKED, CHECKED],
}

const CLASS_VALUES = {
  warrior: [BODY, MENTAL],
  sura: [BLACK_MAGIC, WEAPONARY],
  ninja: [BLADE_FIGHT, ARCHERY],
  shaman: [DRAGON, HEAL],
  lycan: [LYCAN_CLASS],
}

const ALLOWED_SKILLS = {
  body: [1, 2, 5, 6],
  mental: [1, 2, 5, 6],
  blade_fight: [3, 5, 6],
  archery: [2, 4],
  weaponary: [1, 2],
  black_magic: [6],
  dragon: [1, 2, 3],
  heal: [],
  lycan: [2, 3, 4],
}

const ALLOWED_HORSE_SKILLS = {
  body: [137, 138, 139],
  mental: [137, 138, 139],
  blade_fight: [137, 138, 139, 140],
  archery: [137, 138, 139, 140],
  weaponary: [137, 138, 139],
  black_magic: [137, 138, 139],
  dragon: [137, 138, 139],
  heal: [137, 138, 139],
  lycan: [137, 138, 139],
}

const SKILL_MAPPING = {
  1: ATTACK_SKILL_1,
  2: ATTACK_SKILL_2,
  3: ATTACK_SKILL_3,
  4: ATTACK_SKILL_4,
  5: ATTACK_SKILL_5,
  6: ATTACK_SKILL_6,
  9: ATTACK_SKILL_9,
  137: HORSE_SKILL_137,
  138: HORSE_SKILL_138,
  139: HORSE_SKILL_139,
  140: HORSE_SKILL_140,
}

const ALLOWED_WEAPONS = {
  warrior: [0, 3, 8],
  ninja: [0, 1, 2, 8],
  sura: [0, 7, 8],
  shaman: [4, 6, 8],
  lycan: [5, 8],
}

function getAllMonsters() {
  const monsters = [];
  const monstersNoStones = [];

  for (const [key, value] of Object.entries(monsterData)) {
    if (value[1] === 0) {
      monstersNoStones.push(key)
    }
    monsters.push(key)
  }

  return [monsters, monstersNoStones];
}

const [MONSTERS, MONSTERS_NO_STONES] = getAllMonsters();

function getWeaponsToUse(race) {
  const weaponsToUse = {};

  for (const [key, value] of Object.entries(weaponData)) {
    if (ALLOWED_WEAPONS[race].includes(value[1])) {
      weaponsToUse[key] = value[3].length;
    }
  }

  return weaponsToUse;
}

const WEAPONS_TO_USE = {
  warrior: getWeaponsToUse("warrior"),
  sura: getWeaponsToUse("sura"),
  ninja: getWeaponsToUse("ninja"),
  shaman: getWeaponsToUse("shaman"),
  lycan: getWeaponsToUse("lycan")
}

function randomChoiceWeighted(arr) {
  const weights = Array.from(arr, (_, idx) => arr.length - idx);
  const sum = weights.reduce((a, b) => a + b, 0);
  let random = Math.random() * sum;
  let index = weights.length - 1;

  for (let i = 0; i < weights.length; i++) {
    if (random < weights[i]) {
      index = i;
      break;
    } else {
      random -= weights[i];
    }
  }

  return arr[index];
}

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function createRandomCharacter(index) {
  const character = { name: `random_char_${index}` };

  for (const [key, value] of Object.entries(ALLOWED_VALUES)) {
    let chosenValue;

    if ((value[0] === 0 || value[0] === 1)) {
      chosenValue = randomChoiceWeighted(value);
    } else {
      chosenValue = randomChoice(value);
    }
    character[key] = chosenValue;
  }

  const characterRace = character.race;
  const weapons = WEAPONS_TO_USE[characterRace];
  const weaponVnum = randomChoice(Object.keys(weapons));
  const maxUpgrade = weapons[weaponVnum];

  character.class = randomChoice(CLASS_VALUES[characterRace]);
  character.weapon = Number(weaponVnum);
  character.weaponUpgrade = maxUpgrade ? randomChoice(createRange(0, maxUpgrade)) : 0;

  return character;
}

function main() {
  const battle = { mapping: createMapping(), constants: createConstants() };
  let charIndex = 0;

  for (let index = 0; index < 100; index++) {
    let attacker, victim, attackType;

    if (Math.random() >= 0.3) {
      attacker = createRandomCharacter(charIndex);
      charIndex++;

      if (isPolymorph(attacker)) {
        attackType = "physical";
      } else {
        const attackerClass = attacker.class;
        let skillsToUse = [...ALLOWED_SKILLS[attackerClass]];

        if (isRiding(attacker)) {
          skillsToUse = skillsToUse.concat(ALLOWED_HORSE_SKILLS[attackerClass]);
        }

        skillsToUse = skillsToUse.filter(skill => attacker[SKILL_MAPPING[skill]]).map(skill => SKILL_MAPPING[skill]);
        attackType = randomChoice(["physical"].concat(skillsToUse));
      }
    } else {
      attacker = createMonster(randomChoice(MONSTERS_NO_STONES));
      attackType = "physical";
    }

    if (Math.random() >= 0.5) {
      victim = createRandomCharacter(charIndex);
      charIndex++;
    } else {
      victim = createMonster(randomChoice(MONSTERS));
    }

    victim.magicResistance = 0;

    const { damagesWeightedByType: damagesWeightedByTypeReference, totalCardinal: totalCardinalReference } = referenceCalculation(
      {...attacker},
      {...victim},
      attackType,
      battle
    );

    damagesWeightedByTypeReference.totalCardinal = totalCardinalReference;

    const { damagesWeightedByType, totalCardinal } = calcDamages(
      {...attacker},
      {...victim},
      attackType,
      battle
    );

    damagesWeightedByType.totalCardinal = totalCardinal;

    if (JSON.stringify(damagesWeightedByType) !== JSON.stringify(damagesWeightedByTypeReference)) {
      console.log("Error. A difference appeared in the results")
      console.log(attacker);
      console.log(victim);
      console.log(attackType);
      console.log(JSON.parse(JSON.stringify(damagesWeightedByType)));
      console.log(JSON.parse(JSON.stringify(damagesWeightedByTypeReference)));

      if (isPC(attacker)) {
        downloadCharacter(attacker);
      }

      if (isPC(victim)) {
        downloadCharacter(victim);
      }
      
      break;
    } else {
      console.log("Success! The simulations generated the same results")
    }
  }
}

main();
