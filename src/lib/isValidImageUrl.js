import { toast } from "sonner";

const isValidImageUrl = async (url) => {
  // URL validation regex
  const urlPattern = /^(https?:\/\/[^\s/$.?#].[^\s]*)$/i;

  if (!urlPattern.test(url)) {
    toast.error("Invalid URL or image format!");
    return false;
  }

  try {
    const response = await fetch(url, { method: "HEAD" });

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.startsWith("image/")) {
      toast.error("URL is not a valid image!");
      return false;
    }

    return true;
  } catch (error) {
    toast.error("Failed to fetch image!");
    return false;
  }
};

export default isValidImageUrl;
