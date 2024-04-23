import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client'; // Import useQuery hook from @apollo/client
import { GET_CAMPAIGN_LISTS } from '@/users/graphql/queries/getCampaignList';
import { useColumnDefinitionsFromFieldMetadata } from '@/object-metadata/hooks/useColumnDefinitionsFromFieldMetadata';
import { useObjectMetadataItem } from '@/object-metadata/hooks/useObjectMetadataItem';
import { useRecordActionBar } from '@/object-record/record-action-bar/hooks/useRecordActionBar';
import { useRecordTable } from '@/object-record/record-table/hooks/useRecordTable';
import { useViewBar } from '@/views/hooks/useViewBar';
import { ModalWrapper } from '@/spreadsheet-import/components/ModalWrapper';
import styled from '@emotion/styled';
import { GRAY_SCALE } from '@/ui/theme/constants/GrayScale';
import { Section } from '@/ui/layout/section/components/Section';
import {
  Checkbox,
  CheckboxShape,
  CheckboxSize,
  CheckboxVariant,
} from '@/ui/input/components/Checkbox';
import { IconCalendar } from '@/ui/display/icon';
import DateTimePicker from '@/ui/input/components/internal/date/components/DateTimePicker';
import { Button } from '@/ui/input/button/components/Button';
import { FILTER_LEADS } from '@/users/graphql/queries/filterLeads';
import { capitalize } from '~/utils/string/capitalize';
import { ModalWrapper1 } from '@/spreadsheet-import/components/ModalWrapper1';
import { ADD_TRIGGER_CAMPAIGN_RECORD } from '@/users/graphql/queries/addTriggerCampaignRecord';
import { UPDATE_CAMPAIGNLIST_STATUS } from '@/users/graphql/queries/updateCampaignlistStatus';
import { UPDATE_LAST_EXECUTION_ID } from '@/users/graphql/queries/updateLastExecutionId';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { useNavigate } from 'react-router-dom';
import { CustomPath } from '@/types/CustomPath';

type RecordIndexTableContainerEffectProps = {
  objectNameSingular: string;
  recordTableId: string;
  viewBarId: string;
};

export const RecordIndexTableContainerEffect = ({
  objectNameSingular,
  recordTableId,
  viewBarId,
}: RecordIndexTableContainerEffectProps) => {
  const {
    setAvailableTableColumns,
    setOnEntityCountChange,
    resetTableRowSelection,
    getSelectedRowIdsSelector,
  } = useRecordTable({
    recordTableId,
  });

  const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    overflow: scroll;
  `;

  const StyledTitle1 = styled.div`
    color: ${({ theme }) => theme.font.color.primary};
    font-weight: ${({ theme }) => theme.font.weight.semiBold};
    font-size: 2.5em;
    text-decoration: underline;
  `;

  const StyledTitle2 = styled.div`
    color: ${({ theme }) => theme.font.color.primary};
    font-weight: ${({ theme }) => theme.font.weight.semiBold};
    font-size: 2em;
    margin-top: ${({ theme }) => theme.spacing(4)};
    margin-bottom: ${({ theme }) => theme.spacing(3)};
  `;

  const StyledTitle3 = styled.div`
    align-items: center;
    color: ${({ theme }) => theme.font.color.primary};
    display: flex;
    font-size: 1.6em;
    font-weight: ${({ theme }) =>
      theme.font.weight.semiBold}; /* Center horizontally */
    // height: 100%; /* Center vertically */
    justify-content: center; /* Ensure full height */
  `;

  const StyledButton = styled.span`
    display: flex;
    justify-content: space-between;
    margin-top: ${({ theme }) => theme.spacing(10)};
    width: 100%;
  `;

  const StyledTimerHeader = styled.span`
    gap: 15px;
    width: 100%;
    margin-right: ${({ theme }) => theme.spacing(4)};
    margin-left: ${({ theme }) => theme.spacing(4)};
    justify-content: center;
  `;

  const StyledCheckboxContainer = styled.div`
    display: flex;
    align-items: center;
    margin: ${({ theme }) => theme.spacing(2)};
  `;

  const StyledTitleBar = styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: ${({ theme }) => theme.spacing(10)};
    margin-top: ${({ theme }) => theme.spacing(4)};
    place-items: center;
    width: 100%;
  `;

  const StyledLabel = styled.span`
    align-items: center;
    align-items: center;
    box-shadow: none;
    color: ${GRAY_SCALE.gray40};
    display: flex;
    font-size: medium;
    height: 32px;
    justify-content: center;
    margin-left: ${({ theme }) => theme.spacing(8)};
    padding-left: ${({ theme }) => theme.spacing(2)};
  `;

  const StyledInputCard = styled.div`
    align-items: center;
    color: ${({ theme }) => theme.font.color.secondary};
    display: flex;
    flex-direction: column;
    height: auto%;
    justify-content: space-evenly;
    width: 100%;
  `;

  const StyledCampaignInfoCard = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    background: ${({ theme }) => theme.background.secondary};
    border: 1px solid ${({ theme }) => theme.border.color.inverted};
    border-radius: ${({ theme }) => theme.border.radius.md};
    padding: ${({ theme }) => theme.spacing(2)};
    margin-bottom: ${({ theme }) => theme.spacing(4)};
    width: 90%;
  `;

  const StyledCountContainer = styled.div`
    display: flex;
    flex-direction: row;
    > * + * {
      margin-left: ${({ theme }) => theme.spacing(10)};
    }
    height: auto;
    justify-content: flex-start;
    width: 100%;
    align-items: center;
  `;

  const StyledModalInputCard = styled.div`
    color: ${({ theme }) => theme.font.color.secondary};
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    width: 100%;
    align-items: center;
    margin-top: ${({ theme }) => theme.spacing(4)};
  `;

  const StyledCampaignInfoCard2 = styled.div`
    align-items: flex-start;
    background: ${({ theme }) =>
      theme.background.primary}; /* Use the same background */
    border: 1px solid ${({ theme }) => theme.border.color.secondaryInverted}; /* Use the same border */
    border-radius: ${({ theme }) => theme.border.radius.md};
    display: flex;
    flex-direction: column;
    padding: ${({ theme }) => theme.spacing(2)};
    margin-bottom: ${({ theme }) => theme.spacing(4)};
    width: 90%; /* Use the same width */
  `;

  const StyledTitleTextContainer = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: ${({ theme }) => theme.spacing(1)};
  `;

  const StyledTitleText = styled.span`
    color: ${({ theme }) => theme.font.color.secondary};
    font-weight: ${({ theme }) => theme.font.weight.medium};
    min-width: 150px;
    margin-right: ${({ theme }) => theme.spacing(2)};
    font-size: 1.4em;
  `;

  const StyledText = styled.div`
    color: ${({ theme }) => theme.font.color.secondary};
  `;

  const StyledTable = styled.table`
    border-collapse: collapse;
    height: 10px;
    width: 100%;
  `;

  const StyledTableRow = styled.tr`
    background-color: ${({ theme }) => theme.background.primary};
    &:hover {
      background-color: ${({ theme }) => theme.background.tertiary};
      cursor: pointer;
    }
  `;

  const StyledTableCell = styled.td`
    padding: 5px;
    font-size: ${({ theme }) => theme.font.size.md};
    height: 25px;
    border: 1px solid ${({ theme }) => theme.border.color.medium};
  `;

  const StyledTableHeaderCell = styled.td`
    padding: 5px;
    border: 1px solid ${({ theme }) => theme.border.color.medium};
    font-size: ${({ theme }) => theme.font.size.md};
    height: 25px;
    font-weight: ${({ theme }) => theme.font.weight.semiBold};
  `;

  const StyledComboInputContainer = styled.div`
    display: flex;
    flex-direction: row;
    > * + * {
      margin-left: ${({ theme }) => theme.spacing(4)};
    }
  `;

  const { objectMetadataItem } = useObjectMetadataItem({
    objectNameSingular,
  });

  const { columnDefinitions } =
    useColumnDefinitionsFromFieldMetadata(objectMetadataItem);

  const { setEntityCountInCurrentView } = useViewBar({
    viewBarId,
  });

  useEffect(() => {
    setAvailableTableColumns(columnDefinitions);
  }, [columnDefinitions, setAvailableTableColumns]);

  const selectedRowIds = useRecoilValue(getSelectedRowIdsSelector());

  const {
    setActionBarEntries,
    setContextMenuEntries,
    runCampaignCallback,
    runCallback,
  } = useRecordActionBar({
    objectMetadataItem,
    selectedRecordIds: selectedRowIds,
  });

  useEffect(() => {
    setActionBarEntries?.();
    setContextMenuEntries?.();
  }, [setActionBarEntries, setContextMenuEntries]);

  useEffect(() => {
    setOnEntityCountChange(
      () => (entityCount: number) => setEntityCountInCurrentView(entityCount),
    );
  }, [setEntityCountInCurrentView, setOnEntityCountChange]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showStartDateTimePicker, setShowStartDateTimePicker] = useState(false);
  const [showStopDateTimePicker, setShowStopDateTimePicker] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [stopDate, setStopDate] = useState<Date | null>(null);
  const [leadsData, setLeadsData] = useState<any | any[]>([]);
  const [totalLeadsCount, setTotalLeadsCount] = useState<number>(0);
  const [updateCampaignListStatus] = useMutation(UPDATE_CAMPAIGNLIST_STATUS);
  const [addTriggerCampaignRecord] = useMutation(ADD_TRIGGER_CAMPAIGN_RECORD);
  const [updateExecutionID] = useMutation(UPDATE_LAST_EXECUTION_ID);
  const [queryTimeStamp, setQueryTimeStamp] = useState<Date | null>(null);
  const [masterCheckboxChecked, setMasterCheckboxChecked] = useState(true);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const { enqueueSnackBar } = useSnackBar();
  const navigate = useNavigate();

  const fields = [
    'name',
    'age',
    'location',
    'advertisementSource',
    'advertisementName',
    'campaignName',
    'comments',
    'createdAt',
  ];

  let [selectedCampaign, { data: selectedCampaignData }] =
    useLazyQuery(GET_CAMPAIGN_LISTS);

  let [filterleads, { data: filterLeadsData }] = useLazyQuery(FILTER_LEADS, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      setLeadsData(data);
    },
  });

  const [selectedRows, setSelectedRows] = useState<{ [key: string]: boolean }>(
    {},
  );

  const [unSelectedRows, setunSelectedRows] = useState<{
    [key: string]: boolean;
  }>({});

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCampaigns([]);
    setLeadsData([]);
    filterLeadsData = [];
    setSelectedRows({});
    setunSelectedRows({});
  };

  useEffect(() => {
    if (filterLeadsData?.leads?.edges) {
      const initialSelectedRows: { [key: string]: boolean } = {};
      filterLeadsData.leads.edges.forEach((leadEdge: any) => {
        const lead = leadEdge?.node;
        initialSelectedRows[lead.id] = true;
      });
      setSelectedRows(initialSelectedRows);
    }
  }, [filterLeadsData]);

  const handleRunCampaign = async () => {
    try {
      const campaignExecutionID = `${campaigns[0]?.campaigns?.edges[0]?.node
        ?.id}-${new Date().toISOString()}`;

      const selectedLeadIds = Object.keys(selectedRows).filter(
        (leadId) => selectedRows[leadId],
      );
      const unSelectedLeadIds = Object.keys(unSelectedRows).filter(
        (leadId) => unSelectedRows[leadId],
      );

      let idsToSend: any[] = [];
      let idType: 'selected' | 'unselected';

      if (selectedLeadIds.length < unSelectedLeadIds.length) {
        idType = 'selected';
        idsToSend = selectedLeadIds.map((leadId) => ({ id: leadId }));
      } else {
        idType = 'unselected';
        idsToSend = unSelectedLeadIds.map((leadId) => ({ id: leadId }));
      }

      let startDateToSend: string | undefined;
      let stopDateToSend: string | undefined;

      if (startDate) {
        startDateToSend = startDate.toISOString();
      } else {
        startDateToSend = new Date().toISOString();
      }

      if (stopDate) {
        stopDateToSend = stopDate.toISOString();
      } else {
        stopDateToSend = new Date().toISOString();
      }

      const { data: addTriggerData } = await addTriggerCampaignRecord({
        variables: {
          input: {
            name: campaigns[0]?.campaigns?.edges[0]?.node?.name,
            executionId: campaignExecutionID,
            startDate: startDate
              ? startDate.toISOString()
              : new Date().toISOString(),
            stopDate: stopDate
              ? stopDate.toISOString()
              : new Date().toISOString(),
            status: 'ACTIVE',
            campaignId: campaigns[0]?.campaigns?.edges[0]?.node?.id,
          },
        },
      });

      const { data: updateData } = await updateCampaignListStatus({
        variables: {
          idToUpdate: campaigns[0]?.campaigns?.edges[0]?.node?.id,
          input: {
            status: 'ACTIVE',
          },
        },
      });
      console.log(
        'Response from ADD_TRIGGER_CAMPAIGN_RECORD:',
        addTriggerData.createCampaignTrigger.id,
      );
      console.log('Response from UPDATE_CAMPAIGN_STATUS:', updateData);

      const requestBody = {
        campaignId: campaigns[0]?.campaigns?.edges[0]?.node?.id,
        queryTimestamp: queryTimeStamp,
        id: {
          [idType]: idsToSend,
        },
        campaignTriggerId: addTriggerData?.createCampaignTrigger?.id,
        startDate: startDateToSend,
        stopDate: stopDateToSend,
      };

      console.log('Request Body:', requestBody);

      // Now you can send the requestBody to your endpoint
      // const response = await fetch('someEndpointURL', {
      // method: 'POST',
      // headers: {
      // 'Content-Type': 'application/json',
      // },
      // body: JSON.stringify(requestBody),
      // });
      // const data = await response.json();

      // console.log('Response from the API:', data);
      const response = true;

      if (response) {
        setConfirmModalOpen(false);
        setIsModalOpen(false);
      }
      navigate(CustomPath.CampaignTriggersPage);
      enqueueSnackBar('Campaign running successfully', {
        variant: 'success',
      });
    } catch (error) {
      console.log('Error in triggering campaign', error);
    }
  };

  const handleDisplayLeads = async () => {
    try {
      console.log(
        campaigns[0]?.campaigns?.edges[0]?.node?.segment?.filters,
        'segmentfilters',
      );

      const segmentFilters = JSON.parse(
        campaigns[0]?.campaigns?.edges[0]?.node?.segment?.filters,
      );
      const response = await filterleads({ variables: segmentFilters });
      const leadsCount = response.data?.leads?.totalCount || 0;
      setTotalLeadsCount(leadsCount);
      console.log('Data from the filters fetched:', response.data);
      setQueryTimeStamp(new Date());
      console.log('Timestamp: ', queryTimeStamp?.toString());
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleCheckboxChange = (leadId: string) => {
    const updatedSelectedRows = { ...selectedRows };
    const updatedUnSelectedRows = { ...unSelectedRows };

    updatedSelectedRows[leadId] = !updatedSelectedRows[leadId];

    if (updatedSelectedRows[leadId]) {
      delete updatedUnSelectedRows[leadId];
    } else {
      delete updatedSelectedRows[leadId];
      updatedUnSelectedRows[leadId] = true;
    }

    setSelectedRows(updatedSelectedRows);
    setunSelectedRows(updatedUnSelectedRows);

    const selectedCount = Object.keys(updatedSelectedRows).length;
    const unSelectedCount = Object.keys(updatedUnSelectedRows).length;

    setMasterCheckboxChecked(selectedCount === leadsData?.leads?.edges.length);
    setTotalLeadsCount(selectedCount + unSelectedCount);
  };

  const handleMasterCheckboxChange = () => {
    const updatedSelectedRows: { [key: string]: boolean } = {};
    if (!masterCheckboxChecked) {
      leadsData?.leads?.edges.forEach((leadEdge: any) => {
        const lead = leadEdge?.node;
        updatedSelectedRows[lead.id] = true;
      });
    }
    setSelectedRows(updatedSelectedRows);
    setMasterCheckboxChecked(!masterCheckboxChecked);
  };

  const openConfirmModal = () => {
    setConfirmModalOpen(true);
  };

  const cancelRunCampaign = () => {
    setConfirmModalOpen(false);
  };

  const confirmRunCampaign = () => {
    handleRunCampaign();
  };


  useEffect(() => {
    const fetchSelectedCampaign = async () => {
      if (selectedRowIds.length === 1 && runCampaignCallback()) {
        try {
          const data = await selectedCampaign({
            variables: {
              filter: {
                id: { eq: selectedRowIds[0] },
              },
            },
          });
          setCampaigns([data.data]); 
          console.log('Fetched campaign:', campaigns);
          setIsModalOpen(true);
        } catch (error) {
          console.error('Error fetching campaign:', error);
        }
      }
    };

    fetchSelectedCampaign();
  }, [selectedRowIds, runCampaignCallback, selectedCampaign]);
  

  return (
    <>
      {isModalOpen && (
        <ModalWrapper isOpen={isModalOpen} onClose={handleCloseModal}>
          <StyledInputCard>
            <StyledTitleBar>
              <StyledTitle1>Run Campaign</StyledTitle1>
            </StyledTitleBar>
            <StyledCampaignInfoCard>
              <StyledTitleTextContainer>
                <StyledTitleText>Campaign Name:</StyledTitleText>
                <StyledText>
                  {campaigns[0]?.campaigns?.edges[0]?.node?.name}
                </StyledText>
              </StyledTitleTextContainer>
              <StyledTitleTextContainer>
                <StyledTitleText>Segment Name:</StyledTitleText>
                <StyledText>
                  {campaigns[0]?.campaigns?.edges[0]?.node?.segment?.name}
                </StyledText>
              </StyledTitleTextContainer>
              <StyledTitleTextContainer>
                <StyledTitleText>Description:</StyledTitleText>
                <StyledText>
                  {campaigns[0]?.campaigns?.edges[0]?.node?.description}
                </StyledText>
              </StyledTitleTextContainer>
              <StyledTitleTextContainer>
                <StyledTitleText>Specialty:</StyledTitleText>
                <StyledText>
                  {' '}
                  {campaigns[0]?.campaigns?.edges[0]?.node?.specialty}
                </StyledText>
              </StyledTitleTextContainer>
              <StyledTitleTextContainer>
                <StyledTitleText>Sub Specialty:</StyledTitleText>
                <StyledText>
                  {' '}
                  {campaigns[0]?.campaigns?.edges[0]?.node?.subspecialty}
                </StyledText>
              </StyledTitleTextContainer>
              <StyledTitleTextContainer>
                <StyledTitleText>Message Template:</StyledTitleText>
                <StyledText>
                  {
                    campaigns[0]?.campaigns?.edges[0]?.node?.messageTemplate
                      ?.name
                  }
                </StyledText>
              </StyledTitleTextContainer>
              <StyledTitleTextContainer>
                <StyledTitleText>Form Template:</StyledTitleText>
                <StyledText>
                  {campaigns[0]?.campaigns?.edges[0]?.node?.formTemplate?.name}
                </StyledText>
              </StyledTitleTextContainer>
            </StyledCampaignInfoCard>

            <StyledCampaignInfoCard>
              <StyledInputCard>
                <StyledTitle2>Campaign Scheduling</StyledTitle2>
                  <StyledTimerHeader>
                      <StyledTitle3>Start</StyledTitle3>
                      <Section>
                        <StyledInputCard>
                          <StyledCampaignInfoCard2>
                            <StyledCheckboxContainer>
                              <Checkbox
                                checked={false}
                                indeterminate={false}
                                variant={CheckboxVariant.Primary}
                                size={CheckboxSize.Small}
                                shape={CheckboxShape.Squared}
                              />
                              <StyledLabel>Immediately</StyledLabel>
                            </StyledCheckboxContainer>
                            <StyledCheckboxContainer>
                              <Checkbox
                                checked={showStartDateTimePicker}
                                onChange={() =>
                                  setShowStartDateTimePicker(
                                    !showStartDateTimePicker,
                                  )
                                }
                                indeterminate={false}
                                variant={CheckboxVariant.Primary}
                                size={CheckboxSize.Small}
                                shape={CheckboxShape.Squared}
                              />
                              <StyledLabel>
                                Start Date/Time <IconCalendar />
                              </StyledLabel>
                              {showStartDateTimePicker && (
                                <DateTimePicker
                                  onChange={(selectedDate) =>
                                    setStartDate(selectedDate)
                                  }
                                  minDate={new Date()}
                                  value={undefined}
                                />
                              )}
                            </StyledCheckboxContainer>
                          </StyledCampaignInfoCard2>
                        </StyledInputCard>
                      </Section>

                      <StyledTitle3>Stop</StyledTitle3>
                      <Section>
                        <StyledInputCard>
                          <StyledCampaignInfoCard2>
                            <StyledCheckboxContainer>
                              <Checkbox
                                checked={showStopDateTimePicker}
                                onChange={() =>
                                  setShowStopDateTimePicker(
                                    !showStopDateTimePicker,
                                  )
                                }
                                indeterminate={false}
                                variant={CheckboxVariant.Primary}
                                size={CheckboxSize.Small}
                                shape={CheckboxShape.Squared}
                              />
                              <StyledLabel>
                                Stop Date/Time <IconCalendar />
                              </StyledLabel>
                              {showStopDateTimePicker && (
                                <DateTimePicker
                                  onChange={(selectedDate) => setStopDate(selectedDate)}
                                  minDate={new Date()} value={undefined}                                />
                              )}
                            </StyledCheckboxContainer>
                          </StyledCampaignInfoCard2>
                        </StyledInputCard>
                      </Section>
                  </StyledTimerHeader>
                
              </StyledInputCard>
            </StyledCampaignInfoCard>


            <StyledButton>
              <Button
                title="Display Segment Leads"
                variant="primary"
                accent="default"
                onClick={handleDisplayLeads}
              />
              <Button
                title="Run Campaign"
                variant="primary"
                accent="dark"
                onClick={openConfirmModal}
              />
            </StyledButton>
            <StyledInputCard>
              {leadsData?.leads?.edges[0] && (
                <>
                  <StyledCountContainer>
                    <StyledTitleText>
                      Leads fetched at: {queryTimeStamp?.toLocaleString()}
                    </StyledTitleText>
                    <StyledTitleText>
                      Total Leads: {totalLeadsCount}
                    </StyledTitleText>
                    <StyledTitleText>
                      Selected Leads: {Object.keys(selectedRows).length}
                    </StyledTitleText>
                    <StyledTitleText>
                      Unselected Leads: {Object.keys(unSelectedRows).length}
                    </StyledTitleText>
                  </StyledCountContainer>
                  <StyledTable>
                    <tbody>
                      <StyledTableRow>
                        <StyledTableHeaderCell>
                          <StyledComboInputContainer>
                            <Checkbox
                              checked={masterCheckboxChecked}
                              onChange={handleMasterCheckboxChange}
                            />
                            <p>Select</p>
                          </StyledComboInputContainer>
                        </StyledTableHeaderCell>
                        {fields.map((field: string) => (
                          <StyledTableHeaderCell key={field}>
                            {capitalize(field)}
                          </StyledTableHeaderCell>
                        ))}
                      </StyledTableRow>
                      {leadsData?.leads?.edges.map((leadEdge: any) => {
                        const lead = leadEdge?.node;
                        return (
                          <StyledTableRow
                            key={lead.id}
                            onClick={() => handleCheckboxChange(lead.id)}
                          >
                            <StyledTableCell>
                              <Checkbox
                                checked={selectedRows[lead.id]}
                                onChange={() => handleCheckboxChange(lead.id)}
                              />
                            </StyledTableCell>
                            {fields.map((field: string) => (
                              <StyledTableCell key={field}>
                                {lead[field]}
                              </StyledTableCell>
                            ))}
                          </StyledTableRow>
                        );
                      })}
                    </tbody>
                  </StyledTable>
                </>
              )}
            </StyledInputCard>
          </StyledInputCard>
          <ModalWrapper1 isOpen={confirmModalOpen} onClose={cancelRunCampaign}>
            <StyledModalInputCard>
              <StyledModalInputCard>
                <StyledText>
                  Are you sure you want to run the campaign?
                </StyledText>
              </StyledModalInputCard>
              <StyledModalInputCard>
                <StyledComboInputContainer>
                  <StyledButton>
                    <Button
                      title="Confirm"
                      variant="primary"
                      accent="dark"
                      onClick={confirmRunCampaign}
                    />
                    <Button
                      title="Cancel"
                      variant="primary"
                      accent="danger"
                      onClick={cancelRunCampaign}
                    />
                  </StyledButton>
                </StyledComboInputContainer>
              </StyledModalInputCard>
            </StyledModalInputCard>
          </ModalWrapper1>
        </ModalWrapper>
      )}
    </>
  );
};
