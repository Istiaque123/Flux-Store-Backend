// ! src/core/tables/app.tables.register.ts

import type { MigrationDefination } from '../../common/dto';
import { authenticationTableObj } from '../../modules/auth';
import { otpTableObj } from '../../modules/otp';
import { userObj, userProfileObj } from '../../modules/users/models';




export function getTableDefinitions(): Record<string, MigrationDefination> {

  const tableInitilizations: MigrationDefination[] = [
    userObj,
    userProfileObj,
    authenticationTableObj,
    otpTableObj,

    

  ];

  return Object.fromEntries(
    tableInitilizations.map((table: MigrationDefination): [string, MigrationDefination] => [table.tableName, table])
  );

}
