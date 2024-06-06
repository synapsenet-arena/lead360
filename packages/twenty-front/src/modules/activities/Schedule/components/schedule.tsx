import { useState } from 'react';
import styled from '@emotion/styled';
import { ActivityTargetableObject } from '@/activities/types/ActivityTargetableEntity';
import { useCampaign } from '~/pages/campaigns/CampaignUseContext';
import {
  Checkbox,
  CheckboxShape,
  CheckboxSize,
  CheckboxVariant,
} from '@/ui/input/components/Checkbox';
import DateTimePicker from '@/ui/input/components/internal/date/components/DateTimePicker';
import { IconCalendar } from '@tabler/icons-react';

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

const StyledTaskRows = styled.div`
  background-color: ${({ theme }) => theme.background.secondary};
  border: 1px solid ${({ theme }) => theme.border.color.light};
  border-radius: ${({ theme }) => theme.border.radius.md};
  width: 100%;
`;

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

const StyledCount = styled.span`
  color: ${({ theme }) => theme.font.color.light};
  margin-left: ${({ theme }) => theme.spacing(2)};
`;

export const Schedule = ({
  targetableObject,
}: {
  targetableObject: ActivityTargetableObject;
}) => {
  const [showStartDateTimePicker, setShowStartDateTimePicker] = useState(false);
  const [showStopDateTimePicker, setShowStopDateTimePicker] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [stopDate, setStopDate] = useState<Date | null>(null);
  const { campaignData, setCampaignData } =  useCampaign();

  const handleStartCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const currentDate = new Date(); 
    setStartDate(currentDate);
    setCampaignData({
      ...campaignData,
      startDate: currentDate,
    });
  };

  const handleStopCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const currentDate = new Date(); 
    setStopDate(currentDate);
    setCampaignData({
      ...campaignData,
      endDate: currentDate,
    });
  };
    return (
      <StyledContainer>
        <StyledTitleBar>
          {/* <StyledTitle>
            This Campaign was run<StyledCount>4</StyledCount> times.
          </StyledTitle> */}
        </StyledTitleBar>

        <StyledScheduleTitle>Start</StyledScheduleTitle>
        <StyledTaskRows>
          <StyledComboInputContainer>
            <StyledLabel>
              <Checkbox
                checked={false}
                indeterminate={false}
                variant={CheckboxVariant.Primary}
                size={CheckboxSize.Small}
                shape={CheckboxShape.Squared}
                onChange={handleStartCheckboxChange}
              />
              <StyledCheckboxLabel>Immediately</StyledCheckboxLabel>
            </StyledLabel>
            <Checkbox
              checked={showStartDateTimePicker}
              onChange={() =>
                setShowStartDateTimePicker(!showStartDateTimePicker)
              }
              indeterminate={false}
              variant={CheckboxVariant.Primary}
              size={CheckboxSize.Small}
              shape={CheckboxShape.Squared}
            />
            <StyledLabel>
              Start Date/Time <IconCalendar />
            </StyledLabel>
            {showStartDateTimePicker && (
              <DateTimePicker
              onChange={(selectedDate) =>
                setCampaignData({
                  ...campaignData,
                  startDate: selectedDate,
                })
              }
                minDate={new Date()}
                /* value={campaignData?.startDate} */
              />
            )}
          </StyledComboInputContainer>
          </StyledTaskRows>

          <StyledScheduleTitle>Stop</StyledScheduleTitle>
          <StyledTaskRows>
          <StyledComboInputContainer>
          <StyledLabel>
              <Checkbox
                checked={false}
                indeterminate={false}
                variant={CheckboxVariant.Primary}
                size={CheckboxSize.Small}
                shape={CheckboxShape.Squared}
                onChange={handleStopCheckboxChange}
              />
              <StyledCheckboxLabel>Immediately</StyledCheckboxLabel>
            </StyledLabel>
              <Checkbox
                checked={showStopDateTimePicker}
                onChange={() =>
                  setShowStopDateTimePicker(!showStopDateTimePicker)
                }
                indeterminate={false}
                variant={CheckboxVariant.Primary}
                size={CheckboxSize.Small}
                shape={CheckboxShape.Squared}
              />
              <StyledLabel>
                Stop Date/Time <IconCalendar />
              </StyledLabel>
            {showStopDateTimePicker && (
              <DateTimePicker
              onChange={(selectedDate) =>
                setCampaignData({
                  ...campaignData,
                  endDate: selectedDate,
                })
              }
                minDate={new Date()}
              />
            )}
          </StyledComboInputContainer>
        </StyledTaskRows>
      </StyledContainer>
    );
};
