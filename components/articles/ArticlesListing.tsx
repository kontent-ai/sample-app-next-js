'use client'
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { Article, taxonomies } from "../../models";
import Link from "next/link";
import { ResolutionContext, resolveUrlPath } from "../../lib/routing";
import { FC, useState } from "react";
import { ArticleItem } from "../listingPage/ArticleItem";
import { ArticlePageSize } from "../../lib/constants/paging";

type LinkButtonProps = {
  text: string;
  href: string;
  disabled?: boolean;
  roundRight?: boolean;
  roundLeft?: boolean;
  highlight?: boolean;
}

const LinkButton: FC<LinkButtonProps> = props => (
  <Link
    scroll={false}
    href={props.disabled ? resolveUrlPath({
      type: "article",
      term: "all"
    }) : props.href}
    className="h-full"
  >
    <button
      disabled={props.disabled}
      className={`${props.roundRight && 'rounded-r-lg'} ${props.roundLeft && 'rounded-l-lg'} disabled:cursor-not-allowed ${props.highlight ? `bg-mainBackgroundColor text-white` : 'bg-white'} px-3 py-2 leading-tight text-gray-500 border disabled:bg-gray-200 border-gray-300 enabled:hover:bg-gray-100 enabled:hover:text-gray-700 `}
    >
      {props.text}
    </button>
  </Link>
);

const getFilterOptions = () =>
  Object.fromEntries(Object.entries(taxonomies.article_type.terms).map(([codename, obj]) => [codename, obj.name]));


type FilterOptionProps = Readonly<{
  options: Record<string, string>;
  category: string
}>;

const FilterOptions: FC<FilterOptionProps> = ({ options, category }) => {
  const [dropdownActive, setDropdownActive] = useState(false);

  return (
    <>
      <div className="md:hidden flex items-center mt-3">
        <button
          type="button"
          className="w-screen flex items-center py-1 px-6"
          onClick={() => setDropdownActive(!dropdownActive)}
        >
          <ChevronDownIcon className={`w-6 h-full transform ${dropdownActive ? "rotate-180" : ""}`} />
          <span className="font-semibold pb-1 pl-1">Category</span>
        </button>
      </div>
      <div
        className={`${dropdownActive ? "flex" : "hidden"} absolute md:static w-full z-40 flex-col md:flex md:flex-row md:pt-10`}
      >
        {Object.entries(options).map(([key, value]) => (
          <Link
            key={key}
            href={resolveUrlPath({
              type: "article",
              term: key
            } as ResolutionContext)}
            onClick={() => setDropdownActive(!dropdownActive)}
            scroll={false}
            className={`inline-flex items-center z-40 md:justify-between md:mr-4 md:w-max px-6 py-1 no-underline ${key === category ? ['bg-mainBackgroundColor', 'border-mainBorderColor', "text-white", "cursor-default"].join(" ") : `border-gray-200 bg-white hover:bg-mainColorHover hover:text-white cursor-pointer`} md:rounded-3xl`}
          >{value}
          </Link>
        ))}
        <Link
          href={resolveUrlPath({
            type: "article",
            term: "all"
          })}
          onClick={() => setDropdownActive(!dropdownActive)}
          scroll={false}
          className={`px-6 py-1 ${category === "all" ? "hidden" : ""} bg-gray-500 text-white no-underline font-bold md:rounded-3xl cursor-pointer`}
        >Clear
        </Link>
      </div>
    </>
  );
};

type ArticlesLitingProps = {
  pageNumber: number
  category: string
  articles: ReadonlyArray<Article>
  itemCount: number;
}

export const ArticlesListing: FC<ArticlesLitingProps> = (props) => {
  const filterOptions = getFilterOptions();

  const pageCount = Math.ceil(props.itemCount / ArticlePageSize);

  return (
    <div className="md:px-4">
        <h2 className="mt-4 px-6 md:px-0 md:mt-16">Latest Articles</h2>
        <FilterOptions
          options={filterOptions}
          category={props.category}
        />
        <div className="flex flex-col flex-grow min-h-[500px]">
          {props.articles.length > 0 ? (
            <ul className="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 place-items-center list-none gap-5 md:pt-4 pl-0 justify-center">
              {props.articles.map(article => (
                article.elements.type.value[0]?.codename && (
                  <ArticleItem
                    key={article.system.id}
                    title={article.elements.title.value}
                    itemId={article.system.id}
                    description={article.elements.abstract.value}
                    imageUrl={article.elements.hero_image.value[0]?.url || ""}
                    publishingDate={article.elements.publishing_date.value}
                    detailUrl={resolveUrlPath({
                      type: "article",
                      slug: article.elements.slug.value
                    })}
                  />
                )
              ))}
            </ul>
          )
            :
            <div className="w-full flex my-auto grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 pt-4 pl-0 justify-center font-bold">No articles match this criteria.</div>
          }

          {pageCount > 1 && (
            <nav>
              <ul className="mr-14 sm:mr-0 flex flex-row flex-wrap list-none justify-center">
                <li>
                  <LinkButton
                    text="Previous"
                    href={!props.pageNumber || props.pageNumber === 2
                      ? resolveUrlPath({
                        type: "article",
                        term: "all"
                      })
                      : resolveUrlPath({
                        type: "article",
                        term: props.category,
                        page: props.pageNumber - 1
                      } as ResolutionContext)}
                    disabled={props.pageNumber === 1}
                    roundLeft
                  />

                </li>
                {Array.from({ length: pageCount }).map((_, i) => (
                  <li key={i}>
                    <LinkButton
                      text={`${i + 1}`}
                      href={resolveUrlPath({
                        type: "article",
                        term: props.category,
                        page: i + 1 > 1 ? i + 1 : undefined
                      } as ResolutionContext)}
                      highlight={(props.pageNumber ?? 1) === i + 1}
                    />
                  </li>
                ))}
                <li>
                  <LinkButton
                    text="Next"
                    href={resolveUrlPath({
                      type: "article",
                      term: props.category,
                      page: props.pageNumber ? props.pageNumber + 1 : 2
                    } as ResolutionContext)}
                    disabled={(props.pageNumber ?? 1) === pageCount}
                    roundRight
                  />
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>
  )
}