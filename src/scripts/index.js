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

if(!localStorage.getItem('user')) {
  window.location.href = '/login'
  
} else {

  const user = localStorage.getItem('user');
  const data = JSON.parse(user)
  const uid = data.id;

  const appHome = new AppHome({
    maincontent: document.querySelector('#mainhome')
  });
  
  window.addEventListener('hashchange', () => {
    appHome.renderPage();
  });
    
  window.addEventListener('load', () => {
    appHome.renderPage();
  });

  const userName = document.getElementById('userName');
  userName.innerText = data.name
  
  const btnLogout = document.getElementById('btnLogout');
  btnLogout.addEventListener('click', () => {
    localStorage.removeItem('user');
    location.reload();
  })

  if (data.role == 'admin') {
    const adminPage = document.getElementById('adminPage');
    adminPage.style.removeProperty('display')
  } else if (data.role == 'karyawan'){
    const daftarKaryawan = document.getElementById('nonAdminPage');
    daftarKaryawan.setAttribute('style', 'display:none;')
    const navBar = document.getElementById('navDashboard');
    navBar.innerText = 'Dashboard'
  }
}