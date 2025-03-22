import { CohereClientV2, Cohere } from "cohere-ai";

export class CohereInstance {
  private cohere: CohereClientV2;
  private messages: Cohere.ChatMessages;

  constructor() {
    this.cohere = new CohereClientV2({
      token: process.env.COHERE_API_KEY,
    });
    this.messages = [];
  }

  /**
   * Sends a message to cohere as a system prompt.
   * @param message
   * @returns Cohere's response or an empty string if cohere does not respond.
   */
  async sendMessage(message: string, systemMessage: boolean = false) {
    const role = systemMessage ? "system" : "user";
    this.messages.push({ role, content: message });

    // Only send non-system messages to cohere
    if (systemMessage) {
      return "";
    }

    const response = await this.cohere.chat({
      model: "command-r-plus-08-2024",
      messages: this.messages,
    });

    if (!response.message.content) {
      return "";
    }

    this.messages.push({
      role: "assistant",
      content: response.message.content[0].text,
    });
    return response.message.content[0].text;
  }
}
