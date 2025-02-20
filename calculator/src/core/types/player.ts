import { RaceEnum } from "../enums/race";

export interface IPlayer {
    uId: string;
    name: string;
    race: RaceEnum;
    rank: string; 
}