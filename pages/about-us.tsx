import { GetStaticProps } from "next";
import { FC } from "react";
import { Content } from "../components/shared/Content";
import { AppPage } from "../components/shared/ui/appPage";
import { getItemByCodename } from "../lib/kontentClient";
import { Page } from "../models"

type Props = Readonly<{
  page: Page;
}>;

const Component: FC<Props> = props => (
  <AppPage>
    <h1>{props.page.elements.title.value}</h1>
    {props.page.elements.content.linkedItems.map(piece => (
      <Content key={piece.system.id} item={piece as any} />
    ))}
  </AppPage>
);

export const getStaticProps: GetStaticProps<Props> = async context => {
  const page = await getItemByCodename<Page>("about_us", !!context.preview);

  return {
    props: { page },
  };
};

export default Component;
