import { PerCollection } from "../types/perCollection";

export const mainColorHoverClass: PerCollection<string> = {
  ficto_healthtech: "hover:bg-green-100",
  ficto_imaging: "hover:bg-indigo-500",
  ficto_surgical: "hover:bg-blue-100",
}

export const mainColorBgClass: PerCollection<string> = {
  ficto_healthtech: "bg-green-300",
  ficto_imaging: "bg-indigo-950",
  ficto_surgical: "bg-blue-300",
};

export const mainColorBorderClass: PerCollection<string> = {
  ficto_healthtech: "border-green-300",
  ficto_imaging: "border-indigo-800",
  ficto_surgical: "border-blue-300",
};

export const mainColorTextClass: PerCollection<string> = {
  ficto_healthtech: "text-green-600",
  ficto_imaging: "text-indigo-700",
  ficto_surgical: "text-blue-600",
}

export const mainColorHighlightClass: PerCollection<string> = {
  ficto_healthtech: "text-green-800",
  ficto_imaging: "text-indigo-950",
  ficto_surgical: "text-blue-800",
}
