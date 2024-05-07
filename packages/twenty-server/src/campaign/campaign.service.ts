import { Injectable } from '@nestjs/common';

import { error } from 'console';

import fetch from 'node-fetch';
import base64 from 'base64-js';

import { FormDataDTO } from 'src/campaign/formdata.dto';
import { CampaignExecutionDTO } from 'src/campaign/campaign-execution.dto';
import { GetCampaignTrigger } from 'src/campaign/get-campaign-trigger-query';
import { GetFormTemplate } from 'src/campaign/get-form-template-query';
import { GetLeadData } from 'src/campaign/get-lead-query';
import { CreateFormResponse } from 'src/campaign/create-form-response-query';
import { GetOpportunityData } from 'src/campaign/get-opportunity-query';
import { response } from 'express';

@Injectable()
export class CampaignService {
  
  constructor(
    private createFormResponse: CreateFormResponse,
    private getCampaignTrigger: GetCampaignTrigger,
    private getFormTemplate: GetFormTemplate,
    private getLeadData: GetLeadData,
    private getOpportunityData: GetOpportunityData,
  ) {}
  
  async triggerLeadRegistrationWorkflow(id: any) {
    const data={
      conf:{
        patient_uuid:id
      }
    }
    try {
      let response = await fetch(
        `${process.env.AIRFLOW_HOST}/api/v1/dags/${process.env.DAG_CONTACTED_OPPORTUNITIES}/dagRuns`,
        {
          method: 'post',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${process.env.AIRFLOW_AUTH_TOKEN}`,
          },
        },
      );

      response = await response.json();
      console.log(response)
      return response;
    } catch (error) {
      return error;
    }  
  }

  async triggerIdentifiedWorkflow(requestBody: any) {
    const data = {
      conf: requestBody,
    };

    try {
      let response = await fetch(
        `${process.env.AIRFLOW_HOST}/api/v1/dags/${process.env.DAG_IDENTIFIED}/dagRuns`,
        {
          method: 'post',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${process.env.AIRFLOW_AUTH_TOKEN}`,
          },
        },
      );

      response = await response.json();

      return response;
    } catch (error) {
      return error;
    }
  }

  async triggerCampaignStartWorkflow(
    campaignExecutionData: CampaignExecutionDTO,
  ) {
    const data = {
      conf: campaignExecutionData,
      dag_run_id: `${campaignExecutionData.campaignTriggerId}-${Date.parse(Date())}`,
      logical_date: campaignExecutionData.startDate,
      note: 'string',
    };

    console.log(JSON.stringify(data));
    try {
      let response = await fetch(
        `${process.env.AIRFLOW_HOST}/api/v1/dags/${process.env.DAG_CAMPAIGN}/dagRuns`,
        {
          method: 'post',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${process.env.AIRFLOW_AUTH_TOKEN}`,
          },
        },
      );

      response = await response.json();
      console.log(response)
      return response;
    } catch (error) {
      return error;
    }
  }

  uri = 'http://localhost:3000/graphql';
  headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
  };

  async apiCall(queryData, queryDataName) {
    const response = await fetch(this.uri, {
      method: 'post',
      body: JSON.stringify(queryData),
      headers: this.headers,
    });

    let data = await response.json();

    data = data.data;
    if (queryDataName === 'formTemplate') {
      data = data.formTemplates.edges[0];
      let valid: boolean = false;

      if (data?.node?.status == 'ACTIVE') {
        //   console.log('askakskas', data?.node?.validDate);
        //   valid = Date.parse(data?.node?.validDate) > Date.parse(Date());
        valid = true;
      }
      if (!valid) {
        throw error('Form is not Active');
      }
    }
    if (queryDataName === 'campaignTriggers') {
      data = data.campaignTriggers.edges[0];
      let valid: boolean = false;

      if (data?.node?.stopDate !== null) {
        valid = Date.parse(data?.node?.stopDate) > Date.parse(Date());
        console.log(valid,'valid-----')
        console.log(data?.node?.stopDate,'valid-----')

      }
      if (!valid) {
        throw error('Campaign is not Active');
      }
    }
    if (queryDataName === 'leads') {
      data = data.leads.edges[0];
    }
    if (queryDataName === 'opportunity') {
      return data.opportunities.totalCount == 1;
    }

    return data == undefined;
  }

  async fetchLeadData(queryData) {
    try {
      const response = await fetch(this.uri, {
        method: 'post',
        body: JSON.stringify(queryData),
        headers: this.headers,
      });

      const data = await response.json();

      return data;
    } catch (error) {
      console.error(error);
    }
  }
  extractIdsFromRandomId = (decodedRandomId: string) => {
    const idComponents = decodedRandomId.split('--');
    const leadId = idComponents[0];
    const formTemplateId = idComponents[1];
    const campaignTriggerId = idComponents[2];

    return {
      leadId,
      formTemplateId,
      campaignTriggerId,
    };
  };

  decodeRandomId = (encodedRandomId: string) => {
    const decodedRandomId = new TextDecoder().decode(
      base64.toByteArray(encodedRandomId),
    );

    return this.extractIdsFromRandomId(decodedRandomId);
  };

  async validateFormDetails(id: string) {
    const decoded_ids = this.decodeRandomId(id);

    console.log(decoded_ids);
    try {
      if (
        await this.apiCall(
          this.getFormTemplate.queryFormTemplate(decoded_ids.formTemplateId),
          'formTemplate',
        )
      ) {
        throw error('Camapign Form Not Found');
      }
      if (
        await this.apiCall(
          this.getCampaignTrigger.queryCampaignTrigger(
            decoded_ids.campaignTriggerId,
          ),
          'campaignTriggers',
        )
      ) {
        throw error('Camapign Execution Not Found');
      }
      if (
        await this.apiCall(
          this.getLeadData.queryLeadData(decoded_ids.leadId),
          'leads',
        )
      ) {
        throw error('Lead Not Found');
      }
      const response = await this.fetchLeadData(
        this.getLeadData.queryLeadData(decoded_ids.leadId),
      );

      // console.log(response?.data?.leads?.edges[0].node?.name);
      const fetchedData = {
        name: response?.data?.leads?.edges[0].node?.name,
        email: response?.data?.leads?.edges[0].node?.email,
      };

      return fetchedData;
    } catch (error) {
      console.error(error);
      return error
    }
  }

  async saveFormResponse(id: string, formData: FormDataDTO) {
    try {
      const decoded_ids = this.decodeRandomId(id);

      console.log(decoded_ids);
      const response = await fetch(this.uri, {
        method: 'post',
        body: JSON.stringify(
          this.createFormResponse.queryFormResponse(formData, decoded_ids),
        ),
        headers: this.headers,
      });

      const data = await response.json();
      if (data.errors) {
        throw error('Required Form Data is Invalid');
      }

      const requestbody = {
        leadId: decoded_ids.leadId,
        campaignTriggerId: decoded_ids.campaignTriggerId,
      };

      const opportunityIdExists = await this.apiCall(
        this.getOpportunityData.queryOpportunityId(requestbody),
        'opportunity',
      );

      if (opportunityIdExists) {
        const airflowResponse =
          await this.triggerIdentifiedWorkflow(requestbody);

        console.log(airflowResponse, 'airflowResponse');
      }
      return 'Form Data Saved Successfully';
    } catch (error) {
      console.error(error);
    }
  }
}
