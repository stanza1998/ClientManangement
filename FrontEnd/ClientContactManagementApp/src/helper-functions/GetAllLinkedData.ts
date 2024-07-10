import axios from "axios";
import { IClient } from "../EndPoints/models/Client";
import { IClientContact } from "../EndPoints/models/ClientContact";

export async function getAllLinkedData(
  clients: IClient[]
): Promise<IClientContact[]> {
  const baseUrl = "https://localhost:7286/api/ClientContact";

  const allLinkedData: IClientContact[] = [];

  try {
    // Create an array of promises for fetching contacts for each client
    const promises = clients.map(async (client) => {
      const response = await axios.get<IClientContact[]>(
        `${baseUrl}/${client.id}/contacts`
      );
      return response.data;
    });

    // Wait for all promises to resolve
    const results = await Promise.all(promises);

    // Flatten the array of arrays into a single array
    results.forEach((contacts) => {
      allLinkedData.push(...contacts);
    });

    // Filter out objects without an id property
    const filteredData = allLinkedData.filter(
      (contact) => contact.id !== undefined && contact.id !== null
    );

    return filteredData;
  } catch (error) {
    console.error("Error fetching linked data:", error);
    return [];
  }
}
