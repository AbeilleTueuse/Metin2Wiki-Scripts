export default class Enemy {
    name: string;
    health: number;
  
    constructor(name: string, health: number) {
        this.name = name;
        this.health = health;
    }
  
    takeDamage(damage: number): void {
        this.health -= damage;
        console.log(`${this.name} subit ${damage} de dégâts. Vie restante: ${this.health}`);
    }
}