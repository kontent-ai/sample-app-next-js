import { KontentSmartLinkEvent } from '@kontent-ai/smart-link';
import { IRefreshMessageData, IRefreshMessageMetadata } from '@kontent-ai/smart-link/types/lib/IFrameCommunicatorTypes';
import { getCookie, setCookie } from 'cookies-next';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useEffect, useState } from 'react';

import { Content } from '../../components/shared/Content';
import { AppPage } from '../../components/shared/ui/appPage';
import { getHomepage, getSiteMenu } from '../../lib/kontentClient';
import { ValidCollectionCodename } from '../../lib/types/perCollection';
import { useSmartLink } from '../../lib/useSmartLink';
import { siteCodename } from '../../lib/utils/env';
import { Nav_NavigationItem, WSL_WebSpotlightRoot } from '../../models';


type Props = Readonly<{
  homepage: WSL_WebSpotlightRoot;
  siteCodename: ValidCollectionCodename;
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

  useEffect(() => {
    if(!getCookie('currentEnvId', {path: "/", sameSite: "none", secure: true})){
      setCookie('currentEnvId', process.env.NEXT_PUBLIC_KONTENT_ENVIRONMENT_ID, {path: '/', sameSite:"none", secure: true});
    }
  }, []);

  return (
    <AppPage
      item={homepage}
      siteCodename={props.siteCodename}
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
  const envId = context.params?.envId;
  if (!envId) {
    throw new Error("Missing envId in url");
  }

  const previewApiKey = context.previewData && typeof context.previewData === 'object' && 'currentPreviewApiKey' in context.previewData
    ? context.previewData.currentPreviewApiKey as string 
    : undefined ;

  const homepage = await getHomepage({ envId: envId, previewApiKey: previewApiKey }, !!context.preview);
  const siteMenu = await getSiteMenu({ envId: envId, previewApiKey: previewApiKey }, !!context.preview);

  if (!homepage) {
    throw new Error("Can't find homepage item.");
  }

  return {
    props: { homepage, siteCodename, siteMenu, isPreview: !!context.preview },
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  const envId = process.env.NEXT_PUBLIC_KONTENT_ENVIRONMENT_ID;
  if (!envId) {
    throw new Error("Missing 'NEXT_PUBLIC_KONTENT_ENVIRONMENT_ID' environment variable.");
  }

  return {
    paths: [{
      params: { envId: envId }
    }],
    fallback: 'blocking',
  }
}

export default Home
