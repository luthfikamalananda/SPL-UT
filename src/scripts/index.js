import 'regenerator-runtime';
import AppHome from './views/home/app';
import firebaseConfig from './globals/firebaseConfig';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile  } from "firebase/auth";
// import swRegister from './utils/sw-register';
// import 'lazysizes';
// import 'lazysizes/plugins/parent-fit/ls.parent-fit';
 
// const START = 10;
// const NUMBER_OF_IMAGES = 100;

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const appHome = new AppHome({
  maincontent: document.querySelector('#mainhome')
});

window.addEventListener('hashchange', () => {
  appHome.renderPage();
});
  
window.addEventListener('load', () => {
  appHome.renderPage();
  // swRegister();
});

  if(localStorage.getItem('user')) {
    const user = localStorage.getItem('user');
    const data = JSON.parse(user)
    const uid = data.id;
    console.log(uid);

    const userName = document.getElementById('userName');
    userName.innerText = data.name
    
    const btnLogout = document.getElementById('btnLogout');
    btnLogout.addEventListener('click', () => {
      localStorage.removeItem('user');
      location.reload();
    })

    const docRef = doc(db, "user", uid);
    const docSnap = await getDoc(docRef);
    const role = docSnap.data().role
    console.log(role);

    if (role == 'admin') {
      const adminPage = document.getElementById('adminPage');
      adminPage.style.removeProperty('display')
    }

  } else {
    window.location.href = '/login';
  }


