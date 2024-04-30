
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { useObjectMetadataItemForSettings } from '@/object-metadata/hooks/useObjectMetadataItemForSettings';
import { recordIndexViewTypeState } from '@/object-record/record-index/states/recordIndexViewTypeState';
import { useIcons } from '@/ui/display/icon/hooks/useIcons';
import { PageAddButton } from '@/ui/layout/page/PageAddButton';
import { PageHeader } from '@/ui/layout/page/PageHeader';
import { PageHotkeysEffect } from '@/ui/layout/page/PageHotkeysEffect';
import { ViewType } from '@/views/types/ViewType';
import { capitalize } from '~/utils/string/capitalize';

type RecordIndexPageHeaderProps = {
  createRecord: () => void;
};

export const RecordIndexPageHeader = ({
  createRecord,
}: RecordIndexPageHeaderProps) => {
  const objectNamePlural = useParams().objectNamePlural ?? '';

  const { findObjectMetadataItemByNamePlural } =
    useObjectMetadataItemForSettings();

  const { getIcon } = useIcons();
  const Icon = getIcon(
    findObjectMetadataItemByNamePlural(objectNamePlural)?.icon,
  );

  const recordIndexViewType = useRecoilValue(recordIndexViewTypeState);
  const navigate = useNavigate();

  const [page, setPage] = useState('');

  useEffect(() => {
    if (objectNamePlural === 'appointmentForms') {
      setPage('/templatelist');
    } else if (objectNamePlural === 'campaigns') {
      setPage('/campaigns');
    } else if (objectNamePlural === 'segments') {
      setPage('/segment');
    } else if (objectNamePlural === 'campaignTriggers') {
      setPage('/campaignTriggers');
    }
  });

  const handleClick = () => {
    if (page) {
      navigate(page);
    }
  };
  return (
    <PageHeader title={capitalize(objectNamePlural)} Icon={Icon}>
      <PageHotkeysEffect onAddButtonClick={createRecord} />
      {recordIndexViewType === ViewType.Table && (
          <PageAddButton onClick={!page ? createRecord : handleClick} />
        )}
    </PageHeader>
  );
};
