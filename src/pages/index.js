import Api from "../utils/Api.js";
import { setButtonText } from "../utils/helpers.js";
import "./index.css";
import profileSrc from "../images/avatar.jpg";

import {
  envableValidation,
  settings,
  resetValidation,
  disableButton,
} from "../scripts/validation.js";

const imgSrc = document.getElementById("profile-image");
imgSrc.src = profileSrc;

const initialCards = [
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "364f3f56-bdda-4a77-ae3b-ca8a2fe35e08",
    "Content-Type": "application/json",
  },
});

// destructure second item in callback

// api.getAppInfo().then(([cards]) => {
//   cards
//     .forEach((item) => {
//       const cardElement = getCardElement(item);
//       cardsList.prepend(cardElement);
//     })
//     .catch(console.error);
// });
// api
//   .getUserInfo()
//   .then((user) => {
//     console.log(user);
//     profileName.textContent = user.name;
//     editModalDescriptionInput.textContent = user.name;
//   })
//   .catch(console.error);

// set the name element's text content
// set desc. element's text content
// set the avatar src
//   // handle users info
//   // - set src of avatar img
//   // -set the textContent  of both text elements
// function handleAvatarFormSubmit(evt) {
//   evt.preventDefault();
//   const avatarInputValues = {
//     link: profileAvatarImg.value,
//   };
//   const cardElement = getCardElement(inputValues);
//   cardsList.prepend(cardElement);
// }

const avatarAddButton = document.querySelector(".profile__avatar-btn");
const cardAddButton = document.querySelector(".profile__add-btn");
const profileEditButton = document.querySelector(".profile__edit-btn");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const editModal = document.querySelector("#edit-modal");

const profileAvatarImg = document.querySelector("#profile-image");
const editFormElement = editModal.querySelector(".modal__form");
const profileCloseBtn = document.querySelector("#profile-close-btn");
const editModalNameInput = document.querySelector("#name");
const editModalDescriptionInput = document.querySelector("#description");

const cardModal = document.querySelector("#add-card-modal");
const cardCloseButton = cardModal.querySelector("#card-close-btn");
const cardForm = cardModal.querySelector(".modal__form");
const cardSubmitButton = cardModal.querySelector(".modal__submit-btn");
const cardLinkInput = cardModal.querySelector("#add-card-link");
const cardNameInput = cardModal.querySelector("#add-card-name");

const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector("#delete-form");
const deleteModalCloseBtn = deleteModal.querySelector("#delete-close-btn");
const deleteCancelBtn = deleteModal.querySelector("#delete-cancel-btn");
const deleteSubmitBtn = deleteModal.querySelector(".modal__delete-submit-btn");

// avatar form els
const avatarCloseButton = document.querySelector("#avatar-close-btn");
const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarSubmitButton = avatarModal.querySelector(".modal__submit-btn");
const avatarLinkInput = avatarModal.querySelector("#avatar-link");
const avatarImage = document.querySelector("#profile-image");

const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

const cardPreviewModal = document.querySelector("#preview-modal");
const cardImagePreview = cardPreviewModal.querySelector(".modal__image");
const cardCaptionPreview = cardPreviewModal.querySelector(".modal__caption");
const previewModalCloseBtn =
  cardPreviewModal.querySelector("#preview-close-btn");

const modalOverlays = document.querySelectorAll(".modal");

let selectedCard, selectedCardId;

function handleDeleteSubmit(evt) {
  evt.preventDefault();

  setButtonText(deleteSubmitBtn, true, "Delete", "Deleting...");

  api
    .deleteCard(selectedCardId)
    .then(() => {
      // TODO - remove card from Dom
      // close modal
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(deleteSubmitBtn, false);
    });
}

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);
  console.log(cardId);
}

function handleLikeBtn(evt, id) {
  // evt.target.classList.toggle("card__like-btn_liked");
  // TODO -check whether card is like.
  const isLiked = evt.target.classList.contains("card__like-btn_liked");
  // call handleLike function passing appropriate arguments
  // handle res
  api
    .handleLike(id, isLiked)
    .then(() => {
      evt.target.classList.toggle("card__like-btn_liked");
    })
    .catch(console.error);
}

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardNameElement = cardElement.querySelector(".card__title");
  const cardImageElement = cardElement.querySelector(".card__image");
  const cardLikeButton = cardElement.querySelector(".card__like-btn");
  const cardDeleteButton = cardElement.querySelector(".card__delete-btn");

  // if card is liked set liked class to card

  // const isLiked =
  //   data.likes && data.likes.some((like) => like._id === currentUserId);

  if (data.isLiked) {
    cardLikeButton.classList.add("card__like-btn_liked");
  }

  cardNameElement.textContent = data.name;
  cardImageElement.src = data.link;
  cardImageElement.alt = data.name;

  cardLikeButton.addEventListener("click", (evt) =>
    handleLikeBtn(evt, data._id)
  );

  cardDeleteButton.addEventListener("click", () =>
    handleDeleteCard(cardElement, data._id)
  );

  cardImageElement.addEventListener("click", () => {
    openModal(cardPreviewModal);
    cardImagePreview.src = data.link;
    cardCaptionPreview.textContent = data.name;
    cardImagePreview.alt = data.name;
  });

  return cardElement;
}

api
  .getAppInfo()
  .then(([user, cards]) => {
    console.log(deleteModalCloseBtn);
    avatarImage.src = user.avatar;
    profileName.textContent = user.name;
    editModalDescriptionInput.textContent = user.name;
    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardsList.prepend(cardElement);
    });
  })
  .catch(console.error);

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", closeEscapeBtn);
}

profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  resetValidation(
    editFormElement,
    [editModalNameInput, editModalDescriptionInput],
    settings
  );
  openModal(editModal);
});

avatarAddButton.addEventListener("click", () => {
  avatarLinkInput.value = avatarImage.textContent;
  resetValidation(avatarForm, [avatarLinkInput], settings);
  openModal(avatarModal);
});

deleteCancelBtn.addEventListener("click", () => {
  closeModal(deleteModal);
});

avatarCloseButton.addEventListener("click", () => {
  closeModal(avatarModal);
});

profileCloseBtn.addEventListener("click", () => {
  closeModal(editModal);
});

cardAddButton.addEventListener("click", () => {
  openModal(cardModal);
});

cardCloseButton.addEventListener("click", () => {
  closeModal(cardModal);
});

previewModalCloseBtn.addEventListener("click", () => {
  closeModal(cardPreviewModal);
});

modalOverlays.forEach((modal) => {
  modal.addEventListener("click", (event) => {
    // Check if the click happened on the overlay, not on the content inside the modal
    if (event.target === modal) {
      closeModal(modal);
    }
  });
});

function closeEscapeBtn(evt) {
  modalOverlays.forEach((modal) => {
    if (evt.key === "Escape") {
      closeModal(modal);
    }
  });
}

// modalOverlay.forEach((modal) => {
//   modal.addEventListener("keydown", (event) => {
//     // Check if the click happened on the overlay, not on the content inside the modal
//     if (event.key === "Escape") {
//       closeModal(modal);
//     }
//   });
// });

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", closeEscapeBtn);
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();

  const submitBtn = evt.submitter;
  // submitBtn.textContent = "Saving..."
  setButtonText(submitBtn, true);

  api
    .editUserInfo({
      name: editModalNameInput.value,
      about: editModalDescriptionInput.value,
    })
    .then((data) => {
      // todo - use data argument instead of value
      profileName.textContent = editModalNameInput.value;
      profileDescription.textContent = editModalDescriptionInput.value;
      closeModal(editModal);
    })
    .catch(console.error)
    .finally(() => {
      // TODO - call setButtonText instead
      // submitBtn.textContent = "Save";
      setButtonText(submitBtn, false);
    });
}
// TODO implement loading text for call form submissions
function handleCardFormSubmit(evt) {
  evt.preventDefault();

  setButtonText(cardSubmitButton, true);

  api
    .postUserCard({
      name: cardNameInput.value,
      link: cardLinkInput.value,
    })
    .then((data) => {
      const cardElement = getCardElement(data);
      cardsList.prepend(cardElement);
      evt.target.reset();
      closeModal(cardModal);
      //   name: cardNameInput.value,
      //   link: cardLinkInput.value,
    })
    // const cardElement = getCardElement(inputValues);
    // cardsList.prepend(cardElement);
    // evt.target.reset();
    // disableButton(cardSubmitButton, settings);
    // closeModal(cardModal);
    // })
    .catch(console.error)
    .finally(() => {
      setButtonText(cardSubmitButton, false);
    });
}
// handleAvatarFormSubmit(evt) {
// evt.preventDefault();
// const avatarImage = {link: avatarLinkInput.link}
// }

function setUserData(data) {
  avatarImage.src = data.avatar;
}

function handleAvatarFormSubmit(evt) {
  evt.preventDefault();

  setButtonText(avatarSubmitButton, true);

  api
    .editAvatarInfo(avatarLinkInput.value)
    .then((data) => {
      setUserData(data);
      evt.target.reset();
      disableButton(avatarSubmitButton, settings);
      closeModal(avatarModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(avatarSubmitButton, false);
    });
}

editFormElement.addEventListener("submit", handleEditFormSubmit);
cardForm.addEventListener("submit", handleCardFormSubmit);
avatarForm.addEventListener("submit", handleAvatarFormSubmit);
deleteForm.addEventListener("submit", handleDeleteSubmit);

envableValidation(settings);
