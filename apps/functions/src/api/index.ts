import cors from "cors";
import express from "express";

import assistancesRoutes from "./assistances/routes/assistances.routes";
import quotationsRoutes from "./quotations/routes/quotations.routes";
import usersRoutes from "./users/routes/users.routes";

const app: express.Application = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.get("/", (req, res) => res.status(200).send("Welcome!").end());

app.use("/users", usersRoutes);
app.use("/assistances", assistancesRoutes);
app.use("/quotations", quotationsRoutes);

export { app };
