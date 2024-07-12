import axios from "axios";
import AppStore from "../stores/AppStore";
import { IClientContact } from "../models/ClientContact";

export default class ClientContactApi {
  private baseUrl: string;

  constructor(private store: AppStore) {
    this.baseUrl = "https://localhost:7286/api/ClientContact"; // Base URL with endpoint path
  }

  async linkContactToClient(clientId: number, contactId: number) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/${clientId}/linkContact/${contactId}`
      );
      if (response.status === 204) {
        // You can refresh the contacts list or perform any other actions as needed
      }
    } catch (error) {
      console.error("Error linking contact to client:", error);
    }
  }
  async unlinkContactToClient(clientId: number, contactId: number) {
    try {
      const response = await axios.delete(
        `https://localhost:7286/api/ClientContact/${clientId}/unlinkContact/${contactId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error unlinking contact from client:", error);
      throw error;
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


  // contact to client
   async unlinkContactClientToContact( contactId: number, clientId: number) {
    try {
      const response = await axios.delete(
        `https://localhost:7286/api/ContactClient/${contactId}/unlinkClient/${clientId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error unlinking contact from client:", error);
      throw error;
    }
  }

    async linkContactClientToContact(contactId: number, clientId: number) {
    try {
      const response = await axios.post(
         `https://localhost:7286/api/ContactClient/${clientId}/linkClient/${contactId}`
      );
      if (response.status === 204) {
        // You can refresh the contacts list or perform any other actions as needed
      }
    } catch (error) {
      console.error("Error linking contact to client:", error);
    }
  }
}
