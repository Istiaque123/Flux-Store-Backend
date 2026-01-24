// ! src/core/tables/base.migration.ts


import type { PoolClient } from "pg";
import type { MigrationDefination } from "../../common/dto";



export abstract class BaseMigration implements MigrationDefination{
    abstract tableName: string;
    abstract schemaQuery: string;


    async dataMigration (client: PoolClient): Promise<void>{
    }

    async postMigration (client: PoolClient): Promise<void>{
    }


   
}