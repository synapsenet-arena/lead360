import { Button } from '@/ui/input/button/components/Button';
import { useMutation } from '@apollo/client';
import { v4 as uuidv4 } from 'uuid';
import { IconPlayerPlay, IconPlus, IconUsersGroup } from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';
import { PageHeader } from '@/ui/layout/page/PageHeader';
import { useLazyQuery } from '@apollo/client';
import { FILTER_LEADS } from '@/users/graphql/queries/filterLeads';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { ADD_SEGMENT } from '@/users/graphql/queries/addSegment';
import { useNavigate } from 'react-router-dom';
import { Filters } from '~/pages/Segment/Filters';
import { SegmentInput } from '~/pages/Segment/SegmentInput';
import {
  StyledInputCard,
  SytledHR,
  StyledButton,
  PageContainer,
  StyledBoardContainer,
} from '~/pages/Segment/SegmentStyles';
import { DisplayLeads } from '~/pages/Segment/DisplayLeads';

export const Segment = () => {
  const [segmentName, setSegmentName] = useState('');
  const [segmentDescription, setSegmentDescription] = useState('');
  const [filterString, setFilterString] = useState('');
  const [filter, setFilter] = useState('');
  const [querystamp, setQuerystamp] = useState('');
  const [leadData, setLeadData] = useState<any | any[]>([]);
  const [filterDivs, setFilterDivs] = useState<string[]>([]);
  const [selectedFilterOptions, setSelectedFilterOptions] = useState<
    Record<string, string>
  >({});

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

  const setSegmentNameValue = (value: string) => {
    setSegmentName(value);
  };
  const setSegmentDescriptionValue = (value: string) => {
    setSegmentDescription(value);
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
      const value1: number | string = isNaN(
        Number(selectedFilterOptions[`${key}-value1`]),
      )
        ? selectedFilterOptions[`${key}-value1`]
        : Number(selectedFilterOptions[`${key}-value1`]);
      const value2: number = Number(selectedFilterOptions[`${key}-value2`]);

      if (field && operator && (value1 || value2)) {
        const conditionFilter = condition === 'OR' ? 'or' : 'and';

        if (!filter[conditionFilter]) {
          filter[conditionFilter] = [];
        }

        let operation;
        if (selectedFilterOptions[`${key}-operators`] === '<> between') {
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
              lte: value2,
              gte: value1,
            },
          });
        } else {
          filter[conditionFilter].push({
            [field]: { [operation]: value1 },
          });
        }
      }
    });

    setFilter(filter);
    let filterString = `{ "filter": ${JSON.stringify(filter)} }`;
    try {
      const result = await filterleads({ variables: { filter } });
      setLeadData(result.data.leads.edges);
      if (result.data.leads.pageInfo.hasNextPage == true) {
        setFilterLoading(true);
        setCursor(result.data.leads.pageInfo.endCursor);
      } else if (result.data.leads.pageInfo.hasNextPage == false) {
        setCursor(null);
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
      const newData = result.data.leads.edges;
      setLeadData((prevData: any) => [...prevData, ...newData]);
      if (result.data.leads.pageInfo.hasNextPage == true) {
        setFilterLoading(true);
        setCursor(result.data.leads.pageInfo.endCursor);
      } else if (result.data.leads.pageInfo.hasNextPage == false) {
        setCursor(null);
      }
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
      console.error('Error saving segment', error);
      enqueueSnackBar(errors.message + 'Error while adding Segment', {
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
            <SegmentInput
              setSegmentName={setSegmentNameValue}
              segmentName={segmentName}
              segmentDescription={segmentDescription}
              setSegmentDescription={setSegmentDescriptionValue}
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
            <Filters
              filterDivs={filterDivs}
              handleFilterRemove={handleFilterRemove}
              selectedFilterOptions={selectedFilterOptions}
              handleSelectChange={handleSelectChange}
            />
            <SytledHR />
          </StyledInputCard>
        </StyledBoardContainer>
        <DisplayLeads
          loading={loading}
          data={data}
          querystamp={querystamp}
          leadData={leadData}
          totalLeadsCount={totalLeadsCount}
          cursor={cursor}
          filterLoading={filterLoading}
          lastLeadRef={lastLeadRef}
        />
      </PageContainer>
    </>
  );
};
