import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { ActivityTargetableObject } from '@/activities/types/ActivityTargetableEntity';
import { useLazyQuery } from '@apollo/client';
import { GET_CAMPAIGN_LISTS } from '@/users/graphql/queries/getCampaignList';
import { Form1 } from '~/pages/campaigns/Form1';
import { Form2 } from '~/pages/campaigns/Form2';
import { Form3 } from '~/pages/campaigns/Form3';
import { EllipsisDisplay } from '@/ui/field/display/components/EllipsisDisplay';
import { TextDisplay } from '@/ui/field/display/components/TextDisplay';
import { DateDisplay } from '@/ui/field/display/components/DateDisplay';
import { GET_CAMPAIGN_TRIGGER } from '@/users/graphql/queries/getOneCampaignTrigger';

const StyledComboInputContainer = styled.div`
  display: flex;
  align-items: center;
  align-self: center;
  justify-content: start;
  margin: ${({ theme }) => theme.spacing(10)};
`;

const StyledTitleBar = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
`;

const StyledLabelContainer = styled.div`
  color: ${({ theme }) => theme.font.color.tertiary};
  width: auto;
  margin-right: ${({ theme }) => theme.spacing(4)};
`;

export const FormTemplate = ({
  targetableObject,
}: {
  targetableObject: ActivityTargetableObject;
}) => {
  let [selectedCampaign, { data: selectedCampaignData }] =
    useLazyQuery(GET_CAMPAIGN_LISTS);
  let [selectedCampaignTrigger, { data: selectedCampaignTriggerData }] =
    useLazyQuery(GET_CAMPAIGN_TRIGGER, {
      fetchPolicy: 'network-only',
    });
  let campaignId = '';
  const [form, setForm] = useState('');
  const [formFetched, setFormFetched] = useState({
    name: '',
    description: '',
    createdAt: '',
    status: '',
  });

  useEffect(() => {
    const fetchFormDetails = async () => {
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
        const formTemplateName =
          data?.data?.campaigns?.edges[0]?.node?.formTemplate?.value;
        setForm(formTemplateName);
        setFormFetched({
          name: data?.data?.campaigns?.edges[0]?.node?.formTemplate?.name || '',
          description:
            data?.data?.campaigns?.edges[0]?.node?.formTemplate?.description ||
            '',
          createdAt:
            data?.data?.campaigns?.edges[0]?.node?.formTemplate?.createdAt ||
            '',
          status:
            data?.data?.campaigns?.edges[0]?.node?.formTemplate?.status || '',
        });
      } catch (error) {
        console.error('Error fetching form template:', error);
      }
    };

    fetchFormDetails();
  }, [targetableObject.id, selectedCampaign]);

  const renderForm = () => {
    switch (form) {
      case 'CampaignForm':
        return <Form1 />;
      case 'CampaignForm2':
        return <Form2 />;
      case 'CampaignForm3':
        return <Form3 />;
      default:
        return null;
    }
  };
  return (
    <>
      <StyledTitleBar>
        <StyledComboInputContainer>
          <StyledLabelContainer>
            <EllipsisDisplay>Name:</EllipsisDisplay>
          </StyledLabelContainer>
          <TextDisplay text={formFetched.name || ''} />
        </StyledComboInputContainer>
        {/* <StyledComboInputContainer>
          <StyledLabelContainer>
            <EllipsisDisplay>Description:</EllipsisDisplay>
          </StyledLabelContainer>
          <TextDisplay text={formFetched.description || ''} />
        </StyledComboInputContainer> */}
        <StyledComboInputContainer>
          <StyledLabelContainer>
            <EllipsisDisplay>Created At:</EllipsisDisplay>
          </StyledLabelContainer>
          <DateDisplay value={formFetched.createdAt || ''} />
        </StyledComboInputContainer>
        <StyledComboInputContainer>
          <StyledLabelContainer>
            <EllipsisDisplay>Status:</EllipsisDisplay>
          </StyledLabelContainer>
          <TextDisplay text={formFetched.status || ''} />
        </StyledComboInputContainer>
      </StyledTitleBar>
      {renderForm()}
    </>
  );
};
