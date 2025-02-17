import { CharacterType } from "../enums/charType";

export class Character {
    private type: CharacterType;
    private name: string;

    constructor(type: CharacterType, name: string) {
        this.type = type
        this.name = name;
    }

    public getName() : string {
        return this.name
    }
}
