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
      console.log('homepage route:',page);
      this._maincontent.innerHTML = await page.render();
      await page.afterRender();
    } catch (error) {
      this._maincontent.innerHTML = `<h1>${error}</h1>`;
    }
  }
}

export default AppHome;
