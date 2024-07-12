import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../stores/AppStore";

export const defaultContact: IContact = {
  id: 0,
  name: "",
  surname: "",
  email: "",
};

export interface IContact {
  id: number;
  name: string;
  surname: string;
  email: string;
}

export default class ContactModel {
  private contact: IContact;

  constructor(private store: AppStore, contact: IContact) {
    makeAutoObservable(this);
    this.contact = contact;
  }

  get asJson(): IContact {
    return toJS(this.contact);
  }
}
