import { isNonEmptyString } from '@sniptt/guards';
import { useContext } from 'react';

import { PreComputedChipGeneratorsContext } from '@/object-metadata/context/PreComputedChipGeneratorsContext';
import { isFieldFullName } from '@/object-record/record-field/types/guards/isFieldFullName';
import { isFieldNumber } from '@/object-record/record-field/types/guards/isFieldNumber';
import { isFieldText } from '@/object-record/record-field/types/guards/isFieldText';
import { useRecordValue } from '@/object-record/record-store/contexts/RecordFieldValueSelectorContext';
import { isDefined } from '~/utils/isDefined';

import { FieldContext } from '../../contexts/FieldContext';

export const useChipFieldDisplay = () => {
  const { entityId, fieldDefinition, isLabelIdentifier } =
    useContext(FieldContext);

  const { chipGeneratorPerObjectPerField } = useContext(
    PreComputedChipGeneratorsContext,
  );

  if (!isDefined(chipGeneratorPerObjectPerField)) {
    throw new Error('Chip generator per object per field is not defined');
  }

  const objectNameSingular =
    isFieldText(fieldDefinition) ||
    isFieldFullName(fieldDefinition) ||
    isFieldNumber(fieldDefinition)
      ? fieldDefinition.metadata.objectMetadataNameSingular
      : undefined;

  const recordValue = useRecordValue(entityId);

  if (!isNonEmptyString(objectNameSingular)) {
    throw new Error('Object metadata name singular is not a non-empty string');
  }

  return {
    objectNameSingular,
    recordValue,
    isLabelIdentifier,
  };
};
