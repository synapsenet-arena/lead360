import { Checkbox, CheckboxVariant, CheckboxSize, CheckboxShape } from '@/ui/input/components/Checkbox';
import { Select } from '@/ui/input/components/Select';
import { GET_MESSAGE_TEMPLATES } from '@/users/graphql/queries/getMessageTemplates';
import { useQuery } from '@apollo/client';
import styled from '@emotion/styled';
import { Section } from '@react-email/components';
import { ChangeEvent, useState } from 'react';
import { H2Title } from 'twenty-ui';
import { useCampaign } from '~/pages/campaigns/CampaignUseContext';
import { defaultOption } from '~/pages/campaigns/Campaigns';


const StyledSection = styled(Section)`
  align-items: flex-start;
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  margin-left: 0;
`;

const StyledComboInputContainer = styled.div`
  display: flex;
  align-items: center;
  > * + * {
    margin-left: ${({ theme }) => theme.spacing(4)};
  }
`;

const StyledLabel = styled.span`
  color: ${({ theme }) => theme.font.color.light};
  font-size: ${({ theme }) => theme.font.size.xs};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  margin-left: ${({ theme }) => theme.spacing(2)};
  display: flex;
  align-items: center;
  text-transform: uppercase;
`;

const StyledCheckboxLabel = styled.span`
  margin-left: ${({ theme }) => theme.spacing(2)};
`;


type MessageTemplate = {
    value: string;
    label: string;
  };
export const CampaignCommunication=()=>{
    const [messageTemplates, setMessageTemplates] = useState<MessageTemplate[]>();
    const { campaignData, setCampaignData } = useCampaign();

    const { loading: templatesLoading, data: templatesData } = useQuery(
        GET_MESSAGE_TEMPLATES,
      );
    const fetchTemplates = (channelType: string) => {
        const channelTemplates = templatesData?.messageTemplates.edges
          .filter((edge: { node: any }) => edge.node?.channelType === channelType)
          .map((edge: { node: any }) => ({
            value: edge.node?.id,
            label: edge.node?.name,
          }));
        setMessageTemplates(channelTemplates);
      };
    
      const onSelectCheckBoxChange = (
        event: ChangeEvent<HTMLInputElement>,
        channel: string,
      ): void => {
        // throw new Error('Function not implemented.');
        setCampaignData((prevData: any) => ({
          ...prevData,
          [channel]: event.target.checked,
        }));
      };
    
    
    return (

        <>
        
        <Section>
            <Section>
              <H2Title
                title="Target Communication"
                description="Choose your communication medium."
              />
            </Section>

            <StyledSection>
              <StyledComboInputContainer>
                <StyledLabel>
                  <Checkbox
                    checked={campaignData.Whatsapp || false}
                    indeterminate={false}
                    onChange={(event) => {
                      onSelectCheckBoxChange(event, 'WHATSAPP');
                      if (event.target.checked) {
                        fetchTemplates('WHATSAPP');
                      } else {
                        setMessageTemplates([]);
                      }
                      setCampaignData({
                        ...campaignData,
                        Whatsapp: event.target.checked,
                        Email: !event.target.checked
                          ? campaignData.Email
                          : false,
                      });
                    }}
                    variant={CheckboxVariant.Primary}
                    size={CheckboxSize.Small}
                    shape={CheckboxShape.Squared}
                  />
                  <StyledCheckboxLabel>WhatsApp</StyledCheckboxLabel>
                </StyledLabel>

                {campaignData.Whatsapp && (
                  <Select
                    fullWidth
                    dropdownId="whatsappTemplate"
                    value={campaignData?.whatsappTemplate}
                    options={messageTemplates ? messageTemplates : defaultOption} // Display fetched templates
                    onChange={(e) => {
                      setCampaignData({
                        ...campaignData,
                        whatsappTemplate: e,
                      });
                    }}
                  />
                )}
              </StyledComboInputContainer>

              <StyledComboInputContainer>
                <StyledLabel style={{ marginBottom: '5px' }}>
                  <Checkbox
                    checked={campaignData.Email || false}
                    indeterminate={false}
                    onChange={(event) => {
                      onSelectCheckBoxChange(event, 'EMAIL');
                      if (event.target.checked) {
                        fetchTemplates('EMAIL'); // Fetch Email templates
                      } else {
                        setMessageTemplates([]); // Reset templates when Email checkbox is unchecked
                      }
                      setCampaignData({
                        ...campaignData,
                        Email: event.target.checked,
                        Whatsapp: !event.target.checked
                          ? campaignData.Whatsapp
                          : false,
                      });
                    }}
                    variant={CheckboxVariant.Primary}
                    size={CheckboxSize.Small}
                    shape={CheckboxShape.Squared}
                  />
                  <StyledCheckboxLabel>Email</StyledCheckboxLabel>
                </StyledLabel>

                {campaignData.Email && (
                  <Select
                    fullWidth
                    dropdownId="emailTemplate"
                    value={campaignData?.emailTemplate}
                    options={messageTemplates ? messageTemplates : defaultOption} // Display fetched templates
                    onChange={(e) => {
                      setCampaignData({
                        ...campaignData,
                        emailTemplate: e,
                      });
                    }}
                  />
                )}
              </StyledComboInputContainer>
            </StyledSection>
          </Section>
          </>
    )
}