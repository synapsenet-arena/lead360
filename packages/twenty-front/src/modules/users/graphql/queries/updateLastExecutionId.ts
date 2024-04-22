import { gql } from '@apollo/client';

export const UPDATE_LAST_EXECUTION_ID = gql`
mutation UpdateOneCampaign($idToUpdate: ID!, $input: CampaignUpdateInput!) {
    updateCampaign(id: $idToUpdate, data: $input) {
      id
    }
  }
`;