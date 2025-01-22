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
  const { autoCloseChange, autoCloseLink, addEvent } = modalContainer.dataset;

  button.addEventListener("click", openModal);
  closeButton.addEventListener("click", closeModal);

  if (autoCloseChange === "1") {
    modalContainer.addEventListener("change", closeModal);
  }

  if (autoCloseLink === "1") {
    const links = modalContainer.querySelectorAll("a");
    links.forEach((link) => {
      link.addEventListener("click", closeModal);
    });
  }

  function openModal() {
    button.classList.add("tabber-active");
    modalContainer.classList.add("show-modal");
    window.addEventListener("click", handleClickOutside);
    window.addEventListener("keydown", handleEscape);

    if (addEvent === "1") {
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