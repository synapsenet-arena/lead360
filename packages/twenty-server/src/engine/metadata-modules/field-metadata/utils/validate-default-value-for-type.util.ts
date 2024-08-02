import { plainToInstance } from 'class-transformer';
import { ValidationError, validateSync } from 'class-validator';

import {
  FieldMetadataClassValidation,
  FieldMetadataDefaultValue,
} from 'src/engine/metadata-modules/field-metadata/interfaces/field-metadata-default-value.interface';

import {
  FieldMetadataDefaultValueAddress,
  FieldMetadataDefaultValueBoolean,
  FieldMetadataDefaultValueCurrency,
  FieldMetadataDefaultValueDate,
  FieldMetadataDefaultValueDateTime,
  FieldMetadataDefaultValueFullName,
  FieldMetadataDefaultValueLink,
  FieldMetadataDefaultValueLinks,
  FieldMetadataDefaultValueNowFunction,
  FieldMetadataDefaultValueNumber,
  FieldMetadataDefaultValueRawJson,
  FieldMetadataDefaultValueString,
  FieldMetadataDefaultValueStringArray,
  FieldMetadataDefaultValueUuidFunction,
} from 'src/engine/metadata-modules/field-metadata/dtos/default-value.input';
import { FieldMetadataType } from 'src/engine/metadata-modules/field-metadata/field-metadata.entity';
import { isCompositeFieldMetadataType } from 'src/engine/metadata-modules/field-metadata/utils/is-composite-field-metadata-type.util';

export const defaultValueValidatorsMap = {
  [FieldMetadataType.UUID]: [
    FieldMetadataDefaultValueString,
    FieldMetadataDefaultValueUuidFunction,
  ],
  [FieldMetadataType.TEXT]: [FieldMetadataDefaultValueString],
  [FieldMetadataType.PHONE]: [FieldMetadataDefaultValueString],
  [FieldMetadataType.EMAIL]: [FieldMetadataDefaultValueString],
  [FieldMetadataType.DATE_TIME]: [
    FieldMetadataDefaultValueDateTime,
    FieldMetadataDefaultValueNowFunction,
  ],
  [FieldMetadataType.DATE]: [FieldMetadataDefaultValueDate],
  [FieldMetadataType.BOOLEAN]: [FieldMetadataDefaultValueBoolean],
  [FieldMetadataType.NUMBER]: [FieldMetadataDefaultValueNumber],
  [FieldMetadataType.NUMERIC]: [FieldMetadataDefaultValueString],
  [FieldMetadataType.LINK]: [FieldMetadataDefaultValueLink],
  [FieldMetadataType.CURRENCY]: [FieldMetadataDefaultValueCurrency],
  [FieldMetadataType.FULL_NAME]: [FieldMetadataDefaultValueFullName],
  [FieldMetadataType.RATING]: [FieldMetadataDefaultValueString],
  [FieldMetadataType.SELECT]: [FieldMetadataDefaultValueString],
  [FieldMetadataType.MULTI_SELECT]: [FieldMetadataDefaultValueStringArray],
  [FieldMetadataType.ADDRESS]: [FieldMetadataDefaultValueAddress],
  [FieldMetadataType.RICH_TEXT]: [FieldMetadataDefaultValueString],
  [FieldMetadataType.RAW_JSON]: [FieldMetadataDefaultValueRawJson],
  [FieldMetadataType.LINKS]: [FieldMetadataDefaultValueLinks],
};

type ValidationResult = {
  isValid: boolean;
  errors: ValidationError[];
};

export const validateDefaultValueForType = (
  type: FieldMetadataType,
  defaultValue: FieldMetadataDefaultValue,
): ValidationResult => {
  if (defaultValue === null) {
    return {
      isValid: true,
      errors: [],
    };
  }

  const validators = defaultValueValidatorsMap[type] as any[];

  if (!validators) {
    return {
      isValid: false,
      errors: [],
    };
  }

  const validationResults = validators.map((validator) => {
    const conputedDefaultValue = isCompositeFieldMetadataType(type)
      ? defaultValue
      : { value: defaultValue };

    const defaultValueInstance = plainToInstance<
      any,
      FieldMetadataClassValidation
    >(validator, conputedDefaultValue as FieldMetadataClassValidation);

    const errors = validateSync(defaultValueInstance, {
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    });

    const isValid = errors.length === 0;

    return {
      isValid,
      errors,
    };
  });

  const isValid = validationResults.some((result) => result.isValid);

  return {
    isValid,
    errors: validationResults.flatMap((result) => result.errors),
  };
};
