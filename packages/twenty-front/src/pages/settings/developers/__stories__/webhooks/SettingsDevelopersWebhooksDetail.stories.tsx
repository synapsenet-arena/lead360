import { Meta, StoryObj } from '@storybook/react';
import { within } from '@storybook/test';
import { graphql, HttpResponse } from 'msw';

import { SettingsDevelopersWebhooksDetail } from '~/pages/settings/developers/webhooks/SettingsDevelopersWebhookDetail';
import {
  PageDecorator,
  PageDecoratorArgs,
} from '~/testing/decorators/PageDecorator';
import { PrefetchLoadingDecorator } from '~/testing/decorators/PrefetchLoadingDecorator';
import { graphqlMocks } from '~/testing/graphqlMocks';

const meta: Meta<PageDecoratorArgs> = {
  title: 'Pages/Settings/Developers/Webhooks/SettingsDevelopersWebhooksDetail',
  component: SettingsDevelopersWebhooksDetail,
  decorators: [PrefetchLoadingDecorator, PageDecorator],
  args: {
    routePath: '/settings/developers/webhooks/:webhookId',
    routeParams: { ':webhookId': '1234' },
  },
  parameters: {
    msw: {
      handlers: [
        graphql.query('FindOneWebhook', () => {
          return HttpResponse.json({
            data: {
              webhook: {
                id: '1',
                createdAt: '2021-08-27T12:00:00Z',
                targetUrl: 'https://example.com/webhook',
                description: 'A Sample Description',
                updatedAt: '2021-08-27T12:00:00Z',
                operation: 'create',
                __typename: 'Webhook',
              },
            },
          });
        }),
        graphqlMocks.handlers,
      ],
    },
  },
};

export default meta;

export type Story = StoryObj<typeof SettingsDevelopersWebhooksDetail>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findByText(
      'We will send POST requests to this endpoint for every new event',
    );
    await canvas.findByText('Delete this integration');
  },
};
