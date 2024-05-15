import styled from '@emotion/styled';
import { Section } from '@react-email/components';
import { Button } from '@/ui/input/button/components/Button';
import { useMutation } from '@apollo/client';
import { v4 as uuidv4 } from 'uuid';
import {
  IconPlayerPlay,
  IconPlus,
  IconUsersGroup,
  IconX,
} from '@tabler/icons-react';
import { H2Title } from '@/ui/display/typography/components/H2Title';
import { useEffect, useRef, useState } from 'react';
import { PageHeader } from '@/ui/layout/page/PageHeader';
import { useLazyQuery } from '@apollo/client';
import { FILTER_LEADS } from '@/users/graphql/queries/filterLeads';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { ADD_SEGMENT } from '@/users/graphql/queries/addSegment';
import { useNavigate } from 'react-router-dom';
import { Select } from '@/ui/input/components/Select';
import { TextArea } from '@/ui/input/components/TextArea';
import { TextInput } from '@/ui/input/components/TextInput';
import { EllipsisDisplay } from '@/ui/field/display/components/EllipsisDisplay';
import { DateTimeDisplay } from '@/ui/field/display/components/DateTimeDisplay';
import { NumberDisplay } from '@/ui/field/display/components/NumberDisplay';
import { GRAY_SCALE } from 'twenty-ui';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-y: scroll;
  scrollbar-color: ${({ theme }) => theme.border.color.strong};
  scrollbar-width: thin;
  *::-webkit-scrollbar {
    height: 8px;
    width: 8px;
  }

  *::-webkit-scrollbar-corner {
    background-color: transparent;
  }

  *::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.border.color.strong};
    border-radius: ${({ theme }) => theme.border.radius.sm};
  }
`;

const StyledBoardContainer = styled.div`
  display: flex;
  width: 100%;
  height: auto;
  flex-direction: column;
  justify-content: flex-start;
  background: ${({ theme }) => theme.background.noisy};
  padding: ${({ theme }) => theme.spacing(2)};
`;

const StyledInputCard = styled.div`
  color: ${({ theme }) => theme.font.color.secondary};
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: auto;
  justify-content: space-between;
  width: 70%;
  align-items: center;
`;

const SytledHR = styled.hr`
  background: ${GRAY_SCALE.gray0};
  color: ${GRAY_SCALE.gray0};
  bordercolor: ${GRAY_SCALE.gray0};
  height: 0.2px;
  width: 100%;
  margin: ${({ theme }) => theme.spacing(10)};
`;

const StyledButton = styled.span`
  display: flex;
  gap: 15px;
  width: 100%;
  margin-right: ${({ theme }) => theme.spacing(4)};
`;

const StyledComboInputContainer1 = styled.div`
  display: flex;
  width: 100%;
  padding-top: ${({ theme }) => theme.spacing(6)};
  justify-content: space-evenly;
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

const StyledComboInputContainer = styled.div`
  display: flex;
  align-items: center;
  > * + * {
    margin-left: ${({ theme }) => theme.spacing(2)};
  }
`;

const StyledLabelContainer = styled.div`
  color: ${({ theme }) => theme.font.color.tertiary};
  width: auto;
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

const StyledTableHeaderCell = styled.td`
  padding: 5px;
  border: 1px solid ${({ theme }) => theme.border.color.medium};
  height: 25px;
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

export const Segment = () => {
  const [segmentName, setSegmentName] = useState('');
  const [segmentDescription, setSegmentDescription] = useState('');
  const [filterString, setFilterString] = useState('');
  const [filter, setFilter] = useState('');
  const [querystamp, setQuerystamp] = useState('');

  const [leadData, setLeadData] = useState<any | any[]>([]);
  const [filterDivs, setFilterDivs] = useState<string[]>([]);
  const [selectedFilterOptions, setSelectedFilterOptions] = useState<Record<string, string> >({});

  const [cursor, setCursor] = useState<string | null>(null);
  const lastLeadRef = useRef<HTMLTableRowElement | null>(null);
  const [filterLoading, setFilterLoading] = useState<boolean>(false);

  const [totalLeadsCount, setTotalLeadsCount] = useState<number>(0);

  const { enqueueSnackBar } = useSnackBar();
  const navigate = useNavigate();

  const handleFilterButtonClick = () => {
    const key = `filter-${filterDivs.length + 1}`;
    setFilterDivs([...filterDivs, key]);
  };

  const handleFilterRemove = (keyToRemove: string) => {
    setFilterDivs(filterDivs.filter((key) => key !== keyToRemove));
    setSelectedFilterOptions((prevOptions) => {
      const {
        [keyToRemove + '-conditions']: _,
        [keyToRemove + '-field']: __,
        [keyToRemove + '-operators']: ___,
        ...rest
      } = prevOptions;
      return rest;
    });
  };

  const createOptions = (options: any[]) =>
    options.map((option: any) => ({ label: option, value: option }));
  const conditions = createOptions(['AND', 'OR']);
  const operators = createOptions([
    '= equal',
    '>  greater',
    '<  lesser',
    '!= not equal',
    '<> between',
  ]);

  const fields = [
    {"label": 'Advertisement Source', "value": 'advertisementSource'},
    {"label": 'Age', "value": 'age'},
    {"label": 'Location', "value": 'location'},
    {"label": 'Campaign Name', "value": 'campaignName'},
    {"label": 'Advertisement Name', "value": 'advertisementName'}
  ];

  const handleSelectChange = (key: string, value: string) => {
    setSelectedFilterOptions((prevOptions) => ({
      ...prevOptions,
      [key]: value,
    }));
  };

  const [filterleads, { loading, error, data }] = useLazyQuery(FILTER_LEADS, {
    fetchPolicy: 'network-only',
  });

  const [addSegment] = useMutation(ADD_SEGMENT);

  const handleRunQuery = async () => {
    const filter: any = {};

    filterDivs.forEach((key) => {
      const condition = selectedFilterOptions[`${key}-conditions`];
      const field = selectedFilterOptions[`${key}-field`];
      const operator = selectedFilterOptions[`${key}-operators`];
      const value = selectedFilterOptions[`${key}-value`];
      const value1 = selectedFilterOptions[`${key}-value1`];
      const value2 = selectedFilterOptions[`${key}-value2`];

      if (field && operator && (value1 || value2)) {
        const conditionFilter = condition === 'OR' ? 'or' : 'and';

        if (!filter[conditionFilter]) {
          filter[conditionFilter] = [];
        }

        let operation;
        console.log(selectedFilterOptions[`${key}-operators`] ===
        '<> between',"operator")
        if (selectedFilterOptions[`${key}-operators`] ===
        '<> between') {
          
          operation = '';
        } else {
          switch (operator) {
            case '= equal':
              operation = 'eq';
              break;
            case '> greater':
              operation = 'gte';
              break;
            case '< lesser':
              operation = 'lte';
              break;
            case '!= not equal':
              operation = 'nt';
              break;
            default:
              operation = 'ilike';
              break;
          }
        }

        if (operator === '<> between') {
          filter[conditionFilter].push({
            [field]: {
              lte: `${value2}`,
              gte: `${value1}`,
            },
          });
        } else {
          filter[conditionFilter].push({
            [field]: { [operation]: `${value1}` },
          });
        }
      }
    });

    setFilter(filter);
    let filterString = `{ "filter": ${JSON.stringify(filter)} }`;
    console.log(filter, 'filter');
    console.log(filterString, 'filterString');
    const orderBy = { position: 'AscNullsFirst' };
    try {
      const result = await filterleads({ variables: { filter } });

      setLeadData(result.data.leads.edges);
      setCursor(result.data.leads.pageInfo.endCursor);
      if (result.data.leads.pageInfo.hasNextPage == true) {
        setFilterLoading(true);
      }
      setTotalLeadsCount(result.data.leads.totalCount);
      setQuerystamp(new Date().toISOString());
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setFilterString(filterString);
  };

  const loadMore = async () => {
    if (filterLoading) {
      const result = await filterleads({
        variables: {
          filter,
          lastCursor: cursor,
        },
      });
      setCursor(result.data.leads.pageInfo.endCursor);
      const newData = result.data.leads.edges;
      setLeadData([...leadData, ...newData]);
      const currentPosition = window.scrollY;
      if (result.data.leads.pageInfo.hasNextPage == true) {
        setFilterLoading(true);
      }

      console.log(currentPosition, 'currentPosition');
      window.scrollTo(0, currentPosition);
    }
  };

  const handlesave = async () => {
    try {
      const id = uuidv4();
      const variables = {
        input: {
          id: id,
          name: segmentName,
          description: segmentDescription,
          filters: filterString,
        },
      };
      const { data } = await addSegment({
        variables: variables,
      });
      enqueueSnackBar('Segment saved successfully', {
        variant: 'success',
      });
      navigate(`/object/segment/${id}`);
      // window.location.reload();
    } catch (errors: any) {
      console.log('Error saving segment', error);
      enqueueSnackBar(errors.message + 'Error while adding Campaign', {
        variant: 'error',
      });
    }
  };

  const onIntersection = async (entries: any) => {
    const firstEntry = entries[0];

    if (firstEntry.isIntersecting && cursor) {
      loadMore();
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(onIntersection);
    if (observer && lastLeadRef.current) {
      observer.observe(lastLeadRef.current);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [leadData]);

  return (
    <>
      <PageContainer>
        <PageHeader title="Segment" Icon={IconUsersGroup}></PageHeader>
        <StyledBoardContainer>
          <StyledInputCard>
            <Section>
              <H2Title
                title="Segment Name"
                description="Enter Segment name here"
              />
              <TextInput
                placeholder={'Enter segment name'}
                value={segmentName}
                onChange={(e) => setSegmentName(e)}
                name="segmentName"
                required
                fullWidth
              />
            </Section>
            <SytledHR />
            <Section>
              <H2Title
                title="Segment Description"
                description="Enter segment description"
              />
            </Section>
            <TextArea
              placeholder={'Enter segment description'}
              minRows={5}
              value={segmentDescription}
              onChange={(e) => setSegmentDescription(e)}
            />

            <SytledHR />

            <StyledButton>
              <StyledButton>
                <Button
                  Icon={IconPlus}
                  title="Filter"
                  onClick={handleFilterButtonClick}
                />
              </StyledButton>

              <Button
                Icon={IconPlayerPlay}
                title="Run Query"
                onClick={handleRunQuery}
              />

              <Button
                title="Save"
                variant="primary"
                accent="dark"
                onClick={handlesave}
              />
            </StyledButton>
            {filterDivs.map((key) => (
              <div key={key}>
                <StyledComboInputContainer1>
                  <Button
                    Icon={IconX}
                    onClick={() => handleFilterRemove(key)}
                  />

                  <Select
                    fullWidth
                    dropdownId={`conditions-${key}`}
                    value={selectedFilterOptions[`${key}-conditions`] || ''}
                    onChange={(value: string) =>
                      handleSelectChange(`${key}-conditions`, value)
                    }
                    options={conditions}
                  />
                  <Select
                    fullWidth
                    dropdownId={`field-${key}`}
                    value={selectedFilterOptions[`${key}-field`] || ''}
                    onChange={(value: string) =>
                      handleSelectChange(`${key}-field`, value)
                    }
                    options={fields}
                  />

                  <Select
                    fullWidth
                    dropdownId={`operators-${key}`}
                    value={selectedFilterOptions[`${key}-operators`] || ''}
                    onChange={(value: string) =>
                      handleSelectChange(`${key}-operators`, value)
                    }
                    options={operators}
                  />

                  <TextInput
                    placeholder={selectedFilterOptions[`${key}-operators`] ===
                    '<> between'? 'Greater than' : "Value"}
                    value={selectedFilterOptions[`${key}-value1`] || ''}
                    onChange={(e) => handleSelectChange(`${key}-value1`, e)}
                    name="value"
                    required
                    fullWidth
                  />

                  {selectedFilterOptions[`${key}-operators`] ===
                    '<> between' && (
                    <TextInput
                      placeholder={selectedFilterOptions[`${key}-operators`] ===
                      '<> between'? 'Lesser than' : "Value"}
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
            <SytledHR />
          </StyledInputCard>
        </StyledBoardContainer>
        {!loading && data && (
          <>
            <StyledCountContainer>
              <StyledComboInputContainer>
                <StyledLabelContainer>
                  <EllipsisDisplay>Leads fetched at:</EllipsisDisplay>
                </StyledLabelContainer>
                <DateTimeDisplay value={querystamp} />
              </StyledComboInputContainer>
              <StyledComboInputContainer>
                <StyledLabelContainer>
                  <EllipsisDisplay>Total Leads:</EllipsisDisplay>
                </StyledLabelContainer>
                <NumberDisplay value={totalLeadsCount} />{' '}
              </StyledComboInputContainer>
            </StyledCountContainer>
            <StyledTable cursorPointer={true}>
              <tbody>
                <StyledTableRow>
                  <StyledTableHeaderCell>
                    <StyledLabelContainer>Name</StyledLabelContainer>
                  </StyledTableHeaderCell>
                  <StyledTableHeaderCell>
                    <StyledLabelContainer>Age</StyledLabelContainer>
                  </StyledTableHeaderCell>
                  <StyledTableHeaderCell>
                    <StyledLabelContainer>Gender</StyledLabelContainer>
                  </StyledTableHeaderCell>
                  <StyledTableHeaderCell>
                    <StyledLabelContainer>Location</StyledLabelContainer>
                  </StyledTableHeaderCell>
                  <StyledTableHeaderCell>
                    <StyledLabelContainer>Campaign Name</StyledLabelContainer>
                  </StyledTableHeaderCell>
                  <StyledTableHeaderCell>
                    <StyledLabelContainer>
                      Advertisement Source
                    </StyledLabelContainer>
                  </StyledTableHeaderCell>
                  <StyledTableHeaderCell>
                    <StyledLabelContainer>Phone Number</StyledLabelContainer>
                  </StyledTableHeaderCell>
                  <StyledTableHeaderCell>
                    <StyledLabelContainer>Comments</StyledLabelContainer>
                  </StyledTableHeaderCell>
                  <StyledTableHeaderCell>
                    <StyledLabelContainer>
                      Advertisement Name
                    </StyledLabelContainer>
                  </StyledTableHeaderCell>
                </StyledTableRow>
                {leadData.map((leads: any) => (
                  <StyledTableRow key={leads.node.id}>
                    <StyledTableCell>
                      <EllipsisDisplay>{leads.node?.name}</EllipsisDisplay>
                    </StyledTableCell>
                    <StyledTableCell>
                      <EllipsisDisplay>{leads.node?.age}</EllipsisDisplay>
                    </StyledTableCell>
                    <StyledTableCell>
                      <EllipsisDisplay>{leads.node?.gender}</EllipsisDisplay>
                    </StyledTableCell>
                    <StyledTableCell>
                      <EllipsisDisplay>{leads.node?.location}</EllipsisDisplay>
                    </StyledTableCell>
                    <StyledTableCell>
                      <EllipsisDisplay>
                        {leads.node?.campaignName}
                      </EllipsisDisplay>
                    </StyledTableCell>
                    <StyledTableCell>
                      <EllipsisDisplay>
                        {leads.node?.advertisementSource}
                      </EllipsisDisplay>
                    </StyledTableCell>
                    <StyledTableCell>
                      <EllipsisDisplay>
                        {leads.node?.phoneNumber}
                      </EllipsisDisplay>
                    </StyledTableCell>
                    <StyledTableCell>
                      <EllipsisDisplay>{leads.node?.comments}</EllipsisDisplay>
                    </StyledTableCell>
                    <StyledTableCell>
                      <EllipsisDisplay>
                        {leads.node?.advertisementName}
                      </EllipsisDisplay>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
                {cursor && filterLoading && (
                  <StyledTableRow ref={lastLeadRef}>
                    <td>Loading more...</td>
                  </StyledTableRow>
                )}
              </tbody>
            </StyledTable>
          </>
        )}
      </PageContainer>
    </>
  );
};
