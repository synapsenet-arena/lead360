import styled from '@emotion/styled';
import { useRecoilValue } from 'recoil';
import {
  IconCalendarEvent,
  IconCheckbox,
  IconHome,
  IconMail,
  IconNotes,
  IconPaperclip,
  IconTimelineEvent,
} from 'twenty-ui';

import { Calendar } from '@/activities/calendar/components/Calendar';
import { EmailThreads } from '@/activities/emails/components/EmailThreads';
import { Attachments } from '@/activities/files/components/Attachments';
import { Notes } from '@/activities/notes/components/Notes';
import { ObjectTasks } from '@/activities/tasks/components/ObjectTasks';
import { TimelineActivities } from '@/activities/timelineActivities/components/TimelineActivities';
import { TimelineActivitiesQueryEffect } from '@/activities/timelineActivities/components/TimelineActivitiesQueryEffect';
import { ActivityTargetableObject } from '@/activities/types/ActivityTargetableEntity';
import { CoreObjectNameSingular } from '@/object-metadata/types/CoreObjectNameSingular';
import { TabList } from '@/ui/layout/tab/components/TabList';
import { useTabList } from '@/ui/layout/tab/hooks/useTabList';
import { useIsMobile } from '@/ui/utilities/responsive/hooks/useIsMobile';
import { useIsFeatureEnabled } from '@/workspace/hooks/useIsFeatureEnabled';
import { useObjectMetadataItem } from '@/object-metadata/hooks/useObjectMetadataItem';
import { IconClock, IconUsersGroup, IconMessage, IconDeviceTabletQuestion } from '@tabler/icons-react';
import { Schedule } from '@/activities/Schedule/components/schedule';
import { Leads } from '@/activities/Leads/components/Leads';
import { MessageTemplate } from '@/activities/messageTemplate/components/messageTemplate';
import { FormTemplate } from '@/activities/formTemplate/components/formTemplate';
import { Timeline } from '@/activities/timeline/components/Timeline';
import { TimelineQueryEffect } from '@/activities/timeline/components/TimelineQueryEffect';

const StyledShowPageRightContainer = styled.div<{ isMobile: boolean }>`
  display: flex;
  flex: 1 0 0;
  flex-direction: column;
  justify-content: start;
  overflow: ${() => (useIsMobile() ? 'none' : 'hidden')};
  /* width: calc(100% + 4px); */
  overflow: scroll;
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
  width: 100%;
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
  summary?: JSX.Element;
  isRightDrawer?: boolean;
  loading: boolean;
};

export const ShowPageRightContainer = ({
  targetableObject,
  timeline,
  tasks,
  notes,
  emails,
  loading,
  summary,
  isRightDrawer = false,
}: ShowPageRightContainerProps) => {
  const { activeTabIdState } = useTabList(
    TAB_LIST_COMPONENT_ID + isRightDrawer,
  );
  const activeTabId = useRecoilValue(activeTabIdState);

  const targetObjectNameSingular =
    targetableObject.targetObjectNameSingular as CoreObjectNameSingular;

  const isCompanyOrPerson = [
    CoreObjectNameSingular.Company,
    CoreObjectNameSingular.Person,
  ].includes(targetObjectNameSingular);

  const shouldDisplayCalendarTab = isCompanyOrPerson;
  const shouldDisplayEmailsTab = emails && isCompanyOrPerson;

  const isMobile = useIsMobile() || isRightDrawer;

  const tabs = [
    {
      id: 'summary',
      title: 'Summary',
      Icon: IconHome,
      hide: !isMobile,
    },
    {
      id: 'timeline',
      title: 'Timeline',
      Icon: IconTimelineEvent,
      hide: !timeline || isRightDrawer,
    },
    { id: 'tasks', title: 'Tasks', Icon: IconCheckbox, hide: !tasks },
    { id: 'notes', title: 'Notes', Icon: IconNotes, hide: !notes },
    { id: 'files', title: 'Files', Icon: IconPaperclip, hide: !notes },
    {
      id: 'emails',
      title: 'Emails',
      Icon: IconMail,
      hide: !shouldDisplayEmailsTab,
    },
    {
      id: 'calendar',
      title: 'Calendar',
      Icon: IconCalendarEvent,
      hide: !shouldDisplayCalendarTab,
    },
  ];
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
  }else{
    TASK_TABS=tabs
  }

  const renderActiveTabContent = () => {
    switch (activeTabId) {
      case 'timeline':
        return (
          <>
            <TimelineActivitiesQueryEffect
              targetableObject={targetableObject}
            />
            <TimelineActivities targetableObject={targetableObject} />
          </>
        );
      case 'summary':
        return summary;
      case 'tasks':
        return <ObjectTasks targetableObject={targetableObject} />;
      case 'notes':
        return <Notes targetableObject={targetableObject} />;
      case 'files':
        return <Attachments targetableObject={targetableObject} />;
      case 'emails':
        return <EmailThreads targetableObject={targetableObject} />;
      case 'calendar':
        return <Calendar targetableObject={targetableObject} />;
      default:
        return <></>;
    }
  };

  return (
    <StyledShowPageRightContainer isMobile={isMobile}>
      <StyledTabListContainer>
        <TabList
          loading={loading}
          tabListId={TAB_LIST_COMPONENT_ID + isRightDrawer}
          tabs={tabs}
        />
      </StyledTabListContainer>
      {activeTabId === 'timeline' && (
        <>
          <TimelineQueryEffect targetableObject={targetableObject} />
          <Timeline loading={loading} targetableObject={targetableObject} />
        </>
      )}
      {activeTabId === 'tasks' && (
        <ObjectTasks targetableObject={targetableObject} />
      )}
      {activeTabId === 'notes' && <Notes targetableObject={targetableObject} />}
      {activeTabId === 'files' && (
        <Attachments targetableObject={targetableObject} />
      )}
      {activeTabId === 'emails' && (
        <EmailThreads targetableObject={targetableObject} />
      )}
      {activeTabId === 'calendar' && (
        <Calendar targetableObject={targetableObject} />
      )}
      {activeTabId === 'logs' && (
        <TimelineActivities targetableObject={targetableObject} />
      )}

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
      {renderActiveTabContent()}
    </StyledShowPageRightContainer>
  );
};
