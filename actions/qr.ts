"use server";
import { replicateClient } from "@/utils/ReplicateClient";
import { QrGenerateRequest, QrGenerateResponse } from "@/utils/service";
import { put } from "@vercel/blob";
import { nanoid } from "@/lib/utils";
import prisma from "@/lib/prisma";
import { QR } from "@prisma/client";

export async function Generate({
  url,
  prompt,
}: QrGenerateRequest): Promise<QrGenerateResponse> {
  const id = nanoid();
  const startTime = performance.now();

  let imageUrl = await replicateClient.generateQrCode({
    url,
    prompt,
    qr_conditioning_scale: 2,
    num_inference_steps: 30,
    guidance_scale: 5,
    negative_prompt:
      "Longbody, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, blurry",
  });

  const endTime = performance.now();
  const durationMS = endTime - startTime;

  // convert output to a blob object
  const file = await fetch(imageUrl).then((res) => res.blob());

  // upload & store in Vercel Blob
  const { url: blobUrl } = await put(`${id}.png`, file, { access: "public" });

  const qr = await prisma.qR.create({
    data: {
      prompt,
      image: blobUrl,
      website_url: url,
      model_latency: Math.round(durationMS),
    },
  });

  const response: QrGenerateResponse = {
    image_url: blobUrl,
    model_latency_ms: Math.round(durationMS),
    id: qr.id,
  };

  return response;
}

export async function GetQRById(id: string) {
  return await prisma.qR.update({
    where: { id },
    data: { visits: { increment: 1 } },
  });
}

export async function HeroImages(take: number): Promise<QR[]> {
  const data = await prisma.qR.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take
  });
  return data;
}
