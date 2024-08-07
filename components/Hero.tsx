"use client";

import Image from "next/image";
import NavLink from "./NavLink";
import { useEffect, useState } from "react";
import { HeroImages } from "@/actions/qr";
import { Skeleton } from "./ui/skeleton";
import Link from "next/link";

export default function HeroSection() {
  const [heroImageList, setHeroImageList] = useState<
    { id: string; imageUrl: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHeroImages();
  }, []);

  const loadHeroImages = async () => {
    try {
      const imagesData = await HeroImages(9);
      const formattedImages = imagesData.map((imageData) => ({
        id: imageData.id,
        imageUrl: imageData.image,
      }));
      setHeroImageList(formattedImages);
    } catch (error) {
      console.error("Failed to load hero images:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="custom-screen py-28">
        <div className="space-y-5 max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold mx-auto sm:text-6xl text-muted-foreground">
            Generate your next AI QR Code in seconds
          </h1>
          <p className="max-w-xl mx-auto">
            QRGPT makes it simple for you to generate cool looking AI QR codes
            in seconds, completely for free.
          </p>
          <div className="flex items-center justify-center gap-x-3 font-medium text-sm">
            <NavLink
              href="/start"
              className="text-white bg-primary hover:bg-gray-600 active:bg-gray-900"
            >
              Generate your QR Code
            </NavLink>
          </div>
          <div className="grid sm:grid-cols-3 grid-cols-2 gap-4 pt-10">
            {loading
              ? Array(9)
                  .fill(null)
                  .map((_, index) => (
                    <Skeleton key={index} className="h-[360px] w-[360px]" />
                  ))
              : heroImageList.map((heroImage) => (
                  <Link key={heroImage.id} href={`/start/${heroImage.id}`}>
                    <Image
                      alt="Hero image"
                      src={heroImage.imageUrl}
                      width={360}
                      height={360}
                      className="rounded-lg"
                    />
                  </Link>
                ))}
          </div>
        </div>
      </div>
    </section>
  );
}
