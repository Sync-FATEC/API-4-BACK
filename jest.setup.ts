// Mock para o módulo de inicialização do banco de dados
jest.mock('./src/infrastructure/database/initialize', () => ({
  initializeDatabase: jest.fn().mockImplementation(async () => {
    console.log('Mock da inicialização do banco de dados para testes');
    return Promise.resolve();
  }),
}));

// Mock para AppDataSource
jest.mock('./src/infrastructure/database/data-source', () => {
  const mockQueryBuilder = {
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue([]),
    getOne: jest.fn().mockResolvedValue(null),
    getRawOne: jest.fn().mockResolvedValue(null),
    setParameter: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
  };

  const mockRepository = {
    find: jest.fn().mockResolvedValue([]),
    findOne: jest.fn().mockResolvedValue(null),
    findOneBy: jest.fn().mockResolvedValue(null),
    findOneByOrFail: jest.fn().mockResolvedValue({}),
    save: jest.fn().mockImplementation((entity) => Promise.resolve(entity)),
    create: jest.fn().mockImplementation((entity) => entity),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
  };

  return {
    AppDataSource: {
      initialize: jest.fn().mockResolvedValue({}),
      getRepository: jest.fn().mockReturnValue(mockRepository),
      manager: {
        transaction: jest.fn().mockImplementation((cb) => cb({
          getRepository: jest.fn().mockReturnValue(mockRepository),
        })),
      },
    },
  };
}); 