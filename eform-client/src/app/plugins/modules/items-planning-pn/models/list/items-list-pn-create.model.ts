import {ItemsListPnItemModel} from './items-list-pn-item.model';
import {Moment} from 'moment';

export class ItemsListPnCreateModel {
  name: string;
  description: string;
  repeatEvery: number;
  repeatType: number;
  repeatOn: number;
  repeatUntil: Moment | null;
  relatedEFormId: number;
  items: ItemsListPnItemModel[] = [];
}
