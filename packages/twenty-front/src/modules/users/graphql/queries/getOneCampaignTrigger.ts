import { gql } from '@apollo/client';

export const GET_CAMPAIGN_TRIGGER = gql`query FindOnecampaignTrigger($objectRecordId: ID!) {
    campaignTrigger(filter: {id: {eq: $objectRecordId}}) {
      id
      campaignId
    }
  }`