import { args } from "./app.js";
export async function disabledInReadOnlyMode(req, res, next) {
    if (args.readOnly) {
        res.status(400).json('Cannot perform operation in read-only mode.');
    }
    else {
        next();
    }
}
