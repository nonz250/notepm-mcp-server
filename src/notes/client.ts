/**
 * Note domain API client
 */
import { HttpClient } from "../shared/http-client.js";
import type {
  CreateNoteParams,
  ListNotesParams,
  Note,
  NoteResponse,
  NotesResponse,
  UpdateNoteParams,
} from "./types.js";

export class NoteClient {
  constructor(private http: HttpClient) {}

  /**
   * List notes
   * GET /api/v1/notes
   */
  async list(params: ListNotesParams = {}): Promise<NotesResponse> {
    const searchParams = new URLSearchParams();

    if (params.include_archived) searchParams.set("include_archived", "1");
    if (params.page) searchParams.set("page", params.page.toString());
    if (params.per_page) searchParams.set("per_page", params.per_page.toString());

    const query = searchParams.toString();
    const path = `/notes${query ? `?${query}` : ""}`;

    return this.http.request<NotesResponse>("GET", path);
  }

  /**
   * Get note
   * GET /api/v1/notes/:note_code
   */
  async get(noteCode: string): Promise<Note> {
    const response = await this.http.request<NoteResponse>("GET", `/notes/${noteCode}`);
    return response.note;
  }

  /**
   * Create note
   * POST /api/v1/notes
   */
  async create(params: CreateNoteParams): Promise<Note> {
    const response = await this.http.request<NoteResponse>("POST", "/notes", params);
    return response.note;
  }

  /**
   * Update note
   * PATCH /api/v1/notes/:note_code
   */
  async update(noteCode: string, params: UpdateNoteParams): Promise<Note> {
    const response = await this.http.request<NoteResponse>("PATCH", `/notes/${noteCode}`, params);
    return response.note;
  }

  /**
   * Delete note
   * DELETE /api/v1/notes/:note_code
   */
  async delete(noteCode: string): Promise<void> {
    await this.http.request<undefined>("DELETE", `/notes/${noteCode}`);
  }

  /**
   * Archive note
   * PATCH /api/v1/notes/:note_code/archive
   */
  async archive(noteCode: string): Promise<void> {
    await this.http.request<undefined>("PATCH", `/notes/${noteCode}/archive`);
  }

  /**
   * Unarchive note (extract from archive)
   * PATCH /api/v1/notes/:note_code/extract
   */
  async unarchive(noteCode: string): Promise<void> {
    await this.http.request<undefined>("PATCH", `/notes/${noteCode}/extract`);
  }
}
