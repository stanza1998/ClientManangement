import { runInAction } from "mobx";

import AppStore from "./AppStore";
import Store from "./store";
import ContactModel, { IContact } from "../models/Contact";


export default class ContactStore extends Store<IContact, ContactModel> {
  items = new Map<string, ContactModel>();

  constructor(store: AppStore) {
    super(store);
    this.store = store;
  }

  load(items: IContact[] = []) {
    runInAction(() => {
      items.forEach((item) =>
        this.items.set(`${item.id}`, new ContactModel(this.store, item))
      );
    });
  }
}