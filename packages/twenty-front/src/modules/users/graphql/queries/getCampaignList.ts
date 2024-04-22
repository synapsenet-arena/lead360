import { gql } from '@apollo/client';

export const GET_CAMPAIGN_LISTS = gql`
query FindManyCampaigns($filter: CampaignsFilterInput, $orderBy: CampaignOrderByInput, $lastCursor: String, $limit: Float) {
  campaigns(
    filter: $filter
    orderBy: $orderBy
    first: $limit
    after: $lastCursor
  ) {
    edges {
      node {
        id
        name
        formUrl
        description
        formNameId
        updatedAt
        campaignName
        segment {
          id
          segmentDescription
          filters
          segmentName
          name
        }
        messagingMedia
        specialtyType
        startDate
        lastExecution
        id
        subSpecialtyType
        lastExecutionId
        createdAt
        segmentId
        status
        endDate
        leads
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
}`