import random as rd
import json


NAME = "name"
RACE = "race"
LEVEL = "level"
CLASS = "class"
STATE = "state"
POLYMORPH_MONSTER = "polymorphMonster"
VIT = "vit"
INT = "int"
STR = "str"
DEX = "dex"
DEFENSE = "defense"
MAGIC_DEFENSE = "magicDefense"
ATTACK_SPEED = "attackSpeed"
SUNGMA_STR = "sungmaStr"
SUNGMA_STR_MALUS = "sungmaStrMalus"
WEAPON_UPGRADE = "weaponUpgrade"
MIN_ATTACK_VALUE_RANDOM = "minAttackValueRandom"
MAX_ATTACK_VALUE_RANDOM = "maxAttackValueRandom"
MIN_MAGIC_ATTACK_VALUE_RANDOM = "minMagicAttackValueRandom"
MAX_MAGIC_ATTACK_VALUE_RANDOM = "maxMagicAttackValueRandom"
WEAPON = "weapon"
MIN_ATTACK_VALUE_SLASH = "minAttackValueSlash"
MAX_ATTACK_VALUE_SLASH = "maxAttackValueSlash"
MIN_MAGIC_ATTACK_VALUE_SLASH = "minMagicAttackValueSlash"
MAX_MAGIC_ATTACK_VALUE_SLASH = "maxMagicAttackValueSlash"
STONE_BONUS = "stoneBonus"
HUMAN_BONUS = "humanBonus"
HUMAN_RESISTANCE = "humanResistance"
ORC_BONUS = "orcBonus"
UNDEAD_BONUS = "undeadBonus"
MONSTER_BONUS = "monsterBonus"
ZODIAC_BONUS = "zodiacBonus"
MONSTER_RESISTANCE = "monsterResistance"
ANIMAL_BONUS = "animalBonus"
MYSTIC_BONUS = "mysticBonus"
DEVIL_BONUS = "devilBonus"
DESERT_BONUS = "desertBonus"
INSECT_BONUS = "insectBonus"
ATTACK_VALUE_PERCENT = "attackValuePercent"
ATTACK_VALUE = "attackValue"
DEFENSE_PERCENT = "defensePercent"
DEFENSE_USELESS = "defenseUseless"
AVERAGE_DAMAGE = "averageDamage"
AVERAGE_DAMAGE_RESISTANCE = "averageDamageResistance"
SKILL_DAMAGE = "skillDamage"
SKILL_DAMAGE_RESISTANCE = "skillDamageResistance"
ATTACK_MELEE_MAGIC = "attackMeleeMagic"
ATTACK_MAGIC = "attackMagic"
MAGIC_ATTACK_VALUE = "magicAttackValue"
CRITICAL_HIT = "criticalHit"
PIERCING_HIT = "piercingHit"
CRITICAL_HIT_RESISTANCE = "criticalHitResistance"
PIERCING_HIT_RESISTANCE = "piercingHitResistance"
MAGIC_RESISTANCE = "magicResistance"
ANTI_MAGIC = "antiMagic"
LIGHTNING_RESISTANCE = "lightningResistance"
FIRE_RESISTANCE = "fireResistance"
ICE_RESISTANCE = "iceResistance"
WIND_RESISTANCE = "windResistance"
EARTH_RESISTANCE = "earthResistance"
DARKNESS_RESISTANCE = "darknessResistance"
LIGHTNING_BONUS = "lightningBonus"
FIRE_BONUS = "fireBonus"
ICE_BONUS = "iceBonus"
WIND_BONUS = "windBonus"
EARTH_BONUS = "earthBonus"
DARKNESS_BONUS = "darknessBonus"
WARRIOR_BONUS = "warriorBonus"
NINJA_BONUS = "ninjaBonus"
SURA_BONUS = "suraBonus"
SHAMAN_BONUS = "shamanBonus"
LYCAN_BONUS = "lycanBonus"
WARRIOR_RESISTANCE = "warriorResistance"
NINJA_RESISTANCE = "ninjaResistance"
SURA_RESISTANCE = "suraResistance"
SHAMAN_RESISTANCE = "shamanResistance"
LYCAN_RESISTANCE = "lycanResistance"
SWORD_DEFENSE = "swordDefense"
TWO_HANDED_SWORD_DEFENSE = "twoHandedSwordDefense"
DAGGER_DEFENSE = "daggerDefense"
CLAW_DEFENSE = "clawDefense"
BELL_DEFENSE = "bellDefense"
FAN_DEFENSE = "fanDefense"
ARROW_DEFENSE = "arrowDefense"
BREAK_SWORD_DEFENSE = "breakSwordDefense"
BREAK_TWO_HANDED_SWORD_DEFENSE = "breakTwoHandedSwordDefense"
BREAK_DAGGER_DEFENSE = "breakDaggerDefense"
BREAK_BELL_DEFENSE = "breakBellDefense"
BREAK_FAN_DEFENSE = "breakFanDefense"
BREAK_ARROW_DEFENSE = "breakArrowDefense"
BREAK_CLAW_DEFENSE = "breakClawDefense"
MELEE_BLOCK = "meleeBlock"
ARROW_BLOCK = "arrowBlock"
PRECISION = "precision"
LEADERSHIP = "leadership"
BOSS_DAMAGE = "bossDamage"
SKILL_BOSS_DAMAGE = "skillBossDamage"
DAMAGE_BONUS = "damageBonus"
MELEE_ARROW_BLOCK = "meleeArrowBlock"
PLAYER_RANK = "playerRank"
ATTACK_SKILL_1 = "attackSkill1"
ATTACK_SKILL_2 = "attackSkill2"
ATTACK_SKILL_3 = "attackSkill3"
ATTACK_SKILL_4 = "attackSkill4"
ATTACK_SKILL_5 = "attackSkill5"
ATTACK_SKILL_6 = "attackSkill6"
ATTACK_SKILL_9 = "attackSkill9"
SKILL_BLESSING = "skillBlessing"
INT_BLESSING = "intBlessing"
DEX_BLESSING = "dexBlessing"
SKILL_WARD_CHOICE = "skillWardChoice"
SKILL_WARD = "skillWard"
SKILL_BONUS = "skillBonus"
POLYMORPH_POINT = "polymorphPoint"
HORSE_POINT = "horsePoint"
HORSE_SKILL_137 = "horseSkill137"
HORSE_SKILL_138 = "horseSkill138"
HORSE_SKILL_139 = "horseSkill139"
HORSE_SKILL_140 = "horseSkill140"
SKILL_BONUS_1 = "skillBonus1"
SKILL_BONUS_2 = "skillBonus2"
SKILL_BONUS_3 = "skillBonus3"
SKILL_BONUS_4 = "skillBonus4"
SKILL_BONUS_5 = "skillBonus5"
SKILL_BONUS_6 = "skillBonus6"
IS_MARRIED = "isMarried"
LOVE_POINT = "lovePoint"
HARMONY_BRACELET = "harmonyBracelet"
LOVE_NECKLACE = "loveNecklace"
HARMONY_NECKLACE = "harmonyNecklace"
LOVE_EARRINGS = "loveEarrings"
HARMONY_EARRINGS = "harmonyEarrings"

SUNG_MAHI_FLOOR = "sungMahiFloor"
SUNG_MAHI_STEP = "sungMahiStep"

WARRIOR = "warrior"
NINJA = "ninja"
SURA = "sura"
SHAMAN = "shaman"
LYCAN = "lycan"

BODY = "body"
MENTAL = "mental"
BLACK_MAGIC = "black_magic"
WEAPONARY = "weaponary"
BLADE_FIGHT = "blade_fight"
ARCHERY = "archery"
DRAGON = "dragon"
HEAL = "heal"
LYCAN_CLASS = "lycan"

NORMAL = "normal"
HORSE = "horse"
POLYMORPH = "polymorph"

POLYMORPH_MONSTER_101 = 101
POLYMORPH_MONSTER_502 = 502
POLYMORPH_MONSTER_2001 = 2001
POLYMORPH_MONSTER_2051 = 2051

STONE_BONUS = "stoneBonus"
HUMAN_BONUS = "humanBonus"
HUMAN_RESISTANCE = "humanResistance"
ORC_BONUS = "orcBonus"
UNDEAD_BONUS = "undeadBonus"
MONSTER_BONUS = "monsterBonus"
ZODIAC_BONUS = "zodiacBonus"
MONSTER_RESISTANCE = "monsterResistance"
ANIMAL_BONUS = "animalBonus"
MYSTIC_BONUS = "mysticBonus"
DEVIL_BONUS = "devilBonus"
DESERT_BONUS = "desertBonus"
INSECT_BONUS = "insectBonus"
ATTACK_VALUE_PERCENT = "attackValuePercent"
ATTACK_VALUE = "attackValue"
DEFENSE_PERCENT = "defensePercent"
DEFENSE_USELESS = "defenseUseless"
AVERAGE_DAMAGE = "averageDamage"
AVERAGE_DAMAGE_RESISTANCE = "averageDamageResistance"
SKILL_DAMAGE = "skillDamage"
SKILL_DAMAGE_RESISTANCE = "skillDamageResistance"
ATTACK_MELEE_MAGIC = "attackMeleeMagic"
ATTACK_MAGIC = "attackMagic"
MAGIC_ATTACK_VALUE = "magicAttackValue"
CRITICAL_HIT = "criticalHit"
PIERCING_HIT = "piercingHit"
CRITICAL_HIT_RESISTANCE = "criticalHitResistance"
PIERCING_HIT_RESISTANCE = "piercingHitResistance"

MAGIC_RESISTANCE = "magicResistance"
ANTI_MAGIC = "antiMagic"
LIGHTNING_RESISTANCE = "lightningResistance"
FIRE_RESISTANCE = "fireResistance"
ICE_RESISTANCE = "iceResistance"
WIND_RESISTANCE = "windResistance"
EARTH_RESISTANCE = "earthResistance"
DARKNESS_RESISTANCE = "darknessResistance"
LIGHTNING_BONUS = "lightningBonus"
FIRE_BONUS = "fireBonus"
ICE_BONUS = "iceBonus"
WIND_BONUS = "windBonus"
EARTH_BONUS = "earthBonus"
DARKNESS_BONUS = "darknessBonus"

WARRIOR_BONUS = "warriorBonus"
NINJA_BONUS = "ninjaBonus"
SURA_BONUS = "suraBonus"
SHAMAN_BONUS = "shamanBonus"
LYCAN_BONUS = "lycanBonus"
WARRIOR_RESISTANCE = "warriorResistance"
NINJA_RESISTANCE = "ninjaResistance"
SURA_RESISTANCE = "suraResistance"
SHAMAN_RESISTANCE = "shamanResistance"
LYCAN_RESISTANCE = "lycanResistance"

SWORD_DEFENSE = "swordDefense"
TWO_HANDED_SWORD_DEFENSE = "twoHandedSwordDefense"
DAGGER_DEFENSE = "daggerDefense"
CLAW_DEFENSE = "clawDefense"
BELL_DEFENSE = "bellDefense"
FAN_DEFENSE = "fanDefense"
ARROW_DEFENSE = "arrowDefense"
BREAK_SWORD_DEFENSE = "breakSwordDefense"
BREAK_TWO_HANDED_SWORD_DEFENSE = "breakTwoHandedSwordDefense"
BREAK_DAGGER_DEFENSE = "breakDaggerDefense"
BREAK_BELL_DEFENSE = "breakBellDefense"
BREAK_FAN_DEFENSE = "breakFanDefense"
BREAK_ARROW_DEFENSE = "breakArrowDefense"
BREAK_CLAW_DEFENSE = "breakClawDefense"

MELEE_BLOCK = "meleeBlock"
ARROW_BLOCK = "arrowBlock"
PRECISION = "precision"

LEADERSHIP = "leadership"
BOSS_DAMAGE = "bossDamage"
SKILL_BOSS_DAMAGE = "skillBossDamage"
DAMAGE_BONUS = "damageBonus"
MELEE_ARROW_BLOCK = "meleeArrowBlock"
BIOLOGIST_70 = "biologist70"
EMPIRE_MALUS = "empireMalus"
TIGER_STRENGTH = "tigerStrength"
WHITE_DRAGON_ELIXIR = "whiteDragonElixir"
STEEL_DRAGON_ELIXIR = "steelDragonElixir"
LOW_RANK = "lowRank"
PLAYER_RANK = "playerRank"

UNCHECKED = ""
CHECKED = "on"

NEUTRAL = "neutral"
AGGRESSIVE = "aggressive"
FRAUDULENT = "fraudulent"
MALICIOUS = "malicious"
CRUEL = "cruel"

SKILL_BLESSING = "skillBlessing"
INT_BLESSING = "intBlessing"
DEX_BLESSING = "dexBlessing"
BLESSING_ONSELF = "blessingOnself"

NO_WARD = 0
BODY_WARD = "body"
MENTAL_WARD = "mental"
BLADE_FIGHT_WARD = "blade_fight"
ARCHERY_WARD = "archery"
WEAPONARY_WARD = "weaponary"
BLACK_MAGIC_WARD = "black_magic"
DRAGON_WARD = "dragon"
HEAL_WARD = "heal"
LYCAN_WARD = "lycan"


ALLOWED_VALUES = {
    RACE: [WARRIOR, NINJA, SURA, SHAMAN, LYCAN],
    LEVEL: range(1, 121),
    STATE: [NORMAL, HORSE, POLYMORPH],
    POLYMORPH_MONSTER: [
        POLYMORPH_MONSTER_101,
        POLYMORPH_MONSTER_502,
        POLYMORPH_MONSTER_2001,
        POLYMORPH_MONSTER_2051,
    ],
    VIT: range(1, 301),
    INT: range(1, 301),
    STR: range(1, 301),
    DEX: range(1, 301),
    DEFENSE: range(0, 5001),
    MAGIC_DEFENSE: range(0, 3001),
    ATTACK_SPEED: range(0, 301),
    SUNGMA_STR: range(0, 501),
    SUNGMA_STR_MALUS: range(0, 101),
    MIN_ATTACK_VALUE_RANDOM: range(0, 2001),
    MAX_ATTACK_VALUE_RANDOM: range(0, 2001),
    MIN_MAGIC_ATTACK_VALUE_RANDOM: range(0, 2001),
    MAX_MAGIC_ATTACK_VALUE_RANDOM: range(0, 2001),
    MIN_ATTACK_VALUE_SLASH: range(0, 501),
    MAX_ATTACK_VALUE_SLASH: range(0, 501),
    MIN_MAGIC_ATTACK_VALUE_SLASH: range(0, 201),
    MAX_MAGIC_ATTACK_VALUE_SLASH: range(0, 201),
    STONE_BONUS: range(0, 201),
    HUMAN_BONUS: range(0, 201),
    HUMAN_RESISTANCE: range(0, 101),
    ORC_BONUS: range(0, 501),
    UNDEAD_BONUS: range(0, 501),
    MONSTER_BONUS: range(0, 201),
    ZODIAC_BONUS: range(0, 101),
    MONSTER_RESISTANCE: range(0, 51),
    ANIMAL_BONUS: range(0, 501),
    MYSTIC_BONUS: range(0, 501),
    DEVIL_BONUS: range(0, 501),
    DESERT_BONUS: range(0, 501),
    INSECT_BONUS: range(0, 501),
    ATTACK_VALUE_PERCENT: range(0, 401),
    ATTACK_VALUE: range(0, 10001),
    DEFENSE_PERCENT: range(0, 101),
    DEFENSE_USELESS: range(0, 101),
    AVERAGE_DAMAGE: range(-55, 201),
    AVERAGE_DAMAGE_RESISTANCE: range(0, 201),
    SKILL_DAMAGE: range(-27, 201),
    SKILL_DAMAGE_RESISTANCE: range(0, 201),
    ATTACK_MELEE_MAGIC: range(0, 201),
    ATTACK_MAGIC: range(0, 201),
    MAGIC_ATTACK_VALUE: range(0, 201),
    CRITICAL_HIT: range(0, 201),
    PIERCING_HIT: range(0, 201),
    CRITICAL_HIT_RESISTANCE: range(0, 51),
    PIERCING_HIT_RESISTANCE: range(0, 51),
    MAGIC_RESISTANCE: range(0, 201),
    ANTI_MAGIC: range(0, 201),
    LIGHTNING_RESISTANCE: range(0, 401),
    FIRE_RESISTANCE: range(0, 401),
    ICE_RESISTANCE: range(0, 401),
    WIND_RESISTANCE: range(0, 401),
    EARTH_RESISTANCE: range(0, 401),
    DARKNESS_RESISTANCE: range(0, 401),
    LIGHTNING_BONUS: range(0, 401),
    FIRE_BONUS: range(0, 401),
    ICE_BONUS: range(0, 401),
    WIND_BONUS: range(0, 401),
    EARTH_BONUS: range(0, 401),
    DARKNESS_BONUS: range(0, 401),
    WARRIOR_BONUS: range(0, 201),
    NINJA_BONUS: range(0, 201),
    SURA_BONUS: range(0, 201),
    SHAMAN_BONUS: range(0, 201),
    LYCAN_BONUS: range(0, 201),
    WARRIOR_RESISTANCE: range(0, 201),
    NINJA_RESISTANCE: range(0, 201),
    SURA_RESISTANCE: range(0, 201),
    SHAMAN_RESISTANCE: range(0, 201),
    LYCAN_RESISTANCE: range(0, 201),
    SWORD_DEFENSE: range(0, 201),
    TWO_HANDED_SWORD_DEFENSE: range(0, 201),
    DAGGER_DEFENSE: range(0, 201),
    CLAW_DEFENSE: range(0, 201),
    BELL_DEFENSE: range(0, 201),
    FAN_DEFENSE: range(0, 201),
    ARROW_DEFENSE: range(0, 201),
    BREAK_SWORD_DEFENSE: range(0, 11),
    BREAK_TWO_HANDED_SWORD_DEFENSE: range(0, 11),
    BREAK_DAGGER_DEFENSE: range(0, 11),
    BREAK_BELL_DEFENSE: range(0, 11),
    BREAK_FAN_DEFENSE: range(0, 11),
    BREAK_ARROW_DEFENSE: range(0, 11),
    BREAK_CLAW_DEFENSE: range(0, 11),
    MELEE_BLOCK: range(0, 201),
    ARROW_BLOCK: range(0, 201),
    PRECISION: range(0, 201),
    LEADERSHIP: range(0, 101),
    BOSS_DAMAGE: range(0, 21),
    SKILL_BOSS_DAMAGE: range(0, 21),
    DAMAGE_BONUS: range(0, 11),
    MELEE_ARROW_BLOCK: range(0, 11),
    BIOLOGIST_70: [UNCHECKED, CHECKED],
    EMPIRE_MALUS: [UNCHECKED, CHECKED],
    TIGER_STRENGTH: [UNCHECKED, CHECKED],
    WHITE_DRAGON_ELIXIR: [UNCHECKED, CHECKED],
    STEEL_DRAGON_ELIXIR: [UNCHECKED, CHECKED],
    LOW_RANK: [UNCHECKED, CHECKED],
    PLAYER_RANK: [NEUTRAL, AGGRESSIVE, FRAUDULENT, MALICIOUS, CRUEL],
    ATTACK_SKILL_1: range(0, 41),
    ATTACK_SKILL_2: range(0, 41),
    ATTACK_SKILL_3: range(0, 41),
    ATTACK_SKILL_4: range(0, 41),
    ATTACK_SKILL_5: range(0, 41),
    ATTACK_SKILL_6: range(0, 41),
    ATTACK_SKILL_9: range(0, 41),
    SKILL_BLESSING: [UNCHECKED, CHECKED],
    INT_BLESSING: range(1, 301),
    DEX_BLESSING: range(1, 301),
    BLESSING_ONSELF: [UNCHECKED, CHECKED],
    SKILL_WARD_CHOICE: [
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
    SKILL_WARD: range(0, 41),
    SKILL_BONUS: range(0, 41),
    POLYMORPH_POINT: range(0, 41),
    HORSE_POINT: range(0, 41),
    HORSE_SKILL_137: range(0, 21),
    HORSE_SKILL_138: range(0, 21),
    HORSE_SKILL_139: range(0, 21),
    HORSE_SKILL_140: range(0, 21),
    SKILL_BONUS_1: range(0, 6),
    SKILL_BONUS_2: range(0, 6),
    SKILL_BONUS_3: range(0, 6),
    SKILL_BONUS_4: range(0, 6),
    SKILL_BONUS_5: range(0, 6),
    SKILL_BONUS_6: range(0, 6),
    IS_MARRIED: [UNCHECKED, CHECKED],
    LOVE_POINT: range(50, 101),
    HARMONY_BRACELET: [UNCHECKED, CHECKED],
    LOVE_NECKLACE: [UNCHECKED, CHECKED],
    HARMONY_NECKLACE: [UNCHECKED, CHECKED],
    LOVE_EARRINGS: [UNCHECKED, CHECKED],
    HARMONY_EARRINGS: [UNCHECKED, CHECKED],
}

CLASS_VALUES = {
        WARRIOR: [BODY, MENTAL],
        SURA: [BLACK_MAGIC, WEAPONARY],
        NINJA: [BLADE_FIGHT, ARCHERY],
        SHAMAN: [DRAGON, HEAL],
        LYCAN: [LYCAN_CLASS],
    }
ALLOWED_VALUES_WITH_CONDITION = {

    WEAPON: [],
    WEAPON_UPGRADE: [],
}

WEAPON_DATA = {
    0: [8, 0],
    10: [0, 10],
    20: [0, 10],
    30: [0, 10],
    40: [0, 10],
    50: [0, 10],
    60: [0, 10],
    70: [0, 10],
    80: [0, 10],
    90: [0, 10],
    100: [0, 10],
    110: [0, 10],
    120: [0, 10],
    130: [0, 10],
    140: [0, 10],
    150: [7, 10],
    160: [0, 10],
    170: [0, 10],
    180: [0, 10],
    190: [7, 10],
    200: [7, 10],
    240: [7, 10],
    250: [7, 10],
    270: [0, 10],
    280: [7, 10],
    290: [0, 10],
    300: [7, 10],
    310: [0, 10],
    320: [0, 16],
    340: [7, 16],
    360: [0, 16],
    380: [7, 16],
    460: [0, 10],
    470: [7, 10],
    500: [7, 10],
    1000: [1, 10],
    1010: [1, 10],
    1020: [1, 10],
    1030: [1, 10],
    1040: [1, 10],
    1050: [1, 10],
    1060: [1, 10],
    1070: [1, 10],
    1080: [1, 10],
    1090: [1, 10],
    1100: [1, 10],
    1110: [1, 10],
    1120: [1, 10],
    1130: [1, 10],
    1170: [1, 10],
    1180: [1, 10],
    1190: [1, 16],
    1210: [1, 16],
    1340: [1, 10],
    1500: [1, 10],
    2000: [2, 10],
    2010: [2, 10],
    2020: [2, 10],
    2030: [2, 10],
    2040: [2, 10],
    2050: [2, 10],
    2060: [2, 10],
    2070: [2, 10],
    2080: [2, 10],
    2090: [2, 10],
    2100: [2, 10],
    2110: [2, 10],
    2120: [2, 10],
    2130: [2, 10],
    2140: [2, 10],
    2150: [2, 10],
    2160: [2, 10],
    2170: [2, 10],
    2180: [2, 10],
    2200: [2, 10],
    2210: [2, 16],
    2230: [2, 16],
    2370: [2, 10],
    2500: [2, 10],
    3000: [3, 10],
    3010: [3, 10],
    3020: [3, 10],
    3030: [3, 10],
    3040: [3, 10],
    3050: [3, 10],
    3060: [3, 10],
    3070: [3, 10],
    3080: [3, 10],
    3090: [3, 10],
    3100: [3, 10],
    3110: [3, 10],
    3120: [3, 10],
    3130: [3, 10],
    3140: [3, 10],
    3150: [3, 10],
    3160: [3, 10],
    3190: [3, 10],
    3210: [3, 10],
    3220: [3, 10],
    3230: [3, 16],
    3250: [3, 16],
    3500: [3, 10],
    4000: [1, 10],
    4010: [1, 10],
    4020: [1, 10],
    4040: [1, 10],
    5000: [4, 10],
    5010: [4, 10],
    5020: [4, 10],
    5030: [4, 10],
    5040: [4, 10],
    5050: [4, 10],
    5060: [4, 10],
    5070: [4, 10],
    5080: [4, 10],
    5090: [4, 10],
    5100: [4, 10],
    5110: [4, 10],
    5120: [4, 10],
    5160: [4, 10],
    5170: [4, 16],
    5200: [4, 16],
    5330: [4, 10],
    5340: [4, 10],
    5500: [4, 10],
    6000: [5, 10],
    6010: [5, 10],
    6020: [5, 10],
    6030: [5, 10],
    6040: [5, 10],
    6050: [5, 10],
    6060: [5, 10],
    6070: [5, 10],
    6080: [5, 10],
    6090: [5, 10],
    6120: [5, 10],
    6130: [5, 16],
    6150: [5, 16],
    6500: [5, 10],
    7000: [6, 10],
    7010: [6, 10],
    7020: [6, 10],
    7030: [6, 10],
    7040: [6, 10],
    7050: [6, 10],
    7060: [6, 10],
    7070: [6, 10],
    7080: [6, 10],
    7090: [6, 10],
    7100: [6, 10],
    7110: [6, 10],
    7120: [6, 10],
    7130: [6, 10],
    7140: [6, 10],
    7150: [6, 10],
    7160: [6, 10],
    7190: [6, 10],
    7300: [6, 10],
    7310: [6, 16],
    7330: [6, 16],
    7370: [6, 10],
    7500: [6, 10],
    21900: [0, 1],
    21901: [1, 1],
    21902: [2, 1],
    21903: [3, 1],
    21904: [4, 1],
    21905: [6, 1],
    21906: [5, 1],
    21910: [0, 1],
    21911: [1, 1],
    21912: [2, 1],
    21913: [3, 1],
    21914: [4, 1],
    21915: [6, 1],
    21916: [5, 1],
    21920: [0, 1],
    21921: [1, 1],
    21922: [2, 1],
    21923: [3, 1],
    21924: [4, 1],
    21925: [6, 1],
    21926: [5, 1],
    21930: [0, 1],
    21931: [1, 1],
    21932: [2, 1],
    21933: [3, 1],
    21934: [4, 1],
    21935: [6, 1],
    21936: [5, 1],
    21940: [0, 1],
    21941: [1, 1],
    21942: [2, 1],
    21943: [3, 1],
    21944: [4, 1],
    21945: [6, 1],
    21946: [5, 1],
    21950: [0, 1],
    21951: [1, 1],
    21952: [2, 1],
    21953: [3, 1],
    21954: [4, 1],
    21955: [6, 1],
    21956: [5, 1],
    21960: [0, 1],
    21961: [1, 1],
    21962: [2, 1],
    21963: [3, 1],
    21964: [4, 1],
    21965: [6, 1],
    21966: [5, 1],
    21970: [0, 1],
    21971: [1, 1],
    21972: [2, 1],
    21973: [3, 1],
    21974: [4, 1],
    21975: [6, 1],
    21976: [5, 1],
}

ALLOWED_WEAPONS = {
    WARRIOR: [0, 3, 8],
    NINJA: [0, 1, 2, 8],
    SURA: [0, 7, 8],
    SHAMAN: [4, 6, 8],
    LYCAN: [5, 8],
}

MONSTERS = [101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 131, 132, 133, 134, 135, 136, 138, 139, 140, 141, 142, 143, 144, 151, 152, 153, 154, 155, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 191, 192, 193, 194, 301, 302, 303, 304, 331, 332, 333, 334, 351, 352, 354, 391, 392, 393, 394, 395, 396, 397, 398, 401, 402, 403, 404, 405, 406, 431, 432, 433, 434, 435, 436, 451, 453, 454, 455, 456, 491, 492, 493, 494, 501, 502, 503, 504, 531, 532, 533, 534, 551, 552, 553, 554, 591, 601, 602, 603, 604, 631, 632, 633, 634, 635, 636, 637, 651, 652, 653, 654, 655, 656, 657, 691, 701, 702, 703, 704, 705, 706, 707, 731, 732, 733, 734, 735, 736, 737, 751, 752, 753, 754, 755, 756, 757, 771, 772, 773, 774, 775, 776, 777, 791, 901, 902, 903, 904, 905, 906, 907, 931, 932, 933, 934, 935, 936, 937, 1001, 1002, 1003, 1004, 1031, 1032, 1033, 1034, 1035, 1036, 1037, 1038, 1039, 1040, 1041, 1061, 1062, 1063, 1064, 1065, 1066, 1067, 1068, 1069, 1070, 1071, 1091, 1092, 1093, 1101, 1102, 1103, 1104, 1105, 1106, 1107, 1108, 1131, 1132, 1133, 1134, 1135, 1136, 1137, 1138, 1171, 1191, 1192, 1301, 1302, 1303, 1304, 1305, 1332, 1336, 1401, 1402, 1403, 1501, 1502, 1503, 1601, 1602, 1603, 1901, 2001, 2002, 2003, 2004, 2005, 2031, 2032, 2033, 2034, 2035, 2036, 2051, 2052, 2053, 2054, 2061, 2062, 2063, 2064, 2065, 2071, 2072, 2073, 2074, 2075, 2076, 2091, 2092, 2094, 2095, 2101, 2102, 2103, 2104, 2105, 2106, 2107, 2108, 2131, 2132, 2133, 2134, 2135, 2152, 2153, 2158, 2191, 2201, 2202, 2203, 2204, 2205, 2206, 2232, 2301, 2302, 2303, 2304, 2305, 2306, 2311, 2312, 2313, 2314, 2315, 2401, 2402, 2403, 2404, 2411, 2412, 2413, 2414, 2415, 2491, 2492, 2493, 2494, 2495, 2501, 2502, 2591, 2595, 2596, 2597, 2598, 3001, 3002, 3003, 3004, 3005, 3090, 3091, 3101, 3102, 3103, 3104, 3105, 3190, 3191, 3201, 3202, 3203, 3204, 3205, 3290, 3291, 3301, 3302, 3303, 3304, 3305, 3390, 3391, 3401, 3402, 3403, 3404, 3405, 3490, 3491, 3501, 3502, 3503, 3504, 3505, 3551, 3552, 3553, 3554, 3555, 3590, 3591, 3595, 3596, 3601, 3602, 3603, 3604, 3605, 3690, 3691, 3701, 3702, 3703, 3704, 3705, 3790, 3791, 3801, 3802, 3803, 3804, 3805, 3890, 3891, 3904, 3905, 3906, 3907, 3908, 3909, 3910, 3911, 3912, 3913, 3950, 3951, 3952, 3953, 3954, 3955, 3956, 3957, 3960, 3961, 3962, 3965, 3980, 3981, 3982, 3983, 3984, 3985, 3986, 3987, 3988, 3989, 3990, 3991, 3992, 3993, 3994, 3995, 3996, 3997, 4006, 4200, 4201, 4202, 4203, 4204, 4205, 4206, 4207, 4208, 4209, 4210, 4220, 4221, 4222, 4223, 4224, 4225, 4226, 4227, 4228, 4229, 4240, 4241, 4242, 4243, 4244, 4245, 4246, 4247, 4248, 4249, 4260, 4261, 4262, 4263, 4264, 4265, 4266, 4267, 4268, 4269, 4270, 4271, 4272, 4280, 4281, 4282, 4283, 4284, 4285, 4286, 4287, 4288, 4289, 4290, 4300, 4301, 4302, 4303, 4304, 4305, 4306, 4307, 4308, 4309, 4320, 4321, 4322, 4323, 4324, 4325, 4326, 4327, 4328, 4329, 4340, 4341, 4342, 4343, 4344, 4345, 4346, 4347, 4348, 4349, 4350, 4351, 4352, 4400, 4401, 4402, 4403, 4410, 4411, 4412, 4413, 5002, 5101, 5102, 5103, 5104, 5111, 5112, 5113, 5114, 5115, 5121, 5122, 5123, 5124, 5125, 5126, 5142, 5151, 5152, 5153, 5154, 5155, 5156, 5161, 5162, 5163, 6001, 6002, 6003, 6004, 6005, 6006, 6007, 6008, 6009, 6051, 6091, 6101, 6102, 6103, 6104, 6105, 6106, 6107, 6108, 6109, 6110, 6111, 6112, 6113, 6114, 6115, 6116, 6117, 6151, 6191, 6192, 6201, 6202, 6203, 6204, 6205, 6206, 6207, 6301, 6302, 6303, 6304, 6305, 6306, 6307, 6308, 6309, 6310, 6391, 6392, 6393, 6394, 6401, 6402, 6403, 6404, 6405, 6406, 6407, 6408, 6409, 6410, 6411, 6412, 6413, 6414, 6500, 6501, 6502, 6503, 6504, 6686, 6687, 6688, 6689, 6690, 6691, 6692, 6693, 6694, 6695, 6696, 6697, 6698, 6699, 6700, 6701, 6702, 6703, 6704, 6705, 6706, 6710, 6711, 6712, 6713, 6714, 6715, 6716, 6717, 6718, 6719, 6720, 6721, 6722, 6723, 6724, 6725, 6726, 6727, 6728, 6729, 6730, 6731, 6744, 6745, 6746, 6747, 6748, 6749, 6750, 6751, 6752, 6753, 6754, 6755, 6756, 6758, 6759, 6760, 6761, 6762, 6763, 6764, 6765, 6770, 6771, 6772, 6773, 6774, 6775, 6776, 6777, 6778, 6779, 6780, 6781, 6782, 6783, 6784, 6785, 6786, 6787, 6788, 6789, 6792, 6793, 6794, 6795, 6796, 6797, 6800, 6801, 6802, 6803, 6804, 6805, 6806, 6807, 6808, 6809, 6810, 6811, 6812, 6813, 6814, 6815, 6816, 6817, 6818, 6819, 6820, 6851, 6852, 6854, 6860, 6861, 6862, 6863, 6864, 6865, 6866, 6867, 6868, 6869, 6870, 6871, 6875, 6876, 6878, 6879, 6880, 6881, 6882, 6883, 6884, 6885, 6886, 6887, 6888, 6889, 6890, 6891, 6892, 6893, 6894, 6895, 7010, 7019, 7020, 7021, 7022, 7023, 7028, 7125, 7126, 7127, 7128, 7129, 7130, 7131, 7132, 7133, 7134, 7135, 7136, 7137, 7138, 7139, 7140, 7141, 7142, 7143, 7144, 7145, 7146, 7147, 7148, 7149, 7152, 7153, 7154, 7155, 7156, 7157, 7158, 7159, 7160, 7161, 7162, 7163, 7164, 7165, 7166, 7167, 7168, 7169, 7170, 7171, 7172, 7173, 7174, 7175, 7176, 7177, 7178, 7179, 7180, 7181, 7182, 7183, 7184, 7185, 7186, 7187, 7188, 7189, 7190, 7191, 7192, 7193, 7194, 7195, 7196, 7197, 7198, 7199, 7200, 7201, 7202, 7203, 7204, 7205, 7206, 7207, 7210, 7211, 7212, 7213, 7214, 7215, 7216, 8501, 8502, 8503, 8504, 8505, 8506, 8507, 8508, 8509, 8510, 8511]
STONES = [4000, 4001, 4002, 4003, 4004, 4005, 6118, 6209, 8001, 8002, 8003, 8004, 8005, 8006, 8007, 8008, 8009, 8010, 8011, 8012, 8013, 8014, 8015, 8016, 8017, 8018, 8024, 8025, 8026, 8027, 8041, 8042, 8043, 8044, 8045, 8046, 8047, 8048, 8049, 8050, 8051, 8052, 8053, 8054, 8055, 8056, 8057, 8058, 8059, 8061, 8062, 8063, 8064, 8065, 8066, 8067, 8076, 8077, 8124, 8125, 8126, 8127, 8134, 8135, 8136, 8137, 8204, 8205, 8206, 8625, 8626, 8627, 8630, 8631, 8632, 8633, 8634, 8637, 8641, 8642, 8643, 8644, 8645, 8646, 20399, 20422, 20518, 20538]
ALL_MONSTERS = MONSTERS + STONES

ALLOWED_SKILLS = {
    BODY: [1, 2, 5, 6],
    MENTAL: [1, 2, 5, 6],
    BLADE_FIGHT: [3, 5, 6],
    ARCHERY: [2, 4],
    WEAPONARY: [1, 2],
    BLACK_MAGIC: [6],
    DRAGON: [1, 2, 3],
    HEAL: [],
    LYCAN_CLASS: [2, 3, 4]
}
ALLOWED_HORSE_SKILLS = {
    BODY: [137, 138, 139],
    MENTAL: [137, 138, 139],
    BLADE_FIGHT: [137, 138, 139, 140],
    ARCHERY: [137, 138, 139, 140],
    WEAPONARY: [137, 138, 139],
    BLACK_MAGIC: [137, 138, 139],
    DRAGON: [137, 138, 139],
    HEAL: [137, 138, 139],
    LYCAN_CLASS: [137, 138, 139],
}
SKILL_MAPPING = {
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
    140: HORSE_SKILL_140
}

def create_char(n=0):
    character = {NAME: f"random_char_{n}"}

    for key, value in ALLOWED_VALUES.items():
        if isinstance(value, range) and value.start in [0, 1]:
            weights = [len(value) - index for index in value]
            chosen_value = rd.choices(value, weights=weights, k=1)[0]

        else:
            chosen_value = rd.choice(value)

        character[key] = chosen_value

    character_race = character[RACE]
    weapons = {vnum: data[1] for vnum, data in WEAPON_DATA.items() if data[0] in ALLOWED_WEAPONS[character_race]}
    weapon_vnum = rd.choice(list(weapons.keys()))
    max_upgrade = weapons[weapon_vnum]

    character[CLASS] = rd.choice(CLASS_VALUES[character_race])
    character[WEAPON] = weapon_vnum
    if max_upgrade:
        character[WEAPON_UPGRADE] = rd.choice(range(0, weapons[weapon_vnum]))
    else:
        character[WEAPON_UPGRADE] = 0

    json_str = f"{character[NAME]}: " + json.dumps(character).replace(" ", "") + ","

    with open("output.txt", "a") as file:
        file.write(json_str)
        file.write("\n")

    return character

def create_fights(number_of_fights=1000):
    char_index = 0
    fights = []

    for _ in range(number_of_fights):
        if rd.randint(0, 1):
            attacker = create_char(char_index)
            attacker_name = attacker[NAME]
            char_index += 1

            if attacker[STATE] == POLYMORPH:
                attack_type = "physical"
            else:
                attacker_class = attacker[CLASS]

                skills_to_use = ALLOWED_SKILLS[attacker_class]
                print(skills_to_use)

                if attacker[STATE] == HORSE:
                    skills_to_use += ALLOWED_HORSE_SKILLS[attacker_class]

                skills_to_use = [SKILL_MAPPING[skill] for skill in skills_to_use if attacker[SKILL_MAPPING[skill]]]

                attack_type = rd.choice(["physical"] + skills_to_use)

        else:
            attacker_name = rd.choice(MONSTERS)
            attack_type = "physical"

        if rd.randint(0, 1):
            victim_name = create_char(char_index)[NAME]
            char_index += 1

        else:
            victim_name = rd.choice(ALL_MONSTERS)

        fights.append([attacker_name, victim_name, attack_type])

    return fights


if __name__ == "__main__":
    create_fights()