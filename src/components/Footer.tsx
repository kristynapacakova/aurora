export default function Footer() {
  return (
    <footer id="kontakt" className="border-t border-line bg-background py-12">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-6 text-center">
        <p className="font-serif text-2xl">AURORA jóga</p>
        <p className="text-sm text-foreground/70">
          info@aurorajoga.cz · +420 123 456 789
        </p>
        <p className="text-sm text-foreground/70">Studio Praha, Vinohrady</p>
        <p className="mt-6 text-xs text-foreground/40">
          © {new Date().getFullYear()} AURORA jóga. Všechna práva vyhrazena.
        </p>
      </div>
    </footer>
  );
}
