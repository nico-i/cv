import type { RestEndpointMethodTypes } from '@octokit/rest';
import type { Media } from 'tinacms';

type ExtractArrayType<T> = T extends unknown[] ? T : never;

export type GitHubFile = ExtractArrayType<
  RestEndpointMethodTypes[`repos`][`getContent`][`response`][`data`]
>[0];

export function isGitHubFile(file: unknown): file is GitHubFile {
  if (typeof file !== `object` || file === null) {
    return false;
  }

  if (
    !(`type` in file) ||
    typeof file.type !== `string` ||
    [`dir`, `file`].indexOf(file.type) === -1
  ) {
    return false;
  }

  if (!(`path` in file) || typeof file.path !== `string`) {
    return false;
  }

  if (!(`name` in file) || typeof file.name !== `string`) {
    return false;
  }

  if (!(`sha` in file) || typeof file.sha !== `string`) {
    return false;
  }

  if (!(`download_url` in file)) {
    return false;
  }

  return true;
}

export function parseGitHubImage(media: unknown) {
  if (
    typeof media === `object` &&
    media !== null &&
    `src` in media &&
    typeof media.src === `string`
  ) {
    return media.src;
  }
  return ``;
}

/**
 * Converts a GitHub file to a TinaCMS Media object
 * @param file The GitHub file to convert
 * @param dirPathPrefixToRemove The path to remove from the start of the file path
 * @returns The converted Media object
 * @throws If the file type is not `file` or `dir`
 */
export function toMedia(
  file: GitHubFile,
  dirPathPrefixToRemove: string,
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

  const commonMediaProps: Omit<Media, `type`> = {
    directory: dirPath,
    filename: file.name,
    id: file.sha,
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
    src = file.download_url.split(`?`)[0];
    if (file.name.match(/\.(jpeg|jpg|gif|png|svg)$/) != null) {
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
    ...(src ? { src } : {}),
    ...(thumbnails ? { thumbnails } : {}),
  };
}
