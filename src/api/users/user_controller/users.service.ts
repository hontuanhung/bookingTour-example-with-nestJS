import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { ListAllEntities } from '../dto/user_dto/list-all-entities';
import { UpdateMeDto } from '../dto/auth_dto/update-me.dto';
import { IUser } from 'src/interface/user.interface';
import { ChangePasswordDto } from '../dto/auth_dto/change-password.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../model/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<IUser>,
  ) {}

  async findAll(query?: ListAllEntities): Promise<IUser[]> {
    console.log(query);
    const users: IUser[] = await this.userModel.find();
    return users;
  }

  async findOne(id: string): Promise<{ status: string; user: IUser }> {
    const user: IUser | null = await this.userModel.findById(id);
    if (!user) {
      throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
    }
    return {
      status: 'success',
      user,
    };
  }

  async update(
    id: string,
    updateUserDto: UpdateMeDto,
  ): Promise<{ status: string; user: IUser }> {
    const user: IUser | null = await this.userModel.findByIdAndUpdate(
      id,
      updateUserDto,
      {
        new: true,
      },
    );
    if (!user) {
      throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
    }
    return { status: 'success', user };
  }

  async remove(id: string): Promise<{ status: string }> {
    const user: IUser | null = await this.userModel.findByIdAndDelete(id);

    if (!user) {
      throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
    }

    return { status: 'success' };
  }

  async changePassword(
    payload: any,
    changePasswordDto: ChangePasswordDto,
  ): Promise<{ status: string }> {
    // 1) Check if POSTed current password is correct
    const user: IUser = await this.userModel
      .findById(payload.id)
      .select('+password');

    if (
      !(await user.correctPassword(
        changePasswordDto.currentPassword,
        user.password,
      ))
    ) {
      throw new HttpException(
        'Your password is incorrect!',
        HttpStatus.UNAUTHORIZED,
      );
    }

    // 2) If so, update password
    user.password = changePasswordDto.password!;
    user.passwordChangedAt = new Date(Date.now());

    await user.save();

    return {
      status: 'success',
    };
  }

  async updateMe(
    payload: any,
    updateMeDto: UpdateMeDto,
  ): Promise<{ status: string; user: IUser }> {
    const user: IUser | null = await this.userModel.findByIdAndUpdate(
      payload.id,
      updateMeDto,
      { new: true },
    );
    console.log(updateMeDto);
    if (!user) {
      throw new NotFoundException();
    }

    return { status: 'sucess', user };
  }

  async getMe(payload: any): Promise<{ status: string; user: IUser }> {
    const user: IUser = await this.userModel
      .findById(payload.id)
      .select('-_id -__v -paswordChangedAt');

    if (!user) {
      throw new HttpException(
        'No user found with that ID',
        HttpStatus.NOT_FOUND,
      );
    }

    return { status: 'success', user };
  }

  async deactivateUser(payload: any): Promise<{ status: string }> {
    await this.userModel.findByIdAndUpdate(payload.id, {
      active: false,
    });
    return { status: 'success' };
  }
}
