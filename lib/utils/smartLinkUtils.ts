export const createItemSmartLink = (itemId: string | undefined, disableHighlight: boolean = false) => withDisable(disableHighlight, {
  "data-kontent-item-id": itemId,
});

export const createElementSmartLink = (elementCodename: string, disableHighlight: boolean = false) => withDisable(disableHighlight, {
  "data-kontent-element-codename": elementCodename
});

export const createFixedAddSmartLink = (position: "start" | "end", renderPosition?: RenderPosition) => ({
  "data-kontent-add-button": true,
  "data-kontent-add-button-insert-position": position,
  "data-kontent-add-button-render-position": renderPosition,
});

type RenderPosition = "bottom-start" | "bottom" | "bottom-end" | "left-start" | "left" | "left-end" | "top-start" | "top" | "top-end" | "right-start" | "right" | "right-end";

const withDisable = (disable: boolean, attrs: Readonly<Record<string, string | undefined>>) => disable
  ? { ...attrs, ...disableAttribute }
  : attrs;

const disableAttribute = {
  "data-kontent-disable-features": "highlight",
}
