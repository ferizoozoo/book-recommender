import * as dotenv from 'dotenv';
dotenv.config();
import { DataSourceOptions } from "typeorm";

const typeORMConfig: DataSourceOptions = {
    type: process.env.DB_TYPE as "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432", 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: process.env.DB_SYNCHRONIZE === "true",
    logging: process.env.DB_LOGGING === "true",
    // ... other TypeORM options like ssl, migrations, subscribers, etc.
};

console.log(typeORMConfig);

export default typeORMConfig;