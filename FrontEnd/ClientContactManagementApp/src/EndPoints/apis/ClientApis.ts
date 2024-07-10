import axios from "axios";
import { IClient } from "../models/Client";
import AppStore from "../stores/AppStore";

export default class ClientApi {
  private baseUrl: string;

  constructor(private store: AppStore) {
    this.baseUrl = "https://localhost:7286/api/Clients"; // Base URL with endpoint path
  }

  async getAll() {
    try {
      const response = await axios.get(`${this.baseUrl}/get`); // Adjusted endpoint URL
      const items: IClient[] = response.data;
      this.store.client.load(items);
    } catch (error) {
      console.error(error);
    }
  }

  async getById(id: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/get/${id}`); // Adjusted endpoint URL
      const item: IClient = response.data;
      this.store.client.load([item]);
    } catch (error) {
      console.error(error);
    }
  }

  async create(data: IClient) {
    console.log("🚀 ~ ClientApi ~ create ~ data:", data);
    try {
      const response = await axios.post(`${this.baseUrl}/create`, data); // Adjusted endpoint URL
      const newItem: IClient = response.data;
      this.store.client.load([newItem]);
      return newItem;
    } catch (error) {
      console.error(error);
    }
  }

  async update(item: IClient) {
    try {
      await axios.put(`${this.baseUrl}/update/${item.id}`, item); // Adjusted endpoint URL
      this.store.client.load([item]);
    } catch (error) {
      console.error(error);
    }
  }

  async delete(id: number) {
    try {
      await axios.delete(`${this.baseUrl}/delete/${id}`); // Adjusted endpoint URL
      this.store.client.remove(id);
    } catch (error) {
      console.error(error);
    }
  }
}
