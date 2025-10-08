interface InstitutionColorMap {
  [key: string]: string
}

const institutionColorMap: InstitutionColorMap = {
  nubank: "#320850",
  mercadopago: "#00AEED",
  xp: "#000",
  total: "#006633",
}

const validInstitutionsLogoKeys = ["nubank", "mercadopago", "xp", "total"]

const DEFAULT_COLOR = "#0E1F34"

const normalizeString = (str: string): string => {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "")
    .trim()
}

export const getInstitutionColors = (institutionName: string): string => {
  let backgroundColor = DEFAULT_COLOR

  const normalizedInput = normalizeString(institutionName)

  if (normalizedInput in institutionColorMap) {
    backgroundColor = institutionColorMap[normalizedInput]
  }

  return backgroundColor;
}

export const getInstitutionLogoPath = (institutionName: string): string | null => {
  const normalizedInput = normalizeString(institutionName)
  if (validInstitutionsLogoKeys.includes(normalizedInput)) {
    return `/institution-logos/${normalizedInput}.svg`
  }

  return null
}

export const institutionsColors = institutionColorMap

export default getInstitutionColors
