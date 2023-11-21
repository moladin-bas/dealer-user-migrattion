import { Injectable, OnModuleInit } from '@nestjs/common';
import { User, UserAddress } from '@prisma/client';
import axios from 'axios';
import moment from 'moment-timezone';
import { PrismaService } from 'src/config/db/prisma.service';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}
  onModuleInit() {
    this.migrate();
  }

  async migrate() {
    const users = await this.prisma.user.findMany({
      where: {
        roleId: 142,
        rbacUserId: null,
      },
      include: {
        addresses: true,
      },
    });

    for (const user of users) {
      await this.createRbacUser(
        user,
        user.addresses.length ? user.addresses[0] : null,
      );
    }

    console.log(users.map((u) => u.id));
  }

  async getDealers(): Promise<User[]> {
    return this.prisma.user.findMany({
      where: {
        roleId: 142,
      },
    });
  }

  async createRbacUser(
    user: User,
    userAddress: UserAddress | null = null,
  ): Promise<User> {
    const data = JSON.stringify({
      dob: moment.utc(user.dob).format('YYYY-MM-DD'),
      address: userAddress ? userAddress.address : 'Jakarta',
      countryCode: '62',
      email: user.email,
      idCardImageUrl:
        user.idCardImageUrl ||
        'https://auth-service-stg.s3.ap-southeast-1.amazonaws.com/025a1534-c0b8-3890-9089-793487959907.jpeg',
      idCardSelfieImageUrl:
        user.idCardSelfieImageUrl ||
        'https://auth-service-stg.s3.ap-southeast-1.amazonaws.com/025a1534-c0b8-3890-9089-793487959907.jpeg',
      joinDate: moment(user.joinDate || new Date()).format('YYYY-MM-DD'),
      name: user.name,
      nationality: 'WNI',
      nik: user.nationalId,
      phone: user.phone,
      position: 'undefined',
      profilePictureUrl:
        'https://auth-service-stg.s3.ap-southeast-1.amazonaws.com/025a1534-c0b8-3890-9089-793487959907.jpeg',
      regenciesId: 3174,
      roleIds: [user.roleId],
      status: 1,
    });

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://auth-service.staging.mofi.id/user-management/service',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer rahasiaAuthService1',
      },
      data: data,
    };

    let rbacUserId = await axios
      .request(config)
      .then((response) => {
        const { data: rbacUser } = response.data;

        if (rbacUser) {
          return rbacUser.id;
        }

        return null;
      })
      .catch((error) => {
        console.log(user.id);
        console.log(error.response.data);

        return null;
      });

    if (!rbacUserId) {
      rbacUserId = await this.getRbacUserIdByPhone(user.phone);
    }

    if (rbacUserId) {
      user = await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          rbacUserId,
        },
      });
    }

    return user;
  }

  async getRbacUserIdByPhone(phone: string): Promise<number | null> {
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url:
        'https://auth-service.staging.mofi.id/user-management/detail?phone=' +
        phone,
      headers: {
        Authorization: 'Bearer rahasiaAuthService1',
      },
    };

    return axios
      .request(config)
      .then((response) => {
        const { data: rbacUser } = response.data;

        if (rbacUser) {
          return rbacUser.id;
        }

        return null;
      })
      .catch((error) => {
        console.log(phone);
        console.log(error.response.data);

        return null;
      });
  }
}
