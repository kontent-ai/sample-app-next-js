import { GetStaticPaths, GetStaticProps } from "next";
import { ParsedUrlQuery } from "querystring";
import { FC } from "react";

import { HeroImage } from "../../../components/landingPage/ui/heroImage";
import { RichTextElement } from "../../../components/shared/richText/RichTextElement";
import { AppPage } from "../../../components/shared/ui/appPage";
import { mainColorBgClass } from "../../../lib/constants/colors";
import { getDefaultMetadata, getSiteMenu, getSolutionDetail, getSolutionsWithSlugs } from "../../../lib/kontentClient";
import { defaultEnvId, siteCodename } from "../../../lib/utils/env";
import { getEnvIdFromRouteParams, getPreviewApiKeyFromPreviewData } from "../../../lib/utils/pageUtils";
import { createElementSmartLink } from "../../../lib/utils/smartLinkUtils";
import { contentTypes, Metadata, Nav_NavigationItem, Solution } from "../../../models";
import { CircularReferenceInfo, sanitizeCircularData } from "../../../lib/utils/circularityUtils";



type Props = Readonly<{
  solution: Solution;
  defaultMetadata: Metadata;
  siteMenu: Nav_NavigationItem | null;
  circularReferences: Record<string, CircularReferenceInfo[]>;
}>;

interface IParams extends ParsedUrlQuery {
  slug: string;
  envId: string;
}

export const getStaticPaths: GetStaticPaths = () => getSolutionsWithSlugs({ envId: defaultEnvId }).then((solutions) => ({
  paths: solutions.map(
    (solution) => ({
      params: {
        slug: solution.elements.slug.value,
        envId: defaultEnvId
      }
    })
  ),
  fallback: "blocking",
}));

export const getStaticProps: GetStaticProps<Props, IParams> = async (
  context
) => {
  const slug = context.params?.slug;

  if (!slug) {
    return { notFound: true };
  }

  const envId = getEnvIdFromRouteParams(context);

  const previewApiKey = getPreviewApiKeyFromPreviewData(context.previewData);

  const solutionData = await getSolutionDetail({ envId, previewApiKey }, slug, !!context.preview);
  const siteMenuData = await getSiteMenu({ envId, previewApiKey }, !!context.preview);
  const defaultMetadata = await getDefaultMetadata({ envId, previewApiKey }, !!context.preview);

  if (!solutionData) {
    return { notFound: true };
  }

  if (!siteMenuData) {
    throw new Error("Can't find the main menu item.")
  }

  const [solution, solutionFoundCycles] = sanitizeCircularData(solutionData);
  const [siteMenu, siteMenuFoundCycles] = sanitizeCircularData(siteMenuData);

  const circularReferences = {...solutionFoundCycles, ...siteMenuFoundCycles};

  return {
    props: {
      solution,
      siteMenu,
      defaultMetadata,
      circularReferences
    },
  };
};

const SolutionDetail: FC<Props> = ({
  solution,
  siteMenu,
  defaultMetadata,
  circularReferences
}) => (
  <AppPage
    item={solution}
    siteMenu={siteMenu}
    defaultMetadata={defaultMetadata}
    pageType="Solution"
    circularReferences={circularReferences}
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
