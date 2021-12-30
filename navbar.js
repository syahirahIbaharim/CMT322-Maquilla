import { getStorage, ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
const storage = getStorage();

const template = document.createElement('template');
template.innerHTML = `
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="styles/fonts.css">
    <link rel="stylesheet" href="styles/navbar.css">
    <header id="navbar">
        <a href="index.html"><img id="icon"></a>
        <nav class="menu">
            <span><a href="#">Booking</a></span>
            <span><a href="#">Job Listing</a></span>
            <span><a href="#">Makeup Artist</a></span>
        </nav>
        <span>
            <span id="account-tab">
                <i class="fa fa-user-circle-o"></i>
                <a href="#" id="account">Login</a>
            </span>
            <div id="drop-down-menu">
                <div class="drop-down-pointer"></div>
                <ul>
                    <li class="drop-down-list"><a href="setting.html"><i class="fa fa-cog"></i>Setting</a></li>
                    <hr>
                    <li class="drop-down-list"><a id="logout" href="index.html"><i class="fa fa-sign-out"></i>Log Out</a></li>
                </ul>
            </div>
        </span>
    </header>
    <section id="form">
        <div class="pop-up-window">
            <i id="close-button" class="fa fa-times"></i>
            <div class="form-title">
                <input type="radio" name="slider" id="login-label" checked>
                <label for="login-label" class="title-label login">
                    <h1>Log In</h1>
                </label>
                <input type="radio" name="slider" id="signup-label">
                <label for="signup-label" class="title-label signup">
                    <h1>Sign Up</h1>
                </label>
                <span class="title-border"></span>
            </div>
            <div id="form-container">
                <form>
                    <div class="alert" id="alert-login">Welcome Back</div>
                    <div class="field">
                        <div class="i">
                            <i class="fa fa-envelope"></i>
                        </div>
                        <div>
                            <input class="text-input" id="email-login" type="email" placeholder=" " required=true>
                            <h4 class="input-label">Email</h4>
                        </div>
                    </div>
                    <div class="field">
                        <div class="i">
                            <i class="fa fa-lock"></i>
                        </div>
                        <div>
                            <input class="text-input" id="password-login" type="password" placeholder=" " required=true>
                            <h4 class="input-label">Password</h4>
                        </div>
                    </div>
                    <button id="onLogin" class="button">Log In</button>
                    <div id="forgot">
                        <a href="#">Forgot Password</a>
                    </div>
                </form>
                <form>
                    <div class="alert" id="alert-signup">Welcome to Maquilla</div>
                    <div class="field">
                        <div class="i">
                            <i class="fa fa-envelope"></i>
                        </div>
                        <div>
                            <input class="text-input" id="email-signup" type="email" placeholder=" " required=true>
                            <h4 class="input-label">Email</h4>
                        </div>
                    </div>
                    <div class="field">
                        <div class="i">
                            <i class="fa fa-lock"></i>
                        </div>
                        <div>
                            <input class="text-input" id="password-signup" type="password" placeholder=" " required=true>
                            <h4 class="input-label">Password</h4>
                        </div>
                    </div>
                    <div class="field">
                        <div class="i">
                            <i class="fa fa-lock"></i>
                        </div>
                        <div>
                            <input class="text-input password" id="password-confirm" type="password" placeholder=" " required=true>
                            <h4 class="input-label">Confirm Password</h4>
                        </div>
                    </div>
                    <button id="onSignup" class="button">Sign Up</button>
                </form>
            </div>
        </div>
    </section>
    `

class NavBar extends HTMLElement {
    constructor(){
        super();
        this.attachShadow({mode:'open'});
        const shadowRoot = this.shadowRoot;
        shadowRoot.appendChild(template.content);

        getDownloadURL(ref(storage, 'images/Maquilla.png')).then((url)=>{
            shadowRoot.getElementById("icon").setAttribute('src', url);
        });

        const navbar = shadowRoot.getElementById("navbar");
        var lastScrollTop = 0;

        window.addEventListener("scroll", ()=>{
            var scrollTop = window.pageYOffset;
            var opacity = navbar.style.opacity;
            if (scrollTop >= lastScrollTop){
                opacity = 0;
                navbar.style.visibility = "hidden";
            }
            else{
                opacity = 1.0;
                    navbar.style.visibility = "visible";
                if(scrollTop>0){
                    navbar.style.backgroundColor = "#ffffff99";
                }
                else{
                    navbar.style.background = "none";
                }
            }
            lastScrollTop = scrollTop;
            navbar.style.opacity = opacity;
        });        

        const auth = getAuth();
        const account = shadowRoot.getElementById("account-tab");
        const form = shadowRoot.getElementById("form");

        auth.onAuthStateChanged(currentUser => {
            const user = currentUser;
            if(user && user.emailVerified){
                let displayName = user.displayName;
                if (displayName == null){
                    location.href = "setting.html";
                }
                else{
                    shadowRoot.getElementById("account").textContent = displayName;
                    shadowRoot.getElementById("drop-down-menu").style.display = "block";
                    account.onclick = (()=>{location.href = "profile.html";});
                }
            }
            else{
                shadowRoot.getElementById("drop-down-menu").style.display = "none";
                account.onclick = (()=>{
                    form.style.visibility = "visible";
                    form.style.opacity = "1";
                    form.style.transition = "visibility 0s, opacity 0.5s";
                });
            }
        })

        this.shadowRoot.getElementById("logout").onclick = (() => {
            signOut(auth);
        });

        this.shadowRoot.getElementById("close-button").onclick = (() => {
            form.style.visibility = "hidden";
            form.style.opacity = 0;
            form.style.transition = ".2s";
        });

        const alertLogin = shadowRoot.getElementById("alert-login");

        shadowRoot.getElementById("onLogin").onclick = ((e)=>{
            e.preventDefault();
            let emailLogin = shadowRoot.getElementById("email-login").value;
            let passwordLogin = shadowRoot.getElementById("password-login").value;

            if(emailLogin == ""){
                alertLogin.textContent = "Please enter your email";
            }
            else if(passwordLogin == ""){
                alertLogin.textContent = "Please enter your password";
            }
            else{
                signInWithEmailAndPassword(auth, emailLogin, passwordLogin)
                .then((userCredential) => {
                    const user = userCredential.user;
                    if(user.emailVerified)
                    location.href = "setting.html";
                    else{
                        sendEmailVerification(user)
                        .then(() => {
                            alertLogin.textContent = "Please verify your email"
                        });
                    }
                })
                .catch((error) => {
                    switch(error.code){
                        case "auth/user-not-found":
                            alertLogin.textContent = "User not found";
                            break;
                        case "auth/invalid-email":
                            alertLogin.textContent = "Invalid email";
                            break;
                        case "auth/wrong-password":
                            alertLogin.textContent = "Wrong password, please try again";
                            break;
                        default:
                            alert(error.message);
                            break;
                    }
                });
            }
        });

        const alertSignup = shadowRoot.getElementById("alert-signup");

        shadowRoot.getElementById("onSignup").onclick = ((e)=>{
            e.preventDefault();
            let emailSignup = shadowRoot.getElementById("email-signup").value;
            let passwordSignup = shadowRoot.getElementById("password-signup").value;
            let passwordConfirm = shadowRoot.getElementById("password-confirm").value;
            if(emailSignup == ""){
                alertSignup.textContent = "Please enter your email";
            }
            else if(passwordSignup == ""){
                alertSignup.textContent = "Please enter your password";
            }
            else if(passwordConfirm == ""){
                alertSignup.textContent = "Please confirm your password";
            }
            else if(passwordSignup != passwordConfirm){
                alertSignup.textContent = "Passwords must be same"
            }
            else{
                createUserWithEmailAndPassword(auth, emailSignup, passwordSignup)
                .then((userCredential) => {
                    const user = userCredential.user;
                    sendEmailVerification(user)
                    .then(() => {
                        alertSignup.textContent = "Please verify your email"
                    });
                })
                .catch((error) => {
                    switch(error.code){
                        case "auth/email-already-in-use":
                            alertSignup.textContent = "Account exists, please log in";
                            break;
                        case "auth/invalid-email":
                            alertSignup.textContent = "Invalid email";
                            break;
                        case "auth/weak-password":
                            alertSignup.textContent = "Weak password, try again";
                            break;
                        default:
                            alert(error.message);
                            break;
                    }
                });
            }
        });

        const formContainer = this.shadowRoot.getElementById("form-container");

        shadowRoot.getElementById("login-label").onclick = (() => {
            formContainer.style.marginLeft = "0%";
            alertLogin.textContent = "Welcome Back";
        });

        shadowRoot.getElementById("signup-label").onclick = (() => {
            formContainer.style.marginLeft = "-100%";
            alertSignup.textContent = "Welcome to Maquilla";
        });
    }
}

window.customElements.define('nav-bar', NavBar);