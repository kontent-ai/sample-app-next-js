import {
  ContentItemElementsIndexer,
  Elements,
  IContentItem,
} from "@kontent-ai/delivery-sdk";

/**
 * Module responsible for detecting and removing circular references
 * in content items from the Kontent.ai Delivery SDK.
 */

export type CircularReferenceInfo = {
  parentItemCodename: string;
  elementName: string;
  cycle: string[];
};

export type ItemCircularReferenceMap = Record<string, CircularReferenceInfo[]>;

type LinkableElement = Elements.LinkedItemsElement | Elements.RichTextElement;

/**
 * Identifies whether a given element can contain links to other items.
 * @param obj - The element to check.
 * @returns True if the element can contain links, false otherwise.
 */
const isLinkableElement = (
  obj: ContentItemElementsIndexer
): obj is LinkableElement => {
  return (
    "linkedItems" in obj && Array.isArray((obj as LinkableElement).linkedItems)
  );
};

/**
 * Performs a depth-first traversal to sanitize any content item references that would create a cycle.
 * Collects information on identified circular references.
 * @param data - The content item to sanitize.
 * @param elementName - The name of the current element being processed.
 * @param seenCodenames - Set of content item codenames visited during the recursion.
 * @param circularReferences - Accumulated list of detected circular references.
 * @returns A tuple containing the sanitized content item and the accumulated circular references.
 */
const sanitizeCircularDataInternal = <TItem extends IContentItem>(
  data: TItem,
  elementName = "",
  seenCodenames = new Set<string>(),
  circularReferences: CircularReferenceInfo[] = []
): [TItem, CircularReferenceInfo[]] => {
  if (seenCodenames.has(data.system.codename)) {
    const seenCodenamesArray = Array.from(seenCodenames);
    const itemCodename = seenCodenamesArray[seenCodenamesArray.length - 1]!;
    return [
      // Replaces circular reference with null. Cast necessary to adhere to type signature.
      null as unknown as TItem,
      [
        ...circularReferences,
        {
          cycle: [...seenCodenamesArray, data.system.codename],
          parentItemCodename: itemCodename,
          elementName,
        },
      ],
    ];
  }

  seenCodenames.add(data.system.codename);

  const sanitizedElements: Record<
    string,
    ContentItemElementsIndexer | LinkableElement
  > = {};

  // Recursively run the method for rich text and linked item elements, leave other elements unchanged.
  for (const [elementCodename, element] of Object.entries(data.elements)) {
    sanitizedElements[elementCodename] = isLinkableElement(element)
      ? {
          ...element,
          linkedItems: element.linkedItems.map((item) => {
            const [sanitizedItem, newCircularReferences] =
              sanitizeCircularDataInternal(
                item,
                element.name,
                seenCodenames,
                circularReferences
              );
            // Avoids infinite loop by filtering out duplicate findings.
            const uniqueNewReferences = newCircularReferences.filter(
              (reference) => !circularReferences.includes(reference)
            );
            circularReferences.push(...uniqueNewReferences);

            return sanitizedItem;
          }),
        }
      : element;
  }
  // Remove codename from visited set when backtracking from the recursion.
  seenCodenames.delete(data.system.codename);

  return [{ ...data, elements: sanitizedElements }, circularReferences];
};

/**
 * User-friendlier interface to the internal recursive function.
 * Sanitizes a content item by removing references that would otherwise create a cycle, potentially crashing the app.
 * Collects information on sanitized references (grouped by item codename) for use by warning messages.
 * @param data - The content item to sanitize.
 * @returns A tuple containing the sanitized content item and a structured record of detected circular references.
 */
export const sanitizeCircularData = <T extends IContentItem>(
  data: T
): [T, ItemCircularReferenceMap] => {
  const [sanitizedData, circularInfoArray] = sanitizeCircularDataInternal(data);

  return [
    sanitizedData,
    // Groups identified circular references by content item codename.
    circularInfoArray.reduce<ItemCircularReferenceMap>(
      (accumulator, currentItem) => {
        accumulator[currentItem.parentItemCodename] = (
          accumulator[currentItem.parentItemCodename] ?? []
        ).concat(currentItem);

        return accumulator;
      },
      {}
    ),
  ];
};
