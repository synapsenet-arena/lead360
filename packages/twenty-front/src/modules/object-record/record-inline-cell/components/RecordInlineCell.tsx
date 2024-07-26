import { useContext } from 'react';
import { useIcons } from 'twenty-ui';

import { FieldDisplay } from '@/object-record/record-field/components/FieldDisplay';
import { FieldInput } from '@/object-record/record-field/components/FieldInput';
import { FieldContext } from '@/object-record/record-field/contexts/FieldContext';
import { FieldFocusContextProvider } from '@/object-record/record-field/contexts/FieldFocusContextProvider';
import { useGetButtonIcon } from '@/object-record/record-field/hooks/useGetButtonIcon';
import { useIsFieldInputOnly } from '@/object-record/record-field/hooks/useIsFieldInputOnly';
import { FieldInputEvent } from '@/object-record/record-field/types/FieldInputEvent';
import { isFieldRelation } from '@/object-record/record-field/types/guards/isFieldRelation';
import { RelationPickerHotkeyScope } from '@/object-record/relation-picker/types/RelationPickerHotkeyScope';

import { useInlineCell } from '../hooks/useInlineCell';

import { useOpenCreateActivityDrawer } from '@/activities/hooks/useOpenCreateActivityDrawer';
import { SnackBarVariant } from '@/ui/feedback/snack-bar-manager/components/SnackBar';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { RecordInlineCellContainer } from './RecordInlineCellContainer';

type RecordInlineCellProps = {
  readonly?: boolean;
  loading?: boolean;
  isCentered?: boolean;
};

// TODO: refactor props drilling with a RecordInlineCellContext
export const RecordInlineCell = ({
  readonly,
  loading,
  isCentered,
}: RecordInlineCellProps) => {
  const { fieldDefinition, entityId } = useContext(FieldContext);
  const buttonIcon = useGetButtonIcon();

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

  const handleCancel = () => {
    closeInlineCell();
  };

  const openCreateActivity = useOpenCreateActivityDrawer();
  const { enqueueSnackBar } = useSnackBar();
  const handleStageChange: FieldInputEvent = (persistField) => {
    persistField();
    closeInlineCell();
    const targetableObject: string = fieldDefinition.metadata
      .objectMetadataNameSingular
      ? fieldDefinition.metadata.objectMetadataNameSingular
      : '';
    openCreateActivity({
      type: 'Note',
      targetableObjects: [
        {
          id: entityId,
          targetObjectNameSingular: targetableObject,
        },
      ],
    });

    enqueueSnackBar('Please enter comments!', {
      variant: SnackBarVariant.Info,
    });
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

  const { getIcon } = useIcons();

  return (
    <>
      {fieldDefinition.metadata.fieldName !== 'stage' && (
        <FieldFocusContextProvider>
          <RecordInlineCellContainer
            readonly={readonly}
            buttonIcon={buttonIcon}
            customEditHotkeyScope={
              isFieldRelation(fieldDefinition)
                ? {
                    scope: RelationPickerHotkeyScope.RelationPicker,
                  }
                : undefined
            }
            IconLabel={
              fieldDefinition.iconName
                ? getIcon(fieldDefinition.iconName)
                : undefined
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
                isReadOnly={readonly}
              />
            }
            displayModeContent={<FieldDisplay />}
            isDisplayModeFixHeight
            editModeContentOnly={isFieldInputOnly}
            loading={loading}
            />
        </FieldFocusContextProvider>
      )}
      {fieldDefinition.metadata.fieldName === 'stage' && (
        <FieldFocusContextProvider>
          <RecordInlineCellContainer
            readonly={readonly}
            buttonIcon={buttonIcon}
            customEditHotkeyScope={
              isFieldRelation(fieldDefinition)
                ? {
                    scope: RelationPickerHotkeyScope.RelationPicker,
                  }
                : undefined
            }
            IconLabel={
              fieldDefinition.iconName
                ? getIcon(fieldDefinition.iconName)
                : undefined
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
                isReadOnly={readonly}
              />
            }
            displayModeContent={<FieldDisplay />}
            isDisplayModeFixHeight
            editModeContentOnly={isFieldInputOnly}
            loading={loading}
          />
        </FieldFocusContextProvider>
      )}
      ;
    </>
  );
};
