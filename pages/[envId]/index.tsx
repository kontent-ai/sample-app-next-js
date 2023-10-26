import { KontentSmartLinkEvent } from '@kontent-ai/smart-link';
import { IRefreshMessageData, IRefreshMessageMetadata } from '@kontent-ai/smart-link/types/lib/IFrameCommunicatorTypes';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useEffect, useState } from 'react';

import { Content } from '../../components/shared/Content';
import { AppPage } from '../../components/shared/ui/appPage';
import { getHomepage, getSiteMenu } from '../../lib/kontentClient';
import { useSmartLink } from '../../lib/useSmartLink';
import { ItemCircularReferenceMap, sanitizeItem } from '../../lib/utils/circularityUtils';
import { defaultEnvId } from '../../lib/utils/env';
import { getEnvIdFromRouteParams, getPreviewApiKeyFromPreviewData } from '../../lib/utils/pageUtils';
import { Nav_NavigationItem, WSL_WebSpotlightRoot } from '../../models';


type Props = Readonly<{
  homepage: WSL_WebSpotlightRoot;
  siteMenu: Nav_NavigationItem | null;
  isPreview: boolean;
  circularReferences: ItemCircularReferenceMap;
}>;

const Home: NextPage<Props> = props => {
  const [homepage, setHomepage] = useState(props.homepage);

  const sdk = useSmartLink();

  useEffect(() => {
    const getHomepage = async () => {
      const response = await fetch(`/api/homepage?preview=${props.isPreview}`);
      const data = await response.json();

      setHomepage(data);
    }

    sdk?.on(KontentSmartLinkEvent.Refresh, (data: IRefreshMessageData, metadata: IRefreshMessageMetadata, originalRefresh: () => void) => {
      if (metadata.manualRefresh) {
        originalRefresh();
      } else {
        getHomepage();
      }
    });
  }, [sdk, props.isPreview]);

  return (
    <AppPage
      item={homepage}
      siteMenu={props.siteMenu ?? null}
      pageType='WebPage'
      defaultMetadata={homepage}
      circularReferences={props.circularReferences}
    >
      <div>
        {homepage.elements.content.linkedItems.map(item => (
          <Content
            key={item.system.id}
            item={item}
          />
        ))}
      </div>
    </AppPage>
  )
};

export const getStaticProps: GetStaticProps<Props, { envId: string }> = async context => {
  const envId = getEnvIdFromRouteParams(context);

  const previewApiKey = getPreviewApiKeyFromPreviewData(context.previewData);

  const homepageData = await getHomepage({ envId, previewApiKey }, !!context.preview);
  const siteMenuData = await getSiteMenu({ envId, previewApiKey }, !!context.preview);


  if (!homepageData) {
    throw new Error("Can't find homepage item.");
  }

  if (!siteMenuData) {
    throw new Error("Can't find main menu item.");
  }

  const [homepage, homepageCircularReferences] = sanitizeItem(homepageData);
  const [siteMenu, siteMenuCircularReferences] = sanitizeItem(siteMenuData);

  const circularReferences = {...homepageCircularReferences, ...siteMenuCircularReferences};

  return {
    props: { homepage, siteMenu, isPreview: !!context.preview, circularReferences },
  };
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [{
    params: { envId: defaultEnvId }
  }],
  fallback: 'blocking',
})

export default Home
