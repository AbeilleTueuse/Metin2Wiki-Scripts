function handleModal(button) {
  const modalName = button.dataset.modal;
  let modalContainer;

  if (modalName) {
    modalContainer = document.querySelector(
      `.modal[data-modal="${modalName}"]`
    );
  } else {
    modalContainer = button.nextElementSibling;
  }

  const closeButton = modalContainer.querySelector(".close-button");
  const autoClose = modalContainer.dataset.autoClose === "1";
  const addEvent = modalContainer.dataset.addEvent === "1";

  button.addEventListener("click", openModal);
  closeButton.addEventListener("click", closeModal);

  if (autoClose) {
    modalContainer.addEventListener("change", closeModal);
  }

  function openModal() {
    button.classList.add("tabber-active");
    modalContainer.classList.add("show-modal");
    window.addEventListener("click", handleClickOutside);
    window.addEventListener("keydown", handleEscape);

    if (addEvent) {
      const modalOpenEvent = new CustomEvent('modalOpen', {
        bubbles: true,
        detail: { modal: modalContainer, name: modalName }
      });
      button.dispatchEvent(modalOpenEvent);
    }
  }

  function closeModal() {
    button.classList.remove("tabber-active");
    modalContainer.classList.remove("show-modal");
    window.removeEventListener("click", handleClickOutside);
    window.removeEventListener("keydown", handleEscape);
  }

  function handleClickOutside(event) {
    if (event.target === modalContainer) {
      closeModal();
    }
  }

  function handleEscape(event) {
    if (event.key === "Escape") {
      closeModal();
    }
  }
}

function mainModal() {
  const modalButtons = document.querySelectorAll(".modal-trigger");
  modalButtons.forEach(handleModal);
}

mainModal();