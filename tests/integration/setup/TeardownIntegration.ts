import { stopServer } from '../../../src/server';
import { getContainer, getDataSource } from './SetupIntegration';

const TeardownIntegration = async () => {
  const container = getContainer();

  if (container) {
    await container.stop();
  }
  

  await stopServer();
};

export default TeardownIntegration;
