import { Command, CommandRunner, Option } from 'nest-commander';

import { MigrateDomainNameFromTextToLinksCommand } from 'src/database/commands/upgrade-version/0-23/0-23-migrate-domain-to-links.command';
import { MigrateLinkFieldsToLinksCommand } from 'src/database/commands/upgrade-version/0-23/0-23-migrate-link-fields-to-links.command';
import { MigrateMessageChannelSyncStatusEnumCommand } from 'src/database/commands/upgrade-version/0-23/0-23-migrate-message-channel-sync-status-enum.command';
import { SetWorkspaceActivationStatusCommand } from 'src/database/commands/upgrade-version/0-23/0-23-set-workspace-activation-status.command';
import { UpdateActivitiesCommand } from 'src/database/commands/upgrade-version/0-23/0-23-update-activities.command';
import { UpdateFileFolderStructureCommand } from 'src/database/commands/upgrade-version/0-23/0-23-update-file-folder-structure.command';

interface UpdateTo0_23CommandOptions {
  workspaceId?: string;
}

@Command({
  name: 'upgrade-0.23',
  description: 'Upgrade to 0.23',
})
export class UpgradeTo0_23Command extends CommandRunner {
  constructor(
    private readonly updateFileFolderStructureCommandOptions: UpdateFileFolderStructureCommand,
    private readonly migrateLinkFieldsToLinks: MigrateLinkFieldsToLinksCommand,
    private readonly migrateDomainNameFromTextToLinks: MigrateDomainNameFromTextToLinksCommand,
    private readonly migrateMessageChannelSyncStatusEnumCommand: MigrateMessageChannelSyncStatusEnumCommand,
    private readonly setWorkspaceActivationStatusCommand: SetWorkspaceActivationStatusCommand,
    private readonly updateActivitiesCommand: UpdateActivitiesCommand,
  ) {
    super();
  }

  @Option({
    flags: '-w, --workspace-id [workspace_id]',
    description:
      'workspace id. Command runs on all active workspaces if not provided',
    required: false,
  })
  parseWorkspaceId(value: string): string {
    return value;
  }

  async run(
    _passedParam: string[],
    options: UpdateTo0_23CommandOptions,
  ): Promise<void> {
    await this.migrateLinkFieldsToLinks.run(_passedParam, options);
    await this.migrateDomainNameFromTextToLinks.run(_passedParam, options);
    await this.migrateMessageChannelSyncStatusEnumCommand.run(
      _passedParam,
      options,
    );
    await this.setWorkspaceActivationStatusCommand.run(_passedParam, options);
    await this.updateFileFolderStructureCommandOptions.run(
      _passedParam,
      options,
    );
    await this.updateActivitiesCommand.run(_passedParam, options);
  }
}
