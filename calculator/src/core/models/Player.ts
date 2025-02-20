import { RaceEnum } from "../enums/race";
import { Core } from "../index";
import { IPlayer } from "../types/player";
import { Character } from "./Character";

export class Player extends Character implements IPlayer {

    public uId: string;
    public race: RaceEnum;
    public rank: string;

    constructor(private core: Core, data: IPlayer) {
        super('player', data.name)

        this.uId = data.uId;
        this.race = data.race;
        this.rank = data.rank;
    }

    public getUID(): string {
        return this.uId;
    }
}