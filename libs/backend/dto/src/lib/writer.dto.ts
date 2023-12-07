import {
    IsNotEmpty,
    IsString,
    IsBoolean,
    IsOptional,
    IsMongoId,
} from 'class-validator';
import {
    ICreateWriter,
    IUpdateWriter,
    IUpsertWriter
} from '@nx-emma-indiv/shared/api';

/**
 * Use the `Pick` utility type to extract only the properties we want for
 * new to-do items
 */
export class CreateWriterDto implements ICreateWriter {

    @IsOptional()
    @IsString()
    _id?: string;

    @IsString()
    @IsNotEmpty()
    schrijvernaam!: string;

    @IsString()
    @IsNotEmpty()
    profielFoto!: string;

    @IsString()
    @IsNotEmpty()
    bio!: string;

    @IsNotEmpty()
    geboortedatum!: Date;

    @IsString()
    @IsNotEmpty()
    geboorteplaats!: string;

    @IsString()
    @IsNotEmpty()
    moedertaal!: string;

    @IsString()
    @IsNotEmpty()
    creatorID!: string;
}

export class UpsertWriterDto implements IUpsertWriter {
    @IsMongoId()
    @IsNotEmpty()
    _id!: string;

    @IsString()
    @IsNotEmpty()
    profielFoto!: string;

    @IsString()
    @IsNotEmpty()
    schrijvernaam!: string;

    @IsString()
    @IsNotEmpty()
    bio!: string;

    @IsNotEmpty()
    geboortedatum!: Date;

    @IsString()
    @IsNotEmpty()
    geboorteplaats!: string;

    @IsString()
    @IsNotEmpty()
    moedertaal!: string;

    @IsString()
    @IsNotEmpty()
    creatorID!: string;
}

export class UpdateWriterDto implements IUpdateWriter {
    _id?: string | undefined;
    
    @IsString()
    @IsNotEmpty()
    profielFoto!: string;

    @IsString()
    @IsNotEmpty()
    schrijvernaam!: string;

    @IsString()
    @IsNotEmpty()
    bio!: string;

    @IsNotEmpty()
    geboortedatum!: Date;

    @IsString()
    @IsNotEmpty()
    geboorteplaats!: string;

    @IsString()
    @IsNotEmpty()
    moedertaal!: string;

    @IsBoolean()
    @IsOptional()
    completed!: boolean;
}
