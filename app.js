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

  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "instant"
  });
}


/* =========================================================
   3. ESTADO INICIAL
   ========================================================= */

showScreen("splash");


/* =========================================================
   4. SPLASH
   ========================================================= */

const SPLASH_DURATION = 4000;

function startSplash() {

  window.setTimeout(() => {

    /*
     * Nesta fase ainda não existe Firebase.
     *
     * Por isso, depois da Splash entramos no fluxo
     * externo começando pelos Termos.
     *
     * A verificação de sessão será acrescentada
     * quando Firebase for integrado.
     */

    showScreen("terms");

  }, SPLASH_DURATION);
}

startSplash();


/* =========================================================
   5. TERMOS E PRIVACIDADE
   ========================================================= */

const termsAccept = document.getElementById("terms-accept");
const termsContinue = document.getElementById("terms-continue");


if (termsAccept && termsContinue) {

  termsAccept.addEventListener("change", () => {

    termsContinue.disabled = !termsAccept.checked;

  });


  termsContinue.addEventListener("click", () => {

    if (!termsAccept.checked) return;

    showScreen("login");

  });

}


/* =========================================================
   6. LOGIN
   ========================================================= */

const loginForm = document.getElementById("login-form");
const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");
const loginSubmit = document.getElementById("login-submit");

const loginEmailError = document.getElementById("login-email-error");
const loginPasswordError = document.getElementById("login-password-error");
const loginMessage = document.getElementById("login-message");


function validateEmail(email) {

  const value = email.trim();

  /*
   * Validação básica de estrutura.
   *
   * Não obriga .com.
   * Exemplos válidos:
   * nome@gmail.com
   * nome@empresa.co.mz
   * pessoa@dominio.org
   */

  const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailPattern.test(value);
}


function validateLoginFields() {

  const emailValid = validateEmail(loginEmail.value);

  const passwordValid =
    loginPassword.value.trim().length >= 1;

  loginSubmit.disabled =
    !(emailValid && passwordValid);

}


function clearLoginErrors() {

  loginEmailError.textContent = "";
  loginPasswordError.textContent = "";
  loginMessage.textContent = "";

}


if (loginEmail && loginPassword && loginSubmit) {

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

    const email = loginEmail.value.trim();
    const password = loginPassword.value;

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
     * Firebase será ligado aqui posteriormente.
     *
     * Não simulamos login bem-sucedido.
     * Não fingimos que a conta existe.
     */

    loginMessage.textContent =
      "O acesso será ligado ao sistema de autenticação na próxima etapa.";

  });

}


/* =========================================================
   7. IR PARA CRIAR CONTA
   ========================================================= */

const goRegister = document.getElementById("go-register");

if (goRegister) {

  goRegister.addEventListener("click", () => {

    showScreen("register");

  });

}


/* =========================================================
   8. RECUPERAR ACESSO
   ========================================================= */

const forgotPasswordLink =
  document.getElementById("forgot-password-link");

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

  if (!recoveryEmail || !recoverySubmit) return;

  recoverySubmit.disabled =
    !validateEmail(recoveryEmail.value);

}


if (forgotPasswordLink) {

  forgotPasswordLink.addEventListener("click", () => {

    showScreen("recovery");

  });

}


if (recoveryEmail && recoverySubmit) {

  recoveryEmail.addEventListener("input", () => {

    recoveryEmailError.textContent = "";
    recoveryMessage.textContent = "";

    validateRecoveryFields();

  });

}


if (recoveryForm) {

  recoveryForm.addEventListener("submit", (event) => {

    event.preventDefault();

    recoveryEmailError.textContent = "";
    recoveryMessage.textContent = "";

    const email = recoveryEmail.value.trim();


    if (!validateEmail(email)) {

      recoveryEmailError.textContent =
        "Introdu um e-mail válido.";

      validateRecoveryFields();
      return;

    }


    /*
     * Firebase Password Reset será ligado aqui.
     *
     * Não revelamos se o e-mail existe ou não.
     */

    recoveryMessage.textContent =
      "Se o e-mail estiver associado a uma conta, receberás as instruções de recuperação.";

  });

}


/* =========================================================
   9. VOLTAR PARA LOGIN
   ========================================================= */

const backToLogin =
  document.getElementById("back-to-login");

if (backToLogin) {

  backToLogin.addEventListener("click", () => {

    showScreen("login");

  });

}


/* =========================================================
   10. CADASTRO
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

  registerNameError.textContent = "";
  registerEmailError.textContent = "";
  registerPasswordError.textContent = "";
  registerPasswordConfirmError.textContent = "";
  registerMessage.textContent = "";

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
     * IMPORTANTE:
     *
     * Não criamos uma conta falsa.
     * Não guardamos palavra-passe no navegador.
     *
     * A criação real da conta será feita pelo
     * Firebase Authentication na próxima etapa.
     */

    registerMessage.textContent =
      "O cadastro será ligado ao sistema de autenticação na próxima etapa.";

  });

}


/* =========================================================
   11. VOLTAR DO CADASTRO PARA LOGIN
   ========================================================= */

const goLogin =
  document.getElementById("go-login");

if (goLogin) {

  goLogin.addEventListener("click", () => {

    showScreen("login");

  });

}


/* =========================================================
   12. MOSTRAR / ESCONDER PALAVRA-PASSE
   ========================================================= */

const passwordToggles =
  document.querySelectorAll(".password-toggle");


passwordToggles.forEach((toggle) => {

  toggle.addEventListener("click", () => {

    const targetId =
      toggle.getAttribute("data-password-target");

    if (!targetId) return;


    const passwordInput =
      document.getElementById(targetId);

    if (!passwordInput) return;


    const showing =
      passwordInput.type === "text";


    passwordInput.type =
      showing ? "password" : "text";


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
   13. TECLADO / ENTER
   ========================================================= */

document.addEventListener("keydown", (event) => {

  if (event.key !== "Escape") return;

  const loginVisible =
    !screens.login.hidden;

  const recoveryVisible =
    !screens.recovery.hidden;

  const registerVisible =
    !screens.register.hidden;


  if (recoveryVisible) {

    showScreen("login");
    return;

  }


  if (registerVisible) {

    showScreen("login");
    return;

  }


  if (loginVisible) {

    return;

  }

});


/* =========================================================
   14. PROTEÇÃO BÁSICA
   ========================================================= */

window.addEventListener("pageshow", () => {

  /*
   * Mantemos o estado inicial controlado pelo app.
   * A sessão persistente será adicionada com Firebase.
   */

  if (!screens.splash) {
    console.error(
      "Estrutura principal não encontrada."
    );
  }

});


/* =========================================================
   FIM DO APP.JS
   ========================================================= */
