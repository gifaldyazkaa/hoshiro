import { describe, expect, it } from 'bun:test';
import { regions } from '../constants/regions';
import request from 'supertest';
import app from '../app';

describe('GET /', async () => {
    const res = await request(app).get('/');
    it('Should return 200 status code', () => {
        expect(res.statusCode).toBe(200);
        expect(res.type).toBe('application/json');
    });
    it('Should return app value', () => {
        expect(res.body.app).toBeString();
    });
});

describe('GET /:region', () => {
    it('Should return 200 status code', () => {
        regions.forEach(async (region) => {
            const res = await request(app).get(`/${region.code}`);
            expect(res.statusCode).toBe(200);
            expect(res.type).toBe('application/json');
        });
    });
    it('Should return an array', () => {
        regions.forEach(async (region) => {
            const res = await request(app).get(`/${region.code}`);
            expect(res.body).toBeArray();
        });
    });
});

// TODO Rewrite testing units for authentication, users, and profile routes
// describe('POST /auth/register', async () => {
//     const res = await request(app).post('/auth/register');
//     it('Should return 401 status code', () => {
//         expect(res.statusCode).toBe(401);
//         expect(res.unauthorized).toBeTrue();
//     });
// });

// describe('POST /auth/login', async () => {
//     const res = await request(app).post('/auth/login');
//     it('Should return 401 status code', () => {
//         expect(res.statusCode).toBe(401);
//         expect(res.unauthorized).toBeTrue();
//     });
// });

describe('POST /:region', () => {
    it('Should return 401 status code', () => {
        regions.forEach(async (region) => {
            const res = await request(app).post(`/${region.code}`);
            expect(res.statusCode).toBe(401);
            expect(res.unauthorized).toBeTrue();
        });
    });
});

describe('PATCH /:region', () => {
    it('Should return 401 status code', () => {
        regions.forEach(async (region) => {
            const res = await request(app).patch(`/${region.code}`);
            expect(res.statusCode).toBe(401);
            expect(res.unauthorized).toBeTrue();
        });
    });
});
