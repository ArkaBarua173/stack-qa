declare module "react-image-crop" {
  import React from "react";

  interface Crop {
    unit?: "%" | "px";
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    aspect?: number;
  }

  interface ReactCropProps {
    src: string;
    crop?: Crop;
    onImageLoaded?: (image: HTMLImageElement) => void;
    onChange?: (crop: Crop, pixelCrop: Crop) => void;
    onDragStart?: () => void;
    onDragEnd?: () => void;
    crossorigin?: "anonymous" | "use-credentials" | "";
    disabled?: boolean;
    locked?: boolean;
    style?: React.CSSProperties;
    imageStyle?: React.CSSProperties;
    className?: string;
    imageClassName?: string;
    keepSelection?: boolean;
    minWidth?: number;
    minHeight?: number;
    maxWidth?: number;
    maxHeight?: number;
    ruleOfThirds?: boolean;
    circularCrop?: boolean;
    crossoriginanonymous?: boolean;
  }

  const ReactCrop: React.FC<ReactCropProps>;

  export default ReactCrop;
}
