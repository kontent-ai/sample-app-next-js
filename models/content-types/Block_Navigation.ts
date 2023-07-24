import { type IContentItem, type Elements } from '@kontent-ai/delivery-sdk';
import { type WSL_Page } from './WSL_Page';
import { type WSL_WebSpotlightRoot } from './WSL_WebSpotlightRoot';

/**
 * Generated by '@kontent-ai/model-generator@5.10.0'
 *
 * 🧱 Navigation
 * Id: 08ad03e2-c164-56e7-9903-52f615e8ec82
 * Codename: navigation
 */
export type Block_Navigation = IContentItem<{
  /**
   * Caption (text)
   * Required: false
   * Id: 1504c067-40bf-5efd-b5c9-88f5ff2fe5a5
   * Codename: caption
   */
  caption: Elements.TextElement;

  /**
   * External Link (text)
   * Required: false
   * Id: 117e0dd9-c73f-59df-81dc-c3dfaf1155af
   * Codename: external_link
   *
   * Use when the navigation item points to an external URL.
   */
  externalLink: Elements.TextElement;

  /**
   * Label (text)
   * Required: true
   * Id: 1eb29cfa-1eba-5855-8fb9-09bc7e32dcba
   * Codename: label
   */
  label: Elements.TextElement;

  /**
   * Open in a new window (multiple_choice)
   * Required: false
   * Id: 6b4e2db2-9624-50b2-8aff-64f9a070e442
   * Codename: open_in_a_new_window
   */
  openInANewWindow: Elements.MultipleChoiceElement;

  /**
   * Page Link (modular_content)
   * Required: false
   * Id: b59af59b-0db1-5b7c-a92e-69f225b52b8c
   * Codename: page_link
   *
   * Use to link navigation item to an internal page.
   */
  pageLink: Elements.LinkedItemsElement<WSL_Page | WSL_WebSpotlightRoot>;

  /**
   * Subitems (modular_content)
   * Required: false
   * Id: 2a2104ce-cb8d-5d6b-a90f-a78183efc478
   * Codename: subitems
   */
  subitems: Elements.LinkedItemsElement<Block_Navigation>;
}>;
