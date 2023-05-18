import { FC } from "react";
import { Article } from "../../models";
import { AppPage } from "../../components/shared/ui/appPage";
import { ValidCollectionCodename } from "../../lib/types/perCollection";
import { GetStaticProps } from "next";
import { getArticlesForListing } from "../../lib/kontentClient";
import { siteCodename } from "../../lib/utils/env";
import { ListItem } from "../../components/listingPage/ListItem";

type Props = Readonly<{
  siteCodename: ValidCollectionCodename;
  articles: ReadonlyArray<Article>;
}>;

const ArticlesPage: FC<Props> = props => (
  <AppPage siteCodename={props.siteCodename}>
    <h1>Our Latest Articles</h1>
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
  const articles = await getArticlesForListing(!!context.preview);

  return {
    props: {
      articles,
      siteCodename,
    },
  };
};

export default ArticlesPage;
