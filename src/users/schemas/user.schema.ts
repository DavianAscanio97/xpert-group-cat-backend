import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * Interfaz para los timestamps automáticos de Mongoose
 */
interface Timestamps {
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Esquema de usuario para MongoDB
 * Define la estructura de datos de un usuario en la base de datos
 */
@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Tipo que combina User, Document y los timestamps automáticos
export type UserDocument = User & Document & Timestamps;
