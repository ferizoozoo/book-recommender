import { DataSource } from "typeorm";
import typeORMConfig from "../../config/database.config.ts";

// TODO: for now, the db is initialized whenever it is imported anywhere, either in repo or elsewhere.
//       maybe later, it can be initialized inside the backend/main.ts (where program initialization happens)
//       and used everywhere.

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
