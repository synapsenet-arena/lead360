import { Tag } from 'twenty-ui';

import { useSelectField } from '../../hooks/useSelectField';
import { useEffect } from 'react';
import { useCampaign } from '~/pages/campaigns/CampaignUseContext';
import { useSelectFieldDisplay } from '@/object-record/record-field/meta-types/hooks/useSelectFieldDisplay';
import { isDefined } from '~/utils/isDefined';

export const SelectFieldDisplay = () => {
  const { fieldValue, fieldDefinition } = useSelectFieldDisplay();
  const { draftValue } = useSelectField();

  const selectedOption = fieldDefinition.metadata.options?.find(
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

  if (!isDefined(selectedOption)) {
    return <></>;
  }

  return (
    <Tag
      preventShrink
      color={selectedOption.color}
      text={selectedOption.label}
    />
  );
};
