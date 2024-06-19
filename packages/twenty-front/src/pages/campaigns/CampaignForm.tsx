import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Button } from '@/ui/input/button/components/Button';
import { useNavigate, useParams } from 'react-router-dom';
import AnimatedPlaceholder from '@/ui/layout/animated-placeholder/components/AnimatedPlaceholder';
import {
  AnimatedPlaceholderErrorContainer,
  AnimatedPlaceholderErrorTitle,
} from '@/ui/layout/animated-placeholder/components/ErrorPlaceholderStyled';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import axios from 'axios';
import { AppPath } from '@/types/AppPath';
import { Checkbox, CheckboxVariant, CheckboxSize, CheckboxShape } from '@/ui/input/components/Checkbox';
import { Select } from '@/ui/input/components/Select';
import { TextArea } from '@/ui/input/components/TextArea';
import { TextInput } from '@/ui/input/components/TextInput';
import { AnimatedPlaceholderEmptyTextContainer } from '@/ui/layout/animated-placeholder/components/EmptyPlaceholderStyled';
import { useIsMobile } from '@/ui/utilities/responsive/hooks/useIsMobile';
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

const StyledSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing(6)};
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
  margin-bottom: ${({ theme }) => theme.spacing(6)};
  margin-top: ${({ theme }) => theme.spacing(6)};
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

  // const generateRandomId = (username: string, formId: string, campaignname: string) => {
  //   const randomId = `${username}-${formId}-${campaignname}`;
  //   const encodedRandomId = base64.fromByteArray(new TextEncoder().encode(randomId));
  //   return encodedRandomId;
  // }

  // const username = "Ertha Creboe";
  // const formname = "abc";
  // const campaignname = "Healthy Lives";

  // const randomId = generateRandomId(username, formname, campaignname);
  // console.log("Encoded Random ID:", randomId);

export const CampaignForm = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorType, setErrorType] = useState('');
  const [location, setLocation] = useState('');
  const [apptDate, setAptDate] = useState(null);
  const [apptType, setApptType] = useState('');
  const { userid } = useParams<{ userid: string }>();
  const { enqueueSnackBar } = useSnackBar();
  const navigate = useNavigate();
  const createOptions = (options: any[]) =>
    options.map((option: any) => ({ label: option, value: option }));
  const locationOptions = createOptions([
    'Yelhanka',
    'Rajajinagar',
    'Nagawara',
  ]);
  const apptTypeOptions = createOptions(['Initial Consultation', 'Follow-up']);


  const handleSubmit = async () => {
    const formData = {
      email,
      firstName,
      lastName,
      appointmentDate: apptDate, 
      phoneNumber: contact,
      appointmentLocation: location,
      appointmentReason: comments,
      consent: 'I agree', 
      appointmentType: apptType,
    };

    try{
      const response = await axios.post(`http://localhost:3000/campaign/save/${userid}`, formData);
      enqueueSnackBar('Form Submitted Successfully!',{
        variant: SnackBarVariant.Success,
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
    //div id - save id in form
    <StyledDiv>
    <StyledInputCard>
        <StyledTitleContainer>
          <StyledTitle>Appointment Scheduling Form</StyledTitle>
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
              <H2Title
                title="Reason for Appointment"
                description="State the reason for your appointment"
              />
               <TextArea
              value={comments}
              placeholder={'State the reason for the apppointment'}
              minRows={5}
              onChange={(e) => setComments(e)}
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
                value={apptType}
                onChange={(e) => setApptType(e)}
                options={apptTypeOptions}
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
                value={location}
                onChange={(e) => setLocation(e)}
                options={locationOptions}
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
            <Button title="Submit" variant="primary" accent="blue"  onClick={handleSubmit}/>
          </StyledButton>
        </StyledInputCard>
        </StyledDiv>
  );
};
