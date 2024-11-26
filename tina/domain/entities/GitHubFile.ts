import type { RestEndpointMethodTypes } from '@octokit/rest';
import type { Media } from 'tinacms';

type ExtractArrayType<T> = T extends unknown[] ? T : never;

export type GitHubFile = ExtractArrayType<
  RestEndpointMethodTypes[`repos`][`getContent`][`response`][`data`]
>[0];

/**
 * Converts a GitHub file to a TinaCMS Media object
 * @param file The GitHub file to convert
 * @param dirPathPrefixToRemove The path to remove from the start of the file path
 * @returns The converted Media object
 */
export function toMedia(
  file: GitHubFile,
  dirPathPrefixToRemove?: string,
): Media {
  if (file.type !== `file` && file.type !== `dir`) {
    throw new Error(`Invalid file type: ${file.type}`);
  }

  const dirPath = dirPathPrefixToRemove
    ? file.path
        .split(`/`)
        .slice(0, -1)
        .join(`/`)
        .replace(dirPathPrefixToRemove, ``)
    : file.path;

  const filePath = file.path;

  const commonMediaProps: Omit<Media, `type`> = {
    directory: dirPath,
    filename: file.name,
    id: filePath,
  };

  if (file.type === `dir`) {
    return {
      ...commonMediaProps,
      type: `dir`,
    };
  }

  let src: Media[`src`];
  let thumbnails: Media[`thumbnails`];

  if (file.download_url !== null) {
    if (file.name.match(/\.(jpeg|jpg|gif|png|svg)$/) != null) {
      src = file.download_url;
      thumbnails = {
        '75x75': src,
        '400x400': src,
        '1000x1000': src,
      };
    }
  }

  return {
    ...commonMediaProps,
    type: `file`,
    src,
    thumbnails,
  };
}
