import { GetStaticProps, NextPage } from 'next';
import { AppPage } from '../components/shared/ui/appPage';
import { getHomepage } from "../lib/kontentClient";
import { ValidCollectionCodename } from '../lib/types/perCollection';
import { siteCodename } from '../lib/utils/env';
import { Content } from '../components/shared/Content';
import { WebSpotlightRoot } from '../models';
import { useEffect, useState } from 'react';
import KontentSmartLink, { KontentSmartLinkEvent } from '@kontent-ai/smart-link';
import { IRefreshMessageData, IRefreshMessageMetadata } from '@kontent-ai/smart-link/types/lib/IFrameCommunicatorTypes';

type Props = Readonly<{
  homepage: WebSpotlightRoot;
  siteCodename: ValidCollectionCodename;
  preview: boolean
}>;

const Home: NextPage<Props> = props => {
  const [homepage, setHomepage] = useState(props.homepage);

  useEffect(() => {
    if(props.preview){
      const sdk = KontentSmartLink.initialize();
      sdk.on(KontentSmartLinkEvent.Refresh, (data: IRefreshMessageData, metadata: IRefreshMessageMetadata, originalRefresh: () => void) => {
        if (metadata.manualRefresh) {
          originalRefresh();
        } else {
          //const { projectId, languageCodename, updatedItemCodename } = data;
          const h = getHomepage(true);
          if(!h) {
            return;
          }

          setHomepage(h as unknown as WebSpotlightRoot);
        }
      });

      return () => sdk.destroy();
    }
  }, [props.preview])


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

  if (!homepage) {
    throw new Error("Can't find homepage item.");
  }

  return {
    props: { homepage, siteCodename , preview: !!context.preview },
  };
}

export default Home
