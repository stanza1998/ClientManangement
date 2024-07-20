import { IClientContact } from "../models/ClientContact";
import AppStore from "../stores/AppStore";

export default class ClientContactApi {
  private baseUrl: string;

  constructor(private store: AppStore) {
    this.baseUrl = "https://localhost:7286/api/ClientContact"; // Base URL with endpoint path
  }

  private async sendRequest(method: string, url: string, data?: any) {
    return new Promise<any>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(method, url, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText);
              resolve(response);
            } catch (error) {
              reject(new Error('Failed to parse response'));
            }
          } else {
            reject(new Error(`HTTP error! status: ${xhr.status}`));
          }
        }
      };
      xhr.onerror = () => reject(new Error('Network error'));
      xhr.send(data ? JSON.stringify(data) : null);
    });
  }

  // Link a contact to a client
  async linkContactToClient(clientId: number, contactId: number) {
    try {
      const response = await this.sendRequest(
        'POST',
        `${this.baseUrl}/${clientId}/linkContact/${contactId}`
      );
      if (response === null) { // 204 No Content in axios corresponds to null in XMLHttpRequest
        // Handle success, e.g., refresh contacts list
      }
    } catch (error) {
    }
  }

  // Unlink a contact from a client
  async unlinkContactToClient(clientId: number, contactId: number) {
    try {
      const response = await this.sendRequest(
        'DELETE',
        `${this.baseUrl}/${clientId}/unlinkContact/${contactId}`
      );
      return response; // Returns response data if needed
    } catch (error) {
      throw error;
    }
  }

  // Get contacts linked to a specific client
  async getContactsForClient(clientId: number) {
    try {
      const response = await this.sendRequest(`${this.baseUrl}/${clientId}/contacts`, 'GET');
      const items: IClientContact[] = response;
      this.store.clientContact.load(items); // Loads retrieved contacts into AppStore
    } catch (error) {
    }
  }

  // Unlink a contact from a client using contactId and clientId
  async unlinkContactClientToContact(contactId: number, clientId: number) {
    try {
      const response = await this.sendRequest(
        'DELETE',
        `https://localhost:7286/api/ContactClient/${contactId}/unlinkClient/${clientId}`
      );
      return response; // Returns response data if needed
    } catch (error) {
      throw error;
    }
  }

  // Link a contact to a client using contactId and clientId
  async linkContactClientToContact(contactId: number, clientId: number) {
    try {
      const response = await this.sendRequest(
        'POST',
        `https://localhost:7286/api/ContactClient/${clientId}/linkClient/${contactId}`
      );
      if (response === null) { // 204 No Content in axios corresponds to null in XMLHttpRequest
        // Handle success, e.g., refresh contacts list
      }
    } catch (error) {
    }
  }
}
