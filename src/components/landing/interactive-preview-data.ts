import { addDays, addWeeks, format, startOfWeek } from "date-fns";

export type DemoScenario = "studio" | "salon" | "counselling";
export type DemoDevice = "desktop" | "mobile";
export type DemoLanguage = "sl" | "en";

export type DemoParticipant = { name: string; paid: boolean };

export type DemoAppointment = {
  id: string;
  date: string;
  hour: number;
  serviceId: string;
  customer: string;
  employee: string;
  paid: boolean;
  participants?: DemoParticipant[];
};

type Localized = Record<DemoLanguage, string>;
export type DemoService = {
  id: string;
  title: Localized;
  color: "blue" | "green" | "orange" | "violet";
};

export const demoScenarios: Record<DemoScenario, {
  label: Localized;
  business: Localized;
  employees: string[];
  services: DemoService[];
}> = {
  studio: {
    label: { sl: "Joga & pilates", en: "Yoga & Pilates" },
    business: { sl: "Studio Ravnovesje", en: "Balance Studio" },
    employees: ["Maja", "Eva", "Luka"],
    services: [
      { id: "pilates", title: { sl: "Pilates – skupinska vadba", en: "Pilates group class" }, color: "blue" },
      { id: "yoga", title: { sl: "Joga Flow", en: "Yoga Flow" }, color: "green" },
      { id: "reformer", title: { sl: "Pilates reformer", en: "Reformer Pilates" }, color: "violet" },
      { id: "private", title: { sl: "Individualna vadba", en: "Private session" }, color: "orange" },
    ],
  },
  salon: {
    label: { sl: "Frizerski salon", en: "Hair salon" },
    business: { sl: "Salon Studio", en: "Studio Salon" },
    employees: ["Tina", "Luka", "Sara"],
    services: [
      { id: "cut", title: { sl: "Žensko striženje", en: "Women's haircut" }, color: "blue" },
      { id: "colour", title: { sl: "Barvanje las", en: "Hair colouring" }, color: "violet" },
      { id: "men", title: { sl: "Moško striženje", en: "Men's haircut" }, color: "green" },
      { id: "style", title: { sl: "Oblikovanje pričeske", en: "Hair styling" }, color: "orange" },
    ],
  },
  counselling: {
    label: { sl: "Svetovalni center", en: "Counselling centre" },
    business: { sl: "Center Pogovor", en: "Dialogue Centre" },
    employees: ["Ana", "Nika", "Marko"],
    services: [
      { id: "individual", title: { sl: "Individualno svetovanje", en: "Individual counselling" }, color: "blue" },
      { id: "online", title: { sl: "Spletno svetovanje", en: "Online counselling" }, color: "green" },
      { id: "couples", title: { sl: "Partnersko svetovanje", en: "Couples counselling" }, color: "violet" },
      { id: "group", title: { sl: "Podporna skupina", en: "Support group" }, color: "orange" },
    ],
  },
};

type TemplateAppointment = Omit<DemoAppointment, "id" | "date"> & { day: number };

const classMembers: DemoParticipant[] = [
  { name: "Nina M.", paid: true },
  { name: "Tanja K.", paid: true },
  { name: "Eva P.", paid: true },
  { name: "Lara V.", paid: true },
  { name: "Maja Z.", paid: false },
  { name: "Sara R.", paid: true },
  { name: "Klara B.", paid: false },
];

const templates: Record<DemoScenario, TemplateAppointment[]> = {
  studio: [
    { day: 0, hour: 9, serviceId: "pilates", customer: "Skupinska vadba", employee: "Maja", paid: false, participants: classMembers },
    { day: 0, hour: 16, serviceId: "private", customer: "Petra N.", employee: "Luka", paid: true },
    { day: 1, hour: 10, serviceId: "reformer", customer: "Skupinska vadba", employee: "Eva", paid: false, participants: classMembers.slice(0, 5) },
    { day: 2, hour: 11, serviceId: "yoga", customer: "Skupinska vadba", employee: "Maja", paid: false, participants: classMembers.slice(1) },
    { day: 2, hour: 17, serviceId: "pilates", customer: "Skupinska vadba", employee: "Maja", paid: false, participants: classMembers },
    { day: 3, hour: 9, serviceId: "private", customer: "Marko T.", employee: "Luka", paid: false },
    { day: 3, hour: 17, serviceId: "reformer", customer: "Skupinska vadba", employee: "Eva", paid: false, participants: classMembers.slice(0, 5) },
    { day: 4, hour: 10, serviceId: "yoga", customer: "Skupinska vadba", employee: "Maja", paid: false, participants: classMembers },
    { day: 5, hour: 9, serviceId: "pilates", customer: "Skupinska vadba", employee: "Eva", paid: false, participants: classMembers },
  ],
  salon: [
    { day: 0, hour: 9, serviceId: "cut", customer: "Ana Novak", employee: "Tina", paid: true },
    { day: 0, hour: 11, serviceId: "men", customer: "Luka K.", employee: "Luka", paid: false },
    { day: 1, hour: 10, serviceId: "colour", customer: "Maja K.", employee: "Sara", paid: true },
    { day: 1, hour: 15, serviceId: "cut", customer: "Nika P.", employee: "Tina", paid: false },
    { day: 2, hour: 9, serviceId: "style", customer: "Eva R.", employee: "Sara", paid: true },
    { day: 2, hour: 13, serviceId: "cut", customer: "Petra N.", employee: "Tina", paid: false },
    { day: 3, hour: 10, serviceId: "colour", customer: "Tanja M.", employee: "Sara", paid: false },
    { day: 4, hour: 12, serviceId: "men", customer: "Marko Z.", employee: "Luka", paid: true },
    { day: 5, hour: 10, serviceId: "cut", customer: "Sara B.", employee: "Tina", paid: true },
  ],
  counselling: [
    { day: 0, hour: 9, serviceId: "individual", customer: "Stranka 001", employee: "Ana", paid: true },
    { day: 0, hour: 14, serviceId: "online", customer: "Stranka 002", employee: "Nika", paid: false },
    { day: 1, hour: 11, serviceId: "couples", customer: "Stranka 003", employee: "Marko", paid: true },
    { day: 2, hour: 10, serviceId: "online", customer: "Stranka 004", employee: "Nika", paid: false },
    { day: 2, hour: 16, serviceId: "individual", customer: "Stranka 005", employee: "Ana", paid: true },
    { day: 3, hour: 17, serviceId: "group", customer: "Podporna skupina", employee: "Marko", paid: false, participants: classMembers.slice(0, 5) },
    { day: 4, hour: 11, serviceId: "individual", customer: "Stranka 006", employee: "Ana", paid: false },
    { day: 5, hour: 9, serviceId: "online", customer: "Stranka 007", employee: "Nika", paid: true },
  ],
};

/** Entirely local, fictional demo appointments. Never fetch tenant or guest data. */
export const generateDemoAppointments = (scenario: DemoScenario, now = new Date()): DemoAppointment[] => {
  const monday = startOfWeek(now, { weekStartsOn: 1 });
  const appointments: DemoAppointment[] = [];
  // Keep past and future dates populated when a visitor explores the preview.
  for (let week = -6; week <= 12; week += 1) {
    templates[scenario].forEach((item, index) => {
      const { day, ...appointment } = item;
      appointments.push({
        ...appointment,
        id: scenario + "-" + week + "-" + index,
        date: format(addDays(addWeeks(monday, week), day), "yyyy-MM-dd"),
        participants: appointment.participants?.map((person) => ({ ...person })),
      });
    });
  }
  return appointments;
};
