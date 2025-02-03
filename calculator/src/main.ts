import { Modal } from "./ui/components/modal";
import { translations } from "./config/translations"

import { Character } from './core/models/Character'
import Attack from "./core/models/Attack";

//import { RaceType, WeaponType } from './core/enums/index'

export class App {
    private modal: Modal;
    private character: Character;

    private currentLanguage: string;

    //INITIALISATION
    constructor(language: string = 'fr') {
        this.currentLanguage = language;

        this.modal = Modal.getInstance();
        this.character = new Character('J0thun', new Attack(10, 1.5))

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