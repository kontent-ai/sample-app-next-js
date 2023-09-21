import { KontentSmartLinkEvent } from '@kontent-ai/smart-link';
import { IRefreshMessageData, IRefreshMessageMetadata } from '@kontent-ai/smart-link/types/lib/IFrameCommunicatorTypes';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useEffect, useState } from 'react';

import { Content } from '../../components/shared/Content';
import { AppPage } from '../../components/shared/ui/appPage';
import { getHomepage, getSiteMenu } from '../../lib/kontentClient';
import { useSmartLink } from '../../lib/useSmartLink';
import { defaultEnvId } from '../../lib/utils/env';
import { getEnvIdFromRouteParams, getPreviewApiKeyFromPreviewData } from '../../lib/utils/pageUtils';
import { Nav_NavigationItem, WSL_WebSpotlightRoot } from '../../models';


type Props = Readonly<{
  homepage: WSL_WebSpotlightRoot;
  siteMenu: Nav_NavigationItem | null;
  isPreview: boolean;
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
    >
      <div>
        {homepage.elements.content.linkedItems.map(item => (
          <Content
            key={item.system.id}
            item={item as any}
          />
        ))}
      </div>
    </AppPage>
  )
};

export const getStaticProps: GetStaticProps<Props, { envId: string }> = async context => {
  const envId = getEnvIdFromRouteParams(context);

  const previewApiKey = getPreviewApiKeyFromPreviewData(context.previewData);

  const homepage = await getHomepage({ envId, previewApiKey }, !!context.preview);
  const siteMenu = await getSiteMenu({ envId, previewApiKey }, !!context.preview);

  if (!homepage) {
    throw new Error("Can't find homepage item.");
  }

  return {
    props: { homepage, siteMenu, isPreview: !!context.preview },
  };
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [{
    params: { envId: defaultEnvId }
  }],
  fallback: 'blocking',
})

export default Home
