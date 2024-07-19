import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { objectMetadataItemsState } from '@/object-metadata/states/objectMetadataItemsState';
import { getObjectSlug } from '@/object-metadata/utils/getObjectSlug';
import { navigationMemorizedUrlState } from '@/ui/navigation/states/navigationMemorizedUrlState';
import { useViewStates } from '@/views/hooks/internal/useViewStates';
import { FieldMetadataType } from '~/generated-metadata/graphql';
import { isDefined } from '~/utils/isDefined';

export const useGetAvailableFieldsForKanban = () => {
  const { viewObjectMetadataIdState } = useViewStates();

  const viewObjectMetadataId = useRecoilValue(viewObjectMetadataIdState);
  const objectMetadataItems = useRecoilValue(objectMetadataItemsState);
  const setNavigationMemorizedUrl = useSetRecoilState(
    navigationMemorizedUrlState,
  );
  const location = useLocation();

  const objectMetadataItem = objectMetadataItems.find(
    (objectMetadata) => objectMetadata.id === viewObjectMetadataId,
  );

  const availableFieldsForKanban =
    objectMetadataItem?.fields.filter(
      (field) => field.type === FieldMetadataType.Select,
    ) ?? [];

  const navigate = useNavigate();

  const navigateToSelectSettings = useCallback(() => {
    setNavigationMemorizedUrl(location.pathname + location.search);

    if (isDefined(objectMetadataItem?.namePlural)) {
      navigate(
        `/settings/objects/${getObjectSlug(
          objectMetadataItem,
        )}/new-field/step-2`,
      );
    } else {
      navigate(`/settings/objects`);
    }
  }, [
    setNavigationMemorizedUrl,
    location.pathname,
    location.search,
    objectMetadataItem,
    navigate,
  ]);

  return {
    availableFieldsForKanban,
    navigateToSelectSettings,
  };
};
