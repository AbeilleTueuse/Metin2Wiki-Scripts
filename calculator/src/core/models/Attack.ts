export default class Attack {
    power: number;
    multiplier: number;

    constructor(power: number, multiplier: number) {
        this.power = power;
        this.multiplier = multiplier;
    }

    calculateDamage(): number {
        return this.power * this.multiplier;
    }
}
    