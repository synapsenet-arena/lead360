import { gql } from '@apollo/client';

export const GET_CONTACTED_OPPORTUNITIES = gql`
query FindOneCampaign(
    $objectRecordId: ID!
    $opportunityLeadFilter: OpportunityFilterInput , $lastCursor: String
  ) {
    campaign(filter: { id: { eq: $objectRecordId } }) {
      __typename
      opportunities(filter: $opportunityLeadFilter, after: $lastCursor) {
        edges {
          node {
            __typename
            messageStatus
            stage
            informedPhoneNumberId
            createdAt
            id
            name
            campaignTriggerId
            campaignId
            leadId
          }
          __typename
        }
        pageInfo {
            hasNextPage
            startCursor
            endCursor
            __typename
          }
        __typename
      }
      id
      campaignExecution {
        edges {
          node {
            __typename
            name
            createdAt
            id
            campaignId
            stopDate
            executionId
            startDate
            position
            status
            updatedAt
          }
          __typename
        }
        __typename
      }
      name
    }
  }
`;
