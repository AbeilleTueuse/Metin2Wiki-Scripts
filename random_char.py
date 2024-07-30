import random as rd


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
WEAPON = "weapon",
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
LOVE_POINT = "lovePoint"
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


ALLOWED_VALUES = {
    RACE: [WARRIOR, NINJA, SURA, SHAMAN, LYCAN],
    LEVEL: range(1, 121),
    STATE: [NORMAL, HORSE, POLYMORPH],
    POLYMORPH_MONSTER: [POLYMORPH_MONSTER_101, POLYMORPH_MONSTER_502, POLYMORPH_MONSTER_2001, POLYMORPH_MONSTER_2051],
    VIT: range(1, 301),
    INT: range(1, 301),
    STR: range(1, 301),
    DEX: range(1, 301),
    DEFENSE: range(0, 5001),
    MAGIC_DEFENSE: range(0, 3001),
    ATTACK_SPEED: range(0, 301),
    SUNGMA_STR: range(0, 501),
    SUNGMA_STR_MALUS: range(0, 101),
    WEAPON_UPGRADE: [0],  # La liste des valeurs autorisées pour les améliorations d'arme n'est pas fournie
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
}

ALLOWED_VALUES_WITH_CONDITION = {
    CLASS: {
        "condition": RACE,
        "values": {
            WARRIOR: [BODY, MENTAL],
            SURA: [BLACK_MAGIC, WEAPONARY],
            NINJA: [BLADE_FIGHT, ARCHERY],
            SHAMAN: [DRAGON, HEAL],
            LYCAN: [LYCAN_CLASS]
        }
    }
}


def create_char():
    character = ""

    for key, value in ALLOWED_VALUES.items():
        if isinstance(value, range) and value.start >= 0:
            weights = [len(value) - index for index in value]
            chosen_value = rd.choices(value, weights=weights, k=1)[0]

        else:
            chosen_value = rd.choice(value)

        character += f'"{key}":{chosen_value},'

    return character


if __name__ == "__main__":
    print(create_char())