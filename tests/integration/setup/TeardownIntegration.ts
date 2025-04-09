import { getContainer, getDataSource } from './SetupIntegration';

const TeardownIntegration = async () => {
  const dataSource = getDataSource();
  const container = getContainer();

  // Encerrar conexão com banco relacional
  if (dataSource?.isInitialized) {
    await dataSource.destroy();
  }

  // Parar container Docker (caso esteja usando testcontainers)
  if (container) {
    await container.stop();
  }
};

export default TeardownIntegration;
