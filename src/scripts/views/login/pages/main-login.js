import firebaseConfig from "../../../globals/firebaseConfig";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { getFirestore, getDocs, setDoc, collection, query, where, doc, updateDoc } from "firebase/firestore";
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
                            <div class="col-lg-6 d-none d-lg-block"><img src ="../img/logo.png" style="display: block; margin-left: 5%; margin-right: auto; width: 100%; margin-top: 12%; margin-bottom: 12%;"></div>
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
        const db = getFirestore(app);

        
        const formLogin = document.getElementById('formLogin');
        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault()
            const InputEmail = document.getElementById('InputEmail').value;
            const InputPassword = document.getElementById('InputPassword').value;
            
            // get Date
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();
            today = dd + '-' + mm + '-' + yyyy;
            
            let user = '';
            const q = query(collection(db, "user"), where("email", "==", InputEmail))
            const querySnapshot = await getDocs(q)
            if (querySnapshot.size > 0) {
                querySnapshot.forEach((doc) => {
                    user = doc.data();
                    user.id = doc.id;
                })

                if (user.password == InputPassword) { // Login user
                    const dataToDB = {
                        id: user.id,
                        role: user.role,
                        last_login: today,
                        email: user.email,
                        name: user.name,
                    }
                    await updateDoc(doc(db,"user", user.id), {
                        last_login: today,
                    })
        
                    localStorage.setItem('user', JSON.stringify(dataToDB))
        
                    Swal.fire({
                        icon: 'success',
                        title: 'Login Berhasil',
                        text: 'Selamat login anda berhasil',
                        showCloseButton: true,
                        }).then((result) => {
                            /* Read more about isConfirmed, isDenied below */
                            if (result.isConfirmed) {
                                window.location.href = '../#/';
                            } 
                        })
                } else{
                    Swal.fire({
                        icon: 'error',
                        title: 'Login Gagal',
                        text: 'Pastikan data yang anda masukkan benar',
                        showCloseButton: true,
                        allowOutsideClick: false
                        })
                }
            }
        })


    }
}
export default mainLogin;