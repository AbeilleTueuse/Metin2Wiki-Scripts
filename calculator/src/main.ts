import { ModalManager } from "./ui/components/modal";

class App {
    constructor() {
        this.init();
    }

    //INITIALISATION
    private init(): void {
        ModalManager.getInstance();
        console.log("App initialized")
    }
}

new App();