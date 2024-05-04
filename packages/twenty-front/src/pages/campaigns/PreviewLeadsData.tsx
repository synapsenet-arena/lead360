import { EllipsisDisplay } from '@/ui/field/display/components/EllipsisDisplay';
import styled from '@emotion/styled';
import { capitalize } from '~/utils/string/capitalize';

const StyledTable = styled.table<{ cursorPointer: boolean }>`
  width: 100%;
  border-collapse: collapse;
  height: 10px;
  margin-bottom: ${({ theme }) => theme.spacing(6)};
  background-color: ${({ theme }) => theme.background.primary};
  cursor: ${({ cursorPointer }) => (cursorPointer ? 'pointer' : 'inherit')};
  font-family: inherit;
  font-size: inherit;

  font-weight: ${({ theme }) => theme.font.weight.regular};
  max-width: 100%;
  overflow: hidden;
  text-decoration: inherit;

  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StyledTableRow = styled.tr`
  &:nth-of-type(odd) {
    background-color: ${({ theme }) => theme.background.primary};
  }
`;

const StyledTableCell = styled.td`
  padding: 5px;
  height: 25px;
  border: 1px solid ${({ theme }) => theme.border.color.light};
  font-weight: ${({ theme }) => theme.font.weight.regular};
  &:hover {
    background-color: ${({ theme }) => theme.background.tertiary};
  }
`;

const StyledTableHeaderCell = styled.td`
  padding: 5px;
  border: 1px solid ${({ theme }) => theme.border.color.medium};
  height: 25px;
`;
const StyledLabelContainer = styled.div`
  color: ${({ theme }) => theme.font.color.tertiary};
  width: auto;
`;

export const PreviewLeadsData = ({ data }) => {
  return (
    <StyledTable cursorPointer={true}>
      <tbody>
        <StyledTableRow>
          <StyledTableHeaderCell>
            <StyledLabelContainer>Name</StyledLabelContainer>
          </StyledTableHeaderCell>
          <StyledTableHeaderCell>
            <StyledLabelContainer>Age</StyledLabelContainer>
          </StyledTableHeaderCell>
          <StyledTableHeaderCell>
            <StyledLabelContainer>Location</StyledLabelContainer>
          </StyledTableHeaderCell>
          <StyledTableHeaderCell>
          <StyledLabelContainer>Campaign Name</StyledLabelContainer>
          </StyledTableHeaderCell>
          <StyledTableHeaderCell>
            <StyledLabelContainer>Advertisement Source</StyledLabelContainer>
          </StyledTableHeaderCell>
          <StyledTableHeaderCell>
            <StyledLabelContainer>Phone Number</StyledLabelContainer>
          </StyledTableHeaderCell>
          <StyledTableHeaderCell>
            <StyledLabelContainer>Comments</StyledLabelContainer>
          </StyledTableHeaderCell>
          <StyledTableHeaderCell>
            <StyledLabelContainer>Advertisement Name</StyledLabelContainer>
          </StyledTableHeaderCell>
        </StyledTableRow>
        {data.map((leads: any) => (
          <StyledTableRow key={leads.node.id}>
            <StyledTableCell>
              <EllipsisDisplay>{leads.node?.name}</EllipsisDisplay>
            </StyledTableCell>
            <StyledTableCell>
              <EllipsisDisplay>{leads.node?.age}</EllipsisDisplay>
            </StyledTableCell>
            <StyledTableCell>
              <EllipsisDisplay>{leads.node?.location}</EllipsisDisplay>
            </StyledTableCell>
            <StyledTableCell>
              <EllipsisDisplay>{leads.node?.campaignName}</EllipsisDisplay>
            </StyledTableCell>
            <StyledTableCell>
              <EllipsisDisplay>{leads.node?.advertisementSource}</EllipsisDisplay>
            </StyledTableCell>
            <StyledTableCell>
              <EllipsisDisplay>{leads.node?.phoneNumber}</EllipsisDisplay>
            </StyledTableCell>
            <StyledTableCell>
              <EllipsisDisplay>{leads.node?.comments}</EllipsisDisplay>
            </StyledTableCell>
            <StyledTableCell>
              <EllipsisDisplay>{leads.node?.advertisementName}</EllipsisDisplay>
            </StyledTableCell>
          </StyledTableRow>
        ))}
      </tbody>
    </StyledTable>
  );
};
