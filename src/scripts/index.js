import 'regenerator-runtime';
import AppHome from './views/home/app';
// import swRegister from './utils/sw-register';
// import 'lazysizes';
// import 'lazysizes/plugins/parent-fit/ls.parent-fit';
 
// const START = 10;
// const NUMBER_OF_IMAGES = 100;


// // Authentication
// const navFavourite = document.getElementById('favouriteNavLI');
// const navReview = document.getElementById('reviewedNavLI');
// const navProfile = document.getElementById('profileNav');
// if(localStorage.getItem('user')) {
//   const user = localStorage.getItem('user');
//   const data = JSON.parse(user)
//   document.getElementById('profileNav').innerHTML = ` ${data.nama.split(' ')[0]} <img src="assets/images/profile-header.jpg" alt="">`;
// } else if (localStorage.getItem('moderator')) {
//   const mod = localStorage.getItem('moderator');
//   const data = JSON.parse(mod)
//   document.getElementById('profileNav').innerHTML = ` ${data.nama.split(' ')[0]} <img src="assets/images/profile-header.jpg" alt="">`;
//   navFavourite.setAttribute('style', 'display: none;')
//   navReview.setAttribute('style', 'display: none;')
//   navProfile.setAttribute('href', '#/profilemod')
// } else {
//   navFavourite.setAttribute('style', 'display: none;')
//   navReview.setAttribute('style', 'display: none;')
//   navProfile.setAttribute('href', '/login')
// }

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