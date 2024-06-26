import mongoose from 'mongoose';

const schema = new mongoose.Schema(
    {
        name: String,
        personality: String,
        birthdate: String,
        group: String,
        status: String,
        handle: String,
        contributors: Array,
        picture: String,
    },
    {
        versionKey: false,
        timestamps: true,
    },
);

schema.index({ name: 'text', group: 'text', handle: 'text' });

export default mongoose.model('Malaysia', schema);
