import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

export interface UserDocument {
    username: string;
    email: string;
    password: string;
    discordId: string;
    picture: string;
    token?: string;
}

const userSchema = new mongoose.Schema<UserDocument>(
    {
        username: { type: String, required: true },
        email: { type: String, unique: true },
        password: { type: String, select: false },
        discordId: { type: String },
        picture: { type: String },
        token: { type: String, select: false },
    },
    {
        versionKey: false,
    },
);

userSchema.method('comparePassword', async function (password = '') {
    return await bcrypt.compare(password, this.password);
});

userSchema.method('syncPicture', async function (url: string) {
    this.picture = url;
    await this.save();
});

userSchema.method('generateToken', async function () {
    this.token = crypto.randomBytes(32).toString('hex');
    await this.save();

    return this.token;
});

userSchema.method('hash', async function (password) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(password, salt);
    this.save();

    return this.password;
});

userSchema.method('toJSON', function () {
    return {
        id: this._id,
        username: this.username,
        email: this.email,
        picture: this.picture,
    };
});

(userSchema.query as any).simple = function () {
    return this.select(['username', 'email']);
};

export default mongoose.model<UserDocument>('User', userSchema);
