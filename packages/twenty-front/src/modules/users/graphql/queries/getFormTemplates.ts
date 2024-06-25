import { gql } from '@apollo/client';

export const GET_FORM_TEMPLATES = gql`
query FindManyFormTemplates($filter: FormTemplateFilterInput, $orderBy: [FormTemplateOrderByInput], $lastCursor: String, $limit: Int) {
    formTemplates(
      filter: $filter
      orderBy: $orderBy
      first: $limit
      after: $lastCursor
    ) {
      edges {
        node {
          id
          status
          value
          createdAt
          name
        }
      }
      pageInfo {
        hasNextPage
        startCursor
        endCursor
      }
      totalCount
    }
  }`