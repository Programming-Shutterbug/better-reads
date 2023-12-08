import { IBook } from "./book.interface";

export enum Leesstatus {
    READ = 'gelezen',
    TO_READ = 'nog te lezen',
    DNF = 'DNF (Did not finish)',
}
  
export interface IBookList {

    boekId: IBook;

    leesstatus: Leesstatus;

}