import { itemListPersistProvider } from './components/items-lists/store';
import { itemsListCasesPersistProvider } from './components/items-lists/item-list-cases/store';
import { itemListCaseResultPersistProvider } from './components/items-lists/item-list-case-results/store';

export const itemsGroupPlanningStoreProviders = [
  itemListPersistProvider,
  itemsListCasesPersistProvider,
  itemListCaseResultPersistProvider,
];
