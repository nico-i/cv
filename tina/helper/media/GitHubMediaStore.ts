/* eslint-disable @typescript-eslint/no-unused-vars -- WIP */
import {
  DEFAULT_MEDIA_UPLOAD_TYPES,
  type Media,
  type MediaList,
  type MediaListOptions,
  type MediaStore,
  type MediaUploadOptions,
} from 'tinacms';

export interface GitHubMediaStoreOptions {
  baseUrl?: string;
}

export class GitHubMediaStore implements MediaStore {
  accept = DEFAULT_MEDIA_UPLOAD_TYPES;
  private readonly baseUrl: string;

  constructor(options?: GitHubMediaStoreOptions) {
    this.baseUrl = options?.baseUrl || `/api/github/media`;
  }

  persist(files: MediaUploadOptions[]): Promise<Media[]> {
    throw new Error(`Persist Method not implemented.`);
  }

  delete(media: Media): Promise<void> {
    throw new Error(`Delete Method not implemented.`);
  }

  async list(options?: MediaListOptions): Promise<MediaList> {
    const res = await fetch(this.baseUrl);
    if (!res.ok) {
      throw new Error(
        `Failed to retrieve media list. Response: ${res.statusText}`,
      );
    }
    throw new Error(`List Method not implemented.`);
  }

  isStatic?: boolean | undefined;
}
