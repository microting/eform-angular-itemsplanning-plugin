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
    it ('should change all fields after edit', function () {
        browser.pause(6000);
        let listRowObject = new ListRowObject(itemsPlanningListPage.rowNum());
        listRowObject.clickUpdateList();
        const listData = {
            name: 'Test list 2',
            template: '',
            description: 'Description 2',
            repeatEvery: '2',
            repeatType: '1',
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
        const repeatUntil = new Date(listData.repeatUntil);
        const repeatUntilSaved = new Date(itemsPlanningModalPage.editRepeatUntil.getValue());
        expect(repeatUntilSaved.getDate(), 'Saved Repeat Until is incorrect').equal(repeatUntil.getDate());

        browser.element('#editRepeatType').click();
        browser.pause(5000);
        const editRepeatTypeSelected = browser.$$('#editRepeatType .ng-option')[listData.repeatType];
        expect(editRepeatTypeSelected.getAttribute('class'), 'Saved Repeat Type is incorrect').contains('ng-option-selected');

        itemsPlanningModalPage.listEditCancelBtn.click();
        browser.pause(5000);
    });
});
