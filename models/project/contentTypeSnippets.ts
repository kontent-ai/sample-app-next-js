/**
 * Generated by '@kontent-ai/model-generator@5.10.0'
 *
 * Project name: Empty-migration-testing-project
 * Environment: Production
 * Project Id: 77e9b818-c4a5-01cd-d590-4cdb72cd5875
 */
export const contentTypeSnippets = {
  /**
   * 💡 Emoji guideline
   */
  _emoji_guideline_90c26f3: {
    codename: '_emoji_guideline_90c26f3',
    id: '90c26f3d-2866-5955-b65e-f52ad8a0a481',
    externalId: 'bulbSnippet-35260293-daeb-4de7-b7d3-7f771538e262',
    name: '💡 Emoji guideline',
    elements: {},
  },

  /**
   * 🧩 Emoji guideline
   */
  _emoji_guideline_0de9f7c: {
    codename: '_emoji_guideline_0de9f7c',
    id: '0de9f7c1-1ce0-591d-b93f-fe4859efd627',
    externalId: 'puzzleSnippet-92638968-f2bd-4843-bd17-e86dd3926a92',
    name: '🧩 Emoji guideline',
    elements: {},
  },

  /**
   * 🧱 Emoji guideline
   */
  _emoji_guideline: {
    codename: '_emoji_guideline',
    id: 'f6739376-35b8-598f-8643-2f4f12992fe3',
    externalId: 'brickSnippet-d8d5c03f-7672-4e2d-8968-770c5b69e2c8',
    name: '🧱 Emoji guideline',
    elements: {},
  },

  /**
   * Product base
   */
  product_base: {
    codename: 'product_base',
    id: '9ea9dbe1-9ca7-5bbe-bfef-8e96df1e4044',
    externalId: 'productBase-5784c148-2295-44d0-97bb-6ba297db7da1',
    name: 'Product base',
    elements: {
      /**
       * Name (text)
       */
      product_base__name: {
        codename: 'product_base__name',
        id: 'aab465ac-98a8-55f5-8086-c9ba305f38b0',
        externalId: 'name-214fc94a-9d73-4109-ab49-599e908e9c4d',
        name: 'Name',
        required: true,
        type: 'text',
      },

      /**
       * Description (text)
       */
      product_base__description: {
        codename: 'product_base__description',
        id: '8814c67a-3063-53e7-aa92-5f37f006b24d',
        externalId: 'description-6badabeb-b13d-4f2f-814b-e8e56512adab',
        name: 'Description',
        required: true,
        type: 'text',
      },

      /**
       * Main image (asset)
       *
       * Use images with no background if possible.
       */
      product_base__main_image: {
        codename: 'product_base__main_image',
        id: '7fc4b72c-6d61-5cb4-a398-8941d007b14e',
        externalId: 'mainImage-7216a8d7-7574-4321-91a6-60f4d73ceac6',
        name: 'Main image',
        required: true,
        type: 'asset',
      },
    },
  },

  /**
   * SEO Metadata
   */
  seo_metadata: {
    codename: 'seo_metadata',
    id: '3ad33660-1d2b-578b-8b3e-129f2a2e552f',
    externalId: 'SEOMetadata-2e4a04aa-55bd-48ae-a1c7-b303fde97a5d',
    name: 'SEO Metadata',
    elements: {
      /**
       * Title (text)
       */
      seo_metadata__title: {
        codename: 'seo_metadata__title',
        id: 'd278379c-9f60-58f8-92e0-0e665033dd95',
        externalId: 'title-897b2878-2b80-48ea-a328-16e25a384bb7',
        name: 'Title',
        required: false,
        type: 'text',
      },

      /**
       * Description (text)
       */
      seo_metadata__description: {
        codename: 'seo_metadata__description',
        id: '0ae36299-95cb-54d7-9be9-7d76ee6f4be0',
        externalId: 'description-67490da2-0356-44cc-a7ed-e47afc5487a9',
        name: 'Description',
        required: false,
        type: 'text',
      },

      /**
       * Keywords (text)
       */
      seo_metadata__keywords: {
        codename: 'seo_metadata__keywords',
        id: 'a0f7ffe0-5e94-532f-a86e-d77761eb35af',
        externalId: 'keywords-2b4ba0dc-10f1-4da9-b559-3c374c45517d',
        name: 'Keywords',
        required: false,
        type: 'text',
      },
    },
  },
} as const;
