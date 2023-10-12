import {
  ContentItemElementsIndexer,
  Elements,
  IContentItem,
} from "@kontent-ai/delivery-sdk";

const isLinkableElement = (obj: any): obj is Elements.LinkedItemsElement => {
  return Array.isArray(obj.linkedItems);
};

export const sanitizeCircularData = <T extends IContentItem>(
  data: T,
  seenObjects = new WeakSet<T>()
): T => {
  if (seenObjects.has(data)) {
    console.warn(
      `Circular reference found in item with codename "${data.system.codename}" Problematic item removed, some UI components may not work correctly.`
    );
    return null as unknown as T;
  }

  seenObjects.add(data);

  const sanitizedElements: Record<string, ContentItemElementsIndexer | Elements.LinkedItemsElement> = {};

  for (const [key, element] of Object.entries(data.elements)) {
    sanitizedElements[key] = isLinkableElement(element)
      ? {
          ...element,
          linkedItems: element.linkedItems
            .map((item) => sanitizeCircularData(item, seenObjects))
        }
      : element;
  }

  const newData = { ...data, elements: sanitizedElements };

  seenObjects.delete(data);

  return newData;
};
