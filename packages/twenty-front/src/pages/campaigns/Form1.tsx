import { useState } from 'react';
import styled from '@emotion/styled';
import { Section } from '@react-email/components';
import { Button, Checkbox, TextInput } from 'tsup.ui.index';

import { H2Title } from '@/ui/display/typography/components/H2Title';

const StyledCard = styled.div`
  border: 1px solid ${({ theme }) => theme.border.color.medium};
  border-radius: ${({ theme }) => theme.border.radius.sm};
  color: ${({ theme }) => theme.font.color.secondary};
  box-shadow: ${({ theme }) => theme.boxShadow.strong};
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: ${({ theme }) => theme.background.primary};
  height: 95%;
  width: 70%;
  margin: auto;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  overflow-y: scroll;
`;

const StyledFormTitle = styled.h3`
  color: ${({ theme }) => theme.font.color.primary};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
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
  overflow-y: scroll;
`;

const StyledCheckboxInput = styled.div`
  display: flex;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing(1)};
`;

const StyledAreaLabel = styled.span`
  align-content: flex-start;
  display: flex;
  flex-direction: column;
  margin-bottom: 2%;
  width: 100%;
`;
const StyledButton = styled.span`
  display: flex;
  justify-content: space-between;
  width: 100%;
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

export const Form1 = () => {

  const [symptoms, setSymptoms] = useState({
    fever: false,
    cough: false,
    fatigue: false,
    headache: false,
  });

  const [travelHistory, setTravelHistory] = useState({
    withinCountry: false,
    international: false,
  });
  const [contactWithCovid, setContactWithCovid] = useState(false);

  return (
    <>
      <StyledCard>
        <StyledTitleContainer>
          <StyledTitle>Health Screening Form</StyledTitle>
        </StyledTitleContainer>
        <StyledInputCard>
          <Section>
            <H2Title title="First Name" description="Enter your first name" />
            <TextInput
              placeholder={'Enter first name'}
              value={"firstName"}
              name="firstName"
              required
              fullWidth
            />
          </Section>
          <Section>
            <H2Title title="Last Name" description="Enter your last name" />
            <TextInput
              placeholder={'Enter last name'}
              value={"lastName"}
              name="lastName"
              required
              fullWidth
            />
          </Section>
          <Section>
            <H2Title title="Email" description="Enter your email address" />
            <TextInput
              placeholder={'Enter email address'}
              value={"email"}
              name="email"
              required
              fullWidth
            />
          </Section>
          <Section>
            <H2Title
              title="Contact Number"
              description="Enter your contact number"
            />
            <TextInput
              placeholder={'Enter contact number'}
              value={"contact"}
              name="contact"
              required
              fullWidth
            />
          </Section>

          <Section>
            <H2Title title="Age" description="Enter your age" />
            <TextInput
              placeholder={'Enter age'}
              value={"age"}
              name="age"
              required
              fullWidth
            />
          </Section>

          <Section>
            <H2Title title="Blood Type" description="Enter your blood type" />
            <TextInput
              placeholder={'Enter blood type'}
              value={"bloodType"}
              name="bloodType"
              required
              fullWidth
            />
          </Section>

          <StyledAreaLabel>
            <Section>
              <H2Title
                title="Symptoms"
                description="Check any symptoms you are experiencing"
              />
            </Section>
            <StyledComboInputContainer>
              <StyledCheckboxInput>
                <Checkbox
                  checked={symptoms.fever}
                />
                <StyledCheckboxLabel>Fever</StyledCheckboxLabel>
              </StyledCheckboxInput>
              <StyledCheckboxInput>
                <Checkbox
                  checked={symptoms.cough}
                />
                <StyledCheckboxLabel>Cough</StyledCheckboxLabel>
              </StyledCheckboxInput>
              <StyledCheckboxInput>
                <Checkbox
                  checked={symptoms.fatigue}
                />
                <StyledCheckboxLabel>Fatigue</StyledCheckboxLabel>
              </StyledCheckboxInput>
              <StyledCheckboxInput>
                <Checkbox
                  checked={symptoms.headache}
                />
                <StyledCheckboxLabel>Headache</StyledCheckboxLabel>
              </StyledCheckboxInput>
            </StyledComboInputContainer>
          </StyledAreaLabel>

          <StyledAreaLabel>
            <Section>
              <H2Title
                title="Travel History"
                description="Check if you have any recent travel history"
              />
            </Section>
            <StyledComboInputContainer>
              <StyledCheckboxInput>
                <Checkbox
                  checked={travelHistory.withinCountry}
                />
                <StyledCheckboxLabel>Within Country</StyledCheckboxLabel>
              </StyledCheckboxInput>
              <StyledCheckboxInput>
                <Checkbox
                  checked={travelHistory.international}
                />
                <StyledCheckboxLabel>International</StyledCheckboxLabel>
              </StyledCheckboxInput>
            </StyledComboInputContainer>
          </StyledAreaLabel>

          <StyledAreaLabel>
            <Section>
              <H2Title
                title="Contact with COVID Positive Person"
                description="Check if you have been in contact with someone who tested positive for COVID-19"
              />
            </Section>
            <StyledCheckboxInput>
              <Checkbox
                checked={contactWithCovid}
              />
              <StyledCheckboxLabel>Yes, I have</StyledCheckboxLabel>
            </StyledCheckboxInput>
          </StyledAreaLabel>

          <StyledButton>
            <Button title="Submit" variant="primary" accent="blue" />
          </StyledButton>
        </StyledInputCard>
      </StyledCard>
    </>
  );
};