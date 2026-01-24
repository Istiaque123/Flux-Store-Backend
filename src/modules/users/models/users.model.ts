// ! src/modules/users/models/users.model.ts


import { BaseMigration } from "../../../core/tables";
import { UserTables } from "./users_tables_names";



export class User extends BaseMigration{
    tableName: string = UserTables.USERS;
    schemaQuery: string= `
        CREATE TABLE IF NOT EXISTS ${this.tableName} (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,             
            role VARCHAR(100) NOT NULL DEFAULT 'user',  

            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NULL,
            active BOOLEAN DEFAULT TRUE,
            status BOOLEAN DEFAULT TRUE,
            is_delete BOOLEAN DEFAULT FALSE
        );
    `;

}


export const userObj: User = new User();