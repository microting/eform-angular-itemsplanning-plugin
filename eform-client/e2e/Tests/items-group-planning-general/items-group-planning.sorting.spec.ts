import loginPage from '../../Page objects/Login.page';
import itemsGroupPlanningListPage from '../../Page objects/ItemsGroupPlanning/ItemsGroupPlanningList.page';
import {
  generateRandmString,
  testSorting,
} from '../../Helpers/helper-functions';
import myEformsPage from '../../Page objects/MyEforms.page';

const templateName = generateRandmString();

describe('Items group planning lists table sorting', function () {
  before(function () {
    loginPage.open('/auth');
    loginPage.login();
    myEformsPage.createNewEform(templateName);
    itemsGroupPlanningListPage.goToListsPage();
  });
  it('should create dummy lists', function () {
    itemsGroupPlanningListPage.createDummyLists(templateName);
  });
  it('should be able to sort by ID', function () {
    testSorting(itemsGroupPlanningListPage.idTableHeader, '#listId', 'ID');
  });
  it('should be able to sort by Name', function () {
    testSorting(
      itemsGroupPlanningListPage.nameTableHeader,
      '#listName',
      'Name'
    );
  });
  it('should be able to sort by Description', function () {
    testSorting(
      itemsGroupPlanningListPage.descriptionTableHeader,
      '#listDescription',
      'Description'
    );
  });
  it('should clear table', function () {
    itemsGroupPlanningListPage.clearTable();
  });
});
