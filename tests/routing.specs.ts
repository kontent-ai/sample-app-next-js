import { ElementType } from "@kontent-ai/delivery-sdk";
import { ResolutionContext, resolveReference, resolveUrlPath } from "../lib/routing";
import { Article, CoreContentType, Product, Reference, WSL_Page, WSL_WebSpotlightRoot } from "../models";


describe("resolveUrlPath", () => {
  it.each([
    [
      {
        type: "page",
        slug: "test-slug"
      } as ResolutionContext,
      "/test-slug"
    ],
    [
      {
        type: "web_spotlight_root",
      } as ResolutionContext,
      "/"
    ],
    [
      {
        type: "article",
        slug: "test-slug"
      } as ResolutionContext,
      "/articles/test-slug"
    ],
    [
      {
        type: "product",
        slug: "test-slug"
      } as ResolutionContext,
      "/products/test-slug"
    ],
    [
      {
        type: "article",
        term: "all"
      } as ResolutionContext,
      "/articles"
    ],
    [
      {
        type: "article",
        term: "news"
      } as ResolutionContext,
      "/articles/category/news"
    ],
    [
      {
        type: "product",
        terms: ["cutting"]
      } as ResolutionContext,
      "/products?category=cutting"
    ],
    [
      {
        type: "product",
        terms: []
      } as ResolutionContext,
      "/products"
    ],
    [
      {
        type: "product",
        terms: ["cutting", "grasping"]
      } as ResolutionContext,
      "/products?category=cutting&category=grasping"
    ],
    [
      {
        type: "article",
        term: "all",
        page: 3
      } as ResolutionContext,
      "/articles/category/all/page/3"
    ],
    [
      {
        type: "article",
        term: "news",
        page: 3
      } as ResolutionContext,
      "/articles/category/news/page/3"
    ],
    [
      {
        type: "product",
        terms: ["cutting"],
        page: 3
      } as ResolutionContext,
      "/products?category=cutting&page=3"
    ],
    [
      {
        type: "product",
        terms: ["cutting", "hand_held"],
        page: 3
      } as ResolutionContext,
      "/products?category=cutting&category=hand_held&page=3"
    ],
  ])("resolves correctly for %s", (context: ResolutionContext, expected: string) => {
    const result = resolveUrlPath(context);
    expect(result).toBe(expected)
  })
})



describe("resolveReference", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });


  const internalLinkItem: WSL_Page | WSL_WebSpotlightRoot | Product | Article = {
    system: {
      id: "8f098856-895c-5518-a8e0-d834ee28813a",
      name: "About us",
      codename: "about_us_f9c172b",
      language: "default",
      type: "page",
      collection: "default",
      workflow: "default",
      sitemapLocations: [],
      lastModified: "2023-08-17T09:39:14.3252398Z",
      workflowStep: "published"
    },
    elements: {
      title: {
        type: ElementType.Text,
        name: "Title",
        value: "About us"
      },
      slug: {
        type: ElementType.UrlSlug,
        name: "URL Slug",
        value: "about-us"
      },
      subpages: {
        type: ElementType.ModularContent,
        name: "Subpages",
        value: [],
        linkedItems: []
      },
      content: {
        type: ElementType.ModularContent,
        name: "Content",
        value: [],
        linkedItems: []

      },
      metadata__title: {
        type: ElementType.Text,
        name: "Title",
        value: "About us"
      },
      metadata__description: {
        type: ElementType.Text,

        name: "Description",
        value: ""
      },
      metadata__keywords: {
        type: ElementType.Text,

        name: "Keywords",
        value: ""
      }
    }
  }


  const referenceTemplate: CoreContentType<Reference> = {
    system: {
      id: "091590b2-a93a-47e7-8405-3c629260f3be",
      name: "reference resolution",
      codename: "_reference_resolution",
      language: "default",
      type: "action",
      sitemapLocations: [],
      workflow: "default",
      collection: "default",
      lastModified: "2023-08-17T11:04:41.1006295Z",
      workflowStep: "published"
    },
    elements: {
      reference__label: {
        type: ElementType.Text,
        name: "Label",
        value: "Label"
      },
      reference__caption: {
        type: ElementType.Text,
        name: "Caption",
        value: "Caption"
      },
      reference__external_uri: {
        type: ElementType.Text,
        name: "External URI",
        value: ""
      },
      reference__content__item_link: {
        type: ElementType.ModularContent,
        name: "Content item link",
        value: [],
        linkedItems: []
      },
    }
  }


  it("Resolve external URL", () => {
    const inputClone: CoreContentType<Reference> = JSON.parse(JSON.stringify(referenceTemplate));
    inputClone.elements.reference__external_uri.value = "https://example.com";
    const result = resolveReference(inputClone);

    expect(result).toBe("https://example.com");
  })

  it("Resolve internal URL", () => {
    const inputClone: CoreContentType<Reference> = JSON.parse(JSON.stringify(referenceTemplate));
    inputClone.elements.reference__content__item_link.value = [internalLinkItem.system.codename];
    inputClone.elements.reference__content__item_link.linkedItems = [internalLinkItem];
    const result = resolveReference(inputClone);

    expect(result).toBe("/about-us");
  })

  it("External URL takes precedence over internal URL", () => {
    const inputClone: CoreContentType<Reference> = JSON.parse(JSON.stringify(referenceTemplate));
    inputClone.elements.reference__external_uri.value = "https://example.com";
    inputClone.elements.reference__content__item_link.value = [internalLinkItem.system.codename];
    inputClone.elements.reference__content__item_link.linkedItems = [internalLinkItem];
    const result = resolveReference(inputClone);

    expect(result).toBe("https://example.com");
  })

  it("Page from other domain is resolved correctly", () => {
    const inputClone: CoreContentType<Reference> = JSON.parse(JSON.stringify(referenceTemplate));
    inputClone.elements.reference__content__item_link.value = [internalLinkItem.system.codename];
    inputClone.elements.reference__content__item_link.linkedItems = [internalLinkItem];

    process.env.NEXT_PUBLIC_OTHER_COLLECTIONS_DOMAINS = `${inputClone.elements.reference__content__item_link.linkedItems[0]?.system.collection}:otherdomain.com`
    const result = resolveReference(inputClone);

    expect(result).toBe("https://otherdomain.com/about-us");
  })
})