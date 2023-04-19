import { nodeParse } from '@pokornyd/kontent-ai-rich-text-parser/dist/cjs/src/parser/node';
import { IPortableTextImage } from '@pokornyd/kontent-ai-rich-text-parser/dist/cjs/src/parser/parser-models';
import { transformToPortableText } from '@pokornyd/kontent-ai-rich-text-parser/dist/cjs/src/transformers/portable-text-transformer/portable-text-transformer';
import { PortableText, PortableTextReactComponents } from '@portabletext/react';
import { GetStaticProps, NextPage } from 'next';
import Image from 'next/image';
import { getItemByCodename, getRootItem } from "../lib/kontentClient";
import { Article, Homepage, Page } from '../models';
import styles from '../styles/Home.module.css';

const Home: NextPage<IndexProps> = props => {
  const teaserImage = props.content.elements.teaserImage.value[0];
  if (!teaserImage) {
    return <main>Error error, teaser image is missing.</main>;
  }

  const parsedTree = nodeParse(props.content.elements.bodyCopy.value);
  const parsedContent = transformToPortableText(parsedTree);

  return (
    <main >
      <div className={styles.hero}>
        <h1 className="append-dot">{props.homepage.elements.title.value}</h1>
        <ul>
          {props.menuItems.map(item => <li key={item.system.id}>{item.system.name}</li>)}
        </ul>
        {teaserImage && (
          <Image
            src={teaserImage.url}
            alt={teaserImage.description?.[0] ?? "Teaser image"}
            width={400}
            height={500}
          />
        )}
        <div>Content: </div>
        <div>
          <PortableText value={parsedContent} components={resolvers} />
        </div>
      </div>
    </main>
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
