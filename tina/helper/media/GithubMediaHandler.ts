import { Octokit, type RestEndpointMethodTypes } from '@octokit/rest';
import type { Request, RequestHandler, Response } from 'express';
import type { Media, MediaListOptions } from 'tinacms';
import path from 'path';

export interface GitHubMediaHandlerConfig {
  /**
   * Function to check if the user is authorized to upload media
   */
  authorized: (req: Request, res: Response) => Promise<boolean>;
  /**
   * GitHub access token with `repo` scope
   */
  token: string;
  /**
   * Branch to commit to
   */
  branch: string;
  /**
   * Owner of the repository
   */
  owner: string;
  /**
   * Name of the repository
   */
  repo: string;
  /**
   * Path to the media directory in the repository
   */
  basePath: string;
}

type ExtractArrayType<T> = T extends unknown[] ? T : never;

export const createMediaHandler = (
  config: GitHubMediaHandlerConfig,
): RequestHandler => {
  return async (req, res) => {
    const isAuthorized = await config.authorized(req, res);
    if (!isAuthorized) {
      res
        .status(401)
        .json({ message: `sorry this user is not authorized to upload` });
    }

    let octokit: Octokit;

    try {
      octokit = new Octokit({
        auth: config.token,
      });
    } catch (e) {
      res
        .status(500)
        .json({ message: `Failed to create Octokit instance. Error: ${e}` });
      return;
    }

    switch (req.method) {
      case `GET`: {
        try {
          const queryStr = req.url.split(`?`)[1];
          const mediaListOptions = queryStr
            ? mapQueryParamsToMediaListOptions(queryStr)
            : null;

          const contentPath = path.join(
            config.basePath,
            mediaListOptions?.directory || ``,
          );

          const { data: allFiles } = await octokit.repos.getContent({
            owner: config.owner,
            repo: config.repo,
            path: contentPath,
            headers: {
              'X-GitHub-Api-Version': `2022-11-28`,
              accept: `application/vnd.github+json`,
            },
          });

          if (!Array.isArray(allFiles)) {
            res.status(500).json({
              message: `Received invalid response from GitHub repo. Expected array, got ${typeof allFiles}`,
            });
            return;
          }

          let allMedia = allFiles.map((file) =>
            mapGitHubFileToMedia(config.basePath, file),
          );

          if (mediaListOptions?.filesOnly) {
            allMedia = allMedia.filter((media) => media.type === `file`);
          }

          res.json(allMedia);
        } catch (e) {
          res.status(500).json({
            message: `Failed to get content from GitHub repo. Response: ${e}`,
          });
        }
        return;
      }
      case `POST`:
        res.status(500).json({ message: `POST Method not implemented.` });
        return;
      case `DELETE`:
        res.status(500).json({ message: `DELETE Method not implemented.` });
        return;
      default:
        res.end(404);
    }
  };
};

function mapGitHubFileToMedia(
  basePath: string,
  file: ExtractArrayType<
    RestEndpointMethodTypes[`repos`][`getContent`][`response`][`data`]
  >[0],
): Media {
  if (file.type !== `file` && file.type !== `dir`) {
    throw new Error(`Invalid file type: ${file.type}`);
  }
  const dirPath = file.path
    .split(`/`)
    .slice(0, -1)
    .join(`/`)
    .replace(basePath, ``);

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

function mapQueryParamsToMediaListOptions(
  queryString: string,
): MediaListOptions {
  const options: MediaListOptions = {};

  const params = new URLSearchParams(queryString);

  options.directory = params.get(`directory`) || undefined;

  const limit = params.get(`limit`);
  options.limit = limit ? parseInt(limit, 10) : undefined;

  options.offset = params.get(`offset`) || undefined;

  const thumbnailSizes = params.get(`thumbnailSizes`);
  if (thumbnailSizes) {
    const thumbnailSizesMaybeArray: NonNullable<
      MediaListOptions[`thumbnailSizes`]
    > = JSON.parse(thumbnailSizes);
    if (Array.isArray(thumbnailSizesMaybeArray)) {
      options.thumbnailSizes = thumbnailSizesMaybeArray;
    }
  }

  options.filesOnly = params.get(`filesOnly`) === `true`;

  return options;
}
