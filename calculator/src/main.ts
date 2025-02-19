import { javascriptSource } from "./config/sources";
import { Player } from "./core/models/Player";
import { Monster } from "./core/models/Monster";
import { Battle } from "./core/models/Battle";
import { Translate } from "./core/services/Translate";

interface callbackAddScript { (...args: any): void }
const addScript = async (src: string, cb: callbackAddScript) => {
    cb()
}

class App {
    private translate: Translate = Translate.getInstance();
    
    constructor(language: string = 'fr') {
        document.addEventListener("DOMContentLoaded", () => {
            this.initializeApp(language);
        });
    }

    private initializeApp(language: string) {
        this.translate.switchLanguage(language)

        addScript(javascriptSource, () => {
            const player = new Player('J0thun')
            const monster = new Monster('Hydre')
            
            console.log(player, monster);

            new Battle()
        });

        console.log("App initialized")
    }
}

new App('fr')