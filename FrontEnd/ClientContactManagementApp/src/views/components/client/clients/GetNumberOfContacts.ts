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
    console.error("Error fetching client contacts:", error);
    return 0;
  }

  return 0;
}
