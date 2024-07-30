const characters = {
    test1: {"name":"80 devil","race":"sura","level":112,"class":"weaponary","state":"horse","polymorphMonster":101,"vit":48,"int":90,"str":112,"dex":84,"defense":873,"magicDefense":588,"attackSpeed":100,"sungmaStr":0,"sungmaStrMalus":0,"weaponUpgrade":9,"minAttackValueRandom":0,"maxAttackValueRandom":0,"minMagicAttackValueRandom":0,"maxMagicAttackValueRandom":0,"weapon":180,"minAttackValueSlash":48,"maxAttackValueSlash":67,"minMagicAttackValueSlash":0,"maxMagicAttackValueSlash":0,"stoneBonus":0,"humanBonus":0,"humanResistance":0,"orcBonus":0,"undeadBonus":0,"monsterBonus":16,"zodiacBonus":0,"monsterResistance":0,"animalBonus":0,"mysticBonus":0,"devilBonus":80,"desertBonus":0,"insectBonus":0,"attackValuePercent":0,"attackValue":1015,"defensePercent":0,"defenseUseless":0,"averageDamage":75,"averageDamageResistance":0,"skillDamage":0,"skillDamageResistance":0,"attackMeleeMagic":23,"attackMagic":0,"magicAttackValue":0,"criticalHit":0,"piercingHit":0,"criticalHitResistance":0,"piercingHitResistance":0,"magicResistance":0,"antiMagic":0,"lightningResistance":0,"fireResistance":0,"iceResistance":0,"windResistance":0,"earthResistance":0,"darknessResistance":0,"lightningBonus":0,"fireBonus":0,"iceBonus":0,"windBonus":0,"earthBonus":0,"darknessBonus":0,"warriorBonus":0,"ninjaBonus":0,"suraBonus":0,"shamanBonus":0,"lycanBonus":0,"warriorResistance":0,"ninjaResistance":0,"suraResistance":0,"shamanResistance":0,"lycanResistance":0,"swordDefense":0,"twoHandedSwordDefense":0,"daggerDefense":0,"clawDefense":0,"bellDefense":0,"fanDefense":0,"arrowDefense":0,"breakSwordDefense":0,"breakTwoHandedSwordDefense":0,"breakDaggerDefense":0,"breakBellDefense":0,"breakFanDefense":0,"breakArrowDefense":0,"breakClawDefense":0,"meleeBlock":0,"arrowBlock":0,"precision":0,"leadership":0,"bossDamage":0,"skillBossDamage":0,"damageBonus":0,"meleeArrowBlock":0,"playerRank":"neutral","attackSkill1":0,"attackSkill2":0,"attackSkill3":0,"attackSkill4":0,"attackSkill5":0,"attackSkill6":0,"attackSkill9":0,"skillBlessing":0,"intBlessing":1,"dexBlessing":1,"skillWardChoice":0,"skillWard":0,"skillBonus":0,"polymorphPoint":0,"horsePoint":0,"horseSkill137":0,"horseSkill138":0,"horseSkill139":0,"horseSkill140":0,"skillBonus1":0,"skillBonus2":0,"skillBonus3":0,"skillBonus4":0,"skillBonus5":0,"skillBonus6":0,"lovePoint":50,"sungMahiFloor":1,"sungMahiStep":1},
    test2: {"name":"Guerrier En-Tai","rank":2,"race":0,"attack":0,"level":102,"type":7,"str":115,"dex":87,"vit":60,"int":30,"minAttackValue":183,"maxAttackValue":268,"rawDefense":119,"criticalHit":10,"piercingHit":16,"fistDefense":0,"swordDefense":0,"twoHandedSwordDefense":0,"daggerDefense":0,"bellDefense":0,"fanDefense":0,"arrowDefense":0,"clawDefense":0,"fireResistance":0,"lightningResistance":0,"magicResistance":0,"windResistance":-60,"lightningBonus":0,"fireBonus":0,"iceBonus":0,"windBonus":1,"earthBonus":0,"darknessBonus":0,"darknessResistance":0,"iceResistance":0,"earthResistance":0,"damageMultiplier":3,"defense":281}
}

const results = {
    fight0: '{"normalHit":{"6569":1000000,"6573":2000000,"6583":3000000,"6588":4000000,"6595":5000000,"6602":6000000,"6606":7000000,"6615":8000000,"6620":9000000,"6629":10000000,"6632":11000000,"6639":12000000,"6646":13000000,"6651":14000000,"6660":15000000,"6665":16000000,"6669":17000000,"6679":18000000,"6683":19000000,"6690":20000000,"6697":20000000,"6702":20000000,"6707":20000000,"6711":20000000,"6723":20000000,"6725":20000000,"6730":20000000,"6742":20000000,"6744":20000000,"6753":20000000,"6760":20000000,"6762":20000000,"6770":20000000,"6779":20000000,"6784":20000000,"6788":20000000,"6797":20000000,"6804":20000000,"6807":20000000,"6818":20000000,"6821":20000000,"6825":19000000,"6835":18000000,"6839":17000000,"6847":16000000,"6854":15000000,"6858":14000000,"6867":13000000,"6870":12000000,"6881":11000000,"6884":10000000,"6888":9000000,"6898":8000000,"6902":7000000,"6912":6000000,"6917":5000000,"6921":4000000,"6926":3000000,"6935":2000000,"6944":1000000},"totalCardinal":820000000}'
}

const fights = [
    {attackerName: "test1", victimName: "test2", attackType: "physical", resultsName: "fight0"},
]

const battle = { mapping: createMapping(), constants: createConstants() }

for (let { attackerName, victimName, attackType, resultsName } of fights) {
    let attacker = {...characters[attackerName]};
    let victim = {...characters[victimName]};

    let {damagesWeightedByType, totalCardinal} = calcDamages(attacker, victim, attackType, battle);

    damagesWeightedByType.totalCardinal = totalCardinal;

    let savedResults = results[resultsName];
    let currentResults = JSON.stringify(damagesWeightedByType);

    if (currentResults !== savedResults) {
        console.log("error with", attackerName, victimName, attackType, resultsName);
        console.log(currentResults, savedResults);
        break;
    } else {
        console.log("good")
    }
}