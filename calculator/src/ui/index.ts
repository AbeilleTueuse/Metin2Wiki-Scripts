export class Ui {
    private static instance: Ui;

    constructor(style: string) {
        console.log('LOAD STYLE', style);
        this.loadStyle(style)
    }

    public static getInstance(...args: [string]): Ui {
        if (!Ui.instance) {
            Ui.instance = new Ui(...args);
        }
        return Ui.instance;
    }

    public loadStyle(stye: string) {
        const link = document.createElement("link");
        link.href = stye;
        link.rel = "stylesheet";

        document.head.appendChild(link);
    }

}