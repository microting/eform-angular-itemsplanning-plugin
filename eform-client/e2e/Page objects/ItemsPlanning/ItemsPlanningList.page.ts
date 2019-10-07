import Page from '../Page';
import itemsPlanningModalPage from './ItemsPlanningModal.page';
import {PageWithNavbarPage} from '../PageWithNavbar.page';
import {Guid} from 'guid-typescript';
import XMLForEformFractions from '../../Constants/XMLForEformFractions';

export class ItemsPlanningListPage extends PageWithNavbarPage {
  constructor() {
    super();
  }

  public rowNum(): number {
    return browser.$$('#tableBody > tr').length;
  }
  public get newEformBtn() {
    return browser.element('#newEFormBtn');
  }
  public get xmlTextArea() {
    return browser.element('#eFormXml');
  }
  public get createEformBtn() {
    return browser.element('#createEformBtn');
  }
  public get createEformTagSelector() {
    return browser.element('#createEFormMultiSelector');
  }
  public get createEformNewTagInput() {
    return browser.element('#addTagInput');
  }
  public clickIdTableHeader() {
    browser.element(`//*[contains(@id, 'idTableHeader')]`).click();
    browser.pause(5000);
  }

  public clickNameTableHeader() {
    browser.element(`//*[contains(@id, 'nameTableHeader')]`).click();
    browser.pause(5000);
  }

  public clickDescriptionTableHeader() {
    browser.element(`//*[contains(@id, 'descriptionTableHeader')]`).click();
    browser.pause(5000);
  }

  public getListValue(selector: any, row: number) {
    if (selector === 'listId') {
      return  parseInt( $('#tableBody').$(`tr:nth-child(${row})`).$('#' + selector).getText(), 10);
    } else {
      return $('#tableBody').$(`tr:nth-child(${row})`).$('#' + selector).getText();
    }
  }

  public get itemPlanningButton() {
    return browser.element('#items-planning-pn');
  }

  public get listCreateBtn() {
    return browser.element('#listCreateBtn');
  }

  public get listsButton() {
    return browser.element('#items-planning-pn-lists');
  }

  public goToListsPage() {
    browser.pause(5000);
    this.itemPlanningButton.click();
    browser.pause(5000);
    this.listsButton.click();
    browser.pause(10000);
  }

  public createDummyLists() {
    for (let i = 0; i < 3; i++) {
      this.listCreateBtn.click();
      itemsPlanningModalPage.createListItemName.setValue(Guid.create().toString());
      itemsPlanningModalPage.createListDescription.setValue(Guid.create().toString());
      browser.pause(5000);
      itemsPlanningModalPage.createListSelector.addValue('Number 1');
      browser.pause(2000);
      itemsPlanningModalPage.createListSelectorOption.click();
      itemsPlanningModalPage.createRepeatEvery.setValue(1);
      itemsPlanningModalPage.selectCreateRepeatType(1);
      itemsPlanningModalPage.createRepeatUntil.setValue('5/15/2020');
      itemsPlanningModalPage.listCreateSaveBtn.click();
      browser.pause(10000);
    }
  }

  public clearTable() {
    const rowCount = itemsPlanningListPage.rowNum();
    for (let i = 1; i <= rowCount; i++) {
      const listRowObject = new ListRowObject(1);
      listRowObject.clickDeleteList();
      itemsPlanningModalPage.listDeleteDeleteBtn.click();
      browser.pause(5000);
    }
  }
  createNewEform(eFormLabel, newTagsList = [], tagAddedNum = 0) {
    this.newEformBtn.click();
    browser.pause(5000);
    // Create replaced xml and insert it in textarea
    const xml = XMLForEformFractions.XML.replace('TEST_LABEL', eFormLabel);
    browser.execute(function (xmlText) {
      (<HTMLInputElement>document.getElementById('eFormXml')).value = xmlText;
    }, xml);
    this.xmlTextArea.addValue(' ');
    // Create new tags
    const addedTags: string[] = newTagsList;
    if (newTagsList.length > 0) {
      this.createEformNewTagInput.setValue(newTagsList.join(','));
      browser.pause(5000);
    }
    // Add existing tags
    const selectedTags: string[] = [];
    if (tagAddedNum > 0) {
      browser.pause(5000);
      for (let i = 0; i < tagAddedNum; i++) {
        this.createEformTagSelector.click();
        const selectedTag = $('.ng-option:not(.ng-option-selected)');
        selectedTags.push(selectedTag.getText());
        console.log('selectedTags is ' + JSON.stringify(selectedTags));
        selectedTag.click();
        browser.pause(5000);
      }
    }
    this.createEformBtn.click();
    browser.pause(14000);
    return {added: addedTags, selected: selectedTags};
  }
}

const itemsPlanningListPage = new ItemsPlanningListPage();
export default itemsPlanningListPage;

export class ListRowObject {
  constructor(rowNumber) {
    if ($$('#listId')[rowNumber - 1]) {
      try {
        this.name = $$('#listName')[rowNumber - 1].getText();
      } catch (e) {}
      try {
        this.description = $$('#listDescription')[rowNumber - 1].getText();
      } catch (e) {}
      try {
        this.updateBtn = $$('#updateListBtn')[rowNumber - 1];
      } catch (e) {}
      try {
        this.deleteBtn = $$('#deleteListBtn')[rowNumber - 1];
      } catch (e) {}
    }
  }

  public id;
  public name;
  public description;
  public updateBtn;
  public deleteBtn;

  public clickDeleteList() {
    this.deleteBtn.click();
    browser.pause(5000);
  }

  public clickUpdateList() {
    this.updateBtn.click();
    browser.pause(5000);
  }
}

