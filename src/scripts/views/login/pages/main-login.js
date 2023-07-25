import firebaseConfig from "../../../globals/firebaseConfig";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import AppHome from "../../home/app";


const mainLogin = {
    async render(){
        return `<!-- Outer Row -->
        <div class="row justify-content-center">

            <div class="col-xl-10 col-lg-12 col-md-9">

                <div class="card o-hidden border-0 shadow-lg my-5">
                    <div class="card-body p-0">
                        <!-- Nested Row within Card Body -->
                        <div class="row">
                        <br>
                        <br>
                            <div class="col-lg-6 d-none d-lg-block"><img src ="img/logo.png" style="display: block; margin-left: 5%; margin-right: auto; width: 100%; margin-top: 12%; margin-bottom: 12%;"></div>
                            <div class="col-lg-6">
                            <br>
                            <br>
                            <br>
                                <div class="p-5">
                                    <div class="text-center">
                                        <h1 class="h4 text-gray-900 mb-4">Welcome Back!</h1>
                                    </div>
                                    <form class="user" id='formLogin'>
                                        <div class="form-group">
                                            <input type="email" class="form-control form-control-user"
                                                id="InputEmail" aria-describedby="emailHelp"
                                                placeholder="Enter Email Address...">
                                        </div>
                                        <div class="form-group">
                                            <input type="password" class="form-control form-control-user"
                                                id="InputPassword" placeholder="Password">
                                        </div>
                                        <button type='submit' class="btn btn-primary btn-user btn-block" style="background-color:#302c34;">
                                            Login
                                        </button>
                                    </form>
                                    <hr>
                                    <div class="text-center">
                                        <a class="small" href="forgot-password.html">Forgot Password?</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </div>`
    },

    async afterRender(){
        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        console.log('auth:', auth.currentUser);

        
        const formLogin = document.getElementById('formLogin');
        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault()
            const InputEmail = document.getElementById('InputEmail').value;
            const InputPassword = document.getElementById('InputPassword').value;
            console.log('email:', InputEmail);
            console.log('password:', InputPassword);

            try {
                const userCredential = await signInWithEmailAndPassword(auth, InputEmail, InputPassword)
                console.log(userCredential);
                console.log('auth:', auth.currentUser);
                window.location.href = './';
                // location.reload();
            } catch (error) {
                console.log(error);
            }
            
        })

        // onAuthStateChanged(auth, (userCredential) => {
        // if (userCredential) {
        //     // User is signed in, see docs for a list of available properties
        //     // https://firebase.google.com/docs/reference/js/auth.user
        //     const uid = userCredential.uid;
        //     console.log(uid);
        //     // ...
        // } else {
        //     // User is signed out
        //     // ...
        // }
        // });
    }
}
export default mainLogin;