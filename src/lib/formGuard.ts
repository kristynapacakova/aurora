import { checkRateLimit, clientIp } from "./rateLimit";

export { HONEYPOT_FIELD, isHoneypotTripped } from "./honeypot";

export function clamp(value: string, max: number): string {
  return value.length > max ? value.slice(0, max) : value;
}

// Společný limit pro veřejné formuláře (newsletter, poptávky, čekací
// listina, dárkové poukazy) — pár desítek odeslání za hodinu z jedné IP
// je naprosto v pořádku pro reálnou návštěvnici, ale zastaví hromadné
// zaplavení databáze nebo e-mailové kvóty.
export function checkFormRateLimit(request: Request, formKey: string): boolean {
  return checkRateLimit(`form:${formKey}:${clientIp(request)}`, 8, 60 * 60 * 1000);
}
