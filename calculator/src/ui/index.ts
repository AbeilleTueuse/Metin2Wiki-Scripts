import { Modal } from "./components/modal";

export class Ui {
    private static instance: Ui;
    private modal: Modal;

    constructor(style: string) {
        this.modal = Modal.getInstance();

        this.loadStyle(style)

        console.log('Ui initialized');
    }

    public static getInstance(...args: [string]): Ui {
        if (!Ui.instance) {
            Ui.instance = new Ui(...args);
        }
        return Ui.instance;
    }

    public loadStyle(style: string) {
        const link = document.createElement("link");
        link.href = style;
        link.rel = "stylesheet";

        document.head.appendChild(link);
    }

}