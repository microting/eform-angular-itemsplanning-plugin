import loginPage from '../../Page objects/Login.page';
import itemsGroupPlanningListPage, {ListRowObject} from '../../Page objects/ItemsGroupPlanning/ItemsGroupPlanningList.page';
import itemsGroupPlanningModalPage from '../../Page objects/ItemsGroupPlanning/ItemsGroupPlanningModal.page';

const expect = require('chai').expect;

describe('Items group planning actions', function () {
    before(function () {
        loginPage.open('/auth');
        loginPage.login();
        const newEformLabel = 'Number 1';
        itemsGroupPlanningListPage.createNewEform(newEformLabel);
        itemsGroupPlanningListPage.goToListsPage();
    });
    it ('should create list with all fields', function () {
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
        // Check that list is created in table
        const listRowObject = new ListRowObject(itemsGroupPlanningListPage.rowNum());
        expect(listRowObject.name, 'Name in table is incorrect').equal(listData.name);
        expect(listRowObject.description, 'Description in table is incorrect').equal(listData.description);
        // Check that all list fields are saved
        listRowObject.clickUpdateList();
        expect(itemsGroupPlanningModalPage.editListItemName.getValue(), 'Saved Name is incorrect').equal(listData.name);
        expect(itemsGroupPlanningModalPage.editListSelectorValue.getText(), 'Saved Template is incorrect').equal(listData.template);
        expect(itemsGroupPlanningModalPage.editListDescription.getValue(), 'Saved Description is incorrect').equal(listData.description);
        expect(itemsGroupPlanningModalPage.editRepeatEvery.getValue(), 'Saved Repeat Every is incorrect').equal(listData.repeatEvery);
        const repeatUntil = new Date(listData.repeatUntil);
        const repeatUntilSaved = new Date(itemsGroupPlanningModalPage.editRepeatUntil.getValue());
        expect(repeatUntilSaved.getDate(), 'Saved Repeat Until is incorrect').equal(repeatUntil.getDate());
        //
        $('#editRepeatType').click();
        $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
        const editRepeatTypeSelected = $$('#editRepeatType .ng-option')[listData.repeatType];
        expect(editRepeatTypeSelected.getAttribute('class'), 'Saved Repeat Type is incorrect').contains('ng-option-selected');
        itemsGroupPlanningModalPage.listEditCancelBtn.click();
        $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
        listRowObject.clickDeleteList();
        itemsGroupPlanningModalPage.listDeleteDeleteBtn.click();
        $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    });
});
