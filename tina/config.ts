import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch = process.env.GITHUB_BRANCH || process.env.HEAD || "main";

const collectionsBasePath = "content";

export default defineConfig({
  branch,

  clientId: null,
  token: null,

  build: {
    outputFolder: ".",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "assets",
      publicFolder: "public",
    },
  },
  // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/schema/
  schema: {
    collections: [
      {
        name: "certificate",
        label: "Certificates",
        path: `${collectionsBasePath}/certificates`,
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            required: true,
          },
          {
            type: "rich-text",
            name: "info",
            label: "Info",
          },
          {
            type: "string",
            name: "issuer",
            label: "Issuer",
            required: true,
          },
          {
            type: "datetime",
            name: "receivedOn",
            label: "Received on",
            required: true,
          },
          {
            type: "datetime",
            name: "validUntil",
            label: "Valid until",
          },
          {
            type: "image",
            name: "certificate",
            label: "Certificate",
          },
          {
            type: "string",
            name: "url",
            label: "Url",
          },
        ],
      },
      {
        name: "education",
        label: "Education",
        path: `${collectionsBasePath}/educations`,
        fields: [
          {
            name: "institute",
            label: "Institute",
            type: "string",
            required: true,
          },
          {
            name: "degree",
            label: "Degree",
            type: "string",
            required: true,
          },
          {
            name: "start",
            label: "Start date",
            type: "datetime",
            required: true,
          },
          {
            name: "end",
            label: "End date",
            type: "datetime",
          },
          {
            name: "grade",
            label: "Grade",
            type: "string",
            required: true,
          },
          {
            name: "url",
            label: "Url",
            type: "string",
          },
          {
            name: "record",
            label: "Transcript of records",
            type: "image",
          },
        ],
      },
      {
        name: "interest",
        label: "Interests",
        path: `${collectionsBasePath}/interests`,
        fields: [
          {
            name: "title",
            label: "Title",
            type: "string",
            required: true,
          },
        ],
      },
      {
        name: "language",
        label: "Languages",
        path: `${collectionsBasePath}/languages`,
        fields: [
          {
            name: "name",
            label: "Name",
            type: "string",
            required: true,
          },
          {
            name: "flag",
            label: "Flag",
            type: "image",
            required: true,
          },
          {
            name: "certificate",
            label: "Certificate",
            type: "image",
          },
        ],
      },
    ],
  },
});
