import { CharType } from "../types/index";
import { GlobalServicesMixin } from "../mixins/GlobalServicesMixin";

export class Character extends GlobalServicesMixin(class {}) {
    public type: CharType;
    public name: string;

    constructor(type: CharType, name: string) {
        super();

        this.type = type
        this.name = name
    }

    public getName() : string {
        return this.name
    }
}
