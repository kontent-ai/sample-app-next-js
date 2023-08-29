import { FC, useState } from "react";

import {
  mainColorAnchor,
  mainColorBorderClass,
} from "../../../lib/constants/colors";
import {
  createElementSmartLink,
  createItemSmartLink,
  createRelativeAddSmartLink,
} from "../../../lib/utils/smartLinkUtils";
import { contentTypes, Fact } from "../../../models";
import { FactComponent } from "../Fact";
import { useSiteCodename } from "../siteCodenameContext";
import { StandaloneSmartLinkButton } from "../StandaloneSmartLinkButton";

type Props = Readonly<{
  items: ReadonlyArray<Fact>;
  title: string;
  subtitle: string;
  itemId: string;
  codename: string;
}>;

export const StackComponent: FC<Props> = (props) => {
  const [actionIndex, setActionIndex] = useState(0);
  const currentAction = props.items[actionIndex];
  const siteCodename = useSiteCodename();

  if (!currentAction) {
    return null;
  }

  return (
    <div
      className="vis-container px-3 md:px-10 relative"
      {...createItemSmartLink(props.itemId, true)}
    >
      {props.title && (
        <h3
          id={props.codename}
          className="heading"
          {...createElementSmartLink(
            contentTypes.visual_container.elements.title.codename
          )}
        >
          <a
            className={mainColorAnchor[siteCodename]}
            href={"#" + props.codename}
          >
            {props.title}
          </a>
        </h3>
      )}
      <div
        className="pb-5"
        {...createElementSmartLink(
          contentTypes.visual_container.elements.subtitle.codename
        )}
      >
        {props.subtitle}
      </div>
      <section
        {...createElementSmartLink(
          contentTypes.visual_container.elements.items.codename,
          true
        )}
      >
        <StandaloneSmartLinkButton
          elementCodename={
            contentTypes.visual_container.elements.items.codename
          }
        />
        {props.items.length > 1 && (
          <Headers
            headers={props.items.map((item) => ({
              id: item.system.id,
              label: item.elements.title.value,
            }))}
            onHeaderSelected={setActionIndex}
            selectedHeaderIndex={actionIndex}
          />
        )}
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

const Headers: FC<HeadersProps> = (props) => {
  const siteCodename = useSiteCodename();

  return (
    <menu className="flex grow">
      {props.headers.map((header, i) => (
        <li
          key={i}
          className={`grow w-fit justify-center md:justify-between md:pl-5 flex overflow-hidden p-2 cursor-pointer ${
            props.selectedHeaderIndex === i
              ? `border-b-2 ${mainColorBorderClass[siteCodename]}`
              : ""
          }`}
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
};
