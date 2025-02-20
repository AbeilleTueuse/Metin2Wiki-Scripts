import { Core } from "../index";
import { Character } from "./Character";

export class Player extends Character {
    constructor(private core: Core, name: string) {
        super('player', name)
    }
}