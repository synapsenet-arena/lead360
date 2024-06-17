import styled from '@emotion/styled';
import { Button } from '@/ui/input/button/components/Button';
import { IconSpeakerphone } from '@tabler/icons-react';
import { useCampaign } from '~/pages/campaigns/CampaignUseContext';
import { GRAY_SCALE } from '@/ui/theme/constants/GrayScale';
import { PageHeader } from '@/ui/layout/page/PageHeader';
import { ADD_CAMPAIGN } from '@/users/graphql/queries/addCampaign';
import { useMutation } from '@apollo/client';
import { v4 as uuidv4 } from 'uuid';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { useNavigate } from 'react-router-dom';
import {
  CampaignDetails,
  campaignDescriptionState,
  campaignNameState,
} from '~/pages/campaigns/CampaignDetails';
import { useRecoilState } from 'recoil';
import {
  CampaignSpecialty,
  campaignSpecialtyState,
  campaignSubspecialtyState,
} from '~/pages/campaigns/CampaignSpecialty';
import {
  CampaignSegment,
  campaignSegmentState,
} from '~/pages/campaigns/CampaignSegment';
import { CampaignCommunication } from '~/pages/campaigns/CampaignCommunication';
import {
  CampaignFormInput,
  campaignFormInputState,
} from '~/pages/campaigns/CampaignFormInput';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-y: scroll;
`;

const StyledBoardContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  background: ${({ theme }) => theme.background.noisy};
  padding: ${({ theme }) => theme.spacing(2)};
`;

const StyledInputCard = styled.div`
  color: ${({ theme }) => theme.font.color.secondary};
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 65%;
  justify-content: space-between;
  width: 70%;
  align-items: center;
`;

const SytledHR = styled.hr`
  background: ${GRAY_SCALE.gray0};
  color: ${GRAY_SCALE.gray0};
  height: 0.2px;
  width: 100%;
  margin: ${({ theme }) => theme.spacing(8)};
`;

const StyledButton = styled.span`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin: ${({ theme }) => theme.spacing(10)};
`;

export const Campaigns = () => {
  const { campaignData } = useCampaign();
  const [campaignName] = useRecoilState(campaignNameState);
  const [campaignDescription] = useRecoilState(campaignDescriptionState);
  const [specialty] = useRecoilState(campaignSpecialtyState);
  const [subSpecialty] = useRecoilState(campaignSubspecialtyState);
  const [segment] = useRecoilState(campaignSegmentState);
  const [form] = useRecoilState(campaignFormInputState);
  const navigate = useNavigate();

  const { enqueueSnackBar } = useSnackBar();
  const [addCampaigns, { error }] = useMutation(ADD_CAMPAIGN);

  const handleSave = async () => {
    try {
      const id = uuidv4();
      const messageTemplateId = campaignData.whatsappTemplate
        ? campaignData.whatsappTemplate
        : campaignData.emailTemplate
          ? campaignData.emailTemplate
          : null;
      const variables = {
        input: {
          name: campaignName,
          description: campaignDescription,
          messageTemplateId: messageTemplateId,
          specialty: specialty,
          subspecialty: subSpecialty,
          segmentId: segment,
          formTemplateId: form,
          id: id,
        },
      };
      await addCampaigns({
        variables: variables,
      });
      enqueueSnackBar('Campaign added successfully', {
        variant: 'success',
      });
      navigate(`/object/campaign/${id}`);
      // window.location.reload();
    } catch (errors: any) {
      console.error('Error adding campaign:', error);
      enqueueSnackBar(errors.message + 'Error while adding Campaign', {
        variant: 'error',
      });
    }
  };

  return (
    <PageContainer>
      <PageHeader title="Campaign" Icon={IconSpeakerphone}></PageHeader>
      <StyledBoardContainer>
        <StyledInputCard>
          <CampaignDetails />
          <SytledHR />
          <CampaignSpecialty />
          <SytledHR />
          <CampaignSegment />
          <SytledHR />
          <CampaignCommunication />
          <SytledHR />
          <CampaignFormInput />
          <StyledButton>
            <Button
              size="medium"
              title="Save"
              variant="primary"
              accent="dark"
              onClick={handleSave}
            />
          </StyledButton>
        </StyledInputCard>
      </StyledBoardContainer>
    </PageContainer>
  );
};
