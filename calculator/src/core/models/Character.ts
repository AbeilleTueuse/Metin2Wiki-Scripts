import { CharType } from "../types/char";
import { GlobalServicesMixin } from "../mixins/GlobalServicesMixin";

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
