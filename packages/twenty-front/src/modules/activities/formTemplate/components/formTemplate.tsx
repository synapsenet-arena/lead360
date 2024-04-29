import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { ActivityTargetableObject } from '@/activities/types/ActivityTargetableEntity';
import DateTimePicker from '@/ui/input/components/internal/date/components/DateTimePicker';
import { useLazyQuery } from '@apollo/client';
import { GET_CAMPAIGN_LISTS } from '@/users/graphql/queries/getCampaignList';
import { Form1 } from '~/pages/campaigns/Form1';
import { Form2 } from '~/pages/campaigns/Form2';
import { Form3 } from '~/pages/campaigns/Form3';

const StyledComboInputContainer = styled.div`
  display: flex;
  align-items: center;
  align-self: center;
  justify-content: start;
  margin: ${({ theme }) => theme.spacing(10)};

`;

const StyledLabel = styled.span`
  color: ${({ theme }) => theme.font.color.tertiary};
  font-size: ${({ theme }) => theme.font.size.xs};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  margin-left: ${({ theme }) => theme.spacing(2)};
  margin-right: ${({ theme }) => theme.spacing(6)};
  display: flex;
  align-items: center;
`;

const StyledCheckboxLabel = styled.span`
  margin-left: ${({ theme }) => theme.spacing(2)};
`;

const StyledContainer = styled.div`
  align-items: flex-start;
  align-self: stretch;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 8px 24px;
`;

const StyledTitleBar = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing(4)};
  margin-top: ${({ theme }) => theme.spacing(4)};
  place-items: center;
  width: 100%;
`;

const StyledTitle = styled.h3`
  color: ${({ theme }) => theme.font.color.primary};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  font-size:${({ theme }) => theme.font.size.md}
`;

const StyledScheduleTitle = styled.h3`
  color: ${({ theme }) => theme.font.color.primary};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  font-size:${({ theme }) => theme.font.size.xs}
`;


const StyledCount = styled.span`
  color: ${({ theme }) => theme.font.color.light};
  margin-left: ${({ theme }) => theme.spacing(2)};
`;

const StyledTaskRows = styled.div`
  background-color: ${({ theme }) => theme.background.secondary};
  border: 1px solid ${({ theme }) => theme.border.color.light};
  border-radius: ${({ theme }) => theme.border.radius.md};
  width: 100%;
`;

export const FormTemplate = ({
  targetableObject,
}: {
  targetableObject: ActivityTargetableObject;
}) => {

    let [selectedCampaign, { data: selectedCampaignData }] =
    useLazyQuery(GET_CAMPAIGN_LISTS);
    const [form, setForm] = useState("");
    
    useEffect(() => {
        const fetchLeads = async () => {
          try {
            const data = await selectedCampaign({
              variables: {
                filter: {
                  id: { eq: targetableObject.id },
                },
              },
            });
        const formTemplateName = data?.data?.campaigns?.edges[0]?.node?.formTemplate?.value;
        setForm(formTemplateName)
        console.log(formTemplateName,"formTemplateName")

      } catch (error) {
        console.error('Error fetching form template:', error);
      }
    };
    
        fetchLeads();
      }, [targetableObject.id, selectedCampaign]);

      switch (form) {
        case 'CampaignForm':
          return (
            <StyledContainer>
              <StyledTitleBar>
                <StyledTitle>Campaign Form</StyledTitle>
              </StyledTitleBar>
              <Form1 />
            </StyledContainer>
          );
        case 'CampaignForm2':
          return (
            <StyledContainer>
              <StyledTitleBar>
                <StyledTitle>Campaign Form 2</StyledTitle>
              </StyledTitleBar>
              <Form2 />
            </StyledContainer>
          );
        case 'CampaignForm3':
          return (
            <StyledContainer>
              <StyledTitleBar>
                <StyledTitle>Campaign Form 3</StyledTitle>
              </StyledTitleBar>
              <Form3 />
            </StyledContainer>
          );
        default:
          return (
            <StyledContainer>
              <StyledTitleBar>
                <StyledTitle>No Form Template Selected</StyledTitle>
              </StyledTitleBar>
            </StyledContainer>
          );
      }
    };
