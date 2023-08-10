import { PerCollection } from "../types/perCollection";

export const mainColorHoverClass: PerCollection<string> = {
  ficto_healthtech: "hover:bg-green-100",
  ficto_healthtech_imaging: "hover:bg-red-100",
  ficto_surgical: "hover:bg-blue-100",
}

export const mainColorBgClass: PerCollection<string> = {
  ficto_healthtech: "bg-green-300",
  ficto_healthtech_imaging: "bg-red-300",
  ficto_surgical: "bg-blue-300",
};

export const mainColorBorderClass: PerCollection<string> = {
  ficto_healthtech: "border-green-300",
  ficto_healthtech_imaging: "border-red-300",
  ficto_surgical: "border-blue-300",
};

export const mainColorTextClass: PerCollection<string> = {
  ficto_healthtech: "text-green-600",
  ficto_healthtech_imaging: "text-red-600",
  ficto_surgical: "text-blue-600",
}

export const mainColorHighlightClass: PerCollection<string> = {
  ficto_healthtech: "text-green-800",
  ficto_healthtech_imaging: "text-red-800",
  ficto_surgical: "text-blue-800",
}
