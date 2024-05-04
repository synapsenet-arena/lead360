import { Tag } from '@/ui/display/tag/components/Tag';

import { useSelectField } from '../../hooks/useSelectField';
import { RightDrawerActivity } from '@/activities/right-drawer/components/RightDrawerActivity';
import { viewableActivityIdState } from '@/activities/states/viewableActivityIdState';
import { useRecoilValue } from 'recoil';

import { useEffect, useRef, useState } from 'react';
import { useCampaign } from '~/pages/campaigns/CampaignUseContext';
import { RightDrawerCreateActivity } from '@/activities/right-drawer/components/create/RightDrawerCreateActivity';
import { RightDrawerActivityTopBar } from '@/activities/right-drawer/components/RightDrawerActivityTopBar';
import { preview } from 'vite';

export const SelectFieldDisplay = () => {
  const { fieldValue,draftValue, fieldDefinition } = useSelectField();

  const selectedOption = fieldDefinition.metadata.options.find(
    (option) => option.value === fieldValue,
  );
  const {campaignData,setCampaignData}=useCampaign()

  useEffect(()=>{
    setCampaignData({
      ...campaignData,
      draftValue:draftValue,
      fieldValue:fieldValue
    })
  },[draftValue,fieldValue])

  return selectedOption ? (
    <Tag color={selectedOption.color} text={selectedOption.label} />
  ) : (
    <></>
  );
};
