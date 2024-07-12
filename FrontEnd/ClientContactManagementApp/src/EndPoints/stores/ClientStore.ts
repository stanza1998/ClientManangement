import { runInAction } from "mobx";
import ClientModel, { IClient } from "../models/Client";
import AppStore from "./AppStore";
import Store from "./store";

export default class ClientStore extends Store<IClient, ClientModel> {
  items = new Map<string, ClientModel>(); // Map to store ClientModel instances

  constructor(store: AppStore) {
    super(store); // Calls the constructor of the base Store class
    this.store = store; // Sets the AppStore instance
  }

  load(items: IClient[] = []) {
    runInAction(() => {
      items.forEach((item) =>
        this.items.set(`${item.id}`, new ClientModel(this.store, item))
      );
    });
  }
}
