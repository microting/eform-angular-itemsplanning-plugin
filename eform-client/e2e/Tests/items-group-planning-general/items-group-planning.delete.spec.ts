import loginPage from '../../Page objects/Login.page';
import itemsGroupPlanningListPage, {ListRowObject} from '../../Page objects/ItemsGroupPlanning/ItemsGroupPlanningList.page';
import itemsGroupPlanningModalPage from '../../Page objects/ItemsGroupPlanning/ItemsGroupPlanningModal.page';

const expect = require('chai').expect;

describe('Items group planning actions', function () {
    before(function () {
        loginPage.open('/auth');
        loginPage.login();
        itemsGroupPlanningListPage.goToListsPage();
    });
  it('should should create List', function () {
    itemsGroupPlanningListPage.listCreateBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    const listData = {
      name: 'Test list',
      template: 'Number 1',
      description: 'Description',
      repeatEvery: '1',
      repeatType: '1',
      repeatUntil: '5/15/2020'
    };
    itemsGroupPlanningModalPage.createList(listData);
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  });
  it ('should delete existing list', function () {
        $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});

        let listRowObject = new ListRowObject(itemsGroupPlanningListPage.rowNum());
        listRowObject.clickDeleteList();
        itemsGroupPlanningModalPage.listDeleteDeleteBtn.click();
        $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
        listRowObject = new ListRowObject(1);
        expect(listRowObject.id === null, 'List is not deleted');
    });
});
