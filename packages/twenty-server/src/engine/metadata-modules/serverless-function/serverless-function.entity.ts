import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

export enum ServerlessFunctionSyncStatus {
  NOT_READY = 'NOT_READY',
  READY = 'READY',
}

export enum ServerlessFunctionRuntime {
  NODE18 = 'nodejs18.x',
}

@Entity('serverlessFunction')
@Unique('IndexOnNameAndWorkspaceIdUnique', ['name', 'workspaceId'])
export class ServerlessFunctionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: false })
  sourceCodeHash: string;

  @Column({ nullable: false })
  sourceCodeFullPath: string;

  @Column({ nullable: false, default: ServerlessFunctionRuntime.NODE18 })
  runtime: ServerlessFunctionRuntime;

  @Column({
    nullable: false,
    default: ServerlessFunctionSyncStatus.NOT_READY,
    type: 'enum',
    enum: ServerlessFunctionSyncStatus,
  })
  syncStatus: ServerlessFunctionSyncStatus;

  @Column({ nullable: false, type: 'uuid' })
  workspaceId: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
