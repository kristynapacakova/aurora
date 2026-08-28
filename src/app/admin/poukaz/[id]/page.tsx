import { notFound } from "next/navigation";
import { getPoukazNabidka } from "@/lib/db";
import PoukazNabidkaForm from "@/components/admin/PoukazNabidkaForm";

export const dynamic = "force-dynamic";

export default async function UpravitPoukazPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const nabidka = await getPoukazNabidka(Number(id));
  if (!nabidka) notFound();
  return <PoukazNabidkaForm initial={nabidka} />;
}
