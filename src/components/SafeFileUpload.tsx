import * as React from "react";
import { Camera, Clapperboard } from "lucide-react";

interface SafeFileUploadProps {
  onFileSelect: (url: string, file?: File) => void;
  accept: string;
  mediaType: "image" | "video";
  className?: string;
  children?: React.ReactNode;
}

export function SafeFileUpload({
  onFileSelect,
  accept,
  mediaType,
  className = "",
  children
}: SafeFileUploadProps) {
  const [blobUrl, setBlobUrl] = React.useState<string>("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    // Revoke previous blob URL to prevent memory leaks
    if (blobUrl) {
      URL.revokeObjectURL(blobUrl);
      setBlobUrl("");
    }

    if (file && file.size > 0) {
      try {
        const newBlobUrl = URL.createObjectURL(file);
        setBlobUrl(newBlobUrl);
        onFileSelect(newBlobUrl, file);
      } catch (error) {
        console.error("Failed to create blob URL:", error);
      }
    }
  }, [blobUrl, onFileSelect]);

  // We rely on handleFileChange to revoke old URLs when a new one is picked. 
  // We avoid revoking on unmount because the parent state might still need 
  // the blob URL (e.g., when switching tabs in a Dialog). 
  // Browsers will clean up remaining blobs when the page session ends.

  return (
    <label className={`cursor-pointer ${className}`}>
      {children || (
        <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg bg-muted/50 hover:bg-muted transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {mediaType === "video" ? (
              <Clapperboard className="w-8 h-8 mb-2 text-muted-foreground" />
            ) : (
              <Camera className="w-8 h-8 mb-2 text-muted-foreground" />
            )}
            <p className="mb-2 text-sm text-muted-foreground">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-muted-foreground">
              {mediaType === "video" ? "MP4, MOV, AVI" : "PNG, JPG, GIF"}
            </p>
          </div>
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept={accept}
        onChange={handleFileChange}
      />
    </label>
  );
}

interface SafeMediaPreviewProps {
  url: string;
  type: "image" | "video";
  alt?: string;
  className?: string;
}

export function SafeMediaPreview({ url, type, alt = "", className = "" }: SafeMediaPreviewProps) {
  const [isValid, setIsValid] = React.useState(false);

  React.useEffect(() => {
    if (!url) {
      setIsValid(false);
      return;
    }

    // For blob URLs, they're always valid if they exist
    if (url.startsWith("blob:")) {
      setIsValid(true);
    } else {
      // For regular URLs, assume valid
      setIsValid(true);
    }
  }, [url]);

  if (!url || !isValid) {
    return (
      <div className={`bg-muted text-muted-foreground flex items-center justify-center rounded-md border ${className}`}>
        <div className="flex items-center gap-2 text-xs">
          <Camera className="size-4" />
          {type === "video" ? "Video unavailable" : "Image unavailable"}
        </div>
      </div>
    );
  }

  if (type === "video") {
    return (
      <video
        className={`h-full w-full object-cover ${className}`}
        src={url}
        controls
        muted
        playsInline
        preload="metadata"
        onError={() => setIsValid(false)}
      />
    );
  }

  return (
    <img
      src={url}
      alt={alt}
      className={`h-full w-full object-cover ${className}`}
      loading="lazy"
      onError={() => setIsValid(false)}
    />
  );
}