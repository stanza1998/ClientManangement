import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../stores/AppStore";

export const defaultClient: IClient = {
  id: 0,
  name: 0,
  clientCode: "",
};

export interface IClient {
  id: number;
  name: string;
  clientCode: string;
}

export default class ClientModel {
  private client: IClient;

  constructor(private store: AppStore, client: IClient) {
    makeAutoObservable(this);
    this.client = client;
  }

  get asJson(): IClient {
    return toJS(this.client);
  }
}
