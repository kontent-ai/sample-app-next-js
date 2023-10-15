import React, { FC, useState } from "react";
import { CircularReferenceInfo } from "../../../lib/utils/circularityUtils";

type Props = Readonly<{
  circularReferences: Record<string, CircularReferenceInfo[]>;
}>;

type WarningProps = Readonly<{
  parentCodename: string;
  cyclesPerElement: CircularReferenceInfo[];
}>;

export const CircularReferenceWarnings: FC<Props> = (props) => {
  return (
    <div className="fixed w-1/2 z-50 m-5">
      {Object.entries(props.circularReferences).map(([parent, circularReferences], index) => (
        <Warning
          key={index}
          parentCodename={parent}
          cyclesPerElement={circularReferences}
        />
      ))}
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
        <div className="mb-1">
          item codename:
        </div>
        <code>{props.parentCodename}</code>
        <div className="my-2">
          element name(s):
        </div>
        {props.cyclesPerElement.map((reference, index) => (
          <details key={index}>
            <summary className="cursor-pointer"><code>{reference.elementName}</code> [show cycle]</summary>
            <span><code>{reference.cycle}</code></span>
          </details>
        ))}
        <div className="mt-1">
          Identified cycles have been automatically resolved to prevent the
          application from crashing. Some UI elements may not work as expected. Please review the content structure or modify the depth
          parameter to avoid the reference.
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};
