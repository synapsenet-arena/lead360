import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { error } from 'console';
import { response } from 'express';

import { CampaignExecutionDTO } from 'src/campaign/campaign-execution.dto';
import { CampaignService } from 'src/campaign/campaign.service';
import { FormDataDTO } from 'src/campaign/formdata.dto';
@Controller('/campaign')
export class CampaignController {
  constructor(private campaignService: CampaignService) {}

  @Get('/:id')
  async validateFormDetails(@Param() id: any) {
    
      id = id.id.toString();
          
      const response = await  this.campaignService.validateFormDetails(id);
      console.log(response,'======')
      if(!response){
        return {'error':'Campaign Not Found'}
      } 
      return response
    
  }

  @Post('/save/:id')
  async saveFormResponse(@Param() id: any, @Body() formData: FormDataDTO) {
    try {
      id = id.id.toString();
      const response=this.campaignService.saveFormResponse(id, formData);
      return response
    } catch (error) {
      return error;
    }
  }
  
  @Post('/execute')
  async executeCampaign(@Body() campaignExecutionData: CampaignExecutionDTO) {
    try {
      return this.campaignService.triggerCampaignStartWorkflow(campaignExecutionData);
    } catch (error) {
      return error;
    }
  }
  @Post('/lead/register/:id')
  executeLeadRegistration(@Param() id: any,@Body() data:any){
    // console.log(id.id)
    try {
      console.log(id.id)
       this.campaignService.triggerLeadRegistrationWorkflow(id.id);
       return true
    } catch (error) {
      return error;
    }
  }

}
