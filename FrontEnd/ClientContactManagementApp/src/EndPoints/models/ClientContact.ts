import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../stores/AppStore";

export const defaultIClientContact: IClientContact = {
  id: 0,
  clientId: 0,
  contactId: 0,
};

export interface IClientContact {
  id: number;
  clientId: number;
  contactId: number;
}

export default class ClientContactModel {
  private clientContact: IClientContact;

  constructor(private store: AppStore, clientContact: IClientContact) {
    makeAutoObservable(this);
    this.clientContact = clientContact;
  }

  get asJson(): IClientContact {
    return toJS(this.clientContact);
  }
}
