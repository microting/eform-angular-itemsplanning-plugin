import loginPage from '../../Page objects/Login.page';
import itemsPlanningListPage, {ListRowObject} from '../../Page objects/ItemsPlanning/ItemsPlanningList.page';
import itemsPlanningModalPage from '../../Page objects/ItemsPlanning/ItemsPlanningModal.page';

const expect = require('chai').expect;

describe('Items planning actions', function () {
    before(function () {
        loginPage.open('/auth');
        loginPage.login();
        itemsPlanningListPage.goToListsPage();
    });
    it ('should delete existing list', function () {
        browser.pause(10000);
        let listRowObject = new ListRowObject(itemsPlanningListPage.rowNum());
        listRowObject.clickDeleteList();
        itemsPlanningModalPage.listDeleteDeleteBtn.click();
        browser.pause(5000);
        listRowObject = new ListRowObject(1);
        expect(listRowObject.id === null, 'List is not deleted');
    });
});
