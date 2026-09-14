"use strict";

/* =========================================================
HOMEM E A MÁQUINA — GRUPO 1 / OUVIU
APP.JS
Navegação + Splash + Validações + Estados básicos
========================================================= */

/* =========================================================

1. REFERÊNCIAS DAS TELAS
========================================================= */

const screens = {
splash: document.getElementById("screen-splash"),
terms: document.getElementById("screen-terms"),
login: document.getElementById("screen-login"),
recovery: document.getElementById("screen-recovery"),
register: document.getElementById("screen-register"),
internal: document.getElementById("screen-internal-entry")
};

/* =========================================================
2. CONTROLO DE TELA
========================================================= */

function showScreen(screenName) {

const targetScreen = screens[screenName];

if (!targetScreen) {
console.error("Tela não encontrada:", screenName);
return;
}

Object.values(screens).forEach((screen) => {

if (!screen) return;

screen.hidden = true;
screen.setAttribute("aria-hidden", "true");

});

targetScreen.hidden = false;
targetScreen.setAttribute("aria-hidden", "false");

window.scrollTo(0, 0);
}

/* =========================================================
3. ESTADO INICIAL
========================================================= */

showScreen("splash");

/* =========================================================
4. SPLASH
========================================================= */

const SPLASH_DURATION = 4000;

window.setTimeout(() => {

showScreen("terms");

}, SPLASH_DURATION);

/* =========================================================
5. TERMOS E PRIVACIDADE
========================================================= */

const termsAccept =
document.getElementById("terms-accept");

const termsContinue =
document.getElementById("terms-continue");

if (termsAccept && termsContinue) {

termsAccept.addEventListener("change", () => {

termsContinue.disabled =
  !termsAccept.checked;

});

termsContinue.addEventListener("click", () => {

if (!termsAccept.checked) {
  return;
}

showScreen("login");

});

}

/* =========================================================
6. VALIDAÇÃO DE E-MAIL
========================================================= */

function validateEmail(email) {

const value = email.trim();

const emailPattern =
/^[^\s@]+@[^\s@]+.[^\s@]+$/;

return emailPattern.test(value);
}

/* =========================================================
7. LOGIN
========================================================= */

const loginForm =
document.getElementById("login-form");

const loginEmail =
document.getElementById("login-email");

const loginPassword =
document.getElementById("login-password");

const loginSubmit =
document.getElementById("login-submit");

const loginEmailError =
document.getElementById("login-email-error");

const loginPasswordError =
document.getElementById("login-password-error");

const loginMessage =
document.getElementById("login-message");

function validateLoginFields() {

if (
!loginEmail ||
!loginPassword ||
!loginSubmit
) {
return;
}

const emailValid =
validateEmail(loginEmail.value);

const passwordValid =
loginPassword.value.length > 0;

loginSubmit.disabled =
!(emailValid && passwordValid);

}

function clearLoginErrors() {

if (loginEmailError) {
loginEmailError.textContent = "";
}

if (loginPasswordError) {
loginPasswordError.textContent = "";
}

if (loginMessage) {
loginMessage.textContent = "";
}

}

if (
loginEmail &&
loginPassword &&
loginSubmit
) {

loginEmail.addEventListener("input", () => {

clearLoginErrors();
validateLoginFields();

});

loginPassword.addEventListener("input", () => {

clearLoginErrors();
validateLoginFields();

});

}

if (loginForm) {

loginForm.addEventListener("submit", (event) => {

event.preventDefault();

clearLoginErrors();

const email =
  loginEmail.value.trim();

const password =
  loginPassword.value;

let valid = true;


if (!validateEmail(email)) {

  loginEmailError.textContent =
    "Introdu um e-mail válido.";

  valid = false;

}


if (!password) {

  loginPasswordError.textContent =
    "Introdu a tua palavra-passe.";

  valid = false;

}


if (!valid) {

  validateLoginFields();
  return;

}


/*
 * A autenticação real será feita pelo Firebase.
 * Não simulamos uma entrada bem-sucedida.
 */

loginMessage.textContent =
  "Não foi possível entrar. Verifica os teus dados.";

});

}

/* =========================================================
8. LOGIN → CADASTRO
========================================================= */

const goRegister =
document.getElementById("go-register");

if (goRegister) {

goRegister.addEventListener("click", () => {

showScreen("register");

});

}

/* =========================================================
9. LOGIN → RECUPERAÇÃO
========================================================= */

const forgotPasswordLink =
document.getElementById("forgot-password-link");

if (forgotPasswordLink) {

forgotPasswordLink.addEventListener("click", () => {

showScreen("recovery");

});

}

/* =========================================================
10. RECUPERAÇÃO
========================================================= */

const recoveryForm =
document.getElementById("recovery-form");

const recoveryEmail =
document.getElementById("recovery-email");

const recoverySubmit =
document.getElementById("recovery-submit");

const recoveryEmailError =
document.getElementById("recovery-email-error");

const recoveryMessage =
document.getElementById("recovery-message");

function validateRecoveryFields() {

if (
!recoveryEmail ||
!recoverySubmit
) {
return;
}

recoverySubmit.disabled =
!validateEmail(recoveryEmail.value);

}

if (recoveryEmail && recoverySubmit) {

recoveryEmail.addEventListener("input", () => {

if (recoveryEmailError) {
  recoveryEmailError.textContent = "";
}

if (recoveryMessage) {
  recoveryMessage.textContent = "";
}

validateRecoveryFields();

});

}

if (recoveryForm) {

recoveryForm.addEventListener("submit", (event) => {

event.preventDefault();

if (recoveryEmailError) {
  recoveryEmailError.textContent = "";
}

if (recoveryMessage) {
  recoveryMessage.textContent = "";
}

const email =
  recoveryEmail.value.trim();


if (!validateEmail(email)) {

  recoveryEmailError.textContent =
    "Introdu um e-mail válido.";

  validateRecoveryFields();
  return;

}


/*
 * O envio real será feito pelo Firebase.
 */

recoveryMessage.textContent =
  "Se o e-mail estiver associado a uma conta, receberás as instruções de recuperação.";

});

}

/* =========================================================
11. RECUPERAÇÃO → LOGIN
========================================================= */

const backToLogin =
document.getElementById("back-to-login");

if (backToLogin) {

backToLogin.addEventListener("click", () => {

showScreen("login");

});

}

/* =========================================================
12. CADASTRO
========================================================= */

const registerForm =
document.getElementById("register-form");

const registerName =
document.getElementById("register-name");

const registerEmail =
document.getElementById("register-email");

const registerPassword =
document.getElementById("register-password");

const registerPasswordConfirm =
document.getElementById("register-password-confirm");

const registerSubmit =
document.getElementById("register-submit");

const registerNameError =
document.getElementById("register-name-error");

const registerEmailError =
document.getElementById("register-email-error");

const registerPasswordError =
document.getElementById("register-password-error");

const registerPasswordConfirmError =
document.getElementById("register-password-confirm-error");

const registerMessage =
document.getElementById("register-message");

function validateRegisterFields() {

if (
!registerName ||
!registerEmail ||
!registerPassword ||
!registerPasswordConfirm ||
!registerSubmit
) {
return;
}

const nameValid =
registerName.value.trim().length >= 2;

const emailValid =
validateEmail(registerEmail.value);

const passwordValid =
registerPassword.value.length >= 6;

const confirmationValid =
registerPasswordConfirm.value.length >= 6 &&
registerPassword.value ===
registerPasswordConfirm.value;

registerSubmit.disabled =
!(
nameValid &&
emailValid &&
passwordValid &&
confirmationValid
);

}

function clearRegisterErrors() {

if (registerNameError) {
registerNameError.textContent = "";
}

if (registerEmailError) {
registerEmailError.textContent = "";
}

if (registerPasswordError) {
registerPasswordError.textContent = "";
}

if (registerPasswordConfirmError) {
registerPasswordConfirmError.textContent = "";
}

if (registerMessage) {
registerMessage.textContent = "";
}

}

[
registerName,
registerEmail,
registerPassword,
registerPasswordConfirm
].forEach((field) => {

if (!field) return;

field.addEventListener("input", () => {

clearRegisterErrors();
validateRegisterFields();

});

});

if (registerForm) {

registerForm.addEventListener("submit", (event) => {

event.preventDefault();

clearRegisterErrors();

const name =
  registerName.value.trim();

const email =
  registerEmail.value.trim();

const password =
  registerPassword.value;

const passwordConfirm =
  registerPasswordConfirm.value;

let valid = true;


if (name.length < 2) {

  registerNameError.textContent =
    "Introdu o teu nome.";

  valid = false;

}


if (!validateEmail(email)) {

  registerEmailError.textContent =
    "Introdu um e-mail válido.";

  valid = false;

}


if (password.length < 6) {

  registerPasswordError.textContent =
    "A palavra-passe deve ter pelo menos 6 caracteres.";

  valid = false;

}


if (
  passwordConfirm.length < 6 ||
  password !== passwordConfirm
) {

  registerPasswordConfirmError.textContent =
    "As palavras-passe não coincidem.";

  valid = false;

}


if (!valid) {

  validateRegisterFields();
  return;

}


/*
 * FASE ATUAL DE TESTE
 *
 * Firebase ainda não está ligado.
 *
 * Cadastro válido → Entrada interna.
 *
 * Não guardamos palavra-passe.
 */

showScreen("internal");

});

}

/* =========================================================
13. CADASTRO → LOGIN
========================================================= */

const goLogin =
document.getElementById("go-login");

if (goLogin) {

goLogin.addEventListener("click", () => {

showScreen("login");

});

}

/* =========================================================
14. MOSTRAR / ESCONDER PALAVRA-PASSE
========================================================= */

const passwordToggles =
document.querySelectorAll(".password-toggle");

passwordToggles.forEach((toggle) => {

toggle.addEventListener("click", () => {

const targetId =
  toggle.getAttribute(
    "data-password-target"
  );

if (!targetId) {
  return;
}


const passwordInput =
  document.getElementById(targetId);

if (!passwordInput) {
  return;
}


const showing =
  passwordInput.type === "text";


passwordInput.type =
  showing
    ? "password"
    : "text";


toggle.setAttribute(
  "aria-pressed",
  String(!showing)
);


toggle.setAttribute(
  "aria-label",
  showing
    ? "Mostrar palavra-passe"
    : "Esconder palavra-passe"
);

});

});

/* =========================================================
15. TECLA ESC
========================================================= */

document.addEventListener("keydown", (event) => {

if (event.key !== "Escape") {
return;
}

if (!screens.recovery.hidden) {

showScreen("login");
return;

}

if (!screens.register.hidden) {

showScreen("login");
return;

}

});

/* =========================================================
16. VERIFICAÇÃO DA ESTRUTURA
========================================================= */

Object.entries(screens).forEach(
([name, screen]) => {

if (!screen) {

  console.error(
    "Tela obrigatória não encontrada:",
    name
  );

}

}
);

/* =========================================================
FIM DO APP.JS
========================================================= */
