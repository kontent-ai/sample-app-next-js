import { FC, useState } from "react";
import { Block_Stack, contentTypes } from "../../models"
import { GenericActionComponent } from "./GenericAction";
import { useSiteCodename } from "./siteCodenameContext";
import { mainColorBorderClass, mainColorTextClass } from "../../lib/constants/colors";
import { createElementSmartLink, createItemSmartLink, createRelativeAddSmartLink } from "../../lib/utils/smartLinkUtils";
import { StandaloneSmartLinkButton } from "./StandaloneSmartLinkButton";

type Props = Readonly<{
  item: Block_Stack;
}>;

export const StackComponent: FC<Props> = props => {
  const [actionIndex, setActionIndex] = useState(0);

  const currentAction = props.item.elements.stack.linkedItems[actionIndex];

  if (!currentAction) {
    return null;
  }

  return (
    <div
      className="p-7 relative"
      {...createItemSmartLink(props.item.system.id, true)}
    >
      <h2 {...createElementSmartLink(contentTypes.stack.elements.title.codename)}>
        {props.item.elements.title.value}
      </h2>
      <div {...createElementSmartLink(contentTypes.stack.elements.message.codename)}>
        {props.item.elements.message.value}
      </div>
      <section
        className="py-11"
        {...createElementSmartLink(contentTypes.stack.elements.stack.codename, true)}
      >
        <StandaloneSmartLinkButton elementCodename={contentTypes.stack.elements.stack.codename} />
        <Headers
          headers={props.item.elements.stack.linkedItems.map(item => ({ id: item.system.id, label: item.elements.title.value }))}
          onHeaderSelected={setActionIndex}
          selectedHeaderIndex={actionIndex}
        />
        <div className="pt-3">
          <GenericActionComponent item={currentAction} />
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
    <menu className="flex gap-6 border-b-2 border-b-gray-100">
      {props.headers.map((header, i) => (
        <li
          key={i}
          className={`w-12 md:w-fit overflow-hidden h-full m-0 shrink text-ellipsis flex justify-center items-center cursor-pointer ${mainColorBorderClass[siteCodename]} ${props.selectedHeaderIndex === i ? "md:border-b-2" : ""}`}
          onClick={() => props.onHeaderSelected(i)}
          {...createItemSmartLink(header.id, true)}
          {...createRelativeAddSmartLink("after", "bottom-end")}
        >
          <span className="hidden md:block">{header.label}</span>
          <span className={`md:hidden font-black text-xl ${props.selectedHeaderIndex === i ? mainColorTextClass[siteCodename] : ""}`}>•</span>
        </li>
      ))}
    </menu>
  );
}

