import { FC } from "react";
import { Article, Block_Navigation, WSL_Page } from "../../models";
import { AppPage } from "../../components/shared/ui/appPage";
import { ValidCollectionCodename } from "../../lib/types/perCollection";
import { GetStaticProps } from "next";
import { getArticlesForListing, getItemByCodename, getSiteMenu } from "../../lib/kontentClient";
import { siteCodename } from "../../lib/utils/env";
import { PerCollectionCodenames } from "../../lib/routing";
import { Content } from "../../components/shared/Content";
import Link from "next/link";
import { useRouter } from "next/router";
import { ArticlePageSize } from "../../lib/constants/paging";
import { ArticleItem } from "../../components/listingPage/ArticleItem";

type Props = Readonly<{
  siteCodename: ValidCollectionCodename;
  articles: ReadonlyArray<Article>;
  siteMenu?: Block_Navigation,
  page: WSL_Page,
  totalCount: number | null
}>;

type LinkButtonProps = {
  text: string;
  href: string;
  disabled?: boolean,
  roundRight?: boolean;
  roundLeft?: boolean;
  highlight?: boolean;
}

const LinkButton: FC<LinkButtonProps> = props => {
  return (
    <Link
      scroll={false}
      href={props.disabled ? '/articles' : props.href}
      className="h-full"
    >
      <button
        disabled={props.disabled}
        className={`${props.roundRight && 'rounded-r-lg'} ${props.roundLeft && 'rounded-l-lg'} disabled:cursor-not-allowed ${props.highlight ? 'bg-blue-200' : 'bg-white'} px-3 py-2 leading-tight text-gray-500 border disabled:bg-gray-200 border-gray-300 enabled:hover:bg-gray-100 enabled:hover:text-gray-700 `}>
        {props.text}
      </button>
    </Link>
  )
}

const ArticlesPage: FC<Props> = props => {
  const router = useRouter();
  const page = typeof router.query.page === 'string' ? +router.query.page : undefined;
  const pageCount = Math.ceil((props.totalCount ?? 0) / ArticlePageSize);

  return <AppPage siteCodename={props.siteCodename} siteMenu={props.siteMenu}>
    {props.page.elements.content.linkedItems.map(piece => (
      <Content key={piece.system.id} item={piece as any} />
    ))}

    <div className="px-4 sm:px-0">
      <h2 className="m-0 mt-16">Latest Articles</h2>
      <ul className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 place-items-center list-none gap-5 pt-4 pl-0 justify-center">
        {props.articles.map(a => (
          <ArticleItem
            key={a.system.id}
            title={a.elements.title.value}
            itemId={a.system.id}
            description={a.elements.abstract.value}
            imageUrl={a.elements.heroImage.value[0]?.url}
            publisingDate={a.elements.publishingDate.value}
            detailUrl={`/articles/${a.elements.slug.value}`}
          />
        ))}
      </ul>

      {pageCount > 1 && <nav>
        <ul className="mr-14 sm:mr-0 flex flex-row flex-wrap list-none justify-center">
          <li>
            <LinkButton
              text="Previous"
              href={!page || page === 2 ? '/articles' : `${page - 1}`}
              disabled={!page}
              roundLeft
            />

          </li>
          {Array.from({ length: pageCount }).map((_, i) => (<li key={i}>
            <LinkButton
              text={`${i + 1}`}
              href={i === 0 ? '/articles' : `/articles/page/${i + 1}`}
              highlight={(page ?? 1) === i + 1}
            />
          </li>))}
          <li>
            <LinkButton
              text="Next"
              href={`/articles/page/${page ? page + 1 : 2}`}
              disabled={(page ?? 1) === pageCount}
              roundRight
            />
          </li>
        </ul>
      </nav>}

    </div>
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
