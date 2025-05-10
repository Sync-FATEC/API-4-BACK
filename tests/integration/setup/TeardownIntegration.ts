import { stopServer } from '../../../src/server';
import { getContainer } from './SetupIntegration';

const TeardownIntegration = async (): Promise<void> => {
  const container = getContainer();

  if (container) {
    await container.stop();
  }
  

  await stopServer();
};

export default TeardownIntegration;
