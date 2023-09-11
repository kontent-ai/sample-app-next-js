import { PortableTextBlock } from "@portabletext/types";

export const sanitizeFirstChildText = (block: PortableTextBlock): string => {
    const firstChild = block.children[0];

    if (!firstChild) {
        console.info(`Block with "${block._key}" key does not contain children.`)
        return "";
    }
   
    const input = String(firstChild.text);

    if(!input) {
        console.warn(`First child of the block with "${block._key}" key does not have any text - trying to use key for anchor.`)
        return sanitizeAnchor(firstChild._key || "");
    }

    return sanitizeAnchor(input);
}

export const sanitizeAnchor = (input: string): string => {
    const result = input.replace(/[^\w]/g, "_");
    if (!result) {
        console.info(`Anchor value sanitization produced empty string from "${input}"`)
    }
    return result;
}