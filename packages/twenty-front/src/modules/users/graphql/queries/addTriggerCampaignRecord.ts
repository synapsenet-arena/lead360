import { gql } from '@apollo/client';

export const ADD_TRIGGER_CAMPAIGN_RECORD = gql`mutation CreateOneCampaignTrigger($input: CampaignTriggerCreateInput!) {
    createCampaignTrigger(data: $input) {
      id
      name
      status
    }
  }`