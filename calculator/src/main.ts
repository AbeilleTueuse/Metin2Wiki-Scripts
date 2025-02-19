import { Ui } from "./ui/index";
import { javascriptSource, chartSource } from "./config/sources";
import { Player } from "./core/models/Player";
import { Monster } from "./core/models/Monster";
import { Battle } from "./core/models/Battle";
import { Translate } from "./core/services/Translate";

//import { RaceType, WeaponType } from './core/enums/index'

interface callbackAddScript { (...args: any): void }
const addScript = async (src: string, cb: callbackAddScript) => {
    console.log('ADD SCRIPT', src);
    cb()
}

class App {
    private translate: Translate = Translate.getInstance();
    
    constructor(language: string = 'fr') {
        this.translate.switchLanguage(language)

        addScript(javascriptSource, () => {
            const player = new Player('J0thun')
            const monster = new Monster('Hydre')
            
            console.log(player, monster, chartSource);

            new Battle()
        });

        console.log("App initialized")
    }
}

new App('fr')