import mongoose, { Document, Schema, Model } from 'mongoose';

// Define a TypeScript interface for the user
export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
}

// Create the schema with proper typing
const UserSchema: Schema<IUser> = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true }
});

// Export the model with typing
const UserModel: Model<IUser> = mongoose.model<IUser>('User', UserSchema);
export default UserModel;
