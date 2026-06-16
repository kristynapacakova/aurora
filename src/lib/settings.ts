import { createServerClient } from "./supabase";

export type SettingKey = "client_password" | "zoom_link";

export async function getSetting(key: SettingKey): Promise<string> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("settings")
    .select("value")
    .eq("key", key)
    .single();

  if (error || !data) return "";
  return data.value as string;
}

export async function setSetting(key: SettingKey, value: string): Promise<void> {
  const supabase = createServerClient();
  await supabase
    .from("settings")
    .upsert({ key, value }, { onConflict: "key" });
}

export async function getAllSettings(): Promise<Record<SettingKey, string>> {
  const supabase = createServerClient();
  const { data } = await supabase.from("settings").select("key, value");

  const result: Record<string, string> = {
    client_password: "",
    zoom_link: "",
  };

  for (const row of data ?? []) {
    result[row.key as SettingKey] = row.value;
  }

  return result as Record<SettingKey, string>;
}
