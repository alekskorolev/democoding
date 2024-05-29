import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { genSalt, hash, compare } from 'bcrypt';

@Schema()
export class User {
  @Prop({ unique: true, index: true })
  login: string;

  @Prop()
  password: string;

  @Prop({ default: false })
  confirmed: boolean;
}

export type UserDocument = HydratedDocument<User>;

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function () {
  const { $set } = this.getChanges();
  console.log($set);
  if ($set?.password) {
    const salt = await genSalt(12);
    this.password = await hash(this.password, salt);
  }
});
