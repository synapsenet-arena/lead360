import { gql } from '@apollo/client';

export const GET_CAMPAIGN_LISTS = gql`
query FindManyCampaigns($filter: CampaignFilterInput, $orderBy: CampaignOrderByInput, $lastCursor: String, $limit: Float) {
  campaigns(filter: $filter, orderBy: $orderBy, first: $limit, after: $lastCursor) {
    edges {
      node {
        id
        name
        description
        formTemplate{
            id
            name
        }
        segment{
            id
            name
            filters
        }
        subspecialty
        specialty
        messageTemplate{
            id
            name
        }

        segmentId
        messageTemplateId
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