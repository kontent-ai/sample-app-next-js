import { Content } from "../../../../../../../components/shared/Content";
import { ArticlePageSize } from "../../../../../../../lib/constants/paging";
import { getArticlesCountByCategory, getArticlesForListing, getDefaultMetadata, getItemBySlug, getItemsTotalCount } from "../../../../../../../lib/kontentClient";
import { ArticleTypeWithAll, categoryFilterSource, isArticleType } from "../../../../../../../lib/utils/articlesListing";
import { parseFlatted,  stringifyAsType } from "../../../../../../../lib/utils/circularityUtils";
import { defaultEnvId } from "../../../../../../../lib/utils/env";
import { contentTypes, WSL_Page } from "../../../../../../../models";
import { notFound } from "next/navigation";
import { cookies, draftMode } from "next/headers";
import { previewApiKeyCookieName } from "../../../../../../../lib/constants/cookies";
import { AppPage } from "../../../../../../../components/shared/ui/appPage";
import { ArticlesListing } from "../../../../../../../components/articles/ArticlesListing";
import { Metadata } from "next";


const ArticlesPagingPage = async ({params}: {params: Promise<{envId: string, page: string, category: string}>}) => {
  const envId = (await params).envId

  const pageURLParameter = (await params).page;
  const selectedCategory = (await params).category;

  if (!isArticleType(selectedCategory)) {
    return notFound();
  }

  const draft = await draftMode();
  const previewApiKey = draft.isEnabled ? (await cookies()).get(previewApiKeyCookieName)?.value : undefined;

  const pageNumber = !pageURLParameter || isNaN(+pageURLParameter) ? 1 : +pageURLParameter;
  const articlesData = await getArticlesForListing({ envId, previewApiKey }, draft.isEnabled, pageNumber, selectedCategory);
  const pageData = await getItemBySlug<WSL_Page>({ envId, previewApiKey }, "articles", contentTypes.page.codename, draft.isEnabled);
  const itemCount = await getArticlesCountByCategory({ envId, previewApiKey }, draft.isEnabled, selectedCategory)

  if (pageData === null) {
    return notFound();
  }

  const page = parseFlatted(stringifyAsType(pageData));
  const articles = parseFlatted(stringifyAsType(articlesData.items));

  return (
    <AppPage
      item={page}
    >
      {page.elements.content.linkedItems.map((piece, index) => (
        <Content
          key={piece.system.id}
          item={piece}
          index={index}
        />
      ))}
      <ArticlesListing
        pageNumber={pageNumber}
        category={selectedCategory}
        articles={articles}
        itemCount={itemCount}
      />
    </AppPage>
  )
}

export const generateStaticParams = async () => {
  const getAllPagesForCategory = async (category: ArticleTypeWithAll) => {
    const totalCount = category === 'all'
      ? await getItemsTotalCount({ envId: defaultEnvId }, false, contentTypes.article.codename)
      : await getArticlesCountByCategory({ envId: defaultEnvId }, false, category);
    const pagesNumber = Math.ceil((totalCount ?? 0) / ArticlePageSize);
    const pages = Array.from({ length: pagesNumber }).map((_, index) => index + 1);

    return pages.map(pageNumber => ({ page: pageNumber.toString(), category }));
  };

  return await Promise.all(categoryFilterSource.map(category => getAllPagesForCategory(category)))
    .then(categoryPaths => categoryPaths.flat());
};

export const revalidate = 60;

export const generateMetadata = async ({ params }: { params: Promise<{ envId: string }> }): Promise<Metadata> => {
  const envId = (await params).envId;

  const draft = await draftMode();
  const previewApiKey = draft.isEnabled ? (await cookies()).get(previewApiKeyCookieName)?.value : undefined;

  const defaultMetadata = await getDefaultMetadata({ envId, previewApiKey }, draft.isEnabled);

  if (!defaultMetadata) {
    console.log("generateMetadata: [envId]/[category]/page/[page]: Could not obtain defaultMetadata");
    return {};
  }

  return {
    description: defaultMetadata.elements.metadata__description.value,
    keywords: defaultMetadata.elements.metadata__keywords.value,
    title: defaultMetadata.elements.metadata__title.value 
  }
}

export default ArticlesPagingPage;
