import { Injectable } from '@nestjs/common';

import { error } from 'console';

import fetch from 'node-fetch';
import base64 from 'base64-js';

import { FormDataDTO } from 'src/campaign/formdata.dto';
import { CampaignExecutionDTO } from 'src/campaign/campaign-execution.dto';

@Injectable()
export class CampaignService {
  async triggerIdentifiedWorkflow(requestBody: any) {
    const data = {
      conf: requestBody,
    };

    console.log(JSON.stringify(data));
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
  }

  async triggerCampaignStartWorkflow(
    campaignExecutionData: CampaignExecutionDTO,
  ) {
    const data = {
      conf: campaignExecutionData,
      dag_run_id: campaignExecutionData.campaignExecutionId,
      logical_date: campaignExecutionData.startDate,
      note: 'string',
    };

    console.log(JSON.stringify(data));
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

    return response;
  }

  constructor() {}

  checkFormValidity() {}

  queryDataCampaignForm(id: string) {
    const queryDataCampaignFormExists = {
      query: `query FindManyCampaignForms($filter: CampaignFormFilterInput, $orderBy: CampaignFormOrderByInput, $lastCursor: String, $limit: Float) {
        campaignForms(
          filter: $filter
          orderBy: $orderBy
          first: $limit
          after: $lastCursor
        ) {
          edges {
            node {
              id
              active
            }
      
          }
          totalCount
        }
      }`,
      variables: {
        filter: {
          id: {
            eq: `${id}`,
          },
        },
        orderBy: {
          position: 'AscNullsFirst',
        },
      },
    };

    return queryDataCampaignFormExists;
  }

  queryDataLead(id) {
    const queryDataLeadExists = {
      query: `query FindManyLeads($filter: LeadFilterInput, $orderBy: LeadOrderByInput, $lastCursor: String, $limit: Float) {
        leads(filter: $filter, orderBy: $orderBy, first: $limit, after: $lastCursor) {
          edges {
            node {  
              id,
              name,
              email
            }
          }
        }
      }`,
      variables: {
        filter: {
          id: {
            eq: `${id}`,
          },
        },
        orderBy: {
          position: 'AscNullsFirst',
        },
      },
    };

    return queryDataLeadExists;
  }

  queryDataCampaignTrigger(id) {
    const queryDataCampaignExists = {
      query: `query FindManyCampaignTriggers($filter: CampaignTriggerFilterInput, $orderBy: CampaignTriggerOrderByInput, $lastCursor: String, $limit: Float) {
        campaignTriggers(
          filter: $filter
          orderBy: $orderBy
          first: $limit
          after: $lastCursor
        ) {
      
          edges {
            node {
              id
              endDate
            }
          }
          totalCount
        }
      }`,
      variables: {
        filter: {
          id: {
            eq: `${id}`,
          },
        },
        orderBy: {
          position: 'AscNullsFirst',
        },
      },
    };

    return queryDataCampaignExists;
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
    if (queryDataName === 'campaignForms') {
      data = data.campaignForms.edges[0];
      let valid: boolean = false;

      if (data?.node?.active) {
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

      if (data?.node?.endDate !== null) {
        valid = Date.parse(data?.node?.endDate) > Date.parse(Date());
      }
      if (!valid) {
        throw error('Campaign is not Active');
      }
    }
    if (queryDataName === 'leads') {
      data = data.leads.edges[0];
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
    const formId = idComponents[1];
    const campaignExecutionId = idComponents[2];

    return {
      leadId,
      formId,
      campaignExecutionId,
    };
  };

  decodeRandomId = (encodedRandomId: string) => {
    const decodedRandomId = new TextDecoder().decode(
      base64.toByteArray(encodedRandomId),
    );

    return this.extractIdsFromRandomId(decodedRandomId);
  };
  queryAppointmentFormData(data, decoded_ids) {
    const queryAppointmentForm = {
      query: `mutation CreateOneAppointmentForm($input: AppointmentFormCreateInput!) {
        createAppointmentForm(data: $input) {
          id
        }
      }`,
      variables: {
        input: {
          email: `${data?.email ?? ''}`,
          firstName: `${data?.firstName ?? ''}`,
          lastName: `${data?.lastName ?? ''}`,
          appointmentDate: data?.appintmentDate ?? null,
          contactNumber: `${data?.contactNumber ?? ''}`,
          appointmentLocation: `${data?.appointmentLocation ?? ''}`,
          reasonForAppointment: `${data?.reasonForAppointment ?? ''}`,
          consent: `${data?.consent ?? ''}`,
          appointmentType: `${data?.appointmentType ?? ''}`,
          leadNameId: `${decoded_ids?.leadId}`,
        },
      },
    };

    return queryAppointmentForm;
  }

  async validateFormDetails(id: string) {
    const decoded_ids = this.decodeRandomId(id);

    console.log(decoded_ids);
    try {
      if (
        await this.apiCall(
          this.queryDataCampaignForm(decoded_ids.formId),
          'campaignForms',
        )
      ) {
        throw error('Camapign Form Not Found');
      }
      if (
        await this.apiCall(
          this.queryDataCampaignTrigger(decoded_ids.campaignExecutionId),
          'campaignTriggers',
        )
      ) {
        throw error('Camapign Execution Not Found');
      }
      if (await this.apiCall(this.queryDataLead(decoded_ids.leadId), 'leads')) {
        throw error('Lead Not Found');
      }
      const response = await this.fetchLeadData(
        this.queryDataLead(decoded_ids.leadId),
      );

      // console.log(response?.data?.leads?.edges[0].node?.name);
      const fetchedData = {
        name: response?.data?.leads?.edges[0].node?.name,
        email: response?.data?.leads?.edges[0].node?.email,
      };

      return fetchedData;
    } catch (error) {
      console.error(error);
    }
  }

  async saveFormResponse(id: string, formData: FormDataDTO) {
    try {
      const decoded_ids = this.decodeRandomId(id);

      console.log(decoded_ids);
      const response = await fetch(this.uri, {
        method: 'post',
        body: JSON.stringify(
          this.queryAppointmentFormData(formData, decoded_ids),
        ),
        headers: this.headers,
      });

      const data = await response.json();

      if (data.errors) {
        throw error('Required Form Data is Invalid');
      }
      const airflowResponse = await this.triggerIdentifiedWorkflow(decoded_ids);

      console.log(airflowResponse, 'airflowResponse');

      return 'Form Data Saved Successfully';
    } catch (error) {
      console.error(error);
    }
  }

  // queryOpportunityId(objectId) {
  //   console.log('objectId-------------', objectId);
  //   const queryOpportunityIdExists = {
  //     query: `query FindManyCampaignLists($filter: CampaignListFilterInput, $orderBy: CampaignListOrderByInput, $lastCursor: String, $limit: Float, $opportunityLeadFilter: OpportunityFilterInput) {
  //       campaignLists(
  //         filter: $filter
  //         orderBy: $orderBy
  //         first: $limit
  //         after: $lastCursor

  //       ) {
  //         edges {
  //           node {
  //             id
  //             campaignOpportunities(filter: $opportunityLeadFilter) {
  //               edges {
  //                 node {
  //                   id
  //                 }
  //               }
  //             }
  //           }
  //         }

  //       }
  //     }`,
  //     variables: {
  //       filter: {
  //         id: {
  //           eq: `${objectId.campaignExecutionId}`,
  //         },
  //       },
  //       opportunityLeadFilter: {
  //         leadOfContactId: {
  //           eq: `${objectId.leadId}`,
  //         },
  //         campaignNameId: {
  //           eq: `${objectId.campaignExecutionId}`,
  //         },
  //       },
  //     },
  //   };

  //   return queryOpportunityIdExists;
  // }

  // mutationUpdateOpportunityId(opportunityId) {
  //   const mutationUpdateOpportunityIdObject = {
  //     query: `mutation UpdateOneOpportunity($idToUpdate: ID!, $input: OpportunityUpdateInput!) {
  //       updateOpportunity(id: $idToUpdate, data: $input) {
  //         id
  //       }
  //     }`,
  //     variables: {
  //       idToUpdate: `${opportunityId}`,
  //       input: {
  //         stage: 'IDENTIFIED',
  //       },
  //     },
  //   };

  //   return mutationUpdateOpportunityIdObject;
  // }

  // async changeStateOfLeadToIdentified(decoded_ids) {
  //   try {
  //     console.log('decoded_ids decoded_ids', decoded_ids);
  //     const response = await fetch(this.uri, {
  //       method: 'post',
  //       body: JSON.stringify(this.queryOpportunityId(decoded_ids)),
  //       headers: this.headers,
  //     });

  //     const data = await response.json();

  //     if (data.errors) {
  //       throw error('Required IDs are Invalid');
  //     }
  //     const opportunity_id =
  //       data?.data?.campaignLists?.edges[0]?.node?.campaignOpportunities
  //         ?.edges[0]?.node?.id;

  //     const updatedOpportunityResponse = await fetch(this.uri, {
  //       method: 'post',
  //       body: JSON.stringify(this.mutationUpdateOpportunityId(opportunity_id)),
  //       headers: this.headers,
  //     });
  //     const updatedOpportunityData = await updatedOpportunityResponse.json();

  //     if (updatedOpportunityData.errors) {
  //       throw error('Invalid Opportunity');
  //     }

  //     return 'Updated Stage';
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }
}
