import {
  Controller,
  Get,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Body,
  HttpStatus,
  HttpCode,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../../../share/common/guard/guard/auth.guard';
import { ListAllEntities } from '../dto/user_dto/list-all-entities';
import { UpdateUserDto } from '../dto/user_dto/update-user.dto';
import { ChangePasswordDto } from '../dto/auth_dto/change-password.dto';
import { UpdateMeDto } from '../dto/auth_dto/update-me.dto';

@Controller('/api/v1/users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/me')
  async getProfile(@Req() req: any): Promise<object> {
    return this.usersService.getMe(req.payload);
  }

  @Patch('/updatePassword')
  @HttpCode(200)
  async updatePassword(
    @Req() req: any,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(req.payload, changePasswordDto);
  }

  @Patch('/updateMe')
  @HttpCode(200)
  async updateMe(@Req() req: any, @Body() updateMeDto: UpdateMeDto) {
    return this.usersService.updateMe(req.payload, updateMeDto);
  }

  @Delete('/deleteMe')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMe(@Req() req: any) {
    return this.usersService.deactivateUser(req.payload);
  }

  @Get()
  @HttpCode(200)
  async findAll(@Query() query: ListAllEntities) {
    return this.usersService.findAll(query);
    // return query;
  }

  @Get('/:id')
  @HttpCode(200)
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch('/:id')
  @HttpCode(200)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    console.log(updateUserDto);
    return this.usersService.update(id, updateUserDto);
    // return { fsdkj: id };
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
