import { RecordDetailRecordsList } from '@/object-record/record-show/record-detail-section/components/RecordDetailRecordsList';
import { RecordDetailRelationRecordsListItem } from '@/object-record/record-show/record-detail-section/components/RecordDetailRelationRecordsListItem';
import { ObjectRecord } from '@/object-record/types/ObjectRecord';
import { IconEye } from '@tabler/icons-react';
import styled from '@emotion/styled';
import { IconButton } from '@/ui/input/button/components/IconButton';
import { useParams } from 'react-router-dom';
import { useTabList } from '@/ui/layout/tab/hooks/useTabList';
import { TAB_LIST_COMPONENT_ID } from '@/ui/layout/show-page/components/ShowPageRightContainer';
type RecordDetailRelationRecordsListProps = {
  relationRecords: ObjectRecord[];
};

const StyledComboInputContainer = styled.div`
  display: flex;
  align-items: center;
  > * + * {
    margin-left: ${({ theme }) => theme.spacing(4)};
  }
`;


export const RecordDetailRelationRecordsList = ({
  relationRecords,
}: RecordDetailRelationRecordsListProps) => {

  const { objectNameSingular, objectRecordId } = useParams<{
    objectNameSingular: string;
    objectRecordId: string;
  }>();

  const { getActiveTabIdState, setActiveTabId } = useTabList(TAB_LIST_COMPONENT_ID);

  
const handleClick = () => {
  if(relationRecords[0].__typename == 'FormTemplate'){
    setActiveTabId('formTemplate')
  }else if(relationRecords[0].__typename == 'MessageTemplate'){
    setActiveTabId('messageTemplate')
  }else if(relationRecords[0].__typename == 'Segment'){
    setActiveTabId('leads')
  }
}

  return(
  

  <RecordDetailRecordsList>
    {relationRecords.slice(0, 5).map((relationRecord) => (
      <StyledComboInputContainer>
        <RecordDetailRelationRecordsListItem
          key={relationRecord.id}
          relationRecord={relationRecord}
        />
        {objectNameSingular == 'campaign' && <IconButton variant="tertiary" Icon={IconEye} onClick={handleClick}/>}
      </StyledComboInputContainer>
    ))}
  </RecordDetailRecordsList>
);}
