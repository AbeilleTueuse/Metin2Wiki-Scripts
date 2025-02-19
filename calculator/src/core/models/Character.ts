import { CharacterEnum } from "../enums/char";
import { GlobalServicesMixin } from "../mixins/GlobalServicesMixin";

export class Character extends GlobalServicesMixin(class {}) {
    private type: CharacterEnum;
    private name: string;

    constructor(type: CharacterEnum, name: string) {
        super();

        this.type = type
        this.name = name;
    }

    public getName() : string {
        return this.name
    }
}
