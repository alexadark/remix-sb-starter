import { json, type LinksFunction, type MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { storyblokInit, apiPlugin } from "@storyblok/react";
import Feature from "./components/Feature";
import Grid from "./components/Grid";
import Page from "./components/Page";
import Teaser from "./components/Teaser";
import styles from "./styles/tailwind.css";
import Layout from "./components/Layout";
import { invariantResponse } from "./utils";
import { GeneralErrorBoundary } from "./components/GeneralErrorBoundary";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

const isServer = typeof window === "undefined";

const accessToken = isServer
  ? process.env.STORYBLOK_PREVIEW_TOKEN
  : //@ts-ignore
    window.env.STORYBLOK_PREVIEW_TOKEN;

export async function loader() {
  invariantResponse(
    accessToken,
    "You need to provide an access token to interact with Storyblok API.",
    {
      status: 401,
    }
  );
  return json({ env: process.env.STORYBLOK_PREVIEW_TOKEN });
}

const components = {
  feature: Feature,
  grid: Grid,
  teaser: Teaser,
  page: Page,
};

storyblokInit({
  accessToken,
  use: [apiPlugin],
  components,
});

export const meta: MetaFunction = () => [
  { charset: "utf-8" },
  { name: "viewport", content: "width=device-width,initial-scale=1" },
  { name: "title", content: "New Remix App" },
];

const Document = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>

      <body>
        <Layout>{children}</Layout>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
};

export default function App() {
  const { env } = useLoaderData<typeof loader>();
  return (
    <Document>
      <Outlet />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.env = ${JSON.stringify(env)}`,
        }}
      />
    </Document>
  );
}
export function getErrorMessage(error: unknown) {
  if (typeof error === "string") return error;
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }
  console.error("Unable to get error message for error", error);
  return "Unknown Error";
}

export function ErrorBoundary() {
  return (
    <Document>
      <div className="flex-1">
        <GeneralErrorBoundary />
      </div>
    </Document>
  );
}
