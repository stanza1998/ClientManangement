import { makeObservable, runInAction, toJS } from "mobx";
import AppStore from "./AppStore";

export default abstract class Store<Type, Model> {
  items = new Map<string, Model>(); // Map to store items
  selected: Type | null = null; // Currently selected item
  protected store: AppStore; // Reference to the AppStore

  constructor(store: AppStore) {
    this.store = store; // Assign the provided AppStore instance

    // Make the class observable with MobX
    makeObservable(this, {
      items: true,
      selected: true,
      all: true,
      size: true,
      getById: true,
      load: false,         // Load method is not observable
      remove: false,       // Remove method is an action
      removeAll: false,    // RemoveAll method is an action
      select: false,       // Select method is an action
      clearSelected: false // ClearSelected method is an action
    });
  }

  // Abstract method to be implemented by subclasses for loading items
  abstract load(items: Type[]): void;

  // Remove an item from the store by id
  remove(id: number) {
    runInAction(() => {
      if (this.items.has(`${id}`)) this.items.delete(`${id}`);
    });
  }

  // Remove all items from the store
  removeAll() {
    runInAction(() => {
      this.items.clear();
    });
  }

  // Select an item in the store
  select(item: Type) {
    runInAction(() => {
      this.selected = item;
    });
  }

  // Clear the currently selected item
  clearSelected() {
    runInAction(() => {
      this.selected = null;
    });
  }

  // Get an item from the store by id
  getById(id: number) {
    const item = this.items.get(`${id}`);
    if (toJS(item)) return item;
    return undefined;
  }

  // Get all items in the store as an array
  get all() {
    return Array.from(this.items.values());
  }

  // Get the number of items in the store
  get size() {
    return this.items.size;
  }
}
