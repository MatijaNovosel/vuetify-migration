import { getObjectValueByPath } from "@/utils/helpers";

export function filterTreeItem(
  item: object,
  search: string,
  textKey: string
): boolean {
  const text = getObjectValueByPath(item, textKey);
  return text.toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) > -1;
}

export function filterTreeItems(
  filter: any,
  item: any,
  search: string,
  excluded: Set<string | number>
): boolean {
  if (filter(item, search, "name")) return true;
  const children = getObjectValueByPath(item, "children");
  if (children) {
    let match = false;
    for (let i = 0; i < children.length; i++) {
      if (filterTreeItems(filter, children[i], search, excluded)) match = true;
    }
    if (match) return true;
  }
  excluded.add(getObjectValueByPath(item, "id"));
  return false;
}
