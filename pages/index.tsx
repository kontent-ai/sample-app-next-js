import { KontentSmartLinkEvent } from '@kontent-ai/smart-link';
import { IRefreshMessageData, IRefreshMessageMetadata } from '@kontent-ai/smart-link/types/lib/IFrameCommunicatorTypes';
import { GetStaticProps, NextPage } from 'next';
import { useEffect, useState } from 'react';

import { Content } from '../components/shared/Content';
import { AppPage } from '../components/shared/ui/appPage';
import { getHomepage, getSiteMenu } from "../lib/kontentClient";
import { ValidCollectionCodename } from '../lib/types/perCollection';
import { useSmartLink } from '../lib/useSmartLink';
import { siteCodename } from '../lib/utils/env';
import { Block_Navigation,WSL_WebSpotlightRoot } from '../models';

type Props = Readonly<{
  homepage: WSL_WebSpotlightRoot;
  siteCodename: ValidCollectionCodename;
  siteMenu?: Block_Navigation;
}>;

const Home: NextPage<Props> = props => {
  const [homepage, setHomepage] = useState(props.homepage);

  const sdk = useSmartLink();

  useEffect(() => {
    const getHomepage =  async ()  => {
      const response = await fetch('/api/homepage');
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
  }, [sdk]);

  return (
    <AppPage
      item={homepage}
      siteCodename={props.siteCodename}
      siteMenu={props.siteMenu}
      pageType='WebPage'
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
)};

export const getStaticProps: GetStaticProps<Props> = async context => {
  const homepage = await getHomepage(!!context.preview);
  const siteMenu = await getSiteMenu(!!context.preview);

  if (!homepage) {
    throw new Error("Can't find homepage item.");
  }

  return {
    props: { homepage, siteCodename, siteMenu },
  };
}

export default Home
