import { transformImageUrl } from "@kontent-ai/delivery-sdk";
import type { ImageLoader } from "next/image";

const loader: ImageLoader = (props) =>
  transformImageUrl(props.src)
    .withQuality(props.quality ?? 75)
    .withWidth(props.width)
    .withCompression("lossless")
    .withAutomaticFormat()
    .getUrl();

export default loader;
