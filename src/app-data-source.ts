import "reflect-metadata";
import { DataSource, DataSourceOptions } from "typeorm"
import { UsuarioEntity } from './classes/entities/UsuarioEntity';
import { ProdutoEntity } from './classes/entities/ProdutoEntity';

const config: DataSourceOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '091528',
    database: 'postgres',
    synchronize: true,
    logging: true,
    entities: [UsuarioEntity, ProdutoEntity],
  }

const myDataSource = new DataSource(config)

myDataSource.initialize()
  .then(async () => {
    console.log("Connection initialized with database...");
  })
  .catch((error) => console.log(error));

const getDataSource = (delay = 3000): Promise<DataSource> => {
  if (myDataSource.isInitialized) return Promise.resolve(myDataSource);

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (myDataSource.isInitialized){
        resolve(myDataSource);
      }else reject("Failed to create connection with database");
    }, delay);
  });
};

export {
    config,
    myDataSource,
    getDataSource
}