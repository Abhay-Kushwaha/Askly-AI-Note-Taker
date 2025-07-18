import { S3 } from "@aws-sdk/client-s3";
import os from "os";
import fs from "fs";
import path from "path";

const tmpDir = os.tmpdir();
const file_name = path.join(tmpDir, `pdf-${Date.now().toString()}.pdf`);

export async function downloadFromS3(file_key) {
    return new Promise(async (resolve, reject) => {
        try {
            const s3 = new S3({
                region: "eu-north-1",
                credentials: {
                    accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
                    secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY,
                },
            });
            const params = {
                Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
                Key: file_key,
            };

            const obj = await s3.getObject(params);

            if (obj.Body instanceof require("stream").Readable) {
                // AWS-SDK v3 has some issues with their typescript definitions, but this works
                // https://github.com/aws/aws-sdk-js-v3/issues/843
                //open the writable stream and write the file
                const file = fs.createWriteStream(file_name);
                file.on("open", function (fd) {
                    // @ts-ignore
                    obj.Body?.pipe(file).on("finish", () => {
                        return resolve(file_name);
                    });
                });
                obj.Body?.pipe(fs.createWriteStream(file_name));
            }
        } catch (error) {
            console.error(error);
            reject(error);
            return null;
        }
    });
}

export async function uploadToS3(file) {
    try {
        const s3 = new S3({
            region: "eu-north-1",
            credentials: {
                accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
                secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY,
            },
        });

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        await s3.putObject({
            Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
            Key: file.name,
            Body: buffer,
            ContentType: file.type,
        });
    } catch (error) {
        console.error("Error uploading file: ", error);
    }
}

// downloadFromS3("uploads/1693568801787chongzhisheng_resume.pdf");