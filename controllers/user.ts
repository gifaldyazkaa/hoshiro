import User from '../models/auth/User';

export const index = async (req, res) => {
    const { full } = req.query;
    const users = await (full ? User.find() : User.find().simple());

    res.json(users);
};

export const store = async (req, res, next) => {
    try {
        const { username, email, password, picture } = req.body;

        const user = await User.create({ username, email, password, picture });

        res.status(201).send({ user: user.toJSON() });
    } catch (err) {
        next(err);
    }
};

export const update = async (req, res, next) => {
    try {
        let { user } = req.data;
        const { username, email, picture } = req.body;

        user = await User.findByIdAndUpdate(user.id, { username, email, picture }, { new: true });

        res.json({ user: user.toJSON() });
    } catch (err) {
        next(err);
    }
};
