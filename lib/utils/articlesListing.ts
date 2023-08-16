import { ArticleType } from "../../models";

export type ArticleListingUrlQuery = Readonly<{
    page: string,
    category: string
    envId: string
  }>;
  
  export type ArticleTypeWithAll = ArticleType | "all";
  export const categoryFilterSource =
    Object.keys({
      "all": null,
      "case_study": null,
      "clinical_trial": null,
      "industry_news": null,
      "research": null,
    } as const satisfies Record<ArticleTypeWithAll, null>) as ArticleTypeWithAll[];
  
  
  export const isArticleType = (input: string | undefined): input is ArticleTypeWithAll => (categoryFilterSource as string[]).includes(input || "");