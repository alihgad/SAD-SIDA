import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  versionKey: false,
})
export class User {
  @Prop({ type: String, required: true })
  name!: string;

  @Prop({ type: String, required: true, unique: true })
  email!: string;

  @Prop({ type: String, required: true })
  password!: string;

  @Prop({ type: String, required: true, default: 'user' })
  role!: string;
}

export type UserDocument = HydratedDocument<User>;

export const UserSchema = SchemaFactory.createForClass(User);

// ✅ Hook لتشفير الباسورد قبل الحفظ
UserSchema.pre('save', function (next) {
  const user = this as any;

  if (!user.isModified('password')) return next();

  bcrypt.hash(user.password, 10, (err: any, hash: string) => {
    if (err) return next(err);
    user.password = hash;
    next();
  });
});
