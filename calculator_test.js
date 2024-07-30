const characters = {
    test1: { "name": "Test1", "race": "warrior", "level": 120, "class": "body", "state": "normal", "polymorphMonster": 101, "vit": 124, "int": 122, "str": 131, "dex": 191, "defense": 1721, "magicDefense": 921, "attackSpeed": 100, "sungmaStr": 57, "onYohara": "on", "sungmaStrMalus": 12, "weaponUpgrade": 9, "minAttackValueRandom": 0, "maxAttackValueRandom": 0, "minMagicAttackValueRandom": 0, "maxMagicAttackValueRandom": 0, "weapon": 310, "minAttackValueSlash": 12, "maxAttackValueSlash": 171, "minMagicAttackValueSlash": 100, "maxMagicAttackValueSlash": 150, "stoneBonus": 17, "humanBonus": 18, "humanResistance": 19, "orcBonus": 20, "undeadBonus": 21, "monsterBonus": 22, "zodiacBonus": 0, "monsterResistance": 23, "animalBonus": 24, "mysticBonus": 25, "devilBonus": 26, "desertBonus": 27, "insectBonus": 28, "attackValuePercent": 29, "attackValue": 30, "defensePercent": 31, "defenseUseless": 0, "averageDamage": 32, "averageDamageResistance": 33, "skillDamage": 34, "skillDamageResistance": 35, "attackMeleeMagic": 36, "attackMagic": 37, "magicAttackValue": 0, "criticalHit": 67, "piercingHit": 81, "criticalHitResistance": 6, "piercingHitResistance": 7, "magicResistance": 81, "antiMagic": 0, "lightningResistance": 21, "fireResistance": 100, "iceResistance": 17, "windResistance": 51, "earthResistance": 21, "darknessResistance": 30, "lightningBonus": 5, "fireBonus": 20, "iceBonus": 81, "windBonus": 82, "earthBonus": 83, "darknessBonus": 84, "warriorBonus": 17, "ninjaBonus": 18, "suraBonus": 19, "shamanBonus": 20, "lycanBonus": 21, "warriorResistance": 12, "ninjaResistance": 13, "suraResistance": 14, "shamanResistance": 15, "lycanResistance": 16, "swordDefense": 17, "twoHandedSwordDefense": 18, "daggerDefense": 19, "clawDefense": 20, "bellDefense": 21, "fanDefense": 22, "arrowDefense": 23, "breakSwordDefense": 1, "breakTwoHandedSwordDefense": 2, "breakDaggerDefense": 3, "breakBellDefense": 4, "breakFanDefense": 5, "breakArrowDefense": 6, "breakClawDefense": 7, "meleeBlock": 5, "arrowBlock": 15, "precision": 0, "leadership": 81, "bossDamage": 5, "skillBossDamage": 4, "damageBonus": 3, "meleeArrowBlock": 2, "biologist70": "on", "empireMalus": "on", "tigerStrength": "on", "whiteDragonElixir": "on", "steelDragonElixir": "on", "lowRank": "on", "playerRank": "cruel", "attackSkill1": 40, "attackSkill2": 40, "attackSkill3": 0, "attackSkill4": 0, "attackSkill5": 40, "attackSkill6": 40, "attackSkill9": 40, "isBlessed": "on", "skillBlessing": 40, "intBlessing": 121, "dexBlessing": 92, "skillWardChoice": "blade_fight", "skillWard": 40, "skillBonus": 40, "polymorphPoint": 40, "horsePoint": 40, "horseSkill137": 20, "horseSkill138": 20, "horseSkill139": 20, "horseSkill140": 0, "skillBonus1": 1, "skillBonus2": 2, "skillBonus3": 0, "skillBonus4": 0, "skillBonus5": 3, "skillBonus6": 0, "isMarried": "on", "lovePoint": 100, "harmonyBracelet": "on", "loveNecklace": "on", "harmonyNecklace": "on", "loveEarrings": "on", "harmonyEarrings": "on", "sungMahiFloor": 1, "sungMahiStep": 1 }
}

const results = {
    fight0: {}
}

const fights = [
    {attackerName: "test1", victimName: "test1", attackType: "physical", resultsName: "fight0"}
]

const battle = { mapping: createMapping(), constants: createConstants() }

for (const { attackerName, victimName, attackType, resultsName } of fights) {
    let damages = calcDamages(characters[attackerName], characters[victimName], attackType, battle);
    console.log(JSON.stringify(damages));
    if (damages === results[resultsName]) {
        console.log("oui");
    }
}