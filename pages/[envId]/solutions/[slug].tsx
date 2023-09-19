import { GetStaticPaths, GetStaticProps } from "next";
import { ParsedUrlQuery } from "querystring";
import { FC } from "react";

import { HeroImage } from "../../../components/landingPage/ui/heroImage";
import { RichTextElement } from "../../../components/shared/richText/RichTextElement";
import { AppPage } from "../../../components/shared/ui/appPage";
import { mainColorBgClass } from "../../../lib/constants/colors";
import { getDefaultMetadata, getSiteMenu, getSolutionDetail, getSolutionsWithSlugs } from "../../../lib/kontentClient";
import { ValidCollectionCodename } from "../../../lib/types/perCollection";
import { siteCodename } from "../../../lib/utils/env";
import { createElementSmartLink } from "../../../lib/utils/smartLinkUtils";
import { contentTypes, Metadata, Nav_NavigationItem, Solution } from "../../../models";



type Props = Readonly<{
  solution: Solution;
  siteCodename: ValidCollectionCodename;
  defaultMetadata: Metadata;
  siteMenu: Nav_NavigationItem | null;
}>;

interface IParams extends ParsedUrlQuery {
  slug: string;
  envId: string;
}

export const getStaticPaths: GetStaticPaths = () => {
  const envId = process.env.NEXT_PUBLIC_KONTENT_ENVIRONMENT_ID;
  if (!envId) {
    throw new Error("Missing 'NEXT_PUBLIC_KONTENT_ENVIRONMENT_ID' environment variable.");
  }

  return getSolutionsWithSlugs({ envId: envId }).then((solutions) => ({
    paths: solutions.map(
      (solution) => ({
        params: {
          slug: solution.elements.slug.value,
          envId
        }
      })
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

  const envId = context.params?.envId;
  if (!envId) {
    throw new Error("Missing envId in url");
  }
  
  const previewApiKey = context.previewData && typeof context.previewData === 'object' && 'currentPreviewApiKey' in context.previewData
    ? context.previewData.currentPreviewApiKey as string
    : undefined;

  const solution = await getSolutionDetail({ envId, previewApiKey }, slug, !!context.preview);
  const siteMenu = await getSiteMenu({ envId, previewApiKey }, !!context.preview);
  const defaultMetadata = await getDefaultMetadata({ envId, previewApiKey }, !!context.preview);

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
