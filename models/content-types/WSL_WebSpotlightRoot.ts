import { type IContentItem, type Elements } from '@kontent-ai/delivery-sdk';
import { type Block_ContentChunk } from './Block_ContentChunk';
import { type Block_HeroUnit } from './Block_HeroUnit';
import { type Block_Navigation } from './Block_Navigation';
import { type Block_VisualContainer } from './Block_VisualContainer';
import { type SEOMetadata } from '../content-type-snippets/SEOMetadata';
import { type Testimonial } from './testimonial';
import { type WSL_EmojiGuideline } from '../content-type-snippets/WSL_EmojiGuideline';
import { type WSL_Page } from './WSL_Page';

/**
 * Generated by '@kontent-ai/model-generator@5.10.0'
 *
 * 💡 Web spotlight root
 * Id: d1b31599-03ac-4158-abb0-8caac007966f
 * Codename: web_spotlight_root
 */
export type WSL_WebSpotlightRoot = IContentItem<{
  /**
   * Content (modular_content)
   * Required: false
   * Id: 2224f968-6c01-4059-be4d-9ed506fac40f
   * Codename: content
   */
  content: Elements.LinkedItemsElement<
    Block_HeroUnit | Block_ContentChunk | Testimonial | Block_VisualContainer
  >;

  /**
   * Navigation (modular_content)
   * Required: true
   * Id: a1a6b4d4-2f47-5071-aa53-1d283d2dee3e
   * Codename: navigation
   */
  navigation: Elements.LinkedItemsElement<Block_Navigation>;

  /**
   * Subpages (subpages)
   * Required: false
   * Id: 72f5055a-1515-4b91-a653-767c3ce003e6
   * Codename: subpages
   */
  subpages: Elements.LinkedItemsElement<WSL_Page | WSL_WebSpotlightRoot>;

  /**
   * Title (text)
   * Required: false
   * Id: 22b4db7c-bacf-4072-b4fe-db4dd187e9a0
   * Codename: title
   */
  title: Elements.TextElement;
}> &
  WSL_EmojiGuideline &
  SEOMetadata;
