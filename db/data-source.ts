import { DataSource,DataSourceOptions } from "typeorm";
import * as dotenv from 'dotenv';
dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
      type:'postgres',
      host:'localhost',
      port:5432,
      username:process.env.DB_USERNAME,
      password:process.env.db_password,
      database:'spotify',
      entities:["dist/**/*.entity.js"],
      synchronize:false,
      migrations: ["dist/db/migrations/*.js"]
}

const datasource = new DataSource(dataSourceOptions)
export default datasource