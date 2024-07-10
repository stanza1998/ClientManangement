import { runInAction } from "mobx";
import ClientModel, { IClient } from "../models/Client";
import AppStore from "./AppStore";
import Store from "./store";


export default class ClientStore extends Store<IClient, ClientModel> {
  items = new Map<string, ClientModel>();

  constructor(store: AppStore) {
    super(store);
    this.store = store;
  }

  load(items: IClient[] = []) {
    runInAction(() => {
      items.forEach((item) =>
        this.items.set(`${item.id}`, new ClientModel(this.store, item))
      );
    });
  }
  
}