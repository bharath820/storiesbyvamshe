import { useEffect, useMemo, useState } from "react";
import { resolveAssetUrl } from "../../lib/assetUrlService";

export function ResolvedImage({ src, alt, className, loading = "lazy", fallbackSrc = "" }) {
  const sources = useMemo(() => [src, fallbackSrc].filter(Boolean), [src, fallbackSrc]);
  const [sourceIndex, setSourceIndex] = useState(0);
  const [resolvedSrc, setResolvedSrc] = useState("");
  const activeSrc = sources[sourceIndex] || "";

  useEffect(() => {
    setSourceIndex(0);
  }, [src, fallbackSrc]);

  useEffect(() => {
    let isActive = true;

    async function loadResolved() {
      if (!activeSrc) {
        setResolvedSrc("");
        return;
      }

      try {
        const nextSrc = await resolveAssetUrl(activeSrc);
        if (!isActive) {
          return;
        }

        if (!nextSrc && sources[sourceIndex + 1]) {
          setSourceIndex((currentIndex) => currentIndex + 1);
          return;
        }

        setResolvedSrc((prev) => {
          return nextSrc || "";
        });
      } catch {
        if (!isActive) return;
        if (sources[sourceIndex + 1]) {
          setSourceIndex((currentIndex) => currentIndex + 1);
        } else {
          setResolvedSrc("");
        }
      }
    }

    loadResolved();

    return () => {
      isActive = false;
    };
  }, [activeSrc, sourceIndex, sources]);

  if (!resolvedSrc) return null;

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      className={className}
      loading={loading}
      onError={() => {
        if (sources[sourceIndex + 1]) {
          setSourceIndex((currentIndex) => currentIndex + 1);
        } else {
          setResolvedSrc("");
        }
      }}
    />
  );
}

