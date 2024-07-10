import ClientContactStore from "./ClientContactStore";
import ClientStore from "./ClientStore";
import ContactStore from "./ContactStore";

export default class AppStore {
  client = new ClientStore(this);
  contact = new ContactStore(this);
  clientContact = new ClientContactStore(this)

}
