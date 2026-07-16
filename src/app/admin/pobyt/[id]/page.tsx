import { notFound } from "next/navigation";
import { getPobyt } from "@/lib/db";
import PobytForm from "@/components/admin/PobytForm";

export const dynamic = "force-dynamic";

export default async function UpravitPobytPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pobyt = await getPobyt(Number(id));
  if (!pobyt) notFound();
  return <PobytForm initial={pobyt} />;
}
