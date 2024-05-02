import { gql } from '@apollo/client';

export const UPDATE_CAMPAIGNLIST_STATUS = gql`
mutation UpdateOneCampaign($idToUpdate: ID!, $input: CampaignUpdateInput!) {
    updateCampaign(id: $idToUpdate, data: $input) {
      id
    }
  }
`;