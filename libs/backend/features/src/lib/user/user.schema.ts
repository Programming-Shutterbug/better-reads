import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { IUser } from '@nx-emma-indiv/shared/api';
import { IBookList, Leesstatus } from '@nx-emma-indiv/shared/api';

export type UserDocument = User & Document;

@Schema()
export class User implements IUser {
    _id!: string;

    @Prop({
        required: true
    })
    naam!: string;

    @Prop({
        required: true,
        unique: true
    })
    email!: string;

    @Prop({
        required: true
    })
    geboortedatum!: Date;

    @Prop({
        required: true
    })
    straatnaam!: string;

    @Prop({
        required: true
    })
    huisnummer!: number;

    @Prop({
        required: true
    })
    stad!: string;

    @Prop({
        required: true
    })
    password!: string;

    //toegevoegd
    @Prop({
        type: [{
          boekId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
          leesstatus: { type: String, enum: Object.values(Leesstatus), required: true },
        }],
        default: []
      })
      boekenlijst!: IBookList[];
    
    
}

export const UserSchema = SchemaFactory.createForClass(User);