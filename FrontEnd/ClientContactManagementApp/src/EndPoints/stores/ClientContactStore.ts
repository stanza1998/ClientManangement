import { runInAction } from "mobx";
import AppStore from "./AppStore";
import Store from "./store";
import ClientContactModel, { IClientContact } from "../models/ClientContact";

export default class ClientContactStore extends Store<
  IClientContact,
  ClientContactModel
> {
  items = new Map<string, ClientContactModel>(); // Map to store ClientContactModel instances

  constructor(store: AppStore) {
    super(store); // Calls the constructor of the base Store class
    this.store = store; // Sets the AppStore instance
  }

  load(items: IClientContact[] = []) {
    runInAction(() => {
      items.forEach((item) =>
        this.items.set(`${item.id}`, new ClientContactModel(this.store, item))
      );
    });
  }
}
