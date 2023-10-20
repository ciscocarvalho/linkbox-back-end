import app from '../../src/app'
import dotenv from 'dotenv'
import supertest from 'supertest'
import { startServer } from '../../server'
import {MongoMemoryServer} from 'mongodb-memory-server'
import mongoose from 'mongoose'
import AuthController from '../../src/Controller/AuthController'

dotenv.config()
const API_BASE =  process.env.API_BASE

const userId = new mongoose.Types.ObjectId().toString();

const userPayload = {
  _id: userId,
  email: "jane.doe@example.com",
  password: "4545454",
  dashboard: []
};

const userInput = {
    email: "teste@@1gmail.com",
    password: "90909090",
    dashbords: []
}

describe('Users', ()=>{
    beforeAll(async ()=>{
        const mongoServer =  await MongoMemoryServer.create()

        await mongoose.connect(mongoServer.getUri())
    })
    afterAll(async ()=>{
        console.log('1')
        await mongoose.disconnect()
        await mongoose.connection.close
    })
    describe('test user validation', ()=>{
        describe("verify the handle with error", ()=>{
            it("should return a 400", async ()=>{
                const createUserMock = jest.spyOn(AuthController, 'signup')
                // @ts-ignore
                .mockRejectedValueOnce('oh no');

                const {statusCode} = await supertest(app).post('/auth/signup')
                
                expect(statusCode).toBe(400)
            })
        })
    
        describe("given the password and email are valid", ()=>{
            it("should return a payload", async ()=>{
                const createUserMock = jest.spyOn(AuthController, 'signup')
                // @ts-ignore
                .mockReturnValueOnce(userPayload);

                const {statusCode, body} = await supertest(app).post('/auth/signup')
                expect(statusCode).toBe(201)
                expect(body).toEqual(userPayload.email)
            })
        })
    })
    describe("test if the user can create a session", ()=>{
        describe("test if the user can logg with a valid email", ()=>{
            it("should return a AcessToken", ()=>{
                const createUserMock = jest.spyOn(AuthController, 'signin')
                // @ts-ignore
                .mockReturnValueOnce(userPayload);
            })
        })
    })
    
})