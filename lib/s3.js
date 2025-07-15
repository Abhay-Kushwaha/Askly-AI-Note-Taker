import { S3 } from "@aws-sdk/client-s3";

export async function uploadToS3(file) {
    return new Promise(async (resolve, reject) => {
        try {
            const s3 = new S3({
                region: "eu-north-1",
                credentials: {
                    accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
                    secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY,
                },
            });

            const file_key =
                "uploads/" + Date.now().toString() + file.name.replace(" ", "-");

            const params = {
                Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
                Key: file_key,
                Body: file,
            };
            await s3.putObject(params);
            resolve({
                file_key,
                file_name: file.name,
            });
        } catch (error) {
            reject(error);
        }
    });
}

export function getS3Url(file_key) {
    const url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.eu-north-1.amazonaws.com/${file_key}`;
    return url;
}