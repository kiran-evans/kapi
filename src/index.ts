'use strict';

import dotenv from 'dotenv';
import http from 'http';
import path from 'path';
import { Pool } from 'pg';
dotenv.config();

import { expressAppConfig } from 'oas3-tools';
const serverPort = 8080;

// swaggerRouter configuration
const options: any = {
    routing: {
        controllers: path.join(__dirname, './controllers')
    },
};

const appConfig = expressAppConfig(path.join(__dirname, '../lib/api/openapi.yaml'), options);
const app = appConfig.getApp();

// Configure pg
export const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: process.env.DB_PW,
    port: 5432
});

// Initialize the Swagger middleware
http.createServer(app).listen(serverPort, function () {
    console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
    console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
});

