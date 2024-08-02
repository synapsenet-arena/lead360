import {
  leadsDataState,
  totalLeadsCountState,
  selectedIDState,
  unselectedIDState,
  checkboxState,
  allLeadId,
  opportunitesLeadIdsState,
  isCheckedState,
} from '@/activities/Leads/components/LeadAtoms';
import { ActivityTargetableObject } from '@/activities/types/ActivityTargetableEntity';
import { GET_CONTACTED_OPPORTUNITIES } from '@/users/graphql/queries/getContactedOpportunities';
import { useLazyQuery } from '@apollo/client';
import { useRecoilState } from 'recoil';
import { useCampaign } from '~/pages/campaigns/CampaignUseContext';

export const LeadsCheckbox = (targetableObject: ActivityTargetableObject) => {
  const [leadsData, setLeadsData] = useRecoilState(leadsDataState);
  const [totalLeadsCount, setTotalLeadsCount] =
    useRecoilState(totalLeadsCountState);
  const [selectedID, setSelectedID] = useRecoilState(selectedIDState);
  const [unselectedID, setUnselectedID] = useRecoilState(unselectedIDState);
  const [checkbox, setCheckbox] = useRecoilState(checkboxState);
  const [isChecked, setIsChecked] = useRecoilState(isCheckedState);
  const { campaignData, setCampaignData } = useCampaign();
  let [opportunitiesLeadIds, setOpportunitiesLeadIds] = useRecoilState(
    opportunitesLeadIdsState,
  );
  let [contactedOpportunities, { data: contactedOpportunitiesData }] =
    useLazyQuery(GET_CONTACTED_OPPORTUNITIES, {
      fetchPolicy: 'network-only',
    });
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
          (edge: { node: { leadId: string } }) => {
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
        allLeadId[id as string] = true;
      }
    } else {
      for (const id of selectedID.keys()) {
        selectedID.delete(id);
        setSelectedID(selectedID);
        setUnselectedID(unselectedID.add(id));
      }
      for (const id of unselectedID.keys()) {
        allLeadId[id as string] = false;
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
  return {
    handleRemoveContactedLeads,
    handleCheckboxChange,
    handleMasterCheckboxChange,
  };
};
