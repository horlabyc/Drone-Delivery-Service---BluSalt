import { DataSource } from "typeorm";
import { Drone } from "../entities/Drone";
import { Medication } from "../entities/medication";
import { DroneMedication } from "../entities/drone-medication";

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'droneuser',
  password: process.env.DB_PASSWORD || 'dronepass',
  database: process.env.DB_NAME || 'dronedb',
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',
  entities: [Drone, Medication, DroneMedication,],
  subscribers: [],
  migrations: [],
});