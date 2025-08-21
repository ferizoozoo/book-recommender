import * as dotenv from 'dotenv';
dotenv.config();
import { DataSourceOptions } from "typeorm";

const typeORMConfig: DataSourceOptions = {
    type: "sqlite",
    database: "src/infrastructure/database/data.sqlite",
    synchronize: false,
    logging: true,
    entities: ["src/infrastructure/database/typeorm/models/*.ts"],
    migrations: ["src/infrastructure/database/typeorm/migrations/*.ts"],
};

export default typeORMConfig;