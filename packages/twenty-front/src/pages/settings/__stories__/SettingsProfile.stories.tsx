import { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/test';

import {
  PageDecorator,
  PageDecoratorArgs,
} from '~/testing/decorators/PageDecorator';
import { PrefetchLoadingDecorator } from '~/testing/decorators/PrefetchLoadingDecorator';
import { graphqlMocks } from '~/testing/graphqlMocks';

import { SettingsProfile } from '../SettingsProfile';

const meta: Meta<PageDecoratorArgs> = {
  title: 'Pages/Settings/SettingsProfile',
  component: SettingsProfile,
  decorators: [PrefetchLoadingDecorator, PageDecorator],
  args: {
    routePath: '/settings/profile',
    additionalRoutes: ['/welcome'],
  },
  parameters: {
    msw: graphqlMocks,
  },
};

export default meta;

export type Story = StoryObj<typeof SettingsProfile>;

export const Default: Story = {};

export const LogOut: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const logoutButton = await canvas.findByText('Logout');

    await userEvent.click(logoutButton);
  },
};
