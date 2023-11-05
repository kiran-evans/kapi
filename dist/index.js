"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const cors_1 = __importDefault(require("cors"));
const corsOptions = {
    allowedHeaders: ['Content-Type']
};
app.use((0, cors_1.default)(corsOptions));
app.options('*', (0, cors_1.default)(corsOptions));
const path_1 = __importDefault(require("path"));
app.use('/public', express_1.default.static(path_1.default.join(__dirname, 'public')));
const productRouter_1 = __importDefault(require("./routers/productRouter"));
app.use(productRouter_1.default);
const userRouter_1 = __importDefault(require("./routers/userRouter"));
app.use(userRouter_1.default);
const cartRouter_1 = __importDefault(require("./routers/cartRouter"));
app.use(cartRouter_1.default);
const orderRouter_1 = __importDefault(require("./routers/orderRouter"));
app.use(orderRouter_1.default);
const pg_1 = require("./pg");
(async () => {
    await pg_1.sequelize.authenticate();
    console.log(`[server] connected to '${pg_1.sequelize.getDatabaseName()}'`);
    await pg_1.sequelize.sync();
    console.log(`[server] all models in '${pg_1.sequelize.getDatabaseName()}' synchronised successfully`);
})();
app.listen(process.env.PORT, () => {
    console.log(`[server] server started on PORT=${process.env.PORT}`);
    console.log(`[server] DB_HOST=${process.env.DB_HOST}, DB_PORT=${process.env.DB_PORT}`);
});
