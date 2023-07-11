import { type IContentItem, type Elements } from '@kontent-ai/delivery-sdk';
import { type ProductCategory } from '../taxonomies/productCategory';
import { type SEOMetadata } from '../content-type-snippets/SEOMetadata';

/**
 * Generated by '@kontent-ai/model-generator@5.10.0'
 *
 * Product
 * Id: d8195a31-dd83-402a-9fac-019c14978cb3
 * Codename: product
 */
export type Product = IContentItem<{
  /**
   * Product category (taxonomy)
   * Required: true
   * Id: 606496e4-acf4-423b-bf60-453dcd1e0ce7
   * Codename: category
   */
  category: Elements.TaxonomyElement<ProductCategory>;

  /**
   * Description (text)
   * Required: false
   * Id: 74e64991-93d6-467f-84f9-d39b9b8b83f2
   * Codename: description
   */
  description: Elements.TextElement;

  /**
   * Price (number)
   * Required: true
   * Id: 0d215ac7-1c98-42ac-aec6-7f02ad4f34f9
   * Codename: price
   *
   * Price in Euros.
   */
  price: Elements.NumberElement;

  /**
   * Product image (asset)
   * Required: false
   * Id: ec77bde2-a08a-4c91-9105-faf43a1899be
   * Codename: product_image
   *
   * Use images with no background if possible.
   */
  productImage: Elements.AssetsElement;

  /**
   * Slug (url_slug)
   * Required: false
   * Id: 0a75f346-deea-464b-a278-43d9c3bcc2b4
   * Codename: slug
   */
  slug: Elements.UrlSlugElement;

  /**
   * Title (text)
   * Required: true
   * Id: 3a30f214-983b-4fd2-b72b-f7116d6040ca
   * Codename: title
   */
  title: Elements.TextElement;
}> &
  SEOMetadata;
