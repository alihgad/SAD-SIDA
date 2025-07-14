import { Injectable } from '@nestjs/common';
import {
  loginInput,
  loginTypeResponse,
  CreateSuperAdminUserInput,
  SuperAdminUserType
} from './users.types';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../DB/models/user.model';
import { UserDocument } from '../../DB/models/user.model';

@Injectable()
export class UsersService {
  constructor(
    private configService: ConfigService,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async createUser(args: CreateSuperAdminUserInput): Promise<SuperAdminUserType> {
    const existingUser = await this.userModel.findOne({ email: args.email });
    if (existingUser) throw new Error('User already exists');

    const createdUser = await this.userModel.create(args);
    return createdUser;
  }

  async login(args: loginInput): Promise<loginTypeResponse> {
    const user = await this.userModel.findOne({ email: args.email });
    if (!user) throw new Error('User not found');

    const isMatch = await bcrypt.compare(args.password, user.password);
    if (!isMatch) throw new Error('Invalid password');

    const token = jwt.sign(
      { email: user.email },
      this.configService.get<string>('JWT_SECRET') as string
    );

    return {
      message: 'User created successfully',
      token
    };
  }
}
