import axios from "axios";
import AppStore from "../stores/AppStore";
import { IClientContact } from "../models/ClientContact";

export default class ClientContactApi {
  private baseUrl: string;

  constructor(private store: AppStore) {
    this.baseUrl = "https://localhost:7286/api/ClientContact"; // Base URL with endpoint path
  }

  // Link a contact to a client
  async linkContactToClient(clientId: number, contactId: number) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/${clientId}/linkContact/${contactId}`
      );
      if (response.status === 204) {
        // Handle success, e.g., refresh contacts list
      }
    } catch (error) {
      console.error("Error linking contact to client:", error);
    }
  }

  // Unlink a contact from a client
  async unlinkContactToClient(clientId: number, contactId: number) {
    try {
      const response = await axios.delete(
        `${this.baseUrl}/${clientId}/unlinkContact/${contactId}`
      );
      return response.data; // Returns response data if needed
    } catch (error) {
      console.error("Error unlinking contact from client:", error);
      throw error;
    }
  }

  // Get contacts linked to a specific client
  async getContactsForClient(clientId: number) {
    try {
      const response = await axios.get(`${this.baseUrl}/${clientId}/contacts`);
      const items: IClientContact[] = response.data;
      this.store.clientContact.load(items); // Loads retrieved contacts into AppStore
    } catch (error) {
      console.error("Error retrieving contacts for client:", error);
    }
  }

  // Unlink a contact from a client using contactId and clientId
  async unlinkContactClientToContact(contactId: number, clientId: number) {
    try {
      const response = await axios.delete(
        `https://localhost:7286/api/ContactClient/${contactId}/unlinkClient/${clientId}`
      );
      return response.data; // Returns response data if needed
    } catch (error) {
      console.error("Error unlinking contact from client:", error);
      throw error;
    }
  }

  // Link a contact to a client using contactId and clientId
  async linkContactClientToContact(contactId: number, clientId: number) {
    try {
      const response = await axios.post(
        `https://localhost:7286/api/ContactClient/${clientId}/linkClient/${contactId}`
      );
      if (response.status === 204) {
        // Handle success, e.g., refresh contacts list
      }
    } catch (error) {
      console.error("Error linking contact to client:", error);
    }
  }
}
