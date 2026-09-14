/* ============================================================
   HOMEM E A MÁQUINA
   GRUPO 1 — EXTERNA + CONTA + CONFIGURAÇÃO
   app.js
   PARTE 1/4
   ============================================================

   IMPORTANTE:
   - Esta é a Parte 1 do MESMO app.js.
   - As Partes 1, 2, 3 e 4 devem ser juntadas na ordem.
   - Nesta fase o Firebase ainda NÃO está conectado.
   - Nenhuma senha ou credencial é armazenada.
   ============================================================ */

(() => {
  "use strict";

  /* ==========================================================
     1. CONFIGURAÇÃO INICIAL
     ========================================================== */

  const SPLASH_TIME = 4000;

  const screens = Array.from(
    document.querySelectorAll(".screen")
  );

  let currentScreenId = "splash";

  /*
   * Estado temporário apenas para funcionamento visual
   * durante esta fase.
   *
   * NÃO representa autenticação real.
   * NÃO substitui Firebase Authentication.
   */
  const temporaryState = {
    termsAccepted: false,
    privacyAccepted: false,
    currentUser: null,

    settings: {
      voice: null,
      language: null,
      conversation: null,
      appearance: null
    }
  };

  /* ==========================================================
     2. UTILITÁRIOS
     ========================================================== */

  function getElement(selector) {
    return document.querySelector(selector);
  }

  function getElements(selector) {
    return Array.from(
      document.querySelectorAll(selector)
    );
  }

  function showElement(element) {
    if (!element) return;

    element.hidden = false;
  }

  function hideElement(element) {
    if (!element) return;

    element.hidden = true;
  }

  function setText(selector, text) {
    const element = getElement(selector);

    if (!element) return;

    element.textContent = text;
  }

  /* ==========================================================
     3. ERROS DOS CAMPOS
     ========================================================== */

  function clearInputError(input) {
    if (!input) return;

    input.classList.remove("is-error");

    input.removeAttribute("aria-invalid");

    const field = input.closest(".field-group");

    if (!field) return;

    field.classList.remove("has-error");

    const error = field.querySelector(
      ".field-error"
    );

    if (error) {
      error.textContent = "";
    }
  }

  function setInputError(input, message) {
    if (!input) return;

    input.classList.add("is-error");

    input.setAttribute(
      "aria-invalid",
      "true"
    );

    const field = input.closest(".field-group");

    if (!field) return;

    field.classList.add("has-error");

    const error = field.querySelector(
      ".field-error"
    );

    if (error) {
      error.textContent = message;
    }
  }

  function clearAllInputErrors(form) {
    if (!form) return;

    const inputs = form.querySelectorAll("input");

    inputs.forEach((input) => {
      clearInputError(input);
    });
  }

  /* ==========================================================
     4. MENSAGENS DOS FORMULÁRIOS
     ========================================================== */

  function getFormMessage(form) {
    if (!form) return null;

    return form.querySelector(
      ".form-message, .auth-error, .global-error, [data-form-message]"
    );
  }

  function showFormMessage(
    form,
    message,
    type = "error"
  ) {
    const messageElement = getFormMessage(form);

    if (!messageElement) return;

    messageElement.textContent = message;

    messageElement.classList.remove(
      "is-error",
      "is-success",
      "is-info"
    );

    messageElement.classList.add(
      `is-${type}`
    );

    showElement(messageElement);
  }

  function clearFormMessage(form) {
    const messageElement = getFormMessage(form);

    if (!messageElement) return;

    messageElement.textContent = "";

    messageElement.classList.remove(
      "is-error",
      "is-success",
      "is-info"
    );

    hideElement(messageElement);
  }

  /* ==========================================================
     5. NAVEGAÇÃO ENTRE TELAS
     ========================================================== */

  function findScreen(screenId) {
    if (!screenId) return null;

    return document.getElementById(screenId);
  }

  function showScreen(
    screenId,
    options = {}
  ) {
    const target = findScreen(screenId);

    if (!target) {
      console.warn(
        `[Grupo 1] Tela não encontrada: ${screenId}`
      );

      return false;
    }

    screens.forEach((screen) => {
      screen.classList.remove("is-active");

      screen.setAttribute(
        "aria-hidden",
        "true"
      );
    });

    target.classList.add("is-active");

    target.setAttribute(
      "aria-hidden",
      "false"
    );

    currentScreenId = screenId;

    if (options.scrollTop !== false) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto"
      });
    }

    return true;
  }

  function goTo(screenId) {
    showScreen(screenId);
  }

  /* ==========================================================
     6. SPLASH
     ========================================================== */

  function startSplash() {
    const splash = findScreen("splash");

    if (!splash) {
      console.warn(
        "[Grupo 1] Tela Splash não encontrada."
      );

      return;
    }

    showScreen("splash");

    window.setTimeout(() => {
      /*
       * Nesta fase visual ainda não temos Firebase.
       *
       * Portanto, o fluxo inicial segue para
       * apresentação.
       *
       * Quando o Firebase Authentication for conectado,
       * esta decisão será substituída pela verificação
       * real da sessão do utilizador.
       */

      if (temporaryState.currentUser) {
        goTo("internal-home");
      } else {
        goTo("presentation");
      }
    }, SPLASH_TIME);
  }

  /* ==========================================================
     7. TERMOS
     ========================================================== */

  function setupTerms() {
    const checkbox = getElement(
      "#terms-checkbox"
    );

    const continueButton = getElement(
      "#terms-continue"
    );

    if (!checkbox || !continueButton) {
      return;
    }

    continueButton.disabled =
      !checkbox.checked;

    checkbox.addEventListener(
      "change",
      () => {
        temporaryState.termsAccepted =
          checkbox.checked;

        continueButton.disabled =
          !checkbox.checked;
      }
    );
  }

  /* ==========================================================
     8. PRIVACIDADE
     ========================================================== */

  function setupPrivacy() {
    const checkbox = getElement(
      "#privacy-checkbox"
    );

    const continueButton = getElement(
      "#privacy-continue"
    );

    if (!checkbox || !continueButton) {
      return;
    }

    continueButton.disabled =
      !checkbox.checked;

    checkbox.addEventListener(
      "change",
      () => {
        temporaryState.privacyAccepted =
          checkbox.checked;

        continueButton.disabled =
          !checkbox.checked;
      }
    );
  }

  /* ==========================================================
     9. NAVEGAÇÃO DOS BOTÕES
     ========================================================== */

  function handleAction(
    action,
    element
  ) {
    if (!action) return;

    switch (action) {

      /* ------------------------------------------------------
         APRESENTAÇÃO
         ------------------------------------------------------ */

      case "go-terms":
        goTo("terms");
        break;

      /* ------------------------------------------------------
         TERMOS
         ------------------------------------------------------ */

      case "go-privacy": {
        const checkbox =
          getElement("#terms-checkbox");

        if (
          !checkbox ||
          !checkbox.checked
        ) {
          return;
        }

        temporaryState.termsAccepted =
          true;

        goTo("privacy");

        break;
      }

      /* ------------------------------------------------------
         PRIVACIDADE
         ------------------------------------------------------ */

      case "go-login": {
        const checkbox =
          getElement("#privacy-checkbox");

        if (
          !checkbox ||
          !checkbox.checked
        ) {
          return;
        }

        temporaryState.privacyAccepted =
          true;

        goTo("login");

        break;
      }

      /* ------------------------------------------------------
         AUTENTICAÇÃO
         ------------------------------------------------------ */

      case "go-register":
        goTo("register");
        break;

      case "go-reset":
        goTo("reset-password");
        break;

      case "back-login":
        goTo("login");
        break;

      /* ------------------------------------------------------
         ÁREA INTERNA
         ------------------------------------------------------ */

      case "go-home":
        goTo("internal-home");
        break;

      case "go-settings":
        goTo("settings");
        break;

      case "go-account":
        goTo("account");
        break;

      case "go-profile":
        goTo("profile");
        break;

      /* ------------------------------------------------------
         CONFIGURAÇÕES
         ------------------------------------------------------ */

      case "go-voice":
        goTo("settings-voice");
        break;

      case "go-language":
        goTo("settings-language");
        break;

      case "go-conversation":
        goTo("settings-conversation");
        break;

      case "go-settings-privacy":
        goTo("settings-privacy");
        break;

      case "go-appearance":
        goTo("settings-appearance");
        break;

      /* ------------------------------------------------------
         DOCUMENTO DE PRIVACIDADE
         ------------------------------------------------------ */

      case "go-privacy-document":
        goTo("privacy-document");
        break;

      /* ------------------------------------------------------
         LOGOUT
         ------------------------------------------------------ */

      case "logout":
        handleTemporaryLogout();
        break;

      default:
        console.warn(
          `[Grupo 1] Ação não reconhecida: ${action}`
        );
    }
  }

  /* ==========================================================
     10. EVENTOS DATA-ACTION
     ========================================================== */

  function setupActions() {
    const actionElements =
      getElements("[data-action]");

    actionElements.forEach(
      (element) => {
        element.addEventListener(
          "click",
          (event) => {

            /*
             * Não bloquear checkbox, input ou
             * elementos que tenham comportamento próprio.
             */

            if (
              element.tagName === "INPUT" ||
              element.tagName === "SELECT" ||
              element.tagName === "TEXTAREA"
            ) {
              return;
            }

            event.preventDefault();

            const action =
              element.dataset.action;

            handleAction(
              action,
              element
            );
          }
        );
      }
    );
  }

  /* ==========================================================
     11. MOSTRAR / OCULTAR SENHA
     ========================================================== */

  function setupPasswordToggles() {
    const buttons = getElements(
      "[data-password-toggle], .password-toggle"
    );

    buttons.forEach(
      (button) => {
        button.addEventListener(
          "click",
          (event) => {
            event.preventDefault();

            const fieldGroup =
              button.closest(
                ".field-group"
              );

            if (!fieldGroup) return;

            const input =
              fieldGroup.querySelector(
                'input[type="password"], input[type="text"]'
              );

            if (!input) return;

            const showingPassword =
              input.type === "text";

            input.type =
              showingPassword
                ? "password"
                : "text";

            button.setAttribute(
              "aria-pressed",
              String(!showingPassword)
            );

            /*
             * Caso o botão possua texto,
             * alternamos de forma simples.
             */

            if (button.dataset.showText) {
              button.textContent =
                showingPassword
                  ? button.dataset.showText
                  : button.dataset.hideText ||
                    "Ocultar";
            }
          }
        );
      }
    );
  }

  /* ==========================================================
     12. VALIDAÇÃO DE EMAIL
     ========================================================== */

  function isValidEmail(email) {
    if (!email) return false;

    const value =
      String(email).trim();

    /*
     * Verifica apenas o formato.
     *
     * Não verifica se o email realmente existe.
     * Essa verificação será responsabilidade do
     * Firebase Authentication.
     */

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      value
    );
  }

  /* ==========================================================
     13. VALIDAÇÃO DE NOME
     ========================================================== */

  function isValidName(name) {
    if (!name) return false;

    const value =
      String(name).trim();

    return value.length >= 2;
  }

  /* ==========================================================
     14. VALIDAÇÃO DE SENHA
     ========================================================== */

  function isValidPassword(password) {
    if (!password) return false;

    return String(password).length >= 6;
  }

  /* ==========================================================
     15. VALIDAÇÃO DO CADASTRO
     ========================================================== */

  function validateRegisterForm() {
    const form =
      getElement("#register-form");

    if (!form) {
      return false;
    }

    clearAllInputErrors(form);
    clearFormMessage(form);

    const nameInput =
      getElement("#register-name");

    const emailInput =
      getElement("#register-email");

    const passwordInput =
      getElement("#register-password");

    const confirmInput =
      getElement("#register-password-confirm");

    const acceptance =
      getElement("#register-acceptance");

    let valid = true;

    /* Nome */

    if (
      !nameInput ||
      !isValidName(nameInput.value)
    ) {
      setInputError(
        nameInput,
        "Digite o seu nome."
      );

      valid = false;
    }

    /* Email */

    if (
      !emailInput ||
      !isValidEmail(emailInput.value)
    ) {
      setInputError(
        emailInput,
        "Digite um email válido."
      );

      valid = false;
    }

    /* Senha */

    if (
      !passwordInput ||
      !isValidPassword(
        passwordInput.value
      )
    ) {
      setInputError(
        passwordInput,
        "A senha deve ter pelo menos 6 caracteres."
      );

      valid = false;
    }

    /* Confirmação */

    if (
      !confirmInput ||
      confirmInput.value !==
        passwordInput?.value
    ) {
      setInputError(
        confirmInput,
        "As senhas não coincidem."
      );

      valid = false;
    }

    /* Aceitação */

    if (
      !acceptance ||
      !acceptance.checked
    ) {
      showFormMessage(
        form,
        "É necessário aceitar os Termos e a Política de Privacidade.",
        "error"
      );

      valid = false;
    }

    return valid;
  }

  /* ==========================================================
     FIM DA PARTE 1/4
     ========================================================== */
 /* ============================================================
   HOMEM E A MÁQUINA
   GRUPO 1 — EXTERNA + CONTA + CONFIGURAÇÃO
   app.js
   PARTE 2/4
   ============================================================ */

  /* ==========================================================
     16. VALIDAÇÃO DO LOGIN
     ========================================================== */

  function validateLoginForm() {
    const form = getElement("#login-form");

    if (!form) {
      return false;
    }

    clearAllInputErrors(form);
    clearFormMessage(form);

    const emailInput =
      getElement("#login-email");

    const passwordInput =
      getElement("#login-password");

    let valid = true;

    /* Email */

    if (
      !emailInput ||
      !isValidEmail(emailInput.value)
    ) {
      setInputError(
        emailInput,
        "Digite um email válido."
      );

      valid = false;
    }

    /* Senha */

    if (
      !passwordInput ||
      passwordInput.value.length === 0
    ) {
      setInputError(
        passwordInput,
        "Digite a sua senha."
      );

      valid = false;
    }

    return valid;
  }

  /* ==========================================================
     17. VALIDAÇÃO DA RECUPERAÇÃO DE SENHA
     ========================================================== */

  function validateResetForm() {
    const form =
      getElement("#reset-password-form");

    if (!form) {
      return false;
    }

    clearAllInputErrors(form);
    clearFormMessage(form);

    const emailInput =
      getElement("#reset-email");

    if (
      !emailInput ||
      !isValidEmail(emailInput.value)
    ) {
      setInputError(
        emailInput,
        "Digite um email válido."
      );

      return false;
    }

    return true;
  }

  /* ==========================================================
     18. ESTADO DO BOTÃO DE CADASTRO
     ========================================================== */

  function updateRegisterButton() {
    const form =
      getElement("#register-form");

    const button =
      form?.querySelector(
        'button[type="submit"]'
      );

    if (!button) return;

    const nameInput =
      getElement("#register-name");

    const emailInput =
      getElement("#register-email");

    const passwordInput =
      getElement("#register-password");

    const confirmInput =
      getElement("#register-password-confirm");

    const acceptance =
      getElement("#register-acceptance");

    const basicFieldsFilled =
      Boolean(
        nameInput?.value.trim() &&
        emailInput?.value.trim() &&
        passwordInput?.value &&
        confirmInput?.value
      );

    const passwordReady =
      Boolean(
        passwordInput &&
        isValidPassword(
          passwordInput.value
        )
      );

    const passwordsMatch =
      Boolean(
        passwordInput &&
        confirmInput &&
        passwordInput.value ===
          confirmInput.value
      );

    const accepted =
      Boolean(
        acceptance?.checked
      );

    button.disabled = !(
      basicFieldsFilled &&
      passwordReady &&
      passwordsMatch &&
      accepted
    );
  }

  /* ==========================================================
     19. EVENTOS DO CADASTRO
     ========================================================== */

  function setupRegisterForm() {
    const form =
      getElement("#register-form");

    if (!form) return;

    const inputs =
      form.querySelectorAll("input");

    inputs.forEach((input) => {
      input.addEventListener(
        "input",
        () => {
          clearInputError(input);
          clearFormMessage(form);

          updateRegisterButton();
        }
      );

      input.addEventListener(
        "change",
        () => {
          updateRegisterButton();
        }
      );
    });

    updateRegisterButton();

    form.addEventListener(
      "submit",
      (event) => {
        event.preventDefault();

        const valid =
          validateRegisterForm();

        updateRegisterButton();

        if (!valid) {
          return;
        }

        /*
         * ATENÇÃO:
         *
         * O cadastro real ainda não está conectado.
         * Não criamos conta falsa e não armazenamos
         * senha no navegador.
         */

        showFormMessage(
          form,
          "O cadastro real será ativado quando o Firebase Authentication for conectado.",
          "info"
        );
      }
    );
  }

  /* ==========================================================
     20. EVENTOS DO LOGIN
     ========================================================== */

  function setupLoginForm() {
    const form =
      getElement("#login-form");

    if (!form) return;

    const inputs =
      form.querySelectorAll("input");

    inputs.forEach((input) => {
      input.addEventListener(
        "input",
        () => {
          clearInputError(input);
          clearFormMessage(form);
        }
      );
    });

    form.addEventListener(
      "submit",
      (event) => {
        event.preventDefault();

        const valid =
          validateLoginForm();

        if (!valid) {
          return;
        }

        /*
         * Ainda não existe autenticação real.
         *
         * Não devemos aceitar qualquer email/senha
         * como se fossem credenciais válidas.
         */

        showFormMessage(
          form,
          "A autenticação ainda não está conectada. O Firebase será integrado na próxima etapa.",
          "info"
        );
      }
    );
  }

  /* ==========================================================
     21. EVENTOS DA RECUPERAÇÃO DE SENHA
     ========================================================== */

  function setupResetForm() {
    const form =
      getElement(
        "#reset-password-form"
      );

    if (!form) return;

    const inputs =
      form.querySelectorAll("input");

    inputs.forEach((input) => {
      input.addEventListener(
        "input",
        () => {
          clearInputError(input);
          clearFormMessage(form);
        }
      );
    });

    form.addEventListener(
      "submit",
      (event) => {
        event.preventDefault();

        const valid =
          validateResetForm();

        if (!valid) {
          return;
        }

        /*
         * O envio real do email de recuperação
         * será feito pelo Firebase Authentication.
         */

        showFormMessage(
          form,
          "A recuperação de senha será ativada quando o Firebase Authentication for conectado.",
          "info"
        );
      }
    );
  }

  /* ==========================================================
     22. CAMPOS DO PERFIL
     ========================================================== */

  function setupProfileForm() {
    const form =
      getElement("#profile-form");

    if (!form) return;

    form.addEventListener(
      "submit",
      (event) => {
        event.preventDefault();

        const nameInput =
          getElement("#profile-name");

        if (
          nameInput &&
          !isValidName(
            nameInput.value
          )
        ) {
          setInputError(
            nameInput,
            "Digite um nome válido."
          );

          return;
        }

        clearAllInputErrors(form);
        clearFormMessage(form);

        showFormMessage(
          form,
          "Alterações preparadas. A gravação real será ligada à conta Firebase.",
          "info"
        );
      }
    );
  }

  /* ==========================================================
     23. CONTROLES DE CONFIGURAÇÃO
     ========================================================== */

  function setupSettingControls() {
    /*
     * Radio buttons
     */

    const radios =
      getElements(
        'input[type="radio"][data-setting]'
      );

    radios.forEach((radio) => {
      radio.addEventListener(
        "change",
        () => {
          if (!radio.checked) return;

          const setting =
            radio.dataset.setting;

          const value =
            radio.value;

          if (!setting) return;

          if (
            Object.prototype.hasOwnProperty.call(
              temporaryState.settings,
              setting
            )
          ) {
            temporaryState.settings[
              setting
            ] = value;
          }

          showGlobalMessage(
            "Alteração aplicada apenas nesta sessão.",
            "info"
          );
        }
      );
    });

    /*
     * Checkboxes de configuração
     */

    const checkboxes =
      getElements(
        'input[type="checkbox"][data-setting]'
      );

    checkboxes.forEach(
      (checkbox) => {
        checkbox.addEventListener(
          "change",
          () => {
            const setting =
              checkbox.dataset.setting;

            if (!setting) return;

            if (
              Object.prototype.hasOwnProperty.call(
                temporaryState.settings,
                setting
              )
            ) {
              temporaryState.settings[
                setting
              ] = checkbox.checked;
            }

            showGlobalMessage(
              "Alteração aplicada apenas nesta sessão.",
              "info"
            );
          }
        );
      }
    );
  }

  /* ==========================================================
     24. MENSAGEM GLOBAL
     ========================================================== */

  function showGlobalMessage(
    message,
    type = "info"
  ) {
    const messageElement =
      getElement("#global-message");

    if (!messageElement) {
      return;
    }

    messageElement.textContent =
      message;

    messageElement.classList.remove(
      "is-error",
      "is-success",
      "is-info"
    );

    messageElement.classList.add(
      `is-${type}`
    );

    messageElement.classList.add(
      "is-visible"
    );

    window.clearTimeout(
      showGlobalMessage.timeout
    );

    showGlobalMessage.timeout =
      window.setTimeout(() => {
        messageElement.classList.remove(
          "is-visible"
        );
      }, 3500);
  }

  /* ==========================================================
     25. LOGOUT TEMPORÁRIO
     ========================================================== */

  function handleTemporaryLogout() {
    /*
     * Nesta fase não existe sessão Firebase.
     *
     * Apenas limpamos o estado temporário
     * e voltamos para o login.
     */

    temporaryState.currentUser =
      null;

    showGlobalMessage(
      "Sessão de teste encerrada.",
      "info"
    );

    goTo("login");
  }

  /* ==========================================================
     26. ESTADO INICIAL DOS CAMPOS
     ========================================================== */

  function initializeFormStates() {
    const forms =
      getElements("form");

    forms.forEach((form) => {
      clearFormMessage(form);

      const inputs =
        form.querySelectorAll("input");

      inputs.forEach((input) => {
        clearInputError(input);
      });
    });

    updateRegisterButton();
  }

  /* ==========================================================
     FIM DA PARTE 2/4
     ========================================================== */
 /* ============================================================
   HOMEM E A MÁQUINA
   GRUPO 1 — EXTERNA + CONTA + CONFIGURAÇÃO
   app.js
   PARTE 3/4
   ============================================================ */

  /* ==========================================================
     27. NAVEGAÇÃO DE VOLTA
     ========================================================== */

  function setupBackButtons() {
    const backButtons = getElements(
      "[data-back]"
    );

    backButtons.forEach((button) => {
      button.addEventListener(
        "click",
        (event) => {
          event.preventDefault();

          const destination =
            button.dataset.back;

          if (!destination) {
            return;
          }

          goTo(destination);
        }
      );
    });
  }

  /* ==========================================================
     28. LIMPAR FORMULÁRIOS AO TROCAR DE TELA
     ========================================================== */

  function resetFormWhenLeavingScreen() {
    const allForms =
      getElements("form");

    allForms.forEach((form) => {
      form.addEventListener(
        "reset",
        () => {
          clearAllInputErrors(form);
          clearFormMessage(form);

          updateRegisterButton();
        }
      );
    });
  }

  /* ==========================================================
     29. VALIDAÇÃO EM TEMPO REAL
     ========================================================== */

  function setupLiveValidation() {
    /*
     * Email do login
     */

    const loginEmail =
      getElement("#login-email");

    if (loginEmail) {
      loginEmail.addEventListener(
        "blur",
        () => {
          if (
            loginEmail.value.trim() === ""
          ) {
            return;
          }

          if (
            !isValidEmail(
              loginEmail.value
            )
          ) {
            setInputError(
              loginEmail,
              "Digite um email válido."
            );
          } else {
            clearInputError(
              loginEmail
            );
          }
        }
      );
    }

    /*
     * Email do cadastro
     */

    const registerEmail =
      getElement("#register-email");

    if (registerEmail) {
      registerEmail.addEventListener(
        "blur",
        () => {
          if (
            registerEmail.value.trim() === ""
          ) {
            return;
          }

          if (
            !isValidEmail(
              registerEmail.value
            )
          ) {
            setInputError(
              registerEmail,
              "Digite um email válido."
            );
          } else {
            clearInputError(
              registerEmail
            );
          }
        }
      );
    }

    /*
     * Email de recuperação
     */

    const resetEmail =
      getElement("#reset-email");

    if (resetEmail) {
      resetEmail.addEventListener(
        "blur",
        () => {
          if (
            resetEmail.value.trim() === ""
          ) {
            return;
          }

          if (
            !isValidEmail(
              resetEmail.value
            )
          ) {
            setInputError(
              resetEmail,
              "Digite um email válido."
            );
          } else {
            clearInputError(
              resetEmail
            );
          }
        }
      );
    }

    /*
     * Senha do cadastro
     */

    const registerPassword =
      getElement(
        "#register-password"
      );

    if (registerPassword) {
      registerPassword.addEventListener(
        "blur",
        () => {
          if (
            registerPassword.value === ""
          ) {
            return;
          }

          if (
            !isValidPassword(
              registerPassword.value
            )
          ) {
            setInputError(
              registerPassword,
              "A senha deve ter pelo menos 6 caracteres."
            );
          } else {
            clearInputError(
              registerPassword
            );
          }
        }
      );
    }

    /*
     * Confirmação da senha
     */

    const confirmPassword =
      getElement(
        "#register-password-confirm"
      );

    if (confirmPassword) {
      confirmPassword.addEventListener(
        "blur",
        () => {
          const password =
            getElement(
              "#register-password"
            );

          if (
            confirmPassword.value === ""
          ) {
            return;
          }

          if (
            !password ||
            confirmPassword.value !==
              password.value
          ) {
            setInputError(
              confirmPassword,
              "As senhas não coincidem."
            );
          } else {
            clearInputError(
              confirmPassword
            );
          }
        }
      );
    }
  }

  /* ==========================================================
     30. PROTEÇÃO DOS BOTÕES DESATIVADOS
     ========================================================== */

  function setupDisabledButtonProtection() {
    document.addEventListener(
      "click",
      (event) => {
        const button =
          event.target.closest(
            "button"
          );

        if (!button) {
          return;
        }

        if (button.disabled) {
          event.preventDefault();
          event.stopPropagation();
        }
      },
      true
    );
  }

  /* ==========================================================
     31. ACESSIBILIDADE BÁSICA
     ========================================================== */

  function setupAccessibility() {
    screens.forEach((screen) => {
      if (
        !screen.hasAttribute(
          "aria-hidden"
        )
      ) {
        screen.setAttribute(
          "aria-hidden",
          screen.classList.contains(
            "is-active"
          )
            ? "false"
            : "true"
        );
      }
    });

    /*
     * Campos obrigatórios recebem aria-required.
     */

    const requiredInputs =
      getElements(
        "input[required]"
      );

    requiredInputs.forEach(
      (input) => {
        input.setAttribute(
          "aria-required",
          "true"
        );
      }
    );
  }

  /* ==========================================================
     32. ENTER NOS FORMULÁRIOS
     ========================================================== */

  function setupKeyboardBehavior() {
    document.addEventListener(
      "keydown",
      (event) => {
        if (event.key !== "Escape") {
          return;
        }

        /*
         * Não fechamos a aplicação nem fazemos
         * logout com ESC.
         *
         * Apenas removemos mensagens temporárias.
         */

        const globalMessage =
          getElement(
            "#global-message"
          );

        if (globalMessage) {
          globalMessage.classList.remove(
            "is-visible"
          );
        }
      }
    );
  }

  /* ==========================================================
     33. CONTROLO DO CHECKBOX DE TERMOS
     ========================================================== */

  function refreshTermsState() {
    const checkbox =
      getElement("#terms-checkbox");

    const button =
      getElement("#terms-continue");

    if (!checkbox || !button) {
      return;
    }

    temporaryState.termsAccepted =
      checkbox.checked;

    button.disabled =
      !checkbox.checked;
  }

  /* ==========================================================
     34. CONTROLO DO CHECKBOX DE PRIVACIDADE
     ========================================================== */

  function refreshPrivacyState() {
    const checkbox =
      getElement(
        "#privacy-checkbox"
      );

    const button =
      getElement(
        "#privacy-continue"
      );

    if (!checkbox || !button) {
      return;
    }

    temporaryState.privacyAccepted =
      checkbox.checked;

    button.disabled =
      !checkbox.checked;
  }

  /* ==========================================================
     35. CONTROLO DA ACEITAÇÃO DO CADASTRO
     ========================================================== */

  function setupRegisterAcceptance() {
    const checkbox =
      getElement(
        "#register-acceptance"
      );

    if (!checkbox) {
      return;
    }

    checkbox.addEventListener(
      "change",
      () => {
        updateRegisterButton();
      }
    );
  }

  /* ==========================================================
     36. PREVENÇÃO DE DUPLO ENVIO
     ========================================================== */

  function setupSubmitProtection() {
    const forms =
      getElements("form");

    forms.forEach((form) => {
      form.addEventListener(
        "submit",
        () => {
          const button =
            form.querySelector(
              'button[type="submit"]'
            );

          if (!button) {
            return;
          }

          /*
           * O botão será reativado pelo fluxo
           * específico quando necessário.
           *
           * Como o Firebase ainda não está conectado,
           * não mantemos o botão permanentemente
           * bloqueado nesta fase.
           */

          window.setTimeout(() => {
            if (
              !button.dataset.permanentDisabled
            ) {
              button.disabled = false;
            }

            if (
              form.id ===
              "register-form"
            ) {
              updateRegisterButton();
            }
          }, 100);
        }
      );
    });
  }

  /* ==========================================================
     37. DETECÇÃO DE TELAS AUSENTES
     ========================================================== */

  function validateExpectedScreens() {
    const expectedScreens = [
      "splash",
      "presentation",
      "terms",
      "privacy",
      "login",
      "register",
      "reset-password",
      "internal-home",
      "settings",
      "account",
      "profile",
      "settings-voice",
      "settings-language",
      "settings-conversation",
      "settings-privacy",
      "settings-appearance",
      "privacy-document"
    ];

    const missingScreens =
      expectedScreens.filter(
        (id) => !findScreen(id)
      );

    if (missingScreens.length > 0) {
      console.warn(
        "[Grupo 1] Telas esperadas não encontradas:",
        missingScreens
      );
    }

    return missingScreens.length === 0;
  }

  /* ==========================================================
     38. INICIALIZAÇÃO DOS ELEMENTOS
     ========================================================== */

  function initializeInterface() {
    /*
     * Garante que nenhuma tela fique ativa
     * por acidente antes da inicialização.
     */

    screens.forEach((screen) => {
      screen.classList.remove(
        "is-active"
      );

      screen.setAttribute(
        "aria-hidden",
        "true"
      );
    });

    /*
     * Splash é sempre a primeira tela
     * quando a aplicação é aberta.
     */

    const splash =
      findScreen("splash");

    if (splash) {
      splash.classList.add(
        "is-active"
      );

      splash.setAttribute(
        "aria-hidden",
        "false"
      );

      currentScreenId =
        "splash";
    }

    refreshTermsState();
    refreshPrivacyState();

    updateRegisterButton();
  }

  /* ==========================================================
     39. INICIALIZAÇÃO PRINCIPAL
     ========================================================== */

  function initializeApp() {
    /*
     * Primeiro verificamos a estrutura.
     */

    validateExpectedScreens();

    /*
     * Depois preparamos a interface.
     */

    initializeInterface();

    /*
     * Eventos de navegação.
     */

    setupActions();

    setupBackButtons();

    /*
     * Autenticação / formulários.
     */

    setupRegisterForm();
    setupLoginForm();
    setupResetForm();
    setupProfileForm();

    /*
     * Controles visuais.
     */

    setupPasswordToggles();
    setupSettingControls();

    /*
     * Termos e privacidade.
     */

    setupTerms();
    setupPrivacy();
    setupRegisterAcceptance();

    /*
     * Validações.
     */

    setupLiveValidation();

    /*
     * Comportamentos gerais.
     */

    initializeFormStates();
    resetFormWhenLeavingScreen();
    setupDisabledButtonProtection();
    setupAccessibility();
    setupKeyboardBehavior();
    setupSubmitProtection();

    /*
     * Finalmente iniciamos o Splash.
     */

    startSplash();
  }

  /* ==========================================================
     40. INÍCIO
     ========================================================== */

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      initializeApp,
      {
        once: true
      }
    );
  } else {
    initializeApp();
  }

  /* ==========================================================
     FIM DA PARTE 3/4
     ========================================================== */
 /* ============================================================
   HOMEM E A MÁQUINA
   GRUPO 1 — EXTERNA + CONTA + CONFIGURAÇÃO
   app.js
   PARTE 4/4
   ============================================================ */

  /* ==========================================================
     41. GARANTIA DE ESTADO DO SPLASH
     ========================================================== */

  function ensureSplashState() {
    const splash =
      findScreen("splash");

    if (!splash) {
      return;
    }

    if (
      currentScreenId === "splash"
    ) {
      splash.classList.add(
        "is-active"
      );

      splash.setAttribute(
        "aria-hidden",
        "false"
      );
    }
  }

  /* ==========================================================
     42. ATUALIZAÇÃO DE DADOS VISUAIS DA CONTA
     ========================================================== */

  function updateAccountVisuals() {
    const user =
      temporaryState.currentUser;

    if (!user) {
      return;
    }

    const nameElements =
      getElements(
        "[data-user-name]"
      );

    nameElements.forEach(
      (element) => {
        element.textContent =
          user.name || "";
      }
    );

    const emailElements =
      getElements(
        "[data-user-email]"
      );

    emailElements.forEach(
      (element) => {
        element.textContent =
          user.email || "";
      }
    );
  }

  /* ==========================================================
     43. PREPARAÇÃO PARA AUTENTICAÇÃO REAL
     ========================================================== */

  function prepareAuthenticationLayer() {
    /*
     * Ponto de integração reservado para Firebase
     * Authentication.
     *
     * IMPORTANTE:
     * Não colocamos credenciais, senhas ou tokens aqui.
     *
     * Quando o Firebase for conectado, esta camada deverá
     * assumir:
     *
     * - criação real da conta;
     * - login real;
     * - recuperação de senha;
     * - sessão real;
     * - logout real;
     * - tratamento dos erros do Firebase;
     * - proteção das áreas internas.
     */

    window.HomemEMaquinaAuth = {
      connected: false,

      getUser() {
        return temporaryState.currentUser;
      },

      isAuthenticated() {
        return Boolean(
          temporaryState.currentUser
        );
      }
    };
  }

  /* ==========================================================
     44. PREPARAÇÃO PARA CONFIGURAÇÕES
     ========================================================== */

  function exposeTemporarySettings() {
    /*
     * Disponibiliza somente o estado temporário
     * desta fase para módulos posteriores.
     *
     * Isto não é armazenamento permanente.
     */

    window.HomemEMaquinaSettings = {
      get(setting) {
        if (
          !Object.prototype.hasOwnProperty.call(
            temporaryState.settings,
            setting
          )
        ) {
          return null;
        }

        return temporaryState.settings[
          setting
        ];
      },

      set(setting, value) {
        if (
          !Object.prototype.hasOwnProperty.call(
            temporaryState.settings,
            setting
          )
        ) {
          return false;
        }

        temporaryState.settings[
          setting
        ] = value;

        return true;
      },

      getAll() {
        return {
          ...temporaryState.settings
        };
      }
    };
  }

  /* ==========================================================
     45. PREPARAÇÃO PARA INTEGRAÇÃO COM A MÁQUINA
     ========================================================== */

  function prepareMachineIntegration() {
    /*
     * O Grupo 1 não implementa a Máquina Principal.
     *
     * Apenas deixamos um ponto claro de integração
     * para o Grupo 2.
     *
     * O Grupo 2 poderá assumir a tela interna sem que
     * o Grupo 1 precise reconstruir toda a área externa.
     */

    window.HomemEMaquinaNavigation = {
      openMachine() {
        /*
         * Durante a fase atual, a tela interna ainda
         * possui o placeholder da Máquina.
         */

        const machineScreen =
          findScreen(
            "internal-home"
          );

        if (!machineScreen) {
          return false;
        }

        goTo("internal-home");

        return true;
      },

      currentScreen() {
        return currentScreenId;
      },

      goTo(screenId) {
        return showScreen(
          screenId
        );
      }
    };
  }

  /* ==========================================================
     46. TRATAMENTO DE ERROS GERAIS
     ========================================================== */

  function setupGlobalErrorHandling() {
    window.addEventListener(
      "error",
      (event) => {
        console.error(
          "[Grupo 1] Erro de JavaScript:",
          event.error || event.message
        );
      }
    );

    window.addEventListener(
      "unhandledrejection",
      (event) => {
        console.error(
          "[Grupo 1] Promise rejeitada:",
          event.reason
        );
      }
    );
  }

  /* ==========================================================
     47. EXPOSIÇÃO CONTROLADA DO ESTADO
     ========================================================== */

  function exposeDebugState() {
    /*
     * Somente durante desenvolvimento.
     *
     * Não contém senha.
     */

    window.HomemEMaquinaDebug = {
      getCurrentScreen() {
        return currentScreenId;
      },

      getTemporaryState() {
        return {
          termsAccepted:
            temporaryState.termsAccepted,

          privacyAccepted:
            temporaryState.privacyAccepted,

          currentUser:
            temporaryState.currentUser
              ? {
                  name:
                    temporaryState
                      .currentUser.name,

                  email:
                    temporaryState
                      .currentUser.email
                }
              : null,

          settings: {
            ...temporaryState.settings
          }
        };
      }
    };
  }

  /* ==========================================================
     48. FINALIZAÇÃO DA PREPARAÇÃO
     ========================================================== */

  function finalizeApplicationSetup() {
    ensureSplashState();

    prepareAuthenticationLayer();

    exposeTemporarySettings();

    prepareMachineIntegration();

    setupGlobalErrorHandling();

    exposeDebugState();

    updateAccountVisuals();
  }

  /* ==========================================================
     49. EXECUÇÃO FINAL
     ========================================================== */

  /*
   * O initializeApp() da Parte 3 é responsável por
   * inicializar a interface.
   *
   * Este bloco aguarda o DOM para preparar as interfaces
   * públicas e os pontos de integração.
   */

  function bootFinalLayer() {
    finalizeApplicationSetup();
  }

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      bootFinalLayer,
      {
        once: true
      }
    );
  } else {
    bootFinalLayer();
  }

  /* ==========================================================
     50. FIM DO APP.JS
     ========================================================== */

})();
