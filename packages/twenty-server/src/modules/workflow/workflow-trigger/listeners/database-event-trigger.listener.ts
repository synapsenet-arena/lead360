import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { FeatureFlagKey } from 'src/engine/core-modules/feature-flag/enums/feature-flag-key.enum';
import { IsFeatureEnabledService } from 'src/engine/core-modules/feature-flag/services/is-feature-enabled.service';
import { ObjectRecordCreateEvent } from 'src/engine/integrations/event-emitter/types/object-record-create.event';
import { ObjectRecordDeleteEvent } from 'src/engine/integrations/event-emitter/types/object-record-delete.event';
import { ObjectRecordUpdateEvent } from 'src/engine/integrations/event-emitter/types/object-record-update.event';
import { InjectMessageQueue } from 'src/engine/integrations/message-queue/decorators/message-queue.decorator';
import { MessageQueue } from 'src/engine/integrations/message-queue/message-queue.constants';
import { MessageQueueService } from 'src/engine/integrations/message-queue/services/message-queue.service';
import { TwentyORMGlobalManager } from 'src/engine/twenty-orm/twenty-orm-global.manager';
import { WorkflowEventListenerWorkspaceEntity } from 'src/modules/workflow/common/standard-objects/workflow-event-listener.workspace-entity';
import {
  WorkflowEventTriggerJob,
  WorkflowEventTriggerJobData,
} from 'src/modules/workflow/workflow-trigger/jobs/workflow-event-trigger.job';

@Injectable()
export class DatabaseEventTriggerListener {
  private readonly logger = new Logger('DatabaseEventTriggerListener');

  constructor(
    private readonly twentyORMGlobalManager: TwentyORMGlobalManager,
    @InjectMessageQueue(MessageQueue.workflowQueue)
    private readonly messageQueueService: MessageQueueService,
    private readonly isFeatureFlagEnabledService: IsFeatureEnabledService,
  ) {}

  @OnEvent('*.created')
  async handleObjectRecordCreateEvent(payload: ObjectRecordCreateEvent<any>) {
    await this.handleEvent(payload);
  }

  @OnEvent('*.updated')
  async handleObjectRecordUpdateEvent(payload: ObjectRecordUpdateEvent<any>) {
    await this.handleEvent(payload);
  }

  @OnEvent('*.deleted')
  async handleObjectRecordDeleteEvent(payload: ObjectRecordDeleteEvent<any>) {
    await this.handleEvent(payload);
  }

  private async handleEvent(
    payload:
      | ObjectRecordCreateEvent<any>
      | ObjectRecordUpdateEvent<any>
      | ObjectRecordDeleteEvent<any>,
  ) {
    const workspaceId = payload.workspaceId;
    const eventName = payload.name;

    if (!workspaceId || !eventName) {
      this.logger.error(
        `Missing workspaceId or eventName in payload ${JSON.stringify(
          payload,
        )}`,
      );

      return;
    }

    const isWorkflowEnabled =
      await this.isFeatureFlagEnabledService.isFeatureEnabled(
        FeatureFlagKey.IsWorkflowEnabled,
        workspaceId,
      );

    if (!isWorkflowEnabled) {
      return;
    }

    const workflowEventListenerRepository =
      await this.twentyORMGlobalManager.getRepositoryForWorkspace<WorkflowEventListenerWorkspaceEntity>(
        workspaceId,
        'workflowEventListener',
      );

    const eventListeners = await workflowEventListenerRepository.find({
      where: {
        eventName,
      },
    });

    for (const eventListener of eventListeners) {
      this.messageQueueService.add<WorkflowEventTriggerJobData>(
        WorkflowEventTriggerJob.name,
        {
          workspaceId,
          workflowId: eventListener.workflowId,
          payload,
        },
        { retryLimit: 3 },
      );
    }
  }
}
