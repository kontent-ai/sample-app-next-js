import { type IContentItem, type Elements } from '@kontent-ai/delivery-sdk';
import { type GenericAction } from './genericAction';

/**
 * Generated by '@kontent-ai/model-generator@5.10.0'
 *
 * 🧱 Stack
 * Id: e0ee220a-4d5d-4a9a-aa9c-6733433bf4a2
 * Codename: stack
 */
export type Block_Stack = IContentItem<{
  /**
   * Message (text)
   * Required: false
   * Id: fd56aff1-e0f8-4611-ac59-3c14dfb647e9
   * Codename: message
   */
  message: Elements.TextElement;

  /**
   * Stack (modular_content)
   * Required: true
   * Id: 03baf56e-27a7-4f3a-be28-86f5deafc3f9
   * Codename: stack
   */
  stack: Elements.LinkedItemsElement<GenericAction>;

  /**
   * Title (text)
   * Required: false
   * Id: 489177d9-8fab-4ad0-bc57-92c107b340b0
   * Codename: title
   */
  title: Elements.TextElement;
}>;
