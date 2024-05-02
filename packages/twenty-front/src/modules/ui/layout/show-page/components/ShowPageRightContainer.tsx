import styled from '@emotion/styled';
import { useRecoilValue } from 'recoil';

import { EmailThreads } from '@/activities/emails/components/EmailThreads';
import { Attachments } from '@/activities/files/components/Attachments';
import { Notes } from '@/activities/notes/components/Notes';
import { ObjectTasks } from '@/activities/tasks/components/ObjectTasks';
import { Timeline } from '@/activities/timeline/components/Timeline';
import { TimelineQueryEffect } from '@/activities/timeline/components/TimelineQueryEffect';
import { ActivityTargetableObject } from '@/activities/types/ActivityTargetableEntity';
import { useObjectMetadataItem } from '@/object-metadata/hooks/useObjectMetadataItem';
import { CoreObjectNameSingular } from '@/object-metadata/types/CoreObjectNameSingular';
import { IconClock, IconUsersGroup,IconMessage,IconDeviceTabletQuestion, } from '@tabler/icons-react';

import {
  IconCheckbox,
  IconMail,
  IconNotes,
  IconPaperclip,
  IconTimelineEvent,
 
} from '@/ui/display/icon';
import { TabList } from '@/ui/layout/tab/components/TabList';
import { useTabList } from '@/ui/layout/tab/hooks/useTabList';
import { useIsMobile } from '@/ui/utilities/responsive/hooks/useIsMobile';
import { Schedule } from '@/activities/Schedule/components/schedule';
import { Leads } from '@/activities/Leads/components/Leads';
import { FormTemplate } from '@/activities/formTemplate/components/formTemplate';
import { MessageTemplate } from '@/activities/messageTemplate/components/messageTemplate';

const StyledShowPageRightContainer = styled.div`
  display: flex;
  flex: 1 0 0;
  flex-direction: column;
  justify-content: start;
  overflow: ${() => (useIsMobile() ? 'none' : 'hidden')};
  width: calc(100% + 4px);
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

const StyledTabListContainer = styled.div`
  align-items: center;
  border-bottom: ${({ theme }) => `1px solid ${theme.border.color.light}`};
  box-sizing: border-box;
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
  height: 40px;
`;

export const TAB_LIST_COMPONENT_ID = 'show-page-right-tab-list';

type ShowPageRightContainerProps = {
  targetableObject: Pick<
    ActivityTargetableObject,
    'targetObjectNameSingular' | 'id'
  >;
  timeline?: boolean;
  tasks?: boolean;
  notes?: boolean;
  emails?: boolean;
};

export const ShowPageRightContainer = ({
  targetableObject,
  timeline,
  tasks,
  notes,
  emails,
}: ShowPageRightContainerProps) => {
  const { getActiveTabIdState } = useTabList(TAB_LIST_COMPONENT_ID);
  const activeTabId = useRecoilValue(getActiveTabIdState());

  const { objectMetadataItem: targetableObjectMetadataItem } =
    useObjectMetadataItem({
      objectNameSingular: targetableObject.targetObjectNameSingular,
    });

  const shouldDisplayEmailsTab =
    (emails &&
      targetableObject.targetObjectNameSingular ===
        CoreObjectNameSingular.Company) ||
    targetableObject.targetObjectNameSingular === CoreObjectNameSingular.Person;

  let TASK_TABS = [];

  if (targetableObject.targetObjectNameSingular === 'campaign'|| targetableObject.targetObjectNameSingular === 'campaignTrigger') {
    TASK_TABS = [
      {
        id: 'schedule',
        title: 'Schedule',
        Icon: IconClock,
        hide: !timeline,
      },
      {
        id: 'leads',
        title: 'Leads',
        Icon: IconUsersGroup,
        hide: !tasks,
      },
      {
        id: 'messageTemplate',
        title: 'Message Template',
        Icon: IconMessage,
        hide: !notes,
      },
      {
        id: 'formTemplate',
        title: 'Form Template',
        Icon: IconDeviceTabletQuestion,
        hide: !notes,
      },
      {
        id: 'emails',
        title: 'Emails',
        Icon: IconMail,
        hide: !shouldDisplayEmailsTab,
        hasBetaPill: true,
      },
    ];
  } else {
    TASK_TABS = [
      {
        id: 'timeline',
        title: 'Timeline',
        Icon: IconTimelineEvent,
        hide: !timeline,
      },
      {
        id: 'tasks',
        title: 'Tasks',
        Icon: IconCheckbox,
        hide: !tasks,
      },
      {
        id: 'notes',
        title: 'Notes',
        Icon: IconNotes,
        hide: !notes,
      },
      {
        id: 'files',
        title: 'Files',
        Icon: IconPaperclip,
        hide: !notes,
        disabled: targetableObjectMetadataItem.isCustom,
      },
      {
        id: 'emails',
        title: 'Emails',
        Icon: IconMail,
        hide: !shouldDisplayEmailsTab,
        hasBetaPill: true,
      },
    ];
  }
  // const TASK_TABS = [
  //   {
  //     id: 'timeline',
  //     title: 'Timeline',
  //     Icon: IconTimelineEvent,
  //     hide: !timeline,
  //   },
  //   {
  //     id: 'tasks',
  //     title: 'Tasks',
  //     Icon: IconCheckbox,
  //     hide: !tasks,
  //   },
  //   {
  //     id: 'notes',
  //     title: 'Notes',
  //     Icon: IconNotes,
  //     hide: !notes,
  //   },
  //   {
  //     id: 'files',
  //     title: 'Files',
  //     Icon: IconPaperclip,
  //     hide: !notes,
  //     disabled: targetableObjectMetadataItem.isCustom,
  //   },
  //   {
  //     id: 'emails',
  //     title: 'Emails',
  //     Icon: IconMail,
  //     hide: !shouldDisplayEmailsTab,
  //     hasBetaPill: true,
  //   },
  // ];

  return (
    <StyledShowPageRightContainer>
      <StyledTabListContainer>
        <TabList tabListId={TAB_LIST_COMPONENT_ID} tabs={TASK_TABS} />
      </StyledTabListContainer>
      {activeTabId === 'timeline' && (
        <>
          <TimelineQueryEffect targetableObject={targetableObject} />
          <Timeline targetableObject={targetableObject} />
        </>
      )}
      {activeTabId === 'tasks' && (
        <ObjectTasks targetableObject={targetableObject} />
      )}
      {activeTabId === 'notes' && <Notes targetableObject={targetableObject} />}
      {activeTabId === 'files' && (
        <Attachments targetableObject={targetableObject} />
      )}
      {activeTabId === 'emails' && <EmailThreads entity={targetableObject} />}

      {activeTabId === 'schedule' && (
        <Schedule targetableObject={targetableObject} />
      )}
      {activeTabId === 'leads' && (
        <Leads targetableObject={targetableObject}/>
      )}
      {activeTabId === 'messageTemplate' && (
        <MessageTemplate targetableObject={targetableObject}/>
      )}
      {activeTabId === 'formTemplate' && (
        <FormTemplate targetableObject={targetableObject}/>
      )}
    </StyledShowPageRightContainer>
  );
};
