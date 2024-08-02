import { Type } from 'class-transformer';
import { IsISO8601, IsUUID, ValidateNested } from 'class-validator';

import { IdList } from 'src/campaign/id-list.dto';

export class CampaignExecutionDTO {
  @IsUUID()
  campaignId: string;

  @IsISO8601({ strict: true })
  queryTimestamp: string;

  campaignTriggerId: string;

  @IsISO8601({ strict: true })
  startDate: Date;

  @IsISO8601({ strict: true })
  stopDate: Date;

  @ValidateNested()
  @Type(() => IdList)
  id: IdList;
}
