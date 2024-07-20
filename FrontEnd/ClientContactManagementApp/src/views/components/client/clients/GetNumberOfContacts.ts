import axios from "axios";
import { IClientContact } from "../../../../EndPoints/models/ClientContact";

export async function getNumberOfContacts(clientId: number) {
  const baseUrl = "https://localhost:7286/api/ClientContact";

  try {
    // Fetch contacts for the specified client ID
    const response = await axios.get<IClientContact[]>(
      `${baseUrl}/${clientId}/contacts`
    );

    return response.data.map((d) => {
      return d;
    }).length;
  } catch (error) {
    return 0;
  }

  return 0;
}
export async function getNumberOfClients(clientId: number) {
  const baseUrl = "https://localhost:7286/api/ContactClient";

  try {
    // Fetch contacts for the specified client ID
    const response = await axios.get<IClientContact[]>(
      `${baseUrl}/${clientId}/clients`
    );

    return response.data.map((d) => {
      return d;
    }).length;
  } catch (error) {
    return 0;
  }

  return 0;
}
