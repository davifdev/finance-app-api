import "dotenv/config";
import { app } from "./app.js";

app.listen(process.env.PORT, "0.0.0.0", () => {
  console.log(`Server is running at http://localhost:${process.env.PORT}`);
});
