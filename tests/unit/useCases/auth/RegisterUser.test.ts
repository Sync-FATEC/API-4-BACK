import { RegisterUseCase } from "@/application/use-cases/auth/RegisterUseCase";
import { IUserRepository, User } from "@/domain/models/entities/User";
import RegisterUserDTO from "@/web/dtos/auth/RegisterUserDTO";

describe("Testando registro de usuário quando os dados forem corretos", () => {
    let registerUseCase: RegisterUseCase;
    let mockUserRepository: jest.Mocked<IUserRepository>;

    beforeEach(() => {
      // Mock do JWT_SECRET
      process.env.JWT_SECRET = "test-secret-key";

      // Cria um mock do UserRepository
      mockUserRepository = {
        create: jest.fn(),
        delete: jest.fn(),
        update: jest.fn(),
        list: jest.fn(),
        findByEmail: jest.fn(),
        findById: jest.fn(),
        findByCpf: jest.fn()
      } as jest.Mocked<IUserRepository>;

      // Instancia o RegisterUseCase com o repositório mockado
      registerUseCase = new RegisterUseCase(mockUserRepository);
    });

    afterEach(() => {
      // Limpa o mock do JWT_SECRET após cada teste
      delete process.env.JWT_SECRET;
    });

    it("deve registrar um usuário com sucesso quando os dados são válidos", async () => {
      // Arrange (Preparar) 
      const validUserData = new RegisterUserDTO(
        "Erik Camara",
        "erik@mail.com",
        "123456",
        "794.979.510-78"
      );

      const expectedUser = {
        id: "any-uuid",
        name: "Erik Camara",
        email: "erik@mail.com",
        password: "hashed-password",
        cpf: "794.979.510-78",
        role: "user",
        createdAt: new Date()
      } as User;

      // Configurando os mocks
      mockUserRepository.findByEmail.mockResolvedValue(null); // usuário não existe
      mockUserRepository.findByCpf.mockResolvedValue(null); // cpf não existe
      mockUserRepository.create.mockResolvedValue(expectedUser);
  
      // Act (Agir)
      const resultado = await registerUseCase.execute(validUserData);
  
      // Assert (Verificar)
      expect(resultado).toHaveProperty('user');
      expect(resultado).toHaveProperty('token');
      expect(mockUserRepository.create).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith("erik@mail.com");
      expect(mockUserRepository.findByCpf).toHaveBeenCalledWith("794.979.510-78");
    });
  
    it("deve lançar erro quando cpf já existe", async () => {
      // Arrange (Preparar)
      const validUserData = new RegisterUserDTO(
        "Erik Camara",
        "erik@mail.com",
        "123456",
        "794.979.510-78"
      );

      mockUserRepository.findByEmail.mockResolvedValue(null); 
      mockUserRepository.findByCpf.mockResolvedValue({} as User); // simula que o cpf já existe
  
      // Act e Assert (Agir e Verificar)
      await expect(registerUseCase.execute(validUserData))
        .rejects
        .toThrow("CPF já cadastrado");
    });

     
    it("deve lançar erro quando email já existe", async () => {
      // Arrange (Preparar)
      const validUserData = new RegisterUserDTO(
        "Erik Camara",
        "erik@mail.com",
        "123456",
        "794.979.510-78"
      );

      mockUserRepository.findByEmail.mockResolvedValue({} as User); // simula que o email já existe
  
      // Act e Assert (Agir e Verificar)
      await expect(registerUseCase.execute(validUserData))
        .rejects
        .toThrow("Usuário já existe");
    });


    it("deve lançar erro cpf é invalido", async () => {
      // Arrange (Preparar)
      const validUserData = new RegisterUserDTO(
        "Erik Camara",
        "erik@mail.com",
        "123456",
        "795.979.510-78"
      );

      mockUserRepository.findByEmail.mockResolvedValue(null); // simula que o email já existe
      mockUserRepository.findByEmail.mockResolvedValue(null); // simula que o email já existe
  
      // Act e Assert (Agir e Verificar)
      await expect(registerUseCase.execute(validUserData))
        .rejects
        .toThrow("CPF inválido");
    });
  });