export const createItemSmartLink = (itemId: string | undefined, disableHighlight: boolean = false) => withDisable(disableHighlight, {
  "data-kontent-item-id": itemId,
});

export const createElementSmartLink = (elementCodename: string, disableHighlight: boolean = false) => withDisable(disableHighlight, {
  "data-kontent-element-codename": elementCodename
});

const withDisable = (disable: boolean, attrs: Readonly<Record<string, string | undefined>>) => disable
  ? { ...attrs, ...disableAttribute }
  : attrs;

const disableAttribute = {
  "data-kontent-disable-features": "highlight",
}
