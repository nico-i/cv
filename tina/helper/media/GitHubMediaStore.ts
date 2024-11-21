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
    const query = this.mapMediaListOptionsToQueryParams(options || {});

    const allFiles: Media[] = await fetch(this.baseUrl + query).then((res) =>
      res.json(),
    );
    return {
      items: allFiles,
    };
  }

  mapMediaListOptionsToQueryParams(options: MediaListOptions) {
    const params: [string, string][] = [];

    if (options.directory) {
      params.push([`directory`, options.directory]);
    }
    if (options.limit) {
      params.push([`limit`, options.limit.toString()]);
    }
    if (options.offset) {
      params.push([`offset`, options.offset.toString()]);
    }
    if (options.thumbnailSizes) {
      params.push([`thumbnailSizes`, JSON.stringify(options.thumbnailSizes)]);
    }
    if (options.filesOnly) {
      params.push([`filesOnly`, options.filesOnly.toString()]);
    }

    return `?${params
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
      )
      .join(`&`)}`;
  }
}
