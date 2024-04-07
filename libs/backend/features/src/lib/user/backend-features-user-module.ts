import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from '../user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { Book, BookSchema } from '../book/book.schema';
import { ConfigModule } from '@nestjs/config';
import { NeoModule } from '../neo/neo.module';
import { Neo4Service } from '../neo.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Book.name, schema: BookSchema },
        ]),
        ConfigModule,
        NeoModule
    ],
    controllers: [UserController],
    providers: [UserService, Neo4Service],
    exports: [UserService]
})
export class BackendFeaturesUserModule {}