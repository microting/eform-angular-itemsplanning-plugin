export class ListsPnModel {
  total: number;
  List: Array<ListPnModel> = [];
}

export class ListPnModel {
  id: number;
  name: string;
  description: string;
}
