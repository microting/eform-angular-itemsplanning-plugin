import loginPage from '../../Page objects/Login.page';
import myEformsPage from '../../Page objects/MyEforms.page';

import {expect} from 'chai';
import pluginsPage from './application-settings.plugins.page';
import applicationSettingsPage from '../../Page objects/ApplicationSettings.page';

describe('Application settings page - site header section', function () {
    before(function () {
      loginPage.open('/auth');
      loginPage.login();
    });
    it('should go to plugin settings page', function () {
       myEformsPage.Navbar.advancedDropdown();
       myEformsPage.Navbar.clickonSubMenuItem('Plugins');
       browser.pause(8000);

      const plugin = pluginsPage.getFirstPluginRowObj();
      expect(plugin.id).equal(1);
      expect(plugin.name).equal('Microting Items Planning Plugin');
      expect(plugin.version).equal('1.0.0.0');
      expect(plugin.status, 'Plugin must be deactivated').equal('Deaktiveret');
    });
    it('should activate the plugin', function () {
        // click on plugin settings
      pluginsPage.goToPluginSettings();
        // select activate
      const menu = pluginsPage.settingsMenu();
      menu.click();
      browser.pause(1000);
      const choices = browser.$$('.ng-option');
      choices[0].click();
      const saveBtn = browser.$('#saveBtn');
        // save changes
      saveBtn.click();
        // see that the plugin is marked active
      browser.pause(5000);
      const plugin = pluginsPage.getFirstPluginRowObj();
      expect(plugin.status, 'Plugin is not active').equal('Aktiveret');
        // validate that the items planning menu entry is now visible
      const itemsPlanningMenu = browser.$('#items-planning-pn');
      const itemsPlanningMenuText = itemsPlanningMenu.getText();
      expect(itemsPlanningMenuText, 'Items planning not present in header menu').equal( 'Enhedsplanlægning' );
      itemsPlanningMenu.click();
      browser.pause(2000);
      // validate that the lists item is present in plugins menu
      const itemsPlanningMenuLists = browser.$('#items-planning-pn-lists').getText();
      expect(itemsPlanningMenuLists, 'Lists not present in items planning menu').equal( 'Lister' );
      // validate that the lists item is present in plugins menu
      const itemsPlanningMenuSettings = browser.$('#items-planning-pn-settings').getText();
      expect(itemsPlanningMenuSettings, 'Settings not present in items planning menu').equal( 'Indstillinger' );
    });
});
