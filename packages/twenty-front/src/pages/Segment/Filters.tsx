import styled from '@emotion/styled';
import { Button } from '@/ui/input/button/components/Button';
import { IconX } from '@tabler/icons-react';
import { Select } from '@/ui/input/components/Select';
import { TextInput } from '@/ui/input/components/TextInput';
import { filterLogicalOperators } from '~/pages/Segment/filterLogicalOperators';
import { filterOperators } from '~/pages/Segment/filterOperators';
import { filterFields } from '~/pages/Segment/filterFields';

const StyledComboInputContainer1 = styled.div`
  display: flex;
  width: 100%;
  padding-top: ${({ theme }) => theme.spacing(6)};
  justify-content: space-evenly;
`;

export type FilterProps = {
  filterDivs: string[];
  handleFilterRemove: (keyToRemove: string) => void;
  selectedFilterOptions: Record<string, string>;
  handleSelectChange: (key: string, value: string) => void;
};

export const Filters = ({
  filterDivs,
  handleFilterRemove,
  selectedFilterOptions,
  handleSelectChange,
}: FilterProps) => {
  return (
    <>
      {filterDivs.map((key) => (
        <div key={key}>
          <StyledComboInputContainer1>
            <Button Icon={IconX} onClick={() => handleFilterRemove(key)} />

            <Select
              fullWidth
              dropdownId={`conditions-${key}`}
              value={selectedFilterOptions[`${key}-conditions`] || ''}
              onChange={(value: string) =>
                handleSelectChange(`${key}-conditions`, value)
              }
              options={filterLogicalOperators}
            />
            <Select
              fullWidth
              dropdownId={`field-${key}`}
              value={selectedFilterOptions[`${key}-field`] || ''}
              onChange={(value: string) =>
                handleSelectChange(`${key}-field`, value)
              }
              options={filterFields}
            />

            <Select
              fullWidth
              dropdownId={`operators-${key}`}
              value={selectedFilterOptions[`${key}-operators`] || ''}
              onChange={(value: string) =>
                handleSelectChange(`${key}-operators`, value)
              }
              options={filterOperators}
            />

            <TextInput
              placeholder={
                selectedFilterOptions[`${key}-operators`] === '<> between'
                  ? 'Greater than'
                  : 'Value'
              }
              value={selectedFilterOptions[`${key}-value1`] || ''}
              onChange={(e) => handleSelectChange(`${key}-value1`, e)}
              name="value"
              required
              fullWidth
            />

            {selectedFilterOptions[`${key}-operators`] === '<> between' && (
              <TextInput
                placeholder={
                  selectedFilterOptions[`${key}-operators`] === '<> between'
                    ? 'Lesser than'
                    : 'Value'
                }
                value={selectedFilterOptions[`${key}-value2`] || ''}
                onChange={(e) => handleSelectChange(`${key}-value2`, e)}
                name="value"
                required
                fullWidth
              />
            )}
          </StyledComboInputContainer1>
        </div>
      ))}
    </>
  );
};
