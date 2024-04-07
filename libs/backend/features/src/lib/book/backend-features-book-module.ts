import { Module } from '@nestjs/common';
import { BookController } from './book.controller';
import { BookService } from '../book.service';
import { MongooseModule } from '@nestjs/mongoose';

import { Book, BookSchema } from './book.schema';
import { Writer, WriterSchema } from '../writer/writer.schema';
import { WriterService } from '../writer.service';
import { User, UserSchema } from '../user/user.schema';

import { ConfigModule } from '@nestjs/config';
import { NeoModule } from '../neo/neo.module';
import { Neo4Service } from '../neo.service';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Book.name, schema: BookSchema },
      { name: Writer.name, schema: WriterSchema },
      { name: User.name, schema: UserSchema },
    ]),
    ConfigModule,
    NeoModule
  ],
  controllers: [BookController],
  providers: [BookService, WriterService, Neo4Service],
  exports: [BookService],
})
export class BackendFeaturesBookModule {}
