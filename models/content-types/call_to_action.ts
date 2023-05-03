import { type IContentItem, type Elements } from '@kontent-ai/delivery-sdk';
/**
 * Generated by '@kontent-ai/model-generator@5.10.0'
 *
 * Call to action
 * Id: 11c3fbcd-2de0-4f56-96e5-f080bb9a28d1
 * Codename: call_to_action
 */
export type CallToAction = IContentItem<{
  /**
   * CTA Image (asset)
   * Required: false
   * Id: 20971f85-0c14-4698-b92d-e4be7347069f
   * Codename: cta_image
   */
  ctaImage: Elements.AssetsElement;

  /**
   * Subtitle (text)
   * Required: false
   * Id: 1feb250b-c828-4b32-9196-d70d66b84bd9
   * Codename: subtitle
   */
  subtitle: Elements.TextElement;

  /**
   * Title (text)
   * Required: false
   * Id: 2a1e51f1-3128-4321-8cf5-38e821712af0
   * Codename: title
   */
  title: Elements.TextElement;
}>;