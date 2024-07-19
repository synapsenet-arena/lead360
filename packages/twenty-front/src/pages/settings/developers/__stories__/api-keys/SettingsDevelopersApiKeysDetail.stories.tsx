import { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/test';
import { HttpResponse, graphql } from 'msw';

import { SettingsDevelopersApiKeyDetail } from '~/pages/settings/developers/api-keys/SettingsDevelopersApiKeyDetail';
import {
  PageDecorator,
  PageDecoratorArgs,
} from '~/testing/decorators/PageDecorator';
import { PrefetchLoadingDecorator } from '~/testing/decorators/PrefetchLoadingDecorator';
import { graphqlMocks } from '~/testing/graphqlMocks';
import { sleep } from '~/utils/sleep';

const meta: Meta<PageDecoratorArgs> = {
  title: 'Pages/Settings/Developers/ApiKeys/SettingsDevelopersApiKeyDetail',
  component: SettingsDevelopersApiKeyDetail,
  decorators: [PrefetchLoadingDecorator, PageDecorator],
  args: {
    routePath: '/settings/developers/api-keys/:apiKeyId',
    routeParams: {
      ':apiKeyId': 'f7c6d736-8fcd-4e9c-ab99-28f6a9031570',
    },
  },
  parameters: {
    msw: {
      handlers: [
        ...graphqlMocks.handlers,
        graphql.query('FindOneApiKey', () => {
          return HttpResponse.json({
            data: {
              apiKey: {
                __typename: 'ApiKey',
                id: 'f7c6d736-8fcd-4e9c-ab99-28f6a9031570',
                revokedAt: null,
                expiresAt: '2024-03-10T09:23:10.511Z',
                name: 'sfsfdsf',
                updatedAt: '2024-02-24T10:23:10.673Z',
                createdAt: '2024-02-24T10:23:10.673Z',
              },
            },
          });
        }),
      ],
    },
  },
};
export default meta;

export type Story = StoryObj<typeof SettingsDevelopersApiKeyDetail>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findByText('Settings');
    await canvas.findByText('sfsfdsf API Key');
  },
};

export const RegenerateApiKey: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await canvas.findByText('Settings');

    await userEvent.click(await canvas.findByText('Regenerate Key'));

    await canvas.findByText('Cancel');
    const confirmationInput = await canvas.findByPlaceholderText('yes');
    await userEvent.click(confirmationInput);
    await userEvent.keyboard('y');
    await userEvent.keyboard('e');
    await userEvent.keyboard('s');

    const confirmButton = await canvas.findByTestId(
      'confirmation-modal-confirm-button',
    );

    await step('Click on confirm button', async () => {
      await sleep(1000);
      await userEvent.click(confirmButton);
    });
  },
};

export const DeleteApiKey: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await canvas.findByText('Settings');

    await userEvent.click(await canvas.findByText('Delete'));

    await canvas.findByText('Cancel');
    const confirmationInput = await canvas.findByPlaceholderText('yes');
    await userEvent.click(confirmationInput);
    await userEvent.keyboard('y');
    await userEvent.keyboard('e');
    await userEvent.keyboard('s');

    const confirmButton = await canvas.findByTestId(
      'confirmation-modal-confirm-button',
    );

    await step('Click on confirm button', async () => {
      await sleep(1000);
      await userEvent.click(confirmButton);
    });
  },
};
