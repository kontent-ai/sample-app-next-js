import { GetStaticProps, NextPage } from 'next';
import { AppPage } from '../components/shared/ui/appPage';
import { envId, getHomepage } from "../lib/kontentClient";
import { ValidCollectionCodename } from '../lib/types/perCollection';
import { siteCodename } from '../lib/utils/env';
import { Content } from '../components/shared/Content';
import { WebSpotlightRoot } from '../models';
import { useCallback, useEffect, useState } from 'react';
import KontentSmartLink, { KontentSmartLinkEvent } from '@kontent-ai/smart-link';
import { IRefreshMessageData, IRefreshMessageMetadata } from '@kontent-ai/smart-link/types/lib/IFrameCommunicatorTypes';

import { ClientConfig, createClient } from '../lib/createClient';

type Props = Readonly<{
  homepage: WebSpotlightRoot;
  siteCodename: ValidCollectionCodename;
  config: ClientConfig,
  preview: boolean,
}>;

const Home: NextPage<Props> = props => {
  const [homepage, setHomepage] = useState(props.homepage);

  const getHomepage =  useCallback(async ()  => {
    const client = createClient(props.config);

    const home =  await client
    .items()
    .type("web_spotlight_root")
    .collection(props.siteCodename)
    .queryConfig({
      usePreviewMode: props.preview,
    })
    .depthParameter(10)
    .toPromise()
    .then(res => res.data.items[0] as WebSpotlightRoot | undefined)

    if(home === undefined) {
      return;
    }

    setHomepage(home as WebSpotlightRoot);
  }, [props.siteCodename, props.config, props.preview])  

  useEffect(() => {
    const sdk = KontentSmartLink.initialize({
      defaultDataAttributes: {
        projectId: props.config.environmentId,
        languageCodename: "default",
      }
    });


    sdk.on(KontentSmartLinkEvent.Refresh, (data: IRefreshMessageData, metadata: IRefreshMessageMetadata, originalRefresh: () => void) => {
      if (metadata.manualRefresh) {
        originalRefresh();
      } else {
        const { projectId, languageCodename, updatedItemCodename } = data;

        console.log(updatedItemCodename);
        getHomepage()
      }
    });

    return () => {
      sdk.destroy();
    };
  }, [getHomepage, props.config.environmentId]);

  return (
    <AppPage itemId={props.homepage.system.id} siteCodename={props.siteCodename}>
      <div>
        {homepage.elements.content.linkedItems.map(item => (
          <Content key={item.system.id} item={item as any} />
        ))}
      </div>
    </AppPage>
)};

export const getStaticProps: GetStaticProps<Props> = async context => {
  const homepage = await getHomepage(!!context.preview);

  const config: ClientConfig = {
    environmentId: envId as string,
    appName: process.env.APP_NAME,
    appVersion: process.env.APP_VERSION,
    previewApiKey: process.env.KONTENT_PREVIEW_API_KEY
  }

  if (!homepage) {
    throw new Error("Can't find homepage item.");
  }

  return {
    props: { homepage, siteCodename, config, preview: !!context.preview },
  };
}

export default Home
