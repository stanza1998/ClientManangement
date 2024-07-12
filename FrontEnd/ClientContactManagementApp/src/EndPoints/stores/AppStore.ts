import ClientContactStore from "./ClientContactStore";
import ClientStore from "./ClientStore";
import ContactStore from "./ContactStore";

export default class AppStore {
  client = new ClientStore(this); // Instance of ClientStore with reference to AppStore
  contact = new ContactStore(this); // Instance of ContactStore with reference to AppStore
  clientContact = new ClientContactStore(this); // Instance of ClientContactStore with reference to AppStore
}
