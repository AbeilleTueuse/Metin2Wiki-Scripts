import { translations } from "./config/translations"

import { Ui } from "./ui/index";
import { cssSource, javascriptSource, chartSource } from "./config/sources";
import { Player } from "./core/models/Player";
import { Monster } from "./core/models/Monster";
import { Battle } from "./core/models/Battle";

//import { RaceType, WeaponType } from './core/enums/index'

interface callbackAddScript { (...args: any): void }
const addScript = async (src: string, cb: callbackAddScript) => {
    console.log('ADD SCRIPT', src);
    cb()
}

class App {
    private ui: Ui;

    private currentLanguage: string;

    //INITIALISATION
    constructor(language: string = 'fr') {
        this.currentLanguage = language;

        this.ui = Ui.getInstance(cssSource);

        addScript(javascriptSource, () => {
            const player = new Player('J0thun')
            const monster = new Monster('Hydre')
            
            console.log(player, monster, chartSource);

            new Battle()
        });

        console.log("App initialized")
    }

    public switchLanguage(newLanguage: string) {
        if (translations[newLanguage as keyof typeof translations]) {
            return this.currentLanguage = newLanguage;
        }

        console.warn("Langue non supportée")
        return false;
    }

    public u__(key: string) {
        return translations[this.currentLanguage as keyof typeof translations][key] || translations[this.currentLanguage as keyof typeof translations]['NOT_EXISTS']
    }
}

new App('fr')