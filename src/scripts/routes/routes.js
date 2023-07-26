// import dashboardHome from "../../views/dashboard/pages/dashboard";
// import accountsAdmin from "../../views/home/pages/akun";
// import dashboardAdmin from "../../views/home/pages/dashboard";
// import dataAdmin from "../../views/home/pages/data";
// import editData from "../../views/home/pages/editData";
// import editMenu from "../../views/home/pages/editMenu";
// import menuAdmin from "../../views/home/pages/menu";
// import profil from "../../views/home/pages/profil";

// import detailPage from "../views/home/pages/detail";
// import editPassword from "../views/home/pages/editPassword";
// import editProfile from "../views/home/pages/editProfile";
// import favourite from "../views/home/pages/favourite";
import adminPage from "../views/home/pages/adminpage";
import homePage from "../views/home/pages/homepage";
import mainLogin from "../views/login/pages/main-login";

// import otherProfile from "../views/home/pages/otherProfile";
// import profile from "../views/home/pages/profile";
// import profileMod from "../views/home/pages/profileMod";
// import reviewed from "../views/home/pages/reviewed";
// import searchPage from "../views/home/pages/search";
// import mainLogin from "../views/login/pages/main-login";
// import mainRegister from "../views/register/pages/main-register";



// // Register routes
// const registerRoutes = {
//   '/': mainRegister,
// };

// Login routes
const loginRoutes ={
  '/': mainLogin
};

const homeRoutes = {
  '/': homePage,
  '/admin': adminPage,
  // '/profile': profile,
  // '/profile/:id': otherProfile,
  // '/editprofile': editProfile,
  // '/profilemod': profileMod,
  // '/favourite': favourite,
  // '/reviewed': reviewed,
  // '/search': searchPage,
  // '/search/:id': searchPage,
  // '/detail/:id':detailPage,
  // '/editpassword': editPassword,
  // '/editdata/:id': 'dsd',
}

export {
  homeRoutes, loginRoutes
};
