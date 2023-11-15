import { GetStaticPaths, GetStaticProps } from "next";
import { ParsedUrlQuery } from "querystring";
import { FC } from "react";

import { HeroImage } from "../../../components/landingPage/ui/heroImage";
import { RichTextElement } from "../../../components/shared/richText/RichTextElement";
import { AppPage } from "../../../components/shared/ui/appPage";
import { mainColorBgClass } from "../../../lib/constants/colors";
import { getDefaultMetadata, getSiteMenu, getSolutionDetail, getSolutionsWithSlugs } from "../../../lib/kontentClient";
import { parseFlatted, Stringified, stringifyAsType } from "../../../lib/utils/circularityUtils";
import { defaultEnvId, siteCodename } from "../../../lib/utils/env";
import { getEnvIdFromRouteParams, getPreviewApiKeyFromPreviewData } from "../../../lib/utils/pageUtils";
import { createElementSmartLink } from "../../../lib/utils/smartLinkUtils";
import { contentTypes, Metadata, Nav_NavigationItem, Solution } from "../../../models";

type Props = Readonly<{
  solution: Stringified<Solution>;
  defaultMetadata: Metadata;
  siteMenu: Stringified<Nav_NavigationItem>;
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

  const solution = stringifyAsType(solutionData);
  const siteMenu = stringifyAsType(siteMenuData);

  return {
    props: {
      solution,
      siteMenu,
      defaultMetadata
    },
  };
};

const SolutionDetail: FC<Props> = props => {
  const solution = parseFlatted(props.solution);

  return(
    <AppPage
      item={solution}
      siteMenu={props.siteMenu}
      defaultMetadata={props.defaultMetadata}
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
  )

};

export default SolutionDetail;
