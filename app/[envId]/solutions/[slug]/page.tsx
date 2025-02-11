import { Metadata } from "next";

import { HeroImage } from "../../../../components/landingPage/ui/heroImage";
import { RichTextElement } from "../../../../components/shared/richText/RichTextElement";
import { getDefaultMetadata, getSolutionDetail, getSolutionsWithSlugs } from "../../../../lib/kontentClient";
import { parseFlatted, stringifyAsType } from "../../../../lib/utils/circularityUtils";
import { defaultEnvId } from "../../../../lib/utils/env";
import { createElementSmartLink } from "../../../../lib/utils/smartLinkUtils";
import { notFound } from "next/navigation";
import { previewApiKeyCookieName } from "../../../../lib/constants/cookies";
import { cookies, draftMode } from "next/headers";
import { AppPage } from "../../../../components/shared/ui/appPage";
import { contentTypes } from "../../../../models/environment";

const SolutionDetailPage = async ({params}: {params: Promise<{envId: string, slug: string}>}) => {
  const slug = (await params).slug;
  const envId = (await params).envId;

  if (!slug) {
    return notFound();
  }

  const draft = await draftMode();
  const previewApiKey = draft.isEnabled ? (await cookies()).get(previewApiKeyCookieName)?.value : undefined;

  const solutionData = await getSolutionDetail({ envId, previewApiKey }, slug, draft.isEnabled);

  if (!solutionData) {
    return notFound();
  }

  const solution = parseFlatted(stringifyAsType(solutionData));

  return(
    <AppPage item={solution} >
      <HeroImage
        url={solution.elements.product_base__main_image.value[0]?.url || ""}
        itemId={solution.system.id}
      >
        <div
          className="py-1 px-3 w-full md:w-fit bg-mainBackgroundColor  opacity-90"
        >
          <h1
            {...createElementSmartLink(
              contentTypes.solution.elements.product_base__name.codename
            )}
            className="m-0 text-8xl text-white align-text-bottom max-w-2xl tracking-wide font-semibold"
          >
            {solution.elements.product_base__name.value}
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

export const generateStaticParams = () => 
  getSolutionsWithSlugs({ envId: defaultEnvId })
    .then((solutions) => solutions
      .map((solution) => ({ slug: solution.elements.slug.value} )));

export const revalidate = 60;

export const generateMetadata = async ({ params }: { params: Promise<{ envId: string }> }): Promise<Metadata> => {
  const envId = (await params).envId;

  const draft = await draftMode();
  const previewApiKey = draft.isEnabled ? (await cookies()).get(previewApiKeyCookieName)?.value : undefined;

  const defaultMetadata = await getDefaultMetadata({ envId, previewApiKey }, draft.isEnabled);

  if (!defaultMetadata) {
    console.log("generateMetadata: [envId]/[category]/page/[page]: Could not obtain defaultMetadata");
    return {};
  }

  return {
    description: defaultMetadata.elements.metadata__description.value,
    keywords: defaultMetadata.elements.metadata__keywords.value,
    title: defaultMetadata.elements.metadata__title.value 
  }
}

export default SolutionDetailPage;
