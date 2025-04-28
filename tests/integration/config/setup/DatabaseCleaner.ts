import { DataSource } from 'typeorm';

export async function clearDatabase(dataSource: DataSource): Promise<void> {
  const queryRunner = dataSource.createQueryRunner();
  
  try {
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    const isPostgres = dataSource.options.type === 'postgres';
    
    if (isPostgres) {
      await queryRunner.query('SET session_replication_role = \'replica\';');
    } else {
      await queryRunner.query('SET FOREIGN_KEY_CHECKS = 0;');
    }
    
    let tables: any[] = [];
    if (isPostgres) {
      const schemaName = dataSource.options.schema || 'public';
      tables = await queryRunner.query(
        `SELECT tablename FROM pg_tables WHERE schemaname = '${schemaName}'`
      );
    } else {
      tables = await queryRunner.query(
        `SELECT table_name FROM information_schema.tables WHERE table_schema = '${dataSource.options.database}'`
      );
    }
    
    for (const tableObj of tables) {
      const tableName = tableObj.tablename || tableObj.table_name || tableObj.TABLE_NAME;
      if (tableName !== 'migrations' && tableName !== 'typeorm_metadata') {
        if (isPostgres) {
          await queryRunner.query(`TRUNCATE TABLE "${tableName}" CASCADE`);
        } else {
          await queryRunner.query(`TRUNCATE TABLE \`${tableName}\``);
        }
      }
    }
    
    if (isPostgres) {
      await queryRunner.query('SET session_replication_role = \'origin\';');
    } else {
      await queryRunner.query('SET FOREIGN_KEY_CHECKS = 1;');
    }
    
    await queryRunner.commitTransaction();
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
}
