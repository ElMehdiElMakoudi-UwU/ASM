import type { I18nList, I18nText, Locale } from "@/lib/i18n";

/** Every string the interface renders, in both languages. */
export const dict = {
  nav: {
    projects: { fr: "Projets", en: "Projects" },
    services: { fr: "Savoir-faire", en: "Practice" },
    studio: { fr: "L'atelier", en: "Studio" },
    contact: { fr: "Contact", en: "Contact" },
    menu: { fr: "Menu", en: "Menu" },
    close: { fr: "Fermer", en: "Close" },
  },

  home: {
    heroDisplay: { fr: "Des lieux qui tiennent.", en: "Places that hold." },
    heroLead: {
      fr: "Atelier d'architecture à Tanger. Nous dessinons des bâtiments qui tiennent au climat, à l'usage et au temps.",
      en: "Architecture studio in Tangier. We design buildings that hold up to the climate, to use, and to time.",
    },
    heroCta: { fr: "Voir les projets", en: "See the projects" },
    scroll: { fr: "Faire défiler", en: "Scroll" },

    manifestoLabel: { fr: "L'approche", en: "Approach" },
    manifesto: {
      fr: [
        "Chaque projet part d'une lecture du site.",
        "La pente qui sépare deux quartiers, le front de mer qu'il faut allonger, la place publique et ce qu'elle porte les jours de fête : ce sont ces contraintes-là qui donnent le parti, avant le premier trait. L'atelier travaille depuis Tanger, sur l'ensemble du nord du Maroc, de la première esquisse au suivi de chantier.",
      ],
      en: [
        "Every project begins by reading the site.",
        "The slope that divides two districts, the sea frontage that has to be lengthened, the public square and what it carries on feast days: those constraints give the parti, before the first line. The studio works from Tangier, across northern Morocco, from the first sketch to site supervision.",
      ],
    },
    manifestoLink: { fr: "L'atelier", en: "About the studio" },

    selectedLabel: { fr: "Projets choisis", en: "Selected work" },
    selectedTitle: { fr: "Un extrait du dossier", en: "From the register" },
    allProjects: { fr: "Tous les projets", en: "All projects" },

    servicesLabel: { fr: "Savoir-faire", en: "What we do" },
    servicesTitle: {
      fr: "De la première esquisse à la réception du chantier",
      en: "From the first sketch to handover",
    },

    ctaTitle: { fr: "Un terrain, un programme, une idée ?", en: "A site, a brief, an idea?" },
    ctaBody: {
      fr: "Le premier rendez-vous est gratuit et se tient sur place, à Tanger ou dans le nord.",
      en: "The first meeting is free and takes place on site, in Tangier or anywhere in the north.",
    },
    ctaButton: { fr: "Écrire à l'atelier", en: "Write to the studio" },
  },

  projects: {
    title: { fr: "Projets", en: "Projects" },
    lead: {
      fr: "Le dossier de l'atelier, classé par référence. Survolez une ligne pour voir le projet.",
      en: "The studio register, filed by reference. Hover a row to see the project.",
    },
    leadTouch: {
      fr: "Le dossier de l'atelier, classé par référence.",
      en: "The studio register, filed by reference.",
    },
    filterAll: { fr: "Tout", en: "All" },
    filterLabel: { fr: "Filtrer par programme", en: "Filter by programme" },
    count: { fr: "projets", en: "projects" },
    countOne: { fr: "projet", en: "project" },
    columns: {
      ref: { fr: "Réf.", en: "Ref." },
      project: { fr: "Projet", en: "Project" },
      programme: { fr: "Programme", en: "Programme" },
      location: { fr: "Lieu", en: "Location" },
      year: { fr: "Année", en: "Year" },
      area: { fr: "Surface", en: "Area" },
    },
    empty: {
      fr: "Aucun projet dans cette catégorie pour le moment.",
      en: "No project in this category yet.",
    },
  },

  project: {
    backToProjects: { fr: "Retour aux projets", en: "Back to projects" },
    facts: { fr: "Fiche projet", en: "Project facts" },
    programme: { fr: "Programme", en: "Programme" },
    location: { fr: "Lieu", en: "Location" },
    year: { fr: "Année", en: "Year" },
    frame: { fr: "Cadre", en: "Context" },
    role: { fr: "Rôle", en: "Role" },
    ref: { fr: "Référence", en: "Reference" },
    next: { fr: "Projet suivant", en: "Next project" },
    previous: { fr: "Projet précédent", en: "Previous project" },
  },

  services: {
    title: { fr: "Savoir-faire", en: "Practice" },
    lead: {
      fr: "Quatre métiers tenus par la même équipe, du premier relevé jusqu'à la remise des clés.",
      en: "Four disciplines held by one team, from the first survey to the handover of keys.",
    },
    processLabel: { fr: "Déroulé d'une mission", en: "How a commission runs" },
    processTitle: {
      fr: "Cinq étapes, dans cet ordre",
      en: "Five stages, in this order",
    },
    processNote: {
      fr: "Les délais dépendent du programme et de l'instruction administrative. Ils sont fixés par écrit au démarrage.",
      en: "Timescales depend on the brief and on planning approval. They are agreed in writing at the start.",
    },
  },

  studio: {
    title: { fr: "L'atelier", en: "The studio" },
    lead: {
      fr: "Un atelier installé à Tanger, qui travaille sur tout le nord du Maroc.",
      en: "A studio based in Tangier, working across northern Morocco.",
    },
    founderRole: { fr: "Architecte fondateur", en: "Founding architect" },
    bio: {
      fr: [
        "Souhail Mharrech est architecte, lauréat de l'École Nationale d'Architecture de Tétouan, promotion juillet 2025, et inscrit à l'Ordre National des Architectes.",
        "Il a travaillé sur le projet du Grand Stade de Tanger — suivi de chantier, coordination de projet, préparation des dossiers de consultation et participation à des concours — au sein du cabinet d'architecture Anouar Amaoui, où il avait auparavant mené son projet de fin d'études.",
        "Ses stages l'ont conduit chez ENGAWA, Mohammed Adrif Architecte, SJA architectes, HWAU et Bouhassoune architecture, ainsi qu'en commune urbaine, du côté de l'instruction des dossiers.",
        "L'atelier travaille depuis Tanger, sur l'ensemble du nord du Maroc — Tanger, Tétouan, Asilah, Martil, Chefchaouen — en arabe, en français, en anglais et en espagnol.",
      ],
      en: [
        "Souhail Mharrech is an architect, a graduate of the École Nationale d'Architecture de Tétouan in July 2025, registered with Morocco's Ordre National des Architectes.",
        "He worked on the Grand Stade de Tanger — site supervision, project coordination, tender documentation and competition entries — at Cabinet d'architecture Anouar Amaoui, where he had previously carried out his final-year thesis.",
        "His placements took him to ENGAWA, Mohammed Adrif Architecte, SJA architectes, HWAU and Bouhassoune architecture, as well as a municipal planning office, on the approvals side.",
        "The studio works from Tangier, across northern Morocco — Tangier, Tétouan, Asilah, Martil, Chefchaouen — in Arabic, French, English and Spanish.",
      ],
    },
    principlesLabel: { fr: "Trois règles de travail", en: "Three working rules" },
    figuresLabel: { fr: "L'atelier en chiffres", en: "The studio in figures" },
  },

  contact: {
    title: { fr: "Contact", en: "Contact" },
    lead: {
      fr: "Écrivez, appelez, ou passez à l'atelier. Nous répondons sous 48 heures ouvrées.",
      en: "Write, call, or come by the studio. We reply within two working days.",
    },
    formTitle: { fr: "Parler d'un projet", en: "Talk about a project" },
    name: { fr: "Nom", en: "Name" },
    email: { fr: "E-mail", en: "Email" },
    phone: { fr: "Téléphone", en: "Phone" },
    phoneOptional: { fr: "facultatif", en: "optional" },
    subject: { fr: "Nature du projet", en: "Type of project" },
    subjectOptions: {
      fr: [
        "Maison individuelle",
        "Logements collectifs",
        "Réhabilitation",
        "Commerce ou bureaux",
        "Équipement public",
        "Urbanisme",
        "Autre",
      ],
      en: [
        "Private house",
        "Apartments",
        "Rehabilitation",
        "Retail or offices",
        "Public building",
        "Urban planning",
        "Other",
      ],
    },
    message: { fr: "Votre projet", en: "Your project" },
    messagePlaceholder: {
      fr: "Le terrain, la surface envisagée, le calendrier, le budget si vous l'avez en tête.",
      en: "The site, the surface you have in mind, the timeline, and the budget if you have one.",
    },
    send: { fr: "Envoyer", en: "Send" },
    sending: { fr: "Envoi en cours", en: "Sending" },
    success: {
      fr: "Message reçu. Nous revenons vers vous sous 48 heures ouvrées.",
      en: "Message received. We will come back to you within two working days.",
    },
    errorGeneric: {
      fr: "L'envoi a échoué. Écrivez-nous directement à contact@asm-architectes.ma.",
      en: "Sending failed. Write to us directly at contact@asm-architectes.ma.",
    },
    errorName: { fr: "Indiquez votre nom.", en: "Enter your name." },
    errorEmail: { fr: "Indiquez une adresse e-mail valide.", en: "Enter a valid email address." },
    errorMessage: {
      fr: "Décrivez votre projet en quelques lignes.",
      en: "Describe your project in a few lines.",
    },
    whatsapp: { fr: "Écrire sur WhatsApp", en: "Message on WhatsApp" },
    whatsappPrefill: {
      fr: "Bonjour, je souhaite parler d'un projet avec l'atelier.",
      en: "Hello, I would like to discuss a project with the studio.",
    },
    studioLabel: { fr: "L'atelier", en: "Studio" },
    phoneLabel: { fr: "Téléphone", en: "Phone" },
    emailLabel: { fr: "E-mail", en: "Email" },
    hoursLabel: { fr: "Horaires", en: "Hours" },
    hours: {
      fr: ["Lundi – vendredi, 9 h – 18 h", "Samedi sur rendez-vous"],
      en: ["Monday – Friday, 9am – 6pm", "Saturday by appointment"],
    },
    mapLink: { fr: "Ouvrir dans Google Maps", en: "Open in Google Maps" },
  },

  footer: {
    tagline: {
      fr: "Atelier d'architecture, Tanger",
      en: "Architecture studio, Tangier",
    },
    navLabel: { fr: "Navigation", en: "Navigation" },
    contactLabel: { fr: "Contact", en: "Contact" },
    followLabel: { fr: "Suivre", en: "Follow" },
    rights: { fr: "Tous droits réservés", en: "All rights reserved" },
    langLabel: { fr: "Langue", en: "Language" },
  },

  common: {
    skipToContent: { fr: "Aller au contenu", en: "Skip to content" },
    viewProject: { fr: "Voir le projet", en: "View project" },
    notFoundTitle: { fr: "Page introuvable", en: "Page not found" },
    notFoundBody: {
      fr: "Cette page n'existe pas ou a été déplacée.",
      en: "This page does not exist, or has moved.",
    },
    backHome: { fr: "Retour à l'accueil", en: "Back home" },
    placeholderNote: {
      fr: "Image de substitution",
      en: "Placeholder image",
    },
  },
} as const;

/** Service lines, in the order the client asked for them. */
export const services: {
  key: string;
  title: I18nText;
  body: I18nText;
  includes: I18nList;
}[] = [
  {
    key: "architecture",
    title: { fr: "Architecture & intérieur", en: "Architecture & interiors" },
    body: {
      fr: "Du concours au dernier détail. L'intérieur est dessiné avec l'enveloppe, jamais après.",
      en: "From competition to final detail. Interiors are drawn with the envelope, never after it.",
    },
    includes: {
      fr: ["Esquisse et avant-projet", "Permis de construire", "Détails d'exécution", "Mobilier sur mesure"],
      en: ["Concept and scheme design", "Planning application", "Construction details", "Bespoke furniture"],
    },
  },
  {
    key: "urbanism",
    title: { fr: "Urbanisme", en: "Urban planning" },
    body: {
      fr: "Lotissements, plans d'aménagement, études d'insertion. Penser la rue avant la parcelle.",
      en: "Subdivisions, development plans, context studies. The street before the plot.",
    },
    includes: {
      fr: ["Plan d'aménagement", "Étude d'insertion paysagère", "Découpage foncier", "Programmation"],
      en: ["Development plan", "Landscape and context study", "Land subdivision", "Programming"],
    },
  },
  {
    key: "management",
    title: { fr: "Maîtrise d'œuvre & suivi de chantier", en: "Project management & site supervision" },
    body: {
      fr: "Autorisation de construire, consultation des entreprises, visite hebdomadaire jusqu'à la réception.",
      en: "Building permits, contractor tendering, weekly site visits through to handover.",
    },
    includes: {
      fr: ["Autorisation de construire", "Appel d'offres et analyse", "Visites hebdomadaires", "Réception et levée des réserves"],
      en: ["Building permit", "Tendering and analysis", "Weekly site visits", "Handover and snagging"],
    },
  },
  {
    key: "visualisation",
    title: { fr: "Images & maquettes", en: "Visualisation & models" },
    body: {
      fr: "Rendus, films courts et maquettes physiques, pour décider vite et sur pièce.",
      en: "Renders, short films and physical models, so decisions are made quickly and on evidence.",
    },
    includes: {
      fr: ["Images de synthèse", "Films courts", "Maquettes 1/200 – 1/50", "Nuanciers et échantillons"],
      en: ["Photoreal renders", "Short films", "Models at 1:200 – 1:50", "Material boards and samples"],
    },
  },
];

/** The five stages of a commission — a real sequence, so it is numbered. */
export const processStages: { title: I18nText; body: I18nText; duration: I18nText }[] = [
  {
    title: { fr: "Relevé et faisabilité", en: "Survey and feasibility" },
    body: {
      fr: "Visite du terrain, relevé, vérification du règlement d'urbanisme et du budget. Vous repartez avec un avis écrit, même s'il est négatif.",
      en: "Site visit, survey, planning rules and budget checked. You leave with a written opinion, even a negative one.",
    },
    duration: { fr: "2 – 3 semaines", en: "2 – 3 weeks" },
  },
  {
    title: { fr: "Esquisse", en: "Concept design" },
    body: {
      fr: "Deux ou trois partis dessinés et chiffrés, présentés en maquette. Un seul est retenu et développé.",
      en: "Two or three schemes drawn, costed and modelled. One is chosen and taken forward.",
    },
    duration: { fr: "4 – 6 semaines", en: "4 – 6 weeks" },
  },
  {
    title: { fr: "Autorisation de construire", en: "Building permit" },
    body: {
      fr: "Montage du dossier, dépôt à la commune, suivi de l'instruction et réponse aux observations.",
      en: "Application assembled, filed with the municipality, then followed through review and comments.",
    },
    duration: { fr: "3 – 6 mois", en: "3 – 6 months" },
  },
  {
    title: { fr: "Dossier d'exécution", en: "Construction documents" },
    body: {
      fr: "Plans d'exécution, détails, descriptif quantitatif, consultation des entreprises et analyse des offres.",
      en: "Working drawings, details, bills of quantities, tendering and analysis of bids.",
    },
    duration: { fr: "6 – 10 semaines", en: "6 – 10 weeks" },
  },
  {
    title: { fr: "Chantier et réception", en: "Construction and handover" },
    body: {
      fr: "Visite hebdomadaire, compte rendu écrit, validation des situations, réception et levée des réserves.",
      en: "Weekly visits, written reports, valuation approvals, handover and snagging.",
    },
    duration: { fr: "Selon le projet", en: "Project dependent" },
  },
];

/** Three working rules — a set, not a sequence, so they are not numbered. */
export const principles: { title: I18nText; body: I18nText }[] = [
  {
    title: { fr: "Le site donne le parti", en: "The site gives the parti" },
    body: {
      fr: "La pente du M'hannech, le front de mer d'Azla, les usages d'une place les jours de fête : dans chaque projet, la contrainte relevée sur le terrain précède le dessin et le décide.",
      en: "The slope at M'hannech, the sea frontage at Azla, the uses of a square on feast days: in every project the constraint surveyed on the ground comes before the drawing, and settles it.",
    },
  },
  {
    title: { fr: "Un bâtiment sert plus d'une fois", en: "A building serves more than once" },
    body: {
      fr: "Un stade vide trois cent cinquante jours par an, une gare routière sans autocars, une toiture rendue au quartier : la reconversion et la multifonctionnalité sont le sujet de l'atelier, pas une option.",
      en: "A stadium empty three hundred and fifty days a year, a bus station without coaches, a roof handed back to the neighbourhood: reuse and multiple use are the studio's subject, not an option.",
    },
  },
  {
    title: { fr: "Le dessin va jusqu'au chantier", en: "Drawing carries through to site" },
    body: {
      fr: "Dossiers de consultation, coordination, visites de chantier : l'expérience acquise sur le Grand Stade de Tanger tient le projet jusqu'à la réception, pas jusqu'au rendu.",
      en: "Tender documents, coordination, site visits: experience gained on the Grand Stade de Tanger carries a project to handover, not to the presentation.",
    },
  },
];

export const figures: { value: string; label: I18nText }[] = [
  { value: "2025", label: { fr: "Promotion, ENA Tétouan", en: "Graduated, ENA Tétouan" } },
  { value: "08", label: { fr: "Projets au dossier", en: "Projects in the register" } },
  { value: "04", label: { fr: "Langues de travail", en: "Working languages" } },
  { value: "05", label: { fr: "Villes d'intervention", en: "Cities served" } },
];

export function d<T>(entry: Record<Locale, T>, locale: Locale): T {
  return entry[locale];
}
