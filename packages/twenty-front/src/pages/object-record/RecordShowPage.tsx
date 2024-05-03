import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { useIcons } from 'twenty-ui';

import { useFavorites } from '@/favorites/hooks/useFavorites';
import { useLabelIdentifierFieldMetadataItem } from '@/object-metadata/hooks/useLabelIdentifierFieldMetadataItem';
import { useObjectMetadataItem } from '@/object-metadata/hooks/useObjectMetadataItem';
import { useFindOneRecord } from '@/object-record/hooks/useFindOneRecord';
import { RecordShowContainer } from '@/object-record/record-show/components/RecordShowContainer';
import { findOneRecordForShowPageOperationSignatureFactory } from '@/object-record/record-show/graphql/operations/factories/findOneRecordForShowPageOperationSignatureFactory';
import { recordStoreFamilyState } from '@/object-record/record-store/states/recordStoreFamilyState';
import { PageBody } from '@/ui/layout/page/PageBody';
import { PageContainer } from '@/ui/layout/page/PageContainer';
import { PageFavoriteButton } from '@/ui/layout/page/PageFavoriteButton';
import { PageHeader } from '@/ui/layout/page/PageHeader';
import { ShowPageAddButton } from '@/ui/layout/show-page/components/ShowPageAddButton';
import { ShowPageMoreButton } from '@/ui/layout/show-page/components/ShowPageMoreButton';
import { PageTitle } from '@/ui/utilities/page-title/PageTitle';
import { FieldMetadataType } from '~/generated-metadata/graphql';
import { isDefined } from '~/utils/isDefined';
import { capitalize } from '~/utils/string/capitalize';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { ADD_TRIGGER_CAMPAIGN_RECORD } from '@/users/graphql/queries/addTriggerCampaignRecord';
import { GET_CAMPAIGN_LISTS } from '@/users/graphql/queries/getCampaignList';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useCampaign } from '~/pages/campaigns/CampaignUseContext';
import { ConfirmationModal } from '@/ui/layout/modal/components/ConfirmationModal';
import { RunCampaignButton } from '@/ui/layout/page/RunCampaignButton';
import { useDialogManager } from '@/ui/feedback/dialog-manager/hooks/useDialogManager';

export const RecordShowPage = () => {
  const { objectNameSingular, objectRecordId } = useParams<{
    objectNameSingular: string;
    objectRecordId: string;
  }>();

  if (!objectNameSingular) {
    throw new Error(`Object name is not defined`);
  }

  if (!objectRecordId) {
    throw new Error(`Record id is not defined`);
  }

  const { objectMetadataItem } = useObjectMetadataItem({
    objectNameSingular,
  });

  const { labelIdentifierFieldMetadataItem } =
    useLabelIdentifierFieldMetadataItem({
      objectNameSingular,
    });

  const { favorites, createFavorite, deleteFavorite } = useFavorites();

  const setEntityFields = useSetRecoilState(
    recordStoreFamilyState(objectRecordId),
  );

  const { getIcon } = useIcons();

  const headerIcon = getIcon(objectMetadataItem?.icon);

  const FIND_ONE_RECORD_FOR_SHOW_PAGE_OPERATION_SIGNATURE =
    findOneRecordForShowPageOperationSignatureFactory({ objectMetadataItem });

  const { record, loading } = useFindOneRecord({
    objectRecordId,
    objectNameSingular,
    recordGqlFields: FIND_ONE_RECORD_FOR_SHOW_PAGE_OPERATION_SIGNATURE.fields,
  });

  useEffect(() => {
    if (!record) return;
    setEntityFields(record);
  }, [record, setEntityFields]);

  const correspondingFavorite = favorites.find(
    (favorite) => favorite.recordId === objectRecordId,
  );

  const isFavorite = isDefined(correspondingFavorite);

  const handleFavoriteButtonClick = async () => {
    if (!objectNameSingular || !record) return;

    if (isFavorite && isDefined(record)) {
      deleteFavorite(correspondingFavorite.id);
    } else {
      createFavorite(record, objectNameSingular);
    }
  };

  let [selectedCampaign, { data: selectedCampaignData }] =
  useLazyQuery(GET_CAMPAIGN_LISTS);

useEffect(() => {
  const fetchData = async () => {
    try {
      const data = await selectedCampaign({
        variables: {
          filter: {
            id: { eq: objectRecordId },
          },
        },
      });
      const fetchedCampaigns = data?.data?.campaigns?.edges ?? [];
      setCampaigns(fetchedCampaigns);
    } catch (error) {
      console.error('Error fetching campaign:', error);
    }
  };

  fetchData();
}, [objectRecordId, selectedCampaign]);

const { campaignData, setCampaignData } = useCampaign();
const [campaigns, setCampaigns] = useState<any[]>([]);
const [addTriggerCampaignRecord] = useMutation(ADD_TRIGGER_CAMPAIGN_RECORD);
const { enqueueSnackBar } = useSnackBar();
const navigate = useNavigate();
const { enqueueDialog } = useDialogManager();
const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

const handleConfirmRun = async () => {
  try {
    const { data: addTriggerData } = await addTriggerCampaignRecord({
      variables: {
        input: {
          name: campaigns[0]?.node?.name,
          startDate: campaignData.startDate.toISOString(),
          stopDate: campaignData.endDate.toISOString(),
          status: 'ACTIVE',
          campaignId: campaigns[0]?.node?.id,
        },
      },
    });

    console.log(
      'Response from ADD_TRIGGER_CAMPAIGN_RECORD:',
      addTriggerData.createCampaignTrigger.id,
    );

    let requestBody: {
      campaignId: string;
      queryTimestamp: any;
      campaignTriggerId: any;
      startDate: any;
      stopDate: any;
      id: { selectedID: any } | { unselectedID: any };
    } = {
      campaignId: objectRecordId,
      queryTimestamp: campaignData.querystamp,
      campaignTriggerId: addTriggerData?.createCampaignTrigger?.id,
      startDate: campaignData.startDate,
      stopDate: campaignData.endDate,
      id: { selectedID: campaignData.selectedId },
    };

    if (campaignData.selectedId.length > campaignData.unSelectedId.length) {
      requestBody.id = { unselectedID: campaignData.unSelectedId };
    }

    console.log(requestBody, 'request body');

    const response = await fetch('http://localhost:3000/campaign/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    const data = await response.json();

    console.log('Response from the API:', data);
    enqueueSnackBar('Campaign added successfully', {
      variant: 'success',
    });
    navigate('/objects/campaignTriggers');
    window.location.reload();
  } catch (error) {
    console.error('Error in running campaign:', error);
    enqueueSnackBar('Campaign added successfully', {
      variant: 'error',
    });
  }
};

const handleRuncampaign = async () => {
  enqueueDialog({
    title: ' Are you sure you want to trigger this campaign?',
    message:
      'Triggering this campaign will send notifications to all subscribed users.',
    buttons: [
      { title: 'Cancel' },
      {
        title: 'Run',
        variant: 'primary',
        onClick: handleConfirmRun,
        role: 'confirm',
      },
    ],
  });
};



  const labelIdentifierFieldValue =
    record?.[labelIdentifierFieldMetadataItem?.name ?? ''];

  const pageName =
    labelIdentifierFieldMetadataItem?.type === FieldMetadataType.FullName
      ? [
          labelIdentifierFieldValue?.firstName,
          labelIdentifierFieldValue?.lastName,
        ].join(' ')
      : isDefined(labelIdentifierFieldValue)
        ? `${labelIdentifierFieldValue}`
        : '';

  const pageTitle = pageName.trim()
    ? `${pageName} - ${capitalize(objectNameSingular)}`
    : capitalize(objectNameSingular);

  return (
    <PageContainer>
      <PageTitle title={pageTitle} />
      <PageHeader
        title={pageName ?? ''}
        hasBackButton
        Icon={headerIcon}
        loading={loading}
      >
        {record && (
          <>
            <PageFavoriteButton
              isFavorite={isFavorite}
              onClick={handleFavoriteButtonClick}
            />
            <ShowPageAddButton
              key="add"
              activityTargetObject={{
                id: record.id,
                targetObjectNameSingular: objectMetadataItem?.nameSingular,
              }}
            />
            <ShowPageMoreButton
              key="more"
              recordId={record.id}
              objectNameSingular={objectNameSingular}
            />
          </>
        )}
                {record && objectNameSingular === 'campaign' && (
          <>
            <RunCampaignButton onClick={handleRuncampaign} />
          </>
        )}
      </PageHeader>

      {/* <ConfirmationModal
          confirmationPlaceholder={''}
          isOpen={isConfirmModalOpen}
          setIsOpen={setIsConfirmModalOpen}
          title="Run Campaign"
          subtitle={
            <>
              Are you sure you want to trigger this campaign? <br /> Triggering
              this campaign will send notifications to all subscribed users.
            </>
          }
          onConfirmClick={handleConfirmRun}
          deleteButtonText="Run Campaign"
        /> */}
      <PageBody>
        <RecordShowContainer
          objectNameSingular={objectNameSingular}
          objectRecordId={objectRecordId}
        />
      </PageBody>
    </PageContainer>
  );
};
