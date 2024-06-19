import { useEffect, useRef, useState } from 'react';
import { ActivityTargetableObject } from '@/activities/types/ActivityTargetableEntity';
import { useCampaign } from '~/pages/campaigns/CampaignUseContext';
import { IconRefresh } from '@tabler/icons-react';
import { IconButton } from '@/ui/input/button/components/IconButton';
import { DisplayLeads } from '@/activities/Leads/components/DisplayLeads';
import {
  StyledButtonContainer,
  StyledContainer,
  StyledInputCard,
} from '@/activities/Leads/components/LeadsStyles';
import { useRecoilState, useResetRecoilState } from 'recoil';
import { FetchAndUpdateLeads } from '@/activities/Leads/components/FetchAndUpdateLeads';
import {
  leadsDataState,
  totalLeadsCountState,
  cursorState,
  loadingState,
  selectedIDState,
  unselectedIDState,
  checkboxState,
  isCheckedState,
} from '@/activities/Leads/components/LeadAtoms';
import { LeadsCheckbox } from '@/activities/Leads/components/LeadsCheckbox';
export const Leads = ({
  targetableObject,
}: {
  targetableObject: ActivityTargetableObject;
}) => {
  const [leadsData] = useRecoilState(leadsDataState);
  const [cursor] = useRecoilState(cursorState);
  const lastLeadRef = useRef<HTMLTableRowElement | null>(null);
  const [selectedID, setSelectedID] = useRecoilState(selectedIDState);
  const [unselectedID, setUnselectedID] = useRecoilState(unselectedIDState);
  const { campaignData, setCampaignData } = useCampaign();
  const date = new Date(campaignData.querystamp.toString());
  const resetIsChecked = useResetRecoilState(isCheckedState);
  const resetCheckbox = useResetRecoilState(checkboxState);
  const resetLeadsData = useResetRecoilState(leadsDataState);
  const resetLoading = useResetRecoilState(loadingState);
  const resetlCursor = useResetRecoilState(cursorState);
  const resetTotalLeadsCount = useResetRecoilState(totalLeadsCountState);

  const { fetchLeads, loadMore } = FetchAndUpdateLeads(targetableObject);
  const {
    handleRemoveContactedLeads,
    handleCheckboxChange,
    handleMasterCheckboxChange,
  } = LeadsCheckbox(targetableObject);
  const clearSelectedID = () => {
    setSelectedID(new Set());
    setUnselectedID(new Set());
  };

  useEffect(() => {
    fetchLeads();
    return () => {
      resetLeadsData();
      resetTotalLeadsCount();
      resetIsChecked();
      resetCheckbox();
      resetLoading();
      resetlCursor();
      clearSelectedID();
    };
  }, [targetableObject.id]);

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

  const [fieldsToDisplay, setFieldsToDisplay] = useState<string[]>([]);

  useEffect(() => {
    if (leadsData[0]) {
      setFieldsToDisplay(
        Object.keys(leadsData[0].node).filter(
          (field) => field !== '__typename' && field !== 'id',
        ),
      );
    }
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
          <DisplayLeads
            lastLeadRef={lastLeadRef}
            date={date}
            handleRemoveContactedLeads={handleRemoveContactedLeads}
            handleMasterCheckboxChange={handleMasterCheckboxChange}
            handleCheckboxChange={handleCheckboxChange}
          />
        </StyledInputCard>
      </StyledContainer>
    </>
  );
};
