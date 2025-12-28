/**
 * Base HTTP Client for NotePM API
 */
import { Config } from "./config.js";
import { NotePMAPIError } from "./errors.js";

export class HttpClient {
  private baseUrl: string;
  private accessToken: string;

  constructor(config: Config) {
    this.baseUrl = config.baseUrl;
    this.accessToken = config.accessToken;
  }

  /**
   * Send API request
   */
  async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const url = `${this.baseUrl}${path}`;

    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.accessToken}`,
      "Content-Type": "application/json",
    };

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new NotePMAPIError(
        response.status,
        response.statusText,
        `NotePM API Error: ${String(response.status)} ${response.statusText}\n${errorText}`
      );
    }

    // Return empty object for 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    return response.json() as Promise<T>;
  }
}
