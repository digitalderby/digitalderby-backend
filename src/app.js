"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.args = void 0;
require("dotenv/config");
var express = require("express"); 
var node_http_1 = require("node:http");
require("./config/database.js");
var cors = require("cors");
var morgan = require("morgan");
var admin_js_1 = require("./routes/admin.js");
var auth_js_1 = require("./routes/auth.js");
var horses_js_1 = require("./routes/horses.js");
var users_js_1 = require("./routes/users.js");
var races_js_1 = require("./routes/races.js");
var http_js_1 = require("./routes/http.js");
var bodyParser = require("body-parser");
var swagger_ui_express_1 = require("swagger-ui-express");
var yamljs_1 = require("yamljs");
exports.args = {
    readOnly: false,
};
if (exports.args['read-only']) {
    console.log('Read-only mode enabled');
    exports.args.readOnly = true;
}
var app = express(); 
exports.server = (0, node_http_1.createServer)(app);
var PORT = process.env.PORT || 3000;
var corsSettings = {
    credentials: true,
    origin: [
        'http://localhost:5173',
    ]
};
app.use(morgan('dev'));
app.use(cors(corsSettings));
app.use(bodyParser.json());
app.get('/', function (_req, res) {
    res.json({ message: "this is the index route, the server is working" });
});
app.use('/admin', admin_js_1.default);
app.use('/auth', auth_js_1.default);
app.use('/horses', horses_js_1.default);
app.use('/users', users_js_1.default);
app.use('/races', races_js_1.default);
app.use('/http', http_js_1.default);
var swaggerOptions = {
    swaggerOptions: {
        supportedSubmitMethods: [],
    }
};
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(yamljs_1.default.load('./api-docs.yaml'), swaggerOptions));
exports.server.listen(PORT, function () {
    console.log("listening at http://localhost:".concat(PORT));
});
