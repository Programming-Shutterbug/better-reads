import { Controller, Get, Param, Post, Delete, Put, Body } from '@nestjs/common';
import { UserService } from '../user.service';
import { IUser } from '@nx-emma-indiv/shared/api';
import { CreateUserDto, UpdateUserDto } from '@nx-emma-indiv/backend/dto';


@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    // Vind alle users
    @Get('')
    async getAll(): Promise<IUser[]> {
        return await this.userService.findAll();
    }

    // Vind specifiek user op id
    @Get(':_id')
    async getOne(@Param('_id') _id: string): Promise<IUser | null> {
        return await this.userService.findOne(_id);
    }

    // Creer/Registreer nieuwe user
    @Post('')
    async create(@Body() createUserDto: CreateUserDto): Promise<IUser> {
        const {...userWithoutId } = createUserDto;
        return await this.userService.create(userWithoutId);
    }

    // Update de users gegevens
    @Put(':id')
    async update(@Param('id') userId: string, @Body() updateUserDto: UpdateUserDto) {
      const updatedUser = await this.userService.update(userId, updateUserDto);
      return { message: 'User updated successfully', user: updatedUser };
    }
    
    // Verwijder user
    @Delete('/:_id')
    async delete(@Param('_id') _id: string): Promise<void> {
        await this.userService.deleteUser(_id);
    }
    
    // User kan inloggen
    @Post('/login')
    async login(@Body() user: IUser): Promise<IUser | { error: string }> {
        const loggedInUser = await this.userService.login(user.email, user.password);
        return await loggedInUser;
    }

    // Vind boekenlijst die bij de user/userid hoort
    @Get(':_id/dashboard')
    async findOneWithBooklist(@Param('_id') _id: string): Promise<IUser | null> {
        return await this.userService.findOneWithBooklist(_id);
    }
}