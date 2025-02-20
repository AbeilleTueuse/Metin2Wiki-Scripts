import { javascriptSource } from "./config/sources";
import { Translate } from "./core/services/Translate";
import { Core } from "./core/index";

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
            new Core();
        });

        console.log("App initialized")
    }
}

new App('fr')