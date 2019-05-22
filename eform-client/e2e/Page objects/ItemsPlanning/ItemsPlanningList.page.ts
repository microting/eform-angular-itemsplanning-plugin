import Page from '../Page';
import itemsPlanningModalPage from '../../Page objects/ItemsPlanning/ItemsPlanningModal.page';
import {PageWithNavbarPage} from '../PageWithNavbar.page';
import {Guid} from 'guid-typescript';

export class ItemsPlanningListPage extends PageWithNavbarPage {
  constructor() {
    super();
  }

  public rowNum(): number {
    return browser.$$('#tableBody > tr').length;
  }

  public clickIdTableHeader() {
    browser.$('#idTableHeader').click();
    browser.pause(4000);
  }

  public clickNameTableHeader() {
    browser.$('#nameTableHeader').click();
    browser.pause(4000);
  }

  public clickDescriptionTableHeader() {
    browser.$('#descriptionTableHeader').click();
    browser.pause(4000);
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
    this.itemPlanningButton.click();
    browser.pause(5000);
    this.listsButton.click();
    browser.pause(5000);
  }

  public createDummyLists() {
    for (let i = 0; i < 3; i++) {
      this.listCreateBtn.click();
      browser.pause(2000);

      itemsPlanningModalPage.createListItemName.setValue(Guid.create().toString());
      itemsPlanningModalPage.createListDescription.setValue(Guid.create().toString());
      itemsPlanningModalPage.listCreateSaveBtn.click();
      browser.pause(3000);
    }
  }

  public clearTable() {
    const rowCount = itemsPlanningListPage.rowNum();
    for (let i = 1; i <= rowCount; i++) {
      const listRowObject = new ListRowObject(1);
      listRowObject.clickDeleteList();
      itemsPlanningModalPage.listDeleteDeleteBtn.click();
      browser.pause(3000);
    }
  }
}

const itemsPlanningListPage = new ItemsPlanningListPage();
export default itemsPlanningListPage;

export class ListRowObject {
  constructor(rowNumber) {
    this.id = $$('#listId')[rowNumber - 1].getText();
    this.name = $$('#listName')[rowNumber - 1].getText();
    this.description = $$('#listDescription')[rowNumber - 1].getText();
    this.updateBtn = $$('#updateListBtn')[rowNumber - 1];
    this.deleteBtn = $$('#deleteListBtn')[rowNumber - 1];
  }

  public id;
  public name;
  public description;
  public updateBtn;
  public deleteBtn;

  public clickDeleteList() {
    this.deleteBtn.click();
    browser.pause(2000);
  }

  public clickUpdateList() {
    this.updateBtn.click();
    browser.pause(3000);
  }
}

