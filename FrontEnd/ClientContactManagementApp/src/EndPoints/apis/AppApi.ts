import AppStore from "../stores/AppStore";
import ClientApi from "./ClientApis";
import ClientContactApi from "./ClientContactApis";
import ContactApi from "./ContactApis";

export default class AppApi {
  client: ClientApi;
  contact: ContactApi;
  clientContact: ClientContactApi;

  constructor(private store: AppStore) {
    // Initialize API instances with the provided AppStore
    this.client = new ClientApi(this.store); // API for interacting with clients
    this.contact = new ContactApi(this.store); // API for interacting with contacts
    this.clientContact = new ClientContactApi(this.store); // API for client contact relationships
  }
}
