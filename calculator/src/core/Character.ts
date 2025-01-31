import Attack from "./Attack";

export default class Character {
    name: string;
    attack: Attack;

    constructor(name: string, attack: Attack) {
        this.name = name;
        this.attack = attack;
    }

    performAttack(): number {
        console.log(`${this.name} attaque avec ${this.attack.power} de puissance!`);
        return this.attack.calculateDamage();
    }
}
