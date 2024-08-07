import { notFound } from "next/navigation";
import { Metadata } from "next";
import Body from "@/components/Body";
import { GetQRById } from "@/actions/qr";

export async function generateMetadata({
  params,
}: {
  params: {
    id: string;
  };
}): Promise<Metadata | undefined> {
  const data = await GetQRById(params.id);
  if (!data) {
    return;
  }

  const title = `QrGPT: ${data.prompt}`;
  const description = `A QR code generated from qrGPT.io linking to: ${data.website_url}`;

  return {
    title,
    description,
  };
}

export default async function Results({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const data = await GetQRById(params.id);
  if (!data) {
    notFound();
  }
  return (
    <Body
      prompt={data.prompt}
      imageUrl={data.image}
      redirectUrl={data.website_url}
      modelLatency={Number(data.model_latency)}
      id={params.id}
      visits={data.visits}
    />
  );
}
