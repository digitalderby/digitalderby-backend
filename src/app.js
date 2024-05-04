"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.args = void 0;
require("dotenv/config");
var express_1 = require("express");
var node_http_1 = require("node:http");
var gameServer_js_1 = require("./game/gameServer.js");
require("./config/database.js");
var cors_1 = require("cors");
var cors_js_1 = require("./cors.js");
var morgan_1 = require("morgan");
var admin_js_1 = require("./routes/admin.js");
var auth_js_1 = require("./routes/auth.js");
var horses_js_1 = require("./routes/horses.js");
var users_js_1 = require("./routes/users.js");
var races_js_1 = require("./routes/races.js");
var body_parser_1 = require("body-parser");
var swagger_ui_express_1 = require("swagger-ui-express");
var yamljs_1 = require("yamljs");
var globalsettings_js_1 = require("./config/globalsettings.js");
var admin_js_2 = require("./auth/admin.js");
exports.args = {
    readOnly: false,
};
if (exports.args['read-only']) {
    console.log('Read-only mode enabled');
    exports.args.readOnly = true;
}
var app = (0, express_1.default)();
exports.server = (0, node_http_1.createServer)(app);
var PORT = process.env.PORT || 3000;
app.use((0, morgan_1.default)('dev'));
app.use((0, cors_1.default)(cors_js_1.default));
app.use(body_parser_1.default.json());
app.get('/', function (_req, res) {
    res.json({ message: 'this is the index route, the server is working' });
});
app.use('/admin', admin_js_1.default);
app.use('/auth', auth_js_1.default);
app.use('/horses', horses_js_1.default);
app.use('/users', users_js_1.default);
app.use('/races', races_js_1.default);
var swaggerOptions = {
    swaggerOptions: {
        supportedSubmitMethods: [],
    },
};
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(yamljs_1.default.load('./api-docs.yaml'), swaggerOptions));
await (0, admin_js_2.default)();
gameServer_js_1.default.createServer(exports.server);
if (globalsettings_js_1.AUTOSTART) {
    gameServer_js_1.default.startMainLoop();
}
exports.server.listen(PORT, function () {
    console.log("listening at http://localhost:".concat(PORT));
    console.log("Access api documentation at http://localhost:".concat(PORT, "/api-docs"));
});
