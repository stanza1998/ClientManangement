import { IClient } from "../EndPoints/models/Client";
import { IContact } from "../EndPoints/models/Contact";

/**
 * Validates the name field of a client.
 * @param model The client model to validate.
 * @returns A validation error message if invalid, otherwise null.
 */
export function validateClientName(model: IClient): string | null {
  if (!model.name) {
    return "Name is required";
  }
  if (model.name.length < 1 || model.name.length > 100) {
    return "Name must be between 3 and 100 characters";
  }
  return null; // No validation errors
}

/**
 * Validates the contact details.
 * @param contact The contact object to validate.
 * @returns A validation error message if invalid, otherwise null.
 */
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
