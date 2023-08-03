import 'regenerator-runtime';
import AppLogin from './views/login/app';

// import swRegister from './utils/sw-register';
// import 'lazysizes';
// import 'lazysizes/plugins/parent-fit/ls.parent-fit';
 
// const START = 10;
// const NUMBER_OF_IMAGES = 100;


if(localStorage.getItem('user')) {
  window.location.href='./'
}

const appLogin = new AppLogin({
  maincontent: document.querySelector('#mainlogin')
});

window.addEventListener('hashchange', () => {
    console.log('hash');
    appLogin.renderPage();
  });
  
  window.addEventListener('load', () => {
    appLogin.renderPage();
    console.log('load');
    // swRegister();
  });


// // Search Function
// const searchText = document.getElementById('searchText');
// searchText.addEventListener('keydown', (e) => {
//   // console.log(e);
//   if (e.keyCode == 13)  {
//     searchText.value;
//     e.preventDefault()
//     // console.log(searchText.value);
//     window.location.href = `#/search/${searchText.value}`
//   }
// })

// // Navbar Hamburger
// const hamburgerButton = document.getElementById('hamburger');
// const navbarContents = document.getElementById('navbar');
// hamburgerButton.addEventListener('click', (e) => {
//   const hamburgerAtrributes = hamburgerButton.getAttribute('class')
//   // console.log(hamburgerAtrributes);
//   hamburgerButton.setAttribute('class', 'menu-trigger active')
//   navbarContents.setAttribute('style', 'display: block;')
//   if (hamburgerAtrributes == 'menu-trigger active') {
//     hamburgerButton.setAttribute('class', 'menu-trigger')
//     navbarContents.setAttribute('style', 'display: none;')
//   }
// })