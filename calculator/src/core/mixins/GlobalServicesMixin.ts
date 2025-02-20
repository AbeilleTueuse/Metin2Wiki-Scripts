import { cssSource } from "../../config/sources";
import { Ui } from "../../ui/index";
import { Storage } from "../services/Storage";
import { Translate } from "../services/Translate";

type Constructor = new (...args: any[]) => {};

export function GlobalServicesMixin<T extends Constructor>(Base: T) {
    return class extends Base {
        protected ui: Ui = Ui.getInstance(cssSource);
        protected translate: Translate = Translate.getInstance();
        protected storage: Storage = Storage.getInstance();

        constructor(...args: any[]) {
            super(...args);
            console.log(`[GlobalServicesMixin] Instance created: ${this.constructor.name}`);
        }

        protected u__(key: string): string | string[] {
            return this.translate.u__(key);
        }
    };
}