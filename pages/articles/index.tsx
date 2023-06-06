import { FC } from "react";
import { Article, Navigation, WSL_Page } from "../../models";
import { AppPage } from "../../components/shared/ui/appPage";
import { ValidCollectionCodename } from "../../lib/types/perCollection";
import { GetStaticProps } from "next";
import { getArticlesForListing, getItemByCodename, getSiteMenu } from "../../lib/kontentClient";
import { siteCodename } from "../../lib/utils/env";
import { ListItem } from "../../components/listingPage/ListItem";
import { PerCollectionCodenames } from "../../lib/routing";
import { Content } from "../../components/shared/Content";

type Props = Readonly<{
  siteCodename: ValidCollectionCodename;
  articles: ReadonlyArray<Article>;
  siteMenu?: Navigation,
  page: WSL_Page
}>;

const ArticlesPage: FC<Props> = props => (
  <AppPage siteCodename={props.siteCodename} siteMenu={props.siteMenu}>
    {props.page.elements.content.linkedItems.map(piece => (
      <Content key={piece.system.id} item={piece as any} />
    ))}
    <menu>
      {props.articles.map(a => (
        <ListItem
          key={a.system.id}
          title={a.elements.title.value}
          itemId={a.system.id}
          imageUrl={a.elements.heroImage.value[0]?.url}
          detailUrl={`articles/${a.elements.slug.value}`}
        />
      ))}
    </menu>
  </AppPage>
);

export const getStaticProps: GetStaticProps<Props> = async context => {
  const pageCodename: PerCollectionCodenames = {
    healthtech: "articles",
    healthtech_imaging: "articles",
    healthtech_surgical: "articles"
  };

  const articles = await getArticlesForListing(!!context.preview);
  const siteMenu = await getSiteMenu(!!context.preview);
  const page = await getItemByCodename<WSL_Page>(pageCodename, !!context.preview);

  if (page === null) {
    return {
      notFound: true
    };
  };

  return {
    props: {
      articles,
      siteCodename,
      siteMenu,
      page
    },
  };
};

export default ArticlesPage;
