import { useRecoilValue } from 'recoil';
import { v4 } from 'uuid';

import { useFilterDropdown } from '@/object-record/object-filter-dropdown/hooks/useFilterDropdown';
import { InternalDatePicker } from '@/ui/input/components/internal/date/components/InternalDatePicker';
import { useState } from 'react';
import { isDefined } from '~/utils/isDefined';

export const ObjectFilterDropdownDateInput = () => {
  const [internalDate, setInternalDate] = useState<Date | null>(new Date());

  const {
    filterDefinitionUsedInDropdownState,
    selectedOperandInDropdownState,
    selectedFilterState,
    setIsObjectFilterDropdownUnfolded,
    selectFilter,
  } = useFilterDropdown();

  const filterDefinitionUsedInDropdown = useRecoilValue(
    filterDefinitionUsedInDropdownState,
  );
  const selectedOperandInDropdown = useRecoilValue(
    selectedOperandInDropdownState,
  );

  const selectedFilter = useRecoilValue(selectedFilterState);

  const handleChange = (date: Date | null) => {
    setInternalDate(date);

    if (!filterDefinitionUsedInDropdown || !selectedOperandInDropdown) return;
    selectFilter?.({
      id: selectedFilter?.id ? selectedFilter.id : v4(),
      fieldMetadataId: filterDefinitionUsedInDropdown.fieldMetadataId,
      value: isDefined(date) ? date.toISOString() : '',
      operand: selectedOperandInDropdown,
      displayValue: isDefined(date) ? date.toLocaleString() : '',
      definition: filterDefinitionUsedInDropdown,
    });

    setIsObjectFilterDropdownUnfolded(false);
  };

  return (
    <InternalDatePicker
      date={internalDate}
      onChange={handleChange}
      onMouseSelect={handleChange}
    />
  );
};
