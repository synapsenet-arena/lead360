import styled from '@emotion/styled';

import { H2Title } from '@/ui/display/typography/components/H2Title';
import { Checkbox, CheckboxVariant, CheckboxSize, CheckboxShape } from '@/ui/input/components/Checkbox';
import { Select } from '@/ui/input/components/Select';
import { TextArea } from '@/ui/input/components/TextArea';
import { TextInput } from '@/ui/input/components/TextInput';

const StyledDiv = styled.div``;

const StyledCard = styled.div`
  border: 1px solid ${({ theme }) => theme.border.color.medium};
  border-radius: ${({ theme }) => theme.border.radius.sm};
  color: ${({ theme }) => theme.font.color.secondary};
  box-shadow: ${({ theme }) => theme.boxShadow.strong};
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: ${({ theme }) => theme.background.primary};
  height: 120%;
  width: 100%;
  margin: auto;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

const StyledTitleContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
`;

const StyledTitle = styled.h2`
  color: ${({ theme }) => theme.font.color.primary};
  font-size: ${({ theme }) => theme.font.size.lg};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  padding: ${({ theme }) => theme.spacing(6)};
`;

const StyledInputCard = styled.div`
  color: ${({ theme }) => theme.font.color.secondary};
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  justify-content: space-between;
  width: 70%;
  align-items: center;
`;

const StyledAreaLabel = styled.span`
  align-content: flex-start;
  display: flex;
  flex-direction: column;
  margin-bottom: 2%;
  width: 100%;
`;

const StyledSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing(6)};
`;

const StyledCheckboxInput = styled.div`
  margin-top: ${({ theme }) => theme.spacing(4)};
`;

const StyledCheckboxLabel = styled.span`
  margin-left: ${({ theme }) => theme.spacing(2)};
`;

const StyledComboInputContainer = styled.div`
  display: flex;
  flex-direction: row;
  > * + * {
    margin-left: ${({ theme }) => theme.spacing(4)};
  }
`;

const StyledButton = styled.span`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing(6)};
  margin-top: ${({ theme }) => theme.spacing(6)};
`;

export const Form2 = () => {
  const createOptions = (options: any[]) =>
    options.map((option: any) => ({ label: option, value: option }));
  const locationOptions = createOptions([
    'Yelhanka',
    'Rajajinagar',
    'Nagawara',
  ]);
  const apptTypeOptions = createOptions(['Initial Consultation', 'Follow-up']);

  return (
    //div id - save id in form
    <StyledDiv>
      <StyledCard>
        <StyledTitleContainer>
          <StyledTitle>Appointment Scheduling Form</StyledTitle>
        </StyledTitleContainer>
        <StyledInputCard>
          <StyledAreaLabel>
            <StyledSection>
              <H2Title title="First Name" description="Enter your first name" />
              <TextInput
                placeholder={'Enter first name'}
                value={'firstName'}
                name="firstName"
                required
                fullWidth
                disabled
              />
            </StyledSection>
            <StyledSection>
              <H2Title title="Last Name" description="Enter your last name" />
              <TextInput
                placeholder={'Enter last name'}
                value={'lastName'}
                name="lastName"
                required
                fullWidth
                disabled
              />
            </StyledSection>
            <StyledSection>
              <H2Title title="Email" description="Enter your email address" />
              <TextInput
                placeholder={'Enter email address'}
                value={'email'}
                name="email"
                required
                fullWidth
                disabled
              />
            </StyledSection>

            <StyledSection>
              <H2Title
                title="Contact Number"
                description="Enter your contact number"
              />
              <TextInput
                placeholder={'Enter contact number'}
                value={'contact'}
                name="contact"
                required
                fullWidth
                disabled
              />
            </StyledSection>
            <StyledSection>
              <H2Title
                title="Reason for Appointment"
                description="State the reason for your appointment"
              />
              <TextArea
                value={'comments'}
                placeholder={'State the reason for the apppointment'}
                minRows={5}
                disabled
              />
            </StyledSection>

            <StyledSection>
              <H2Title
                title="Appointment Type"
                description="Is this your first consultation or a follow-up?"
              />
              <Select
                fullWidth
                dropdownId={'appointmentType'}
                value={'apptType'}
                options={apptTypeOptions}
                disabled
              />
            </StyledSection>
            <StyledSection>
              <H2Title
                title="Appointment Location"
                description="Select your appointment location"
              />
              <Select
                fullWidth
                dropdownId={'appointmentLocation'}
                value={'location'}
                options={locationOptions}
                disabled
              />
            </StyledSection>

            <StyledCheckboxInput>
              <H2Title
                title="Consent*"
                description="Read the terms and conditions before agreeing."
              />
            </StyledCheckboxInput>
            <StyledComboInputContainer>
              <Checkbox
                checked={false}  
                disabled
              />
              <StyledCheckboxLabel>
                I agree to the terms and conditions.
              </StyledCheckboxLabel>
            </StyledComboInputContainer>
          </StyledAreaLabel>
        </StyledInputCard>
      </StyledCard>
    </StyledDiv>
  );
};
