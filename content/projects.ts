import type { I18nList, I18nText } from "@/lib/i18n";

/**
 * The eight projects of Souhail Mharrech's "Selected works 2026" portfolio.
 *
 * Every description here is drawn from his own text in that document. Nothing
 * is invented — in particular there are no surfaces, budgets or client names,
 * because the portfolio gives none.
 *
 * TODO — confirm with the architect. These are inferred, not documented:
 *   · `year` for every project except Le stade (his PFE, promotion July 2025).
 *     The studio semesters (S6, S8, S9, S10) give the sequence but not the date.
 *   · `location` for Dar el hayat and Parking sous-sol, shown as "Nord du Maroc"
 *     because the portfolio does not name the site.
 */

/**
 * Four families, not eight. With a register this size a category per project
 * would give every filter a single result, which is no filter at all. The
 * precise programme is carried on each project instead.
 */
export const categories = ["equipment", "lodging", "urban", "reuse"] as const;

export type Category = (typeof categories)[number];

export const categoryLabels: Record<Category, I18nText> = {
  equipment: { fr: "Équipement public", en: "Public buildings" },
  lodging: { fr: "Hébergement", en: "Accommodation" },
  urban: { fr: "Urbain et infrastructure", en: "Urban and infrastructure" },
  reuse: { fr: "Réhabilitation", en: "Adaptive reuse" },
};

export type GalleryItem = {
  src: string | null;
  caption: I18nText;
  /** "wide" spans the full measure, "tall" sits in a half column. */
  shape: "wide" | "tall";
};

export type Project = {
  slug: string;
  /** Position in the portfolio. */
  ref: string;
  title: string;
  category: Category;
  programme: I18nText;
  location: I18nText;
  year: string;
  /** How the project came about: thesis, studio, or work placement. */
  frame: I18nText;
  /** What he did on it. */
  role: I18nText;
  summary: I18nText;
  body: I18nList;
  cover: string | null;
  gallery: GalleryItem[];
  featured: boolean;
};

export const projects: Project[] = [
  {
    slug: "le-stade",
    ref: "01",
    title: "Le stade",
    category: "equipment",
    programme: {
      fr: "Reconversion du Grand Stade de Tanger",
      en: "Conversion of the Grand Stade de Tanger",
    },
    location: { fr: "Tanger", en: "Tangier" },
    year: "2025",
    frame: { fr: "Projet de fin d'études", en: "Final-year thesis" },
    role: { fr: "Intégralité du projet", en: "Sole author" },
    summary: {
      fr: "Rendre le Grand Stade de Tanger utile toute l'année, et non douze soirs par saison.",
      en: "Making the Grand Stade de Tanger useful all year, not twelve nights a season.",
    },
    body: {
      fr: [
        "Les grands stades posent un problème économique simple : ils coûtent en permanence et ne servent qu'épisodiquement. Passée la compétition qui les a fait construire, ils restent debout, vides, et pèsent sur la collectivité qui les entretient.",
        "Le projet prend le Grand Stade de Tanger comme cas d'étude et propose la multifonctionnalité comme réponse. Autour et sous les gradins viennent s'installer des fonctions qui vivent hors saison : commerces, salle de sport, cinéma, piste de bowling, salle de jeux, patinoire, musée du stade. L'enceinte devient un équipement de quartier qui se remplit les jours sans match.",
        "L'étude a porté sur l'intégralité du projet — analyse du site et de l'histoire de l'enceinte, plan masse, programmation des niveaux, coupes et images. Elle prolonge une expérience de terrain : la participation au chantier du Grand Stade de Tanger, en suivi de chantier, coordination et préparation des dossiers de consultation.",
      ],
      en: [
        "Large stadiums pose a simple economic problem: they cost money continuously and are used only occasionally. Once the tournament that built them has passed, they stand empty and weigh on whoever maintains them.",
        "The project takes the Grand Stade de Tanger as its case and proposes multifunctionality as the answer. Around and beneath the stands sit uses that live out of season: shops, a gym, a cinema, a bowling alley, a games room, an ice rink, a stadium museum. The bowl becomes a neighbourhood facility that fills on days without a match.",
        "The study covered the whole project — site and stadium history, masterplan, programming of each level, sections and images. It follows on from time on site: working on the construction of the Grand Stade de Tanger, on site supervision, coordination and tender documentation.",
      ],
    },
    cover: "/projects/le-stade-cover.jpg",
    gallery: [
      { src: "/projects/le-stade-01.jpg", shape: "wide", caption: { fr: "Plan masse : le stade et les équipements qui l'entourent", en: "Masterplan: the stadium and the facilities around it" } },
      { src: "/projects/le-stade-04.jpg", shape: "wide", caption: { fr: "Galerie commerciale sous les gradins", en: "Retail concourse beneath the stands" } },
      { src: "/projects/le-stade-03.jpg", shape: "tall", caption: { fr: "Axonométrie éclatée des niveaux", en: "Exploded axonometric of the levels" } },
      { src: "/projects/le-stade-05.jpg", shape: "tall", caption: { fr: "Insertion dans le grand paysage de Tanger", en: "Set into the wider landscape of Tangier" } },
      { src: "/projects/le-stade-02.jpg", shape: "wide", caption: { fr: "Coupe transversale", en: "Cross-section" } },
    ],
    featured: true,
  },
  {
    slug: "hotel-azla",
    ref: "02",
    title: "Hôtel 5 étoiles",
    category: "lodging",
    programme: { fr: "Équipement hôtelier", en: "Hotel" },
    location: { fr: "Azla, Tétouan", en: "Azla, Tétouan" },
    year: "2023",
    frame: { fr: "Atelier S8", en: "Studio S8" },
    role: { fr: "Projet individuel", en: "Individual project" },
    summary: {
      fr: "Une façade en zig-zag, parce qu'une ligne brisée est plus longue qu'une ligne droite.",
      en: "A zig-zag façade, because a broken line is longer than a straight one.",
    },
    body: {
      fr: [
        "La parcelle est enclavée entre la courbe de la mer et les montagnes qui ferment l'arrière-plan d'Azla. Son atout est le front de mer ; tout le projet consiste à en tirer le maximum.",
        "D'où le parti : replier la façade principale en zig-zag pour allonger son développé et multiplier les chambres qui voient la mer. Les volumes se décalent ensuite les uns par rapport aux autres pour dégager des terrasses sur le front maritime, et le mouvement de l'ensemble suit celui de l'aménagement de la corniche.",
        "Le règlement fixait le cadre : CUS de 0,4, hauteur maximale de 15 mètres, recul de 4 mètres, parcelle minimale d'un hectare. Une ouverture zénithale éclaire le cœur du bâtiment et un porche marque l'entrée.",
      ],
      en: [
        "The site is caught between the curve of the sea and the mountains closing the background at Azla. Its asset is the sea frontage, and the whole project is about taking as much of it as possible.",
        "Hence the move: folding the main façade into a zig-zag to lengthen its run and multiply the rooms that see the water. The volumes then step past one another to open terraces towards the sea, and the movement of the whole follows that of the corniche.",
        "Planning set the frame: a plot ratio of 0.4, a 15-metre height limit, a 4-metre setback and a one-hectare minimum plot. A rooflight brings daylight to the core, and a porch marks the entrance.",
      ],
    },
    cover: "/projects/hotel-azla-cover.jpg",
    gallery: [
      { src: "/projects/hotel-azla-01.jpg", shape: "wide", caption: { fr: "La façade en zig-zag, de nuit", en: "The zig-zag façade at night" } },
    ],
    featured: false,
  },
  {
    slug: "cinquieme-facade",
    ref: "03",
    title: "5ème façade",
    category: "equipment",
    programme: {
      fr: "École de deuxième chance",
      en: "Second-chance school",
    },
    location: { fr: "M'hannech, Tétouan", en: "M'hannech, Tétouan" },
    year: "2022",
    frame: { fr: "Atelier S6", en: "Studio S6" },
    role: { fr: "Projet individuel", en: "Individual project" },
    summary: {
      fr: "La toiture rendue au public : un passage entre deux quartiers que la topographie sépare.",
      en: "The roof given back to the public: a route between two districts the topography keeps apart.",
    },
    body: {
      fr: [
        "Le point fort du site est sa topographie, et c'est aussi son problème : la pente forme une limite entre l'est et l'ouest du M'hannech, deux sous-quartiers importants qui communiquent mal.",
        "Le projet fait de l'école le franchissement qui manquait. Une liaison publique traverse la parcelle et passe sur le bâtiment — la cinquième façade, la toiture, devient sol praticable et rend au quartier le terrain que l'équipement occupe.",
        "Reste la question difficile : établir ce passage sans compromettre la sécurité ni l'intimité de l'établissement. Les deux régimes, l'école et la rue, sont tenus séparés en section plutôt qu'en plan.",
      ],
      en: [
        "The site's strength is its topography, and that is also its problem: the slope forms a boundary between east and west M'hannech, two substantial districts that connect poorly.",
        "The project makes the school the crossing that was missing. A public route runs through the plot and over the building — the fifth façade, the roof, becomes walkable ground and gives the neighbourhood back the land the school occupies.",
        "The hard part is establishing that route without compromising the security or the privacy of the school. The two regimes, school and street, are kept apart in section rather than in plan.",
      ],
    },
    cover: "/projects/cinquieme-facade-cover.jpg",
    gallery: [
      { src: "/projects/cinquieme-facade-01.jpg", shape: "wide", caption: { fr: "Plan masse", en: "Masterplan" } },
    ],
    featured: false,
  },
  {
    slug: "hybride-urbain",
    ref: "04",
    title: "L'hybride urbain",
    category: "urban",
    programme: { fr: "Projet urbain", en: "Urban project" },
    location: { fr: "Médina et Ensanche, Tétouan", en: "Medina and Ensanche, Tétouan" },
    year: "2024",
    frame: { fr: "Atelier S9", en: "Studio S9" },
    role: { fr: "Travail en binôme", en: "Work in a pair" },
    summary: {
      fr: "Coudre la Médina à l'Ensanche par un vide : une centrale verte dans un quartier qui n'en a pas.",
      en: "Stitching the Medina to the Ensanche with a void: a green heart in a district that has none.",
    },
    body: {
      fr: [
        "Tétouan juxtapose deux tissus urbains qui ne se ressemblent pas et ne se parlent guère : la Médina et l'Ensanche. Le projet cherche à les marier plutôt qu'à les opposer.",
        "L'Hybride urbain s'installe entre les deux comme une centrale verte, dans un quartier dépourvu d'espaces plantés et de lieux de repos au calme. Le vide devient l'élément de liaison : c'est lui qui appartient aux deux côtés.",
        "Le projet mêle les activités et les publics — un passage, un parc, des équipements — et s'appuie sur la topographie pour relier des niveaux que la ville avait laissés séparés.",
      ],
      en: [
        "Tétouan sets two unlike urban fabrics side by side, and they barely speak: the Medina and the Ensanche. The project tries to marry them rather than oppose them.",
        "The Urban Hybrid sits between the two as a green heart, in a district with no planted space and nowhere quiet to stop. The void becomes the connective element: it is the part that belongs to both sides.",
        "The project mixes uses and publics — a route, a park, facilities — and works with the topography to link levels the city had left apart.",
      ],
    },
    cover: "/projects/hybride-urbain-cover.jpg",
    gallery: [
      { src: "/projects/hybride-urbain-02.jpg", shape: "tall", caption: { fr: "La passerelle et le parc", en: "The footbridge and the park" } },
      { src: "/projects/hybride-urbain-03.jpg", shape: "tall", caption: { fr: "Le parc, la Médina en fond", en: "The park, with the Medina behind" } },
      { src: "/projects/hybride-urbain-01.jpg", shape: "wide", caption: { fr: "Le téléphérique et le franchissement", en: "The cable car and the crossing" } },
      { src: "/projects/hybride-urbain-04.jpg", shape: "wide", caption: { fr: "Coupe axonométrique sur le programme", en: "Axonometric section through the programme" } },
    ],
    featured: true,
  },
  {
    slug: "dar-el-hayat",
    ref: "05",
    title: "Dar el hayat",
    category: "lodging",
    programme: { fr: "Hébergement et résidence", en: "Accommodation and residence" },
    location: { fr: "Nord du Maroc", en: "Northern Morocco" },
    year: "2024",
    frame: { fr: "Projet de stage · consultation", en: "Work placement · competition entry" },
    role: { fr: "Conception", en: "Design" },
    summary: {
      fr: "Un patio central pour se protéger du dehors, et une progression de la rue jusqu'au calme des chambres.",
      en: "A central patio to shut out the street, and a progression from the road to the quiet of the rooms.",
    },
    body: {
      fr: [
        "La consultation demandait d'offrir aux usagers les meilleures conditions possibles. Le projet se protège de l'extérieur en s'ouvrant vers l'intérieur : un patio central autour duquel tout s'organise.",
        "Les espaces publics sont regroupés près de l'accès principal pour que la circulation reste courte et lisible. Les chambres, elles, sont reportées au fond de la parcelle : on y arrive après un parcours, et elles gardent leur intimité et leur tranquillité.",
        "L'entrée se fait en chicane, la symétrie est marquée par le parcours de l'eau, et les hauteurs sont modulées pour répondre au programme — une résidence de quatre niveaux à l'est, des vues dégagées vers le sud et la forêt au loin, et des décrochements qui protègent du vis-à-vis avec les voisins.",
      ],
      en: [
        "The brief asked for the best possible conditions for users. The project shuts out the surroundings by opening inwards: a central patio around which everything is arranged.",
        "Public spaces are gathered near the main entrance so circulation stays short and legible. The rooms are pushed to the back of the plot: you reach them after a journey, and they keep their privacy and their quiet.",
        "Entry is on a dog-leg, the axis is marked by the run of water, and heights are modulated to suit the brief — a four-storey residence to the east, open views south towards the forest, and steps in the massing that shield the rooms from the neighbours.",
      ],
    },
    cover: "/projects/dar-el-hayat-cover.jpg",
    gallery: [
      { src: "/projects/dar-el-hayat-01.jpg", shape: "wide", caption: { fr: "Les jardins créés entre les volumes", en: "The gardens made between the volumes" } },
      { src: "/projects/dar-el-hayat-02.jpg", shape: "wide", caption: { fr: "L'accueil, près de l'accès principal", en: "Reception, close to the main entrance" } },
    ],
    featured: true,
  },
  {
    slug: "parking-sous-sol",
    ref: "06",
    title: "Parking sous-sol",
    category: "urban",
    programme: { fr: "Parking en sous-sol", en: "Underground car park" },
    location: { fr: "Nord du Maroc", en: "Northern Morocco" },
    year: "2024",
    frame: { fr: "Projet de stage · consultation", en: "Work placement · competition entry" },
    role: { fr: "Conception", en: "Design" },
    summary: {
      fr: "Enterrer le stationnement sans confisquer la place : l'Achoura et la prière de l'Aïd continuent au-dessus.",
      en: "Burying the parking without taking the square: Achoura and the Eid prayer carry on above it.",
    },
    body: {
      fr: [
        "La consultation portait sur la réalisation d'un parking en sous-sol. La contrainte réelle n'était pas le stationnement mais ce qu'il y a dessus : une place publique et tous les usages qu'elle porte.",
        "L'étude a donc commencé par relever ces usages plutôt que par dessiner des places de voiture — l'occupation ordinaire de la place, le rassemblement de l'Achoura, la prière de l'Aïd. Chacun impose une emprise libre différente.",
        "Le projet place les circulations verticales et les émergences techniques là où elles ne coupent aucun de ces usages, et laisse la place se refermer sur elle-même une fois le chantier fini.",
      ],
      en: [
        "The brief was for an underground car park. The real constraint was not the parking but what sits on top of it: a public square and everything it carries.",
        "So the study began by surveying those uses rather than drawing car bays — the square on an ordinary day, the Achoura gathering, the Eid prayer. Each one demands a different clear area.",
        "The project puts the vertical circulation and the plant emerging at ground level where they interrupt none of those uses, and lets the square close over itself once the works are done.",
      ],
    },
    cover: "/projects/parking-sous-sol-cover.jpg",
    gallery: [
      { src: "/projects/parking-sous-sol-02.jpg", shape: "wide", caption: { fr: "L'entrée du parking", en: "The car park entrance" } },
    ],
    featured: false,
  },
  {
    slug: "gare-routiere",
    ref: "07",
    title: "Gare routière",
    category: "reuse",
    programme: {
      fr: "Réaménagement de l'ancienne gare routière",
      en: "Adaptive reuse of the former bus station",
    },
    location: { fr: "Tétouan", en: "Tétouan" },
    year: "2024",
    frame: { fr: "Projet de stage", en: "Work placement" },
    role: { fr: "Conception", en: "Design" },
    summary: {
      fr: "L'ancienne gare routière de Tétouan reprise en parking public et en maison d'artiste.",
      en: "Tétouan's former bus station taken back as public parking and an artists' house.",
    },
    body: {
      fr: [
        "L'ancienne gare routière de Tétouan avait perdu sa fonction sans perdre sa place dans la ville. Le projet la réemploie plutôt que de la remplacer : un parking public d'un côté, une maison d'artiste de l'autre.",
        "Le bâtiment appartient au tissu de l'Ensanche, et l'étude a commencé par un relevé de ce voisinage — façades, gabarits, rythmes — pour situer l'intervention dans une famille existante plutôt que contre elle.",
        "À l'intérieur, les volumes de la gare, généreux parce qu'ils étaient faits pour des autocars, deviennent l'atout du programme culturel qui s'y installe.",
      ],
      en: [
        "Tétouan's former bus station had lost its function without losing its place in the city. The project reuses it rather than replacing it: public parking on one side, an artists' house on the other.",
        "The building belongs to the fabric of the Ensanche, and the study began by surveying that neighbourhood — façades, heights, rhythms — to place the intervention within an existing family rather than against it.",
        "Inside, the station's volumes, generous because they were built for coaches, become the asset of the cultural programme that moves in.",
      ],
    },
    cover: "/projects/gare-routiere-cover.jpg",
    gallery: [
      { src: "/projects/gare-routiere-01.jpg", shape: "wide", caption: { fr: "Relevé du voisinage : les façades de l'Ensanche", en: "Surveying the neighbours: the façades of the Ensanche" } },
      { src: "/projects/gare-routiere-02.jpg", shape: "tall", caption: { fr: "La halle réoccupée", en: "The hall reoccupied" } },
      { src: "/projects/gare-routiere-03.jpg", shape: "tall", caption: { fr: "Vers la maison d'artiste", en: "Towards the artists' house" } },
    ],
    featured: false,
  },
  {
    slug: "centre-de-sante",
    ref: "08",
    title: "Centre de santé",
    category: "equipment",
    programme: {
      fr: "Kinésithérapie et rééducation fonctionnelle",
      en: "Physiotherapy and functional rehabilitation",
    },
    location: { fr: "Tétouan", en: "Tétouan" },
    year: "2025",
    frame: { fr: "Atelier S10", en: "Studio S10" },
    role: { fr: "Projet individuel", en: "Individual project" },
    summary: {
      fr: "Un centre dont la volumétrie est prise aux articulations du corps qu'il sert à réparer.",
      en: "A centre whose massing is taken from the joints of the body it exists to repair.",
    },
    body: {
      fr: [
        "Le programme est un centre de santé intégré, conçu spécifiquement pour la kinésithérapie et la rééducation fonctionnelle.",
        "La volumétrie s'inspire des articulations du corps humain : des pôles reliés par des pivots, qui produisent une figure articulée plutôt qu'un bloc. Ce n'est pas qu'une image — la liaison entre pôles organise le parcours du patient et le schéma de sécurité incendie.",
        "Les espaces de soin sont orientés pour recevoir la lumière naturelle, et le bassin de rééducation, sous charpente, forme le point bas et lumineux du parcours.",
      ],
      en: [
        "The brief is an integrated health centre, designed specifically for physiotherapy and functional rehabilitation.",
        "The massing takes after the joints of the human body: poles linked by pivots, producing an articulated figure rather than a block. It is not only an image — the link between poles organises the patient's route and the fire strategy.",
        "Treatment spaces are oriented for daylight, and the rehabilitation pool, under an exposed frame, forms the low, bright point of the sequence.",
      ],
    },
    cover: "/projects/centre-de-sante-cover.jpg",
    gallery: [
      { src: "/projects/centre-de-sante-01.jpg", shape: "wide", caption: { fr: "Maquette d'étude", en: "Study model" } },
      { src: "/projects/centre-de-sante-02.jpg", shape: "tall", caption: { fr: "Insertion dans le site", en: "Set into the site" } },
      { src: "/projects/centre-de-sante-03.jpg", shape: "tall", caption: { fr: "Plan : la liaison entre les pôles", en: "Plan: the link between the poles" } },
    ],
    featured: true,
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export const featuredProjects = projects.filter((p) => p.featured);

export const usedCategories = categories.filter((c) =>
  projects.some((p) => p.category === c),
);
