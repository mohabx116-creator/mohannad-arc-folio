import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SpeedInsights } from "@vercel/speed-insights/react";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { SitePreferencesProvider } from "@/lib/site-preferences";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">404</p>
        <h1 className="mt-4 font-display text-5xl text-foreground">Page not found</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          The page you're looking for has moved or never existed.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center border border-foreground/80 px-6 py-3 text-xs uppercase tracking-[0.3em] text-foreground transition-colors hover:bg-foreground hover:text-background"
          >
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-3xl text-foreground">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="mt-6 border border-foreground px-6 py-3 text-xs uppercase tracking-[0.3em] hover:bg-foreground hover:text-background"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Mohannad El Nady — Architectural Engineering & Interior Design" },
      {
        name: "description",
        content:
          "Portfolio of Mohannad Mohamed El Nady — architectural engineering student and interior designer based in Egypt. Residential facades, interiors, 3D visualization.",
      },
      { name: "author", content: "Mohannad Mohamed El Nady" },
      {
        property: "og:title",
        content: "Mohannad El Nady — Architectural Engineering & Interior Design",
      },
      {
        property: "og:description",
        content:
          "Portfolio of Mohannad Mohamed El Nady — architectural engineering student and interior designer based in Egypt. Residential facades, interiors, 3D visualization.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "Mohannad El Nady — Architectural Engineering & Interior Design",
      },
      {
        name: "twitter:description",
        content:
          "Portfolio of Mohannad Mohamed El Nady — architectural engineering student and interior designer based in Egypt. Residential facades, interiors, 3D visualization.",
      },
      {
        property: "og:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/7b7d42b0-3de8-4698-93b7-f5b8b042d127/id-preview-25c52bdd--cd44bf0d-85f7-447f-861d-368bfe6084b6.lovable.app-1778351517003.png",
      },
      {
        name: "twitter:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/7b7d42b0-3de8-4698-93b7-f5b8b042d127/id-preview-25c52bdd--cd44bf0d-85f7-447f-861d-368bfe6084b6.lovable.app-1778351517003.png",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Inter:wght@300;400;500;600&family=Noto+Naskh+Arabic:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <SitePreferencesProvider>
        <Outlet />
        <Toaster />
        <SpeedInsights />
      </SitePreferencesProvider>
    </QueryClientProvider>
  );
}
