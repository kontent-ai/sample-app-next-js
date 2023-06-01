import { FC } from "react";
import { ValidCollectionCodename } from "../../lib/types/perCollection";
import { Article, Navigation } from "../../models"
import { AppPage } from "../../components/shared/ui/appPage";
import { HeroImage } from "../../components/landingPage/ui/heroImage";
import { GetStaticPaths, GetStaticProps } from "next";
import { getArticleBySlug, getArticlesForListing, getSiteMenu } from "../../lib/kontentClient";
import { siteCodename } from "../../lib/utils/env";
import { RichTextElement } from "../../components/shared/RichTextContent";
import { getMenuCodename } from "../../lib/constants/menu";

type Props = Readonly<{
  article: Article;
  siteCodename: ValidCollectionCodename;
  siteMenu: Navigation;
}>;

const ArticlePage: FC<Props> = props => (
  <AppPage siteCodename={props.siteCodename} siteMenu={props.siteMenu}>
    <HeroImage url={props.article.elements.heroImage.value[0]?.url} itemId={props.article.system.id}>
      <h1>{props.article.elements.title.value}</h1>
    </HeroImage>
    <p>
      {props.article.elements.abstract.value}
    </p>
    <RichTextElement element={props.article.elements.content} />
  </AppPage>
);

const notFoundRedirect = {
  redirect: {
    permanent: false,
    destination: "/404",
  },
};

export const getStaticProps: GetStaticProps<Props, { slug: string }> = async context => {
  const menuCodename = getMenuCodename(siteCodename);
  const siteMenu = await getSiteMenu(menuCodename, !!context.preview);
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
      siteMenu
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
