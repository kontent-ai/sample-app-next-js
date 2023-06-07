import { type IContentItem, type Elements } from '@kontent-ai/delivery-sdk';
import { type Block_CallToAction } from './Block_CallToAction';
import { type Block_Carousel } from './Block_Carousel';
import { type Block_ContentChunk } from './Block_ContentChunk';
import { type Block_Grid } from './Block_Grid';
import { type Block_HeroUnit } from './Block_HeroUnit';
import { type Block_Navigation } from './Block_Navigation';
import { type Block_Stack } from './Block_Stack';
import { type Block_Testimonial } from './Block_Testimonial';
import { type WSL_Page } from './WSL_Page';

/**
 * Generated by '@kontent-ai/model-generator@5.10.0'
 *
 * 💡 Web spotlight root
 * Id: 228de48c-ffb2-4b5e-862f-47e2c60e0c01
 * Codename: web_spotlight_root
 */
export type WSL_WebSpotlightRoot = IContentItem<{
  /**
   * Content (modular_content)
   * Required: false
   * Id: 94e31e00-81b8-4ab4-b17b-7d165ed3020e
   * Codename: content
   */
  content: Elements.LinkedItemsElement<
    | Block_CallToAction
    | Block_Stack
    | Block_Carousel
    | Block_HeroUnit
    | Block_Grid
    | Block_ContentChunk
    | Block_Testimonial
  >;

  /**
   * Navigation (modular_content)
   * Required: true
   * Id: a026a51c-fa29-4dfd-bf6b-cafe2f0ecb0f
   * Codename: navigation
   */
  navigation: Elements.LinkedItemsElement<Block_Navigation>;

  /**
   * Subpages (subpages)
   * Required: false
   * Id: 61be1529-49fc-43b6-ba33-962a360e4c9f
   * Codename: subpages
   */
  subpages: Elements.LinkedItemsElement<WSL_Page | Block_Navigation>;

  /**
   * Title (text)
   * Required: false
   * Id: 9a340e66-9416-455e-8763-848a330a4b2e
   * Codename: title
   */
  title: Elements.TextElement;
}>;
