import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { IBook, IWriter } from '@nx-emma-indiv/shared/api';

export type BookDocument = Book & Document;

@Schema()
export class Book implements IBook {
    _id!: string;

    @Prop({
        required: true,
    })
    cover!: string;

    @Prop({
        required: true,
    })
    titel!: string;

    @Prop({
        required: true,
    })
    beschrijving!: string;

    @Prop({
        required: true,
    })
    genre!: string;

    @Prop({
        required: true,
    })
    origineletaal!: string;

    @Prop({
        required: true,
    })
    publiceerdatum!: Date;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Writer', // Reference to the Writer model
        required: true,
      })
      schrijver!: IWriter;

    @Prop({
        required: true,
    })
    paginas!: number;

}

export const BookSchema = SchemaFactory.createForClass(Book);