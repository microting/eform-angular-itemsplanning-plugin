import Page from '../Page';

export class ItemsPlanningModalPage extends Page {
  constructor() {
    super();
  }

  // Create page elements
  public get createListItemName() {
    return browser.element('#createListItemName');
  }

  public get createListSelector() {
    return browser.element('#createListSelector input');
  }

  public get createListDescription() {
    return browser.element('#createListDescription');
  }

  public get createRepeatEvery() {
    return browser.element('#createRepeatEvery');
  }

  public selectCreateRepeatType(n: number) {
    browser.element('#createRepeatType').click();
    browser.pause(5000);
    const choices = browser.$$('#createRepeatType .ng-option');
    choices[n].click();
    browser.pause(3000);
  }

  public selectCreateRepeatOn(n: number) {
    browser.element('#createRepeatOn').click();
    browser.pause(5000);
    const choices = browser.$$('#createRepeatOn .ng-option');
    choices[n].click();
    browser.pause(3000);
  }

  public get createRepeatUntil() {
    return browser.element('#createRepeatUntil');
  }

  public get listCreateSaveBtn() {
    return browser.element('#listCreateSaveBtn');
  }

  public get listCreateCancelBtn() {
    return browser.element('#listCreateCancelBtn');
  }

  // Edit page elements
  public get editListItemName() {
    return browser.element('#editListItemName');
  }

  public get editListSelector() {
    return browser.element('#editListSelector input');
  }

  public get editListDescription() {
    return browser.element('#editListDescription');
  }

  public get editRepeatEvery() {
    return browser.element('#editRepeatEvery');
  }

  public selectEditRepeatType(n: number) {
    browser.element('#editRepeatType').click();
    browser.pause(5000);
    const choices = browser.$$('#editRepeatType .ng-option');
    choices[n].click();
    browser.pause(3000);
  }

  public selectEditRepeatOn(n: number) {
    browser.element('#editRepeatOn').click();
    browser.pause(5000);
    const choices = browser.$$('#editRepeatOn .ng-option');
    choices[n].click();
    browser.pause(3000);
  }

  public get editRepeatUntil() {
    return browser.element('#editRepeatUntil');
  }

  public get listEditSaveBtn() {
    return browser.element('#listEditSaveBtn');
  }

  public get listEditCancelBtn() {
    return browser.element('#listEditCancelBtn');
  }

  // Add item elements
  public get addItemBtn() {
    return browser.element('#addItemBtn');
  }

  // Delete page elements
  public get listDeleteDeleteBtn() {
    return browser.element('#listDeleteDeleteBtn');
  }

  public get listDeleteCancelBtn() {
    return browser.element('#listDeleteCancelBtn');
  }

  public createList(data: any) {
    this.createListItemName.setValue(data.name);
    this.createListSelector.setValue(data.template);
    this.createListDescription.setValue(data.description);
    this.createRepeatEvery.setValue(data.repeatEvery);
    this.selectCreateRepeatType(data.repeatType);
    this.selectCreateRepeatOn(data.repeatOn);
    this.createRepeatUntil.setValue(data.repeatUntil);
    this.listCreateSaveBtn.click();
    browser.pause(8000);
  }

  public editList(data: any) {
    this.editListItemName.setValue(data.name);
    this.editListSelector.setValue(data.template);
    this.editListDescription.setValue(data.description);
    this.editRepeatEvery.setValue(data.repeatEvery);
    this.selectEditRepeatType(data.repeatType);
    this.selectEditRepeatOn(data.repeatOn);
    this.editRepeatUntil.setValue(data.repeatUntil);
    this.listEditSaveBtn.click();
    browser.pause(8000);
  }

  public addNewItem() {
    this.addItemBtn.click();
    browser.pause(5000);
  }

}

const itemsPlanningModalPage = new ItemsPlanningModalPage();
export default itemsPlanningModalPage;

export class ListItemRowObject {
  constructor(rowNumber) {
    this.name = $$('#createItemName')[rowNumber - 1].getText();
    this.description = $$('#createItemDescription')[rowNumber - 1].getText();
    this.number = $$('#createItemNumber')[rowNumber - 1].getText();
    this.locationCode = $$('#createItemLocationCode')[rowNumber - 1].getText();
    this.deleteBtn = $$('#deleteItemBtn')[rowNumber - 1];
  }

  public name;
  public description;
  public number;
  public locationCode;
  public deleteBtn;

  public deleteItem() {
    this.deleteBtn.click();
    browser.pause(5000);
  }
}
