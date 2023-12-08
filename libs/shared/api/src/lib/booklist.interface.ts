import { IBook } from "./book.interface";

export enum Leesstatus {
    READ = 'READ',
    TO_READ = 'TO_READ',
    DNF = 'DNF',
}
  
export interface IBookList {

    boekId: IBook;

    leesstatus: Leesstatus;

}