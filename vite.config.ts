// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { renderErrorPage } from "./src/lib/error-page";

export default defineConfig({
  plugins: [
    {
      name: "invitation-malformed-path",
      configureServer(server) {
        server.middlewares.use((request, response, next) => {
          try {
            decodeURIComponent((request.url ?? "/").split("?")[0] ?? "/");
            next();
          } catch {
            response.statusCode = 404;
            response.setHeader("Content-Type", "text/html; charset=utf-8");
            response.end(renderErrorPage(true));
          }
        });
      },
    },
  ],
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
