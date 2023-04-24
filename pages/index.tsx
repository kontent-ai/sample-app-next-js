import { nodeParse } from '@kontent-ai/rich-text-resolver/dist/cjs/src/parser/node';
import { IPortableTextImage } from '@kontent-ai/rich-text-resolver/dist/cjs/src/parser/parser-models';
import { transformToPortableText } from '@kontent-ai/rich-text-resolver/dist/cjs/src/transformers/portable-text-transformer/portable-text-transformer';
import { PortableText, PortableTextReactComponents } from '@portabletext/react';
import { GetStaticProps, NextPage } from 'next';
import Image from 'next/image';
import { HeroImage } from '../components/landingPage/ui/heroImage';
import { AppPage } from '../components/shared/ui/appPage';
import { getItemByCodename, getRootItem } from "../lib/kontentClient";
import { Article, Homepage, Page } from '../models';

const Home: NextPage<IndexProps> = props => {
  const teaserImage = props.content.elements.teaserImage.value[0];
  if (!teaserImage) {
    return <main>Error error, teaser image is missing.</main>;
  }

  const parsedTree = nodeParse(props.content.elements.bodyCopy.value);
  const parsedContent = transformToPortableText(parsedTree);

  return (
    <AppPage
      menuItems={props.menuItems.map(i => ({ url: i.system.id, title: i.system.name }))}
      itemId={props.homepage.system.id}
    >
      <HeroImage url={teaserImage.url}>
        <div className="h-full flex justify-center items-center relative">
          <h1
            className="text-4xl"
            data-kontent-element-codename="title"
          >
            {props.homepage.elements.title.value}
          </h1>
        </div>
      </HeroImage>
      <div className="flex flex-col items-center mt-20">
        <PortableText value={parsedContent} components={resolvers} />
      </div>
    </AppPage>
  )
}

export default Home

const resolvers: Partial<PortableTextReactComponents> = {
  types: {
    image: ({ value }: { value: IPortableTextImage }) => {
      return <Image
        src={value.asset.url}
        alt="Cannot get description for assets in rich text :/"
        width={400}
        height={200}
      />;
    },
  },
};

interface IndexProps {
  readonly homepage: Homepage;
  readonly menuItems: ReadonlyArray<Page>;
  readonly content: Article;
}

export const getStaticProps: GetStaticProps<IndexProps> = async context => {
  const homepage = await getRootItem(!!context.preview);
  const subpages = await Promise.all(homepage.elements.subpages.value.map(c => getItemByCodename<Page>(c, !!context.preview)));

  const menuItems = subpages.filter(p => p.elements.showInNavigation?.value[0]?.codename === "yes");

  return {
    props: { homepage, menuItems, content: homepage.elements.content.linkedItems[0] as Article },
  };
}
