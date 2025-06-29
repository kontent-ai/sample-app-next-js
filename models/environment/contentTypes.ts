
/** 
* This file has been auto-generated by '@kontent-ai/model-generator@8.0.0-14'.
* 
* (c) Kontent.ai
*  
* -------------------------------------------------------------------------------
* 
* Project: Ficto Healthtech [QA Source project]
* Environment: Production 
* Id: b0255462-358c-007b-0be0-43ee125ce1f0
* 
* -------------------------------------------------------------------------------
**/

export const contentTypes = {
  /**
   * Person
   */
  person: {
    name: "Person",
    codename: "person",
    id: "3b8aea57-afdc-55b4-b7aa-30991e2515f8",
    externalId: "person-94147fa7-c60f-4a80-bee9-9efeaae9f858",
    elements: {
      /**
       * Photograph (asset)
       * Guidelines: Use a clear, professional, and high-quality headshot.
       */
      photograph: {
        name: "Photograph",
        codename: "photograph",
        id: "514655d3-a35d-5c58-8807-b62108651728",
        externalId: "photograph-fba5b46b-5052-4ed8-b405-bdc08af6b3d6",
        required: false,
        type: "asset",
      },

      /**
       * First name (text)
       */
      first_name: {
        name: "First name",
        codename: "first_name",
        id: "412e6d34-62aa-524a-b97f-a23b2cf3e252",
        externalId: "firstName-3a93ab33-5d97-4c00-b26d-02d8cf178a1f",
        required: true,
        type: "text",
      },

      /**
       * Last name (text)
       */
      last_name: {
        name: "Last name",
        codename: "last_name",
        id: "3b153753-6cd6-58e8-99ae-e60020ffd890",
        externalId: "lastName-35d83aef-7b5b-4ae3-98f4-73710ff01473",
        required: true,
        type: "text",
      },

      /**
       * Occupation (text)
       * Guidelines: Include relevant details about their job title, position, or area of expertise.
       */
      occupation: {
        name: "Occupation",
        codename: "occupation",
        id: "d73579bd-b03a-59e0-8464-63939e0cb6c7",
        externalId: "occupation-ae875fe0-0192-4220-95b4-1d48dc2a3cd2",
        required: false,
        type: "text",
      },

      /**
       * Bio (rich_text)
       * Guidelines: Write a biography that highlights the person's background and achievements. Don't forget to include relevant professional and educational information.
       */
      bio: {
        name: "Bio",
        codename: "bio",
        id: "4341b423-f053-523f-bd0f-b63b6c786532",
        externalId: "bio-769f658c-cb5a-48ea-8c0c-337647e5ed7b",
        required: false,
        type: "rich_text",
      },
    },
  },

  /**
   * Article
   */
  article: {
    name: "Article",
    codename: "article",
    id: "5568750a-d7fd-51fa-a8bb-a08940ac5395",
    externalId: "article-f3f94d06-ce91-42b5-ad0b-3827e02653af",
    elements: {
      /**
       * Title (text)
       * Guidelines: You can use online tools get score on your titles and incrementally improve it.
       */
      title: {
        name: "Title",
        codename: "title",
        id: "ae9be828-90fe-5fb4-ae3a-8dfe047e2567",
        externalId: "title-862e8b39-b10b-4448-9da3-cbb3f07378d1",
        required: true,
        type: "text",
      },

      /**
       * Hero Image (asset)
       */
      hero_image: {
        name: "Hero Image",
        codename: "hero_image",
        id: "ed868ae7-0b90-5752-a53b-aa4cfa2ca56e",
        externalId: "heroImage-890b7b02-d4ae-4ad9-ad8f-ad6d2d44b27c",
        required: true,
        type: "asset",
      },

      /**
       * Abstract (text)
       * Guidelines: Don't make it too long. At this point users decides, whether they want to continue reading!
       */
      abstract: {
        name: "Abstract",
        codename: "abstract",
        id: "5ae9979f-cc84-5c0b-81d8-65eabf11f2ec",
        externalId: "abstract-89139239-2ea2-4789-a3b7-aace73a9914d",
        required: false,
        type: "text",
      },

      /**
       * Article type (taxonomy)
       * Guidelines: Pick a suitable category for your article.
       */
      type: {
        name: "Article type",
        codename: "type",
        id: "c505fded-9c1f-5583-8cf2-dfa4763d2f2a",
        externalId: "articleType-cb380e8d-da66-40df-98d2-30e50e3df4e9",
        required: false,
        type: "taxonomy",
      },

      /**
       * Publishing date (date_time)
       */
      publishing_date: {
        name: "Publishing date",
        codename: "publishing_date",
        id: "dba8efd9-052c-557a-9dfd-3f43f966eab8",
        externalId: "publishingDate-1a33b696-88a9-4d15-8698-a617f6c908c5",
        required: true,
        type: "date_time",
      },

      /**
       * Content (rich_text)
       */
      content: {
        name: "Content",
        codename: "content",
        id: "7d4b95b0-76fc-552e-8931-c90dd2746399",
        externalId: "content-85bdaa99-d54f-4d43-be28-58c48f7b5dd8",
        required: true,
        type: "rich_text",
      },

      /**
       * Author (modular_content)
       */
      author: {
        name: "Author",
        codename: "author",
        id: "5be60600-49ac-52f8-a759-ab0ead3a3301",
        externalId: "author-aac99d24-3659-400b-96c7-8bf132177ab2",
        required: true,
        type: "modular_content",
      },

      /**
       * Slug (url_slug)
       */
      slug: {
        name: "Slug",
        codename: "slug",
        id: "7b9f3bb2-2efb-5285-8988-bfb66e45cf77",
        externalId: "slug-b2b11773-ce44-4a09-8306-2888fa55a6b6",
        required: true,
        type: "url_slug",
      },

      /**
       * Title (text)
       */
      metadata__title: {
        name: "Title",
        codename: "metadata__title",
        id: "49abab33-e5d1-55bb-9c1b-2f144430da28",
        externalId: "title-28c35ddc-2478-4026-ac5c-84a102ec9a3e",
        required: false,
        type: "text",
      },

      /**
       * Description (text)
       */
      metadata__description: {
        name: "Description",
        codename: "metadata__description",
        id: "e57614c6-e299-51c3-83bc-961f053dfe17",
        externalId: "description-3fcbbc28-52f7-4691-9e16-56c6bc4555bb",
        required: false,
        type: "text",
      },

      /**
       * Keywords (text)
       * Guidelines: Keywords should be separated by delimiter ","
       */
      metadata__keywords: {
        name: "Keywords",
        codename: "metadata__keywords",
        id: "f46d7c9a-a08f-5987-83e7-a061dd036842",
        externalId: "keywords-8c99c0f7-87ed-4df9-86db-34e112e3b3c9",
        required: false,
        type: "text",
      },
    },
  },

  /**
   * 🧭 Navigation item
   */
  navigation_item: {
    name: "🧭 Navigation item",
    codename: "navigation_item",
    id: "fc4d093f-9e1a-5c1a-a47c-21acf156dadf",
    externalId: "navigationItem-9f210108-90a0-4e61-a577-3f0b44d48d62",
    elements: {
      /**
       * Label (text)
       */
      reference__label: {
        name: "Label",
        codename: "reference__label",
        id: "15ee4053-00fd-5d5e-a2d7-4437079251ce",
        externalId: "label-6a1dec94-5127-4d8f-908c-3c0aedbe1f5b",
        required: false,
        type: "text",
      },

      /**
       * Caption (text)
       */
      reference__caption: {
        name: "Caption",
        codename: "reference__caption",
        id: "75684270-5e43-5d21-b93a-700f85e50853",
        externalId: "caption-7983245f-e1fc-4ed0-a185-f064e82cf5c7",
        required: false,
        type: "text",
      },

      /**
       * External URI (text)
       * Guidelines: Link to an external resource, has higher resolution priority than item link.
       */
      reference__external_uri: {
        name: "External URI",
        codename: "reference__external_uri",
        id: "580e3f46-f033-50d4-9f34-4ed91384f4e4",
        externalId: "externalURI-2d6525cc-0fe7-4c3e-8ebe-357711715c60",
        required: false,
        type: "text",
      },

      /**
       * Content item link (modular_content)
       * Guidelines: Link to a supported content item, resolution can vary based on presentation layer.
       */
      reference__content__item_link: {
        name: "Content item link",
        codename: "reference__content__item_link",
        id: "ed9d88d5-2375-57c3-9916-615eaae7d5da",
        externalId: "contentItemLink-5f68c354-0d2e-472d-a2a6-fdc928c55d97",
        required: false,
        type: "modular_content",
      },

      /**
       * Subitems (modular_content)
       * Guidelines: Fill with further Navigation items to create a hierarchical menu.
       */
      subitems: {
        name: "Subitems",
        codename: "subitems",
        id: "673d7bea-bd01-5bc2-bbd2-e51abc5f24bb",
        externalId: "subItems-46f08e0b-4e3a-4eb5-b179-4476583226d6",
        required: false,
        type: "modular_content",
      },
    },
  },

  /**
   * 🧱 Content chunk
   */
  content_chunk: {
    name: "🧱 Content chunk",
    codename: "content_chunk",
    id: "aaca014e-ca52-5543-b8fc-76509b245e87",
    externalId: "contentChunk-7ac4db42-e688-4d25-9bc1-58ea3b709e1d",
    elements: {
      /**
       * Content (rich_text)
       */
      content: {
        name: "Content",
        codename: "content",
        id: "b60790f9-7ed1-5b6d-92ed-15594b9e4253",
        externalId: "content-3021833e-be07-4abf-9b25-52e2dd915fe8",
        required: false,
        type: "rich_text",
      },
    },
  },

  /**
   * Action
   */
  action: {
    name: "Action",
    codename: "action",
    id: "46d20e5c-a72c-5a48-bfae-b054632877ca",
    externalId: "action-5feeec1d-9331-40ec-a18d-3acf5b2b0c23",
    elements: {
      /**
       * Label (text)
       */
      reference__label: {
        name: "Label",
        codename: "reference__label",
        id: "15ee4053-00fd-5d5e-a2d7-4437079251ce",
        externalId: "label-6a1dec94-5127-4d8f-908c-3c0aedbe1f5b",
        required: false,
        type: "text",
      },

      /**
       * Caption (text)
       */
      reference__caption: {
        name: "Caption",
        codename: "reference__caption",
        id: "75684270-5e43-5d21-b93a-700f85e50853",
        externalId: "caption-7983245f-e1fc-4ed0-a185-f064e82cf5c7",
        required: false,
        type: "text",
      },

      /**
       * External URI (text)
       * Guidelines: Link to an external resource, has higher resolution priority than item link.
       */
      reference__external_uri: {
        name: "External URI",
        codename: "reference__external_uri",
        id: "580e3f46-f033-50d4-9f34-4ed91384f4e4",
        externalId: "externalURI-2d6525cc-0fe7-4c3e-8ebe-357711715c60",
        required: false,
        type: "text",
      },

      /**
       * Content item link (modular_content)
       * Guidelines: Link to a supported content item, resolution can vary based on presentation layer.
       */
      reference__content__item_link: {
        name: "Content item link",
        codename: "reference__content__item_link",
        id: "ed9d88d5-2375-57c3-9916-615eaae7d5da",
        externalId: "contentItemLink-5f68c354-0d2e-472d-a2a6-fdc928c55d97",
        required: false,
        type: "modular_content",
      },

      /**
       * Image (asset)
       */
      image: {
        name: "Image",
        codename: "image",
        id: "bee5bc76-a644-546b-8e3b-e3b5c2dfe2c3",
        externalId: "image-793c7244-5f55-4081-ac0d-3c9ba11c8f60",
        required: false,
        type: "asset",
      },
    },
  },

  /**
   * 💡 Page
   */
  page: {
    name: "💡 Page",
    codename: "page",
    id: "c99c1b81-dc7a-4926-869c-fbdf543f83fa",
    externalId: undefined,
    elements: {
      /**
       * Title (text)
       */
      title: {
        name: "Title",
        codename: "title",
        id: "e0b23157-f172-4a27-a47c-aa81095edb63",
        externalId: undefined,
        required: false,
        type: "text",
      },

      /**
       * Slug (url_slug)
       * Guidelines: Make sure each page has a unique slug.
       */
      slug: {
        name: "Slug",
        codename: "slug",
        id: "9f99dba7-76b8-47cb-a3a0-c5a7b87dbfc9",
        externalId: undefined,
        required: false,
        type: "url_slug",
      },

      /**
       * Subpages (subpages)
       * Guidelines: Page of a website for the website tree in live preview.
       */
      subpages: {
        name: "Subpages",
        codename: "subpages",
        id: "a4f188c5-30c0-41aa-b238-b2777a6bb031",
        externalId: undefined,
        required: false,
        type: "subpages",
      },

      /**
       * Content (modular_content)
       * Guidelines: Populate with 🧱 type items to define the landing page structure and design.
       */
      content: {
        name: "Content",
        codename: "content",
        id: "52e19e9e-ea63-4f8e-96e9-13c05a4e7429",
        externalId: undefined,
        required: false,
        type: "modular_content",
      },

      /**
       * Title (text)
       */
      metadata__title: {
        name: "Title",
        codename: "metadata__title",
        id: "49abab33-e5d1-55bb-9c1b-2f144430da28",
        externalId: "title-28c35ddc-2478-4026-ac5c-84a102ec9a3e",
        required: false,
        type: "text",
      },

      /**
       * Description (text)
       */
      metadata__description: {
        name: "Description",
        codename: "metadata__description",
        id: "e57614c6-e299-51c3-83bc-961f053dfe17",
        externalId: "description-3fcbbc28-52f7-4691-9e16-56c6bc4555bb",
        required: false,
        type: "text",
      },

      /**
       * Keywords (text)
       * Guidelines: Keywords should be separated by delimiter ","
       */
      metadata__keywords: {
        name: "Keywords",
        codename: "metadata__keywords",
        id: "f46d7c9a-a08f-5987-83e7-a061dd036842",
        externalId: "keywords-8c99c0f7-87ed-4df9-86db-34e112e3b3c9",
        required: false,
        type: "text",
      },
    },
  },

  /**
   * Fact
   */
  fact: {
    name: "Fact",
    codename: "fact",
    id: "df18210c-bacd-5980-81a7-b35c2a66d81f",
    externalId: "fact-e5a475ac-8957-480b-a42b-2dc711cbb3b8",
    elements: {
      /**
       * Title (text)
       */
      title: {
        name: "Title",
        codename: "title",
        id: "75c5ed43-3eb7-5902-bf8b-4ddf8f830c8b",
        externalId: "title-3bd73b39-da80-4ecf-8a53-4972b39df0e4",
        required: false,
        type: "text",
      },

      /**
       * Message (text)
       */
      message: {
        name: "Message",
        codename: "message",
        id: "db8a7f6b-afd5-5170-bd6f-e450a96c8053",
        externalId: "message-82b47f3d-76e7-46fd-9fa0-692a3b8917d6",
        required: true,
        type: "text",
      },

      /**
       * Image (asset)
       * Guidelines: Images have different representation based on context where they are used, such as hero units or cards.
       */
      image: {
        name: "Image",
        codename: "image",
        id: "8c8946ce-e683-5df1-b029-967a3e43e056",
        externalId: "image-c64dc899-8efa-4ce9-8134-3f430856b712",
        required: false,
        type: "asset",
      },

      /**
       * Author (modular_content)
       * Guidelines: Images have different representation based on context where they are used, such as hero units or cards.
       */
      author: {
        name: "Author",
        codename: "author",
        id: "0ce7a459-f957-5a52-b7c6-52d3476ee2fc",
        externalId: "author-52193432-49ab-4245-bd94-86650bba7499",
        required: false,
        type: "modular_content",
      },

      /**
       * Fact type (taxonomy)
       * Guidelines: Fact type serves only the purpose of inventory sorting. It does not affect visual representation in any way.
       */
      fact_type: {
        name: "Fact type",
        codename: "fact_type",
        id: "b47c1ab1-118a-5b11-8709-ec0dba96cd3e",
        externalId: "type-b644c6d2-be32-4934-86d2-340c8df91d5c",
        required: false,
        type: "taxonomy",
      },

      /**
       * Label (text)
       */
      reference__label: {
        name: "Label",
        codename: "reference__label",
        id: "15ee4053-00fd-5d5e-a2d7-4437079251ce",
        externalId: "label-6a1dec94-5127-4d8f-908c-3c0aedbe1f5b",
        required: false,
        type: "text",
      },

      /**
       * Caption (text)
       */
      reference__caption: {
        name: "Caption",
        codename: "reference__caption",
        id: "75684270-5e43-5d21-b93a-700f85e50853",
        externalId: "caption-7983245f-e1fc-4ed0-a185-f064e82cf5c7",
        required: false,
        type: "text",
      },

      /**
       * External URI (text)
       * Guidelines: Link to an external resource, has higher resolution priority than item link.
       */
      reference__external_uri: {
        name: "External URI",
        codename: "reference__external_uri",
        id: "580e3f46-f033-50d4-9f34-4ed91384f4e4",
        externalId: "externalURI-2d6525cc-0fe7-4c3e-8ebe-357711715c60",
        required: false,
        type: "text",
      },

      /**
       * Content item link (modular_content)
       * Guidelines: Link to a supported content item, resolution can vary based on presentation layer.
       */
      reference__content__item_link: {
        name: "Content item link",
        codename: "reference__content__item_link",
        id: "ed9d88d5-2375-57c3-9916-615eaae7d5da",
        externalId: "contentItemLink-5f68c354-0d2e-472d-a2a6-fdc928c55d97",
        required: false,
        type: "modular_content",
      },
    },
  },

  /**
   * 🧩 Callout
   */
  callout: {
    name: "🧩 Callout",
    codename: "callout",
    id: "72c5b04f-e316-5912-baf2-8ccd2f0ad7a2",
    externalId: "callout-4a3b08ce-eb20-45bb-b4eb-5a9576d40ae4",
    elements: {
      /**
       * Type (multiple_choice)
       * Guidelines: Selecting a type affects the visual style of the callout to make its purpose instantly clear to the reader.
       */
      type: {
        name: "Type",
        codename: "type",
        id: "44dd9032-c950-53b8-91bd-c6c586233311",
        externalId: "type-bdd7f318-dc0b-40de-9d4f-ae5970cd2e26",
        required: true,
        type: "multiple_choice",
        options: {
          /**
           * Warning
           */
          warning: {
            name: "Warning",
            id: "32fdd712-8627-5782-bbb4-7a4739e9d6ab",
            codename: "warning",
            externalId: "warning-6498eaf0-3920-4a40-b76a-5160a0b68a6a",
          },

          /**
           * Info
           */
          info: {
            name: "Info",
            id: "182912d7-d863-5d4a-8a5a-758c4acb2cb7",
            codename: "info",
            externalId: "info-f9130046-45f4-4a87-abc9-6d05ff841976",
          },

          /**
           * Lightbulb
           */
          lightbulb: {
            name: "Lightbulb",
            id: "e0b420c5-e95f-5a51-83db-39627cecc00b",
            codename: "lightbulb",
            externalId: "lightbulb-c6baac0f-493a-4312-b263-4647dbd9e2e5",
          },
        },
      },

      /**
       * Content (rich_text)
       */
      content: {
        name: "Content",
        codename: "content",
        id: "15a9fc79-e85f-5bb1-8e81-d0362cd93b93",
        externalId: "content-0380c2b6-a9b4-4459-8a3e-56d3297a988a",
        required: true,
        type: "rich_text",
      },
    },
  },

  /**
   * Product
   */
  product: {
    name: "Product",
    codename: "product",
    id: "b23ee675-d1f5-53c3-9a8b-a2ed57b10aa6",
    externalId: "product-15ef7926-3248-4df3-9184-f0765c7c60b9",
    elements: {
      /**
       * Name (text)
       * Guidelines: Include key product attributes, such as brand name or model.
       */
      product_base__name: {
        name: "Name",
        codename: "product_base__name",
        id: "9647f1cc-3870-5b67-874b-d56fc2abd7ad",
        externalId: "name-3e01f16b-562a-4b2d-8f56-9fe1182b0a12",
        required: true,
        type: "text",
      },

      /**
       * Description (text)
       */
      product_base__description: {
        name: "Description",
        codename: "product_base__description",
        id: "30f6b775-071e-5a5a-9394-8251d2081b0e",
        externalId: "description-518d3ce8-be95-4c92-bc17-5415e7d51896",
        required: false,
        type: "text",
      },

      /**
       * Main image (asset)
       */
      product_base__main_image: {
        name: "Main image",
        codename: "product_base__main_image",
        id: "333cb56d-09c7-58a9-b759-97a0931ce8e6",
        externalId: "mainImage-7c02a80f-924e-459c-8e00-6486cf14a470",
        required: false,
        type: "asset",
      },

      /**
       * Product category (taxonomy)
       * Guidelines: Categorize the product with a suitable taxonomy term for improved navigation, filtering, and searchability.
       */
      category: {
        name: "Product category",
        codename: "category",
        id: "8a5acc99-d4ba-5fa1-9bd0-7a8e86e6e1c9",
        externalId: "category-c9335151-4aa9-4ef8-b87a-a161699b2a41",
        required: true,
        type: "taxonomy",
      },

      /**
       * Price (number)
       * Guidelines: Price in Euros.
       */
      price: {
        name: "Price",
        codename: "price",
        id: "e80d04c6-7f54-5b7a-b0ec-6c511138ed06",
        externalId: "price-2214d69c-ca5a-4e0b-ad62-7a11ff17824c",
        required: true,
        type: "number",
      },

      /**
       * Slug (url_slug)
       * Guidelines: ⚠️ Make sure each product has a unique slug.
       */
      slug: {
        name: "Slug",
        codename: "slug",
        id: "ac4fd00c-264e-5189-a4d7-5e7cb7ba1dad",
        externalId: "slug-b05dee4f-4602-46d8-8869-accc1822487d",
        required: false,
        type: "url_slug",
      },

      /**
       * Title (text)
       */
      metadata__title: {
        name: "Title",
        codename: "metadata__title",
        id: "49abab33-e5d1-55bb-9c1b-2f144430da28",
        externalId: "title-28c35ddc-2478-4026-ac5c-84a102ec9a3e",
        required: false,
        type: "text",
      },

      /**
       * Description (text)
       */
      metadata__description: {
        name: "Description",
        codename: "metadata__description",
        id: "e57614c6-e299-51c3-83bc-961f053dfe17",
        externalId: "description-3fcbbc28-52f7-4691-9e16-56c6bc4555bb",
        required: false,
        type: "text",
      },

      /**
       * Keywords (text)
       * Guidelines: Keywords should be separated by delimiter ","
       */
      metadata__keywords: {
        name: "Keywords",
        codename: "metadata__keywords",
        id: "f46d7c9a-a08f-5987-83e7-a061dd036842",
        externalId: "keywords-8c99c0f7-87ed-4df9-86db-34e112e3b3c9",
        required: false,
        type: "text",
      },
    },
  },

  /**
   * 💡 Website root
   */
  website_root: {
    name: "💡 Website root",
    codename: "website_root",
    id: "bc0ca9d3-82be-439d-8488-3f6104d58125",
    externalId: undefined,
    elements: {
      /**
       * Title (text)
       */
      title: {
        name: "Title",
        codename: "title",
        id: "54e73153-a0df-4fd4-84c0-c69300767f60",
        externalId: undefined,
        required: false,
        type: "text",
      },

      /**
       * Subpages (subpages)
       * Guidelines: Page of a website for the website tree in live preview.
       */
      subpages: {
        name: "Subpages",
        codename: "subpages",
        id: "fa27125f-c274-4ffe-bf4e-fef14bf47deb",
        externalId: undefined,
        required: false,
        type: "subpages",
      },

      /**
       * Navigation (modular_content)
       * Guidelines: Provide a valid Navigation item to define main website menu. Recursive nature of Navigation item type allows you to create a hierarchical mega menu. Two levels of nesting are supported by default.
       */
      navigation: {
        name: "Navigation",
        codename: "navigation",
        id: "49a9000d-8d82-5527-baca-d3fb97bebea0",
        externalId: "navigation-15797e1d-c32f-4ac0-9ddc-73901a83a6f6",
        required: true,
        type: "modular_content",
      },

      /**
       * Content (modular_content)
       * Guidelines: Populate with 🧱 type items to define the landing page structure and design.
       */
      content: {
        name: "Content",
        codename: "content",
        id: "39ffd885-9768-48b9-88d9-2a4035edf1ed",
        externalId: undefined,
        required: false,
        type: "modular_content",
      },

      /**
       * Title (text)
       */
      metadata__title: {
        name: "Title",
        codename: "metadata__title",
        id: "49abab33-e5d1-55bb-9c1b-2f144430da28",
        externalId: "title-28c35ddc-2478-4026-ac5c-84a102ec9a3e",
        required: false,
        type: "text",
      },

      /**
       * Description (text)
       */
      metadata__description: {
        name: "Description",
        codename: "metadata__description",
        id: "e57614c6-e299-51c3-83bc-961f053dfe17",
        externalId: "description-3fcbbc28-52f7-4691-9e16-56c6bc4555bb",
        required: false,
        type: "text",
      },

      /**
       * Keywords (text)
       * Guidelines: Keywords should be separated by delimiter ","
       */
      metadata__keywords: {
        name: "Keywords",
        codename: "metadata__keywords",
        id: "f46d7c9a-a08f-5987-83e7-a061dd036842",
        externalId: "keywords-8c99c0f7-87ed-4df9-86db-34e112e3b3c9",
        required: false,
        type: "text",
      },
    },
  },

  /**
   * 🧱 Visual container
   */
  visual_container: {
    name: "🧱 Visual container",
    codename: "visual_container",
    id: "188a66a1-5959-50a3-9073-a756171aff14",
    externalId: "type-658120a3-2de3-42ec-b075-d801fc15206c",
    elements: {
      /**
       * Title (text)
       */
      title: {
        name: "Title",
        codename: "title",
        id: "fbdd1530-319d-5c94-8bc7-c2c82f744272",
        externalId: "title-3d33fd3f-b56c-4411-88bb-b35d4732d760",
        required: false,
        type: "text",
      },

      /**
       * Subtitle (text)
       */
      subtitle: {
        name: "Subtitle",
        codename: "subtitle",
        id: "9a6832bb-d7b6-5954-aa80-92aee2b96441",
        externalId: "subtitle-c67d7827-6092-43ab-b7db-e206d7bef1b1",
        required: false,
        type: "text",
      },

      /**
       * Items (modular_content)
       */
      items: {
        name: "Items",
        codename: "items",
        id: "41ebb699-10b7-5493-b6d3-d6098ab5ebbc",
        externalId: "items-503f445d-785b-4db1-959b-d0246b621bb9",
        required: true,
        type: "modular_content",
      },

      /**
       * Visual representation (multiple_choice)
       * Guidelines: ⚠ You should try to avoid including visual information in the content.This is one of the edge cases that might be viable since this content type is used for website representation only.
       */
      visual_representation: {
        name: "Visual representation",
        codename: "visual_representation",
        id: "b81bc86b-7f9f-5d2f-909e-b973320531f4",
        externalId: "visualRepresentation-f62aa584-5632-4145-b2fb-09cacb0e897b",
        required: true,
        type: "multiple_choice",
        options: {
          /**
           * Hero Unit
           */
          hero_unit: {
            name: "Hero Unit",
            id: "80e7ae9b-75b6-57a2-a939-5e4f44223e40",
            codename: "hero_unit",
            externalId: "heroUnit-bf31e4c2-f319-4b57-9dd7-f66e1694ea0d",
          },

          /**
           * Grid
           */
          grid: {
            name: "Grid",
            id: "8bfdf55a-d655-5954-804f-1540cf8754e5",
            codename: "grid",
            externalId: "grid-1c2d0e89-fc86-4ea3-ab97-5a0989cc51c8",
          },

          /**
           * Stack
           */
          stack: {
            name: "Stack",
            id: "b7b2c152-aaf0-5bc9-972a-ee328e9003ed",
            codename: "stack",
            externalId: "stack-e96b1a57-3150-465f-a111-67f717381efe",
          },
        },
      },
    },
  },

  /**
   * Solution
   */
  solution: {
    name: "Solution",
    codename: "solution",
    id: "f750641e-b3aa-5e4a-9e21-c8871904894d",
    externalId: "type-ef9cf767-58a6-4494-84f6-fb030d478c18",
    elements: {
      /**
       * Name (text)
       * Guidelines: Include key product attributes, such as brand name or model.
       */
      product_base__name: {
        name: "Name",
        codename: "product_base__name",
        id: "9647f1cc-3870-5b67-874b-d56fc2abd7ad",
        externalId: "name-3e01f16b-562a-4b2d-8f56-9fe1182b0a12",
        required: true,
        type: "text",
      },

      /**
       * Description (text)
       */
      product_base__description: {
        name: "Description",
        codename: "product_base__description",
        id: "30f6b775-071e-5a5a-9394-8251d2081b0e",
        externalId: "description-518d3ce8-be95-4c92-bc17-5415e7d51896",
        required: false,
        type: "text",
      },

      /**
       * Main image (asset)
       */
      product_base__main_image: {
        name: "Main image",
        codename: "product_base__main_image",
        id: "333cb56d-09c7-58a9-b759-97a0931ce8e6",
        externalId: "mainImage-7c02a80f-924e-459c-8e00-6486cf14a470",
        required: false,
        type: "asset",
      },

      /**
       * Imaging technology (taxonomy)
       * Guidelines: Select the type of imaging technology the solution employs.
       */
      imaging_technology: {
        name: "Imaging technology",
        codename: "imaging_technology",
        id: "35fc766e-4d5d-58f1-a46f-3ea552eb388d",
        externalId: "imagingTechnology-d35d515e-b438-4dbd-8f17-e27301d625ae",
        required: true,
        type: "taxonomy",
      },

      /**
       * Showcase (rich_text)
       * Guidelines: Detailed description of the solution and its benefits. Use Fact items to extend the showcase with captioned cards and a call-to-action.
       */
      showcase: {
        name: "Showcase",
        codename: "showcase",
        id: "42b24153-7274-550d-8fc1-5f5daea12e89",
        externalId: "showcase-eea81790-4b16-4c28-a8e3-1d41c38af2fc",
        required: false,
        type: "rich_text",
      },

      /**
       * Slug (url_slug)
       * Guidelines: ⚠ Make sure each solution has a unique slug.
       */
      slug: {
        name: "Slug",
        codename: "slug",
        id: "0e2c3f0c-9958-53e9-91e4-d6344e08e845",
        externalId: "slug-506c13bb-4a0c-4648-992d-1ab3edff3b60",
        required: false,
        type: "url_slug",
      },

      /**
       * Title (text)
       */
      metadata__title: {
        name: "Title",
        codename: "metadata__title",
        id: "49abab33-e5d1-55bb-9c1b-2f144430da28",
        externalId: "title-28c35ddc-2478-4026-ac5c-84a102ec9a3e",
        required: false,
        type: "text",
      },

      /**
       * Description (text)
       */
      metadata__description: {
        name: "Description",
        codename: "metadata__description",
        id: "e57614c6-e299-51c3-83bc-961f053dfe17",
        externalId: "description-3fcbbc28-52f7-4691-9e16-56c6bc4555bb",
        required: false,
        type: "text",
      },

      /**
       * Keywords (text)
       * Guidelines: Keywords should be separated by delimiter ","
       */
      metadata__keywords: {
        name: "Keywords",
        codename: "metadata__keywords",
        id: "f46d7c9a-a08f-5987-83e7-a061dd036842",
        externalId: "keywords-8c99c0f7-87ed-4df9-86db-34e112e3b3c9",
        required: false,
        type: "text",
      },
    },
  },
} as const;
