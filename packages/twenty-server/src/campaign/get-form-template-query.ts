import { Injectable } from '@nestjs/common';

@Injectable()
export class GetFormTemplate {
  queryFormTemplate(id: string) {
    const queryFormTemplateExists = {
      query: `query FindManyFormTemplates($filter: FormTemplateFilterInput, $orderBy: FormTemplateOrderByInput, $lastCursor: String, $limit: Float) {
            formTemplates(
              filter: $filter
              orderBy: $orderBy
              first: $limit
              after: $lastCursor
            ) {
              edges {
                node {
                  id
                  name
                  status
                }
                cursor
                __typename
              }
              pageInfo {
                hasNextPage
                startCursor
                endCursor
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

    return queryFormTemplateExists;
  }
}
