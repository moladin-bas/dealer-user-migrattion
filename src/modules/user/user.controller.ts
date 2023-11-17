import { Controller, Get, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('dealer')
  async getUserDealer() {
    const users = await this.userService.getDealers();

    return {
      statusCode: HttpStatus.OK,
      data: users,
    };
  }
}
