"use client";
import type { FC } from "react";
import { useSmartLink } from "../../lib/useSmartLink.ts";

const SmartlinkInitializer: FC = () => {
  useSmartLink();

  return null;
};

export default SmartlinkInitializer;
