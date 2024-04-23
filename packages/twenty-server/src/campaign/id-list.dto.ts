import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';

import { IdDto } from 'src/campaign/id.dto';

export class IdList {
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => IdDto)
  selectedID: IdDto[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => IdDto)
  unselectedID: IdDto[];
}
