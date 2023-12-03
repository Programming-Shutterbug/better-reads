import { Id } from './id.type';

export interface IWriter {
    _id: Id;
    profielFoto: string;
    schrijvernaam: string;
    geboortedatum: Date;
    bio: string;
    geboorteplaats: string;
    moedertaal: string;
}

export type ICreateWriter = Pick<IWriter,
    'schrijvernaam' | 'geboortedatum' | 'bio' | 'geboorteplaats' | 'moedertaal'
>;

export type IUpdateWriter = Partial<Omit<IWriter, '_id'>>;
export type IUpsertWriter = IWriter;
