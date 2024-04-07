import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User as UserModel, UserDocument } from './user/user.schema';
import { IUser } from '@nx-emma-indiv/shared/api';
import { CreateUserDto, UpdateUserDto } from '@nx-emma-indiv/backend/dto';
import * as bcrypt from 'bcrypt';
import { Neo4Service } from './neo.service';

@Injectable()
export class UserService {
    private readonly logger: Logger = new Logger(UserService.name);

    constructor(
        @InjectModel(UserModel.name) private userModel: Model<UserDocument>,
        private readonly neo4jService: Neo4Service
    ) {}

    async findAll(): Promise<IUser[]> {
        this.logger.log(`Finding all items`);
        const items = await this.userModel.find();
        return items;
    }

    async findOne(_id: string): Promise<IUser | null> {
        this.logger.log(`finding user with id ${_id}`);
    
        // Check if id is null
        if (_id === null || _id === "null") {
            this.logger.debug('ID is null or "null"');
            return null;
        }   

        const item = await this.userModel.findOne({ _id: _id }).exec(); 

        if (!item) {
            this.logger.debug('Item not found');
        }
        return item;
    }

    async findOneByEmail(email: string): Promise<IUser | null> {
        this.logger.log(`Finding user by email ${email}`);

        const item = this.userModel
            .findOne({ emailAddress: email })
            .select('-password')
            .exec();
        return item;
    }

    async create(userDto: CreateUserDto): Promise<IUser> {
        this.logger.log(`Create user ${userDto}`);
        
        // Sluit _id expliciet uit
        const { _id, ...userWithoutId } = userDto;
      
        // Hash het wachtwoord voordat het wordt opgeslagen
        const hashedPassword = await bcrypt.hash(userDto.password, 10);
      
        const createdUser = await this.userModel.create({
          ...userWithoutId,
          password: hashedPassword, // Voeg het gehashte wachtwoord toe
        });

        this.neo4jService.addOrUpdateUser(createdUser);
      
        return createdUser;
    }
      
        
    async update(userId: string, updateUserDto: UpdateUserDto): Promise<IUser> {
        this.logger.log(`Update user ${userId}`);

        const existingUser = await this.userModel.findById(userId).exec();
      
        if (!existingUser) {
          throw new NotFoundException(`User with id ${userId} not found`);
        }
      
        // Update user gegevens
        Object.assign(existingUser, updateUserDto);
      
        // Sla geupdate user op
        const updatedUser = await existingUser.save();

        this.neo4jService.addOrUpdateUser(updatedUser);
      
        return updatedUser;
    }
    
    async deleteUser(_id: string): Promise<void> {
      this.logger.log(`Deleting user with id ${_id}`);

      const deletedUser = await this.userModel.findByIdAndDelete(_id).exec();

      if (!deletedUser) {
          this.logger.debug('User not found for deletion');
          throw new NotFoundException(`User with _id ${_id} not found`);
      }

      this.neo4jService.deleteUser(deletedUser._id);

      this.logger.log(`User deleted successfully`);
    } 

    async login(email: string, password: string): Promise<IUser> {
        this.logger.log(`User loggin in`);

        try {
            const user = await this.userModel.findOne({ email });
    
            if (!user) {
                throw new Error(`User with email ${email} not found`);
            }
        
            if (!user.password) {
                throw new Error('User object does not have the wachtwoord property set');
            }
    
            // Vergelijk het opgegeven wachtwoord met het opgeslagen wachtwoord van de gebruiker.
            const passwordMatch = await bcrypt.compare(password, user.password);
    
            if (!passwordMatch) {
                throw new Error('Invalid password');
            }
    
            return user;
        } catch (error) {
            throw new Error(`Login failed: ${(error as Error).message}`);
        }
    }

    async findOneWithBooklist(_id: string): Promise<IUser | null> {
        this.logger.log(`Finding user with id ${_id} and booklist`);
        
        // Check if id is null
        if (_id === null || _id === "null") {
            this.logger.debug('ID is null or "null"');
            return null;
        }   
    
        try {
            // Zoek een gebruiker in de database op basis van het _id en populeer de boekenlijst met boekeninformatie.
            const userWithBooklist = await this.userModel
                .findOne({ _id: _id })
                .populate({
                    path: 'boekenlijst.boekId',
                    model: 'Book',
                })
                .exec();
    
            if (!userWithBooklist) {
                this.logger.debug('User not found');
            }
    
            return userWithBooklist;
        } catch (error) {
            throw new Error(`Error finding user: ${(error as Error).message}`);
        }
    }
}