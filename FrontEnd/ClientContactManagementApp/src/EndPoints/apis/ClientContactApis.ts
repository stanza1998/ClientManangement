import axios from "axios";
import AppStore from "../stores/AppStore";
import { IClientContact } from "../models/ClientContact";

export default class ClientContactApi {
  private baseUrl: string;

  constructor(private store: AppStore) {
    this.baseUrl = "https://localhost:7286/api/ClientContact"; // Base URL with endpoint path
  }

  async linkContactToClient(clientId: number, contactId: number) {
    console.log(`Linking contact ${contactId} to client ${clientId}`);
    try {
      const response = await axios.post(
        `${this.baseUrl}/${clientId}/linkContact/${contactId}`
      );
      if (response.status === 204) {
        console.log("Contact linked successfully");
        // You can refresh the contacts list or perform any other actions as needed
      }
    } catch (error) {
      console.error("Error linking contact to client:", error);
    }
  }

  async getContactsForClient(clientId: number) {
    try {
      const response = await axios.get(`${this.baseUrl}/${clientId}/contacts`);
      const items: IClientContact[] = response.data;
      this.store.clientContact.load(items);
    } catch (error) {
      console.error("Error retrieving contacts for client:", error);
    }
  }
}
