import { Content } from "../../../../../../../components/shared/Content";
import { getArticlesCountByCategory, getArticlesForListing, getDefaultMetadata, getItemBySlug } from "../../../../../../../lib/kontentClient";
import { isArticleType } from "../../../../../../../lib/utils/articlesListing";
import { parseFlatted,  stringifyAsType } from "../../../../../../../lib/utils/circularityUtils";
import { contentTypes, WSL_Page } from "../../../../../../../models";
import { notFound } from "next/navigation";
import { cookies, draftMode } from "next/headers";
import { previewApiKeyCookieName } from "../../../../../../../lib/constants/cookies";
import { AppPage } from "../../../../../../../components/shared/ui/newAppPage";
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

  console.log(envId);

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

export const dynamicParams = true;
export const revalidate = 60;

export async function generateStaticParams() {
  return []
}

export const generateMetadata = async ({ params }: { params: Promise<{ envId: string }> }): Promise<Metadata> => {
  const envId = (await params).envId;

  const draft = await draftMode();

  if (draft.isEnabled) {
    return {};
  }
  
  const previewApiKey = draft.isEnabled ? (await cookies()).get(previewApiKeyCookieName)?.value : undefined;

  const defaultMetadata = await getDefaultMetadata({ envId, previewApiKey }, draft.isEnabled);

  if (!defaultMetadata) {
    console.log("generateMetadata: [envId]/[category]/page/[page]: Could not obtain defaultMetadata");
    return {};
  }

  return {
    description: defaultMetadata.elements.metadataDescription.value,
    keywords: defaultMetadata.elements.metadataKeywords.value,
    title: defaultMetadata.elements.metadataTitle.value 
  }
}

export default ArticlesPagingPage;
