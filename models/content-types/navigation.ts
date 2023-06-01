import { type IContentItem, type Elements } from '@kontent-ai/delivery-sdk';
import { type WSL_Page } from './WSL_Page';

/**
 * Generated by '@kontent-ai/model-generator@5.10.0'
 *
 * Navigation
 * Id: 0959526f-414e-455f-8987-23f43caa198b
 * Codename: navigation
 */
export type Navigation = IContentItem<{
  /**
   * Caption (text)
   * Required: false
   * Id: 3c444b7e-7c75-4ad0-bde2-8843b1db8806
   * Codename: caption
   */
  caption: Elements.TextElement;

  /**
   * External link (text)
   * Required: false
   * Id: ef922ba0-5943-424c-87da-d75b2a5fd757
   * Codename: external_link
   *
   * Use when the navigation item points to an external URL.
   */
  externalLink: Elements.TextElement;

  /**
   * Label (text)
   * Required: true
   * Id: 4a51541b-d628-459b-a558-d3f00a612bf4
   * Codename: label
   */
  label: Elements.TextElement;

  /**
   * Open in a new window (multiple_choice)
   * Required: false
   * Id: 9f607e0f-8baa-4028-81ee-e6c059847d5e
   * Codename: open_in_a_new_window
   */
  openInANewWindow: Elements.MultipleChoiceElement;

  /**
   * Page link (modular_content)
   * Required: false
   * Id: aaa302cf-7222-4e7b-8927-01fbec047a4f
   * Codename: page_link
   *
   * Use to link navigation item to an internal page.
   */
  pageLink: Elements.LinkedItemsElement<WSL_Page>;

  /**
   * Subitems (subpages)
   * Required: false
   * Id: ff306ed1-b5de-4f0f-85fd-b8548efc4c29
   * Codename: subitems
   */
  subitems: Elements.LinkedItemsElement<Navigation>;
}>;
