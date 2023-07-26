import 'regenerator-runtime';
import AppHome from './views/home/app';
import firebaseConfig from './globals/firebaseConfig';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile  } from "firebase/auth";
// import swRegister from './utils/sw-register';
// import 'lazysizes';
// import 'lazysizes/plugins/parent-fit/ls.parent-fit';
 
// const START = 10;
// const NUMBER_OF_IMAGES = 100;

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const appHome = new AppHome({
  maincontent: document.querySelector('#mainhome')
});

onAuthStateChanged(auth, (userCredential) => {
  console.log(userCredential);
  if (userCredential) {
    const uid = userCredential.uid;
    console.log(uid);
    
    const btnLogout = document.getElementById('btnLogout');
    btnLogout.addEventListener('click', () => {
        signOut(auth)
    })

    const userName = document.getElementById('userName');
    userName.innerText = userCredential.displayName

  } else {
    window.location.href = '/login';
    }
});

window.addEventListener('hashchange', () => {
  appHome.renderPage();
});
  
window.addEventListener('load', () => {
  appHome.renderPage();
  // swRegister();
});
