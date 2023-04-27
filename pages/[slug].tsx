import { GetStaticPaths, GetStaticProps } from "next";
import { PerCollectionCodenames, pageCodenames } from '../lib/routing';
import { getItemByCodename } from "../lib/kontentClient";
import { Page, contentTypes } from "../models";
import { FC } from "react";
import { Content } from "../components/shared/Content";
import { AppPage } from "../components/shared/ui/appPage";
import { ParsedUrlQuery } from "querystring";

type Props = Readonly<{
    page: Page;
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

    const pageCodename = pageCodenames[slug];
    if (pageCodename === null) {
        return {
            redirect: {
                destination: '/404',
                // TODO
                permanent: true
            }
        };
    };

    const page = await getItemByCodename<Page>(pageCodename, !!context.preview);
    if (page === null) {
        return {
            notFound: true
        };
    };

    return {
        props: { page },
    };
}

const TopLevelPage: FC<Props> = props => (
    <AppPage itemId={props.page.system.id}>
        <h1
            data-kontent-element-codename={contentTypes.page.elements.title.codename}
        >
            {props.page.elements.title.value}
        </h1>
        {props.page.elements.content.linkedItems.map(piece => (
            <Content key={piece.system.id} item={piece as any} />
        ))}
    </AppPage>
);

export default TopLevelPage;