import { GetStaticPaths, GetStaticProps } from "next";
import { ParsedUrlQuery } from "querystring";
import { FC } from "react";

import { HeroImage } from "../../components/landingPage/ui/heroImage";
import { RichTextElement } from "../../components/shared/richText/RichTextElement";
import { AppPage } from "../../components/shared/ui/appPage";
import { mainColorBgClass } from "../../lib/constants/colors";
import {
  getDefaultMetadata,
  getSiteMenu,
  getSolutionDetail,
  getSolutionsWithSlugs,
} from "../../lib/kontentClient";
import { ValidCollectionCodename } from "../../lib/types/perCollection";
import { siteCodename } from "../../lib/utils/env";
import { createElementSmartLink } from "../../lib/utils/smartLinkUtils";
import {
  contentTypes,
  Nav_NavigationItem,
  SEOMetadata,
  Solution,
} from "../../models";

type Props = Readonly<{
  solution: Solution;
  siteCodename: ValidCollectionCodename;
  defaultMetadata: SEOMetadata;
  siteMenu: Nav_NavigationItem | null;
}>;

interface IParams extends ParsedUrlQuery {
  slug: string;
}

export const getStaticPaths: GetStaticPaths = () => {
  return getSolutionsWithSlugs().then((solutions) => ({
    paths: solutions.map(
      (solution) => `/solutions/${solution.elements.slug.value}`
    ),
    fallback: "blocking",
  }));
};

export const getStaticProps: GetStaticProps<Props, IParams> = async (
  context
) => {
  const slug = context.params?.slug;

  if (!slug) {
    return { notFound: true };
  }

  const solution = await getSolutionDetail(slug, !!context.preview);
  const siteMenu = await getSiteMenu(!!context.preview);
  const defaultMetadata = await getDefaultMetadata(!!context.preview);

  if (!solution) {
    return { notFound: true };
  }

  return {
    props: {
      solution,
      siteCodename,
      siteMenu,
      defaultMetadata,
    },
  };
};

const SolutionDetail: FC<Props> = ({
  solution,
  siteCodename,
  siteMenu,
  defaultMetadata,
}) => (
  <AppPage
    item={solution}
    siteCodename={siteCodename}
    siteMenu={siteMenu}
    defaultMetadata={defaultMetadata}
    pageType="Solution"
  >
    <HeroImage
      url={solution.elements.productBaseMainImage.value[0]?.url || ""}
      itemId={solution.system.id}
    >
      <div
        className={`py-1 px-3 w-full md:w-fit ${mainColorBgClass[siteCodename]}  opacity-90`}
      >
        <h1
          {...createElementSmartLink(
            contentTypes.solution.elements.product_base__name.codename
          )}
          className="m-0 text-8xl text-white align-text-bottom max-w-2xl tracking-wide font-semibold"
        >
          {solution.elements.productBaseName.value}
        </h1>
      </div>
    </HeroImage>
    <div
      className="text-xl font-semibold"
      {...createElementSmartLink(
        contentTypes.solution.elements.showcase.codename
      )}
    >
      <RichTextElement
        element={solution.elements.showcase}
        isInsideTable={false}
      />
    </div>
  </AppPage>
);

export default SolutionDetail;
