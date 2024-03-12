// @refresh reload
import "@unocss/reset/tailwind-compat.css";
import "virtual:uno.css";

import { Toast } from "@kobalte/core";
// import { ThemeProvider } from "./components/ThemeController";

import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import { ThemeControllerButton, ThemeProvider } from "./components/ThemeController";

// entry-server classes:
// min-h-screen w-full bg-neutral-100 transition-colors duration-100 dark:bg-neutral-800 font-sans

export default function App() {
  return (
    <ThemeProvider>
      <div class="absolute right-0 top-0 flex items-center gap-2 p-4">
        <ThemeControllerButton />
      </div>
      <Router root={(props) => <Suspense>{props.children}</Suspense>}>
        <FileRoutes />
      </Router>
      <Toast.Region>
        <Toast.List class="fixed bottom-0 right-0 z-9999 max-w-full w-100 flex flex-col gap-2 p-4 outline-none" />
      </Toast.Region>
    </ThemeProvider>
  );
}
