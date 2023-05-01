export type User = {
  userID: string;
  email: string;
  name: string;
  avatarURL?: string;
};
export type Group = { id: string; name: string };
export type UserGroup = { user?: User; group?: Group };
export interface EntitiesResponse {
  results: UserGroup[];
}

export type Parameter = {
  slug: string;
  name: string;
  type:
    | "boolean"
    | "upload"
    | "date"
    | "datetime"
    | "float"
    | "integer"
    | "string";
  component?: "textarea" | "editor-sql";
  constraints: {
    optional: boolean;
    options?: { label: string; value: string }[];
  };
  desc?: string;
};

export interface TaskOrRunbookReviewersResponse {
  task?: {
    name: string;
    requireExplicitPermissions: boolean;
    triggers: { triggerID: string; kind: string }[];
    parameters: { parameters: Parameter[] };
  };
  runbook?: {
    name: string;
    isPrivate: boolean;
    triggers: { triggerID: string; kind: string }[];
    parameters: { parameters: Parameter[] };
  };
  reviewers: { userID?: string; groupID?: string }[];
}

export type View = {
  id: string;
  slug: string;
  archivedAt?: string;
  archivedBy?: string;
  name: string;
  description?: string;
  createdAt?: string;
  createdBy?: string;
  isLocal?: boolean;
};

export type TaskMetadata = {
  id: string;
  slug: string;
  isArchived?: boolean;
  isLocal?: boolean;
};
