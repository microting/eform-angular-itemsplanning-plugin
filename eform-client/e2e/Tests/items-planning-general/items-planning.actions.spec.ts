import loginPage from '../../Page objects/Login.page';
import itemsPlanningListPage, {ListRowObject} from '../../Page objects/ItemsPlanningList.page';
import itemsPlanningModalPage from '../../Page objects/ItemsPlanningModal.page';

const expect = require('chai').expect;

describe('Items planning actions', function () {
  before(function () {
    loginPage.open('/auth');
    loginPage.login();
    itemsPlanningListPage.goToListsPage();
  });
  it ('should create list with all fields', function () {
    itemsPlanningListPage.listCreateBtn.click();
    browser.pause(3000);
    const listData = {
      name: 'Test list',
      template: '',
      description: 'Description',
      repeatEvery: '1',
      repeatType: '1',
      repeatOn: '1',
      repeatUntil: '5/15/2020'
    };
    itemsPlanningModalPage.createList(listData);
    // Check that list is created in table
    const listRowObject = new ListRowObject(itemsPlanningListPage.rowNum());
    expect(listRowObject.name, 'Name in table is incorrect').equal(listData.name);
    expect(listRowObject.description, 'Description in table is incorrect').equal(listData.description);
    // Check that all list fields are saved
    listRowObject.clickUpdateList();
    expect(itemsPlanningModalPage.editListItemName.getValue(), 'Saved Name is incorrect').equal(listData.name);
    expect(itemsPlanningModalPage.editListSelector.getValue(), 'Saved Template is incorrect').equal(listData.template);
    expect(itemsPlanningModalPage.editListDescription.getValue(), 'Saved Description is incorrect').equal(listData.description);
    expect(itemsPlanningModalPage.editRepeatEvery.getValue(), 'Saved Repeat Every is incorrect').equal(listData.repeatEvery);
    expect(itemsPlanningModalPage.editRepeatUntil.getValue(), 'Saved Repeat Until is incorrect').equal(listData.repeatUntil);

    browser.element('#editRepeatType').click();
    browser.pause(2000);
    const editRepeatTypeSelected = browser.$$('#editRepeatType .ng-option')[listData.repeatType];
    expect(editRepeatTypeSelected.getAttribute('class'), 'Saved Repeat Type is incorrect').contains('ng-option-selected');

    browser.element('#editRepeatOn').click();
    browser.pause(2000);
    const editRepeatOnSelected = browser.$$('#editRepeatOn .ng-option')[listData.repeatOn];
    expect(editRepeatOnSelected.getAttribute('class'), 'Saved Repeat On is incorrect').contains('ng-option-selected');
    itemsPlanningModalPage.listEditCancelBtn.click();
  });
  it ('should change all fields after edit', function () {
    browser.pause(3000);
    let listRowObject = new ListRowObject(itemsPlanningListPage.rowNum());
    listRowObject.clickUpdateList();
    const listData = {
      name: 'Test list 2',
      template: '',
      description: 'Description 2',
      repeatEvery: '2',
      repeatType: '2',
      repeatOn: '2',
      repeatUntil: '5/15/2023'
    };
    itemsPlanningModalPage.editList(listData);
    // Check that list is edited successfully in table
    listRowObject = new ListRowObject(itemsPlanningListPage.rowNum());
    expect(listRowObject.name, 'Name in table is incorrect').equal(listData.name);
    expect(listRowObject.description, 'Description in table is incorrect').equal(listData.description);
    // Check that all list fields are saved
    listRowObject.clickUpdateList();
    expect(itemsPlanningModalPage.editListItemName.getValue(), 'Saved Name is incorrect').equal(listData.name);
    expect(itemsPlanningModalPage.editListSelector.getValue(), 'Saved Template is incorrect').equal(listData.template);
    expect(itemsPlanningModalPage.editListDescription.getValue(), 'Saved Description is incorrect').equal(listData.description);
    expect(itemsPlanningModalPage.editRepeatEvery.getValue(), 'Saved Repeat Every is incorrect').equal(listData.repeatEvery);
    expect(itemsPlanningModalPage.editRepeatUntil.getValue(), 'Saved Repeat Until is incorrect').equal(listData.repeatUntil);

    browser.element('#editRepeatType').click();
    browser.pause(2000);
    const editRepeatTypeSelected = browser.$$('#editRepeatType .ng-option')[listData.repeatType];
    expect(editRepeatTypeSelected.getAttribute('class'), 'Saved Repeat Type is incorrect').contains('ng-option-selected');

    browser.element('#editRepeatOn').click();
    browser.pause(2000);
    const editRepeatOnSelected = browser.$$('#editRepeatOn .ng-option')[listData.repeatOn];
    expect(editRepeatOnSelected.getAttribute('class'), 'Saved Repeat On is incorrect').contains('ng-option-selected');
    itemsPlanningModalPage.listEditCancelBtn.click();
  });
  it ('should delete existing list', function () {
    browser.pause(3000);
    let listRowObject = new ListRowObject(itemsPlanningListPage.rowNum());
    listRowObject.clickDeleteList();
    itemsPlanningModalPage.listDeleteDeleteBtn.click();
    browser.pause(3000);
    listRowObject = new ListRowObject(1);
    expect(listRowObject.id === null, 'List is not deleted');
  });
});
