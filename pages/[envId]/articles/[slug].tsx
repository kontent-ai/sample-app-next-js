import { GetStaticPaths, GetStaticProps } from "next";
import { FC } from "react";

import { HeroImage } from "../../../components/landingPage/ui/heroImage";
import { PersonHorizontal } from "../../../components/shared/PersonHorizontal";
import { RichTextElement } from "../../../components/shared/richText/RichTextElement";
import { AppPage } from "../../../components/shared/ui/appPage";
import { getAllArticles, getArticleBySlug, getDefaultMetadata, getSiteMenu } from "../../../lib/kontentClient";
import { parseFlatted, Stringified, stringifyAsType } from "../../../lib/utils/circularityUtils";
import { formatDate } from "../../../lib/utils/dateTime";
import { defaultEnvId } from "../../../lib/utils/env";
import { getPreviewApiKeyFromPreviewData } from "../../../lib/utils/pageUtils";
import { Article, Metadata, Nav_NavigationItem } from "../../../models";


type Props = Readonly<{
  article: Stringified<Article>;
  siteMenu: Stringified<Nav_NavigationItem>;
  defaultMetadata: Metadata;
}>;

const ArticlePage: FC<Props> = props => {
  const article = parseFlatted(props.article);
  return (
    <AppPage
      siteMenu={props.siteMenu}
      defaultMetadata={props.defaultMetadata}
      item={article}
      pageType="Article"
    >
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

export const getStaticProps: GetStaticProps<Props, { slug: string, envId: string }> = async context => {
  const envId = context.params?.envId;
  if (!envId) {
    throw new Error("Missing envId in url");
  }

  const previewApiKey = getPreviewApiKeyFromPreviewData(context.previewData);

  const siteMenuData = await getSiteMenu({ envId, previewApiKey }, !!context.preview);
  const slug = typeof context.params?.slug === "string" ? context.params.slug : "";

  if (!slug) {
    return { notFound: true };
  }

  const articleData = await getArticleBySlug({ envId: envId, previewApiKey: previewApiKey }, slug, !!context.preview);
  const defaultMetadata = await getDefaultMetadata({ envId: envId, previewApiKey: previewApiKey }, !!context.preview);

  if (!articleData) {
    return { notFound: true };
  }

  const article = stringifyAsType(articleData);
  const siteMenu = stringifyAsType(siteMenuData);

  return {
    props: {
      article,
      siteMenu,
      defaultMetadata,
    },
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  const articles = await getAllArticles({ envId: defaultEnvId }, false);

  return {
    paths: articles.items.map(a => ({
      params: {
        slug: a.elements.slug.value,
        envId: defaultEnvId
      }
    })),
    fallback: "blocking",
  };
}

export default ArticlePage;
