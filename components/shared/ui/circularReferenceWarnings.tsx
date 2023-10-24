import React, { FC, useState } from "react";

import {
  CircularReferenceInfo,
  ItemCircularReferenceMap,
} from "../../../lib/utils/circularityUtils";

type Props = Readonly<{
  itemCircularReferences: ItemCircularReferenceMap;
}>;

type WarningProps = Readonly<{
  parentCodename: string;
  circularReferences: CircularReferenceInfo[];
}>;

export const CircularReferenceWarnings: FC<Props> = (props) => {
  return (
    <div className="fixed w-1/2 z-50 m-5">
      {Object.entries(props.itemCircularReferences).map(
        ([parent, circularReferences], index) => (
          <Warning
            key={index}
            parentCodename={parent}
            circularReferences={circularReferences}
          />
        )
      )}
    </div>
  );
};

const Warning: FC<WarningProps> = (props) => {
  const [show, setShow] = useState(true);

  return show ? (
    <div className="invisible md:visible relative justify-center justify-self-center text-white rounded-lg mb-2 p-3 bg-gradient-to-r from-rose-950 to-rose-800">
      <button
        className="absolute text-2xl right-3 top-0"
        onClick={() => {
          setShow(false);
        }}
      >
        ×
      </button>
      <div className="pb-3">Warning: Circular Reference Detected</div>
      <div className="text-xs">
        <div className="mb-1">Found in item:</div>
        <code>{props.parentCodename}</code>
        <div className="my-2">Removed reference from element(s):</div>
        {props.circularReferences.map((reference, index) => (
          <details key={index}>
            <summary className="cursor-pointer">
              <code>{reference.elementName}</code> [show cycle]
            </summary>
            <span>
              <code>{reference.cycle.join(" → ")}</code>
            </span>
          </details>
        ))}
        <div className="mt-1">
          Detected circular references have been automatically removed to ensure
          application stability. Some UI elements may behave unexpectedly as a
          result. Consider reviewing the content structure or adjusting the
          depth parameter to circumvent these references.
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};
