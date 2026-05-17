"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const lead_routes_1 = __importDefault(require("./routes/lead.routes"));
const errorMiddleware_1 = require("./middlewares/errorMiddleware");
const notFoundMiddleware_1 = require("./middlewares/notFoundMiddleware");
// 1. Load Environment Configs
dotenv_1.default.config();
const app = (0, express_1.default)();
// 2. Logging Middleware
if (process.env.NODE_ENV !== 'production') {
    app.use((0, morgan_1.default)('dev'));
}
else {
    app.use((0, morgan_1.default)('combined'));
}
// 3. CORS Configuration supporting credentials (cookies)
app.use((0, cors_1.default)({
    origin: true, // Echoes the request origin for easy local testing
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
// 4. Request Body Parsers
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// 5. Cookie Parser
app.use((0, cookie_parser_1.default)());
// 6. Healthy Check Route
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Smart Leads MERN backend is active and healthy!',
        timestamp: new Date(),
    });
});
// 7. Base API Route Mappings
app.use('/api/auth', auth_routes_1.default);
app.use('/api/leads', lead_routes_1.default);
// 8. Fallback 404 Route Mismatch
app.use(notFoundMiddleware_1.notFoundMiddleware);
// 9. Centralized Error Boundary Middleware
app.use(errorMiddleware_1.errorMiddleware);
exports.default = app;
