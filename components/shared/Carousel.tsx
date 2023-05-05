import { ComponentProps, FC, useState } from "react";
import { Carousel } from "../../models"
import { range } from "../../lib/utils/range";
import { Content } from "./Content";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/solid";

type Props = Readonly<{
  item: Carousel;
}>;

export const CarouselComponent: FC<Props> = props => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastMove, setLastMove] = useState<LastMove>("withoutAnimation")

  const itemCount = props.item.elements.heroUnits.linkedItems.length;

  const wrapIndex = (i: number) => i < 0 ? itemCount + i : i % itemCount;

  const moveForward = () => {
    setLastMove("forward");
    setCurrentIndex(prev => wrapIndex(prev + 1));
  };
  const moveBackward = () => {
    setLastMove("back");
    setCurrentIndex(prev => wrapIndex(prev - 1));
  };
  const jumpToIndex = (i: number) => {
    setLastMove("withoutAnimation");
    setCurrentIndex(i);
  };

  return (
    <div className="relative w-full">
      <div className="relative overflow-hidden rounded-lg">
        {/*This is a placeholder to determine the carousel height, because the real carousel items are absolutely positioned.*/}
        <div className="relative z-0 opacity-0 w-fit">
          <Content item={props.item.elements.heroUnits.linkedItems[0]} />
        </div>
        {props.item.elements.heroUnits.linkedItems.map((item, index) => (
          <Item
            key={index}
            state={calculateItemState({ currentIndex, itemIndex: index, lastMove, wrapIndex })}
            shouldAnimate={lastMove !== "withoutAnimation"}
            item={item}
          />
        ))}
      </div>
      <Indicator currentIndex={currentIndex} navigateTo={jumpToIndex} totalItems={props.item.elements.heroUnits.linkedItems.length} />
      <NextPrev onNext={moveForward} onPrev={moveBackward} />
    </div>
  );
};

type LastMove = "forward" | "back" | "withoutAnimation";

const calculateItemState = (params: { currentIndex: number; itemIndex: number; lastMove: LastMove; wrapIndex: (i: number) => number }): ItemState => {
  if (params.currentIndex === params.itemIndex) {
    return "current";
  }
  if (params.wrapIndex(params.currentIndex + 1) === params.itemIndex) {
    return params.lastMove === "back" ? "nextMovingAway" : "next";
  }
  if (params.wrapIndex(params.currentIndex - 1) === params.itemIndex) {
    return params.lastMove === "forward" ? "previousMovingAway" : "previous";
  }
  return "hidden";
};

type ItemProps = Readonly<{
  item: ComponentProps<typeof Content>["item"];
  shouldAnimate: boolean;
  state: ItemState;
}>;

type ItemState = "current" | "next" | "previous" | "hidden" | "nextMovingAway" | "previousMovingAway";

const Item: FC<ItemProps> = props => (
  <div className={`${createItemAnimationClasses(props.state)} absolute ${props.shouldAnimate ? "transition-transform" : ""} transform inset-0 duration-700 ease-in-out`}>
    <div className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
      <Content item={props.item} />
    </div>
  </div>
);

const createItemAnimationClasses = (state: ItemState): string => {
  switch (state) {
    case "current":
      return "z-20 translate-x-0";
    case "hidden":
      return "hidden";
    case "next":
      return "z-10 translate-x-full";
    case "nextMovingAway":
      return "z-[11] translate-x-full";
    case "previous":
      return "z-10 -translate-x-full";
    case "previousMovingAway":
      return "z-[11] -translate-x-full";
    default:
      throw new Error(`Unknown item state ${state}.`);
  }
};

type IndicatorProps = Readonly<{
  currentIndex: number;
  totalItems: number;
  navigateTo: (index: number) => void;
}>;

const Indicator: FC<IndicatorProps> = props => (
  <div className="absolute z-30 flex space-x-3 -translate-x-1/2 bottom-5 left-1/2">
    {range(props.totalItems).map(i => (
      <button
        key={i}
        onClick={() => props.navigateTo(i)}
        type="button"
        className={`w-3 h-3 rounded-full ${createIndicatorClasses(i === props.currentIndex)}`}
        aria-current={i === props.currentIndex ? "true" : "false"}
        aria-label={`Slide ${i}`}
      />
    ))}
  </div>
);

const createIndicatorClasses = (isCurrent: boolean) => isCurrent
  ? "bg-white"
  : "bg-white/50 hover:bg-white";

type NextPrevProps = Readonly<{
  onPrev: () => void;
  onNext: () => void;
}>;

const NextPrev: FC<NextPrevProps> = props => (
  <>
    <button
      type="button"
      className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
      onClick={props.onPrev}
    >
      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full sm:w-10 sm:h-10 bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
        <ArrowLeftIcon className="w-5 h-5 text-white sm:w-6 sm:h-6 dark:text-gray-800" aria-hidden="true" />
        <span className="sr-only">Previous</span>
      </span>
    </button>
    <button
      type="button"
      className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
      onClick={props.onNext}
    >
      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full sm:w-10 sm:h-10 bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
        <ArrowRightIcon className="w-5 h-5 text-white sm:w-6 sm:h-6 dark:text-gray-800" aria-hidden="true" />
        <span className="sr-only">Next</span>
      </span>
    </button>
  </>
);

