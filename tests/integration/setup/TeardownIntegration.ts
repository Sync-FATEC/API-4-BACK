// tests/integration/setup/TeardownIntegration.ts
import { getContainer, getDataSource } from './SetupIntegration';

export default async () => {
  const dataSource = getDataSource();
  const container = getContainer();

  if (dataSource && dataSource.isInitialized) {
    await dataSource.destroy();
  }

  if (container) {
    await container.stop();
  }
};
