import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from '@emotion/styled';
import { Section } from '@react-email/components';
import { Button } from '@/ui/input/button/components/Button';

import { Checkbox, CheckboxVariant, CheckboxSize, CheckboxShape } from '@/ui/input/components/Checkbox';
import { TextInput } from '@/ui/input/components/TextInput';
import { useIsMobile } from '@/ui/utilities/responsive/hooks/useIsMobile';
import { AppPath } from '@/types/AppPath';
import AnimatedPlaceholder from '@/ui/layout/animated-placeholder/components/AnimatedPlaceholder';
import { AnimatedPlaceholderEmptyTextContainer } from '@/ui/layout/animated-placeholder/components/EmptyPlaceholderStyled';
import { AnimatedPlaceholderErrorContainer, AnimatedPlaceholderErrorTitle } from '@/ui/layout/animated-placeholder/components/ErrorPlaceholderStyled';
import axios from 'axios';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { SnackBarVariant } from '@/ui/feedback/snack-bar-manager/components/SnackBar';
import { H2Title } from 'twenty-ui';


const StyledDiv = styled.div`
display: flex;
flex: 1 0 0;
flex-direction: column;
justify-content: start;
align-items: center;
overflow: ${() => (useIsMobile() ? 'none' : 'hidden')};
width: calc(100% + 4px);
overflow-y: scroll;
scrollbar-color: ${({ theme }) => theme.border.color.strong};
scrollbar-width: thin;

 *::-webkit-scrollbar {
  height: 8px;
  width: 8px; 
}

*::-webkit-scrollbar-corner {
  background-color: transparent;
}

*::-webkit-scrollbar-thumb {
  background-color: ${({ theme }) => theme.border.color.strong}; 
  border-radius: ${({ theme }) => theme.border.radius.sm};
}
`;

const StyledInputCard = styled.div`
  color: ${({ theme }) => theme.font.color.secondary};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width:70%;
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

const StyledCheckboxInput = styled.div`
  margin-top: ${({ theme }) => theme.spacing(4)};
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

const StyledSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing(6)};
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
  const navigate = useNavigate();
  const { enqueueSnackBar } = useSnackBar();

  console.log('USERID', userid);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/campaign/${userid}`,
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
  const handleSubmit = async () => {
    const formData = {
      email,
      firstName,
      lastName,
      phoneNumber: contact,
      weight: weight,
      gender: gender,
      height:height,
      consent: 'I agree'

    };

    try{
      const response = await axios.post(`http://localhost:3000/campaign/save/${userid}`, formData);
      enqueueSnackBar('Form Submitted Successfully!',{
        variant: SnackBarVariant.Success
      });
      if(response.data){
        navigate(AppPath.SignInUp)
      }
    }
    catch(error){
      console.log("error in saving form data:", error)
    }
  }
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/campaign/${userid}`, 
        );
        const userData = await response.json();
        if(userData.error==='Campaign Not Found'){
          setErrorType('formexpired');  
          throw new Error('Failed to fetch user details');
        }
        setFirstName(userData?.name);
        setEmail(userData?.email);
        setLoading(false);
        
      } catch (error: any) {
        console.error('error in fetching user details', error);
       
      }
    };
    fetchUserDetails();
  }, [userid]);

      if (loading && errorType === 'formexpired') {
    return (
      <>
        <AnimatedPlaceholderErrorContainer>
          <AnimatedPlaceholder type="error404" />
          <AnimatedPlaceholderEmptyTextContainer>
            <AnimatedPlaceholderErrorTitle>
              Oops! We are not taking responses anymore.
            </AnimatedPlaceholderErrorTitle>
          </AnimatedPlaceholderEmptyTextContainer>
        </AnimatedPlaceholderErrorContainer>
      </>
    );
  }else if (loading) {
    return (
      <>
        <AnimatedPlaceholderErrorContainer>
          <AnimatedPlaceholderEmptyTextContainer>
            <AnimatedPlaceholderErrorTitle>
              Collecting form data...
            </AnimatedPlaceholderErrorTitle>
          </AnimatedPlaceholderEmptyTextContainer>
        </AnimatedPlaceholderErrorContainer>
      </>
    );
  }

  return (
    <StyledDiv>
      <StyledInputCard>
        <StyledTitleContainer>
          <StyledTitle>Medical Fitness Form</StyledTitle>
        </StyledTitleContainer>
        <StyledAreaLabel>
          <StyledSection>
            <H2Title title="First Name" description="Enter your first name" />
            <TextInput
              placeholder={'Enter first name'}
              value={firstName}
              name="firstName"
              required
              fullWidth
              onChange={(e) => setFirstName(e)}
            />
          </StyledSection>
          </StyledAreaLabel>
          <StyledAreaLabel>
          <StyledSection>
            <H2Title title="Last Name" description="Enter your last name" />
            <TextInput
              placeholder={'Enter last name'}
              value={lastName}
              name="lastName"
              required
              fullWidth
              onChange={(e) => setLastName(e)}
            />
          </StyledSection>
          </StyledAreaLabel>
          <StyledAreaLabel>
          <StyledSection>
            <H2Title title="Email" description="Enter your email address" />
            <TextInput
              placeholder={'Enter email address'}
              value={email}
              name="email"
              required
              fullWidth
              onChange={(e) => setEmail(e)}
            />
          </StyledSection>
          </StyledAreaLabel>
          <StyledAreaLabel>
          <StyledSection>
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
          </StyledSection>
          </StyledAreaLabel>
          <StyledAreaLabel>
          <StyledSection>
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
          </StyledSection>
          </StyledAreaLabel>
          <StyledAreaLabel>
            <StyledSection>
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
            </StyledSection>
          </StyledAreaLabel>

          <StyledAreaLabel>
            <StyledSection>
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
            </StyledSection>
          </StyledAreaLabel>

          <StyledAreaLabel>
              <StyledSection>
                <H2Title
                  title="Preexisting Conditions"
                  description="Check any preexisting conditions"
                />
                <StyledComboInputContainer>
                  <Checkbox checked={preexistingConditions.diabetes} />
                  <StyledCheckboxLabel>Diabetes</StyledCheckboxLabel>
                  <Checkbox checked={preexistingConditions.asthma} />
                  <StyledCheckboxLabel>Asthma</StyledCheckboxLabel>
                  <Checkbox checked={preexistingConditions.seizures} />
                  <StyledCheckboxLabel>Seizures</StyledCheckboxLabel>
                  <Checkbox checked={preexistingConditions.seizures} />
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
                  <Checkbox checked={preexistingDiseases.cardiovascular} />
                  <StyledCheckboxLabel>Hypertension</StyledCheckboxLabel>

                  <Checkbox checked={preexistingDiseases.respiratory} />
                  <StyledCheckboxLabel>Arthritis</StyledCheckboxLabel>

                  <Checkbox checked={preexistingDiseases.genitourinary} />
                  <StyledCheckboxLabel>Genitourinary</StyledCheckboxLabel>

                  <Checkbox checked={preexistingDiseases.cns} />
                  <StyledCheckboxLabel>Diabetes</StyledCheckboxLabel>
                  <Checkbox checked={preexistingDiseases.other} />
                  <StyledCheckboxLabel>Other</StyledCheckboxLabel>
                </StyledComboInputContainer>
              </StyledSection>
            </StyledAreaLabel>
            <StyledAreaLabel>
            <StyledSection>
              <H2Title
                title="Consent*"
                description="Read the terms and conditions before agreeing."
              />
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
            </StyledSection>
          </StyledAreaLabel>
          <StyledButton>
            <Button title="Submit" variant="primary" accent="blue" onClick={handleSubmit} />
          </StyledButton>
      </StyledInputCard>
    </StyledDiv>
  );
};
