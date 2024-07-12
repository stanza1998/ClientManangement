import { IClient } from "../EndPoints/models/Client";
import { IContact } from "../EndPoints/models/Contact";

export function validateClientName(model: IClient): string | null {
  if (!model.name) {
    return "Name is required";
  }
  if (model.name.length < 3 || model.name.length > 100) {
    return "Name must be between 2 and 100 characters";
  }
  return null; // No validation errors
}

export function validateContact(contact: IContact): string | null {
  if (!contact.name) {
    return "Name is required";
  }

  if (!contact.surname) {
    return "Surname is required";
  }

  if (!contact.email) {
    return "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(contact.email)) {
    return "Invalid email address";
  }

  return null; // No validation errors
}
