import UserController from "../../src/Controller/UserController"; // Substitua pelo caminho correto
import User from "../../src/Model/User";

describe("Should test UserController functions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Should return users sucefully", async () => {
    const userSimulated = [
      { email: "user@1teste", password: "12345678", dashboards: [] },
      { email: "user@2teste", password: "87654321", dashboards: [] },
    ];

    User.find = jest.fn().mockResolvedValue(userSimulated);

    const resultado = await UserController.getAll();

    expect(resultado).toEqual(userSimulated);
  });

  it("should return one user by id", async () => {
    const mockRequest = () => ({
      params: { id: "1" },
    });
  });
});
