import { useState } from 'react';
import styled from '@emotion/styled';

import { H2Title } from 'twenty-ui';
import { Checkbox } from '@/ui/input/components/Checkbox';
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
 height: auto;
 width: 100%;
 margin: auto;
 align-items: center;
 margin-bottom: ${({ theme }) => theme.spacing(2)};
 overflow-y: scroll;
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
  height: 1005%;
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
`;

interface PreexistingConditions {
  diabetes: boolean;
  asthma: boolean;
  seizures: boolean;
  bloodpressure: boolean;
}

interface PreexistingDiseases {
  cardiovascular: boolean;
  respiratory: boolean;
  genitourinary: boolean;
  cns: boolean;
  other: boolean;
}

export const Form3 = () => {
  const [preexistingConditions, setPreexistingConditions] =
    useState<PreexistingConditions>({
      diabetes: false,
      asthma: false,
      seizures: false,
      bloodpressure: false,
    });

  const [preexistingDiseases, setPreexistingDiseases] =
    useState<PreexistingDiseases>({
      cardiovascular: false,
      respiratory: false,
      genitourinary: false,
      cns: false,
      other: false,
    });

  return (
    <StyledDiv>
      <StyledCard>
        <StyledTitleContainer>
          <StyledTitle>Medical Fitness Form</StyledTitle>
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
            <StyledAreaLabel>
              <StyledSection>
                <H2Title title="Gender" description="Select your Gender" />
                <StyledComboInputContainer>
                  <Checkbox checked={false} disabled />
                  <StyledCheckboxLabel>Male</StyledCheckboxLabel>
                  <Checkbox checked={false} disabled />
                  <StyledCheckboxLabel>Female</StyledCheckboxLabel>
                  <Checkbox checked={false} disabled />
                  <StyledCheckboxLabel>Others</StyledCheckboxLabel>
                </StyledComboInputContainer>
              </StyledSection>
            </StyledAreaLabel>
            <StyledSection>
              <H2Title
                title="Height"
                description="Enter your height in centimeters"
              />
              <TextInput
                placeholder={'Enter height'}
                value={'height'}
                name="height"
                required
                fullWidth
                disabled
              />
            </StyledSection>
            <StyledSection>
              <H2Title
                title="Weight"
                description="Enter your weight in kilograms"
              />
              <TextInput
                placeholder={'Enter weight'}
                value={'weight'}
                name="weight"
                required
                fullWidth
                disabled
              />
            </StyledSection>
            <StyledAreaLabel>
              <StyledSection>
                <H2Title
                  title="Preexisting Conditions"
                  description="Check any preexisting conditions"
                />
                <StyledComboInputContainer>
                  <Checkbox checked={false} disabled />
                  <StyledCheckboxLabel>Diabetes</StyledCheckboxLabel>
                  <Checkbox checked={false} disabled />
                  <StyledCheckboxLabel>Asthma</StyledCheckboxLabel>
                  <Checkbox checked={false} disabled />
                  <StyledCheckboxLabel>Seizures</StyledCheckboxLabel>
                  <Checkbox checked={false} disabled />
                  <StyledCheckboxLabel>BloodPressure</StyledCheckboxLabel>
                </StyledComboInputContainer>
              </StyledSection>
            </StyledAreaLabel>

            <StyledAreaLabel>
              <StyledSection>
                <H2Title
                  title="Preexisting Diseases"
                  description="Check any preexisting diseases"
                />

                <StyledComboInputContainer>
                  <Checkbox checked={false} disabled />
                  <StyledCheckboxLabel>Hypertension</StyledCheckboxLabel>

                  <Checkbox checked={false} disabled />
                  <StyledCheckboxLabel>Arthritis</StyledCheckboxLabel>

                  <Checkbox checked={false} disabled />
                  <StyledCheckboxLabel>Genitourinary</StyledCheckboxLabel>

                  <Checkbox checked={false} disabled />
                  <StyledCheckboxLabel>Diabetes</StyledCheckboxLabel>
                  <Checkbox checked={false} disabled />
                  <StyledCheckboxLabel>Other</StyledCheckboxLabel>
                </StyledComboInputContainer>
              </StyledSection>
            </StyledAreaLabel>
            <StyledSection>
              <H2Title
                title="Consent*"
                description="Read the terms and conditions before agreeing."
              />
              <StyledComboInputContainer>
                <Checkbox checked={false} disabled />
                <StyledCheckboxLabel>
                  I agree to the terms and conditions.
                </StyledCheckboxLabel>
              </StyledComboInputContainer>
            </StyledSection>
          </StyledAreaLabel>
        </StyledInputCard>
      </StyledCard>
    </StyledDiv>
  );
};
