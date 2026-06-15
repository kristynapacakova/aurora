export type Lesson = {
  id: string;
  title: string;
  description: string;
  price: string;
};

export const lessons: Lesson[] = [
  {
    id: "single",
    title: "Jednotlivá lekce",
    description: "Vyzkoušejte si jednu lekci hatha nebo vinyasa jógy.",
    price: "250 Kč",
  },
  {
    id: "package-5",
    title: "Permanentka na 5 lekcí",
    description: "Pět lekcí dle vlastního výběru, platnost 2 měsíce.",
    price: "1 100 Kč",
  },
  {
    id: "package-10",
    title: "Permanentka na 10 lekcí",
    description: "Deset lekcí dle vlastního výběru, platnost 3 měsíce.",
    price: "2 000 Kč",
  },
  {
    id: "online",
    title: "Online členství / Studium",
    description: "Přístup do online studia s nahrávkami lekcí na měsíc.",
    price: "390 Kč / měsíc",
  },
];
