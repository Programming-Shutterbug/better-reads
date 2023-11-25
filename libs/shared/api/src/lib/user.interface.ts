import { Id } from './id.type';

export interface IUser {
    id: Id;
    naam: string;
    email: string;
    geboortedatum: Date;
    straatnaam: string;
    huisnummer: number;
    stad: string;
}

export type ICreateUser = Pick<IUser,
    'naam' | 'email' | 'geboortedatum' | 'straatnaam' | 'huisnummer' | 'stad'
>;

export type IUpdateUser = Partial<Omit<IUser, 'id'>>;
export type IUpsertUser = IUser;
