import { battleChoice } from "../types/index";

export class Battle {
    public simulationTime: HTMLElement = document.getElementById("simulation-time") as HTMLElement;

    public battleChoice: battleChoice = {
        form: document.getElementById("create-battle") as HTMLElement
    }

    constructor() {
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