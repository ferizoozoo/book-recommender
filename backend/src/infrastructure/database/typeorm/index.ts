import { DataSource } from "typeorm";
import typeORMConfig from "../../config/database.config.ts";

const AppDataSource = new DataSource({
  ...typeORMConfig,
  entities: [
    process.cwd() + "/src/infrastructure/database/typeorm/models/*.{ts,js}",
  ],
  migrations: [
    process.cwd() + "/src/infrastructure/database/typeorm/migrations/*.{ts,js}",
  ],
  migrationsTableName: "custom_migration_table",
});

export default AppDataSource;
