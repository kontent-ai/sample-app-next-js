import { Elements, IContentItem } from "@kontent-ai/delivery-sdk";

const isLinkedItemsElement = (obj: any): obj is Elements.LinkedItemsElement<IContentItem> => {
    return Array.isArray(obj.linkedItems);
}

const isRichTextElement = (obj: any): obj is Elements.RichTextElement => {
    return obj.links !== undefined && obj.images !== undefined && Array.isArray(obj.linkedItems);
}

export const sanitizeCircularData = (data: any, seenObjects = new WeakSet()): any => {
    if (data && typeof data === 'object') {
        seenObjects.add(data);

        if (isLinkedItemsElement(data) || isRichTextElement(data)) {
            return {
                ...data,
                linkedItems: data.linkedItems.map(item => {
                    if (seenObjects.has(item)) {
                        return null;
                    } else {
                        return sanitizeCircularData(item, seenObjects);
                    }
                }).filter(item => item !== null)
            };
        } else {
            const newData: any = {};
            for (let key in data) {
                newData[key] = sanitizeCircularData(data[key], seenObjects);
            }
            return newData;
        }
    }

    return data;
}

