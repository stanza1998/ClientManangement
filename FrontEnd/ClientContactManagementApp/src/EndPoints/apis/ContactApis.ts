import axios from "axios";
import AppStore from "../stores/AppStore";
import { IContact } from "../models/Contact";

export default class ContactApi {
  private baseUrl: string;

  constructor(private store: AppStore) {
    this.baseUrl = "https://localhost:7286/api/Contacts"; // Base URL with endpoint path
  }

  // Fetch all contacts
  async getAll() {
    try {
      const response = await axios.get(`${this.baseUrl}/get`);
      const items: IContact[] = response.data;
      this.store.contact.load(items); // Load fetched contacts into AppStore
    } catch (error) {
    }
  }

  // Fetch a contact by its ID
  async getById(id: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/get/${id}`);
      const item: IContact = response.data;
      this.store.contact.load([item]); // Load fetched contact into AppStore
    } catch (error) {
    }
  }

  // Create a new contact
  async create(data: IContact) {
    try {
      const response = await axios.post(`${this.baseUrl}/create`, data);
      const newItem: IContact = response.data;
      this.store.contact.load([newItem]); // Load created contact into AppStore
      return newItem; // Return the created contact object
    } catch (error) {
    }
  }

  // Update an existing contact
  async update(item: IContact) {
    try {
      await axios.put(`${this.baseUrl}/update/${item.id}`, item);
      this.store.contact.load([item]); // Load updated contact into AppStore
    } catch (error) {
    }
  }

  // Delete a contact by its ID
  async delete(id: number) {
    try {
      await axios.delete(`${this.baseUrl}/delete/${id}`);
      this.store.contact.remove(id); // Remove deleted contact from AppStore
    } catch (error) {
    }
  }
}
