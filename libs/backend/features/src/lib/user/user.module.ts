import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from '../user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { ConfigModule } from '@nestjs/config/dist';
import { NeoModule } from '../neo/neo.module';
import { Neo4Service } from '../neo.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        ConfigModule,
        NeoModule
    ],
    controllers: [UserController],
    providers: [UserService, Neo4Service],
    exports: [UserService]
})
export class UsersModule {}