import { DateTimeDisplay } from '@/ui/field/display/components/DateTimeDisplay';
import { EllipsisDisplay } from '@/ui/field/display/components/EllipsisDisplay';
import { NumberDisplay } from '@/ui/field/display/components/NumberDisplay';
import { Checkbox } from '@/ui/input/components/Checkbox';
import styled from '@emotion/styled';
import {
  StyledCountContainer,
  StyledComboInputContainer,
  StyledLabelContainer,
  StyledTable,
  StyledTableRow,
  StyledTableHeaderCell,
  StyledTableCell,
  StyledCheckLabelContainer,
} from '~/pages/Segment/SegmentStyles';
import { capitalize } from '~/utils/string/capitalize';
import {
  leadsDataState,
  totalLeadsCountState,
  selectedIDState,
  unselectedIDState,
  checkboxState,
  isCheckedState,
  cursorState,
  loadingState,
} from '@/activities/Leads/components/LeadAtoms';
import { useRecoilState } from 'recoil';
import { PageTitle } from '@/ui/utilities/page-title/PageTitle';
import AnimatedPlaceholder from '@/ui/layout/animated-placeholder/components/AnimatedPlaceholder';
import { AnimatedPlaceholderEmptyTextContainer } from '@/ui/layout/animated-placeholder/components/EmptyPlaceholderStyled';
import {
  AnimatedPlaceholderErrorContainer,
  AnimatedPlaceholderErrorTitle,
} from '@/ui/layout/animated-placeholder/components/ErrorPlaceholderStyled';

const StyledBackDrop = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 70vh; 
`;
export type DisplayLeadsProps = {
  lastLeadRef: React.LegacyRef<HTMLTableRowElement> | undefined;
  handleRemoveContactedLeads: () => void;
  handleMasterCheckboxChange: (event: any) => void;
  handleCheckboxChange: (event: any, lead: string) => void;
  date: Date;
};

export const DisplayLeads = ({
  lastLeadRef,
  date,
  handleRemoveContactedLeads,
  handleMasterCheckboxChange,
  handleCheckboxChange,
}: DisplayLeadsProps) => {
  const [leadsData, setLeadsData] = useRecoilState(leadsDataState);
  const [totalLeadsCount, setTotalLeadsCount] =
    useRecoilState(totalLeadsCountState);
  const [selectedID, setSelectedID] = useRecoilState(selectedIDState);
  const [unselectedID, setUnselectedID] = useRecoilState(unselectedIDState);
  const [checkbox, setCheckbox] = useRecoilState(checkboxState);
  const [isChecked, setIsChecked] = useRecoilState(isCheckedState);
  const [cursor, setCursor] = useRecoilState(cursorState);
  const [loading, setLoading] = useRecoilState(loadingState);

  const fieldsToDisplay =
    leadsData.length > 0
      ? Object.keys(leadsData[0].node).filter(
          (field) => field !== '__typename' && field !== 'id',
        )
      : [];

  return (
    <>
      {leadsData.length === 0 ? (
        <>
          <StyledBackDrop>
            <PageTitle title="No leads available" />
            <AnimatedPlaceholderErrorContainer>
              <AnimatedPlaceholder type="error404" />
              <AnimatedPlaceholderEmptyTextContainer>
                <AnimatedPlaceholderErrorTitle>
                  No leads available
                </AnimatedPlaceholderErrorTitle>
              </AnimatedPlaceholderEmptyTextContainer>
            </AnimatedPlaceholderErrorContainer>
          </StyledBackDrop>
        </>
      ) : (
        <>
          <StyledCountContainer>
            <StyledComboInputContainer>
              <StyledLabelContainer>
                <EllipsisDisplay>Leads fetched at:</EllipsisDisplay>
              </StyledLabelContainer>
              <DateTimeDisplay value={date.toISOString()} />
            </StyledComboInputContainer>
            <StyledComboInputContainer>
              <StyledLabelContainer>
                <EllipsisDisplay>Total Leads:</EllipsisDisplay>
              </StyledLabelContainer>
              <NumberDisplay value={totalLeadsCount} />
            </StyledComboInputContainer>

            <StyledComboInputContainer>
              <StyledLabelContainer>
                <EllipsisDisplay>Selected Leads:</EllipsisDisplay>
              </StyledLabelContainer>
              <NumberDisplay value={selectedID.size} />
            </StyledComboInputContainer>

            <StyledComboInputContainer>
              <StyledLabelContainer>
                <EllipsisDisplay>Unselected Leads:</EllipsisDisplay>
              </StyledLabelContainer>
              <NumberDisplay value={unselectedID.size} />
            </StyledComboInputContainer>
            <StyledCheckLabelContainer>
              <Checkbox
                checked={false}
                onChange={() => handleRemoveContactedLeads()}
              />
              Remove leads that were contacted previously
            </StyledCheckLabelContainer>
          </StyledCountContainer>

          <StyledTable cursorPointer={true}>
            <tbody>
              <StyledTableRow>
                <StyledTableHeaderCell>
                  <Checkbox
                    checked={unselectedID.size === 0}
                    onChange={(event) => handleMasterCheckboxChange(event)}
                  />
                </StyledTableHeaderCell>

                {fieldsToDisplay.map((name) => (
                  <StyledTableHeaderCell key={name}>
                    <StyledLabelContainer>
                      {capitalize(name)}
                    </StyledLabelContainer>
                  </StyledTableHeaderCell>
                ))}
              </StyledTableRow>
              {leadsData.map((leadEdge: any) => {
                const lead = leadEdge?.node;
                return (
                  <StyledTableRow key={lead.id}>
                    <StyledTableCell>
                      <Checkbox
                        checked={checkbox[lead.id]}
                        onChange={(event) =>
                          handleCheckboxChange(event, lead.id)
                        }
                      />
                    </StyledTableCell>
                    {fieldsToDisplay.map((name) => (
                      <StyledTableCell key={name}>
                        <EllipsisDisplay>{lead[name]}</EllipsisDisplay>
                      </StyledTableCell>
                    ))}
                  </StyledTableRow>
                );
              })}
              {cursor && loading && (
                <StyledTableRow ref={lastLeadRef}>
                  <td>Loading more...</td>
                </StyledTableRow>
              )}
            </tbody>
          </StyledTable>
        </>
      )}
    </>
  );
};
