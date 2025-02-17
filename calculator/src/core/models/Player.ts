import { Character } from "./Character";

export class Player extends Character {
    constructor(name: string) {
        super('player', name)
    }
}