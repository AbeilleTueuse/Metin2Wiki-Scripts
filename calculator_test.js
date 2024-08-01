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
  swordDefense: RANGE_200,
  twoHandedSwordDefense: RANGE_200,
  daggerDefense: RANGE_200,
  clawDefense: RANGE_200,
  bellDefense: RANGE_200,
  fanDefense: RANGE_200,
  arrowDefense: RANGE_200,
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

ALLOWED_WEAPONS = {
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
      attacker = { ...createMonster(randomChoice(MONSTERS_NO_STONES)) };
      attackType = "physical";
    }

    if (Math.random() >= 0.5) {
      victim = createRandomCharacter(charIndex);
      charIndex++;
    } else {
      victim = { ...createMonster(randomChoice(MONSTERS)) };
    }

    let { damagesWeightedByType, totalCardinal } = calcDamages(
      attacker,
      victim,
      attackType,
      battle
    );

    damagesWeightedByType.totalCardinal = totalCardinal;

    // let savedResults = results[resultsName];
    // let currentResults = JSON.stringify(damagesWeightedByType);

    // if (currentResults !== savedResults) {
    //     console.log("error with", attackerName, victimName, attackType, resultsName);
    //     console.log(currentResults, savedResults);
    //     break;
    // } else {
    //     console.log("good")
    // }
  }
}

main();

