// Kontent.ai Delivery API


import { createDeliveryClient, camelCasePropertyNameResolver, IContentItem } from '@kontent-ai/delivery-sdk'
import { createManagementClient, SpaceModels } from '@kontent-ai/management-sdk';
import { HeroUnit, Homepage } from '../models';

const sourceTrackingHeaderName = 'X-KC-SOURCE'

const deliveryClient = createDeliveryClient({
  environmentId: process.env.KONTENT_ENVIRONMENT_ID || "975bf280-fd91-488c-994c-2f04416e5ee3",
  globalHeaders: (_queryConfig) => [
    {
      header: sourceTrackingHeaderName,
      value: `${process.env.APP_NAME || "n/a"};${process.env.APP_VERSION || "n/a"}`,
    },
  ],
  propertyNameResolver: camelCasePropertyNameResolver,
  proxy: {
    baseUrl: "http://deliver.devkontentmasters.com",
    basePreviewUrl: "http://preview-deliver.devkontentmasters.com",
  },
  previewApiKey: process.env.KONTENT_PREVIEW_API_KEY
});

const managementClient = createManagementClient({
  apiKey: process.env.KONTENT_MANAGEMENT_KEY || 'key not found',
  baseUrl: "https://manage.devkontentmasters.com/v2",
  environmentId: process.env.KONTENT_ENVIRONMENT_ID,
});

export async function getHeroUnit(): Promise<HeroUnit> {
  const response = await deliveryClient
    .item<HeroUnit>('home_page_hero_unit')
    .toPromise()

  return (response.data.item);
}

const getSpace = (): Promise<SpaceModels.Space> => managementClient
  .viewSpace()
  .bySpaceCodename(process.env.KONTENT_SPACE_CODENAME || "")
  .toPromise()
  .then(res => res.data)

const getItemById = async <ItemType extends IContentItem>(id: string, usePreview: boolean) => {
  const mapiItem = await managementClient.viewContentItem().byItemId(id).toPromise();
  return deliveryClient
    .item<ItemType>(mapiItem.data.codename)
    .queryConfig({
      usePreviewMode: usePreview,
    })
    .toPromise()
    .then(res => res.data);
}

export const getRootItem = (usePreview: boolean) =>
  getSpace()
    .then(s => getItemById<Homepage>(s.webSpotlightRootItem?.id ?? "", usePreview))
    .then(res => res.item)

export const getItemByCodename = async <ItemType extends IContentItem>(codename: string, usePreview: boolean) =>
  deliveryClient
    .item<ItemType>(codename)
    .queryConfig({
      usePreviewMode: usePreview,
    })
    .toPromise()
    .then(res => res.data.item);

