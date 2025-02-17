import { Character } from "./Character";

export class Monster extends Character {
    constructor(name: string) {
        super('monster', name)
    }
}