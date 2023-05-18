import { FC } from "react";
import { ValidCollectionCodename } from "../../lib/types/perCollection";
import { Article } from "../../models"
import { AppPage } from "../../components/shared/ui/appPage";
import { HeroImage } from "../../components/landingPage/ui/heroImage";
import { GetStaticPaths, GetStaticProps } from "next";
import { getArticleBySlug, getArticlesForListing } from "../../lib/kontentClient";
import { siteCodename } from "../../lib/utils/env";
import { nodeParse } from "@kontent-ai/rich-text-resolver/dist/cjs/src/parser/node";
import { PortableText } from "@portabletext/react";
import { createDefaultResolvers } from "../../lib/richTextResolvers";
import { IPortableTextItem } from "@kontent-ai/rich-text-resolver/dist/cjs/src/parser/parser-models";
import { transformToPortableText } from "@kontent-ai/rich-text-resolver/dist/cjs/src/transformers";

type Props = Readonly<{
  article: Article;
  siteCodename: ValidCollectionCodename;
  parsedContent: IPortableTextItem[];
}>;

const ArticlePage: FC<Props> = props => (
  <AppPage siteCodename={props.siteCodename}>
    <HeroImage url={props.article.elements.heroImage.value[0]?.url} itemId={props.article.system.id}>
      <h1>{props.article.elements.title.value}</h1>
    </HeroImage>
    <PortableText value={props.parsedContent} components={createDefaultResolvers(props.article.elements.content)} />
  </AppPage>
);

const notFoundRedirect = {
  redirect: {
    permanent: false,
    destination: "/404",
  },
};

export const getStaticProps: GetStaticProps<Props, { slug: string }> = async context => {
  const slug = typeof context.params?.slug === "string" ? context.params.slug : "";
  if (!slug) {
    return notFoundRedirect;
  }

  const article = await getArticleBySlug(slug, !!context.preview);
  if (!article) {
    return notFoundRedirect;
  }

  return {
    props: {
      article,
      siteCodename,
      parsedContent: transformToPortableText(nodeParse(article.elements.content.value)),
    },
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  const articles = await getArticlesForListing(false);

  return {
    paths: articles.map(a => `/articles/${a.elements.slug.value}`),
    fallback: "blocking",
  };
}

export default ArticlePage;
