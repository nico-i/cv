import type { RestEndpointMethodTypes } from '@octokit/rest';
import {
  DEFAULT_MEDIA_UPLOAD_TYPES,
  type Media,
  type MediaList,
  type MediaListOptions,
  type MediaStore,
  type MediaUploadOptions,
} from 'tinacms';
import { toMedia, type GitHubFile } from '../../../domain/entities/GitHubFile';

export interface GitHubMediaStoreOptions {
  baseUrl?: string;
}

export class GitHubMediaStore implements MediaStore {
  accept = DEFAULT_MEDIA_UPLOAD_TYPES;
  private readonly baseUrl: string;

  constructor(options?: GitHubMediaStoreOptions) {
    this.baseUrl = options?.baseUrl || `/api/github/media`;
  }

  async persist(media: MediaUploadOptions[]): Promise<Media[]> {
    const newFiles: Media[] = [];

    for (const item of media) {
      const { file, directory } = item;

      const formData = new FormData();
      formData.append(`file`, file);
      formData.append(`directory`, directory);
      formData.append(`filename`, file.name);

      const res = await fetch(this.baseUrl, {
        method: `POST`,
        body: formData,
      });

      if (res.status != 200) {
        const responseData = await res.json();
        throw new Error(responseData.message);
      }

      const data: RestEndpointMethodTypes[`repos`][`createOrUpdateFileContents`][`response`][`data`] =
        await res.json();

      const ghFile = data.content as GitHubFile; //
      const mediaFile = toMedia(ghFile);

      newFiles.push(mediaFile);
    }

    return newFiles;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
