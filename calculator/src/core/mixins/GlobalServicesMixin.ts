import { cssSource } from "../../config/sources";
import { Ui } from "../../ui/index";
import { Translate } from "../services/Translate";

type Constructor = new (...args: any[]) => {};

export function GlobalServicesMixin<T extends Constructor>(Base: T) {
    return class extends Base {
        protected ui: Ui = Ui.getInstance(cssSource);
        protected translate: Translate = Translate.getInstance();

        protected u__(key: string): string | string[] {
            return this.translate.u__(key);
        }
    };
}