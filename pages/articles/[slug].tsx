import { FC } from "react";
import { ValidCollectionCodename } from "../../lib/types/perCollection";
import { Article, Block_Navigation } from "../../models"
import { AppPage } from "../../components/shared/ui/appPage";
import { HeroImage } from "../../components/landingPage/ui/heroImage";
import { GetStaticPaths, GetStaticProps } from "next";
import { getArticleBySlug, getArticlesForListing, getSiteMenu } from "../../lib/kontentClient";
import { RichTextElement } from "../../components/shared/RichTextContent";
import { mainColorBgClass } from "../../lib/constants/colors";
import { siteCodename } from "../../lib/utils/env";
import { notFoundRedirect } from "../../lib/constants/page";

type Props = Readonly<{
  article: Article;
  siteCodename: ValidCollectionCodename;
  siteMenu?: Block_Navigation;
}>;

const ArticlePage: FC<Props> = props => (
  <AppPage siteCodename={props.siteCodename} siteMenu={props.siteMenu}>
    <HeroImage url={props.article.elements.heroImage.value[0]?.url} itemId={props.article.system.id}>
      <div className={`py-1 px-3 w-full md:w-fit ${mainColorBgClass[props.siteCodename]}  opacity-[85%]`}>
        <h1 className="m-0 text-3xl tracking-wide font-semibold">{props.article.elements.title.value}</h1>
      </div>
    </HeroImage>
    <p>
      {props.article.elements.abstract.value}
    </p>
    <RichTextElement element={props.article.elements.content} />
  </AppPage>
);



export const getStaticProps: GetStaticProps<Props, { slug: string }> = async context => {
  const siteMenu = await getSiteMenu(!!context.preview);
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
    paths: articles.items.map(a => `/articles/${a.elements.slug.value}`),
    fallback: "blocking",
  };
}

export default ArticlePage;
