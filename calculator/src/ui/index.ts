export class Ui {
    private static instance: Ui;

    constructor(style: string) {
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

    public addEventListenerToElement(selector: string, eventType: string, callback: EventListener): void {
        const element = document.querySelector(selector) as HTMLElement;
        if (element) {
            element.addEventListener(eventType, callback);
        } else {
            console.warn(`Element with selector ${selector} not found`);
        }
    }
    public removeEventListenerFromElement(selector: string, eventType: string, callback: EventListener): void {
        const element = document.querySelector(selector) as HTMLElement;
        if (element) {
            element.removeEventListener(eventType, callback);
        } else {
            console.warn(`Element with selector ${selector} not found`);
        }
    }
    
    public getElementBySelector(selector: string) {
        const element = document.querySelector(selector) as HTMLElement;
        if (element)
            return element;
        
        console.warn(`Element with selector ${selector} not found`);
        return null;
    }
    
}