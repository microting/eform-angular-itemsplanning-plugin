import {PageWithNavbarPage} from '../../Page objects/PageWithNavbar.page';

class ApplicationSettingsPluginsPage extends PageWithNavbarPage {
    constructor() {
        super();
    }

    getFirstPluginRowObj(): PluginRowObject {
        return new PluginRowObject(1);
    }


    goToPluginSettings() {
      browser.$('#plugin-settings-btn').click();
      browser.pause(3000);
    }

    settingsMenu() {
      return browser.$('#PluginDropDown');
    }

    getChoices() {
      return browser.$$('.ng-option');
    }
    saveChangesBtn() {
      browser.$('#saveBtn').click();
      browser.pause(3000);
    }
}


const pluginsPage = new ApplicationSettingsPluginsPage();
export default pluginsPage;

class PluginRowObject {
    constructor(rowNum) {
        if ($$('#plugin-id')[rowNum - 1]) {
            this.id = +$$('#plugin-id')[rowNum - 1].getText();
            this.name = $$('#plugin-name')[rowNum - 1].getText();
            this.version = $$('#plugin-version')[rowNum - 1].getText();
            this.status = $$('#plugin-status')[rowNum - 1].getText();
            this.settingsBtn = $$('#plugin-settings-btn')[rowNum - 1].getText();
        }
    }

    id: number;
    name;
    version;
    status;
    settingsBtn;
}
