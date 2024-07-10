import AppStore from "../stores/AppStore";
import ClientApi from "./ClientApis";
import ClientContactApi from "./ClientContactApis";
import ContactApi from "./ContactApis";

export default class AppApi {
  client: ClientApi;
  contact: ContactApi;
  clientContact: ClientContactApi;

  constructor(private store: AppStore) {
    this.client = new ClientApi(this.store);
    this.contact = new ContactApi(this.store);
    this.clientContact = new ClientContactApi(this.store);
  }
}
