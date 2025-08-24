// Element selectors    
const modalOverlay = document.getElementById("modalOverlay");
const loginModal = document.getElementById("loginModal");
const signupModal = document.getElementById("signupModal");

const closeLoginBtn = document.getElementById("closeLoginBtn");
const closeSignupBtn = document.getElementById("closeSignupBtn");

const switchToSignup = document.getElementById("switchToSignup");
const switchToLogin = document.getElementById("switchToLogin");

// Close modal
function closeModal() {
  modalOverlay.style.display = "none";
}
closeLoginBtn?.addEventListener("click", closeModal);

closeSignupBtn?.addEventListener("click", () => {
  modalOverlay.style.display = "none";
});

// Switch forms
switchToSignup?.addEventListener("click", (e) => {
  e.preventDefault();
  loginModal.style.display = "none";
  signupModal.style.display = "block";
});

switchToLogin?.addEventListener("click", (e) => {
  e.preventDefault();
  signupModal.style.display = "none";
  loginModal.style.display = "block";
});

// Show loader
function showLoader() {
  document.getElementById("loader").classList.add("active");
}

// Hide loader
function hideLoader() {
  document.getElementById("loader").classList.remove("active");
}
window.addEventListener("load", () => {
  showLoader();
});

function showModal() {
  modalOverlay.style.display = "flex";
  loginModal.style.display = "block";
  signupModal.style.display = "none";
  hideLoader();
}

export {
  showLoader,
  hideLoader,
  modalOverlay,
  signupModal,
  loginModal,
  showModal,
  closeModal,
};
