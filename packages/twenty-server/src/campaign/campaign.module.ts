import { Module } from '@nestjs/common';

import { CampaignController } from 'src/campaign/campaign.controller';
import { CampaignService } from 'src/campaign/campaign.service';
import { CreateFormResponse } from 'src/campaign/create-form-response-query';
import { GetCampaignTrigger } from 'src/campaign/get-campaign-trigger-query';
import { GetFormTemplate } from 'src/campaign/get-form-template-query';
import { GetLeadData } from 'src/campaign/get-lead-query';
import { GetOpportunityData } from 'src/campaign/get-opportunity-query';

@Module({
  imports: [],
  controllers: [CampaignController],
  providers: [
    CampaignService,
    CreateFormResponse,
    GetCampaignTrigger,
    GetFormTemplate,
    GetLeadData,
    GetOpportunityData,
  ],
})
export class CampaignModule {}
