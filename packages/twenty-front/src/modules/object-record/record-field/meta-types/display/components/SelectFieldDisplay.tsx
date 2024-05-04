import { Tag } from '@/ui/display/tag/components/Tag';

import { useSelectField } from '../../hooks/useSelectField';
import { useEffect } from 'react';
import { useCampaign } from '~/pages/campaigns/CampaignUseContext';

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
