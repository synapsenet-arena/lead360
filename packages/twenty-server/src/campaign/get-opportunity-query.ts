import { Injectable } from '@nestjs/common';

@Injectable()
export class GetOpportunityData {
  queryOpportunityId(data: any) {
    const queryOpportunityIdExists = {
      query: `query FindManyOpportunities($filter: OpportunityFilterInput, $orderBy: OpportunityOrderByInput, $lastCursor: String, $limit: Float) {
        opportunities(
          filter: $filter
          orderBy: $orderBy
          first: $limit
          after: $lastCursor
        ) {
          edges {
            node {
              id
            }
          }
          totalCount
        }
      }
      `,
      variables: {
        filter: {
          campaignTriggerId: {
            eq: `${data.campaignTriggerId}`,
          },
          leadId: {
            eq: `${data.leadId}`,
          },
          stage: {
            eq: 'INFORMED',
          },
        },
      },
    };

    return queryOpportunityIdExists;
  }
}
