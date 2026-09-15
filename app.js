"use strict";

/* =========================================================
   HOMEM E A MÁQUINA — GRUPO 1 / OUVIU
   APP.JS
   Firebase Authentication + Navegação + Validações
   ========================================================= */


/* =========================================================
   1. FIREBASE
   ========================================================= */

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    onAuthStateChanged,
    updateProfile
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";


var firebaseConfig = {
    apiKey: "AIzaSyCgCX6KFFsXlwtBeO7dwjKvUOvuprSNVA0",
    authDomain: "homem-maquina-ouviu.firebaseapp.com",
    projectId: "homem-maquina-ouviu",
    storageBucket: "homem-maquina-ouviu.firebasestorage.app",
    messagingSenderId: "670735486971",
    appId: "1:670735486971:web:09bf6bb62721bf972d855e"
};


var firebaseApp =
    initializeApp(firebaseConfig);

var auth =
    getAuth(firebaseApp);


/* =========================================================
   2. REFERÊNCIAS DAS TELAS
   ========================================================= */

var screens = {
    splash: document.getElementById("screen-splash"),
    terms: document.getElementById("screen-terms"),
    login: document.getElementById("screen-login"),
    recovery: document.getElementById("screen-recovery"),
    register: document.getElementById("screen-register"),
    internal: document.getElementById("screen-internal-entry")
};


/* =========================================================
   3. CONTROLO DE TELA
   ========================================================= */

function showScreen(screenName) {

    var targetScreen = screens[screenName];

    if (!targetScreen) {
        console.error("Tela não encontrada:", screenName);
        return;
    }

    var screenNames = [
        "splash",
        "terms",
        "login",
        "recovery",
        "register",
        "internal"
    ];

    for (var i = 0; i < screenNames.length; i++) {

        var name = screenNames[i];
        var screen = screens[name];

        if (!screen) {
            continue;
        }

        screen.hidden = true;
        screen.setAttribute("aria-hidden", "true");
    }

    targetScreen.hidden = false;
    targetScreen.setAttribute("aria-hidden", "false");

    /*
     * Só fazemos o scroll para o topo quando
     * saímos do Splash.
     *
     * O Splash continua fixo.
     */

    if (screenName !== "splash") {
        window.scrollTo(0, 0);
    }
}


/* =========================================================
   4. ESTADO INICIAL
   ========================================================= */

showScreen("splash");


/* =========================================================
   5. SPLASH + SESSÃO FIREBASE
   ========================================================= */

var SPLASH_DURATION = 4000;

var splashFinished = false;
var authResolved = false;
var currentUser = null;


function finishSplashIfReady() {

    if (!splashFinished || !authResolved) {
        return;
    }

    /*
     * Se já existe uma sessão Firebase,
     * entra diretamente na área interna.
     */

    if (currentUser) {
        showScreen("internal");
        return;
    }

    /*
     * Sem sessão:
     * entra na Área Externa.
     */

    showScreen("terms");
}


window.setTimeout(function () {

    splashFinished = true;

    finishSplashIfReady();

}, SPLASH_DURATION);


/*
 * O Firebase verifica automaticamente se existe
 * uma sessão válida neste dispositivo.
 */

onAuthStateChanged(auth, function (user) {

    currentUser = user;
    authResolved = true;

    finishSplashIfReady();

});


/* =========================================================
   6. TERMOS E CONDIÇÕES
   ========================================================= */

var termsAccept =
    document.getElementById("terms-accept");

var termsContinue =
    document.getElementById("terms-continue");


if (termsAccept && termsContinue) {

    termsAccept.addEventListener("change", function () {

        termsContinue.disabled =
            !termsAccept.checked;

    });


    termsContinue.addEventListener("click", function () {

        if (!termsAccept.checked) {
            return;
        }

        /*
         * Guardamos apenas o facto de os Termos
         * terem sido aceites neste dispositivo.
         *
         * Isto NÃO substitui um registo jurídico
         * definitivo no servidor.
         */

        try {
            localStorage.setItem(
                "hm_ouviu_terms_accepted",
                "true"
            );
        } catch (error) {
            console.warn(
                "Não foi possível guardar a aceitação local.",
                error
            );
        }

        showScreen("login");

    });

}


/* =========================================================
   7. VALIDAÇÃO DE E-MAIL
   ========================================================= */

function validateEmail(email) {

    var value = email.trim();

    var emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(value);
}


/* =========================================================
   8. ERROS DO FIREBASE
   ========================================================= */

function getFirebaseErrorMessage(error) {

    if (!error || !error.code) {
        return "Ocorreu um erro. Tenta novamente.";
    }


    switch (error.code) {

        case "auth/invalid-email":
            return "O e-mail introduzido não é válido.";

        case "auth/user-not-found":
            return "Não encontrámos uma conta com este e-mail.";

        case "auth/wrong-password":
        case "auth/invalid-credential":
            return "O e-mail ou a palavra-passe estão incorretos.";

        case "auth/invalid-login-credentials":
            return "O e-mail ou a palavra-passe estão incorretos.";

        case "auth/email-already-in-use":
            return "Já existe uma conta com este e-mail.";

        case "auth/weak-password":
            return "A palavra-passe deve ter pelo menos 6 caracteres.";

        case "auth/too-many-requests":
            return "Foram feitas muitas tentativas. Tenta novamente mais tarde.";

        case "auth/network-request-failed":
            return "Não foi possível ligar ao serviço. Verifica a internet.";

        case "auth/user-disabled":
            return "Esta conta está desativada.";

        default:
            console.error(
                "Erro Firebase:",
                error
            );

            return "Não foi possível concluir a operação. Tenta novamente.";
    }
}


/* =========================================================
   9. LOGIN
   ========================================================= */

var loginForm =
    document.getElementById("login-form");

var loginEmail =
    document.getElementById("login-email");

var loginPassword =
    document.getElementById("login-password");

var loginSubmit =
    document.getElementById("login-submit");

var loginEmailError =
    document.getElementById("login-email-error");

var loginPasswordError =
    document.getElementById("login-password-error");

var loginMessage =
    document.getElementById("login-message");


function validateLoginFields() {

    if (!loginEmail ||
        !loginPassword ||
        !loginSubmit) {
        return;
    }

    var emailValid =
        validateEmail(loginEmail.value);

    var passwordValid =
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


if (loginEmail &&
    loginPassword &&
    loginSubmit) {

    loginEmail.addEventListener("input", function () {

        clearLoginErrors();
        validateLoginFields();

    });


    loginPassword.addEventListener("input", function () {

        clearLoginErrors();
        validateLoginFields();

    });

}


if (loginForm) {

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        clearLoginErrors();

        var email =
            loginEmail.value.trim();

        var password =
            loginPassword.value;

        var valid = true;


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


        loginSubmit.disabled = true;

        loginMessage.textContent =
            "A entrar...";


        try {

            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            /*
             * Não chamamos showScreen("internal")
             * manualmente aqui.
             *
             * onAuthStateChanged trata da sessão.
             */

        } catch (error) {

            loginMessage.textContent =
                getFirebaseErrorMessage(error);

            validateLoginFields();

        }

    });

}


/* =========================================================
   10. LOGIN → CADASTRO
   ========================================================= */

var goRegister =
    document.getElementById("go-register");


if (goRegister) {

    goRegister.addEventListener("click", function () {

        showScreen("register");

    });

}


/* =========================================================
   11. LOGIN → RECUPERAÇÃO
   ========================================================= */

var forgotPasswordLink =
    document.getElementById("forgot-password-link");


if (forgotPasswordLink) {

    forgotPasswordLink.addEventListener("click", function () {

        showScreen("recovery");

    });

}


/* =========================================================
   12. RECUPERAÇÃO
   ========================================================= */

var recoveryForm =
    document.getElementById("recovery-form");

var recoveryEmail =
    document.getElementById("recovery-email");

var recoverySubmit =
    document.getElementById("recovery-submit");

var recoveryEmailError =
    document.getElementById("recovery-email-error");

var recoveryMessage =
    document.getElementById("recovery-message");


function validateRecoveryFields() {

    if (!recoveryEmail ||
        !recoverySubmit) {
        return;
    }

    recoverySubmit.disabled =
        !validateEmail(recoveryEmail.value);
}


function clearRecoveryErrors() {

    if (recoveryEmailError) {
        recoveryEmailError.textContent = "";
    }

    if (recoveryMessage) {
        recoveryMessage.textContent = "";
    }
}


if (recoveryEmail &&
    recoverySubmit) {

    recoveryEmail.addEventListener("input", function () {

        clearRecoveryErrors();
        validateRecoveryFields();

    });

}


if (recoveryForm) {

    recoveryForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        clearRecoveryErrors();

        var email =
            recoveryEmail.value.trim();


        if (!validateEmail(email)) {

            recoveryEmailError.textContent =
                "Introdu um e-mail válido.";

            validateRecoveryFields();

            return;
        }


        recoverySubmit.disabled = true;

        recoveryMessage.textContent =
            "A enviar...";


        try {

            await sendPasswordResetEmail(
                auth,
                email
            );

            /*
             * Não revelamos ao utilizador se
             * a conta realmente existe.
             */

            recoveryMessage.textContent =
                "Se o e-mail estiver associado a uma conta, receberás as instruções de recuperação.";

        } catch (error) {

            /*
             * Mantemos uma resposta genérica.
             */

            recoveryMessage.textContent =
                "Se o e-mail estiver associado a uma conta, receberás as instruções de recuperação.";

            console.warn(
                "Recuperação:",
                error
            );

        }

        validateRecoveryFields();

    });

}


/* =========================================================
   13. RECUPERAÇÃO → LOGIN
   ========================================================= */

var backToLogin =
    document.getElementById("back-to-login");


if (backToLogin) {

    backToLogin.addEventListener("click", function () {

        showScreen("login");

    });

}


/* =========================================================
   14. CADASTRO
   ========================================================= */

var registerForm =
    document.getElementById("register-form");

var registerName =
    document.getElementById("register-name");

var registerEmail =
    document.getElementById("register-email");

var registerPassword =
    document.getElementById("register-password");

var registerPasswordConfirm =
    document.getElementById("register-password-confirm");

var registerSubmit =
    document.getElementById("register-submit");

var registerNameError =
    document.getElementById("register-name-error");

var registerEmailError =
    document.getElementById("register-email-error");

var registerPasswordError =
    document.getElementById("register-password-error");

var registerPasswordConfirmError =
    document.getElementById("register-password-confirm-error");

var registerMessage =
    document.getElementById("register-message");


function validateRegisterFields() {

    if (!registerName ||
        !registerEmail ||
        !registerPassword ||
        !registerPasswordConfirm ||
        !registerSubmit) {
        return;
    }


    var nameValid =
        registerName.value.trim().length >= 2;

    var emailValid =
        validateEmail(registerEmail.value);

    var passwordValid =
        registerPassword.value.length >= 6;

    var confirmationValid =
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


var registerFields = [
    registerName,
    registerEmail,
    registerPassword,
    registerPasswordConfirm
];


for (var r = 0; r < registerFields.length; r++) {

    if (!registerFields[r]) {
        continue;
    }

    registerFields[r].addEventListener(
        "input",
        function () {

            clearRegisterErrors();
            validateRegisterFields();

        }
    );

}


if (registerForm) {

    registerForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        clearRegisterErrors();

        var name =
            registerName.value.trim();

        var email =
            registerEmail.value.trim();

        var password =
            registerPassword.value;

        var passwordConfirm =
            registerPasswordConfirm.value;

        var valid = true;


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


        registerSubmit.disabled = true;

        registerMessage.textContent =
            "A criar a tua conta...";


        try {

            var userCredential =
                await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );


            /*
             * O nome não vai para uma base de dados nossa.
             * É guardado no perfil básico do utilizador
             * dentro do Firebase Authentication.
             */

            await updateProfile(
                userCredential.user,
                {
                    displayName: name
                }
            );


            registerMessage.textContent =
                "Conta criada com sucesso.";

            /*
             * createUserWithEmailAndPassword já inicia
             * a sessão automaticamente.
             *
             * onAuthStateChanged vai encaminhar
             * o utilizador para a área interna.
             */

        } catch (error) {

            registerMessage.textContent =
                getFirebaseErrorMessage(error);

            validateRegisterFields();

        }

    });

}


/* =========================================================
   15. CADASTRO → LOGIN
   ========================================================= */

var goLogin =
    document.getElementById("go-login");


if (goLogin) {

    goLogin.addEventListener("click", function () {

        showScreen("login");

    });

}


/* =========================================================
   16. MOSTRAR / ESCONDER PALAVRA-PASSE
   ========================================================= */

var passwordToggles =
    document.querySelectorAll(".password-toggle");


for (var p = 0; p < passwordToggles.length; p++) {

    passwordToggles[p].addEventListener(
        "click",
        function () {

            var toggle = this;

            var targetId =
                toggle.getAttribute(
                    "data-password-target"
                );


            if (!targetId) {
                return;
            }


            var passwordInput =
                document.getElementById(targetId);


            if (!passwordInput) {
                return;
            }


            var showing =
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

        }
    );

}


/* =========================================================
   17. TECLA ESC
   ========================================================= */

document.addEventListener("keydown", function (event) {

    if (event.key !== "Escape") {
        return;
    }


    if (screens.recovery &&
        !screens.recovery.hidden) {

        showScreen("login");
        return;
    }


    if (screens.register &&
        !screens.register.hidden) {

        showScreen("login");
        return;
    }

});


/* =========================================================
   18. VERIFICAÇÃO DA ESTRUTURA
   ========================================================= */

var requiredScreens = [
    "splash",
    "terms",
    "login",
    "recovery",
    "register",
    "internal"
];


for (var s = 0; s < requiredScreens.length; s++) {

    var screenName = requiredScreens[s];


    if (!screens[screenName]) {

        console.error(
            "Tela obrigatória não encontrada:",
            screenName
        );

    }

}


/* =========================================================
   FIM DO APP.JS
   ========================================================= */
