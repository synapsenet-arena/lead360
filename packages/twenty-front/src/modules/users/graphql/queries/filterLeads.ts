import { gql } from '@apollo/client';

export const FILTER_LEADS =  gql`
query FindManyLeads($filter: LeadFilterInput, $orderBy: [LeadOrderByInput], $lastCursor: String, $limit: Int) {
    leads(filter: $filter, orderBy: $orderBy, first: $limit, after: $lastCursor) {
      edges {
        node {
          id
          email
          age
          gender
          name
          phoneNumber
          advertisementName
          campaignName
          comments
          advertisementSource
          createdAt
          location
        }
      }
      pageInfo {
        hasNextPage
        startCursor
        endCursor
        __typename
      }
      totalCount
      __typename
    }
  }`;