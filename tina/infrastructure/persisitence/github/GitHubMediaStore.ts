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
  isStatic?: true;

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

      const media: Media = await res.json();

      newFiles.push(media);
    }

    return newFiles;
  }

  async delete(media: Media): Promise<void> {
    const queryParams = new URLSearchParams();

    const filePath = `${media.directory}/${media.filename}`;
    queryParams.set(`path`, filePath);
    queryParams.set(`sha`, media.id);

    const targetUrl = `${this.baseUrl}?${queryParams.toString()}`;
    await fetch(targetUrl, {
      method: `DELETE`,
    });
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
