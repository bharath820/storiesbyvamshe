import { useEffect, useState } from "react";
import { resolveAssetUrl } from "../../lib/assetUrlService";

export function ResolvedImage({ src, alt, className, loading = "lazy" }) {
  const [resolvedSrc, setResolvedSrc] = useState("");

  useEffect(() => {
    let isActive = true;
    let objectUrlToRevoke = "";

    async function loadResolved() {
      if (!src) {
        setResolvedSrc("");
        return;
      }

      try {
        const nextSrc = await resolveAssetUrl(src);
        if (!isActive) {
          if (nextSrc && nextSrc.startsWith("blob:")) {
            window.URL.revokeObjectURL(nextSrc);
          }
          return;
        }

        setResolvedSrc((prev) => {
          if (prev && prev.startsWith("blob:")) {
            window.URL.revokeObjectURL(prev);
          }
          return nextSrc || "";
        });

        if (nextSrc && nextSrc.startsWith("blob:")) {
          objectUrlToRevoke = nextSrc;
        }
      } catch {
        if (isActive) setResolvedSrc("");
      }
    }

    loadResolved();

    return () => {
      isActive = false;
      if (objectUrlToRevoke) {
        window.URL.revokeObjectURL(objectUrlToRevoke);
      }
    };
  }, [src]);

  if (!resolvedSrc) return null;

  return <img src={resolvedSrc} alt={alt} className={className} loading={loading} />;
}

