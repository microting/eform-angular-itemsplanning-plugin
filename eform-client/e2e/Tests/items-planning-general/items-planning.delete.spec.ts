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
        browser.pause(5000);
        itemsPlanningListPage.listCreateBtn.click();
        browser.pause(6000);
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
        browser.pause(5000);
        let listRowObject = new ListRowObject(itemsPlanningListPage.rowNum());
        listRowObject.clickDeleteList();
        itemsPlanningModalPage.listDeleteDeleteBtn.click();
        browser.pause(5000);
        listRowObject = new ListRowObject(1);
        expect(listRowObject.id === null, 'List is not deleted');
    });
});
