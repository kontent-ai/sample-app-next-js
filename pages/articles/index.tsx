import { FC } from "react";
import { Article, Block_Navigation, WSL_Page } from "../../models";
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
  siteMenu?: Block_Navigation,
  page: WSL_Page,
  totalCount: number | null
}>;

const ArticlesPage: FC<Props> = props => (
  <AppPage siteCodename={props.siteCodename} siteMenu={props.siteMenu}>
    {props.page.elements.content.linkedItems.map(piece => (
      <Content key={piece.system.id} item={piece as any} />
    ))}
    <ul className="w-ull flex flex-wrap list-none justify-start gap-5 pt-4">
      {props.articles.map(a => (
        <ListItem
          key={a.system.id}
          title={a.elements.title.value}
          itemId={a.system.id}
          imageUrl={a.elements.heroImage.value[0]?.url}
          detailUrl={`articles/${a.elements.slug.value}`}
        />
      ))}
    </ul>

    <nav>
  <ul className="inline-flex -space-x-px">
    <li>
      <a href="#" className="px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700">Previous</a>
    </li>
    <li>
      <a href="#" className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700">2</a>
    </li>
    <li>
      <a href="#" aria-current="page" className="px-3 py-2 text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700">3</a>
    </li>
    <li>
      <a href="#" className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 ">Next</a>
    </li>
  </ul>
</nav>
  </AppPage>
);

export const getStaticProps: GetStaticProps<Props> = async context => {
  const pageCodename: PerCollectionCodenames = {
    ficto_healthtech: "articles",
    ficto_healthtech_imaging: "articles",
    ficto_healthtech_surgical: "articles"
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
      articles: articles.items,
      siteCodename,
      siteMenu,
      page,
      totalCount: articles.pagination.totalCount
    },
  };
};

export default ArticlesPage;
