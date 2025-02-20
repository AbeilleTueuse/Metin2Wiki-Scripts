import { Core } from "../index";
import { Character } from "./Character";

export class Monster extends Character {
    constructor(private core: Core, name: string) {
        super('monster', name)
    }
}