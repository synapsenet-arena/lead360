import { Inject, Injectable } from '@nestjs/common';

import { ServerlessDriver } from 'src/engine/integrations/serverless/drivers/interfaces/serverless-driver.interface';

import { SERVERLESS_DRIVER } from 'src/engine/integrations/serverless/serverless.constants';
import { ServerlessFunctionEntity } from 'src/engine/metadata-modules/serverless-function/serverless-function.entity';

@Injectable()
export class ServerlessService implements ServerlessDriver {
  constructor(@Inject(SERVERLESS_DRIVER) private driver: ServerlessDriver) {}

  async build(serverlessFunction: ServerlessFunctionEntity): Promise<void> {
    return this.driver.build(serverlessFunction);
  }

  async execute(
    serverlessFunction: ServerlessFunctionEntity,
    payload: object | undefined = undefined,
  ) {
    return this.driver.execute(serverlessFunction, payload);
  }
}
