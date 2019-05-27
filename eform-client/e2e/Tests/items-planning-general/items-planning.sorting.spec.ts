import loginPage from '../../Page objects/Login.page';
import itemsPlanningListPage from '../../Page objects/ItemsPlanning/ItemsPlanningList.page';

const expect = require('chai').expect;

describe('Items planning lists table sorting', function () {
  before(function () {
    loginPage.open('/auth');
    loginPage.login();
    itemsPlanningListPage.goToListsPage();
  });
  it ('should be able to sort by ID', function () {
    itemsPlanningListPage.createDummyLists();

    const listBefore = $$('#listId').map(item => {
      return item.getText();
    });

    // check that sorting is correct in both directions
    for (let i = 0; i < 2; i ++) {
      itemsPlanningListPage.clickIdTableHeader();

      const listAfter = $$('#listId').map(item => {
        return item.getText();
      });

      // get current direction of sorting
      const sortIcon = browser.$('#idTableHeader i').getText();
      let sorted;
      if (sortIcon === 'expand_more') {
        sorted = listBefore.sort().reverse();
      } else if (sortIcon === 'expand_less') {
        sorted = listBefore.sort();
      } else {
        sorted = listBefore;
      }

      expect(sorted, 'Sort by ID incorrect').deep.equal(listAfter);
    }

    itemsPlanningListPage.clearTable();
  });
  it ('should be able to sort by Name', function () {
    itemsPlanningListPage.createDummyLists();

    const listBefore = $$('#listName').map(item => {
      return item.getText();
    });

    // check that sorting is correct in both directions
    for (let i = 0; i < 2; i ++) {
      itemsPlanningListPage.clickNameTableHeader();

      const listAfter = $$('#listName').map(item => {
        return item.getText();
      });

      // get current direction of sorting
      const sortIcon = browser.$('#nameTableHeader i').getText();
      let sorted;
      if (sortIcon === 'expand_more') {
        sorted = listBefore.sort().reverse();
      } else if (sortIcon === 'expand_less') {
        sorted = listBefore.sort();
      } else {
        sorted = listBefore;
      }

      browser.pause(2000);
      expect(sorted, 'Sort by Name incorrect').deep.equal(listAfter);
    }

    browser.pause(2000);
    itemsPlanningListPage.clearTable();
  });
  it ('should be able to sort by Description', function () {
    itemsPlanningListPage.createDummyLists();

    const listBefore = $$('#listDescription').map(item => {
      return item.getText();
    });

    // check that sorting is correct in both directions
    for (let i = 0; i < 2; i ++) {
      itemsPlanningListPage.clickDescriptionTableHeader();

      const listAfter = $$('#listDescription').map(item => {
        return item.getText();
      });

      // get current direction of sorting
      const sortIcon = browser.$('#descriptionTableHeader i').getText();
      let sorted;
      if (sortIcon === 'expand_more') {
        sorted = listBefore.sort().reverse();
      } else if (sortIcon === 'expand_less') {
        sorted = listBefore.sort();
      } else {
        sorted = listBefore;
      }

      expect(sorted, 'Sort by Description incorrect').deep.equal(listAfter);
    }

    browser.pause(2000);
    itemsPlanningListPage.clearTable();
  });
});
