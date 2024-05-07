import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { ActivityTargetableObject } from '@/activities/types/ActivityTargetableEntity';
import { GET_CAMPAIGN_LISTS } from '@/users/graphql/queries/getCampaignList';
import { useLazyQuery } from '@apollo/client';
import { EllipsisDisplay } from '@/ui/field/display/components/EllipsisDisplay';

import { TextDisplay } from '@/ui/field/display/components/TextDisplay';
import { TextArea } from '@/ui/input/components/TextArea';
import { GET_CAMPAIGN_TRIGGER } from '@/users/graphql/queries/getOneCampaignTrigger';

const StyledDetailContainer = styled.div`
  display: flex;
  margin: ${({ theme }) => theme.spacing(6)};
  // margin-left: ${({ theme }) => theme.spacing(6)};
`;

const StyledLabelContainer = styled.div`
  color: ${({ theme }) => theme.font.color.tertiary};
  flex: 1;
  margin-left: ${({ theme }) => theme.spacing(0)};
`;

const StyledValueContainer = styled.div`
  flex: 5;
  margin-left: ${({ theme }) => theme.spacing(0)};
`;
const StyledAreaValueContainer = styled.div`
  flex: 5;
  margin-left: ${({ theme }) => theme.spacing(0)};
`;

const StyledTextArea = styled.textarea`
  height: 200px; /* Adjust the height as needed */
  width: 100%;
  padding: 8px;
  font-size: 16px;
  border-radius: 4px;
  border: 1px solid #ccc;
  resize: vertical; /* Allow vertical resizing */
`;
export const MessageTemplate = ({
  targetableObject,
}: {
  targetableObject: ActivityTargetableObject;
}) => {
  const [messageTemplate, setMessageTemplate] = useState<any | any[]>([]);
  let [selectedCampaign] = useLazyQuery(GET_CAMPAIGN_LISTS);
  let [selectedCampaignTrigger, { data: selectedCampaignTriggerData }] =
    useLazyQuery(GET_CAMPAIGN_TRIGGER, {
      fetchPolicy: 'network-only',
    });
  let campaignId = '';
  const messageTeamplateDetails = async () => {
    try {
      if (targetableObject.targetObjectNameSingular === 'campaignTrigger') {
        const data = await selectedCampaignTrigger({
          variables: {
            objectRecordId: targetableObject.id,
          },
        });

        campaignId = data.data.campaignTrigger.campaignId;
      } else if (targetableObject.targetObjectNameSingular === 'campaign') {
        campaignId = targetableObject.id;
      }
      const data = await selectedCampaign({
        variables: {
          filter: {
            id: { eq: campaignId },
          },
        },
      });
      setMessageTemplate([
        data?.data?.campaigns?.edges[0]?.node?.messageTemplate,
      ]);
    } catch (error) {
      console.error('Error fetching message template:', error);
    }
  };

  useEffect(() => {
    messageTeamplateDetails();
  }, [targetableObject.id, selectedCampaign]);

  return (
    <>
      <StyledDetailContainer>
        <StyledLabelContainer>
          <EllipsisDisplay>Name</EllipsisDisplay>
        </StyledLabelContainer>
        <StyledValueContainer>
          <TextDisplay text={messageTemplate[0]?.name} />
        </StyledValueContainer>
      </StyledDetailContainer>
      <StyledDetailContainer>
        <StyledLabelContainer>
          <EllipsisDisplay>Channel Type</EllipsisDisplay>
        </StyledLabelContainer>
        <StyledValueContainer>
          <TextDisplay text={messageTemplate[0]?.channelType} />
        </StyledValueContainer>
      </StyledDetailContainer>
      <StyledDetailContainer>
        <StyledLabelContainer>
          <EllipsisDisplay>Status</EllipsisDisplay>
        </StyledLabelContainer>
        <StyledValueContainer>
          <TextDisplay text={messageTemplate[0]?.status} />
        </StyledValueContainer>
      </StyledDetailContainer>
      <StyledDetailContainer>
        <StyledLabelContainer>
          <EllipsisDisplay>Body</EllipsisDisplay>
        </StyledLabelContainer>
        <StyledAreaValueContainer>
          <TextArea
            placeholder={messageTemplate[0]?.body}
            minRows={20}
            value={messageTemplate[0]?.body}
            disabled
          />
        </StyledAreaValueContainer>
      </StyledDetailContainer>
    </>
  );
};
