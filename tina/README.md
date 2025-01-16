# CV Client

This package provides a TinaCMS database client and corresponding generated types to fetch CV data from my TinaCMS database.

## Environment Variables

To run this package, you will need to set the following environment variables:

- `GITHUB_BRANCH` - The branch which TinaCMS is using to store cv content
- `GITHUB_REPO` - The repository which TinaCMS is using to store cv content
- `GITHUB_OWNER` - The owner of the repository which TinaCMS is using to store cv content
- `GITHUB_PERSONAL_ACCESS_TOKEN` - A personal access token with read access to the repository which TinaCMS is using to store cv content
- `MONGODB_URI` - The URI of the MongoDB database which TinaCMS is using to index cv content

*Note: `IS_LOCAL_ENV` can also be set but, when not working in the host repo of this pkg this variable MUST ALWAYS either be omitted completely or set to `false`.*
