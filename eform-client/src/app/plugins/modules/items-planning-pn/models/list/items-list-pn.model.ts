import {ItemsListPnItemModel} from './items-list-pn-item.model';
import {Moment} from 'moment';

export class ItemsListsPnModel {
  total: number;
  lists: Array<ItemsListPnModel> = [];
}

export class ItemsListPnModel {
  id: number;
  name: string;
  description: string;
  repeatEvery: number;
  repeatType: number;
  dayOfWeek: number;
  dayOfMonth: number;
  repeatUntil: Moment | null;
  relatedEFormId: number;
  items: ItemsListPnItemModel[] = [];
}
