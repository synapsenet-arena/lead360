import { Injectable } from '@nestjs/common';

@Injectable()
export class GetCampaignTrigger {
  queryCampaignTrigger(id: string) {
    const queryCampaignTriggerData = {
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
              stopDate
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

    return queryCampaignTriggerData;
  }
}
