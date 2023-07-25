/* eslint-disable class-methods-use-this */
import { homeNav, homeRoutes } from '../../routes/routes';
import UrlParser from '../../routes/url-parser';

class AppHome {
  constructor({ maincontent }) {
    this._maincontent = maincontent;
  }

  async renderPage() {
    try {
      const url = UrlParser.parseActiveUrlWithCombiner();
      const page = homeRoutes[url];
      this._maincontent.innerHTML = await page.render();
      var btns = document.getElementsByClassName('navbtn')
      for (var i = 0; i < btns.length; i++) {
        btns[i].addEventListener("click", function() {
        var current = document.getElementsByClassName("active");
        current[0].className = current[0].className.replace(" active", "");
        this.className += " active";
        });
      }
      await page.afterRender();
    } catch (error) {
      this._maincontent.innerHTML = `<h1>${error}</h1>`;
    }
  }
}

export default AppHome;
