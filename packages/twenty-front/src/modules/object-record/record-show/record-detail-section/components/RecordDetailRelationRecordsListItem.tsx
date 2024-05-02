import { useContext } from 'react';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { LightIconButton, MenuItem } from 'tsup.ui.index';

import { useObjectMetadataItem } from '@/object-metadata/hooks/useObjectMetadataItem';
import { CoreObjectNameSingular } from '@/object-metadata/types/CoreObjectNameSingular';
import { RecordChip } from '@/object-record/components/RecordChip';
import { useDeleteOneRecord } from '@/object-record/hooks/useDeleteOneRecord.ts';
import { useUpdateOneRecord } from '@/object-record/hooks/useUpdateOneRecord';
import { FieldContext } from '@/object-record/record-field/contexts/FieldContext';
import { usePersistField } from '@/object-record/record-field/hooks/usePersistField';
import { FieldRelationMetadata } from '@/object-record/record-field/types/FieldMetadata';
import { RecordDetailRecordsListItem } from '@/object-record/record-show/record-detail-section/components/RecordDetailRecordsListItem';
import { ObjectRecord } from '@/object-record/types/ObjectRecord';
import {
  IconDotsVertical,
  IconEye,
  IconTrash,
  IconUnlink,
} from '@/ui/display/icon';
import { Dropdown } from '@/ui/layout/dropdown/components/Dropdown';
import { DropdownMenuItemsContainer } from '@/ui/layout/dropdown/components/DropdownMenuItemsContainer';
import { useDropdown } from '@/ui/layout/dropdown/hooks/useDropdown';
import { DropdownScope } from '@/ui/layout/dropdown/scopes/DropdownScope';
import { useParams } from 'react-router-dom';
import { useTabList } from '@/ui/layout/tab/hooks/useTabList';
import { TAB_LIST_COMPONENT_ID } from '@/ui/layout/show-page/components/ShowPageRightContainer';

const StyledListItem = styled(RecordDetailRecordsListItem)<{
  isDropdownOpen?: boolean;
}>`
  ${({ isDropdownOpen, theme }) =>
    !isDropdownOpen &&
    css`
      .displayOnHover {
        opacity: 0;
        pointer-events: none;
        transition: opacity ${theme.animation.duration.instant}s ease;
      }
    `}

  &:hover {
    .displayOnHover {
      opacity: 1;
      pointer-events: auto;
    }
  }
`;
type RecordDetailRelationRecordsListItemProps = {
  relationRecord: ObjectRecord;
};

export const RecordDetailRelationRecordsListItem = ({
  relationRecord,
}: RecordDetailRelationRecordsListItemProps) => {
  const { fieldDefinition } = useContext(FieldContext);
  const { objectNameSingular, objectRecordId } = useParams<{
    objectNameSingular: string;
    objectRecordId: string;
  }>();
  const { getActiveTabIdState, setActiveTabId } = useTabList(
    TAB_LIST_COMPONENT_ID,
  );
  const {
    relationFieldMetadataId,
    relationObjectMetadataNameSingular,
    relationType,
    objectMetadataNameSingular,
  } = fieldDefinition.metadata as FieldRelationMetadata;

  const isToOneObject = relationType === 'TO_ONE_OBJECT';
  const { objectMetadataItem: relationObjectMetadataItem } =
    useObjectMetadataItem({
      objectNameSingular: relationObjectMetadataNameSingular,
    });
  const persistField = usePersistField();
  const { updateOneRecord: updateOneRelationRecord } = useUpdateOneRecord({
    objectNameSingular: relationObjectMetadataNameSingular,
  });

  const { deleteOneRecord: deleteOneRelationRecord } = useDeleteOneRecord({
    objectNameSingular: relationObjectMetadataNameSingular,
  });

  const dropdownScopeId = `record-field-card-menu-${relationRecord.id}`;

  const { closeDropdown, isDropdownOpen } = useDropdown(dropdownScopeId);

  const handleDetach = () => {
    closeDropdown();

    const relationFieldMetadataItem = relationObjectMetadataItem.fields.find(
      ({ id }) => id === relationFieldMetadataId,
    );

    if (!relationFieldMetadataItem?.name) return;

    if (isToOneObject) {
      persistField(null);
      return;
    }

    updateOneRelationRecord({
      idToUpdate: relationRecord.id,
      updateOneRecordInput: {
        [relationFieldMetadataItem.name]: null,
      },
    });
  };

  const handleDelete = async () => {
    closeDropdown();
    await deleteOneRelationRecord(relationRecord.id);
  };

  const handleClick = () => {
    if (relationRecord.__typename == 'FormTemplate') {
      setActiveTabId('formTemplate');
    } else if (relationRecord.__typename == 'MessageTemplate') {
      setActiveTabId('messageTemplate');
    } else if (relationRecord.__typename == 'Segment') {
      setActiveTabId('leads');
    }
  };

  const isOpportunityCompanyRelation =
    (objectMetadataNameSingular === CoreObjectNameSingular.Opportunity &&
      relationObjectMetadataNameSingular === CoreObjectNameSingular.Company) ||
    (objectMetadataNameSingular === CoreObjectNameSingular.Company &&
      relationObjectMetadataNameSingular ===
        CoreObjectNameSingular.Opportunity);

  const isAccountOwnerRelation =
    relationObjectMetadataNameSingular ===
    CoreObjectNameSingular.WorkspaceMember;

  return (
    <StyledListItem isDropdownOpen={isDropdownOpen}>
      <RecordChip
        record={relationRecord}
        objectNameSingular={relationObjectMetadataItem.nameSingular}
      />
      {/* TODO: temporary to prevent removing a company from an opportunity */}
      {!isOpportunityCompanyRelation && (
        <>
          <DropdownScope dropdownScopeId={dropdownScopeId}>
            <Dropdown
              dropdownId={dropdownScopeId}
              dropdownPlacement="right-start"
              clickableComponent={
                <LightIconButton
                  className="displayOnHover"
                  Icon={IconDotsVertical}
                  accent="tertiary"
                />
              }
              dropdownComponents={
                <DropdownMenuItemsContainer>
                  <MenuItem
                    LeftIcon={IconUnlink}
                    text="Detach"
                    onClick={handleDetach}
                  />
                  {!isAccountOwnerRelation && (
                    <MenuItem
                      LeftIcon={IconTrash}
                      text="Delete"
                      accent="danger"
                      onClick={handleDelete}
                    />
                  )}
                </DropdownMenuItemsContainer>
              }
              dropdownHotkeyScope={{
                scope: dropdownScopeId,
              }}
            />
          </DropdownScope>
          {objectNameSingular == 'campaign' &&
            (relationRecord.__typename == 'FormTemplate' ||
              relationRecord.__typename == 'MessageTemplate' ||
              relationRecord.__typename == 'Segment') && (
              <LightIconButton
                className="displayOnHover"
                Icon={IconEye}
                accent="tertiary"
                onClick={handleClick}
              />
            )}
        </>
      )}
    </StyledListItem>
  );
};
