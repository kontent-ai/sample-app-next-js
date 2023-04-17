import { GetStaticProps, NextPage } from 'next';
import { getItemByCodename, getRootItem } from "../lib/kontentClient";
import { Homepage, Page } from '../models';
import styles from '../styles/Home.module.css';

const Home: NextPage<IndexProps> = props => {
  return (
    <main >
      <div className={styles.hero}>
        <h1 className="append-dot">{props.homepage.elements.title.value}</h1>
        <ul>
          {props.menuItems.map(item => <li key={item.system.id}>{item.system.name}</li>)}
        </ul>
      </div>
    </main>
  )
}

export default Home

interface IndexProps {
  readonly homepage: Homepage;
  readonly menuItems: ReadonlyArray<Page>;
}

export const getStaticProps: GetStaticProps<IndexProps> = async context => {
  const homepage = await getRootItem(!!context.preview);
  const subpages = await Promise.all(homepage.elements.subpages.value.map(c => getItemByCodename<Page>(c, !!context.preview)));

  const menuItems = subpages.filter(p => p.elements.showInNavigation?.value[0]?.codename === "yes");

  return {
    props: { homepage, menuItems },
  };
}
