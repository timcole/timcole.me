/** @jsx h */
import { Head } from "$fresh/runtime.ts";
import { Fragment, h } from "preact";
import { apply, tw } from "@twind";
import { css } from "twind/css";
import { Handlers, PageProps } from "$fresh/server.ts";

import AboutMe from "../components/about.tsx";
import Positions from "../components/positions.tsx";
import Footer from "../components/footer.tsx";

import Lanyard from "../islands/Lanyard.tsx";
import { Props } from "../islands/Launch.tsx";

const a = css({
  ":global": {
    "html": apply`bg-gray-200 dark:bg-gray-800`,
  },
});

export default function Home({ data }: PageProps<Props>) {
  return (
    <Fragment>
      <Head>
        <title>Timothy Cole - Software Engineer</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🦄</text></svg>"
        />
        <meta
          name="keywords"
          content="Software Engineer, Full Stack Developer, Web Developer, Programmer"
        />
        <meta name="description" content="Timothy Cole - Software Engineer" />
        <meta name="author" content="Timothy Cole" />
        <meta name="copyright" content="Timothy Cole" />
        <meta name="rating" content="General" />
        <meta name="url" content="https://timcole.me" />
        <meta name="twitter:creator" content="@ModestTim" />
        <meta name="twitter:site" content="@ModestTim" />

        <link rel="dns-prefetch" href="https://tim.rip/" />
        <link rel="dns-prefetch" href="https://api.lanyard.rest/" />
        <link rel="dns-prefetch" href="https://i.scdn.co/" />
        <link rel="dns-prefetch" href="https://img.shields.io" />
      </Head>
      <div
        class={tw`min-h-screen flex flex-col sm:pb-0 pb-[100px] ${a}`}
      >
        <AboutMe {...data} />
        <Positions />
        <Footer />
      </div>
      <Lanyard />
    </Fragment>
  );
}

const nextLaunchQuery = `
query {
  launches(
    limit: 1
    orderBy: {field: net, direction: ASC}
    filters: [{field: net, operation: gt, date: "NOW()"}]
  ) {
    id
    net
    status
    vehicle {
      image
    }
  }
}
`;

export const handler: Handlers<Props> = {
  async GET(_, ctx) {
    const {
      data: { launches },
    } = await fetch(`http://booster-external-service.ix-booster`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ query: nextLaunchQuery }),
    }).then((data) => data.json());

    return ctx.render(launches.shift());
  },
};
