import { RaceEnum } from "../enums/race";
import { GlobalServicesMixin } from "../mixins/GlobalServicesMixin";
import { IBattleChoice } from "../types/index";
import { ISavedFight } from "../types/savedFight";

export class Battle extends GlobalServicesMixin(class {}) {
    public simulationTime: HTMLElement = document.getElementById("simulation-time") as HTMLElement;

    public battleChoice: IBattleChoice = {
        resetAttackType: false,
        form: "#create-battle",
        template: "#battle-selection-template",
        raceToImage: {
            [RaceEnum.Warrior]: "/images/0/0f/Bandeaurougehomme.png",
            [RaceEnum.Ninja]: "/images/0/0e/Queuedechevalclair.png",
            [RaceEnum.Sura]: "/images/3/37/Couperespectablerouge.png",
            [RaceEnum.Chaman]: "/images/6/6a/Coupeeleganteclairfemme.png",
            [RaceEnum.Lycan]: "/images/4/4e/Protectionfrontalerouge.png",
        },
        categories: ["attacker", "victim"],
        attacker: {
            character: {
                count: 0,
                container: "#attacker-selection-characters",
                elements: {},
            },
            monster: {
                count: 0,
                container: "#attacker-selection-monsters",
                elements: {},
            },
            button: "#attacker-trigger",
            defaultButtonContent: "#attacker-default-button-content",
            buttonContent: "#attacker-button-content",
            container: "#attacker-selection",
            selected: null,
        },
        victim: {
            character: {
                count: 0,
                container: "#victim-selection-characters",
                elements: {},
            },
            monster: {
                count: 0,
                container: "#victim-selection-monsters",
                elements: {},
            },
            stone: {
                count: 0,
                container: "#victim-selection-stones",
                elements: {},
            },
            button: "#victim-trigger",
            defaultButtonContent: "#victim-default-button-content",
            buttonContent: "#victim-button-content",
            selected: null,
        },
        attackType: {
            container: "#attack-type-selection",
            elements: [],
            defaultInput: "#physical-attack",
            selectedText: "",
        },
    }

    public savedFight: Array<ISavedFight> = this.storage.get("savedFightsCalculator");

    constructor() {
        super();
        this.initListener()

        this.storage.on<ISavedFight[]>("savedFightsCalculator", (fights) => {
            this.savedFight = fights;
        })
    }

    private initListener() {
        /* TEST CMD STORAGE SYSTEM
        this.ui.addEventListenerToElement(this.battleChoice.form, "click", () => {
            this.saveNewFight({
                uId: crypto.randomUUID(),
                attackerName: "attacker",
                victimName: "victim",
                atackType: "type",
                meanDamage: 10,
                minDamage: 5,
                maxDamage: 15,
             })
        })
        */
       
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

    public saveNewFight(fight: ISavedFight): void {
        this.storage.set("savedFightsCalculator", (oldData: ISavedFight[] = []) => [ ...oldData, fight], true);
    }
    public removeFightByUID(uId: string): void {
        this.storage.set("savedFightsCalculator", (oldData: ISavedFight[] = []) => {
            return oldData.filter(fight => fight.uId !== uId);
        }, true);
    }
}