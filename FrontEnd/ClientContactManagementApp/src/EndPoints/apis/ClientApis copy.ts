import { IClient } from "../models/Client";
import AppStore from "../stores/AppStore";

export default class ClientApi {
  private baseUrl: string;

  constructor(private store: AppStore) {
    this.baseUrl = "https://localhost:7286/api/Clients"; // Base URL with endpoint path
  }

  private async sendRequest(method: string, url: string, data?: any) {
    return new Promise<any>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(method, url, true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText);
              resolve(response);
            } catch (error) {
              reject(new Error("Failed to parse response"));
            }
          } else {
            reject(new Error(`HTTP error! status: ${xhr.status}`));
          }
        }
      };
      xhr.onerror = () => reject(new Error("Network error"));
      xhr.send(data ? JSON.stringify(data) : null);
    });
  }

  // Fetches all clients from the API
  async getAll() {
    try {
      const items: IClient[] = await this.sendRequest(
        "GET",
        `${this.baseUrl}/get`
      ); // Endpoint URL to retrieve all clients
      this.store.client.load(items); // Loads fetched clients into AppStore
    } catch (error) {
    }
  }

  // Fetches a client by ID from the API
  async getById(id: string) {
    try {
      const item: IClient = await this.sendRequest(
        "GET",
        `${this.baseUrl}/get/${id}`
      ); // Endpoint URL to retrieve a client by ID
      this.store.client.load([item]); // Loads fetched client into AppStore
    } catch (error) {
    }
  }

  // Creates a new client using POST request to the API
  async create(data: IClient) {
    try {
      const newItem: IClient = await this.sendRequest(
        "POST",
        `${this.baseUrl}/create`,
        data
      ); // Endpoint URL to create a new client
      this.store.client.load([newItem]); // Loads newly created client into AppStore
      return newItem; // Returns the newly created client object
    } catch (error) {
    }
  }

  // Updates an existing client using PUT request to the API
  async update(item: IClient) {
    try {
      await this.sendRequest("PUT", `${this.baseUrl}/update/${item.id}`, item); // Endpoint URL to update an existing client by ID
      this.store.client.load([item]); // Loads updated client into AppStore
    } catch (error) {
    }
  }

  // Deletes a client by ID using DELETE request to the API
  async delete(id: number) {
    try {
      await this.sendRequest("DELETE", `${this.baseUrl}/delete/${id}`); // Endpoint URL to delete a client by ID
      this.store.client.remove(id); // Removes deleted client from AppStore
      this.getAll();
    } catch (error) {
    }
  }
}
