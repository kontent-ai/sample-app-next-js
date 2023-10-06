import {
  ContentItemElementsIndexer,
  IContentItemElements,
  IContentItemSystemAttributes,
} from '@kontent-ai/delivery-sdk';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import KontentSmartLink, { KontentSmartLinkEvent } from '../../../../smart-link';
import {
  IUpdateMessageData,
  IUpdateMessageElement,
  IUpdateReference,
} from '../../../../smart-link/types/lib/IFrameCommunicatorTypes';

type DataMaps<TKey extends string, TValue> = {
  readonly byId: ReadonlyMap<TKey, TValue>;
  readonly byCodename: ReadonlyMap<TKey, TValue>;
}

type ElementData = Omit<IUpdateMessageElement, 'element'>

type Element = string;
type ElementDataMaps = DataMaps<Element, ElementData>;

type Variant = string;
type VariantDataMaps = DataMaps<Variant, ElementDataMaps>;

type Item = string;
type ItemDataMaps = DataMaps<Item, VariantDataMaps>;

type LivePreviewContextValue = {
  readonly updatedItems: ItemDataMaps | null;
};

const createEmptyMaps = <TKey extends string, TValue>(): DataMaps<TKey, TValue> => ({
  byId: new Map(),
  byCodename: new Map(),
});

const defaultContext: LivePreviewContextValue = {
  updatedItems: null,
};

const update = <TKey extends string, TValue extends unknown>(
  existing: DataMaps<TKey, TValue>,
  reference: IUpdateReference<TKey>,
  updater: (existing: TValue | undefined) => TValue,
): DataMaps<TKey, TValue> => ({
  byId: new Map<TKey, TValue>(existing.byId).set(
    reference.id,
    updater(existing.byId.get(reference.id)),
  ),
  byCodename: new Map<TKey, TValue>(existing.byCodename).set(
    reference.codename,
    updater(existing.byId.get(reference.codename)),
  ),
});

export const LivePreviewContext = React.createContext<LivePreviewContextValue>(defaultContext);

interface LivePreviewContextProps {
  readonly children: React.ReactNode;
  readonly smartLink: KontentSmartLink | null;
}

export const LivePreviewProvider: React.FC<LivePreviewContextProps> = ({
  children,
  smartLink,
}) => {
  const [updatedItems, setUpdatedItems] = useState<ItemDataMaps>(createEmptyMaps);

  const handleUpdate = useCallback((data: IUpdateMessageData) => {
    setUpdatedItems(items =>
      update(
        items,
        data.item,
        variants => update(
          variants ?? createEmptyMaps(),
          data.variant,
          elements => data.elements.reduce(
            (updatedElements, el) => {
              const {
                element,
                ...rest
              } = el;

              return update(
                updatedElements,
                element,
                () => rest,
              );
            },
            elements ?? createEmptyMaps<string, ElementData>(),
          ),
        ),
      ),
    );
  }, []);

  useEffect(() => {
    smartLink?.on(KontentSmartLinkEvent.Update, handleUpdate);

    return () => smartLink?.off(KontentSmartLinkEvent.Update, handleUpdate);
  }, [smartLink, handleUpdate]);

  const contextState = useMemo<LivePreviewContextValue>(
    () => ({ updatedItems: updatedItems }),
    [updatedItems]);

  return (
    <LivePreviewContext.Provider value={contextState}>
      {children}
    </LivePreviewContext.Provider>
  );
};

LivePreviewProvider.displayName = 'LivePreviewProvider';

type ItemData = {
  readonly system: Pick<IContentItemSystemAttributes, 'id' | 'language'>;
  readonly elements: IContentItemElements;
};

const isContentItemMinimum = (item: any): item is ItemData =>
  item.system?.id && item.system?.language;

const updateObject = <TObject extends Readonly<Record<string, unknown>>>(
  original: TObject,
  propUpdater: <TName extends string>(name: TName, current: TObject[TName]) => TObject[TName],
): TObject => {
  const updated = { ...original };
  let changed = false;
  for (const propertyName in original) {
    if (Object.hasOwn(original, propertyName)) {
      const value = original[propertyName];
      const newValue = propUpdater(propertyName, value);
      if (newValue !== value) {
        updated[propertyName] = newValue;
        changed = true;
      }
    }
  }
  return changed ? updated : original;
};

const hasLinkedItems = (
  element: ContentItemElementsIndexer & { readonly linkedItems?: unknown },
): element is ContentItemElementsIndexer & { readonly linkedItems: ItemData[] } =>
  isArrayOf(element.linkedItems, isContentItemMinimum);

const updateLinkedItems = (elements: IContentItemElements, updatedItems: ItemDataMaps): IContentItemElements =>
  updateObject(elements, (name, current) => {
    if (!hasLinkedItems(current)) {
      return current;
    }

    const newLinkedItems = updateItemArray(current.linkedItems, updatedItems);
    return (newLinkedItems !== current.linkedItems)
      ? {
        ...current,
        linkedItems: newLinkedItems,
      }
      : current;
  });

const updateElementData = (elements: IContentItemElements, updatedElements: ElementDataMaps | undefined): IContentItemElements =>
  updatedElements
    ? updateObject(
      elements,
      (name, current) => {
        const updated = updatedElements.byCodename.get(name);
        return updated
          ? {
            ...current,
            ...updated.data,
          }
          : current;
      },
    )
    : elements;

const updateItem = <TItem extends ItemData>(item: TItem, updatedItems: ItemDataMaps): TItem => {
  const updatedVariants = updatedItems.byId.get(item.system.id);
  const updatedElements = updatedVariants?.byCodename.get(item.system.language);

  const newElements = updateLinkedItems(updateElementData(item.elements, updatedElements), updatedItems);

  return (newElements !== item.elements)
    ? {
      ...item,
      elements: newElements,
    }
    : item;
};

export const isArray = <TValue extends unknown>(arg: unknown): arg is ReadonlyArray<TValue> =>
  arg instanceof Array;

export const isArrayOf = <TItem extends unknown>(arg: unknown, itemTypeGuard: (item: unknown) => item is TItem): arg is ReadonlyArray<TItem> => {
  return isArray(arg) && arg.every(itemTypeGuard);
};

const updateArray = <T extends unknown>(items: ReadonlyArray<T>, updater: (item: T) => T): ReadonlyArray<T> => {
  let changed = false;
  const newItems = items.map(item => {
    const newItem = updater(item);
    if (newItem !== item) {
      changed = true;
      return newItem;
    }
    return item;
  });
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return changed ? newItems : items;
};

const updateItemArray = <TItem extends ItemData>(items: ReadonlyArray<TItem>, updatedItems: ItemDataMaps): ReadonlyArray<TItem> =>
  updateArray(items, item => updateItem(item, updatedItems));

type OptionalItemData = null | undefined | ItemData;
type ArrayWithItemData = ReadonlyArray<ItemData>;
type ObjectWithItemData = Readonly<Record<string, OptionalItemData | ArrayWithItemData>>;

function useLive<TData extends ReadonlyArray<ItemData>>(data: TData, isPreview?: boolean): TData;
function useLive<TData extends OptionalItemData>(data: TData, isPreview?: boolean): TData;
function useLive<TData extends ObjectWithItemData>(data: TData, isPreview?: boolean): TData;
function useLive<TData extends OptionalItemData | ArrayWithItemData | ObjectWithItemData>(
  data: TData,
  isPreview: boolean = true,
): TData {
  const { updatedItems } = useContext(LivePreviewContext);
  if (!updatedItems) {
    throw new Error('You must place LivePreviewProvider to a parent component in order to use useLivePreview');
  }

  const updatedContent = useMemo(
    (): TData => {
      if (!data || !isPreview) {
        return data;
      }

      if (isContentItemMinimum(data)) {
        return updateItem(data, updatedItems);
      }

      if (isArrayOf(data, isContentItemMinimum)) {
        return updateItemArray(data, updatedItems) as TData;
      }

      if (typeof data === 'object') {
        return updateObject(
          data,
          (_, value) => {
            if (!value) {
              return value;
            }

            if (isContentItemMinimum(value)) {
              return updateItem(value, updatedItems);
            }

            if (isArrayOf(value, isContentItemMinimum)) {
              return updateItemArray(value, updatedItems);
            }

            return value;
          },
        ) as TData;
      }

      throw new Error('Unsupported type of data to update with live preview');
    },
    [data, updatedItems, isPreview],
  );

  return updatedContent;
}

export const useLivePreview = useLive;
