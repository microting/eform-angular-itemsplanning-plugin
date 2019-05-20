import {ItemsListPnItemModel} from './items-list-pn-item.model';

export class ItemsListsPnModel {
  total: number;
  list: Array<ItemsListPnModel> = [];
}

export class ItemsListPnModel {
  id: number;
  name: string;
  description: string;
  repeatEvery: number;
  repeatType: number;
  repeatOn: number;
  repeatUntil: Date | null;
  relatedEFormId: number;
  items: ItemsListPnItemModel[] = [];
}
