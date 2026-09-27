interface Env {
  VITE_BEAPI: string;
  ASSETS: {
    fetch(request: Request): Promise<Response>;
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    console.log("=== WORKER START ===");
    console.log("PATH:", url.pathname);
    console.log("VITE_BEAPI exists:", !!env.VITE_BEAPI);
    console.log("VITE_BEAPI length:", env.VITE_BEAPI?.length ?? 0);
    console.log(
      "VITE_BEAPI startsWith https:",
      env.VITE_BEAPI?.startsWith("https://") ?? false,
    );

    if (url.pathname.startsWith("/api/")) {
      console.log("=== API ROUTE ===");

      const target = new URL(env.VITE_BEAPI);

      console.log("TARGET HOST:", target.host);
      console.log("TARGET PROTOCOL:", target.protocol);

      target.pathname = url.pathname;
      target.search = url.search;

      console.log("TARGET URL:", target.toString());

      return fetch(new Request(target.toString(), request));
    }

    return env.ASSETS.fetch(request);
  },
};
