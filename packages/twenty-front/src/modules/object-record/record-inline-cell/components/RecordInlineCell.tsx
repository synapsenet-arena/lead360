import { useContext, useRef, useState } from 'react';

import { FieldDisplay } from '@/object-record/record-field/components/FieldDisplay';
import { FieldInput } from '@/object-record/record-field/components/FieldInput';
import { FieldContext } from '@/object-record/record-field/contexts/FieldContext';
import { useGetButtonIcon } from '@/object-record/record-field/hooks/useGetButtonIcon';
import { useIsFieldEmpty } from '@/object-record/record-field/hooks/useIsFieldEmpty';
import { useIsFieldInputOnly } from '@/object-record/record-field/hooks/useIsFieldInputOnly';
import { FieldInputEvent } from '@/object-record/record-field/types/FieldInputEvent';
import { isFieldRelation } from '@/object-record/record-field/types/guards/isFieldRelation';
import { RelationPickerHotkeyScope } from '@/object-record/relation-picker/types/RelationPickerHotkeyScope';
import { useIcons } from '@/ui/display/icon/hooks/useIcons';

import { useInlineCell } from '../hooks/useInlineCell';

import { RecordInlineCellContainer } from './RecordInlineCellContainer';
import { useSelectField } from '@/object-record/record-field/meta-types/hooks/useSelectField';
import { ActivityEditor } from '@/activities/components/ActivityEditor';
import { viewableActivityIdState } from '@/activities/states/viewableActivityIdState';
import { useRecoilValue } from 'recoil';
import { useOpenCreateActivityDrawer } from '@/activities/hooks/useOpenCreateActivityDrawer';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { useCampaign } from '~/pages/campaigns/CampaignUseContext';

export const RecordInlineCell = () => {
  const { fieldDefinition, entityId } = useContext(FieldContext);

  const buttonIcon = useGetButtonIcon();

  const isFieldEmpty = useIsFieldEmpty();

  const isFieldInputOnly = useIsFieldInputOnly();

  const { closeInlineCell } = useInlineCell();

  const handleEnter: FieldInputEvent = (persistField) => {
    persistField();
    closeInlineCell();
  };

  const handleSubmit: FieldInputEvent = (persistField) => {
    persistField();
    closeInlineCell();
  };
  const openCreateActivity = useOpenCreateActivityDrawer();
  const { enqueueSnackBar } = useSnackBar();
  const handleStageChange: FieldInputEvent = (persistField) => {
    persistField();
    closeInlineCell();
    openCreateActivity({
      type: 'Note',
      targetableObjects: [{
        id: entityId,
        targetObjectNameSingular: fieldDefinition.metadata.objectMetadataNameSingular,
      }],
    })
    
    enqueueSnackBar('Changed Opportunity Stage', {
      variant: 'success',
    });
  };

  const handleCancel = () => {
    closeInlineCell();
  };

  const handleEscape = () => {
    closeInlineCell();
  };

  const handleTab: FieldInputEvent = (persistField) => {
    persistField();
    closeInlineCell();
  };

  const handleShiftTab: FieldInputEvent = (persistField) => {
    persistField();
    closeInlineCell();
  };

  const handleClickOutside: FieldInputEvent = (persistField) => {
    persistField();
    closeInlineCell();
  };
  const viewableActivityId = useRecoilValue(viewableActivityIdState);

  const { getIcon } = useIcons();
  return (<>

{fieldDefinition.metadata.fieldName!=='stage' && <RecordInlineCellContainer
      buttonIcon={buttonIcon}
      customEditHotkeyScope={
        isFieldRelation(fieldDefinition)
          ? {
              scope: RelationPickerHotkeyScope.RelationPicker,
            }
          : undefined
      }
      IconLabel={
        fieldDefinition.iconName ? getIcon(fieldDefinition.iconName) : undefined
      }
      label={fieldDefinition.label}
      labelWidth={fieldDefinition.labelWidth}
      showLabel={fieldDefinition.showLabel}
      editModeContent={
        <FieldInput
          recordFieldInputdId={`${entityId}-${fieldDefinition?.metadata?.fieldName}`}
          onEnter={handleEnter}
          onCancel={handleCancel}
          onEscape={handleEscape}
          onSubmit={handleSubmit}
          onTab={handleTab}
          onShiftTab={handleShiftTab}
          onClickOutside={handleClickOutside}
        />
      }
      displayModeContent={<FieldDisplay />}
      isDisplayModeContentEmpty={isFieldEmpty}
      isDisplayModeFixHeight
      editModeContentOnly={isFieldInputOnly}
    />}
    {fieldDefinition.metadata.fieldName==='stage' && <RecordInlineCellContainer
      // buttonIcon={buttonIcon}
      customEditHotkeyScope={
        isFieldRelation(fieldDefinition)
          ? {
              scope: RelationPickerHotkeyScope.RelationPicker,
            }
          : undefined
      }
      IconLabel={
        fieldDefinition.iconName ? getIcon(fieldDefinition.iconName) : undefined
      }
      label={fieldDefinition.label}
      labelWidth={fieldDefinition.labelWidth}
      showLabel={fieldDefinition.showLabel}
      editModeContent={
        <FieldInput
          recordFieldInputdId={`${entityId}-${fieldDefinition?.metadata?.fieldName}`}
          onSubmit={handleStageChange}
        />
      }
      displayModeContent={<FieldDisplay />}
      isDisplayModeContentEmpty={isFieldEmpty}
      isDisplayModeFixHeight
      editModeContentOnly={isFieldInputOnly}
    />}
      {/* {modal && <ActivityEditor  activityId={}

    showComment = {true}
    fillTitleFromBody = {false}
  />} */}

  </>
    
  );
};
