import { GlobalServicesMixin } from "../mixins/GlobalServicesMixin";
import { IBattleChoice } from "../types/index";

export class Battle extends GlobalServicesMixin(class {}) {
    public simulationTime: HTMLElement = document.getElementById("simulation-time") as HTMLElement;

    public battleChoice: IBattleChoice = {
        form: document.getElementById("create-battle") as HTMLElement
    }

    constructor() {
        super();
        this.initListener()
    }

    private initListener() {
        if (!this.battleChoice.form) {
            console.error("BattleChoice Form element not found");
            return;
        }

        this.battleChoice.form.addEventListener("change", this.handleBattleFormChange);
        this.battleChoice.form.addEventListener("invalid", this.handleBattleFormInvalid, true);
        this.battleChoice.form.addEventListener("submit", this.handleBattleFormSubmit);
    }

    private handleBattleFormChange() {

    }
    private handleBattleFormInvalid() {

    }
    private handleBattleFormSubmit() {

    }
}