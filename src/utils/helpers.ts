export function kebabCase(str: string): string {
  return (str || "").replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

export function getNestedValue(
  obj: any,
  path: (string | number)[],
  fallback?: any
): any {
  const last = path.length - 1;
  if (last < 0) return obj === undefined ? fallback : obj;
  for (let i = 0; i < last; i++) {
    if (obj == null) return fallback;
    obj = obj[path[i]];
  }
  if (obj == null) return fallback;
  return obj[path[last]] === undefined ? fallback : obj[path[last]];
}

export function getObjectValueByPath(
  obj: any,
  path: string,
  fallback?: any
): any {
  if (obj == null || !path || typeof path !== "string") return fallback;
  if (obj[path] !== undefined) return obj[path];
  path = path.replace(/\[(\w+)\]/g, ".$1"); // convert indexes to properties
  path = path.replace(/^\./, ""); // strip a leading dot
  return getNestedValue(obj, path.split("."), fallback);
}

export function wrapInArray<T>(v: T | T[] | null | undefined): T[] {
  return v != null ? (Array.isArray(v) ? v : [v]) : [];
}

export function sanitizeDateString(
  dateString: string,
  type: "date" | "month" | "year"
): string {
  const [year, month = 1, date = 1] = dateString.split("-");
  return `${year}-${month.toString().padStart(2, "0")}-${date
    .toString()
    .padStart(2, "0")}`.substring(0, { date: 10, month: 7, year: 4 }[type]);
}

export function createRange(length: number): number[] {
  return Array.from({ length }, (v, k) => k);
}

export function convertToUnit(
  str: string | number | null | undefined,
  unit = "px"
): string | undefined {
  if (str == null || str === "") {
    return undefined;
  } else if (isNaN(+str!)) {
    return String(str);
  } else {
    return `${Number(str)}${unit}`;
  }
}
