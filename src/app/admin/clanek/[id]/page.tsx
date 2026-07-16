import { notFound } from "next/navigation";
import { getClanek } from "@/lib/db";
import ClanekForm from "@/components/admin/ClanekForm";

export const dynamic = "force-dynamic";

export default async function UpravitClanekPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const clanek = await getClanek(Number(id));
  if (!clanek) notFound();
  return <ClanekForm initial={clanek} />;
}
