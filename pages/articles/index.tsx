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
import Link from "next/link";
import { useRouter } from "next/router";
import { ArticlePageSize } from "../../lib/constants/paging";

type Props = Readonly<{
  siteCodename: ValidCollectionCodename;
  articles: ReadonlyArray<Article>;
  siteMenu?: Block_Navigation,
  page: WSL_Page,
  totalCount: number | null
}>;

const ArticlesPage: FC<Props> = props => {
  const router = useRouter();
  const page = typeof router.query.page === 'string' ? +router.query.page : undefined;
  const pageCount = Math.ceil((props.totalCount ?? 0) / ArticlePageSize);

  return <AppPage siteCodename={props.siteCodename} siteMenu={props.siteMenu}>
    {props.page.elements.content.linkedItems.map(piece => (
      <Content key={piece.system.id} item={piece as any} />
    ))}
    <ul className="w-full flex flex-wrap list-none justify-start gap-5 pt-4">
      {props.articles.map(a => (
        <ListItem
          key={a.system.id}
          title={a.elements.title.value}
          itemId={a.system.id}
          imageUrl={a.elements.heroImage.value[0]?.url}
          detailUrl={`/articles/${a.elements.slug.value}`}
        />
      ))}
    </ul>

    <nav>
      <ul className="inline-flex flex-wrap -space-x-px list-none">
        <li>
          <Link
            scroll={false}
            href={!page || page === 2 ? '/articles' : `${page - 1}`}
            className={`${!page && 'pointer-events-none'} px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700`}>Previous</Link>
        </li>
        {Array.from({ length: pageCount }).map((_, i) => (<li key={i}>
          <Link
            scroll={false}
            href={i === 0 ? '/articles' : `/articles/page/${i + 1}`}
            className={`px-3 py-2 leading-tight bg-${(+(page ?? 1) === i + 1) ? 'blue-300' : 'white'} text-gray-500 border border-gray-300 hover:bg-gray-100 hover:text-gray-700"`}>{i + 1}</Link>
        </li>))}
        <li>
          <Link
            scroll={false}
            href={`/articles/page/${page ? page + 1 : 2}`}
            className={`px-3 py-2 ${(page ?? 1) === pageCount && 'pointer-events-none'} leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700`}>Next</Link>
        </li>
      </ul>
    </nav>
  </AppPage>
}

export const getStaticProps: GetStaticProps<Props> = async context => {
  const pageCodename: PerCollectionCodenames = {
    ficto_healthtech: "articles",
    ficto_healthtech_imaging: "articles",
    ficto_healthtech_surgical: "articles"
  };

  const pageURLParameter = context.params?.page;
  const pageNumber = !pageURLParameter || isNaN(+pageURLParameter) ? 1 : +pageURLParameter;

  const articles = await getArticlesForListing(!!context.preview, pageNumber);
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
