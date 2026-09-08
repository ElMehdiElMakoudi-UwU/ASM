import Image from "next/image";
import { Placeholder } from "@/components/placeholder";

type FrameProps = {
  /** Path under /public once real photography exists. Null renders the study. */
  src: string | null;
  alt: string;
  /** Keeps the stand-in artwork stable across renders. */
  seed: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
};

/** An image well. Renders real photography when it exists, a study when it does not. */
export function Frame({
  src,
  alt,
  seed,
  className = "",
  imageClassName = "",
  sizes = "100vw",
  priority = false,
}: FrameProps) {
  return (
    <div className={`relative overflow-hidden bg-paper-dim ${className}`}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={`object-cover ${imageClassName}`}
        />
      ) : (
        <Placeholder
          seed={seed}
          className={`absolute inset-0 h-full w-full ${imageClassName}`}
        />
      )}
    </div>
  );
}
