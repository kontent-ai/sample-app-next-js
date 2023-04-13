import { GetStaticProps, NextPage } from 'next';
import { getRootItem } from "../lib/kontentClient";
import { Homepage } from '../models';
import styles from '../styles/Home.module.css';

const Home: NextPage<IndexProps> = ({ homepage }) => {
  return (
    <main >
      <div className={styles.hero}>
        <h1 className="append-dot">{homepage.elements.title.value}</h1>
      </div>
    </main>
  )
}

export default Home

interface IndexProps {
  homepage: Homepage;
}

export const getStaticProps: GetStaticProps<IndexProps> = async () => {
  const homepage = await getRootItem();

  return {
    props: { homepage },
  };
}
