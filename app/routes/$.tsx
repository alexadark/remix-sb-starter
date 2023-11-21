import { type LoaderFunctionArgs, json } from "@remix-run/node";
import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";

import {
  getStoryblokApi,
  useStoryblokState,
  StoryblokComponent,
} from "@storyblok/react";

import { invariantResponse } from "~/utils";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  let slug = params["*"] ?? "home";

  let sbParams = {
    version: "draft",
  };

  let { data } = await getStoryblokApi().get(`cdn/stories/${slug}`, sbParams);

  invariantResponse(data, `page ${slug} does not exist`, {
    status: 404,
  });
  const story = data?.story;
  return json({
    story,
  });
};

export default function Page() {
  let { story } = useLoaderData();
  story = useStoryblokState(story);

  return (
    <>
      <StoryblokComponent blok={story.content} />
    </>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return (
      <div className="bg-green-500">
        {error.status} {error.data}
      </div>
    );
  } else {
    return <div className="bg-red-500">{JSON.stringify(error)}</div>;
  }
}
