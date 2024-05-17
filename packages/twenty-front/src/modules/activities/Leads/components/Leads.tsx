import { useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { ActivityTargetableObject } from '@/activities/types/ActivityTargetableEntity';
import { GET_CAMPAIGN_LISTS } from '@/users/graphql/queries/getCampaignList';
import { GET_CAMPAIGN_TRIGGER } from '@/users/graphql/queries/getOneCampaignTrigger';
import { GET_CONTACTED_OPPORTUNITIES } from '@/users/graphql/queries/getContactedOpportunities';
import { useLazyQuery } from '@apollo/client';
import { FILTER_LEADS } from '@/users/graphql/queries/filterLeads';
import { Checkbox } from '@/ui/input/components/Checkbox';
import { capitalize } from '~/utils/string/capitalize';
import { useCampaign } from '~/pages/campaigns/CampaignUseContext';
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
} from '@tabler/icons-react';
import { IconButton } from '@/ui/input/button/components/IconButton';
import { DateTimeDisplay } from '@/ui/field/display/components/DateTimeDisplay';

const StyledButtonContainer = styled.div`
  display: inline-flex;
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.spacing(2)};
`;

const StyledContainer = styled.div`
  align-items: flex-start;
  align-self: stretch;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const StyledInputCard = styled.div`
  align-items: flex-start;
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
  margin-top: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(6)};
  height: auto;
  justify-content: flex-start;
  width: 100%;
  align-items: center;
`;

const StyledComboInputContainer = styled.div`
  display: flex;
  align-items: center;
  > * + * {
    margin-left: ${({ theme }) => theme.spacing(2)};
  }
`;

const StyledLabelContainer = styled.div`
  color: ${({ theme }) => theme.font.color.tertiary};
  width: auto;
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

const StyledTableHeaderCell = styled.td`
  padding: 5px;
  border: 1px solid ${({ theme }) => theme.border.color.medium};
  height: 25px;
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
  let campaignId = '';
  const [filter, setFilter] = useState<Record<string, any>>({});
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const lastLeadRef = useRef<HTMLTableRowElement | null>(null);
  const [selectedID, setSelectedID] = useState(new Set());
  const [unselectedID, setUnselectedID] = useState(new Set());
  const [isChecked, setIsChecked] = useState<boolean>(true);
  const [checkbox, setCheckbox] = useState<CheckboxState>({});
  const { campaignData, setCampaignData } = useCampaign();
  const allLeadId = {};
  const date = new Date(campaignData.querystamp.toString());
  let [opportunitiesLeadIds, setOpportunitiesLeadIds] = useState(new Set());

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

  let [contactedOpportunities, { data: contactedOpportunitiesData }] =
    useLazyQuery(GET_CONTACTED_OPPORTUNITIES, {
      fetchPolicy: 'network-only',
    });

  const fetchLeads = async () => {
    try {
      if (targetableObject.targetObjectNameSingular === 'campaignTrigger') {
        const data = await selectedCampaignTrigger({
          variables: {
            objectRecordId: targetableObject.id,
          },
        });

        campaignId = data.data.campaignTrigger.campaignId;
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
      result.data.leads.edges.forEach((leadEdge: any) => {
        const lead = leadEdge?.node;
        setSelectedID(selectedID.add(lead.id));
        let leadId = lead.id;
      });

      for (const id of selectedID.keys()) {
        allLeadId[id] = true;
      }
      setCheckbox({
        ...checkbox,
        ...allLeadId,
      });

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
          ...filter,
          lastCursor: cursor,
        },
      });

      result.data.leads.edges.forEach((leadEdge: any) => {
        const lead = leadEdge?.node;
        setSelectedID(selectedID.add(lead.id));
        allLeadId[lead.id] = true;
      });

      setCheckbox({
        ...checkbox,
        ...allLeadId,
      });

      setCursor(result.data.leads.pageInfo.endCursor);
      const newLeadsData = result.data.leads.edges;

      for (const id of unselectedID.keys()) {
        setSelectedID(selectedID.add(id));
        unselectedID.delete(id);
        setUnselectedID(unselectedID);
      }

      for (const id of selectedID.keys()) {
        allLeadId[id] = true;
      }

      setCheckbox({
        ...checkbox,
        ...allLeadId,
      });

      const removeleadsfromSelected = (prevLeadsData: any[]) =>
        prevLeadsData.filter((lead: any) =>
          opportunitiesLeadIds.has(lead.node.id),
        );

      const removeleads = (prevLeadsData: any[]) =>
        prevLeadsData.filter(
          (lead: any) => !opportunitiesLeadIds.has(lead.node.id),
        );

      const removeFromSelected = removeleadsfromSelected(newLeadsData);
      for (const lead of removeFromSelected) {
        selectedID.delete(lead.node.id);
        unselectedID.delete(lead.node.id);
      }
      setSelectedID(selectedID);
      setUnselectedID(unselectedID);
      console.log(selectedID, 'selected');

      const leadsRemoved = removeleads(newLeadsData);
      setLeadsData([...leadsData, ...leadsRemoved]);
      setTotalLeadsCount(totalLeadsCount - removeFromSelected.length);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [targetableObject.id, selectedCampaign]);

  const handleRemoveContactedLeads = async () => {
    try {
      let hasNextPage = true;
      let cursor = null;

      while (hasNextPage) {
        const data = await contactedOpportunities({
          variables: {
            objectRecordId: targetableObject.id,
            opportunityLeadFilter: {
              stage: {
                eq: 'INFORMED',
              },
              messageStatus: {
                eq: 'SUCCESS',
              },
            },
            lastCursor: cursor,
          },
        });

        data.data.campaign.opportunities.edges.forEach(
          (edge: { node: { leadId: unknown } }) => {
            setOpportunitiesLeadIds(opportunitiesLeadIds.add(edge.node.leadId));
          },
        );

        cursor = data.data.campaign.opportunities.pageInfo.endCursor;
        hasNextPage = data.data.campaign.opportunities.pageInfo.hasNextPage;
        console.log(hasNextPage);
      }
      const removeleadsfromSelected = (prevLeadsData: any[]) =>
        prevLeadsData.filter((lead: any) =>
          opportunitiesLeadIds.has(lead.node.id),
        );

      const removeleads = (prevLeadsData: any[]) =>
        prevLeadsData.filter(
          (lead: any) => !opportunitiesLeadIds.has(lead.node.id),
        );

      const removeFromSelected = removeleadsfromSelected(leadsData);
      console.log(removeFromSelected, 'remove');
      for (const lead of removeFromSelected) {
        // console.log(node.id,"node.id")
        // console.log(node,"node")

        selectedID.delete(lead.node.id);
        unselectedID.delete(lead.node.id);
      }
      setSelectedID(selectedID);
      setUnselectedID(unselectedID);
      console.log(selectedID, 'selected');

      setLeadsData(removeleads(leadsData));
      setTotalLeadsCount(totalLeadsCount - removeFromSelected.length);
    } catch (error) {
      console.error('Error fetching contacted opportunities:', error);
    }
  };

  const handleCheckboxChange = (event: any, leadId: string): boolean => {
    const { checked } = event.target;
    if (checked) {
      setSelectedID(selectedID.add(leadId));
      unselectedID.delete(leadId);
      setUnselectedID(unselectedID);
      setCheckbox({
        ...checkbox,
        [leadId]: true,
      });
    } else {
      selectedID.delete(leadId);
      setSelectedID(selectedID);
      setUnselectedID(unselectedID.add(leadId));
      setCheckbox({
        ...checkbox,
        [leadId]: false,
      });
    }

    setIsChecked(checked);
    setCampaignData({
      ...campaignData,
      selectedId: Array.from(selectedID),
      unSelectedId: Array.from(unselectedID),
    });
    return false;
  };

  const handleMasterCheckboxChange = (event: any) => {
    const { checked } = event.target;
    if (checked) {
      for (const id of unselectedID.keys()) {
        setSelectedID(selectedID.add(id));
        unselectedID.delete(id);
        setUnselectedID(unselectedID);
      }
      for (const id of selectedID.keys()) {
        allLeadId[id] = true;
      }
    } else {
      for (const id of selectedID.keys()) {
        selectedID.delete(id);
        setSelectedID(selectedID);
        setUnselectedID(unselectedID.add(id));
      }
      for (const id of unselectedID.keys()) {
        allLeadId[id] = false;
      }
    }

    setCheckbox({
      ...checkbox,
      ...allLeadId,
    });
    setCampaignData({
      ...campaignData,
      selectedId: Array.from(selectedID),
      unSelectedId: Array.from(unselectedID),
    });
  };

  const onIntersection = async (entries: any) => {
    const firstEntry = entries[0];

    if (firstEntry.isIntersecting && cursor) {
      loadMore();
    }
  };

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
          // console.log(cursor,"cursor")
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
                  <NumberDisplay value={selectedID.size} />
                </StyledComboInputContainer>

                <StyledComboInputContainer>
                  <StyledLabelContainer>
                    <EllipsisDisplay>Unselected Leads:</EllipsisDisplay>
                  </StyledLabelContainer>
                  <NumberDisplay value={unselectedID.size} />
                </StyledComboInputContainer>
                <StyledComboInputContainer>
                  <StyledLabelContainer>
                    <EllipsisDisplay>
                      <Checkbox
                        checked={false}
                        onChange={() => handleRemoveContactedLeads()}
                      />
                      Remove leads that were contacted previously
                    </EllipsisDisplay>
                  </StyledLabelContainer>
                </StyledComboInputContainer>
              </StyledCountContainer>

              <StyledTable cursorPointer={true}>
                <tbody>
                  <StyledTableRow>
                    <StyledTableHeaderCell>
                      <Checkbox
                        checked={unselectedID.size == 0}
                        onChange={() => handleMasterCheckboxChange(event)}
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
                      <StyledTableRow key={lead.id}>
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
                  {cursor && loading && (
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
