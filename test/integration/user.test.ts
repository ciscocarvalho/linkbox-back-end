import "dotenv/config";
import app from "../../src/app";
import supertest from "supertest";
import { startServer } from "../../server";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import AuthController from "../../src/Controller/AuthController";
import Validations from "../../src/util/validation";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const API_BASE = process.env.API_BASE;
const chave = process.env.SECRET;

const userId = new mongoose.Types.ObjectId().toString();

const mockResponse = () => {
  const res: Response = {} as Response;
  (res.status as jest.Mock) = jest.fn().mockReturnValue(res);
  (res.send as jest.Mock) = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = jest.fn();

let called = false;
const customNext = () => {
  called = true;
};
const userPayload = {
  _id: userId,
  email: "jane.doe@example.com",
  password: "4545454",
  dashboard: [],
};

const userInput = {
  email: "teste@@1gmail.com",
  password: "90909090",
  dashbords: [],
};

describe("Users", () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close;
  });
  describe("test user validation", () => {
    describe("verify the handle with error", () => {
      it("should return a 400", async () => {
        const createUserMock = jest
          .spyOn(AuthController, "signup")
          // @ts-ignore
          .mockRejectedValueOnce("oh no");

        const { statusCode } = await supertest(app).post("/auth/signup");

        expect(statusCode).toBe(400);
      });
    });

    describe("given the password and email are valid", () => {
      it("should return a payload", async () => {
        const createUserMock = jest
          .spyOn(AuthController, "signup")
          // @ts-ignore
          .mockReturnValueOnce(userPayload);

        const { statusCode, body } = await supertest(app).post("/auth/signup");
        expect(statusCode).toBe(201);
        expect(body).toEqual(userPayload.email);
      });
    });
  });
  describe("test if the user can create a session", () => {
    describe("test if the user can logg with a valid email", () => {
      describe("should test validation token", () => {
        it("Should return 403 status code if token is not given", () => {
          const req: Request = {
            cookies: {},
          } as Request;
          const res = mockResponse();

          Validations.checkToken(req, res, mockNext);

          expect(res.status).toHaveBeenCalledWith(403);
          expect(res.send).toHaveBeenCalledWith("Token não fornecido.");
          expect(mockNext).not.toHaveBeenCalled();
        });
        it("Should call the next function if the token is valid ", () => {
          const token = jwt.sign(userInput, chave);
          const req: Request = {
            cookies: {
              token: token,
            },
          } as Request;
          const res = mockResponse();
          Validations.checkToken(req, res, customNext);

          expect(called).toBe(true);
        });
      });
    });
  });
});
