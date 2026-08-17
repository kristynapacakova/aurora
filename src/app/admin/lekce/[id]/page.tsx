import { notFound } from "next/navigation";
import { getLekci } from "@/lib/db";
import LekceForm from "@/components/admin/LekceForm";

export const dynamic = "force-dynamic";

export default async function UpravitLekciPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lekce = await getLekci(Number(id));
  if (!lekce) notFound();
  return <LekceForm initial={lekce} />;
}
