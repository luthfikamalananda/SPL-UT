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

onAuthStateChanged(auth, async (userCredential) => {
  console.log(userCredential);
  if (userCredential) {
    const uid = userCredential.uid;
    console.log(uid);
    
    const btnLogout = document.getElementById('btnLogout');
    btnLogout.addEventListener('click', () => {
        signOut(auth)
    })

    const docRef = doc(db, "user", uid);
    const docSnap = await getDoc(docRef);
    const role = docSnap.data().role
    console.log(role);

    if (role == 'admin') {
      const adminPage = document.getElementById('adminPage');
      adminPage.style.removeProperty('display')
      console.log('rtse');
    }


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
