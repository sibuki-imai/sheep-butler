interface Env {
  VITE_BEAPI: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    console.log("PATH:", url.pathname);
    console.log("VITE_BEAPI exists:", !!env.VITE_BEAPI);

    if (url.pathname.startsWith("/api/")) {
      const target = new URL(env.VITE_BEAPI);

      target.pathname = url.pathname;
      target.search = url.search;

      console.log("TARGET HOST:", target.host);
      console.log("TARGET PATH:", target.pathname);

      return fetch(new Request(target.toString(), request));
    }

    return new Response("Not Found", { status: 404 });
  },
};
