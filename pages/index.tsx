import { GetStaticProps, NextPage } from 'next';
import { AppPage } from '../components/shared/ui/appPage';
import { getHomepage } from "../lib/kontentClient";
import { WebSpotlightRoot } from '../models/content-types/web_spotlight_root';
import { ValidCollectionCodename } from '../lib/types/perCollection';
import { siteCodename } from '../lib/utils/env';
import { Content } from '../components/shared/Content';

type Props = Readonly<{
  homepage: WebSpotlightRoot;
  siteCodename: ValidCollectionCodename;
}>;

const Home: NextPage<Props> = props => (
  <AppPage itemId={props.homepage.system.id} siteCodename={props.siteCodename}>
    <div>
      {props.homepage.elements.content.linkedItems.map(item => (
        <Content key={item.system.id} item={item as any} />
      ))}
    </div>
  </AppPage>
);

export const getStaticProps: GetStaticProps<Props> = async context => {
  const homepage = await getHomepage(!!context.preview);

  if (!homepage) {
    throw new Error("Can't find homepage item.");
  }

  return {
    props: { homepage, siteCodename },
  };
}

export default Home
