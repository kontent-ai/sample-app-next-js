import {
  ContentItemElementsIndexer,
  Elements,
  IContentItem,
} from "@kontent-ai/delivery-sdk";

export type CircularReferenceInfo = {
  elementName: string;
  cycle: string;
};

type LinkableElement = Elements.LinkedItemsElement | Elements.RichTextElement;

// identify rich text or linked items element
const isLinkableElement = (
  obj: ContentItemElementsIndexer
): obj is LinkableElement => {
  return (
    "linkedItems" in obj && Array.isArray((obj as LinkableElement).linkedItems)
  );
};

// depth first traversal removing any reference that would close a cycle
export const sanitizeCircularData = <T extends IContentItem>(
  data: T,
  seenCodenames = new Set<string>(),
  foundItemCycles: Record<string, CircularReferenceInfo[]> = {},
  elementName: string = ""
): [T, Record<string, CircularReferenceInfo[]>] => {
  if (seenCodenames.has(data.system.codename)) {
    return handleCircularReference(
      data,
      seenCodenames,
      foundItemCycles,
      elementName
    );
  }
  // add current node to visited in each recursion pass
  seenCodenames.add(data.system.codename);

  const sanitizedElements: Record<
    string,
    ContentItemElementsIndexer | LinkableElement
  > = {};
  // call recursively for RTE/linked items, otherwise return element as is
  for (const [elementCodename, element] of Object.entries(data.elements)) {
    sanitizedElements[elementCodename] = isLinkableElement(element)
      ? {
          ...element,
          linkedItems: element.linkedItems.map((item) => {
            const [sanitizedItem, newItemCycles] = sanitizeCircularData(
              item,
              seenCodenames,
              foundItemCycles,
              element.name
            );
            foundItemCycles = { ...foundItemCycles, ...newItemCycles };
            return sanitizedItem;
          }),
        }
      : element;
  }
  // remove visited node codename when backtracking from recursion
  seenCodenames.delete(data.system.codename);

  return [{ ...data, elements: sanitizedElements }, foundItemCycles];
};

// replace closing circular reference with null,
const handleCircularReference = <T extends IContentItem>(
  data: T,
  seenCodenames: Set<string>,
  foundItemCycles: Record<string, CircularReferenceInfo[]>,
  elementName: string
): [T, Record<string, CircularReferenceInfo[]>] => {
  const seenCodenamesArray = Array.from(seenCodenames);
  const circleStartIndex = seenCodenamesArray.indexOf(data.system.codename);
  const cycle = seenCodenamesArray
    .slice(circleStartIndex)
    .concat(data.system.codename)
    .join(" → ");
  const parentItemCodename = seenCodenamesArray.pop()!;

  if (!foundItemCycles[parentItemCodename]) {
    foundItemCycles[parentItemCodename] = [];
  }

  foundItemCycles[parentItemCodename]!.push({ elementName, cycle });
  console.warn(`Circular reference found. Cycle: ${cycle}`);

  return [null as unknown as T, foundItemCycles];
};
