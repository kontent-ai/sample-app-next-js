import { GetStaticPaths, GetStaticProps } from "next";
import { pageCodenames } from '../lib/routing';
import { getItemByCodename, getSiteMenu } from "../lib/kontentClient";
import { Block_Navigation, WSL_Page, contentTypes } from "../models";
import { FC } from "react";
import { Content } from "../components/shared/Content";
import { AppPage } from "../components/shared/ui/appPage";
import { ParsedUrlQuery } from "querystring";
import { ValidCollectionCodename } from "../lib/types/perCollection";
import { siteCodename } from "../lib/utils/env";
import { createElementSmartLink, createFixedAddSmartLink } from "../lib/utils/smartLinkUtils";

type Props = Readonly<{
  page: WSL_Page;
  siteCodename: ValidCollectionCodename;
  siteMenu: Block_Navigation;
}>;

interface IParams extends ParsedUrlQuery {
  slug: keyof typeof pageCodenames
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = Object.keys(pageCodenames).map(slug => (
    { params: { slug } }
  ))
  return {
    paths,
    // TODO decide the behavior
    fallback: false, // can also be true or 'blocking'
  }
}

// `getStaticPaths` requires using `getStaticProps`
export const getStaticProps: GetStaticProps = async (context) => {
  // TODO break hardcoding
  const { slug } = context.params as IParams;

  const pageCodename = pageCodenames[slug] ?? null;
  if (pageCodename === null) {
    return {
      redirect: {
        destination: '/404',
        // TODO
        permanent: true
      }
    };
  };

  const siteMenu = await getSiteMenu(!!context.preview);

  const page = await getItemByCodename<WSL_Page>(pageCodename, !!context.preview);
  if (page === null) {
    return {
      notFound: true
    };
  };

  return {
    props: { page, siteCodename, siteMenu },
  };
}

const TopLevelPage: FC<Props> = props => (
  <AppPage itemId={props.page.system.id} siteCodename={props.siteCodename} siteMenu={props.siteMenu}>
    <div
      {...createElementSmartLink(contentTypes.page.elements.content.codename)}
      {...createFixedAddSmartLink("end")}
    >
      {props.page.elements.content.linkedItems.map(piece => (
        <Content key={piece.system.id} item={piece as any} />
      ))}
    </div>
  </AppPage>
);

export default TopLevelPage;
