import Attack from "./Attack";

export class Character {
    private name: string;
    private attack: Attack;

    constructor(name: string, attack: Attack) {
        this.name = name;
        this.attack = attack;
    }

    public getName() : string {
        return this.name
    }

    performAttack(): number {
        console.log(`${this.name} attaque avec ${this.attack.power} de puissance!`);
        return this.attack.calculateDamage();
    }
}
