import type { Request, RequestHandler, Response } from 'express';

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

    switch (req.method) {
      case `GET`:
        res.status(500).json({ message: `GET Method not implemented.` });
        return;
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
