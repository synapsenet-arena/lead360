import { Meta, StoryObj } from '@storybook/react';
import { within } from '@storybook/test';

import { getSettingsPagePath } from '@/settings/utils/getSettingsPagePath';
import { SettingsPath } from '@/types/SettingsPath';
import { SettingsIntegrationDatabase } from '~/pages/settings/integrations/SettingsIntegrationDatabase';
import {
  PageDecorator,
  PageDecoratorArgs,
} from '~/testing/decorators/PageDecorator';
import { PrefetchLoadingDecorator } from '~/testing/decorators/PrefetchLoadingDecorator';
import { graphqlMocks } from '~/testing/graphqlMocks';
import { sleep } from '~/utils/sleep';

const meta: Meta<PageDecoratorArgs> = {
  title: 'Pages/Settings/Integrations/SettingsIntegrationDatabase',
  component: SettingsIntegrationDatabase,
  decorators: [PrefetchLoadingDecorator, PageDecorator],
  args: {
    routePath: getSettingsPagePath(SettingsPath.IntegrationDatabase),
    routeParams: { ':databaseKey': 'postgresql' },
  },
  parameters: {
    msw: graphqlMocks,
  },
};

export default meta;

export type Story = StoryObj<typeof SettingsIntegrationDatabase>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    sleep(1000);

    await canvas.findByText('PostgreSQL database');
  },
};
