/* eslint-disable class-methods-use-this */
import { loginRoutes } from '../../routes/routes';
import UrlParser from '../../routes/url-parser';

class AppLogin {
  constructor({ maincontent }) {
    this._maincontent = maincontent;
  }

  async renderPage() {
    try {
      const url = UrlParser.parseActiveUrlWithCombiner();
      const page = loginRoutes[url];
      // console.log(page);
      this._maincontent.innerHTML = await page.render();

      await page.afterRender();
    } catch (error) {
      this._maincontent.innerHTML = `<h1>${error}</h1>`;
    }
  }
}

export default AppLogin;
