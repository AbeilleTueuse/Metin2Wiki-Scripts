import { CharType } from "../types/char";
import { GlobalServicesMixin } from "../mixins/GlobalServicesMixin";
import { Core } from "../index";

export class Character extends GlobalServicesMixin(class {}) {
    private type: CharType;
    private name: string;

    constructor(type: CharType, name: string) {
        super();

        this.type = type
        this.name = name;
    }

    public getName() : string {
        return this.name
    }
}
