import axios from "axios";

import AppStore from "../stores/AppStore";
import { IContact } from "../models/Contact";

export default class ContactApi {
  private baseUrl: string;

  constructor(private store: AppStore) {
    this.baseUrl = "https://localhost:7286/api/Contacts"; // Base URL with endpoint path
  }

  async getAll() {
    try {
      const response = await axios.get(`${this.baseUrl}/get`); // Adjusted endpoint URL
      const items: IContact[] = response.data;
      this.store.contact.load(items);
    } catch (error) {
      console.error(error);
    }
  }

  async getById(id: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/get/${id}`); // Adjusted endpoint URL
      const item: IContact = response.data;
      this.store.contact.load([item]);
    } catch (error) {
      console.error(error);
    }
  }

  async create(data: IContact) {
    console.log("🚀 ~ ClientApi ~ create ~ data:", data);
    try {
      const response = await axios.post(`${this.baseUrl}/create`, data); // Adjusted endpoint URL
      const newItem: IContact = response.data;
      this.store.contact.load([newItem]);
      return newItem;
    } catch (error) {
      console.error(error);
    }
  }

  async update(item: IContact) {
    try {
      await axios.put(`${this.baseUrl}/update/${item.id}`, item); // Adjusted endpoint URL
      this.store.contact.load([item]);
    } catch (error) {
      console.error(error);
    }
  }

  async delete(id: number) {
    try {
      await axios.delete(`${this.baseUrl}/delete/${id}`); // Adjusted endpoint URL
      this.store.contact.remove(id);
    } catch (error) {
      console.error(error);
    }
  }
}
