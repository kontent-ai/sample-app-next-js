import { type IContentItem, type Elements } from '@kontent-ai/delivery-sdk';
/**
 * Generated by '@kontent-ai/model-generator@5.10.0'
 *
 * Milestone
 * Id: 71d17027-a0e8-5366-8373-cca093fb190d
 * Codename: milestone
 */
export type Milestone = IContentItem<{
  /**
   * Achievement (text)
   * Required: true
   * Id: 7b5abc87-10de-580b-b350-22e2c1e8c97e
   * Codename: achievement
   */
  achievement: Elements.TextElement;

  /**
   * Subject (text)
   * Required: true
   * Id: d6428ff0-bc13-57df-b7be-70ebe5f79a90
   * Codename: subject
   */
  subject: Elements.TextElement;
}>;
