import { Router } from "./route.ts";
import { generateShortCode, getShortLink, storeShortLink } from "./db.ts";

const app = new Router();

app.get("/", () => new Response("Hi Mom!"));

app.post("/health-check", () => new Response("It's ALIVE!"));

app.post("/links", async (req) => {
  const { longUrl } = await req.json();

  const shortCode = await generateShortCode(longUrl);
  await storeShortLink(longUrl, shortCode, "testUser");

  return new Response("success!", {
    status: 201,
  });
});

app.get("/links/:id", async (_req, _info, params) => {
  const shortCode = params?.pathname.groups.id;

  const data = await getShortLink(shortCode!);

  return new Response(JSON.stringify(data), {
    status: 201,
    headers: {
      "content-type": "application/json",
    },
  });
});

export default {
  fetch(req) {
    return app.handler(req);
  },
} satisfies Deno.ServeDefaultExport;

// const routes: Route[] = [
//   {
//     pattern: new URLPattern({ pathname: "/" }),
//     handler: () => new Response("Home page"),
//   },
//   {
//     pattern: new URLPattern({ pathname: "/users/:id" }),
//     handler: (_req, _info, params) => new Response(params?.pathname.groups.id),
//   },
//   {
//     pattern: new URLPattern({ pathname: "/static/*" }),
//     handler: (req) => serveDir(req),
//   },
// ];

// function defaultHandler(_req: Request) {
//   return new Response("Not found", { status: 404 });
// }

// const handler = route(routes, defaultHandler);

// const fetchHandler = {
//   fetch(req: Request) {
//     return handler(req);
//   },
// };

// export default fetchHandler satisfies Deno.ServeDefaultExport;
