import {
    IsNotEmpty,
    IsString,
    IsBoolean,
    IsOptional,
    IsNumber,
    IsMongoId,
} from 'class-validator';
import {
    ICreateBook,
    IUpdateBook,
    IUpsertBook,
    IWriter
} from '@nx-emma-indiv/shared/api';

export class CreateBookDto implements ICreateBook {

    @IsOptional()
    @IsString()
    _id?: string;

    @IsString()
    @IsNotEmpty()
    titel!: string;

    @IsString()
    @IsNotEmpty()
    cover!: string;

    @IsNotEmpty()
    publiceerdatum!: Date;

    @IsString()
    @IsNotEmpty()
    beschrijving!: string;

    @IsNumber()
    @IsNotEmpty()
    paginas!: number;

    @IsNotEmpty()
    schrijver!: IWriter;

    @IsString()
    @IsNotEmpty()
    genre!: string;

    @IsString()
    @IsNotEmpty()
    origineletaal!: string;

    @IsString()
    @IsNotEmpty()
    creatorID!: string;
}

export class UpsertBookDto implements IUpsertBook {
    @IsMongoId()
    @IsNotEmpty()
    _id!: string;

    @IsString()
    @IsNotEmpty()
    titel!: string;

    @IsString()
    @IsNotEmpty()
    cover!: string;

    @IsNotEmpty()
    publiceerdatum!: Date;

    @IsString()
    @IsNotEmpty()
    beschrijving!: string;

    @IsNumber()
    @IsNotEmpty()
    paginas!: number;

    @IsNotEmpty()
    schrijver!: IWriter;

    @IsString()
    @IsNotEmpty()
    genre!: string;

    @IsString()
    @IsNotEmpty()
    origineletaal!: string;

    @IsString()
    @IsNotEmpty()
    creatorID!: string;
}

export class UpdateBookDto implements IUpdateBook {
    _id?: string | undefined;

    @IsString()
    @IsNotEmpty()
    cover!: string;

    @IsString()
    @IsNotEmpty()
    titel!: string;

    @IsString()
    @IsNotEmpty()
    beschrijving!: string;
    
    @IsString()
    @IsNotEmpty()
    genre!: string;

    @IsString()
    @IsNotEmpty()
    origineletaal!: string;

    @IsNotEmpty()
    publiceerdatum!: Date;

    @IsNotEmpty()
    schrijver!: IWriter;

    @IsNumber()
    @IsNotEmpty()
    paginas!: number;

    @IsBoolean()
    @IsOptional()
    completed!: boolean;
}
