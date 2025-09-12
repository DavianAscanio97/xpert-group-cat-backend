import { Injectable, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

/**
 * Servicio para la gestión de usuarios
 * Maneja operaciones CRUD y autenticación de usuarios
 */
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  /**
   * Crea un nuevo usuario en la base de datos
   * @param createUserDto - Datos del usuario a crear
   * @returns Usuario creado sin información sensible
   */
  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const { email, password, name } = createUserDto;

    // Verificar si el usuario ya existe
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('El usuario con este email ya existe');
    }

    // Hashear la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear el usuario
    const user = new this.userModel({
      name,
      email,
      password: hashedPassword,
    });

    const savedUser = await user.save();
    return this.mapToUserResponse(savedUser);
  }

  /**
   * Busca un usuario por su email
   * @param email - Email del usuario a buscar
   * @returns Usuario encontrado o null
   */
  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email, isActive: true }) as Promise<UserDocument | null>;
  }

  /**
   * Busca un usuario por su ID
   * @param id - ID del usuario a buscar
   * @returns Usuario encontrado o null
   */
  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id) as Promise<UserDocument | null>;
  }

  /**
   * Valida las credenciales de un usuario
   * @param loginUserDto - Credenciales de login
   * @returns Usuario autenticado sin información sensible
   */
  async validateUser(loginUserDto: LoginUserDto): Promise<UserResponseDto> {
    const { email, password } = loginUserDto;

    const user = await this.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return this.mapToUserResponse(user);
  }

  /**
   * Obtiene todos los usuarios activos
   * @returns Lista de usuarios sin información sensible
   */
  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userModel.find({ isActive: true });
    return users.map(user => this.mapToUserResponse(user));
  }

  /**
   * Obtiene un usuario por ID
   * @param id - ID del usuario
   * @returns Usuario encontrado sin información sensible
   */
  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return this.mapToUserResponse(user);
  }

  /**
   * Desactiva un usuario (soft delete)
   * @param id - ID del usuario a desactivar
   * @returns Usuario desactivado
   */
  async remove(id: string): Promise<UserResponseDto> {
    const user = await this.userModel.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true },
    );
    
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    
    return this.mapToUserResponse(user);
  }

  /**
   * Mapea un documento de usuario a DTO de respuesta
   * @param user - Documento de usuario de MongoDB
   * @returns DTO de respuesta sin información sensible
   */
  private mapToUserResponse(user: UserDocument): UserResponseDto {
    return {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}

