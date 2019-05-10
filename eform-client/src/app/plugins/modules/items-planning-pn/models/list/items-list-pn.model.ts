import {ItemsListPnItemModel} from './items-list-pn-item.model';

export class ItemsListsPnModel {
  total: number;
  List: Array<ItemsListPnModel> = [];
}

export class ItemsListPnModel {
  id: number;
  name: string;
  description: string;
  repeatEvery: number;
  repeatType: number;
  repeatOn: number;
  repeatUntil: Date | null;
  items: ItemsListPnItemModel[] = [];
}
