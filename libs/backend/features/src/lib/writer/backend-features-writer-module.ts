import { Module } from '@nestjs/common';
import { WriterController } from './writer.controller';
import { WriterService } from '../writer.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Writer, WriterSchema } from './writer.schema';
import { User, UserSchema } from '../user/user.schema';
import { ConfigModule } from '@nestjs/config';
import { NeoModule } from '../neo/neo.module';
import { Neo4Service } from '../neo.service';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Writer.name, schema: WriterSchema },
      { name: User.name, schema: UserSchema },
    ]),
    ConfigModule,
    NeoModule
  ],
  controllers: [WriterController],
  providers: [WriterService, Neo4Service],
  exports: [WriterService],
})
export class BackendFeaturesWriterModule {}
