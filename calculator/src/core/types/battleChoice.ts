import { RaceEnum } from "../enums/index";

export interface IBattleChoice {
    resetAttackType: boolean;
    form: string;
    template: string;
    raceToImage: Record<RaceEnum, string>;
    categories: string[];

    attacker: BattleEntity;
    victim: Omit<BattleEntity, "container"> & { stone: BattleElement };
    attackType: AttackType;
}

interface BattleEntity {
    character: BattleElement;
    monster: BattleElement;
    button: string;
    defaultButtonContent: string;
    buttonContent: string;
    container: string;
    selected: unknown | null;
}
  
interface BattleElement {
    count: number;
    container: string;
    elements: Record<string, unknown>;
}
  
interface AttackType {
    container: string;
    elements: unknown[];
    defaultInput: string;
    selectedText: string;
}
  