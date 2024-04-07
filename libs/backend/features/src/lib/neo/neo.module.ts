import { Neo4jModule, Neo4jScheme} from "nest-neo4j/dist";
import { environment } from '@nx-emma-indiv/shared/util-env';
import { Module } from "@nestjs/common";
import { Neo4Service } from "../neo.service";


@Module({
    controllers: [],
    providers: [Neo4Service],
    imports: [
        Neo4jModule.forRoot({
            scheme: environment.neo4j.scheme as Neo4jScheme,
            host: environment.neo4j.host,
            password: environment.neo4j.password,
            username: environment.neo4j.username,
            database: environment.neo4j.database,
            port: environment.neo4j.port
        })
    ]
})
export class NeoModule {}
