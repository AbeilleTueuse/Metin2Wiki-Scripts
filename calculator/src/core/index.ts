import { GlobalServicesMixin } from "./mixins/GlobalServicesMixin";
import { Battle } from "./models/Battle";
import { Monster } from "./models/Monster";
import { Player } from "./models/Player";
import { ISavedFight } from "./types/savedFight";

export class Core extends GlobalServicesMixin(class {}) {

    public savedFight: Array<ISavedFight> = this.storage.get("savedFightsCalculator");
    public savedPlayers: Array<ISavedFight> = this.storage.get("savedPlayersCalculator");
    public savedMonsters: Array<ISavedFight> = this.storage.get("savedMonsterCalculator");

    constructor() {
        super()

        const player = new Player(this, 'J0thun')
        const monster = new Monster(this, 'Hydre')

        const battle = new Battle(this, player, monster)

        this.storage.on<ISavedFight[]>("savedFightsCalculator", (fights) => {
            this.savedFight = fights;
        })

        console.log('Core initialized');
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