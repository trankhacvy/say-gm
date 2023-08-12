"use client"

import cx from "classnames"
import { CameraIcon } from "lucide-react"
import React, { forwardRef, useEffect, useState } from "react"
import { useDropzone } from "react-dropzone"
import { cn } from "@/utils/cn"
import { Typography } from "./ui/typography"
import { AspectRatio } from "./ui/aspect-ratio"

export type UploaderFile = File & { preview?: string }

export interface AvatarUploaderProps {
  maxSize?: number
  accept?: Record<string, string[]>
  className?: string
  onChange: (file: UploaderFile | string | null) => void
  isDisabled?: boolean
  onExceedFileCount?: VoidFunction
  onExceedFileSize?: VoidFunction
  value?: UploaderFile | string
}

const DEFAULT_MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5MB

export const AvatarUploader = forwardRef<HTMLDivElement, AvatarUploaderProps>((props, ref) => {
  const {
    maxSize = DEFAULT_MAX_SIZE_BYTES,
    accept = { "image/*": [] },
    className,
    onChange,
    isDisabled: isDisabledProp = false,
    onExceedFileCount,
    onExceedFileSize,
    value,
    ...rest
  } = props
  const [file, setFile] = useState<UploaderFile | string | null>(value ?? null)

  const isDisabled = isDisabledProp

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    maxSize,
    accept,
    multiple: false,
    disabled: isDisabled,
    onDrop: (acceptedFiles: UploaderFile[], rejectedFiles) => {
      if (rejectedFiles.some((file) => file.file.size > maxSize)) {
        onExceedFileSize?.()
      }

      const uniqueFiles = acceptedFiles.filter((item) => {
        return ![file].find(
          (file) => typeof file !== "string" && file?.name === item.name && file.lastModified === item.lastModified
        )
      })

      const newFile = uniqueFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )[0]

      setFile(newFile)
      onChange(newFile)
    },
  })

  useEffect(() => {
    if (value) {
      setFile(value)
    }
  }, [value])

  return (
    <div className="flex w-full flex-col gap-5">
      <AspectRatio>
        <div
          {...getRootProps({
            ref,
            className: cx(
              "relative group overflow-hidden rounded-full cursor-pointer border border-gray-500/20 border-dashed p-2",
              className
            ),
            ...rest,
          })}
        >
          <input {...getInputProps({ disabled: isDisabled })} />

          <div className="relative h-full w-full overflow-hidden rounded-full">
            {file && (
              <div className="h-full w-full">
                <img
                  alt="preview"
                  src={typeof file === "string" ? file : file.preview}
                  className="h-auto w-full object-cover align-bottom"
                />
              </div>
            )}
            <div
              className={cn(
                "absolute inset-0 z-10 flex h-full w-full items-center justify-center rounded-full text-gray-600 group-hover:!opacity-70",
                file ? "bg-gray-900/60" : "bg-gray-900/8",
                {
                  "opacity-0": !!file,
                }
              )}
            >
              <CameraIcon />
            </div>
          </div>
        </div>
      </AspectRatio>
      <Typography color="secondary" className="text-center" level="body5">
        Allowed *.jpeg, *.jpg, *.png, *.gif max size of 3.1 MB
      </Typography>
    </div>
  )
})

AvatarUploader.displayName = "AvatarUploader"
