import { Elysia, t } from "elysia";
import { register } from "../services/user-service";

export const userRoute = new Elysia()
  .post(
    "/api/users",
    async ({ body, set }) => {
      try {
        const result = await register(body);
        return result;
      } catch (error) {
        set.status = 400;
        return {
          error: error instanceof Error ? error.message : "Terjadi kesalahan",
        };
      }
    },
    {
      body: t.Object({
        name: t.String(),
        email: t.String(),
        password: t.String(),
      }),
    }
  );
