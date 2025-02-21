import { RaceEnum } from "./enums/race";
import { GlobalServicesMixin } from "./mixins/GlobalServicesMixin";
import { Battle } from "./models/Battle";
import { Monster } from "./models/Monster";
import { Player } from "./models/Player";
import { IFight, IPlayer } from "./types/index";

export class Core extends GlobalServicesMixin(class {}) {
    
    public savedFight: IFight[] = this.storage.get<IFight[]>("savedFightsCalculator");
    public savedPlayers: IPlayer[] = this.storage.get<IPlayer[]>("savedPlayersCalculator");
    public savedMonsters: T[] = this.storage.get<T[]>("savedMonsterCalculator");

    public activePlayers: Player[] = [];
    public activeMonsters: Monster[] = [];

    constructor() {
        super()

        /*
        const player = new Player(this, 'J0thun')
        const monster = new Monster(this, 'Hydre')
        const battle = new Battle(this, player, monster)
        */



        this.ui.addEventListenerToElement("#create-battle", "click", () => {
            this.createNewPlayer();
        })
        this.ui.addEventListenerToElement(".test", "click", () => {
            this.loadPlayerByUID("60c5de60-8f6a-403f-8857-7cb1dc3c25fc");
        })
        this.ui.addEventListenerToElement(".player_load", "click", () => {
            console.log(this.activePlayers)
        })



        this.storage.on<IFight[]>("savedFightsCalculator", (fights) => {
            this.savedFight = fights;
        })
        this.storage.on<IPlayer[]>("savedPlayersCalculator", (player) => {
            this.savedPlayers = player;
        })

        console.log('Core initialized');
    }

    public createNewPlayer(): void {
        const data: IPlayer = {
            uId: crypto.randomUUID(),
            name: "J0thun",
            race: RaceEnum.Warrior,
            rank: "neutral"
        }

        const player = new Player(this, data);
        if (player) {
            this.saveNewPlayer(data, () => {
                this.activePlayers.push(player);
                console.log(`Player with uId: ${player.getUID()} has been loaded !`, player)
            })
        }
    }

    public loadPlayerByUID(uId: string): void {
        const playerExists = this.activePlayers.find(player => player.getUID() === uId);
        if (playerExists) {
            console.warn(`Player with uId: ${uId} already loaded.`);
            return;
        }

        const data = this.savedPlayers.find(player => player.uId === uId);
        if (data) {
            const player = new Player(this, data);
            this.activePlayers.push(player);
            console.log(`Player with uId: ${data.uId} has been loaded !`, player)
            return;
        }
        
        console.warn(`Player with uId: ${uId} not exsist.`);
        return;
    }


    public saveNewPlayer(player: IPlayer, cb: CallableFunction | null = null): void {
        this.storage.set("savedPlayersCalculator", (oldData: IPlayer[] = []) => [ ...oldData, player], true);
        
        if (cb)
            cb();
    }
    public removePlayerByUID(uId: string): void {
        this.storage.set("savedPlayersCalculator", (oldData: IPlayer[] = []) => {
            return oldData.filter(player => player.uId !== uId);
        }, true);
    }

    public saveNewFight(fight: IFight, cb: CallableFunction | null = null): void {
        this.storage.set("savedFightsCalculator", (oldData: IFight[] = []) => [ ...oldData, fight], true);
        if (cb)
            cb();
    }
    public removeFightByUID(uId: string): void {
        this.storage.set("savedFightsCalculator", (oldData: IFight[] = []) => {
            return oldData.filter(fight => fight.uId !== uId);
        }, true);
    }
}