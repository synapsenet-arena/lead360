import styled from '@emotion/styled';
import { useRecoilValue } from 'recoil';
import {
  IconCalendarEvent,
  IconCheckbox,
  IconList,
  IconMail,
  IconNotes,
  IconPaperclip,
  IconTimelineEvent,
} from 'twenty-ui';

import { Calendar } from '@/activities/calendar/components/Calendar';
import { EmailThreads } from '@/activities/emails/components/EmailThreads';
import { Attachments } from '@/activities/files/components/Attachments';
import { FormTemplate } from '@/activities/formTemplate/components/formTemplate';
import { Leads } from '@/activities/Leads/components/Leads';
import { MessageTemplate } from '@/activities/messageTemplate/components/messageTemplate';
import { Notes } from '@/activities/notes/components/Notes';
import { Schedule } from '@/activities/Schedule/components/schedule';
import { ObjectTasks } from '@/activities/tasks/components/ObjectTasks';
import { TimelineActivities } from '@/activities/timelineActivities/components/TimelineActivities';
import { ActivityTargetableObject } from '@/activities/types/ActivityTargetableEntity';
import { CoreObjectNameSingular } from '@/object-metadata/types/CoreObjectNameSingular';
import { ShowPageActivityContainer } from '@/ui/layout/show-page/components/ShowPageActivityContainer';
import { TabList } from '@/ui/layout/tab/components/TabList';
import { useTabList } from '@/ui/layout/tab/hooks/useTabList';
import { useIsMobile } from '@/ui/utilities/responsive/hooks/useIsMobile';
import {
  IconClock,
  IconDeviceTabletQuestion,
  IconMessage,
  IconUsersGroup,
} from '@tabler/icons-react';

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
  fieldsBox?: JSX.Element;
  summaryCard?: JSX.Element;
  isInRightDrawer?: boolean;
  loading: boolean;
};

export const ShowPageRightContainer = ({
  targetableObject,
  timeline,
  tasks,
  notes,
  emails,
  loading,
  fieldsBox,
  summaryCard,
  isInRightDrawer = false,
}: ShowPageRightContainerProps) => {
  const { activeTabIdState } = useTabList(
    `${TAB_LIST_COMPONENT_ID}-${isInRightDrawer}`,
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

  const isMobile = useIsMobile() || isInRightDrawer;

  const tabs = [
    {
      id: 'richText',
      title: 'Note',
      Icon: IconNotes,
      hide:
        loading ||
        (targetableObject.targetObjectNameSingular !==
          CoreObjectNameSingular.Note &&
          targetableObject.targetObjectNameSingular !==
            CoreObjectNameSingular.Task),
    },
    {
      id: 'fields',
      title: 'Fields',
      Icon: IconList,
      hide: !isMobile,
    },
    {
      id: 'timeline',
      title: 'Timeline',
      Icon: IconTimelineEvent,
      hide: !timeline || isInRightDrawer,
    },
    {
      id: 'tasks',
      title: 'Tasks',
      Icon: IconCheckbox,
      hide:
        !tasks ||
        targetableObject.targetObjectNameSingular ===
          CoreObjectNameSingular.Note ||
        targetableObject.targetObjectNameSingular ===
          CoreObjectNameSingular.Task,
    },
    {
      id: 'notes',
      title: 'Notes',
      Icon: IconNotes,
      hide:
        !notes ||
        targetableObject.targetObjectNameSingular ===
          CoreObjectNameSingular.Note ||
        targetableObject.targetObjectNameSingular ===
          CoreObjectNameSingular.Task,
    },
    {
      id: 'files',
      title: 'Files',
      Icon: IconPaperclip,
      hide: !notes,
    },
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

  if (
    targetableObject.targetObjectNameSingular === 'campaign' ||
    targetableObject.targetObjectNameSingular === 'campaignTrigger'
  ) {
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
      }
    ];
  } else {
    TASK_TABS = tabs;
  }

  const renderActiveTabContent = () => {
    switch (activeTabId) {
      case 'timeline':
        return (
          <>
            <TimelineActivities
              targetableObject={targetableObject}
              isInRightDrawer={isInRightDrawer}
            />
          </>
        );
      case 'richText':
        return (
          (targetableObject.targetObjectNameSingular ===
            CoreObjectNameSingular.Note ||
            targetableObject.targetObjectNameSingular ===
              CoreObjectNameSingular.Task) && (
            <ShowPageActivityContainer targetableObject={targetableObject} />
          )
        );
      case 'fields':
        return fieldsBox;
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
      {summaryCard}
      <StyledTabListContainer>
        <TabList
          loading={loading}
          tabListId={`${TAB_LIST_COMPONENT_ID}-${isInRightDrawer}`}
          tabs={TASK_TABS}
        />
      </StyledTabListContainer>

      {activeTabId === 'schedule' && (
        <Schedule targetableObject={targetableObject} />
      )}
      {activeTabId === 'leads' && <Leads targetableObject={targetableObject} />}
      {activeTabId === 'messageTemplate' && (
        <MessageTemplate targetableObject={targetableObject} />
      )}
      {activeTabId === 'formTemplate' && (
        <FormTemplate targetableObject={targetableObject} />
      )}
      {renderActiveTabContent()}
    </StyledShowPageRightContainer>
  );
};
