import {
  ContentItemElementsIndexer,
  Elements,
  IContentItem,
  IContentItemElements,
  IContentItemsContainer,
  IPagination,
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

type ElementWithLinkedItems =
  | Elements.LinkedItemsElement
  | Elements.RichTextElement;

interface IContentItemListingResponse<T extends IContentItem> {
  items: T[];
  pagination: IPagination;
  linkedItems: IContentItemsContainer;
}

/**
 * Identifies whether a given element can contain linked items.
 * @param obj - The element to check.
 * @returns True for rich text and linked items elements, false otherwise.
 */
const isElementWithLinkedItems = (
  obj: ContentItemElementsIndexer
): obj is ElementWithLinkedItems => {
  return (
    "linkedItems" in obj &&
    Array.isArray((obj as ElementWithLinkedItems).linkedItems)
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
  seenCodenames = new Set<string>()
): [TItem, CircularReferenceInfo[]] => {
  const circularReferences: CircularReferenceInfo[] = [];

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

  // recursively call method for RTE or linked items elements, otherwise return element as is
  const sanitizedElements = Object.entries(
    data.elements
  ).reduce<IContentItemElements>((acc, [elementCodename, element]) => {
    return {
      ...acc,
      [elementCodename]: isElementWithLinkedItems(element)
        ? {
            ...element,
            linkedItems: element.linkedItems.map((item) => {
              const [sanitizedItem, newCircularReferences] =
                sanitizeCircularDataInternal(item, element.name, seenCodenames);
              circularReferences.push(...newCircularReferences);

              return sanitizedItem;
            }),
          }
        : element,
    };
  }, {});

  // Remove codename from visited set when backtracking from the recursion.
  seenCodenames.delete(data.system.codename);

  return [{ ...data, elements: sanitizedElements }, circularReferences];
};

/**
 * Sanitizes a content item by removing references that would otherwise create a cycle, potentially crashing the app.
 * Collects information on sanitized references (grouped by item codename) for use by warning messages.
 * @param item - The content item to sanitize.
 * @returns A tuple containing the sanitized content item and a structured record of detected circular references.
 */
export const sanitizeItem = <TItem extends IContentItem>(
  item: TItem
): [TItem, ItemCircularReferenceMap] => {
  const [sanitizedData, circularInfoArray] = sanitizeCircularDataInternal(item);

  return [
    sanitizedData,
    // Groups identified circular references by content item codename.
    circularInfoArray.reduce<ItemCircularReferenceMap>(
      (accumulator, currentReference) => {
        accumulator[currentReference.parentItemCodename] = (
          accumulator[currentReference.parentItemCodename] ?? []
        ).concat(currentReference);

        return accumulator;
      },
      {}
    ),
  ];
};

/**
 * Sanitizes each item in a listing response, removing references that would otherwise create a cycle, potentially crashing the app.
 * Collects information on sanitized references (grouped by item codename) for use by warning messages.
 * @param itemListing - Listing response from the SDK.
 * @returns A tuple containing the sanitized listing response and a structured record of detected circular references.
 */
export const sanitizeItemListing = <TItem extends IContentItem>(
  itemListing: IContentItemListingResponse<TItem>
): [IContentItemListingResponse<TItem>, ItemCircularReferenceMap] => {
  const listingCircularInfoArray: CircularReferenceInfo[] = [];
  const sanitizedItems: TItem[] = [];

  itemListing.items.forEach((item) => {
    const [sanitizedItem, circularInfoArray] =
      sanitizeCircularDataInternal(item);
    sanitizedItems.push(sanitizedItem);
    listingCircularInfoArray.push(...circularInfoArray);
  });

  return [
    {
      ...itemListing,
      items: sanitizedItems,
    },
    listingCircularInfoArray.reduce<ItemCircularReferenceMap>(
      (accumulator, currentReference) => {
        accumulator[currentReference.parentItemCodename] = (
          accumulator[currentReference.parentItemCodename] ?? []
        ).concat(currentReference);

        return accumulator;
      },
      {}
    ),
  ];
};
