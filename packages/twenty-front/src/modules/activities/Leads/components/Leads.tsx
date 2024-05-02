import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { ActivityTargetableObject } from '@/activities/types/ActivityTargetableEntity';
import { GET_CAMPAIGN_LISTS } from '@/users/graphql/queries/getCampaignList';
import { GET_CAMPAIGN_TRIGGER } from '@/users/graphql/queries/getOneCampaignTrigger';
import { useLazyQuery } from '@apollo/client';
import { FILTER_LEADS } from '@/users/graphql/queries/filterLeads';
import { Checkbox } from '@/ui/input/components/Checkbox';
import { capitalize } from '~/utils/string/capitalize';
import { useCampaign } from '~/pages/campaigns/CampaignUseContext';
import { formatToHumanReadableDate } from '~/utils';
import { EllipsisDisplay } from '@/ui/field/display/components/EllipsisDisplay';
import { DateDisplay } from '@/ui/field/display/components/DateDisplay';
import { NumberDisplay } from '@/ui/field/display/components/NumberDisplay';
import { TextFieldDisplay } from '@/object-record/record-field/meta-types/display/components/TextFieldDisplay';
import { useGetIsSomeCellInEditModeState } from '@/object-record/record-table/hooks/internal/useGetIsSomeCellInEditMode';
import { useMoveSoftFocusToCurrentCellOnHover } from '@/object-record/record-table/record-table-cell/hooks/useMoveSoftFocusToCurrentCellOnHover';
import { isSoftFocusUsingMouseState } from '@/object-record/record-table/states/isSoftFocusUsingMouseState';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  IconRefresh,
  IconUser,
  IconListNumbers,
  IconLocation,
  IconBrandCampaignmonitor,
  IconDeviceTv,
  IconSpeakerphone,
  IconTextCaption,
  IconCalendar,
  IconNumbers,
} from '@tabler/icons-react';
import { IconButton } from '@/ui/input/button/components/IconButton';
import { TextDisplay } from '@/ui/field/display/components/TextDisplay';

const StyledInputCard = styled.div`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  height: auto%;
  justify-content: space-evenly;
  width: 100%;
`;

const StyledButtonContainer = styled.div`
  display: inline-flex;
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.spacing(2)};
`;

const StyledCountContainer = styled.div`
  display: flex;
  flex-direction: row;
  > * + * {
    margin-left: ${({ theme }) => theme.spacing(10)};
  }
  margin-top: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(6)};
  height: auto;
  justify-content: flex-start;
  width: 100%;
  align-items: center;
`;

const StyledTable = styled.table<{ cursorPointer: boolean }>`
  width: 100%;
  border-collapse: collapse;
  height: 10px;
  margin-bottom: ${({ theme }) => theme.spacing(6)};
  background-color: ${({ theme }) => theme.background.primary};
  cursor: ${({ cursorPointer }) => (cursorPointer ? 'pointer' : 'inherit')};
  font-family: inherit;
  font-size: inherit;

  font-weight: ${({ theme }) => theme.font.weight.regular};
  max-width: 100%;
  overflow: hidden;
  text-decoration: inherit;

  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StyledTableRow = styled.tr`
  &:nth-of-type(odd) {
    background-color: ${({ theme }) => theme.background.primary};
  }
`;

const StyledTableCell = styled.td`
  padding: 5px;
  height: 25px;
  border: 1px solid ${({ theme }) => theme.border.color.light};
  font-weight: ${({ theme }) => theme.font.weight.regular};
  &:hover {
    background-color: ${({ theme }) => theme.background.tertiary};
  }
`;

const StyledTableHeaderCell = styled.td`
  padding: 5px;
  border: 1px solid ${({ theme }) => theme.border.color.medium};
  height: 25px;
`;

const StyledComboInputContainer = styled.div`
  display: flex;
  align-items: center;
  > * + * {
    margin-left: ${({ theme }) => theme.spacing(2)};
  }
`;

const StyledContainer = styled.div`
  align-items: flex-start;
  align-self: stretch;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const StyledLabelContainer = styled.div`
  color: ${({ theme }) => theme.font.color.tertiary};
  width: auto;
`;

export const Leads = ({
  targetableObject,
}: {
  targetableObject: ActivityTargetableObject;
}) => {
  const fields = [
    { name: 'name', icon: IconUser },
    { name: 'age', icon: IconListNumbers },
    { name: 'location', icon: IconLocation },
    { name: 'advertisementSource', icon: IconBrandCampaignmonitor },
    { name: 'advertisementName', icon: IconDeviceTv },
    { name: 'campaignName', icon: IconSpeakerphone },
    { name: 'comments', icon: IconTextCaption },
    { name: 'createdAt', icon: IconCalendar },
  ];

  const [leadsData, setLeadsData] = useState<any | any[]>([]);
  const [totalLeadsCount, setTotalLeadsCount] = useState<number>(0);
  const [selectedRows, setSelectedRows] = useState<{ [key: string]: boolean }>(
    {},
  );
  const [pageSize, setPageSize] = useState(10);
  const [cursor, setCursor] = useState(null);
  const [unSelectedRows, setunSelectedRows] = useState<{
    [key: string]: boolean;
  }>({});
  const [masterCheckboxChecked, setMasterCheckboxChecked] = useState(true);

  const { campaignData, setCampaignData } = useCampaign();

  let [selectedCampaign, { data: selectedCampaignData }] =
    useLazyQuery(GET_CAMPAIGN_LISTS, {
      fetchPolicy: 'network-only',
    });

    let [selectedCampaignTrigger, { data: selectedCampaignTriggerData }] =
    useLazyQuery(GET_CAMPAIGN_TRIGGER, {
      fetchPolicy: 'network-only',
    });

  let [filterleads, { data: filterLeadsData }] = useLazyQuery(FILTER_LEADS, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      setLeadsData(data);
    },
  });

  useEffect(() => {
    if (leadsData.leads && leadsData.leads.edges) {
      const allLeadIds = leadsData.leads.edges.map(
        (leadEdge: any) => leadEdge.node.id,
      );
      const initialSelectedRows: { [key: string]: boolean } = {};
      const initialUnSelectedRows: { [key: string]: boolean } = {};
      allLeadIds.forEach((leadId: string) => {
        initialSelectedRows[leadId] = true;
      });
      setSelectedRows(initialSelectedRows);
      setunSelectedRows(initialUnSelectedRows);
    }
  }, [leadsData]);

  const handleCheckboxChange = (leadId: string) => {
    const updatedSelectedRows = { ...selectedRows };
    updatedSelectedRows[leadId] = !updatedSelectedRows[leadId];

    const updatedUnSelectedRows = { ...unSelectedRows };
    if (!updatedSelectedRows[leadId]) {
      updatedUnSelectedRows[leadId] = true;
      delete updatedSelectedRows[leadId];
    } else {
      delete updatedUnSelectedRows[leadId];
    }

    const selectedLeadIds = Object.keys(updatedSelectedRows);
    const unSelectedLeadIds = Object.keys(updatedUnSelectedRows);

    setCampaignData({
      ...campaignData,
      selectedId: selectedLeadIds,
      unSelectedId: unSelectedLeadIds,
    });

    setSelectedRows(updatedSelectedRows);
    setunSelectedRows(updatedUnSelectedRows);
  };

  const handleMasterCheckboxChange = () => {
    const updatedSelectedRows: { [key: string]: boolean } = {};
    const updatedUnSelectedRows: { [key: string]: boolean } = {};
    if (!masterCheckboxChecked) {
      leadsData?.leads?.edges.forEach((leadEdge: any) => {
        const lead = leadEdge?.node;
        updatedSelectedRows[lead.id] = true;
      });
    } else {
      leadsData?.leads?.edges.forEach((leadEdge: any) => {
        const lead = leadEdge?.node;
        updatedUnSelectedRows[lead.id] = true;
      });
    }

    const selectedLeadIds = Object.keys(updatedSelectedRows);
    const unSelectedLeadIds = Object.keys(updatedUnSelectedRows);

    setCampaignData({
      ...campaignData,
      selectedId: selectedLeadIds,
      unSelectedId: unSelectedLeadIds,
    });

    setSelectedRows(updatedSelectedRows);
    setunSelectedRows(updatedUnSelectedRows);
    setMasterCheckboxChecked(!masterCheckboxChecked);
  };
  let campaignId = "";

  const fetchLeads = async () => {
    try {
      if(targetableObject.targetObjectNameSingular === 'campaignTrigger'){
        const data = await selectedCampaignTrigger({
          variables: {
            objectRecordId: targetableObject.id ,
          },
        });

        campaignId = data.data.campaignTrigger.campaignId;
        console.log(campaignId, "campaignId")
      }
      else if(targetableObject.targetObjectNameSingular === 'campaign'){
        campaignId = targetableObject.id
      }

      const data = await selectedCampaign({
        variables: {
          filter: {
            id: { eq: campaignId },
          },
        },
      });

      const filter = JSON.parse(
        data.data.campaigns.edges[0].node.segment.filters,
      );

      const result = await filterleads({ variables: filter });
      const leadsCount = result.data?.leads?.totalCount || 0;
      setTotalLeadsCount(leadsCount);
      setLeadsData(result.data);
      const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const currentDate = formatToHumanReadableDate(new Date());
      const querystamp = `${currentDate} ${currentTime}`;
      setCampaignData({
        ...campaignData,
        querystamp: querystamp,
      });
    } catch (error) {
      console.error('Error fetching campaign segment filter:', error);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [targetableObject.id, selectedCampaign]);

  const handleLoadMore = () => {
    if (
      leadsData?.leads?.pageInfo?.hasNextPage &&
      leadsData?.leads?.pageInfo?.endCursor
    ) {
      setCursor(leadsData.leads.pageInfo.endCursor);
    }
  };
  return (
    <>
      <StyledButtonContainer>
        <IconButton
          variant="tertiary"
          Icon={IconRefresh}
          onClick={fetchLeads}
        />

        {leadsData?.leads?.pageInfo?.hasNextPage && (
          <StyledButtonContainer>
            <IconButton
              variant="tertiary"
              Icon={IconNumbers}
              onClick={handleLoadMore}
            />
          </StyledButtonContainer>
        )}
      </StyledButtonContainer>
      <StyledContainer>
        <StyledInputCard>
          {leadsData?.leads?.edges[0] && (
            <>
              <StyledCountContainer>
                <StyledComboInputContainer>
                  <StyledLabelContainer>
                    <EllipsisDisplay>Leads fetched at:</EllipsisDisplay>
                  </StyledLabelContainer>
                  <TextDisplay text={campaignData.querystamp} />
                </StyledComboInputContainer>
                <StyledComboInputContainer>
                  <StyledLabelContainer>
                    <EllipsisDisplay>Total Leads:</EllipsisDisplay>
                  </StyledLabelContainer>
                  <NumberDisplay value={totalLeadsCount} />{' '}
                </StyledComboInputContainer>

                <StyledComboInputContainer>
                  <StyledLabelContainer>
                    <EllipsisDisplay>Selected Leads:</EllipsisDisplay>
                  </StyledLabelContainer>
                  <NumberDisplay value={Object.keys(selectedRows).length} />
                </StyledComboInputContainer>

                <StyledComboInputContainer>
                  <StyledLabelContainer>
                    <EllipsisDisplay>Unselected Leads:</EllipsisDisplay>
                  </StyledLabelContainer>
                  <NumberDisplay value={Object.keys(unSelectedRows).length} />
                </StyledComboInputContainer>
              </StyledCountContainer>

              <StyledTable cursorPointer={true}>
                <tbody>
                  <StyledTableRow>
                    <StyledTableHeaderCell>
                      <Checkbox
                        checked={masterCheckboxChecked}
                        onChange={handleMasterCheckboxChange}
                      />
                    </StyledTableHeaderCell>

                    {fields.map(({ name, icon: Icon }) => (
                      <StyledTableHeaderCell key={name}>
                        <StyledLabelContainer>
                          {Icon && <Icon size={15} />}
                          {capitalize(name)}
                        </StyledLabelContainer>
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
                        {fields.map(({ name }) => (
                          <StyledTableCell key={name}>
                            <EllipsisDisplay>
                              {lead[name].toString()}
                            </EllipsisDisplay>
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
      </StyledContainer>
    </>
  );
};
