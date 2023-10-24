import { GetStaticPaths, GetStaticProps } from "next";
import { FC } from "react";

import { HeroImage } from "../../../components/landingPage/ui/heroImage";
import { PersonHorizontal } from "../../../components/shared/PersonHorizontal";
import { RichTextElement } from "../../../components/shared/richText/RichTextElement";
import { AppPage } from "../../../components/shared/ui/appPage";
import { mainColorBgClass } from "../../../lib/constants/colors";
import { getAllArticles, getArticleBySlug, getDefaultMetadata, getSiteMenu } from "../../../lib/kontentClient";
import { ItemCircularReferenceMap, sanitizeCircularData } from "../../../lib/utils/circularityUtils";
import { formatDate } from "../../../lib/utils/dateTime";
import { defaultEnvId, siteCodename } from "../../../lib/utils/env";
import { getPreviewApiKeyFromPreviewData } from "../../../lib/utils/pageUtils";
import { Article, Metadata, Nav_NavigationItem } from "../../../models";


type Props = Readonly<{
  article: Article;
  siteMenu: Nav_NavigationItem | null;
  defaultMetadata: Metadata;
  circularReferences: ItemCircularReferenceMap;
}>;

const ArticlePage: FC<Props> = props => {
  return (
    <AppPage
      siteMenu={props.siteMenu}
      defaultMetadata={props.defaultMetadata}
      item={props.article}
      pageType="Article"
      circularReferences={props.circularReferences}
    >
      <HeroImage
        url={props.article.elements.heroImage.value[0]?.url || ""}
        itemId={props.article.system.id}
      >
        <div className={`py-1 px-3 w-full md:w-fit ${mainColorBgClass[siteCodename]}  opacity-90`}>
          <h1 className="m-0 text-white  text-5xl tracking-wide font-semibold">{props.article.elements.title.value}</h1>
        </div>
        <div className="p-4">
          <p className="font-semibold text-white text-justify">
            {props.article.elements.abstract.value}
          </p>
        </div>
      </HeroImage>
      <div className="px-2 max-w-screen m-auto md:px-20">
        {props.article.elements.author.linkedItems[0] && <PersonHorizontal item={props.article.elements.author.linkedItems[0]} />}
        <div className="flex flex-col gap-2">
          <div className="w-fit p-2 bg-gray-800 text-white opacity-90 font-semibold">{props.article.elements.publishingDate.value && formatDate(props.article.elements.publishingDate.value)}</div>
          <div className="flex gap-2" >
            {
              props.article.elements.type.value.map(type => (
                <div
                  key={type.codename}
                  className={`w-fit p-2 ${mainColorBgClass[siteCodename]} font-semibold text-white`}
                >{type.name}
                </div>
              ))
            }
          </div>
        </div>
        <RichTextElement
          element={props.article.elements.content}
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

  if (!siteMenuData) {
    throw new Error("Can't find main menu item.");
  }

  const articleData = await getArticleBySlug({ envId: envId, previewApiKey: previewApiKey }, slug, !!context.preview);
  const defaultMetadata = await getDefaultMetadata({ envId: envId, previewApiKey: previewApiKey }, !!context.preview);

  if (!articleData) {
    return { notFound: true };
  }

  const [siteMenu, siteMenuCircularReferences] = sanitizeCircularData(siteMenuData);
  const [article, articleCircularReferences] = sanitizeCircularData(articleData);

  const circularReferences = {...siteMenuCircularReferences, ...articleCircularReferences};

  return {
    props: {
      article,
      siteMenu,
      defaultMetadata,
      circularReferences
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
