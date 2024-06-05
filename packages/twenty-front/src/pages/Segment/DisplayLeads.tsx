import { DateTimeDisplay } from '@/ui/field/display/components/DateTimeDisplay';
import { EllipsisDisplay } from '@/ui/field/display/components/EllipsisDisplay';
import { NumberDisplay } from '@/ui/field/display/components/NumberDisplay';
import {
  StyledCountContainer,
  StyledComboInputContainer,
  StyledLabelContainer,
  StyledTable,
  StyledTableRow,
  StyledTableHeaderCell,
  StyledTableCell,
} from '~/pages/Segment/SegmentStyles';
import { capitalize } from '~/utils/string/capitalize';

export type DisplayLeadsProps = {
  loading: boolean;
  data: string[];
  querystamp: string;
  leadData: any | any[];
  // setSegmentDescription:(value: string) => void;
  totalLeadsCount: number;
  cursor: string | null;
  filterLoading: boolean;
  lastLeadRef: React.LegacyRef<HTMLTableRowElement> | undefined;
};

export const DisplayLeads = ({
  loading,
  data,
  querystamp,
  leadData,
  totalLeadsCount,
  cursor,
  filterLoading,
  lastLeadRef,
}: DisplayLeadsProps) => {
  const fieldsToDisplay =
    leadData.length > 0
      ? Object.keys(leadData[0].node).filter(
          (field) => field !== '__typename' && field !== 'id',
        )
      : [];

  return (
    <>
      {!loading && data && (
        <>
          <StyledCountContainer>
            <StyledComboInputContainer>
              <StyledLabelContainer>
                <EllipsisDisplay>Leads fetched at:</EllipsisDisplay>
              </StyledLabelContainer>
              <DateTimeDisplay value={querystamp} />
            </StyledComboInputContainer>
            <StyledComboInputContainer>
              <StyledLabelContainer>
                <EllipsisDisplay>Total Leads:</EllipsisDisplay>
              </StyledLabelContainer>
              <NumberDisplay value={totalLeadsCount} />{' '}
            </StyledComboInputContainer>
          </StyledCountContainer>
          <StyledTable cursorPointer={true}>
            <thead>
              <StyledTableRow>
                {fieldsToDisplay.map((field) => (
                  <StyledTableHeaderCell key={field}>
                    {capitalize(field)}
                  </StyledTableHeaderCell>
                ))}
              </StyledTableRow>
            </thead>
            <tbody>
              {leadData.map((lead: any, index: number) => (
                <StyledTableRow
                  key={lead.node.id}
                  ref={index === leadData.length - 1 ? lastLeadRef : null}
                >
                  {fieldsToDisplay.map((field) => (
                    <StyledTableCell key={field}>
                      {lead.node[field]}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
              ))}
              {cursor && filterLoading && (
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
