import CodeStatsClient from "./stats-client";

export default async function StatsPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params; // FIX: unwrap params (server-side)

  return <CodeStatsClient code={code} />;
}
