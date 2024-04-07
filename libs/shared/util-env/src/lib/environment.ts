import { IEnvironment } from './environment.interface';

export const environment: IEnvironment = {
  production: true,
  dataApiUrl: 'https://better-reads.azurewebsites.net',
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