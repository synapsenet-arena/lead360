import { ActivityTargetableObject } from '@/activities/types/ActivityTargetableEntity';
import { FILTER_LEADS } from '@/users/graphql/queries/filterLeads';
import { GET_CAMPAIGN_LISTS } from '@/users/graphql/queries/getCampaignList';
import { useLazyQuery } from '@apollo/client';
import { GET_CAMPAIGN_TRIGGER } from '@/users/graphql/queries/getOneCampaignTrigger';
import {
  leadsDataState,
  totalLeadsCountState,
  cursorState,
  loadingState,
  selectedIDState,
  unselectedIDState,
  checkboxState,
  filterState,
  allLeadId,
  opportunitesLeadIdsState,
} from '@/activities/Leads/components/LeadAtoms';
import { useRecoilState } from 'recoil';
import { useRef } from 'react';
import { useCampaign } from '~/pages/campaigns/CampaignUseContext';

export const FetchAndUpdateLeads = (
  targetableObject: ActivityTargetableObject,
) => {
  const [leadsData, setLeadsData] = useRecoilState(leadsDataState);
  const [totalLeadsCount, setTotalLeadsCount] =
    useRecoilState(totalLeadsCountState);
  let campaignId = '';
  const [filter, setFilter] = useRecoilState(filterState);
  const [cursor, setCursor] = useRecoilState(cursorState);
  const [loading, setLoading] = useRecoilState(loadingState);
  const lastLeadRef = useRef<HTMLTableRowElement | null>(null);
  const [selectedID, setSelectedID] = useRecoilState(selectedIDState);
  const [unselectedID, setUnselectedID] = useRecoilState(unselectedIDState);
  const [checkbox, setCheckbox] = useRecoilState(checkboxState);
  const { campaignData, setCampaignData } = useCampaign();
  let [opportunitiesLeadIds, setOpportunitiesLeadIds] = useRecoilState(
    opportunitesLeadIdsState,
  );

  const [filterleads, { data: filterLeadsData }] = useLazyQuery(FILTER_LEADS, {
    fetchPolicy: 'network-only',
  });

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
        allLeadId[id as string] = true;
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
        const id = lead.id;
        allLeadId[id] = true;
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
        allLeadId[id as string] = true;
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

  return { fetchLeads, loadMore, filterLeadsData };
};
