"use server";

import { v2 as cloudinary } from "cloudinary";

cloudinary.config(process.env.CLOUDINARY_URL ?? "");

const extractPublicId = (url: string) => {
  try {
    const parts = url.split("/upload/")[1];
    if (!parts) return null;

    const withoutVersion = parts.replace(/^v\d+\//, "");
    const publicId = withoutVersion.replace(/\.[^/.]+$/, "");

    return publicId;
  } catch {
    return null;
  }
};

export const deleteProductImage = async (
  imageUrl: string
): Promise<{ ok: boolean; message?: string }> => {

  if (!imageUrl.startsWith("http")) {
    return { ok: false, message: "Invalid image URL" };
  }

  const publicId = extractPublicId(imageUrl);

  if (!publicId) {
    return { ok: false, message: "Could not extract public_id" };
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result !== "ok" && result.result !== "not found") {
      return { ok: false, message: "Cloudinary deletion failed" };
    }

    return { ok: true, message: "Image deleted successfully" };

  } catch (error) {
    console.error(error);
    return { ok: false, message: "Unexpected error deleting image" };
  }
};
