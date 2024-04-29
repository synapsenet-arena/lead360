import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { ActivityTargetableObject } from '@/activities/types/ActivityTargetableEntity';
import { GET_CAMPAIGN_LISTS } from '@/users/graphql/queries/getCampaignList';
import { useLazyQuery } from '@apollo/client';
import { FILTER_LEADS } from '@/users/graphql/queries/filterLeads';
import { Checkbox } from '@/ui/input/components/Checkbox';
import { capitalize } from '~/utils/string/capitalize';
import { useCampaign } from '~/pages/campaigns/CampaignUseContext';

const StyledInputCard = styled.div`
  align-items: flex-start;
  color: ${({ theme }) => theme.font.color.secondary};
  display: flex;
  flex-direction: column;
  height: auto%;
  justify-content: space-evenly;
  width: 100%;
`;

const StyledCountContainer = styled.div`
  display: flex;
  flex-direction: row;
  > * + * {
    margin-left: ${({ theme }) => theme.spacing(10)};
  }
  margin-top: ${({ theme }) => theme.spacing(10)};
  height: auto;
  justify-content: flex-start;
  width: 100%;
  align-items: center;
`;

const StyledTitleText = styled.span`
  color: ${({ theme }) => theme.font.color.secondary};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  min-width: 150px;
  margin-right: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  height: 10px;
  margin-bottom: ${({ theme }) => theme.spacing(6)};
`;

const StyledTableRow = styled.tr`
  &:nth-of-type(odd) {
    background-color: ${({ theme }) => theme.background.primary};
  }
  &:nth-of-type(even) {
    background-color: ${({ theme }) => theme.background.transparent.blue};
  }
`;

const StyledTableCell = styled.td`
  padding: 5px;
  // border: 1px solid ${({ theme }) => theme.border.color.medium};
  font-size: ${({ theme }) => theme.font.size.md};
  height: 25px;
`;

const StyledTableHeaderCell = styled.td`
  padding: 5px;
  border: 1px solid ${({ theme }) => theme.border.color.medium};
  font-size: ${({ theme }) => theme.font.size.md};
  height: 25px;
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
`;

const StyledComboInputContainer = styled.div`
  display: flex;
  justify-content: stretch;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing(4)};
  margin-bottom: ${({ theme }) => theme.spacing(10)};
  margin-right: ${({ theme }) => theme.spacing(10)};
`;

const StyledContainer = styled.div`
  align-items: flex-start;
  align-self: stretch;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 8px 24px;
`;

export const Leads = ({
  targetableObject,
}: {
  targetableObject: ActivityTargetableObject;
}) => {
  const fields = [
    'name',
    'age',
    'location',
    'advertisementSource',
    'advertisementName',
    'campaignName',
    'comments',
    'createdAt',
  ];

  const [leadsData, setLeadsData] = useState<any | any[]>([]);
  const [totalLeadsCount, setTotalLeadsCount] = useState<number>(0);
  const [selectedRows, setSelectedRows] = useState<{ [key: string]: boolean }>(
    {},
  );
  const [unSelectedRows, setunSelectedRows] = useState<{
    [key: string]: boolean;
  }>({});
  const [masterCheckboxChecked, setMasterCheckboxChecked] = useState(true);

  const { campaignData, setCampaignData } = useCampaign();

  let [selectedCampaign, { data: selectedCampaignData }] =
    useLazyQuery(GET_CAMPAIGN_LISTS);
  let [filterleads, { data: filterLeadsData }] = useLazyQuery(FILTER_LEADS, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      setLeadsData(data);
    },
  });

  useEffect(() => {
    if (leadsData.leads && leadsData.leads.edges) {
      const allLeadIds = leadsData.leads.edges.map((leadEdge: any) => leadEdge.node.id);
      const initialSelectedRows: { [key: string]: boolean } = {};
      const initialUnSelectedRows: { [key: string]: boolean } = {};
      allLeadIds.forEach((leadId: string) => {
        initialSelectedRows[leadId] = true;
      });
      setSelectedRows(initialSelectedRows);
      setunSelectedRows(initialUnSelectedRows);
    }
  }, [leadsData]);
  

  const handleCheckboxChange = (leadId: string) => {
    const updatedSelectedRows = { ...selectedRows };
    updatedSelectedRows[leadId] = !updatedSelectedRows[leadId];
  
    const updatedUnSelectedRows = { ...unSelectedRows };
    if (!updatedSelectedRows[leadId]) {
      updatedUnSelectedRows[leadId] = true;
    } else {
      delete updatedUnSelectedRows[leadId];
    }
  
    const selectedLeadIds = Object.keys(updatedSelectedRows).filter(
      (leadId) => updatedSelectedRows[leadId]
    );
    const unSelectedLeadIds = Object.keys(updatedUnSelectedRows);
  
    setCampaignData({
      ...campaignData,
      selectedId: selectedLeadIds,
      unSelectedId: unSelectedLeadIds,
    });
  
    setSelectedRows(updatedSelectedRows);
    setunSelectedRows(updatedUnSelectedRows);
  };
  
  const handleMasterCheckboxChange = () => {
    const updatedSelectedRows: { [key: string]: boolean } = {};
    const updatedUnSelectedRows: { [key: string]: boolean } = {};
    if (!masterCheckboxChecked) {
      leadsData?.leads?.edges.forEach((leadEdge: any) => {
        const lead = leadEdge?.node;
        updatedSelectedRows[lead.id] = true;
      });
    } else {
      leadsData?.leads?.edges.forEach((leadEdge: any) => {
        const lead = leadEdge?.node;
        updatedUnSelectedRows[lead.id] = true;
      });
    }
  
    const selectedLeadIds = Object.keys(updatedSelectedRows);
    const unSelectedLeadIds = Object.keys(updatedUnSelectedRows);
  
    setCampaignData({
      ...campaignData,
      selectedId: selectedLeadIds,
      unSelectedId: unSelectedLeadIds,
    });
  
    setSelectedRows(updatedSelectedRows);
    setunSelectedRows(updatedUnSelectedRows);
    setMasterCheckboxChecked(!masterCheckboxChecked);
  };
  

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const data = await selectedCampaign({
          variables: {
            filter: {
              id: { eq: targetableObject.id },
            },
          },
        });
        const filter = JSON.parse(
          data.data.campaigns.edges[0].node.segment.filters,
        );
        const response = await filterleads({ variables: filter });
        const leadsCount = response.data?.leads?.totalCount || 0;
        setTotalLeadsCount(leadsCount);
        setCampaignData({
          ...campaignData,
          querystamp: new Date()
        });
      
      } catch (error) {
        console.error('Error fetching campaign segment filter:', error);
      }
    };

    fetchLeads();
  }, [targetableObject.id, selectedCampaign]);

  return (
    <StyledContainer>
      <StyledInputCard>
        {leadsData?.leads?.edges[0] && (
          <>
            <StyledCountContainer>
              <StyledTitleText>
                Leads fetched at: {campaignData?.querystamp.toLocaleString()}
              </StyledTitleText>
              <StyledTitleText>Total Leads: {totalLeadsCount}</StyledTitleText>
              <StyledTitleText>
                Selected Leads: {Object.keys(selectedRows).length}
              </StyledTitleText>
              <StyledTitleText>
                Unselected Leads: {Object.keys(unSelectedRows).length}
              </StyledTitleText>
            </StyledCountContainer>
            <StyledTable>
              <tbody>
                <StyledTableRow>
                  <StyledTableHeaderCell>
                    <StyledComboInputContainer>
                      <Checkbox
                        checked={masterCheckboxChecked}
                        onChange={handleMasterCheckboxChange}
                      />
                      Select
                    </StyledComboInputContainer>
                  </StyledTableHeaderCell>
                  {fields.map((field: string) => (
                    <StyledTableHeaderCell key={field}>
                      {capitalize(field)}
                    </StyledTableHeaderCell>
                  ))}
                </StyledTableRow>
                {leadsData?.leads?.edges.map((leadEdge: any) => {
                  const lead = leadEdge?.node;
                  return (
                    <StyledTableRow
                      key={lead.id}
                      onClick={() => handleCheckboxChange(lead.id)}
                    >
                      <StyledTableCell>
                        <Checkbox
                          checked={selectedRows[lead.id]}
                          onChange={() => handleCheckboxChange(lead.id)}
                        />
                      </StyledTableCell>
                      {fields.map((field: string) => (
                        <StyledTableCell key={field}>
                          {lead[field]}
                        </StyledTableCell>
                      ))}
                    </StyledTableRow>
                  );
                })}
              </tbody>
            </StyledTable>
          </>
        )}
      </StyledInputCard>
    </StyledContainer>
  );
};
