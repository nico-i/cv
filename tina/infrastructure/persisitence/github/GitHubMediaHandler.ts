import { Octokit, type RestEndpointMethodTypes } from '@octokit/rest';
import type { Request, RequestHandler, Response } from 'express';
import multer from 'multer';
import path from 'path';
import type { MediaListOptions } from 'tinacms';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import { toMedia } from '../../../domain/entities/GitHubFile';

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
   * Base path to the media directory
   */
  basePath: string;
}

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
        listMedia(req, res, config, octokit);
        return;
      }
      case `POST`: {
        uploadMedia(req, res, config, octokit);
        return;
      }
      case `DELETE`: {
        res.status(500).json({ message: `DELETE Method not implemented.` });
        return;
      }
      default: {
        res.end(404);
      }
    }
  };
};

/**
 * List media in the GitHub repository
 */
async function listMedia(
  req: Request,
  res: Response,
  config: GitHubMediaHandlerConfig,
  octokit: Octokit,
) {
  try {
    const queryStr = req.url.split(`?`)[1];
    const mediaListOptions = queryStr ? toMediaListOptions(queryStr) : null;

    const contentPath = path.join(
      config.basePath,
      mediaListOptions?.directory || ``,
    );

    const { data: allGhFiles } = await octokit.repos.getContent({
      owner: config.owner,
      repo: config.repo,
      path: contentPath,
      headers: {
        'X-GitHub-Api-Version': `2022-11-28`,
        accept: `application/vnd.github+json`,
      },
    });

    if (!Array.isArray(allGhFiles)) {
      res.status(500).json({
        message: `Received invalid response from GitHub repo. Expected array, got ${typeof allGhFiles}`,
      });
      return;
    }

    let allMedia = allGhFiles.map((ghFile) => toMedia(ghFile, config.basePath));

    if (mediaListOptions?.filesOnly) {
      allMedia = allMedia.filter((media) => media.type === `file`);
    }

    res.json(allMedia);
  } catch (e) {
    res.status(500).json({
      message: `Failed to get content from GitHub repo. Response: ${e}`,
    });
  }
}

async function uploadMedia(
  req: Request,
  res: Response,
  config: GitHubMediaHandlerConfig,
  octokit: Octokit,
) {
  const upload = promisify(
    multer({
      storage: multer.diskStorage({
        destination: `/tmp`,
        filename: (_, file, cb) => {
          cb(null, file.originalname);
        },
      }),
    }).single(`file`),
  );

  try {
    await upload(req, res);
  } catch (e) {
    res.status(500).json({
      message: `Failed to upload file. Error: ${JSON.stringify(e, null, 2)}`,
    });
    return;
  }

  const { file } = req;
  if (!file) {
    res.status(400).json({ message: `No file uploaded` });
    return;
  }

  const { directory } = req.body;
  const { originalname: filename } = file;

  const { owner, repo, branch, basePath } = config;
  let filePath: string;
  try {
    filePath = path.join(basePath, directory, filename);
  } catch (e) {
    res
      .status(400)
      .json({ message: `Failed to create file path. Error: ${e}` });
    return;
  }

  let fileSha: string | undefined;
  try {
    const { data: existingFile } = await octokit.repos.getContent({
      owner,
      repo,
      path: filePath,
      ref: branch,
    });

    if (!Array.isArray(existingFile)) {
      fileSha = existingFile.sha;
    }
  } catch {
    // File doesn't exist yet, which is fine
  }

  let content: string;
  try {
    // Read file from disk and convert to base64
    const fileBuffer = await fs.readFile(file.path);
    content = fileBuffer.toString(`base64`);
  } catch (e) {
    res.status(500).json({
      message: `Failed to convert file to base64. Error: ${e}`,
    });
    return;
  }

  let response: RestEndpointMethodTypes[`repos`][`createOrUpdateFileContents`][`response`];
  try {
    response = await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: filePath,
      message: `docs(cms): created / updated file "${file.originalname}"`,
      author: {
        name: `TinaCMS GitHub Media Store`,
        email: `nico@ismaili.de`,
      },
      content,
      branch,
      sha: fileSha, // Only needed when updating an existing file
    });
  } catch (e) {
    res.status(500).json({
      message: `Failed to commit file to GitHub. Error: ${e}`,
    });
    return;
  }

  res.status(200).json(response.data);
}

function toMediaListOptions(queryString: string): MediaListOptions {
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
