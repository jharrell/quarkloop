import { AppFileSettings as PrismaAppFileSettings } from "@prisma/client";
import { ApiResponse } from "@/lib/core/pipeline";

/// Types
export interface AppFileSettings extends Partial<PrismaAppFileSettings> {}

export type AppFileSettingsPluginArgs =
  | GetAppFileSettingsByIdPluginArgs
  | GetAppFileSettingsByAppIdPluginArgs
  | CreateAppFileSettingsPluginArgs
  | UpdateAppFileSettingsPluginArgs
  | DeleteAppFileSettingsPluginArgs;

/// GetAppFileSettingsById
export interface GetAppFileSettingsById {}
export interface GetAppFileSettingsByIdApiResponse extends ApiResponse {}
export interface GetAppFileSettingsByIdApiArgs {
  id: string;
  osId: string;
  workspaceId: string;
  appId: string;
}
export interface GetAppFileSettingsByIdPluginArgs
  extends GetAppFileSettingsByIdApiArgs {}

/// GetAppFileSettingsByAppId
export interface GetAppFileSettingsByAppId {}
export interface GetAppFileSettingsByAppIdApiResponse extends ApiResponse {}
export interface GetAppFileSettingsByAppIdApiArgs {
  osId: string;
  workspaceId: string;
  appId: string;
}
export interface GetAppFileSettingsByAppIdPluginArgs
  extends GetAppFileSettingsByAppIdApiArgs {}

/// CreateAppFileSettings
export interface CreateAppFileSettings {}
export interface CreateAppFileSettingsApiResponse extends ApiResponse {}
export interface CreateAppFileSettingsApiArgs extends Partial<AppFileSettings> {
  osId: string;
  workspaceId: string;
  appId: string;
}
export interface CreateAppFileSettingsPluginArgs
  extends CreateAppFileSettingsApiArgs {}

/// UpdateAppFileSettings
export interface UpdateAppFileSettings {}
export interface UpdateAppFileSettingsApiResponse extends ApiResponse {}
export interface UpdateAppFileSettingsApiArgs extends Partial<AppFileSettings> {
  id: string;
  osId: string;
  workspaceId: string;
  appId: string;
}
export interface UpdateAppFileSettingsPluginArgs
  extends UpdateAppFileSettingsApiArgs {}

/// DeleteAppFileSettings
export interface DeleteAppFileSettings {}
export interface DeleteAppFileSettingsApiResponse extends ApiResponse {}
export interface DeleteAppFileSettingsApiArgs {
  id: string;
  osId: string;
  workspaceId: string;
  appId: string;
}
export interface DeleteAppFileSettingsPluginArgs
  extends DeleteAppFileSettingsApiArgs {}
