import {ItemsListPnItemModel} from './items-list-pn-item.model';

export class ItemsListPnCreateModel {
  name: string;
  description: string;
  repeatEvery: number;
  repeatType: number;
  repeatOn: number;
  repeatUntil: Date | null;
  relatedEFormId: number;
  items: ItemsListPnItemModel[] = [];
}
