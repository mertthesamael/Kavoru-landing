export type FeatureId =
  | "auth"
  | "prisma"
  | "otel"
  | "sentry"
  | "kafka"
  | "websocket"
  | "resend"
  | "cron"
  | "docker";

export type FeatureDef = {
  id: FeatureId;
  label: string;
  description: string;
};

export const OPTIONAL_FEATURES: FeatureDef[] = [
  {
    id: "auth",
    label: "JWT Authentication",
    description: "Bearer auth, sign-in route, protected routes",
  },
  {
    id: "prisma",
    label: "Prisma + PostgreSQL",
    description: "Prisma 7 config, migrations, seed scripts",
  },
  {
    id: "otel",
    label: "OpenTelemetry",
    description: "OTLP tracing with Bun-compatible exporter",
  },
  {
    id: "sentry",
    label: "Sentry + Spotlight",
    description: "Error monitoring and local Spotlight UI",
  },
  {
    id: "kafka",
    label: "Kafka",
    description: "Producer, consumer, and example HTTP endpoints",
  },
  {
    id: "websocket",
    label: "WebSockets",
    description: "Validated real-time connections with rooms",
  },
  {
    id: "resend",
    label: "Resend Email",
    description: "Transactional email via sendEmail()",
  },
  {
    id: "cron",
    label: "Cron Jobs",
    description: "Scheduled tasks via @elysiajs/cron",
  },
  {
    id: "docker",
    label: "Docker",
    description: "Dockerfile and Docker Compose stack",
  },
];

export const FEATURE_IDS = OPTIONAL_FEATURES.map((f) => f.id);

export type FeatureSelection = Record<FeatureId, boolean>;

export function allFeaturesEnabled(): FeatureSelection {
  return Object.fromEntries(FEATURE_IDS.map((id) => [id, true])) as FeatureSelection;
}

export function minimalFeatures(): FeatureSelection {
  return Object.fromEntries(FEATURE_IDS.map((id) => [id, false])) as FeatureSelection;
}

export function enabledFeatureIds(selection: FeatureSelection): FeatureId[] {
  return FEATURE_IDS.filter((id) => selection[id]);
}

export function formatFeatureSelection(selection: FeatureSelection): string {
  const enabled = enabledFeatureIds(selection);
  if (enabled.length === 0) return "core only";
  return enabled.join(", ");
}

export function buildScaffoldFlags(selection: FeatureSelection): string {
  const enabled = enabledFeatureIds(selection);
  if (enabled.length === FEATURE_IDS.length) return "";
  if (enabled.length === 0) return " --minimal";
  return ` --features ${enabled.join(",")}`;
}

export function buildScaffoldCommand(
  selection: FeatureSelection,
  projectName = "my-api",
): string {
  return `bunx kavoru@latest ${projectName.trim() || "my-api"}${buildScaffoldFlags(selection)}`;
}
