import { Elysia } from "elysia";
import { userRoute } from "./routes/user-route";

const app = new Elysia()
  .get("/", () => ({ message: "Hello World 🚀" }))
  .use(userRoute)
  .listen(3000);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
