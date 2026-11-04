/**
 * Registre des entités administrables (back-office générique).
 * Fichier "pur" (aucune dépendance serveur/Prisma) : importable à la fois
 * depuis des Server Components/Actions et des Client Components.
 */

export type FieldType =
  | "text"
  | "textarea"
  | "bilingual-text"
  | "bilingual-textarea"
  | "date"
  | "boolean"
  | "image"
  | "document"
  | "url"
  | "string-list"
  | "select"
  | "image-list";

export interface SelectOption {
  value: string;
  label: string;
}

export interface FieldConfig {
  /** Nom de base du champ. Pour les champs bilingues, les colonnes réelles sont `${name}Fr` / `${name}En`. */
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  helpText?: string;
  /** Options pour le type "select". */
  options?: SelectOption[];
  /** Nombre de photos pour le type "image-list" (défaut : 4). */
  maxItems?: number;
}

export interface EntityConfig {
  slug: string;
  /** Nom du délégué Prisma (ex. "experience" pour prisma.experience.*) */
  model: string;
  label: string;
  labelSingular: string;
  fields: FieldConfig[];
  orderable: boolean;
  visibilityToggle: boolean;
  listTitleField: string;
  listSubtitleField?: string;
  /**
   * Lignes fixes : masque les actions "Ajouter" et "Supprimer" (liste + formulaire).
   * Utilisé pour les entités dont les lignes correspondent à du code existant
   * (ex. les sections de la page publique) et ne peuvent donc pas être créées
   * ou supprimées librement depuis le back-office.
   */
  fixedRows?: boolean;
}

/**
 * Rôles possibles pour une action associative (Léonisme). Les valeurs (`value`)
 * sont stockées telles quelles en base ; les libellés publics (site, FR/EN)
 * viennent des traductions next-intl (voir messages/fr.json et en.json,
 * clé `Associative.roleLabels`) — ceux ci-dessous ne servent qu'au back-office.
 */
export const ASSOCIATIVE_ACTION_ROLE_OPTIONS: SelectOption[] = [
  { value: "president", label: "Président de l'action (chef)" },
  { value: "vice_president", label: "Vice-président de l'action (adjoint)" },
  { value: "organizer", label: "Membre organisateur" },
];

/**
 * Champ de visibilité commun, ajouté à la fin du formulaire de chaque entité.
 * Coché par défaut pour les nouveaux éléments (voir EntityForm) ; décocher
 * masque l'élément du site public sans le supprimer (équivalent à l'icône
 * œil de la liste du back-office).
 */
const VISIBILITY_FIELD: FieldConfig = {
  name: "isVisible",
  label: "Visible sur le portfolio public",
  type: "boolean",
  helpText: "Décochez pour masquer cet élément du site public sans le supprimer. Vous pourrez le réafficher à tout moment.",
};

export const ENTITY_REGISTRY: EntityConfig[] = [
  {
    slug: "sections",
    model: "siteSection",
    label: "Sections du site",
    labelSingular: "une section",
    orderable: true,
    visibilityToggle: true,
    fixedRows: true,
    listTitleField: "label",
    fields: [
      {
        name: "label",
        label: "Libellé de navigation",
        type: "bilingual-text",
        required: true,
        helpText: "Texte affiché dans le menu de navigation et comme titre de la section.",
      },
      VISIBILITY_FIELD,
    ],
  },
  {
    slug: "experiences",
    model: "experience",
    label: "Expériences",
    labelSingular: "une expérience",
    orderable: true,
    visibilityToggle: true,
    listTitleField: "role",
    listSubtitleField: "company",
    fields: [
      { name: "groupLabel", label: "Groupe (regroupement, ex. nom d'entreprise)", type: "text", helpText: "Permet de regrouper plusieurs postes sous un même employeur sur le site public." },
      { name: "company", label: "Entreprise / Organisation", type: "bilingual-text", required: true },
      { name: "role", label: "Intitulé du poste", type: "bilingual-text", required: true },
      { name: "description", label: "Description (une ligne = une puce)", type: "bilingual-textarea" },
      { name: "employmentType", label: "Type de contrat (Full-time, Part-time, Internship…)", type: "text" },
      { name: "location", label: "Lieu", type: "bilingual-text" },
      { name: "workMode", label: "Mode de travail (On-site, Hybrid, Remote)", type: "text" },
      { name: "startDate", label: "Date de début", type: "date" },
      { name: "endDate", label: "Date de fin", type: "date" },
      { name: "isCurrent", label: "Poste actuel (affiche \"Présent\")", type: "boolean" },
      { name: "imageUrl", label: "Logo / image", type: "image" },
      { name: "linkUrl", label: "Lien (site, article…)", type: "url" },
      VISIBILITY_FIELD,
    ],
  },
  {
    slug: "projects",
    model: "project",
    label: "Projets",
    labelSingular: "un projet",
    orderable: true,
    visibilityToggle: true,
    listTitleField: "title",
    fields: [
      { name: "title", label: "Titre du projet", type: "bilingual-text", required: true },
      { name: "description", label: "Description (une ligne = une puce)", type: "bilingual-textarea", required: true },
      { name: "startDate", label: "Date de début", type: "date" },
      { name: "endDate", label: "Date de fin", type: "date" },
      { name: "isCurrent", label: "Projet en cours", type: "boolean" },
      { name: "imageUrl", label: "Image", type: "image" },
      { name: "linkUrl", label: "Lien (Marketplace, démo…)", type: "url" },
      VISIBILITY_FIELD,
    ],
  },
  {
    slug: "migrations",
    model: "migrationProject",
    label: "Migration",
    labelSingular: "un élément de migration",
    orderable: true,
    visibilityToggle: true,
    listTitleField: "title",
    fields: [
      { name: "title", label: "Titre", type: "bilingual-text", required: true },
      { name: "description", label: "Description (une ligne = une puce)", type: "bilingual-textarea", required: true },
      { name: "startDate", label: "Date de début", type: "date" },
      { name: "endDate", label: "Date de fin", type: "date" },
      { name: "isCurrent", label: "En cours", type: "boolean" },
      { name: "imageUrl", label: "Image", type: "image" },
      { name: "linkUrl", label: "Lien", type: "url" },
      VISIBILITY_FIELD,
    ],
  },
  {
    slug: "certifications",
    model: "certification",
    label: "Certifications",
    labelSingular: "une certification",
    orderable: true,
    visibilityToggle: true,
    listTitleField: "name",
    fields: [
      { name: "name", label: "Nom de la certification", type: "bilingual-text", required: true },
      { name: "issuer", label: "Émetteur", type: "text", required: true },
      { name: "credentialId", label: "ID de certification", type: "text" },
      { name: "issuedAt", label: "Date d'obtention", type: "date" },
      { name: "expiresAt", label: "Date d'expiration", type: "date" },
      { name: "imageUrl", label: "Badge / image", type: "image" },
      { name: "linkUrl", label: "Lien de vérification", type: "url" },
      VISIBILITY_FIELD,
    ],
  },
  {
    slug: "education",
    model: "education",
    label: "Formation",
    labelSingular: "une formation",
    orderable: true,
    visibilityToggle: true,
    listTitleField: "school",
    listSubtitleField: "degree",
    fields: [
      { name: "school", label: "Établissement", type: "bilingual-text", required: true },
      { name: "degree", label: "Diplôme", type: "bilingual-text", required: true },
      { name: "field", label: "Domaine d'études", type: "bilingual-text" },
      { name: "grade", label: "Mention / résultat", type: "bilingual-text" },
      { name: "startDate", label: "Date de début", type: "date" },
      { name: "endDate", label: "Date de fin", type: "date" },
      { name: "isCurrent", label: "Formation en cours", type: "boolean" },
      { name: "imageUrl", label: "Logo établissement", type: "image" },
      { name: "linkUrl", label: "Lien", type: "url" },
      VISIBILITY_FIELD,
    ],
  },
  {
    slug: "associative-roles",
    model: "associativeRole",
    label: "Rôles associatifs",
    labelSingular: "un rôle associatif",
    orderable: true,
    visibilityToggle: true,
    listTitleField: "role",
    listSubtitleField: "organization",
    fields: [
      { name: "organization", label: "Organisation", type: "bilingual-text", required: true },
      { name: "role", label: "Rôle", type: "bilingual-text", required: true },
      { name: "startDate", label: "Date de début", type: "date" },
      { name: "endDate", label: "Date de fin", type: "date" },
      { name: "isCurrent", label: "Rôle actuel", type: "boolean" },
      { name: "imageUrl", label: "Logo", type: "image" },
      { name: "linkUrl", label: "Lien", type: "url" },
      VISIBILITY_FIELD,
    ],
  },
  {
    slug: "associative-actions",
    model: "associativeAction",
    label: "Actions associatives",
    labelSingular: "une action associative",
    orderable: true,
    visibilityToggle: true,
    listTitleField: "title",
    fields: [
      { name: "title", label: "Titre de l'action", type: "bilingual-text", required: true },
      {
        name: "role",
        label: "Mon rôle dans cette action",
        type: "select",
        options: ASSOCIATIVE_ACTION_ROLE_OPTIONS,
        helpText: "Rôle tenu spécifiquement pour cette action (peut différer de ton rôle général dans le club).",
      },
      {
        name: "captionOriginal",
        label: "Légende originale (texte exact, non traduit — FR/AR tel quel)",
        type: "textarea",
        helpText: "Ce texte est affiché tel quel sur le site, dans les deux langues, sans traduction. Laisser vide si aucune légende n'existe.",
      },
      {
        name: "instagramLinks",
        label: "Liens Instagram (un par ligne)",
        type: "string-list",
        helpText: "Chaque lien devient un bouton « Voir sur Instagram ».",
      },
      {
        name: "images",
        label: "Photos de l'action (jusqu'à 4)",
        type: "image-list",
        maxItems: 4,
        helpText: "La 1ère photo sert de couverture. Remplace l'embed Instagram sur la carte dès qu'au moins une photo est ajoutée.",
      },
      VISIBILITY_FIELD,
    ],
  },
  {
    slug: "awards",
    model: "award",
    label: "Distinctions",
    labelSingular: "une distinction",
    orderable: true,
    visibilityToggle: true,
    listTitleField: "title",
    fields: [
      { name: "title", label: "Titre de la distinction", type: "bilingual-text", required: true },
      { name: "description", label: "Description", type: "bilingual-textarea", required: true },
      { name: "dateLabel", label: "Période (ex. 2024-2025)", type: "text" },
      { name: "photosUrl", label: "Lien vers les photos", type: "url" },
      { name: "imageUrl", label: "Image", type: "image" },
      VISIBILITY_FIELD,
    ],
  },
  {
    slug: "sponsors",
    model: "sponsor",
    label: "Sponsors",
    labelSingular: "un sponsor",
    orderable: true,
    visibilityToggle: true,
    listTitleField: "name",
    fields: [
      { name: "name", label: "Nom du sponsor", type: "text", required: true },
      { name: "logoUrl", label: "Logo", type: "image" },
      { name: "linkUrl", label: "Lien (site du sponsor)", type: "url" },
      VISIBILITY_FIELD,
    ],
  },
  {
    slug: "interests",
    model: "interest",
    label: "Centres d'intérêt",
    labelSingular: "un centre d'intérêt",
    orderable: true,
    visibilityToggle: true,
    listTitleField: "label",
    fields: [
      { name: "label", label: "Libellé", type: "bilingual-text", required: true },
      {
        name: "icon",
        label: "Icône (nom Lucide, ex. Plane, Footprints, ChefHat)",
        type: "text",
        helpText: "Voir la liste des icônes disponibles sur lucide.dev — laissez vide pour une icône par défaut.",
      },
      VISIBILITY_FIELD,
    ],
  },
  {
    slug: "social-links",
    model: "socialLink",
    label: "Liens et réseaux",
    labelSingular: "un lien",
    orderable: true,
    visibilityToggle: true,
    listTitleField: "platform",
    fields: [
      { name: "platform", label: "Plateforme (linkedin, instagram, email, phone…)", type: "text", required: true },
      { name: "label", label: "Libellé affiché (optionnel)", type: "bilingual-text" },
      { name: "url", label: "URL / adresse / numéro", type: "url", required: true },
      VISIBILITY_FIELD,
    ],
  },
];

export function getEntityConfig(slug: string): EntityConfig | undefined {
  return ENTITY_REGISTRY.find((entity) => entity.slug === slug);
}

/** Retourne les noms de colonnes Prisma réels pour un champ (1 pour simple, 2 pour bilingue). */
export function fieldColumnKeys(field: FieldConfig): string[] {
  if (field.type === "bilingual-text" || field.type === "bilingual-textarea") {
    return [`${field.name}Fr`, `${field.name}En`];
  }
  return [field.name];
}
