import { Injectable } from '@nestjs/common';

@Injectable()
export class GetLeadData {
  queryLeadData(id: string) {
    const queryLeadDataExists = {
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

    return queryLeadDataExists;
  }
}
