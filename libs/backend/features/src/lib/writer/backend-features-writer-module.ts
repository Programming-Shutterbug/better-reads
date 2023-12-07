import { Module } from '@nestjs/common';
import { WriterController } from './writer.controller';
import { WriterService } from '../writer.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Writer, WriterSchema } from './writer.schema';
import { User, UserSchema } from '../user/user.schema';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Writer.name, schema: WriterSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
controllers: [WriterController],
  providers: [WriterService],
  exports: [WriterService],
})
export class BackendFeaturesWriterModule {}
