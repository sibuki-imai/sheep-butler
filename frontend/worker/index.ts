interface Env {
  VITE_BEAPI: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/api/")) {
      const target = new URL(env.VITE_BEAPI);

      target.pathname = url.pathname;
      target.search = url.search;

      return fetch(new Request(target.toString(), request));
    }

    return new Response("Not Found", { status: 404 });
  },
};
