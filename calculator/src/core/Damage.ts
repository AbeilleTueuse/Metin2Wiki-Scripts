import Attack from "./Attack";

export default class Damage {
    attack: Attack;

    constructor(attack: Attack) {
        this.attack = attack;
    }

    calculate(): number {
        return this.attack.calculateDamage();
    }
}
