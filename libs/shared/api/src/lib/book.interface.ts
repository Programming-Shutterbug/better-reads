import { Id } from './id.type';
import { IWriter } from './writer.interface';

export interface IBook {
    _id: Id;
    cover: string;
    titel: string;
    beschrijving: string;
    genre: string;
    origineletaal: string;
    publiceerdatum: Date;
    schrijver: IWriter;
    paginas: number;
    creatorID: string;
}

export type ICreateBook = Pick<IBook,'cover' | 'titel' | 'beschrijving' | 'genre' | 'origineletaal' | 'publiceerdatum' | 'schrijver' | 'paginas' | 'creatorID'>;
export type IUpdateBook = Partial<Omit<IBook, '_id'>>;
export type IUpsertBook = IBook;
