import { AppBasePath } from "@/types/AppBasePath";

export enum AppPath {
  // Not logged-in
  SignInUp = `${AppBasePath.Auth}/sign-in`,
  Verify = `${AppBasePath.Auth}/verify`,
  SignIn = `${AppBasePath.Auth}/sign-in`,
  SignUp = `${AppBasePath.Auth}/sign-up`,
  Invite = `${AppBasePath.Auth}/invite/:workspaceInviteHash`,
  ResetPassword = `${AppBasePath.Auth}/reset-password/:passwordResetToken`,

  // Onboarding
  CreateWorkspace = '/create/workspace',
  CreateProfile = '/create/profile',
  SyncEmails = '/sync/emails',
  InviteTeam = '/invite-team',
  PlanRequired = '/plan-required',
  PlanRequiredSuccess = '/plan-required/payment-success',

  // Onboarded
  Index = '/',
  TasksPage = '/tasks',
  OpportunitiesPage = '/objects/opportunities',

  RecordIndexPage = '/objects/:objectNamePlural',
  RecordShowPage = '/object/:objectNameSingular/:objectRecordId',

  SettingsCatchAll = `/settings/*`,
  DevelopersCatchAll = `/developers/*`,

  // Impersonate
  Impersonate = '/impersonate/:userId',

  Authorize = '/authorize',

  // 404 page not found
  NotFoundWildcard = '*',
  NotFound = '/not-found',
}
