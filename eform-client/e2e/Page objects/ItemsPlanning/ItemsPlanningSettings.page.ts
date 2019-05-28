import Page from '../Page';

export class ItemsPlanningSettingsPage extends Page {
  constructor() {
    super();
  }

  public get saveSettingsBtn() {
    return browser.$('#saveBtn');
  }

  public get sdkConnectionString() {
    return browser.$('#sdkConnectionString');
  }

  public get logLevel() {
    return browser.$('#logLevel');
  }

  public get logLimit() {
    return browser.$('#logLimit');
  }

  public get maxParallelism() {
    return browser.$('#maxParallelism');
  }

  public get numberOfWorkers() {
    return browser.$('#numberOfWorkers');
  }

  public get itemsPlanningBtn() {
    return browser.$('#items-planning-pn');
  }

  public get itemsPlanningSettingsBtn() {
    return browser.$('#items-planning-pn-settings');
  }

  public goToSettingsPage() {
    this.itemsPlanningBtn.click();
    browser.pause(5000);
    this.itemsPlanningSettingsBtn.click();
    browser.pause(10000);
  }

  public saveSettings(data: any) {
    this.sdkConnectionString.setValue(data.sdkConnectionString);
    this.logLevel.setValue(data.logLevel);
    this.logLimit.setValue(data.logLimit);
    this.maxParallelism.setValue(data.maxParallelism);
    this.numberOfWorkers.setValue(data.numberOfWorkers);
    this.saveSettingsBtn.click();
    browser.pause(6000);
  }

  public getSettings() {
    return new ItemsPlanningSettings();
  }
}

const itemsPlanningSettingsPage = new ItemsPlanningSettingsPage();
export default itemsPlanningSettingsPage;

export class ItemsPlanningSettings {
  constructor() {
    this.sdkConnectionString = itemsPlanningSettingsPage.sdkConnectionString.getValue();
    this.logLevel = itemsPlanningSettingsPage.logLevel.getValue();
    this.logLimit = itemsPlanningSettingsPage.logLimit.getValue();
    this.maxParallelism = itemsPlanningSettingsPage.maxParallelism.getValue();
    this.numberOfWorkers = itemsPlanningSettingsPage.numberOfWorkers.getValue();
  }

  public sdkConnectionString;
  public logLevel;
  public logLimit;
  public maxParallelism;
  public numberOfWorkers;
}
