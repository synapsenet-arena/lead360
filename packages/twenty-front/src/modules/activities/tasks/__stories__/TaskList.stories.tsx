import { Meta, StoryObj } from '@storybook/react';
import { ComponentDecorator } from 'twenty-ui';

import { TaskList } from '@/activities/tasks/components/TaskList';
import { MemoryRouterDecorator } from '~/testing/decorators/MemoryRouterDecorator';
import { SnackBarDecorator } from '~/testing/decorators/SnackBarDecorator';
import { graphqlMocks } from '~/testing/graphqlMocks';
import { mockedTasks } from '~/testing/mock-data/tasks';

const meta: Meta<typeof TaskList> = {
  title: 'Modules/Activity/TaskList',
  component: TaskList,
  decorators: [MemoryRouterDecorator, ComponentDecorator, SnackBarDecorator],
  args: {
    title: 'Tasks',
    tasks: mockedTasks,
  },
  parameters: {
    msw: graphqlMocks,
  },
};

export default meta;
type Story = StoryObj<typeof TaskList>;

export const Default: Story = {
  args: {
    title: 'Tasks',
    tasks: mockedTasks,
  },
};
