import { runInAction } from "mobx";
import AppStore from "./AppStore";
import Store from "./store";
import ContactModel, { IContact } from "../models/Contact";

export default class ContactStore extends Store<IContact, ContactModel> {
  items = new Map<string, ContactModel>(); // Map to store ContactModel instances

  constructor(store: AppStore) {
    super(store); // Calls the constructor of the base Store class
    this.store = store; // Sets the AppStore instance
  }

  load(items: IContact[] = []) {
    runInAction(() => {
      items.forEach((item) =>
        this.items.set(`${item.id}`, new ContactModel(this.store, item))
      );
    });
  }
}
