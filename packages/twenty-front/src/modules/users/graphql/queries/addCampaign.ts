import { gql } from '@apollo/client';
export const ADD_CAMPAIGN = gql`
mutation CreateOneCampaign($input: CampaignCreateInput!) {
  createCampaign(data: $input) {
    id
  }}`;


  