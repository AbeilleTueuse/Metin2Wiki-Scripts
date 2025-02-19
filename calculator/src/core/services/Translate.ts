import { translations } from "../../config/translations";

export class Translate {
    private static instance: Translate;
    private currentLanguage: string = "fr";

    private constructor() {};

    public static getInstance(): Translate {
        if (!Translate.instance) {
            Translate.instance = new Translate();
        }
        return Translate.instance;
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