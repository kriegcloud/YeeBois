
export const ORG_ROLES = ["admin", "member"] as const;

export type OrgRole = typeof ORG_ROLES[number];