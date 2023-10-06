import {
  GetStaticPaths,
  GetStaticProps,
  NextPage,
} from 'next';
import { useState } from 'react';

import { Content } from '../../components/shared/Content';
import { useLivePreview } from '../../components/shared/contexts/LivePreview';
import { useSmartLinkRefresh } from '../../components/shared/contexts/SmartLink';
import { AppPage } from '../../components/shared/ui/appPage';
import {
  getHomepage,
  getSiteMenu,
} from '../../lib/kontentClient';
import { defaultEnvId } from '../../lib/utils/env';
import {
  getEnvIdFromRouteParams,
  getPreviewApiKeyFromPreviewData,
} from '../../lib/utils/pageUtils';
import {
  Nav_NavigationItem,
  WSL_WebSpotlightRoot,
} from '../../models';

type Props = Readonly<{
  homepage: WSL_WebSpotlightRoot;
  siteMenu: Nav_NavigationItem | null;
  isPreview: boolean;
}>;

const Home: NextPage<Props> = ({
  homepage,
  siteMenu,
  isPreview,
}) => {
  const [refreshedHomePage, setRefreshedHomePage] = useState(homepage);

  useSmartLinkRefresh(async () => {
    const response = await fetch(`/api/homepage?preview=${isPreview}`);
    const data = await response.json();

    setRefreshedHomePage(data);
  });

  const data = {
    siteMenu: useLivePreview(siteMenu, isPreview),
    homepage: useLivePreview(refreshedHomePage, isPreview),
  };

  return (
    <AppPage
      item={data.homepage}
      siteMenu={data.siteMenu ?? null}
      pageType="WebPage"
      defaultMetadata={data.homepage}
    >
      <div>
        {data.homepage.elements.content.linkedItems.map(item => (
          <Content
            key={item.system.id}
            item={item as any}
          />
        ))}
      </div>
    </AppPage>
  );
};

export const getStaticProps: GetStaticProps<Props, { envId: string }> = async context => {
  const envId = getEnvIdFromRouteParams(context);

  const previewApiKey = getPreviewApiKeyFromPreviewData(context.previewData);

  const homepage = await getHomepage({
    envId,
    previewApiKey,
  }, !!context.preview);
  const siteMenu = await getSiteMenu({
    envId,
    previewApiKey,
  }, !!context.preview);

  if (!homepage) {
    throw new Error('Can\'t find homepage item.');
  }

  return {
    props: {
      homepage,
      siteMenu,
      isPreview: !!context.preview,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [{
    params: { envId: defaultEnvId },
  }],
  fallback: 'blocking',
});

export default Home;
