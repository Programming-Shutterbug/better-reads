import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Writer as WriterModel, WriterDocument } from './writer/writer.schema';
import { IWriter } from '@nx-emma-indiv/shared/api';
import { CreateWriterDto, UpdateWriterDto } from '@nx-emma-indiv/backend/dto';

@Injectable()
export class WriterService {
    private readonly logger: Logger = new Logger(WriterService.name);

    constructor(
        @InjectModel(WriterModel.name) private writerModel: Model<WriterDocument>
    ) {}

    async findAll(): Promise<IWriter[]> {
        this.logger.log(`Finding all items`);

        const items = await this.writerModel.find();

        return items;
    }

    async findOne(_id: string): Promise<IWriter | null> {
        this.logger.log(`finding writer with id ${_id}`);
    
        // Check if id is null
        if (_id === null || _id === "null") {
            this.logger.debug('ID is null or "null"');
            return null;
        }   

        const item = await this.writerModel.findOne({ _id: _id }).exec(); 

        if (!item) {
            this.logger.debug('Item not found');
        }

        return item;
    }
    

    async findOneByName(schrijvernaam: string): Promise<IWriter | null> {
        this.logger.log(`Finding writer by email}`);

        // Zoek een schrijver in de database op basis van de opgegeven schrijversnaam.
        // Selecteer alle velden behalve het wachtwoord.
        const item = this.writerModel.findOne({ schrijvernaam: schrijvernaam }).select('-password').exec();

        return item;
    }

    async create(writerDto: CreateWriterDto): Promise<IWriter> {
        this.logger.log(`Create writer ${writerDto._id}`);
        
        // Sluit _id expliciet uit
        const { _id, ...writerWithoutId } = writerDto;
        
        const createdItem = await this.writerModel.create(writerWithoutId);
        
        return createdItem;
    }
    
      
    async update(writerId: string, updateWriterDto: UpdateWriterDto): Promise<IWriter> {
        this.logger.log(`Update writer ${writerId}`);

        const existingWriter = await this.writerModel.findById(writerId).exec();
      
        if (!existingWriter) {
          throw new NotFoundException(`Writer with id ${writerId} not found`);
        }
      
        // Update schrijver eigenschappen
        Object.assign(existingWriter, updateWriterDto);
      
        // Save de geupdate schrijver
        const updatedWriter = await existingWriter.save();
      
        return updatedWriter;
    }
    

    async deleteWriter(_id: string): Promise<void> {
      this.logger.log(`Deleting writer with id ${_id}`);

      const deletedItem = await this.writerModel.findByIdAndDelete(_id).exec();

      if (!deletedItem) {
          this.logger.debug('Writer not found for deletion');
          throw new NotFoundException(`Writer with _id ${_id} not found`);
      }

      this.logger.log(`Writer deleted successfully`);
  }
}