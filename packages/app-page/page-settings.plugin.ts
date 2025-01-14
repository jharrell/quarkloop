import { prisma } from "@/prisma/client";

import { generateId } from "@/lib/core/core.utilities";
import { createPlugin } from "@/lib/pipeline";
import {
  PipelineArgs,
  PipelineState,
  PluginStatusEntry,
} from "@/lib/core/pipeline";

import {
  GetAppPageSettingsByIdPluginArgs,
  GetAppPagesSettingsByAppIdPluginArgs,
  CreateAppPageSettingsPluginArgs,
  UpdateAppPageSettingsPluginArgs,
  DeleteAppPageSettingsPluginArgs,
} from "./page-settings.type";

/// GetAppPageSettingsById Plugin
export const GetAppPageSettingsByIdPlugin = createPlugin<
  PipelineState,
  PipelineArgs[]
>({
  name: "GetAppPageSettingsByIdPlugin",
  config: {},
  handler: async (state, config, ...args): Promise<PipelineState> => {
    if (state.status || state.session == null || state.user == null) {
      return state;
    }

    if (args.length === 0) {
      return {
        ...state,
        status: PluginStatusEntry.INTERNAL_SERVER_ERROR(
          "[GetAppPageSettingsByIdPlugin]"
        ),
      };
    }
    if (args[0].appPageSettings == null) {
      return {
        ...state,
        status: PluginStatusEntry.INTERNAL_SERVER_ERROR(
          "[GetAppPageSettingsByIdPlugin]"
        ),
      };
    }

    const getArgs = args[0].appPageSettings as GetAppPageSettingsByIdPluginArgs;
    const { user } = state.user;

    const record = await prisma.appPageSettings.findFirst({
      where: {
        id: getArgs.id,
        app: {
          userRoleAssignment: {
            every: {
              user: {
                id: user?.id,
              },
              workspace: {
                id: getArgs.workspaceId,
              },
              os: {
                id: getArgs.osId,
              },
            },
          },
        },
      },
    });

    if (record == null) {
      return {
        ...state,
        status: PluginStatusEntry.NOT_FOUND("[GetAppPageSettingsByIdPlugin]"),
      };
    }

    return {
      ...state,
      database: {
        ...state.database,
        appPageSettings: {
          records: record,
          totalRecords: 1,
        },
      },
    };
  },
});

/// GetAppPagesSettingsByAppId Plugin
export const GetAppPagesSettingsByAppIdPlugin = createPlugin<
  PipelineState,
  PipelineArgs[]
>({
  name: "GetAppPagesSettingsByAppIdPlugin",
  config: {},
  handler: async (state, config, ...args): Promise<PipelineState> => {
    if (state.status || state.session == null || state.user == null) {
      return state;
    }

    if (args.length === 0) {
      return {
        ...state,
        status: PluginStatusEntry.INTERNAL_SERVER_ERROR(
          "[GetAppPagesSettingsByAppIdPlugin]"
        ),
      };
    }
    if (args[0].appPageSettings == null) {
      return {
        ...state,
        status: PluginStatusEntry.INTERNAL_SERVER_ERROR(
          "[GetAppPagesSettingsByAppIdPlugin]"
        ),
      };
    }

    const getArgs = args[0]
      .appPageSettings as GetAppPagesSettingsByAppIdPluginArgs;
    const { user } = state.user;

    const records = await prisma.appPageSettings.findMany({
      where: {
        app: {
          id: getArgs.appId,
          userRoleAssignment: {
            every: {
              user: {
                id: user?.id,
              },
              workspace: {
                id: getArgs.workspaceId,
              },
              os: {
                id: getArgs.osId,
              },
            },
          },
        },
      },
    });

    return {
      ...state,
      database: {
        ...state.database,
        appPageSettings: {
          records: records,
          totalRecords: records.length,
        },
      },
    };
  },
});

/// CreateAppPageSettings Plugin
export const CreateAppPageSettingsPlugin = createPlugin<
  PipelineState,
  PipelineArgs[]
>({
  name: "CreateAppPageSettingsPlugin",
  config: {},
  handler: async (state, config, ...args): Promise<PipelineState> => {
    if (
      state.status ||
      state.session == null ||
      state.user == null ||
      state.user.subscription == null
    ) {
      return state;
    }

    if (args.length === 0) {
      return {
        ...state,
        status: PluginStatusEntry.INTERNAL_SERVER_ERROR(
          "[CreateAppPageSettingsPlugin]"
        ),
      };
    }
    if (args[0].appPageSettings == null) {
      return {
        ...state,
        status: PluginStatusEntry.INTERNAL_SERVER_ERROR(
          "[CreateAppPageSettingsPlugin]"
        ),
      };
    }

    const createArgs = args[0]
      .appPageSettings as CreateAppPageSettingsPluginArgs;

    const { user } = state.user;
    const { subscription } = state.user;

    const app = await prisma.app.findFirst({
      where: {
        id: createArgs.appId,
        userRoleAssignment: {
          every: {
            user: {
              id: user?.id,
            },
            workspace: {
              id: createArgs.workspaceId,
            },
            os: {
              id: createArgs.osId,
            },
          },
        },
      },
    });

    if (app == null) {
      return {
        ...state,
        status: PluginStatusEntry.NOT_FOUND(
          "[CreateAppPageSettingsPlugin] app not found"
        ),
      };
    }

    const appPageId = generateId();

    const record = await prisma.appPageSettings.create({
      data: {
        id: appPageId,
        name: createArgs.name!,
        entryPoint: createArgs.entryPoint!,
        content: createArgs.content!,
        app: {
          connect: {
            id: createArgs.appId,
          },
        },
        planMetrics: {
          create: {
            type: "AppPage",
            subscription: { connect: { id: subscription.id } },
            os: { connect: { id: createArgs.osId } },
            workspace: {
              connect: {
                osId_id: {
                  id: createArgs.workspaceId!,
                  osId: createArgs.osId,
                },
              },
            },
            app: { connect: { id: createArgs.appId } },
          },
        },
      },
    });

    return {
      ...state,
      database: {
        ...state.database,
        appPageSettings: {
          records: record,
          totalRecords: 1,
        },
      },
    };
  },
});

/// UpdateAppPageSettings Plugin
export const UpdateAppPageSettingsPlugin = createPlugin<
  PipelineState,
  PipelineArgs[]
>({
  name: "UpdateAppPageSettingsPlugin",
  config: {},
  handler: async (state, config, ...args): Promise<PipelineState> => {
    if (state.status || state.session == null || state.user == null) {
      return state;
    }

    if (args.length === 0) {
      return {
        ...state,
        status: PluginStatusEntry.INTERNAL_SERVER_ERROR(
          "[UpdateAppPageSettingsPlugin]"
        ),
      };
    }
    if (args[0].appPageSettings == null) {
      return {
        ...state,
        status: PluginStatusEntry.INTERNAL_SERVER_ERROR(
          "[UpdateAppPageSettingsPlugin]"
        ),
      };
    }
    const updateArgs = args[0]
      .appPageSettings as UpdateAppPageSettingsPluginArgs;
    const { user } = state.user;

    const record = await prisma.appPageSettings.updateMany({
      where: {
        id: updateArgs.id,
        app: {
          id: updateArgs.appId,
          userRoleAssignment: {
            every: {
              user: {
                id: user?.id,
              },
              workspace: {
                id: updateArgs.workspaceId,
              },
              os: {
                id: updateArgs.osId,
              },
            },
          },
        },
      },
      data: {
        ...(updateArgs.name && { name: updateArgs.name }),
        ...(updateArgs.content != null && { content: updateArgs.content }),
        ...(updateArgs.entryPoint && { entryPoint: updateArgs.entryPoint }),
        lastUpdate: updateArgs.lastUpdate,
      },
    });

    // TODO: following check may not work, investigate on alternatives
    if (record.count == 0) {
      return {
        ...state,
        status: PluginStatusEntry.NOT_FOUND("[UpdateAppPageSettingsPlugin]"),
      };
    }

    return state;
  },
});

/// DeleteAppPageSettings Plugin
export const DeleteAppPageSettingsPlugin = createPlugin<
  PipelineState,
  PipelineArgs[]
>({
  name: "DeleteAppPageSettingsPlugin",
  config: {},
  handler: async (state, config, ...args): Promise<PipelineState> => {
    if (state.status || state.session == null || state.user == null) {
      return state;
    }

    if (args.length === 0) {
      return {
        ...state,
        status: PluginStatusEntry.INTERNAL_SERVER_ERROR(
          "[DeleteAppPageSettingsPlugin]"
        ),
      };
    }
    if (args[0].appPageSettings == null) {
      return {
        ...state,
        status: PluginStatusEntry.INTERNAL_SERVER_ERROR(
          "[DeleteAppPageSettingsPlugin]"
        ),
      };
    }
    const deleteArgs = args[0]
      .appPageSettings as DeleteAppPageSettingsPluginArgs;
    const { user } = state.user;

    const record = await prisma.appPageSettings.deleteMany({
      where: {
        id: deleteArgs.id,
        app: {
          id: deleteArgs.appId,
          userRoleAssignment: {
            every: {
              user: {
                id: user?.id,
              },
              workspace: {
                id: deleteArgs.workspaceId,
              },
              os: {
                id: deleteArgs.osId,
              },
            },
          },
        },
      },
    });

    if (record.count === 0) {
      return {
        ...state,
        status: PluginStatusEntry.NOT_FOUND("[DeleteAppPageSettingsPlugin]"),
      };
    }

    return state;
  },
});
