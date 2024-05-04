"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hrTimeMs = void 0;
function hrTimeMs() {
    var raw = process.hrtime.bigint();
    return raw / 1000000n;
}
exports.hrTimeMs = hrTimeMs;
