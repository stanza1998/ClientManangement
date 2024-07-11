import { makeObservable, runInAction, toJS } from "mobx";
import AppStore from "./AppStore";

export default abstract class Store<Type, Model> {
  items = new Map<string, Model>();
  selected: Type | null = null;
  protected store: AppStore;

  constructor(store: AppStore) {
    this.store = store;
    makeObservable(this, {
      items: true,
      selected: true,
      all: true,
      size: true,
      getById: true,
      load: false, // Load is not observable
      remove: false, // Remove is an action
      removeAll: false, // RemoveAll is an action
      select: false, // Select is an action
      clearSelected: false, // ClearSelected is an action
    });
  }

  load(items: Type[] = []) {}

  remove(id: number) {
    runInAction(() => {
      if (this.items.has(`${id}`)) this.items.delete(`${id}`);
    });
  }

  removeAll() {
    runInAction(() => {
      this.items.clear();
    });
  }

  select(item: Type) {
    runInAction(() => {
      this.selected = item;
    });
  }

  clearSelected() {
    runInAction(() => {
      this.selected = null;
    });
  }

  getById(id: number) {
    const item = this.items.get(`${id}`);
    if (toJS(item)) return item;
    return undefined;
  }

  get all() {
    return Array.from(this.items.values());
  }

  get size() {
    return this.items.size;
  }
}
