import axios from "axios";
import { IClient } from "../models/Client";
import AppStore from "../stores/AppStore";

export default class ClientApi {
  private baseUrl: string;

  constructor(private store: AppStore) {
    this.baseUrl = "https://localhost:7286/api/Clients"; // Base URL with endpoint path
  }

  // Fetches all clients from the API
  async getAll() {
    try {
      const response = await axios.get(`${this.baseUrl}/get`); // Endpoint URL to retrieve all clients
      const items: IClient[] = response.data;
      this.store.client.load(items); // Loads fetched clients into AppStore
    } catch (error) {
      console.error(error);
    }
  }

  // Fetches a client by ID from the API
  async getById(id: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/get/${id}`); // Endpoint URL to retrieve a client by ID
      const item: IClient = response.data;
      this.store.client.load([item]); // Loads fetched client into AppStore
    } catch (error) {
      console.error(error);
    }
  }

  // Creates a new client using POST request to the API
  async create(data: IClient) {
    try {
      const response = await axios.post(`${this.baseUrl}/create`, data); // Endpoint URL to create a new client
      const newItem: IClient = response.data;
      this.store.client.load([newItem]); // Loads newly created client into AppStore
      return newItem; // Returns the newly created client object
    } catch (error) {
      console.error(error);
    }
  }

  // Updates an existing client using PUT request to the API
  async update(item: IClient) {
    try {
      await axios.put(`${this.baseUrl}/update/${item.id}`, item); // Endpoint URL to update an existing client by ID
      this.store.client.load([item]); // Loads updated client into AppStore
    } catch (error) {
      console.error(error);
    }
  }

  // Deletes a client by ID using DELETE request to the API
  async delete(id: number) {
    try {
      await axios.delete(`${this.baseUrl}/delete/${id}`); // Endpoint URL to delete a client by ID
      this.store.client.remove(id); // Removes deleted client from AppStore
    } catch (error) {
      console.error(error);
    }
  }
}
