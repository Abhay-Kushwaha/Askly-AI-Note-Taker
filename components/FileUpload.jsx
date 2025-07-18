"use client";
import { useMutation } from "@tanstack/react-query";
import { Inbox, Loader2 } from "lucide-react";
import React from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const uploadFileToS3 = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload-to-s3", {
        method: "POST",
        body: formData,
    });

    if (!response.ok) throw new Error("Upload failed");
    return await response.json();
};

const FileUpload = () => {
    const router = useRouter();
    const [uploading, setUploading] = React.useState(false);
    const { mutate, isLoading } = useMutation({
        mutationFn: async ({ file_key, file_name }) => {
            const response = await axios.post("/api/create-chat", {
                file_key,
                file_name,
            });
            return response.data;
        },
    });

    const { getRootProps, getInputProps } = useDropzone({
        accept: { "application/pdf": [".pdf"] },
        maxFiles: 1,
        onDrop: async (acceptedFiles) => {
            const file = acceptedFiles[0];
            if (file.size > 10 * 1024 * 1024) {
                // bigger than 10mb!
                toast.error("File too large");
                return;
            }

            try {
                setUploading(true);
                const data = await uploadFileToS3(file);
                console.log("Testing:", data);
                if (!data?.file_key || !data.file_name) {
                    toast.error("Something went wrong");
                    return;
                }
                mutate(data, {
                    onSuccess: ({ chat_id }) => {
                        toast.success("Chat created!");
                        router.push(`/dashboard/${chat_id}`);
                    },
                    onError: (err) => {
                        toast.error("Error creating chat");
                        console.error(err);
                    },
                });
            } catch (error) {
                console.log(error);
            } finally {
                setUploading(false);
            }
        },
    });
    return (
        <div className="p-2 bg-white rounded-xl">
            <div
                {...getRootProps({
                    className:
                        "border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-4 flex justify-center items-center flex-col",
                })}
            >
                <input {...getInputProps()} />
                {uploading || isLoading ? (
                    <>
                        {/* loading state */}
                        <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
                        <p className="mt-2 text-sm text-slate-400">
                            Serving Chai to GPT...
                        </p>
                    </>
                ) : (
                    <>
                        <Inbox className="w-10 h-6 text-blue-500" />
                        <p className="mt-2 text-sm text-slate-400">Drop PDF Here</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default FileUpload;