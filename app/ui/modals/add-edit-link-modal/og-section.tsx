import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { motion } from "framer-motion";
import TextareaAutosize from "react-textarea-autosize";
import { UploadCloud } from "@/components/shared/icons";
import { LoadingCircle } from "#/ui/icons";
import { LinkProps } from "#/lib/types";
import Switch from "#/ui/switch";
import { FADE_IN_ANIMATION_SETTINGS } from "#/lib/constants";
import { InfoTooltip } from "#/ui/tooltip";

export default function OGSection({
  props,
  data,
  setData,
  generatingMetatags,
}: {
  props?: LinkProps;
  data: LinkProps;
  setData: Dispatch<SetStateAction<LinkProps>>;
  generatingMetatags: boolean;
}) {
  const { title, description, image, proxy } = data;

  const [fileError, setFileError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const onChangePicture = useCallback(
    (e) => {
      setFileError(null);
      const file = e.target.files[0];
      if (file) {
        if (file.size / 1024 / 1024 > 5) {
          setFileError("File size too big (max 5MB)");
        } else if (file.type !== "image/png" && file.type !== "image/jpeg") {
          setFileError("File type not supported (.png or .jpg only)");
        } else {
          const reader = new FileReader();
          reader.onload = (e) => {
            setData((prev) => ({ ...prev, image: e.target?.result as string }));
          };
          reader.readAsDataURL(file);
        }
      }
    },
    [setData],
  );

  useEffect(() => {
    if (proxy && props) {
      // if custom OG is enabled
      setData((prev) => ({
        ...prev,
        title: props.title || title,
        description: props.description || description,
        image: props.image || image,
      }));
    }
  }, [proxy]);

  const randomIdx = Math.floor(Math.random() * 100);

  return (
    <div className="grid gap-5 border-b border-gray-200 pb-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-between space-x-2">
          <h2 className="text-sm font-medium text-gray-900">
            Custom Social Media Cards
          </h2>
          <InfoTooltip content="Customize the title, description, and thumbnail image that will be shown when you share this link on social media." />
        </div>
        <Switch
          fn={() => setData((prev) => ({ ...prev, proxy: !proxy }))}
          checked={proxy}
        />
      </div>

      {proxy && (
        <motion.div
          key="og-options"
          {...FADE_IN_ANIMATION_SETTINGS}
          className="grid gap-5"
        >
          <div>
            <div className="flex items-center justify-between">
              <p className="block text-sm font-medium text-gray-700">Image</p>
              {fileError && <p className="text-sm text-red-500">{fileError}</p>}
            </div>
            <label
              htmlFor={`image-${randomIdx}`}
              className="group relative mt-1 flex h-[14rem] cursor-pointer flex-col items-center justify-center rounded-md border border-gray-300 bg-white shadow-sm transition-all hover:bg-gray-50"
            >
              {generatingMetatags && (
                <div className="absolute z-[5] flex h-full w-full items-center justify-center rounded-md bg-white">
                  <LoadingCircle />
                </div>
              )}
              <div
                className="absolute z-[5] h-full w-full rounded-md"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDragActive(true);
                }}
                onDragEnter={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDragActive(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDragActive(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDragActive(false);
                  setFileError(null);
                  const file = e.dataTransfer.files && e.dataTransfer.files[0];
                  if (file) {
                    if (file.size / 1024 / 1024 > 5) {
                      setFileError("File size too big (max 5MB)");
                    } else if (
                      file.type !== "image/png" &&
                      file.type !== "image/jpeg"
                    ) {
                      setFileError(
                        "File type not supported (.png or .jpg only)",
                      );
                    } else {
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        setData((prev) => ({
                          ...prev,
                          image: e.target?.result as string,
                        }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }
                }}
              />
              <div
                className={`${
                  dragActive
                    ? "cursor-copy border-2 border-black bg-gray-50 opacity-100"
                    : ""
                } absolute z-[3] flex h-full w-full flex-col items-center justify-center rounded-md bg-white transition-all ${
                  image
                    ? "opacity-0 group-hover:opacity-100"
                    : "group-hover:bg-gray-50"
                }`}
              >
                <UploadCloud
                  className={`${
                    dragActive ? "scale-110" : "scale-100"
                  } h-7 w-7 text-gray-500 transition-all duration-75 group-hover:scale-110 group-active:scale-95`}
                />
                <p className="mt-2 text-center text-sm text-gray-500">
                  Drag and drop or click to upload.
                </p>
                <p className="mt-2 text-center text-sm text-gray-500">
                  Recommended: 1200 x 627 pixels
                </p>
                <span className="sr-only">OG image upload</span>
              </div>
              {image && (
                <img
                  src={image}
                  alt="Preview"
                  className="h-full w-full rounded-md object-cover"
                />
              )}
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                id={`image-${randomIdx}`}
                name="image"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={onChangePicture}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <p className="block text-sm font-medium text-gray-700">Title</p>
              <p className="text-sm text-gray-500">{title?.length || 0}/120</p>
            </div>
            <div className="relative mt-1 flex rounded-md shadow-sm">
              {generatingMetatags && (
                <div className="absolute flex h-full w-full items-center justify-center rounded-md border border-gray-300 bg-white">
                  <LoadingCircle />
                </div>
              )}
              <TextareaAutosize
                name="title"
                id={`title-${randomIdx}`}
                minRows={3}
                maxLength={120}
                className="block w-full rounded-md border-gray-300 pr-10 text-gray-900 placeholder-gray-300 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
                placeholder="Dub - Open Source Bitly Alternative"
                value={title || ""}
                onChange={(e) => {
                  setData({ ...data, title: e.target.value });
                }}
                aria-invalid="true"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <p className="block text-sm font-medium text-gray-700">
                Description
              </p>
              <p className="text-sm text-gray-500">
                {description?.length || 0}/240
              </p>
            </div>
            <div className="relative mt-1 flex rounded-md shadow-sm">
              {generatingMetatags && (
                <div className="absolute flex h-full w-full items-center justify-center rounded-md border border-gray-300 bg-white">
                  <LoadingCircle />
                </div>
              )}
              <TextareaAutosize
                name="description"
                id={`description-${randomIdx}`}
                minRows={3}
                maxLength={240}
                className="block w-full rounded-md border-gray-300 pr-10 text-gray-900 placeholder-gray-300 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
                placeholder="Dub is open-source link management tool for modern marketing teams to create, share, and track short links."
                value={description || ""}
                onChange={(e) => {
                  setData({
                    ...data,
                    description: e.target.value,
                  });
                }}
                aria-invalid="true"
              />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
