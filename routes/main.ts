// @ts-nocheck
import express, { Router } from 'express';
import { Response, Request } from 'express';
import { regions } from '../constants/regions';
import { name, version } from '../package.json';
import { getPicture, useYTData } from '../functions/useYTData';

const router: Router = express.Router();

router.get('/', (req, res) => {
    res.send({ app: name, message: 'Hello!', version: version });
});

regions.forEach((region) => {
    // Public routes
    router.get(`/${region.code}`, async (req, res, next) => {
        try {
            const { page = 1, limit = 10 } = req.query;

            if (req.query.query) {
                const encoded = encodeURIComponent(req.query.query);
                const talents = await region.db.find({ $text: { $search: decodeURIComponent(encoded) } });
                return res.status(200).json({
                    talents,
                    totalPage: Math.ceil(talents.length / limit),
                    currentPage: page,
                    count: talents.length,
                });
            }
            const talents = await region.db
                .find()
                .limit(limit * 1)
                .skip((page - 1) * limit);

            const count = await region.db.countDocuments();

            talents.forEach(async (talent) => {
                talent.picture = await getPicture(talent.handle, talent.name);

                await talent.save();
            });

            return res.status(200).json({
                talents,
                totalPage: Math.ceil(count / limit),
                currentPage: page,
                count: count,
            });
        } catch (err) {
            next(err);
        }
    });
    router.get(`/${region.code}/active`, async (req, res) => {
        const data = await region.db.find({ status: 'ACTIVE' });
        res.send(data);
    });
    router.get(`/${region.code}/graduated`, async (req, res) => {
        const data = await region.db.find({ status: 'GRADUATED' });
        res.send(data);
    });
    router.get(`/${region.code}/:handle`, async (req, res) => {
        let params: any = { handle: req.params.handle };
        let data = await region.db.findOne(params);
        if (!data) return res.status(404).send({ error: 'Queried handle not found!' });
        try {
            const filterred = await useYTData(req.params.handle as string);
            res.send({ ...data.toJSON(), ...filterred });
        } catch (err) {
            const { error } = JSON.parse(err.info);
            res.status(error.code).send(error);
        }
    });

    router.post(`/${region.code}`, [
        async (req: Request, res: Response) => {
            let { name, personality, birthdate, group, status, handle, contributor } = req.body;
            if (!contributor)
                return res
                    .status(401)
                    .json({ status: 401, message: 'Authentication required. Please do submitting within the website' });
            if (!name) return res.status(422).json({ status: 422, message: 'Name is required!' });
            if (!personality) personality = '-';
            if (!birthdate) birthdate = '-';
            if (!group) group = '-';
            if (!status) return res.status(422).json({ status: 422, message: 'Status is required!' });
            if (!handle) return res.status(422).json({ status: 422, message: 'YouTube handle is required!' });
            const picture = await getPicture(handle, name);
            const data = new region.db({
                name: name,
                personality: personality,
                birthdate: birthdate,
                group: group,
                status: status,
                handle: handle,
                picture: picture,
                contributors: [contributor],
            });
            await data.save();
            res.send(data);
        },
    ]);
    router.patch(`/${region.code}/:handle`, [
        async (req: Request, res: Response) => {
            let { name, personality, birthdate, group, status, handle, contributor } = req.body;
            let params = { handle: req.params.handle };
            if (!contributor)
                return res
                    .status(401)
                    .json({ status: 401, message: 'Authentication required. Please do submitting within the website' });

            try {
                const data = await region.db.findOne(params);
                const picture = await getPicture(data.handle, data.name);

                if (name) data.name = name;
                if (personality) data.personality = personality;
                if (birthdate) data.birthdate = birthdate;
                if (group) data.group = group;
                if (status) data.status = status;
                if (handle) data.handle = handle;
                data.picture = picture;
                if (!data.contributors.find(({ username }) => username === contributor?.username))
                    data.contributors.push(contributors);

                await data.save();
                res.send(data);
            } catch (err) {
                res.status(404).json({ status: 404, message: 'Handle does not exist!' });
            }
        },
    ]);
});

export default router;
