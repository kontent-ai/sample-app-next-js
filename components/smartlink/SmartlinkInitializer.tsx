'use client'
import { FC } from "react";
import { useSmartLink } from "../../lib/useSmartLink";

const SmartlinkInitializer: FC = () => {
  useSmartLink();

  return null;
}

export default SmartlinkInitializer;