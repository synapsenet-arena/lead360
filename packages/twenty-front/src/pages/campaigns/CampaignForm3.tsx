import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from '@emotion/styled';
import { Section } from '@react-email/components';
import {
  Button,
  Checkbox,
  CheckboxShape,
  CheckboxSize,
  CheckboxVariant,
  TextInput,
} from 'tsup.ui.index';

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
 margin-bottom: ${({ theme }) => theme.spacing(2)}
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
  height: 1005%;
  justify-content: space-between;
  width: 70%;
  align-items: center;
`;

const StyledCheckboxInput = styled.div`
  margin-top: ${({ theme }) => theme.spacing(4)};
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

export const CampaignForm3 = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');

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
  const [gender, setGender] = useState('');
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorType, setErrorType] = useState('');
  const { userid } = useParams<{ userid: string }>();
  console.log('USERID', userid);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/campaign?id=${userid}`,
        );
        if (!response.ok) {
          throw new Error('Failed to fetch user details');
        }
        const userData = await response.json();
        console.log('setting user details....');
        setFirstName(userData.name);
        setEmail(userData.email);
        setLoading(false);
      } catch (error: any) {
        console.error('error in fetching user details', error);
        if (error.message === 'Form expired') {
          setErrorType('formexpired');
        } else {
          setErrorType('othererror');
        }
      }
    };
    fetchUserDetails();
  }, [userid]);

  const handleConditionCheckboxChange = (
    condition: keyof PreexistingConditions,
  ) => {
    setPreexistingConditions({
      ...preexistingConditions,
      [condition]: !preexistingConditions[condition],
    });
  };

  const handleDiseaseCheckboxChange = (
    condition: keyof PreexistingDiseases,
  ) => {
    setPreexistingDiseases({
      ...preexistingDiseases,
      [condition]: !preexistingDiseases[condition],
    });
  };

  return (
    <>
      <StyledCard>
        <StyledTitleContainer>
          <StyledTitle>Medical Fitness Form</StyledTitle>
        </StyledTitleContainer>
        <StyledInputCard>
          <Section>
            <H2Title title="First Name" description="Enter your first name" />
            <TextInput
              placeholder={'Enter first name'}
              value={firstName}
              name="firstName"
              required
              fullWidth
              onChange={(e) => setFirstName(e)}
            />
          </Section>
          <Section>
            <H2Title title="Last Name" description="Enter your last name" />
            <TextInput
              placeholder={'Enter last name'}
              value={lastName}
              name="lastName"
              required
              fullWidth
              onChange={(e) => setLastName(e)}
            />
          </Section>
          <Section>
            <H2Title title="Email" description="Enter your email address" />
            <TextInput
              placeholder={'Enter email address'}
              value={email}
              name="email"
              required
              fullWidth
              onChange={(e) => setEmail(e)}
            />
          </Section>
          <Section>
            <H2Title
              title="Contact Number"
              description="Enter your contact number"
            />
            <TextInput
              placeholder={'Enter contact number'}
              value={contact}
              name="contact"
              required
              fullWidth
              onChange={(e) => setContact(e)}
            />
          </Section>

          <Section>
            <H2Title title="Gender" description="Select your Gender" />
            <StyledComboInputContainer>
              <Checkbox
                checked={false}
                indeterminate={false}
                variant={CheckboxVariant.Primary}
                size={CheckboxSize.Small}
                shape={CheckboxShape.Squared}
              />
              <StyledCheckboxLabel>Male</StyledCheckboxLabel>
              <Checkbox
                checked={false}
                indeterminate={false}
                variant={CheckboxVariant.Primary}
                size={CheckboxSize.Small}
                shape={CheckboxShape.Squared}
              />
              <StyledCheckboxLabel>Female</StyledCheckboxLabel>
              <Checkbox
                checked={false}
                indeterminate={false}
                variant={CheckboxVariant.Primary}
                size={CheckboxSize.Small}
                shape={CheckboxShape.Squared}
              />
              <StyledCheckboxLabel>Others</StyledCheckboxLabel>
            </StyledComboInputContainer>
          </Section>
          <StyledAreaLabel>
            <Section>
              <H2Title
                title="Height"
                description="Enter your height in centimeters"
              />
              <TextInput
                placeholder={'Enter height'}
                value={height}
                name="height"
                required
                fullWidth
                onChange={(e) => setHeight(e)}
              />
            </Section>
          </StyledAreaLabel>

          <StyledAreaLabel>
            <Section>
              <H2Title
                title="Weight"
                description="Enter your weight in kilograms"
              />
              <TextInput
                placeholder={'Enter weight'}
                value={weight}
                name="weight"
                required
                fullWidth
                onChange={(e) => setWeight(e)}
              />
            </Section>
          </StyledAreaLabel>

          <StyledAreaLabel>
            <Section>
              <H2Title
                title="Preexisting Conditions"
                description="Check any preexisting conditions"
              />
            </Section>
            <StyledCheckboxInput>
              <Checkbox
                checked={preexistingConditions.diabetes}
                onChange={() => handleConditionCheckboxChange('diabetes')}
              />
              <StyledCheckboxLabel>Diabetes</StyledCheckboxLabel>
            </StyledCheckboxInput>
            <StyledCheckboxInput>
              <Checkbox
                checked={preexistingConditions.asthma}
                onChange={() => handleConditionCheckboxChange('asthma')}
              />
              <StyledCheckboxLabel>Asthma</StyledCheckboxLabel>
            </StyledCheckboxInput>
            <StyledCheckboxInput>
              <Checkbox
                checked={preexistingConditions.seizures}
                onChange={() => handleConditionCheckboxChange('seizures')}
              />
              <StyledCheckboxLabel>Seizures</StyledCheckboxLabel>
            </StyledCheckboxInput>
            <StyledCheckboxInput>
              <Checkbox
                checked={preexistingConditions.seizures}
                onChange={() => handleConditionCheckboxChange('bloodpressure')}
              />
              <StyledCheckboxLabel>BloodPressure</StyledCheckboxLabel>
            </StyledCheckboxInput>
          </StyledAreaLabel>

          <StyledAreaLabel>
            <Section>
              <H2Title
                title="Preexisting Diseases"
                description="Check any preexisting diseases"
              />
            </Section>
            <StyledCheckboxInput>
              <Checkbox
                checked={preexistingDiseases.cardiovascular}
                onChange={() => handleDiseaseCheckboxChange('cardiovascular')}
              />
              <StyledCheckboxLabel>Cardiovascular</StyledCheckboxLabel>
            </StyledCheckboxInput>
            <StyledCheckboxInput>
              <Checkbox
                checked={preexistingDiseases.respiratory}
                onChange={() => handleDiseaseCheckboxChange('respiratory')}
              />
              <StyledCheckboxLabel>Respiratory</StyledCheckboxLabel>
            </StyledCheckboxInput>
            <StyledCheckboxInput>
              <Checkbox
                checked={preexistingDiseases.genitourinary}
                onChange={() => handleDiseaseCheckboxChange('genitourinary')}
              />
              <StyledCheckboxLabel>Genitourinary</StyledCheckboxLabel>
            </StyledCheckboxInput>
            <StyledCheckboxInput>
              <Checkbox
                checked={preexistingDiseases.cns}
                onChange={() => handleDiseaseCheckboxChange('cns')}
              />
              <StyledCheckboxLabel>
                CNS (Central Nervous System)
              </StyledCheckboxLabel>
            </StyledCheckboxInput>
            <StyledCheckboxInput>
              <Checkbox
                checked={preexistingDiseases.other}
                onChange={() => handleDiseaseCheckboxChange('other')}
              />
              <StyledCheckboxLabel>Other</StyledCheckboxLabel>
            </StyledCheckboxInput>
          </StyledAreaLabel>

          <StyledAreaLabel>
            <Section>
              <H2Title
                title="Consent*"
                description="Read the terms and conditions before agreeing."
              />
            </Section>
            <StyledComboInputContainer>
              <Checkbox
                checked={false}
                indeterminate={false}
                variant={CheckboxVariant.Primary}
                size={CheckboxSize.Small}
                shape={CheckboxShape.Squared}
              />
              <StyledCheckboxLabel>
                I agree to the terms and conditions.
              </StyledCheckboxLabel>
            </StyledComboInputContainer>
          </StyledAreaLabel>
          <StyledButton>
            <Button title="Submit" variant="primary" accent="blue" />
          </StyledButton>
        </StyledInputCard>
      </StyledCard>
    </>
  );
};
