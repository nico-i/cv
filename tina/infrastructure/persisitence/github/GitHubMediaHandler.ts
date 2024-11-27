import { Octokit, type RestEndpointMethodTypes } from '@octokit/rest';
import type { Request, RequestHandler, Response } from 'express';
import * as fs from 'fs/promises';
import multer from 'multer';
import path from 'path';
import type { Media, MediaListOptions } from 'tinacms';
import { promisify } from 'util';
import { isGitHubFile, toMedia } from '../../../domain/entities/GitHubFile';

const directoryInitFilename = `.gitkeep`;

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

const commitAuthor = {
  name: `TinaCMS GitHub Media Store`,
  email: `nico@ismaili.de`,
};

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
        deleteMedia(req, res, config, octokit);
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
    const mediaListOptions = toMediaListOptions(queryStr);

    const contentPath = path.join(
      config.basePath,
      mediaListOptions?.directory || ``,
    );
    const { owner, repo, branch } = config;

    let allMedia: Media[] = [];
    try {
      const contentRes = await octokit.repos.getContent({
        owner,
        repo,
        path: contentPath,
        headers: {
          'X-GitHub-Api-Version': `2022-11-28`,
          accept: `application/vnd.github+json`,
        },
      });

      const { data: allGhFiles } = contentRes;

      if (!Array.isArray(allGhFiles)) {
        res.status(500).json({
          message: `Received invalid response from GitHub repo. Expected array, got ${typeof allGhFiles}`,
        });
        return;
      }

      allMedia = allGhFiles.map((ghFile) => toMedia(ghFile, config.basePath));
    } catch (e) {
      if (
        typeof e === `object` &&
        e !== null &&
        `status` in e &&
        e.status === 404
      ) {
        if (mediaListOptions.directory === undefined) {
          res.status(400).json({
            message: `Media not found in GitHub repo and no new directory specified`,
          });
          return;
        }
        // Directory doesn't exist in the repo yet so we create it
        const createDirRes = await octokit.repos.createOrUpdateFileContents({
          owner,
          repo,
          path: path.join(
            config.basePath,
            mediaListOptions.directory,
            directoryInitFilename,
          ),
          message: `docs(cms): created directory "${mediaListOptions.directory} [skip ci]"`,
          author: commitAuthor,
          committer: commitAuthor,
          content: ``,
          branch,
        });

        const { content: ghFileRes } = createDirRes.data;
        if (!isGitHubFile(ghFileRes)) {
          res.status(500).json({
            message: `Received invalid response from GitHub. Expected GitHub file, got ${JSON.stringify(
              createDirRes.data,
              null,
              2,
            )}`,
          });
          return;
        }

        const ghFile = toMedia(ghFileRes, config.basePath);

        allMedia = [ghFile];
      } else {
        res.status(500).json({
          message: `Failed to get content from GitHub repo. Response: ${e}`,
        });
        return;
      }
    }

    // if (mediaListOptions?.filesOnly) {
    //   allMedia = allMedia.filter((media) => media.type === `file`);
    // }

    allMedia = allMedia.filter(
      (media) => media.filename !== directoryInitFilename,
    );

    res.json(allMedia);
  } catch (e) {
    res.status(500).json({
      message: `Failed to get content from GitHub repo. Response: ${e}`,
    });
  }
}

async function deleteMedia(
  req: Request,
  res: Response,
  config: GitHubMediaHandlerConfig,
  octokit: Octokit,
) {
  try {
    const { query } = req;

    const queryFilePath = query[`path`];
    if (!queryFilePath || typeof queryFilePath !== `string`) {
      res.status(400).json({
        message: `Invalid "path" query parameter`,
      });
      return;
    }

    const querySha = query[`sha`];
    if (!querySha || typeof querySha !== `string`) {
      res.status(400).json({
        message: `Invalid "sha" query parameter`,
      });
      return;
    }

    const filePath = path.join(config.basePath, queryFilePath);

    try {
      const { owner, repo, branch } = config;
      await octokit.repos.deleteFile({
        owner,
        repo,
        branch,
        path: filePath,
        sha: querySha,
        message: `docs(cms): deleted file "${queryFilePath}" [skip ci]`,
        author: commitAuthor,
        committer: commitAuthor,
      });
    } catch (e) {
      res.status(500).json({
        message: `Failed to delete file from GitHub. Error: ${e}`,
      });
      return;
    }
    res.status(200).json({ message: `File deleted successfully` });
    return;
  } catch (e) {
    res.status(500).json({
      message: `Failed to delete file. Error: ${e}`,
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

  // check if the folder contains a .gitkeep file
  const folderPath = path.join(basePath, directory);
  const folderFiles = await octokit.repos.getContent({
    owner,
    repo,
    path: folderPath,
    ref: branch,
  });

  if (Array.isArray(folderFiles.data)) {
    const gitkeepFile = folderFiles.data?.find(
      (file) => file.name === directoryInitFilename,
    );
    if (gitkeepFile) {
      await octokit.repos.deleteFile({
        owner,
        repo,
        branch,
        message: `docs(cms): deleted "${directoryInitFilename}" placeholder in "${directory}" [skip ci]`,
        author: commitAuthor,
        committer: commitAuthor,
        path: path.join(directory, directoryInitFilename),
        sha: gitkeepFile.sha,
      });
    }
  }

  let fileContent: string;
  try {
    // Read file from disk and convert to base64
    const fileBuffer = await fs.readFile(file.path);
    fileContent = fileBuffer.toString(`base64`);
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
      message: `docs(cms): created / updated file "${file.originalname} [skip ci]"`,
      author: commitAuthor,
      committer: commitAuthor,
      content: fileContent,
      branch,
      sha: fileSha, // Only needed when updating an existing file
    });
  } catch (e) {
    res.status(500).json({
      message: `Failed to commit file to GitHub. Error: ${e}`,
    });
    return;
  }

  const { content: ghFileRes } = response.data;
  if (!isGitHubFile(ghFileRes)) {
    res.status(500).json({
      message: `Received invalid response from GitHub. Expected GitHub file, got ${JSON.stringify(
        response.data,
        null,
        2,
      )}`,
    });
    return;
  }

  const ghFile = toMedia(ghFileRes, basePath);
  res.status(200).json(ghFile);
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
