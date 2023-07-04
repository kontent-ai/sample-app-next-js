import { FC, useState } from "react";

import { mainColorBorderClass } from "../../../lib/constants/colors";
import { createElementSmartLink, createItemSmartLink, createRelativeAddSmartLink } from "../../../lib/utils/smartLinkUtils";
import { contentTypes, Fact } from "../../../models"
import { FactComponent } from "../GenericAction";
import { useSiteCodename } from "../siteCodenameContext";
import { StandaloneSmartLinkButton } from "../StandaloneSmartLinkButton";

type Props = Readonly<{
  items: ReadonlyArray<Fact>;
  title: string;
  subtitle: string;
  itemId: string;
}>;

export const StackComponent: FC<Props> = props => {
  const [actionIndex, setActionIndex] = useState(0);
  const currentAction = props.items[actionIndex];

  if (!currentAction) {
    return null;
  }

  return (
    <div
      className="p-7 relative"
      {...createItemSmartLink(props.itemId, true)}
    >
      <h2 {...createElementSmartLink(contentTypes._visual_container.elements.title.codename)}>
        {props.title}
      </h2>
      <div {...createElementSmartLink(contentTypes._visual_container.elements.subtitle.codename)}>
        {props.subtitle}
      </div>
      <section
        className="py-10"
        {...createElementSmartLink(contentTypes._visual_container.elements.items.codename, true)}
      >
        <StandaloneSmartLinkButton elementCodename={contentTypes._visual_container.elements.items.codename} />
        <Headers
          headers={props.items.map(item => ({ id: item.system.id, label: item.elements.title.value }))}
          onHeaderSelected={setActionIndex}
          selectedHeaderIndex={actionIndex}
        />
        <div>
          <FactComponent item={currentAction} />
        </div>
      </section>
    </div>
  );
};

type HeadersProps = Readonly<{
  headers: ReadonlyArray<Readonly<{ id: string; label: string }>>;
  selectedHeaderIndex: number;
  onHeaderSelected: (headerIndex: number) => void;
}>;

const Headers: FC<HeadersProps> = props => {
  const siteCodename = useSiteCodename();

  return (
    <menu className="flex grow">
      {props.headers.map((header, i) => (
        <li
          key={i}
          className={`grow w-full text-center justify-center items-center flex overflow-hidden m-0 p-2 cursor-pointer ${props.selectedHeaderIndex === i ? `bg-gray-200  border-t-2 ${mainColorBorderClass[siteCodename]}` : ""}`}
          onClick={() => props.onHeaderSelected(i)}
          {...createItemSmartLink(header.id, true)}
          {...createRelativeAddSmartLink("after", "bottom-end")}
        >
          <span className="hidden md:block">{header.label}</span>
          <span className="md:hidden font-black text-xl">•</span>
        </li>
      ))}
    </menu>
  );
}

