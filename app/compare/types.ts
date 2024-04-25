import { tokens } from "@/tailwind.config"
import { Field, LLM, MetaProperty, User } from "@prisma/client"
import { icons } from "lucide-react"

export type LLMWithMetadata = LLM & {
  fields: Array<Field & { metaProperty: MetaProperty }>
  user: User
}

export enum ViewEnum {
  grid = "grid",
  list = "list",
}

export enum ThemeEnum {
  crimson = "crimson",
  midnight = "midnight",
  amber = "amber",
  cerulean = "cerulean",
  amethyst = "amethyst",
  evergreen = "evergreen",
}

export enum FilterEnum {
  number = "number",
  string = "string",
  boolean = "boolean",
  nullFields = "nullFields",
  standalone = "standalone",
}

export enum ModeEnum {
  view = "view",
  edit = "edit",
}

interface ControlOption {
  icon: keyof typeof icons
  label: string
}

interface ThemeOption {
  foreground: [string, string]
  background: Array<string>
  label: string
}

export const viewData: Record<ViewEnum, ControlOption> = {
  [ViewEnum.grid]: {
    icon: "LayoutGrid",
    label: "Grid",
  },
  [ViewEnum.list]: {
    icon: "StretchHorizontal",
    label: "List",
  },
}

export const filterData: Record<FilterEnum, ControlOption> = {
  [FilterEnum.number]: {
    icon: "Hash",
    label: "Number",
  },
  [FilterEnum.string]: {
    icon: "Type",
    label: "String",
  },
  [FilterEnum.boolean]: {
    icon: "ThumbsUp",
    label: "Boolean",
  },
  [FilterEnum.nullFields]: {
    icon: "CircleDashed",
    label: "Null Fields",
  },
  [FilterEnum.standalone]: {
    icon: "BarChart",
    label: "Standalone",
  },
}

export const themeData: Record<ThemeEnum, ThemeOption> = {
  [ThemeEnum.crimson]: {
    foreground: [tokens.colors.accent.dimmer, tokens.colors.accent.dimmest],
    background: [
      "circle at 75% -10%",
      tokens.colors.accent.dimmest,
      tokens.colors.root,
    ],
    label: "Crimson",
  },
  [ThemeEnum.amber]: {
    foreground: [tokens.colors.amber[500], tokens.colors.amber[600]],
    background: [
      "circle at 50% 0%",
      tokens.colors.yellow[600],
      tokens.colors.yellow[700] + " 30%",
      tokens.colors.yellow[900] + " 50%",
      tokens.colors.root + " 90%",
      tokens.colors.root,
    ],
    label: "Amber",
  },
  [ThemeEnum.evergreen]: {
    foreground: [tokens.colors.green[500], tokens.colors.green[700]],
    background: [tokens.colors.emerald[800], tokens.colors.emerald[950]],
    label: "Evergreen",
  },
  [ThemeEnum.cerulean]: {
    foreground: [tokens.colors.teal[500], tokens.colors.teal[700]],
    background: [
      "circle at 50% 100%",
      tokens.colors.teal[800],
      tokens.colors.teal[900] + " 20%",
      tokens.colors.cyan[900] + " 70%",
      tokens.colors.cyan[950],
    ],
    label: "Cerulean",
  },
  [ThemeEnum.amethyst]: {
    foreground: [tokens.colors.indigo[500], tokens.colors.indigo[700]],
    background: [
      "circle at 10% 110%",
      tokens.colors.violet[800] + "a5",
      tokens.colors.violet[800] + "95 20%",
      tokens.colors.blue[950] + " 70%",
      tokens.colors.blue[800] + " 90%",
      tokens.colors.blue[500],
    ],
    label: "Amethyst",
  },
  [ThemeEnum.midnight]: {
    foreground: [tokens.colors.outline.default, tokens.colors.outline.dimmer],
    background: [
      "circle at 75% -10%",
      tokens.colors.highest,
      tokens.colors.default,
      tokens.colors.root,
    ],
    label: "Midnight",
  },
}
