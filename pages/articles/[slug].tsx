import { FC } from "react";
import { ValidCollectionCodename } from "../../lib/types/perCollection";
import { Article, Block_Navigation } from "../../models"
import { AppPage } from "../../components/shared/ui/appPage";
import { HeroImage } from "../../components/landingPage/ui/heroImage";
import { GetStaticPaths, GetStaticProps } from "next";
import { getAllArticles, getArticleBySlug, getArticlesForListing, getSiteMenu } from "../../lib/kontentClient";
import { RichTextElement } from "../../components/shared/RichTextContent";
import { mainColorBgClass } from "../../lib/constants/colors";
import { siteCodename } from '../../lib/utils/env';
import { formatDate } from "../../lib/utils/dateTime";
import { AuthorHorizontal } from "../../components/shared/AuthorHorizontal";

type Props = Readonly<{
  article: Article;
  siteCodename: ValidCollectionCodename;
  siteMenu?: Block_Navigation;
}>;

const ArticlePage: FC<Props> = props => {
  return (
    <AppPage siteCodename={props.siteCodename} siteMenu={props.siteMenu}>
      <HeroImage url={props.article.elements.heroImage.value[0]?.url} itemId={props.article.system.id}>
        <div className={`py-1 px-3 w-full md:w-fit ${mainColorBgClass[props.siteCodename]}  opacity-90`}>
          <h1 className="m-0 text-3xl tracking-wide font-semibold">{props.article.elements.title.value}</h1>
        </div>
        <div className="bg-white opacity-90 p-4">
          <p className="font-semibold">
            {props.article.elements.abstract.value}
          </p>
        </div>
      </HeroImage>
      <div className="max-w-screen-md m-auto">
        <AuthorHorizontal item={props.article.elements.author.linkedItems[0]} />
        <div className="flex flex-col gap-2">
          <div className="w-fit p-2 bg-gray-800 text-white opacity-90 font-semibold">{props.article.elements.publishingDate.value && formatDate(props.article.elements.publishingDate.value)}</div>
          <div className="flex gap-2" >
            {
              props.article.elements.articleType.value.length > 0 && props.article.elements.articleType.value.map(type => (
                <div key={type.codename} className={`w-fit p-2 ${mainColorBgClass[props.siteCodename]} font-semibold`}>{type.name}</div>
              ))
            }
          </div>
        </div>
        <RichTextElement element={props.article.elements.content} />
      </div>
    </AppPage>
  );
};

export const getStaticProps: GetStaticProps<Props, { slug: string }> = async context => {
  const siteMenu = await getSiteMenu(!!context.preview);
  const slug = typeof context.params?.slug === "string" ? context.params.slug : "";

  if (!slug) {
    return { notFound: true };
  }

  const article = await getArticleBySlug(slug, !!context.preview);

  if (!article) {
    return { notFound: true };
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
  const articles = await getAllArticles(false);

  return {
    paths: articles.items.map(a => `/articles/${a.elements.slug.value}`),
    fallback: "blocking",
  };
}

export default ArticlePage;
