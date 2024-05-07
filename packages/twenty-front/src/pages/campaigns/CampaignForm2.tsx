import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from '@emotion/styled';
import { Button } from '@/ui/input/button/components/Button';
import { H2Title } from '@/ui/display/typography/components/H2Title';
import { Checkbox } from '@/ui/input/components/Checkbox';
import { TextInput } from '@/ui/input/components/TextInput';
import { useIsMobile } from '@/ui/utilities/responsive/hooks/useIsMobile';

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
export const CampaignForm2 = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [bloodType, setBloodType] = useState('');

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
  const [loading, setLoading] = useState(true);
  const [errorType, setErrorType] = useState('');
  const { userid } = useParams<{ userid: string }>();
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

  const handleSymptomCheckboxChange = (symptom: string) => {
    setSymptoms({
      ...symptoms,
      [symptom]: !symptoms[symptom],
    });
  };

  const handleTravelHistoryCheckboxChange = (history: string) => {
    setTravelHistory({
      ...travelHistory,
      [history]: !travelHistory[history],
    });
  };

  return (
    <StyledDiv>
      <StyledInputCard>
        <StyledTitleContainer>
          <StyledTitle>Health Screening Form</StyledTitle>
        </StyledTitleContainer>
        <StyledInputCard>
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
            <H2Title title="Age" description="Enter your age" />
            <TextInput
              placeholder={'Enter age'}
              value={age}
              name="age"
              required
              fullWidth
              onChange={(e) => setAge(e)}
            />
          </StyledSection>
          </StyledAreaLabel>
          <StyledAreaLabel>
          <StyledSection>
            <H2Title title="Blood Type" description="Enter your blood type" />
            <TextInput
              placeholder={'Enter blood type'}
              value={bloodType}
              name="bloodType"
              required
              fullWidth
              onChange={(e) => setBloodType(e)}
            />
          </StyledSection>
          </StyledAreaLabel>
          <StyledAreaLabel>
            <StyledSection>
              <H2Title
                title="Symptoms"
                description="Check any symptoms you are experiencing"
              />
              <StyledComboInputContainer>
                  <Checkbox checked={symptoms.fever} />
                  <StyledCheckboxLabel>Fever</StyledCheckboxLabel>
                  <Checkbox checked={symptoms.cough} />
                  <StyledCheckboxLabel>Cough</StyledCheckboxLabel>
                  <Checkbox checked={symptoms.fatigue} />
                  <StyledCheckboxLabel>Fatigue</StyledCheckboxLabel>
                  <Checkbox checked={symptoms.headache} />
                  <StyledCheckboxLabel>Headache</StyledCheckboxLabel>
              </StyledComboInputContainer>
            </StyledSection>
          </StyledAreaLabel>
          <StyledAreaLabel>
          <StyledSection>
            <H2Title
              title="Travel History"
              description="Check if you have any recent travel history"
            />
          <StyledComboInputContainer>
              <Checkbox checked={travelHistory.withinCountry} />
              <StyledCheckboxLabel>Within Country</StyledCheckboxLabel>
              <Checkbox checked={travelHistory.international} />
              <StyledCheckboxLabel>International</StyledCheckboxLabel>
          </StyledComboInputContainer>
          </StyledSection>
          </StyledAreaLabel>

          <StyledAreaLabel>
            <StyledSection>
              <H2Title
                title="Contact with COVID Positive Person"
                description="Check if you have been in contact with someone who tested positive for COVID-19"
              />
            <StyledCheckboxInput>
              <Checkbox
                checked={contactWithCovid}
                onChange={() => setContactWithCovid(!contactWithCovid)}
              />
              <StyledCheckboxLabel>Yes, I have</StyledCheckboxLabel>
            </StyledCheckboxInput>

            </StyledSection>
          </StyledAreaLabel>

          <StyledButton>
            <Button title="Submit" variant="primary" accent="blue" />
          </StyledButton>
        </StyledInputCard>
      </StyledInputCard>
    </StyledDiv>
  );
};