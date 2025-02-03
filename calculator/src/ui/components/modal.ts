export class Modal {
    private static instance: Modal;

    private constructor() {
        this.init();
    }

    public static getInstance(): Modal {
        if (!Modal.instance) {
            Modal.instance = new Modal();
        }
        return Modal.instance;
    }

    private init(): void {
        const modalButtons = document.querySelectorAll(".modal-trigger");
        modalButtons.forEach((button) => this.handleModal(button as HTMLElement));
    }

    private handleModal(button: HTMLElement): void {
        const modalName = button.dataset.modal;
        let modalContainer: HTMLElement | null;

        if (modalName) {
            modalContainer = document.querySelector(`.modal[data-modal="${modalName}"]`);
        } else {
            modalContainer = button.nextElementSibling as HTMLElement;
        }

        if (!modalContainer) return;

        const closeButton = modalContainer.querySelector(".close-button") as HTMLElement;
        const { autoCloseChange, autoCloseLink, addEvent } = modalContainer.dataset;

        button.addEventListener("click", () => this.openModal(button, modalContainer));
        closeButton.addEventListener("click", () => this.closeModal(button, modalContainer));

        if (autoCloseChange === "1") {
            modalContainer.addEventListener("change", () => this.closeModal(button, modalContainer));
        }
  
        if (autoCloseLink === "1") {
            const links = modalContainer.querySelectorAll("a");
            links.forEach((link) => {
                link.addEventListener("click", () => this.closeModal(button, modalContainer));
            });
        }
    }

    private openModal(button: HTMLElement, modalContainer: HTMLElement): void {
        button.classList.add("tabber-active");
        modalContainer.classList.add("show-modal");
        
        window.addEventListener("click", (event) => this.handleClickOutside(event, modalContainer, button));
        window.addEventListener("keydown", (event) => this.handleEscape(event, modalContainer, button));

        if (modalContainer.dataset.addEvent === "1") {
            const modalOpenEvent = new CustomEvent("modalOpen", {
                bubbles: true,
                detail: { modal: modalContainer, name: modalContainer.dataset.modal }
            });
            button.dispatchEvent(modalOpenEvent);
        }
    }

    private closeModal(button: HTMLElement, modalContainer: HTMLElement): void {
        button.classList.remove("tabber-active");
        modalContainer.classList.remove("show-modal");

        window.removeEventListener("click", (event) => this.handleClickOutside(event, modalContainer, button));
        window.removeEventListener("keydown", (event) => this.handleEscape(event, modalContainer, button));
    }

    private handleClickOutside(event: MouseEvent, modalContainer: HTMLElement, button: HTMLElement): void {
        if (event.target === modalContainer) {
            this.closeModal(button, modalContainer);
        }
    }

    private handleEscape(event: KeyboardEvent, modalContainer: HTMLElement, button: HTMLElement): void {
        if (event.key === "Escape") {
            this.closeModal(button, modalContainer);
        }
    }
}
  