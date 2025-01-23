import { HeroImage } from "../../../../components/landingPage/ui/heroImage";
import { PersonHorizontal } from "../../../../components/shared/PersonHorizontal";
import { RichTextElement } from "../../../../components/shared/richText/RichTextElement";
import { getAllArticles, getArticleBySlug, getDefaultMetadata } from "../../../../lib/kontentClient";
import { parseFlatted, stringifyAsType } from "../../../../lib/utils/circularityUtils";
import { formatDate } from "../../../../lib/utils/dateTime";
import { defaultEnvId } from "../../../../lib/utils/env";
import { cookies, draftMode } from "next/headers";
import { previewApiKeyCookieName } from "../../../../lib/constants/cookies";
import { notFound } from "next/navigation";
import { AppPage } from "../../../../components/shared/ui/newAppPage";
import { Metadata } from "next";

const ArticlePage = async ({params}: {params: Promise<{envId: string, slug: string}>}) => {
  const envId = (await params).envId;
  const slug = (await params).slug;

  const draft = await draftMode();
  const previewApiKey = draft.isEnabled ? (await cookies()).get(previewApiKeyCookieName)?.value : undefined;;

  const articleData = await getArticleBySlug({ envId: envId, previewApiKey: previewApiKey }, slug, draft.isEnabled);

  if (!articleData) {
    return notFound();
  }

  const article = parseFlatted(stringifyAsType(articleData));

  return (
    <AppPage item={article}>
      <HeroImage
        url={article.elements.heroImage.value[0]?.url || ""}
        itemId={article.system.id}
      >
        <div className="py-1 px-3 w-full md:w-fit bg-mainBackgroundColor opacity-90">
          <h1 className="m-0 text-white  text-5xl tracking-wide font-semibold">{article.elements.title.value}</h1>
        </div>
        <div className="p-4">
          <p className="font-semibold text-white text-justify">
            {article.elements.abstract.value}
          </p>
        </div>
      </HeroImage>
      <div className="px-2 max-w-screen m-auto md:px-20">
        {article.elements.author.linkedItems[0] && <PersonHorizontal item={article.elements.author.linkedItems[0]} />}
        <div className="flex flex-col gap-2">
          <div className="w-fit p-2 bg-gray-800 text-white opacity-90 font-semibold">{article.elements.publishingDate.value && formatDate(article.elements.publishingDate.value)}</div>
          <div className="flex gap-2" >
            {
              article.elements.type.value.map(type => (
                <div
                  key={type.codename}
                  className="w-fit p-2 bg-mainBackgroundColor font-semibold text-white"
                >{type.name}
                </div>
              ))
            }
          </div>
        </div>
        <RichTextElement
          element={article.elements.content}
          isInsideTable={false}
        />
      </div>
    </AppPage>
  );
};

export const dynamicParams = true;
export const revalidate = 60;

export const generateStaticParams = async () => {
  const articles = await getAllArticles({ envId: defaultEnvId }, false);

  return articles.items.map(a => ({ slug: a.elements.slug.value,envId: defaultEnvId }));
};

export const generateMetadata = async ({ params }: { params: Promise<{ envId: string }> }): Promise<Metadata> => {
  const envId = (await params).envId;

  const draft = await draftMode();
  const previewApiKey = draft.isEnabled ? (await cookies()).get(previewApiKeyCookieName)?.value : undefined;

  const defaultMetadata = await getDefaultMetadata({ envId, previewApiKey }, draft.isEnabled);

  if (!defaultMetadata) {
    console.log("generateMetadata: [envId]/articles/[slug]: Could not obtain defaultMetadata");
    return {};
  }

  return {
    description: defaultMetadata.elements.metadataDescription.value,
    keywords: defaultMetadata.elements.metadataKeywords.value,
    title: defaultMetadata.elements.metadataTitle.value 
  }
}

export default ArticlePage;
