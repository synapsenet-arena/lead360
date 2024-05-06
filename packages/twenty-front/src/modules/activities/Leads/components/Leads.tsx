import { useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { ActivityTargetableObject } from '@/activities/types/ActivityTargetableEntity';
import { GET_CAMPAIGN_LISTS } from '@/users/graphql/queries/getCampaignList';
import { GET_CAMPAIGN_TRIGGER } from '@/users/graphql/queries/getOneCampaignTrigger';
import { useLazyQuery } from '@apollo/client';
import { FILTER_LEADS } from '@/users/graphql/queries/filterLeads';
import { Checkbox } from '@/ui/input/components/Checkbox';
import { capitalize } from '~/utils/string/capitalize';
import { useCampaign } from '~/pages/campaigns/CampaignUseContext';
import { formatToHumanReadableDate } from '~/utils';
import { EllipsisDisplay } from '@/ui/field/display/components/EllipsisDisplay';
import { NumberDisplay } from '@/ui/field/display/components/NumberDisplay';
import {
  IconRefresh,
  IconUser,
  IconListNumbers,
  IconLocation,
  IconBrandCampaignmonitor,
  IconDeviceTv,
  IconSpeakerphone,
  IconTextCaption,
  IconCalendar,
  IconNumbers,
  IconLoader,
} from '@tabler/icons-react';
import { IconButton } from '@/ui/input/button/components/IconButton';
import { TextDisplay } from '@/ui/field/display/components/TextDisplay';
import { Button } from '@/ui/input/button/components/Button';
import { formatNumber } from '~/utils/format/number';
import { DateTimeDisplay } from '@/ui/field/display/components/DateTimeDisplay';
import { boolean } from 'zod';

const StyledInputCard = styled.div`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  height: auto%;
  justify-content: space-evenly;
  width: 100%;
`;

const StyledButtonContainer = styled.div`
  display: inline-flex;
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.spacing(2)};
`;

const StyledCountContainer = styled.div`
  display: flex;
  flex-direction: row;
  > * + * {
    margin-left: ${({ theme }) => theme.spacing(10)};
  }
  margin-top: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(6)};
  height: auto;
  justify-content: flex-start;
  width: 100%;
  align-items: center;
`;

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

const StyledComboInputContainer = styled.div`
  display: flex;
  align-items: center;
  > * + * {
    margin-left: ${({ theme }) => theme.spacing(2)};
  }
`;

const StyledContainer = styled.div`
  align-items: flex-start;
  align-self: stretch;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const StyledLabelContainer = styled.div`
  color: ${({ theme }) => theme.font.color.tertiary};
  width: auto;
`;
interface CheckboxState {
  [key: string]: boolean;
}
export const Leads = ({
  targetableObject,
}: {
  targetableObject: ActivityTargetableObject;
}) => {
  const fields = [
    { name: 'name', icon: IconUser },
    { name: 'age', icon: IconListNumbers },
    { name: 'location', icon: IconLocation },
    { name: 'advertisementSource', icon: IconBrandCampaignmonitor },
    { name: 'advertisementName', icon: IconDeviceTv },
    { name: 'campaignName', icon: IconSpeakerphone },
    { name: 'comments', icon: IconTextCaption },
    { name: 'createdAt', icon: IconCalendar },
  ];

  const [leadsData, setLeadsData] = useState<any | any[]>([]);
  const [totalLeadsCount, setTotalLeadsCount] = useState<number>(0);
  const [selectedRows, setSelectedRows] = useState<{ [key: string]: boolean }>(
    {},
  );

  const [filter, setFilter] = useState('');
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const lastLeadRef = useRef<HTMLTableRowElement | null>(null);
  const [selectedID, setSelectedID] = useState(new Set());
  const [unselectedID, setUnselectedID] = useState(new Set());

  const [unSelectedRows, setunSelectedRows] = useState<{
    [key: string]: boolean;
  }>({});
  const [masterCheckboxChecked, setMasterCheckboxChecked] = useState(true);
  const [isChecked, setIsChecked] = useState<boolean>(true);
  const [checkbox,setCheckbox]=useState<CheckboxState>({});
  const { campaignData, setCampaignData } = useCampaign();

  let [selectedCampaign, { data: selectedCampaignData }] = useLazyQuery(
    GET_CAMPAIGN_LISTS,
    {
      fetchPolicy: 'network-only',
    },
  );

  let [selectedCampaignTrigger, { data: selectedCampaignTriggerData }] =
    useLazyQuery(GET_CAMPAIGN_TRIGGER, {
      fetchPolicy: 'network-only',
    });

  let [filterleads, { data: filterLeadsData }] = useLazyQuery(FILTER_LEADS, {
    fetchPolicy: 'network-only',
  });

  // const handleCheckboxChange = (leadId: string) => {
  //   const updatedSelectedRows = { ...selectedRows };
  //   updatedSelectedRows[leadId] = !updatedSelectedRows[leadId];

  //   const updatedUnSelectedRows = { ...unSelectedRows };
  //   if (!updatedSelectedRows[leadId]) {
  //     updatedUnSelectedRows[leadId] = true;
  //     delete updatedSelectedRows[leadId];
  //   } else {
  //     delete updatedUnSelectedRows[leadId];
  //   }

  //   const selectedLeadIds = Object.keys(updatedSelectedRows);
  //   const unSelectedLeadIds = Object.keys(updatedUnSelectedRows);

  //   setCampaignData({
  //     ...campaignData,
  //     selectedId: selectedLeadIds,
  //     unSelectedId: unSelectedLeadIds,
  //   });

  //   setSelectedRows(updatedSelectedRows);
  //   setunSelectedRows(updatedUnSelectedRows);
  // };

  // const handleMasterCheckboxChange = () => {
  //   const updatedSelectedRows = { ...selectedRows };
  //   const updatedUnSelectedRows = { ...unSelectedRows };
  //   let allSelected = true;

  //   leadsData?.leads?.edges.forEach((leadEdge: any) => {
  //     const lead = leadEdge?.node;
  //     if (!masterCheckboxChecked) {
  //       updatedSelectedRows[lead.id] = true;
  //       delete updatedUnSelectedRows[lead.id];
  //     } else {
  //       // Check if the lead is currently unselected
  //       if (!updatedSelectedRows[lead.id]) allSelected = false;
  //       // Update both selected and unselected rows
  //       updatedSelectedRows[lead.id] = !updatedSelectedRows[lead.id];
  //       updatedUnSelectedRows[lead.id] = !updatedUnSelectedRows[lead.id];
  //     }
  //     if(masterCheckboxChecked){
  //       allSelected = true;
  //     }
  //   });

  //   const selectedLeadIds = Object.keys(updatedSelectedRows);
  //   const unSelectedLeadIds = Object.keys(updatedUnSelectedRows);

  //   setCampaignData({
  //     ...campaignData,
  //     selectedId: selectedLeadIds,
  //     unSelectedId: unSelectedLeadIds,
  //   });

  //   // If all were selected, now deselect all, else select all
  //   setSelectedRows(allSelected ? {} : updatedSelectedRows);
  //   setunSelectedRows(allSelected ? {} : updatedUnSelectedRows);
  //   setMasterCheckboxChecked(!masterCheckboxChecked);
  // };

  const handleCheckboxChange = (event: any, leadId: string): boolean => {
    const { checked } = event.target;
    if (checked) {
      setSelectedID(selectedID.add(leadId));
      unselectedID.delete(leadId);
      setUnselectedID(unselectedID);
      setCheckbox({
        ...checkbox,
        leadId:true
      })
      return true;
    } else {
      selectedID.delete(leadId);
      setSelectedID(selectedID);
      setUnselectedID(unselectedID.add(leadId));
      setCheckbox({
        ...checkbox,
        leadId:false
      })
    }
    setIsChecked(checked)
    console.log(selectedID)
    return false;

  };
  const handleMasterCheckboxChange = (event: any) => {
    const { checked } = event.target;
    if (checked) {
      for (const id of unselectedID.keys()) {
        setSelectedID(selectedID.add(id));
        unselectedID.delete(id);
        setUnselectedID(unselectedID);
        setCheckbox({
          ...checkbox,
          leadId:true
        })
      }
    } else {
      for (const id of selectedID.keys()) {
        selectedID.delete(id);
        setSelectedID(selectedID);
        setUnselectedID(unselectedID.add(id));
        setCheckbox({
          ...checkbox,
          leadId:false
        })
      }
    }
    console.log(selectedID, 'selectedID');

  };

  let campaignId = '';

  const fetchLeads = async () => {
    try {
      if (targetableObject.targetObjectNameSingular === 'campaignTrigger') {
        const data = await selectedCampaignTrigger({
          variables: {
            objectRecordId: targetableObject.id,
          },
        });

        campaignId = data.data.campaignTrigger.campaignId;
        console.log(campaignId, 'campaignId');
      } else if (targetableObject.targetObjectNameSingular === 'campaign') {
        campaignId = targetableObject.id;
      }

      const data = await selectedCampaign({
        variables: {
          filter: {
            id: { eq: campaignId },
          },
        },
      });

      const filter = JSON.parse(
        data.data.campaigns.edges[0].node.segment.filters,
      );
      setFilter(filter);

      const result = await filterleads({ variables: filter });
      const leadsCount = result.data?.leads?.totalCount || 0;
      setTotalLeadsCount(leadsCount);
      setLeadsData(result.data.leads.edges);

      // const initialSelectedRows: { [key: string]: boolean } = {};
      // result.data.leads.edges.forEach((leadEdge: any) => {
      //   const lead = leadEdge?.node;
      //   initialSelectedRows[lead.id] = true;
      // });
      // setSelectedRows(initialSelectedRows);
      result.data.leads.edges.forEach((leadEdge: any) => {
        const lead = leadEdge?.node;
        setSelectedID(selectedID.add(lead.id));
        const leadId=lead.id
        setCheckbox({
          ...checkbox,
          leadId:true
        })
      });
      console.log(selectedID, 'selectedID');
      const querystamp = new Date().toISOString();
      setCursor(result.data.leads.pageInfo.endCursor);
      if (result.data.leads.pageInfo.hasNextPage == true) {
        setLoading(true);
      }
      setCampaignData({
        ...campaignData,
        querystamp: querystamp,
      });
    } catch (error) {
      console.error('Error fetching campaign segment filter:', error);
    }
  };

  const loadMore = async () => {
    if (loading) {
      const result = await filterleads({
        variables: {
          lastCursor: cursor,
        },
      });
      // setSelectedRows((prevSelectedRows) => {
      //   const newSelectedRows: { [key: string]: boolean } = {
      //     ...prevSelectedRows,
      //   };
      result.data.leads.edges.forEach((leadEdge: any) => {
        const lead = leadEdge?.node;
        setSelectedID(selectedID.add(lead.id));
        const leadId=lead.id
        setCheckbox({
          ...checkbox,
          leadId:true
        })
      });
      //   return newSelectedRows;
      // });
      setCursor(result.data.leads.pageInfo.endCursor);
      const newLeadsData = result.data.leads.edges;
      console.log(result.data, 'RESULT DATA');
      setLeadsData([...leadsData, ...newLeadsData]);
    }

    console.log(leadsData, 'new Leads Data');
  };

  useEffect(() => {
    if (unselectedID.size > 0) {
      setMasterCheckboxChecked(false);
    } else {
      setMasterCheckboxChecked(true);
    }
    fetchLeads();
  }, [targetableObject.id, selectedCampaign,unselectedID,selectedID]);

  const date = new Date(campaignData.querystamp.toString());
  console.log(date, 'formated date');

  const onIntersection = async (entries: any) => {
    const firstEntry = entries[0];

    if (firstEntry.isIntersecting && cursor) {
      loadMore();
    }
  };
  const handleCheck=(leadId: string | number)=>{
    return checkbox[leadId];
  }

  useEffect(() => {
    const observer = new IntersectionObserver(onIntersection);
    if (observer && lastLeadRef.current) {
      observer.observe(lastLeadRef.current);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [leadsData]);

  return (
    <>
      <StyledButtonContainer>
        <IconButton
          variant="tertiary"
          Icon={IconRefresh}
          onClick={fetchLeads}
        />
      </StyledButtonContainer>
      <StyledContainer>
        <StyledInputCard>
          {leadsData[0] && (
            <>
              <StyledCountContainer>
                <StyledComboInputContainer>
                  <StyledLabelContainer>
                    <EllipsisDisplay>Leads fetched at:</EllipsisDisplay>
                  </StyledLabelContainer>
                  <DateTimeDisplay value={date} />
                </StyledComboInputContainer>
                <StyledComboInputContainer>
                  <StyledLabelContainer>
                    <EllipsisDisplay>Total Leads:</EllipsisDisplay>
                  </StyledLabelContainer>
                  <NumberDisplay value={totalLeadsCount} />{' '}
                </StyledComboInputContainer>

                <StyledComboInputContainer>
                  <StyledLabelContainer>
                    <EllipsisDisplay>Selected Leads:</EllipsisDisplay>
                  </StyledLabelContainer>
                  <NumberDisplay value={Object.keys(selectedRows).length} />
                </StyledComboInputContainer>

                <StyledComboInputContainer>
                  <StyledLabelContainer>
                    <EllipsisDisplay>Unselected Leads:</EllipsisDisplay>
                  </StyledLabelContainer>
                  <NumberDisplay value={Object.keys(unSelectedRows).length} />
                </StyledComboInputContainer>
              </StyledCountContainer>

              <StyledTable cursorPointer={true}>
                <tbody>
                  <StyledTableRow>
                    <StyledTableHeaderCell>
                      <Checkbox
                        checked={masterCheckboxChecked}
                        onChange={() => (handleMasterCheckboxChange(event))}
                      />
                    </StyledTableHeaderCell>

                    {fields.map(({ name, icon: Icon }) => (
                      <StyledTableHeaderCell key={name}>
                        <StyledLabelContainer>
                          {Icon && <Icon size={15} />}
                          {capitalize(name)}
                        </StyledLabelContainer>
                      </StyledTableHeaderCell>
                    ))}
                  </StyledTableRow>
                  {leadsData.map((leadEdge: any) => {
                    const lead = leadEdge?.node;
                    return (
                      <StyledTableRow
                        key={lead.id}
                        onClick={(event) =>
                          {handleCheckboxChange(event, lead.id);
                          }
                        }
                        // checked={() => handleCheckboxChange(event, lead.id)}
                      >
                        <StyledTableCell>
                          <Checkbox
                            checked={checkbox[lead.id]}
                            onChange={() =>
                              handleCheckboxChange(event, lead.id)
                            }
                          />
                        </StyledTableCell>
                        {fields.map(({ name }) => (
                          <StyledTableCell key={name}>
                            <EllipsisDisplay>
                              {lead[name].toString()}
                            </EllipsisDisplay>
                          </StyledTableCell>
                        ))}
                      </StyledTableRow>
                    );
                  })}
                  {cursor && (
                    <StyledTableRow ref={lastLeadRef}>
                      <td>Loading more...</td>
                    </StyledTableRow>
                  )}
                </tbody>
              </StyledTable>
            </>
          )}
        </StyledInputCard>
      </StyledContainer>
    </>
  );
};
