import { useNavigate, useParams } from 'react-router-dom';

import { TimelineActivityContext } from '@/activities/timelineActivities/contexts/TimelineActivityContext';
import { RecordShowContainer } from '@/object-record/record-show/components/RecordShowContainer';
import { useRecordShowPage } from '@/object-record/record-show/hooks/useRecordShowPage';
import { useRecordShowPagePagination } from '@/object-record/record-show/hooks/useRecordShowPagePagination';
import { RecordValueSetterEffect } from '@/object-record/record-store/components/RecordValueSetterEffect';
import { RecordFieldValueSelectorContextProvider } from '@/object-record/record-store/contexts/RecordFieldValueSelectorContext';
import { PageBody } from '@/ui/layout/page/PageBody';
import { PageContainer } from '@/ui/layout/page/PageContainer';
import { PageFavoriteButton } from '@/ui/layout/page/PageFavoriteButton';
import { PageHeader } from '@/ui/layout/page/PageHeader';
import { ShowPageAddButton } from '@/ui/layout/show-page/components/ShowPageAddButton';
import { ShowPageMoreButton } from '@/ui/layout/show-page/components/ShowPageMoreButton';
import { PageTitle } from '@/ui/utilities/page-title/PageTitle';
import { useLazyQuery, useMutation } from '@apollo/client';
import { GET_CAMPAIGN_LISTS } from '@/users/graphql/queries/getCampaignList';
import { useEffect, useState } from 'react';
import { useCampaign } from '../campaigns/CampaignUseContext';
import { useDialogManager } from '@/ui/feedback/dialog-manager/hooks/useDialogManager';
import { SnackBarVariant } from '@/ui/feedback/snack-bar-manager/components/SnackBar';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { ADD_TRIGGER_CAMPAIGN_RECORD } from '@/users/graphql/queries/addTriggerCampaignRecord';
import { RunCampaignButton } from '@/ui/layout/page/RunCampaignButton';

export const RecordShowPage = () => {
  const parameters = useParams<{
    objectNameSingular: string;
    objectRecordId: string;
  }>();

  const {
    objectNameSingular,
    objectRecordId,
    headerIcon,
    loading,
    pageTitle,
    pageName,
    isFavorite,
    handleFavoriteButtonClick,
    record,
    objectMetadataItem,
  } = useRecordShowPage(
    parameters.objectNameSingular ?? '',
    parameters.objectRecordId ?? '',
  );

  const {
    viewName,
    hasPreviousRecord,
    hasNextRecord,
    navigateToPreviousRecord,
    navigateToNextRecord,
    navigateToIndexView,
    isLoadingPagination,
  } = useRecordShowPagePagination(
    parameters.objectNameSingular ?? '',
    parameters.objectRecordId ?? '',
  );

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
      enqueueSnackBar('Campaign running successfully', {
        variant: SnackBarVariant.Success,
      });

      navigate(
        `/object/campaignTrigger/${addTriggerData?.createCampaignTrigger?.id}`,
      );
    } catch (error) {
      console.error('Error in running campaign:', error);
      enqueueSnackBar('Failed to run Campaign', {
        variant: SnackBarVariant.Error,
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


  return (
    <RecordFieldValueSelectorContextProvider>
      <RecordValueSetterEffect recordId={objectRecordId} />
      <PageContainer>
        <PageTitle title={pageTitle} />
        <PageHeader
          title={viewName}
          hasPaginationButtons
          hasClosePageButton
          onClosePage={navigateToIndexView}
          hasPreviousRecord={hasPreviousRecord}
          navigateToPreviousRecord={navigateToPreviousRecord}
          hasNextRecord={hasNextRecord}
          navigateToNextRecord={navigateToNextRecord}
          Icon={headerIcon}
          loading={loading || isLoadingPagination}
        >
          <>
            <PageFavoriteButton
              isFavorite={isFavorite}
              onClick={handleFavoriteButtonClick}
            />
            <ShowPageAddButton
              key="add"
              activityTargetObject={{
                id: record?.id ?? '0',
                targetObjectNameSingular: objectMetadataItem?.nameSingular,
              }}
            />
            <ShowPageMoreButton
              key="more"
              recordId={record?.id ?? '0'}
              objectNameSingular={objectNameSingular}
            />
          </>
          {record && objectNameSingular === 'campaign' && (
            <>
              <RunCampaignButton onClick={handleRuncampaign} />
            </>
          )}
        </PageHeader>
        <PageBody>
          <TimelineActivityContext.Provider
            value={{
              labelIdentifierValue: pageName,
            }}
          >
            <RecordShowContainer
              objectNameSingular={objectNameSingular}
              objectRecordId={objectRecordId}
              loading={loading}
            />
          </TimelineActivityContext.Provider>
        </PageBody>
      </PageContainer>
    </RecordFieldValueSelectorContextProvider>
  );
};