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

  seenCodenames.add(data.system.codename);

  const sanitizedElements = Object.entries(data.elements).reduce<
    Record<string, ContentItemElementsIndexer | LinkableElement>
  >((acc, [elementCodename, element]) => {
    if (isLinkableElement(element)) {
      const [linkedItems, newItemCycles] = element.linkedItems.reduce(
        ([items, cycles], item) => {
          const [sanitizedItem, newCycles] = sanitizeCircularData(
            item,
            seenCodenames,
            cycles,
            element.name
          );
          return [items.concat(sanitizedItem), { ...cycles, ...newCycles }];
        },
        [[] as IContentItem[], foundItemCycles]
      );

      acc[elementCodename] = {
        ...element,
        linkedItems,
      };

      foundItemCycles = newItemCycles;
    } else {
      acc[elementCodename] = element;
    }

    return acc;
  }, {});

  // remove visited node codename when backtracking
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
