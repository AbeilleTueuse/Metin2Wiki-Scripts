import { GlobalServicesMixin } from "../mixins/GlobalServicesMixin";
import { IBattleChoice } from "../types/index";

export class Battle extends GlobalServicesMixin(class {}) {
    public simulationTime: HTMLElement = document.getElementById("simulation-time") as HTMLElement;

    public battleChoice: IBattleChoice = {
        form: "#create-battle"
    }

    constructor() {
        super();
        this.initListener()
    }

    private initListener() {
        this.ui.addEventListenerToElement(this.battleChoice.form, "change", this.handleBattleFormChange)
        this.ui.addEventListenerToElement(this.battleChoice.form, "invalid", this.handleBattleFormInvalid)
        this.ui.addEventListenerToElement(this.battleChoice.form, "submit", this.handleBattleFormSubmit)
    }

    private handleBattleFormChange() {

    }
    private handleBattleFormInvalid() {

    }
    private handleBattleFormSubmit() {

    }
}