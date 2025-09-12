import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { UsersService } from './users.service';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

/**
 * Pruebas unitarias para el servicio de usuarios
 * Verifica el comportamiento de los métodos del servicio
 */
describe('UsersService', () => {
  let service: UsersService;
  let userModel: any;

  const mockUser = {
    _id: '507f1f77bcf86cd799439011',
    name: 'Juan Pérez',
    email: 'juan@example.com',
    password: 'hashedPassword',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    save: jest.fn(),
  };

  const mockUserModel = {
    new: jest.fn(),
    constructor: jest.fn(),
    findOne: jest.fn(),
    findById: jest.fn(),
    find: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userModel = module.get(getModelToken(User.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user successfully', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Juan Pérez',
        email: 'juan@example.com',
        password: 'password123',
      };

      userModel.findOne.mockResolvedValue(null);
      userModel.new.mockReturnValue(mockUser);
      mockUser.save.mockResolvedValue(mockUser);

      const result = await service.create(createUserDto);

      expect(userModel.findOne).toHaveBeenCalledWith({ email: createUserDto.email });
      expect(result).toEqual({
        _id: mockUser._id,
        name: mockUser.name,
        email: mockUser.email,
        isActive: mockUser.isActive,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      });
    });

    it('should throw ConflictException if user already exists', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Juan Pérez',
        email: 'juan@example.com',
        password: 'password123',
      };

      userModel.findOne.mockResolvedValue(mockUser);

      await expect(service.create(createUserDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('validateUser', () => {
    it('should validate user credentials successfully', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'juan@example.com',
        password: 'password123',
      };

      userModel.findOne.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await service.validateUser(loginUserDto);

      expect(result).toEqual({
        _id: mockUser._id,
        name: mockUser.name,
        email: mockUser.email,
        isActive: mockUser.isActive,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'juan@example.com',
        password: 'password123',
      };

      userModel.findOne.mockResolvedValue(null);

      await expect(service.validateUser(loginUserDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'juan@example.com',
        password: 'wrongpassword',
      };

      userModel.findOne.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(service.validateUser(loginUserDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('findByEmail', () => {
    it('should find user by email', async () => {
      const email = 'juan@example.com';
      userModel.findOne.mockResolvedValue(mockUser);

      const result = await service.findByEmail(email);

      expect(userModel.findOne).toHaveBeenCalledWith({ email, isActive: true });
      expect(result).toEqual(mockUser);
    });
  });

  describe('findById', () => {
    it('should find user by id', async () => {
      const id = '507f1f77bcf86cd799439011';
      userModel.findById.mockResolvedValue(mockUser);

      const result = await service.findById(id);

      expect(userModel.findById).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockUser);
    });
  });
});
