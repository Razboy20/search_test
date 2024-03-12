import { StartServer, createHandler } from "@solidjs/start/server";
import { getCookie } from "vinxi/http";
import logo from "~/assets/img/logo.svg";

export default createHandler((ctx) => {
  const theme = getCookie(ctx.nativeEvent, "color-theme") ?? "dark";

  return (
    <StartServer
      document={({ assets, children, scripts }) => (
        <html lang="en" class="font-sans" classList={{ dark: theme === "dark" }}>
          <head>
            <title>Search UI Testing</title>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="theme-color" content="#2463eb" />
            <link rel="icon" type="image/svg+xml" href={logo} />
            {assets}
          </head>
          <body class="min-h-screen w-full bg-neutral-100 transition-colors duration-100 dark:bg-neutral-800">
            <div id="app">{children}</div>
            {scripts}
          </body>
        </html>
      )}
    />
  );
});
