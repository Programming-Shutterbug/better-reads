export interface IEnvironment {
    production: boolean;
    dataApiUrl: string;
    mongo: string;
    neo4j: {
        scheme: string;
        host: string;
        password: string;
        username: string;
        database: string;
        port: number;
    };
}