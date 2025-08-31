export class ApiError extends Error {
  constructor(
    public status: number, 
    message: string, 
    public info?: unknown
  ) {
    super(message);
  }
}

export const handle = (fn: (req: Request) => Promise<Response>) => 
  async (req: Request) => {
    try {
      return await fn(req);
    } catch (e: any) {
      const s = typeof e?.status === 'number' ? e.status : 500;
      return new Response(
        JSON.stringify({
          error: e?.message ?? 'Internal Server Error',
          info: e?.info
        }),
        {
          status: s,
          headers: { 'content-type': 'application/json' }
        }
      );
    }
  };
