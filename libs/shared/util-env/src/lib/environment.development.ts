import { IEnvironment } from './environment.interface';

export const environment: IEnvironment = {
  production: false,
  dataApiUrl: 'http://localhost:3000',
  mongo: 'mongodb+srv://emma30121998:BRAmNA5pzY4kwjnb@cluster0.xlhirv9.mongodb.net/',
  neo4j: {
    scheme: 'neo4j',
    host: 'localhost',
    password: 'Books123', 
    username: 'neo4j',
    database: 'neo4j',
    port: 7687
  }
};