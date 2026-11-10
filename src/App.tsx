import { FormEvent, ReactNode, useMemo, useState } from "react";

type Language = "da" | "en";
type Tab = "map" | "program" | "board";
type IconName =
  | "map"
  | "calendar"
  | "document"
  | "pin"
  | "clock"
  | "close"
  | "trash"
  | "warning"
  | "plus"
  | "send"
  | "chevron";

const colors = {
  amber: "#D4860F",
  red: "#C0392B",
  blue: "#2A6496",
  green: "#6B7F56",
  purple: "#725B8C",
  khaki: "#C4B48A",
};

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  const paths: Record<IconName, ReactNode> = {
    map: (
      <>
        <path d="m3 6 5-3 8 3 5-3v15l-5 3-8-3-5 3Z" />
        <path d="M8 3v15M16 6v15" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="1" />
        <path d="M16 3v4M8 3v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
      </>
    ),
    document: (
      <>
        <path d="M6 2h9l4 4v16H6Z" />
        <path d="M14 2v5h5M9 12h6M9 16h6" />
      </>
    ),
    pin: (
      <>
        <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    close: <path d="m6 6 12 12M18 6 6 18" />,
    trash: (
      <>
        <path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14M10 11v6M14 11v6" />
      </>
    ),
    warning: (
      <>
        <path d="M12 3 2.5 20h19Z" />
        <path d="M12 9v5M12 17.5h.01" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    send: (
      <>
        <path d="m3 11 18-8-7 18-3-7Z" />
        <path d="m11 14 4-5" />
      </>
    ),
    chevron: <path d="m9 18 6-6-6-6" />,
  };
  return <svg {...common}>{paths[name]}</svg>;
}

const copy = {
  da: {
    headerSub: "INFORMATIONSPLATFORM",
    nav: { map: "Kort", program: "Program", board: "Opslag" },
    page: {
      map: ["NAVIGATION", "KORTVISNING"],
      program: ["TIDSPLAN", "PROGRAM"],
      board: ["MEDDELELSER", "OPSLAGSTAVLE"],
    },
    mapHint: "Tryk på en bygning for at se information",
    location: "Placering",
    hours: "Åbningstider",
    close: "Luk",
    day: "DAG 1 — ANKOMST",
    newPost: "Opret nyt opslag",
    alert: "1 vigtig meddelelse — se nedenfor",
    noPosts: "Ingen opslag endnu",
    createTitle: "Nyt opslag",
    title: "Titel",
    message: "Besked",
    category: "Kategori",
    name: "Navn / Afdeling",
    send: "SEND OPSLAG",
    pinTitle: "Sikkerhedskode",
    pinSub: "Indtast PIN for at slette opslag",
    wrong: "Forkert kode",
    cancel: "Annuller",
    ok: "OK",
  },
  en: {
    headerSub: "INFORMATION PLATFORM",
    nav: { map: "Map", program: "Schedule", board: "Board" },
    page: {
      map: ["NAVIGATION", "SITE MAP"],
      program: ["TIMETABLE", "SCHEDULE"],
      board: ["MESSAGES", "NOTICE BOARD"],
    },
    mapHint: "Tap a building to view information",
    location: "Location",
    hours: "Opening hours",
    close: "Close",
    day: "DAY 1 — ARRIVAL",
    newPost: "Create new post",
    alert: "1 important message — see below",
    noPosts: "No posts yet",
    createTitle: "New post",
    title: "Title",
    message: "Message",
    category: "Category",
    name: "Name / Department",
    send: "SEND POST",
    pinTitle: "Security code",
    pinSub: "Enter PIN to delete post",
    wrong: "Incorrect code",
    cancel: "Cancel",
    ok: "OK",
  },
};

const buildingInfo = {
  Administration: {
    en: "Administration",
    descDa: "Kursusadministration, reception og hjælp til deltagere.",
    descEn: "Course administration, reception and participant support.",
    location: "Bygning 1 · Ved hovedporten / Main gate",
    hoursDa: "Hverdage 07:30–16:00",
    hoursEn: "Weekdays 07:30–16:00",
  },
  Spisemesse: {
    en: "Dining hall",
    descDa: "Fælles spisefaciliteter for alle kursister og instruktører. Husk adgangskort.",
    descEn:
      "Shared dining facilities for all course participants and instructors. Remember your access card.",
    location: "Bygning 4 · Messe / DFAC",
    hoursDa: "Morgen 06:30 | Frokost 12:00 | Aftensmad 18:00",
    hoursEn: "Breakfast 06:30 | Lunch 12:00 | Dinner 18:00",
  },
  Indkvartering: {
    en: "Accommodation",
    descDa: "Indkvartering i Barak A–D. Henvendelse ved depotet.",
    descEn: "Accommodation in Barracks A–D. Check in at the depot.",
    location: "Bygning 10–14A / Buildings 10–14A",
    hoursDa: "Døgnåbent",
    hoursEn: "Open 24 hours",
  },
  Skydebane: {
    en: "Shooting range",
    descDa: "Afspærret skydeområde. Adgang kun med instruktør.",
    descEn: "Restricted shooting range. Instructor access only.",
    location: "Østområdet / Eastern training area",
    hoursDa: "Ifølge program",
    hoursEn: "According to schedule",
  },
  Øvelsesplads: {
    en: "Training ground",
    descDa: "Udendørs areal til praktisk træning og øvelser.",
    descEn: "Outdoor area for practical training and exercises.",
    location: "Idræts- og paradeplads / Sports & parade ground",
    hoursDa: "Ifølge program",
    hoursEn: "According to schedule",
  },
  "Sanitær/Bad": {
    en: "Showers",
    descDa: "Toiletter, omklædning og badefaciliteter.",
    descEn: "Toilets, changing rooms and shower facilities.",
    location: "Bygning 10 / Building 10",
    hoursDa: "05:30–23:00",
    hoursEn: "05:30–23:00",
  },
};

const days = [
  ["9", "Man", "Mon"],
  ["10", "Tir", "Tue"],
  ["11", "Ons", "Wed"],
  ["12", "Tor", "Thu"],
  ["13", "Fre", "Fri"],
];

const events = [
  {
    time: "09:00",
    end: "11:30",
    titleDa: "Ankomst & Indkvartering",
    titleEn: "Arrival & Accommodation",
    typeDa: "Admin",
    typeEn: "Admin",
    placeDa: "Depot / Barak",
    placeEn: "Stores / Barracks",
    color: colors.khaki,
    descDa: "Registrering og udlevering af nøgle",
    descEn: "Registration and key collection",
  },
  {
    time: "12:00",
    end: "12:45",
    titleDa: "Frokost",
    titleEn: "Lunch",
    typeDa: "Måltid",
    typeEn: "Meal",
    placeDa: "Spisemesse",
    placeEn: "Dining hall",
    color: colors.amber,
  },
  {
    time: "13:00",
    end: "14:45",
    titleDa: "Velkomstbriefing",
    titleEn: "Welcome briefing",
    typeDa: "Undervisning",
    typeEn: "Instruction",
    placeDa: "Auditorium",
    placeEn: "Auditorium",
    color: colors.blue,
    descDa: "Introduktion, sikkerhed og ugens program",
    descEn: "Introduction, safety and the weekly programme",
  },
  {
    time: "15:00",
    end: "15:30",
    titleDa: "Pause",
    titleEn: "Break",
    typeDa: "Fritid",
    typeEn: "Free time",
    placeDa: "Kantine",
    placeEn: "Canteen",
    color: colors.green,
  },
  {
    time: "18:00",
    end: "18:45",
    titleDa: "Aftensmad",
    titleEn: "Dinner",
    typeDa: "Måltid",
    typeEn: "Meal",
    placeDa: "Spisemesse",
    placeEn: "Dining hall",
    color: colors.amber,
  },
  {
    time: "19:00",
    end: "22:15",
    titleDa: "Fritid",
    titleEn: "Free time",
    typeDa: "Fritid",
    typeEn: "Free time",
    placeDa: "Kantine / Barak",
    placeEn: "Canteen / Barracks",
    color: colors.green,
  },
  {
    time: "22:30",
    end: "06:00",
    titleDa: "Sluk / Ro",
    titleEn: "Lights out / Quiet",
    typeDa: "Ro / Sluk",
    typeEn: "Quiet",
    placeDa: "Barakker",
    placeEn: "Barracks",
    color: colors.purple,
  },
];

type Post = {
  id: number;
  titleDa: string;
  titleEn: string;
  category: "Generel" | "Vigtig" | "Info" | "Ændring";
  author: string;
  timestamp: string;
  bodyDa: string;
  bodyEn: string;
};

const initialPosts: Post[] = [
  {
    id: 1,
    titleDa: "Velkomst til kurset",
    titleEn: "Welcome to the course",
    category: "Info",
    author: "Kursussekretariatet",
    timestamp: "I dag, 08:14",
    bodyDa: "Velkommen til Hjemmeværnsskolen. Husk at bære synligt navneskilt under hele opholdet.",
    bodyEn:
      "Welcome to the Home Guard School. Please wear your name badge visibly throughout your stay.",
  },
  {
    id: 2,
    titleDa: "ÆNDRING: Skydebane rykket",
    titleEn: "CHANGE: Shooting range moved",
    category: "Vigtig",
    author: "Sergeant Møller",
    timestamp: "I dag, 10:32",
    bodyDa: "Eftermiddagens træning er flyttet til skydebane 2. Mødested og tidspunkt er uændret.",
    bodyEn:
      "This afternoon’s training has moved to shooting range 2. Meeting place and time are unchanged.",
  },
  {
    id: 3,
    titleDa: "Kantine åbningstider",
    titleEn: "Canteen opening hours",
    category: "Generel",
    author: "Kantinen",
    timestamp: "I går, 16:05",
    bodyDa: "Kantinen er åben alle kursusdage fra kl. 07:00 til 21:30.",
    bodyEn: "The canteen is open on all course days from 07:00 to 21:30.",
  },
];

function PageHeader({ label, title }: { label: string; title: string }) {
  return (
    <div className="page-heading">
      <span>{label}</span>
      <h1>{title}</h1>
    </div>
  );
}

function CampusMap({
  onSelect,
  selected,
}: {
  onSelect: (building: keyof typeof buildingInfo) => void;
  selected: keyof typeof buildingInfo | null;
}) {
  const interactive = (name: keyof typeof buildingInfo) => ({
    role: "button",
    tabIndex: 0,
    className: `map-building interactive ${selected === name ? "selected" : ""}`,
    onClick: () => onSelect(name),
    onKeyDown: (e: React.KeyboardEvent<SVGGElement>) => {
      if (e.key === "Enter" || e.key === " ") onSelect(name);
    },
  });
  return (
    <svg className="campus-map" viewBox="0 0 350 360" aria-label="Campus map">
      <rect width="350" height="360" fill="#10180c" />
      <path
        className="campus-ground"
        d="M8 40Q30 17 75 23L112 10Q142 4 163 22Q208 9 235 31Q289 29 327 65Q347 91 341 129Q356 163 337 192Q352 229 331 256Q344 300 308 326Q270 346 231 336Q194 354 157 341Q114 357 79 334Q33 332 22 296Q-2 270 13 231Q-4 196 14 164Q-2 127 18 98Q3 69 8 40Z"
      />
      <path
        className="map-lake"
        d="M0 16Q41-2 78 9Q111-7 145 9Q156 31 139 51Q111 68 81 56Q45 69 11 53Q-4 39 0 16Z"
      />
      <path
        className="tree-belt"
        d="M19 74Q55 56 98 70M175 38Q228 25 278 54M272 178Q321 160 334 126M33 278Q82 300 126 276M111 322Q158 300 197 322"
      />

      <g className="site-roads">
        <path d="M-8 343 45 286 102 250 168 251 229 281 288 306 355 294" />
        <path d="M45 286 34 224 57 174 94 135 137 102 184 75 231 52" />
        <path d="M57 174 112 195 170 175 216 139 290 128 343 145" />
        <path d="M102 250 128 215 170 175" />
        <path d="M168 251 193 214 254 190 329 192" />
        <path d="M229 281 254 238 306 219 329 192" />
        <path d="M94 135 56 109 25 119" />
      </g>
      <text x="9" y="333" className="road-label" transform="rotate(-40 9 333)">
        HOVEDVEJ
      </text>

      <g className="map-building">
        <rect x="44" y="91" width="47" height="29" />
        <text x="67.5" y="102">
          DHGS
        </text>
        <text x="67.5" y="113">
          5 / 5A / 39
        </text>
      </g>
      <g {...interactive("Administration")}>
        <rect x="18" y="263" width="70" height="36" />
        <text x="53" y="278">
          LEJRKONTOR
        </text>
        <text x="53" y="290">
          BYGNING 1
        </text>
      </g>

      {[
        [123, 63, "A", "10"],
        [174, 43, "B", "11"],
        [226, 34, "C", "12"],
        [211, 112, "D", "13"],
      ].map(([x, y, letter, number]) => (
        <g
          className={`map-building ${selected === "Indkvartering" ? "selected" : ""} interactive`}
          onClick={() => onSelect("Indkvartering")}
          key={String(letter)}
        >
          <rect x={Number(x)} y={Number(y)} width="38" height="44" />
          <text x={Number(x) + 19} y={Number(y) + 13}>{`BARAK ${letter}`}</text>
          <text x={Number(x) + 19} y={Number(y) + 24}>{`BYG. ${number}`}</text>
          {[0, 1].map((w) => (
            <rect
              className="window"
              x={Number(x) + 9 + w * 13}
              y={Number(y) + 32}
              width="7"
              height="6"
              key={w}
            />
          ))}
        </g>
      ))}

      <g className="map-building">
        <rect x="95" y="126" width="69" height="38" />
        <text x="129.5" y="141">
          KLASSE-
        </text>
        <text x="129.5" y="153">
          VÆR. 2 / 40
        </text>
      </g>
      <g className="map-building">
        <rect x="62" y="132" width="29" height="39" />
        <text x="76.5" y="146">
          KONTOR
        </text>
        <text x="76.5" y="158">
          8
        </text>
      </g>
      <g className="map-building">
        <rect x="165" y="116" width="40" height="38" />
        <text x="185" y="132">
          AUDITORIUM
        </text>
        <text x="185" y="144">
          14
        </text>
      </g>
      <g className="map-building">
        <rect x="259" y="225" width="64" height="37" />
        <text x="291" y="247">
          VÆRKSTED
        </text>
      </g>

      <g {...interactive("Øvelsesplads")}>
        <rect x="262" y="72" width="70" height="67" />
        <path className="training-lines" d="M269 80h56v50h-56ZM275 86l44 38M319 86l-44 38" />
        <text x="297" y="104">
          ØVELSES-
        </text>
        <text x="297" y="116">
          PLADS
        </text>
      </g>

      <g className="map-building">
        <rect x="169" y="179" width="52" height="34" />
        <text x="195" y="192">
          SYGE-
        </text>
        <text x="195" y="204">
          STUE
        </text>
        <path className="cross" d="M211 184h7M214.5 180.5v7" />
      </g>
      <g className="map-building">
        <rect x="214" y="273" width="58" height="36" />
        <text x="243" y="295">
          KANTINE
        </text>
      </g>
      <g {...interactive("Spisemesse")}>
        <rect x="89" y="181" width="72" height="46" />
        <text x="125" y="200">
          SPISEMESSE
        </text>
        <text x="125" y="214">
          BYG. 4 / DFAC
        </text>
      </g>
      <g {...interactive("Sanitær/Bad")}>
        <rect x="165" y="223" width="58" height="38" />
        <text x="194" y="238">
          SANITÆR
        </text>
        <text x="194" y="250">
          / BAD
        </text>
      </g>
      <g {...interactive("Skydebane")}>
        <path className="range" d="M284 164h60v26H284Z" />
        <text x="314" y="180">
          SKYDEBANE
        </text>
        {[322, 331, 340].map((x) => (
          <circle className="target" cx={x} cy="171" r="3" key={x} />
        ))}
      </g>

      <g className="flag-square">
        <rect x="225" y="175" width="49" height="39" />
        <circle cx="249.5" cy="194" r="5" />
        <path d="M249.5 189v-10l10 4-10 3" />
        <text x="249.5" y="209">
          FLAGPLADS
        </text>
      </g>
      <text x="15" y="312" className="map-gate-label">
        ← HOVEDPORT / MAIN GATE
      </text>
      <g className="compass" transform="translate(310 36)">
        <circle r="17" />
        <path d="M0-14 4 1 0-2-4 1Z" />
        <text y="-20">N</text>
      </g>
      <g className="scale" transform="translate(250 348)">
        <path d="M0 0h70M0-4v8M35-4v8M70-4v8" />
        <text x="35" y="-7">
          50 M
        </text>
      </g>
    </svg>
  );
}

function MapPage({ language }: { language: Language }) {
  const t = copy[language];
  const [selected, setSelected] = useState<keyof typeof buildingInfo | null>("Spisemesse");
  const info = selected ? buildingInfo[selected] : null;
  return (
    <main className="page">
      <PageHeader label={t.page.map[0]} title={t.page.map[1]} />
      <p className="page-hint">
        <Icon name="map" size={17} /> {t.mapHint}
      </p>
      <div className="map-frame">
        <CampusMap selected={selected} onSelect={setSelected} />
      </div>
      {selected && info && (
        <section className="building-card" aria-live="polite">
          <button
            className="icon-button close-button"
            onClick={() => setSelected(null)}
            aria-label={t.close}
          >
            <Icon name="close" size={20} />
          </button>
          <span className="eyebrow">BYGNING / BUILDING</span>
          <h2>{language === "da" ? selected : info.en}</h2>
          <p>{language === "da" ? info.descDa : info.descEn}</p>
          <div className="info-row">
            <Icon name="pin" size={18} />
            <div>
              <span>{t.location}</span>
              <strong>{info.location}</strong>
            </div>
          </div>
          <div className="info-row">
            <Icon name="clock" size={18} />
            <div>
              <span>{t.hours}</span>
              <strong>{language === "da" ? info.hoursDa : info.hoursEn}</strong>
            </div>
          </div>
        </section>
      )}
      <div className="quick-grid">
        {(Object.keys(buildingInfo) as (keyof typeof buildingInfo)[]).map((name, index) => (
          <button
            key={name}
            className={selected === name ? "active" : ""}
            onClick={() => setSelected(name)}
            aria-pressed={selected === name}
          >
            <i
              style={{
                background: [
                  colors.khaki,
                  colors.amber,
                  colors.green,
                  "#8B6844",
                  colors.red,
                  colors.blue,
                ][index],
              }}
            />
            <span>{language === "da" ? name : buildingInfo[name].en}</span>
            <Icon name="chevron" size={15} />
          </button>
        ))}
      </div>
    </main>
  );
}

function ProgramPage({ language }: { language: Language }) {
  const t = copy[language];
  const [activeDay, setActiveDay] = useState(0);
  return (
    <main className="page">
      <PageHeader label={t.page.program[0]} title={t.page.program[1]} />
      <div className="day-scroll" aria-label="Day selector">
        {days.map((day, index) => (
          <button
            key={day[0]}
            className={activeDay === index ? "active" : ""}
            onClick={() => setActiveDay(index)}
            aria-pressed={activeDay === index}
          >
            <strong>{day[0]}</strong>
            <span>{language === "da" ? day[1] : day[2]}</span>
          </button>
        ))}
      </div>
      <div className="day-title">
        <span>
          {activeDay === 0 ? t.day : `${language === "da" ? "DAG" : "DAY"} ${activeDay + 1}`}
        </span>
        <i />
      </div>
      {activeDay === 0 ? (
        <div className="timeline">
          {events.map((event) => (
            <div className="timeline-row" key={`${event.time}-${event.titleDa}`}>
              <time>{event.time}</time>
              <div className="timeline-axis">
                <i style={{ borderColor: event.color }} />
              </div>
              <article className="event-card" style={{ borderLeftColor: event.color }}>
                <div className="event-top">
                  <h2>{language === "da" ? event.titleDa : event.titleEn}</h2>
                  <span style={{ color: event.color, borderColor: event.color }}>
                    {language === "da" ? event.typeDa : event.typeEn}
                  </span>
                </div>
                <div className="event-meta">
                  <span>
                    <Icon name="pin" size={14} />{" "}
                    {language === "da" ? event.placeDa : event.placeEn}
                  </span>
                  <span>
                    <Icon name="clock" size={14} /> {event.time}–{event.end}
                  </span>
                </div>
                {event.descDa && <p>{language === "da" ? event.descDa : event.descEn}</p>}
              </article>
            </div>
          ))}
        </div>
      ) : (
        <div className="schedule-placeholder">
          <Icon name="calendar" size={38} />
          <h2>{language === "da" ? "Dagens program" : "Today’s schedule"}</h2>
          <p>
            {language === "da"
              ? "Programmet offentliggøres snart."
              : "The schedule will be published soon."}
          </p>
        </div>
      )}
    </main>
  );
}

function PostCard({
  post,
  language,
  onDelete,
}: {
  post: Post;
  language: Language;
  onDelete: () => void;
}) {
  const categoryLabels = {
    Generel: language === "da" ? "GENEREL" : "GENERAL",
    Vigtig: language === "da" ? "VIGTIG" : "IMPORTANT",
    Info: "INFO",
    Ændring: language === "da" ? "ÆNDRING" : "CHANGE",
  };
  const categoryColor = {
    Generel: colors.green,
    Vigtig: colors.red,
    Info: colors.blue,
    Ændring: colors.amber,
  }[post.category];
  return (
    <article className="post-card" style={{ borderLeftColor: categoryColor }}>
      <button className="icon-button post-delete" onClick={onDelete} aria-label="Delete post">
        <Icon name="trash" size={18} />
      </button>
      <span className="post-badge" style={{ background: categoryColor }}>
        {categoryLabels[post.category]}
      </span>
      <h2>{language === "da" ? post.titleDa : post.titleEn}</h2>
      <div className="post-byline">
        <strong>{post.author}</strong>
        <span>{post.timestamp}</span>
      </div>
      <p>{language === "da" ? post.bodyDa : post.bodyEn}</p>
    </article>
  );
}

function NewPostSheet({
  language,
  onClose,
  onSubmit,
}: {
  language: Language;
  onClose: () => void;
  onSubmit: (post: Post) => void;
}) {
  const t = copy[language];
  const [category, setCategory] = useState<Post["category"]>("Generel");

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const title = String(data.get("title"));
    const body = String(data.get("message"));
    const author = String(data.get("author"));
    onSubmit({
      id: Date.now(),
      titleDa: title,
      titleEn: title,
      bodyDa: body,
      bodyEn: body,
      category,
      author,
      timestamp: language === "da" ? "Netop nu" : "Just now",
    });
  }

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <section
        className="bottom-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-post-title"
      >
        <div className="drag-handle" />
        <div className="sheet-heading">
          <div>
            <span>OPSLAGSTAVLE / BOARD</span>
            <h2 id="new-post-title">{t.createTitle}</h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label={t.close}>
            <Icon name="close" />
          </button>
        </div>
        <form onSubmit={submit}>
          <label>
            <span>{t.title}</span>
            <input
              name="title"
              required
              placeholder={
                language === "da" ? "Skriv en kort overskrift" : "Write a short headline"
              }
            />
          </label>
          <label>
            <span>{t.message}</span>
            <textarea
              name="message"
              required
              rows={4}
              placeholder={language === "da" ? "Skriv din meddelelse…" : "Write your message…"}
            />
          </label>
          <fieldset>
            <legend>{t.category}</legend>
            <div className="category-chips">
              {(["Generel", "Vigtig", "Info", "Ændring"] as Post["category"][]).map((item) => (
                <button
                  type="button"
                  className={category === item ? "active" : ""}
                  onClick={() => setCategory(item)}
                  key={item}
                >
                  {item === "Vigtig"
                    ? "⚠ "
                    : item === "Info"
                      ? "ⓘ "
                      : item === "Ændring"
                        ? "↻ "
                        : ""}
                  {item}
                </button>
              ))}
            </div>
          </fieldset>
          <label>
            <span>{t.name}</span>
            <input
              name="author"
              required
              placeholder={language === "da" ? "Fx 2. Deling" : "E.g. 2nd Platoon"}
            />
          </label>
          <button className="submit-button" type="submit">
            <Icon name="send" size={19} /> {t.send}
          </button>
        </form>
      </section>
    </div>
  );
}

function PinDialog({
  language,
  onClose,
  onConfirm,
}: {
  language: Language;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const t = copy[language];
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  function checkPin() {
    if (pin === "2410") onConfirm();
    else setError(true);
  }
  return (
    <div
      className="overlay dialog-overlay"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <section className="pin-dialog" role="dialog" aria-modal="true">
        <div className="lock-mark">
          <span>PIN</span>
        </div>
        <h2>{t.pinTitle}</h2>
        <p>{t.pinSub}</p>
        <input
          autoFocus
          inputMode="numeric"
          type="password"
          maxLength={4}
          value={pin}
          onChange={(e) => {
            setPin(e.target.value.replace(/\D/g, ""));
            setError(false);
          }}
          onKeyDown={(e) => e.key === "Enter" && checkPin()}
          aria-label="PIN"
          placeholder="••••"
        />
        <div className={`pin-error ${error ? "visible" : ""}`}>{t.wrong}</div>
        <div className="dialog-actions">
          <button onClick={onClose}>{t.cancel}</button>
          <button onClick={checkPin}>{t.ok}</button>
        </div>
      </section>
    </div>
  );
}

function BoardPage({ language }: { language: Language }) {
  const t = copy[language];
  const [posts, setPosts] = useState(initialPosts);
  const [newPostOpen, setNewPostOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const importantCount = posts.filter((post) => post.category === "Vigtig").length;
  return (
    <main className="page">
      <PageHeader label={t.page.board[0]} title={t.page.board[1]} />
      <button className="new-post-button" onClick={() => setNewPostOpen(true)}>
        <Icon name="plus" /> {t.newPost}
      </button>
      {importantCount > 0 && (
        <div className="alert-banner">
          <Icon name="warning" size={21} />
          <strong>
            {language === "da"
              ? `${importantCount} vigtig${importantCount > 1 ? "e" : ""} meddelelse${importantCount > 1 ? "r" : ""} — se nedenfor`
              : `${importantCount} important message${importantCount > 1 ? "s" : ""} — see below`}
          </strong>
        </div>
      )}
      <div className="post-list">
        {posts.map((post) => (
          <PostCard
            post={post}
            language={language}
            onDelete={() => setDeleteId(post.id)}
            key={post.id}
          />
        ))}
      </div>
      {posts.length === 0 && (
        <div className="empty-state">
          <Icon name="document" size={50} />
          <p>{t.noPosts}</p>
        </div>
      )}
      {newPostOpen && (
        <NewPostSheet
          language={language}
          onClose={() => setNewPostOpen(false)}
          onSubmit={(post) => {
            setPosts((current) => [post, ...current]);
            setNewPostOpen(false);
          }}
        />
      )}
      {deleteId !== null && (
        <PinDialog
          language={language}
          onClose={() => setDeleteId(null)}
          onConfirm={() => {
            setPosts((current) => current.filter((post) => post.id !== deleteId));
            setDeleteId(null);
          }}
        />
      )}
    </main>
  );
}

export default function App() {
  const [language, setLanguage] = useState<Language>("da");
  const [activeTab, setActiveTab] = useState<Tab>("map");
  const t = copy[language];
  const page = useMemo(() => {
    if (activeTab === "map") return <MapPage language={language} />;
    if (activeTab === "program") return <ProgramPage language={language} />;
    return <BoardPage language={language} />;
  }, [activeTab, language]);

  const navItems: { id: Tab; icon: IconName }[] = [
    { id: "map", icon: "map" },
    { id: "program", icon: "calendar" },
    { id: "board", icon: "document" },
  ];

  return (
    <div className="app-shell">
      <header className="top-header">
        <div className="brand">
          <div className="shield">
            <span>HVS</span>
          </div>
          <div>
            <strong>HJEMMEVÆRNSSKOLEN</strong>
            <span>{t.headerSub}</span>
          </div>
        </div>
        <button
          className="language-button"
          onClick={() => setLanguage((current) => (current === "da" ? "en" : "da"))}
          aria-label={language === "da" ? "Switch to English" : "Skift til dansk"}
        >
          <span>{language === "da" ? "EN" : "DA"}</span>
        </button>
      </header>
      <div className="scroll-area">{page}</div>
      <nav className="bottom-nav" aria-label="Primary navigation">
        {navItems.map((item) => (
          <button
            className={activeTab === item.id ? "active" : ""}
            onClick={() => setActiveTab(item.id)}
            key={item.id}
            aria-current={activeTab === item.id ? "page" : undefined}
          >
            <Icon name={item.icon} size={22} />
            <span>{t.nav[item.id]}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
