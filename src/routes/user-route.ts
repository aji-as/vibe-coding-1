import { Elysia, t } from "elysia";
import { register, login, getCurrent, logout } from "../services/user-service";

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
  )
  .post(
    "/api/users/login",
    async ({ body, set }) => {
      try {
        const result = await login(body);
        return result;
      } catch (error) {
        set.status = 400; // Original spec says 400 or error body as per issue
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
  )
  .get("/api/users/current", async ({ headers, set }) => {
    const auth = headers["authorization"];

    if (!auth || !auth.startsWith("Bearer ")) {
      set.status = 401;
      return { error: "Unauthorized" };
    }

    const token = auth.slice(7);

    try {
      const result = await getCurrent(token);
      return result;
    } catch (error) {
      set.status = 401;
      return { error: "Unauthorized" };
    }
  })
  .get("/api/users/logout", async ({ headers, set }) => {
    const auth = headers["authorization"];

    if (!auth || !auth.startsWith("Bearer ")) {
      set.status = 401;
      return { error: "Unauthorized" };
    }

    const token = auth.slice(7);

    try {
      const result = await logout(token);
      return result;
    } catch (error) {
      set.status = 401;
      return { error: "Unauthorized" };
    }
  });
