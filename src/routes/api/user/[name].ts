import { createRoute } from "honox/factory";

export default createRoute((c) => c.json(c.req.param()));
