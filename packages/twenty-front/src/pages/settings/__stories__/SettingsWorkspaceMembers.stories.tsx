import { Meta, StoryObj } from '@storybook/react';
import { within } from '@storybook/test';

import {
  PageDecorator,
  PageDecoratorArgs,
} from '~/testing/decorators/PageDecorator';
import { PrefetchLoadingDecorator } from '~/testing/decorators/PrefetchLoadingDecorator';
import { graphqlMocks } from '~/testing/graphqlMocks';
import { sleep } from '~/utils/sleep';

import { SettingsWorkspaceMembers } from '../SettingsWorkspaceMembers';

const meta: Meta<PageDecoratorArgs> = {
  title: 'Pages/Settings/SettingsWorkspaceMembers',
  component: SettingsWorkspaceMembers,
  decorators: [PrefetchLoadingDecorator, PageDecorator],
  args: { routePath: '/settings/workspace-members' },
  parameters: {
    msw: graphqlMocks,
  },
};

export default meta;

export type Story = StoryObj<typeof SettingsWorkspaceMembers>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await sleep(1000);

    await canvas.getByRole('button', { name: 'Copy link' });
  },
};
