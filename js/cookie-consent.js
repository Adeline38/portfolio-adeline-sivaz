const cookieBanner = document.querySelector("[data-cookie-banner]");
const cookieDialog = document.querySelector("[data-cookie-dialog]");
const cookieKey = "adeline-analytics-consent";

if (cookieBanner && cookieDialog) {
  const saveChoice = (value) => {
    localStorage.setItem(cookieKey, value);
    cookieBanner.hidden = true;
    cookieDialog.hidden = true;
    document.body.classList.remove("modal-open");
  };

  document.addEventListener("click", (event) => {
    const choiceButton = event.target.closest("[data-cookie]");
    if (choiceButton) saveChoice(choiceButton.dataset.cookie);

    if (event.target.closest("[data-cookie-settings]")) {
      cookieDialog.hidden = false;
      document.body.classList.add("modal-open");
      cookieDialog.querySelector("button").focus();
    }

    if (event.target.matches("[data-cookie-dialog]")) {
      cookieDialog.hidden = true;
      document.body.classList.remove("modal-open");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !cookieDialog.hidden) {
      cookieDialog.hidden = true;
      document.body.classList.remove("modal-open");
    }
  });
}
