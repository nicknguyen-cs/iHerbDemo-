"use client";

import DOMPurify from "dompurify";
import Image from "next/image";
import { getDataForTemplate, initLivePreview } from "@/lib/contentstack";
import { useEffect, useState } from "react";
import ContentstackLivePreview from "@contentstack/live-preview-utils";

export default function Home() {
	const [page, setPage] = useState<any[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	// Fetch data function with debug logging
	const getContent = async () => {
		try {
			const data = await getDataForTemplate("/template");
			setPage(data || []);
		} catch (err) {
			console.error("Error loading banners:", err);
		} finally {
			setLoading(false);
		}
	};

	// Initial fetch + initialize live preview
	useEffect(() => {
		getContent();
		initLivePreview();
		ContentstackLivePreview.onEntryChange(getContent);
	}, []);

	const ResponsiveImage = ({ images = [], alt = "", locale }: any) => {
		const [selected, setSelected] = useState<any>(null);

		useEffect(() => {
			if (!images.length) return;
			const pick = (width: number) => {
				if (width <= 640) return images.find((img: any) => img.dimension.width === 640);
				if (width <= 768) return images.find((img: any) => img.dimension.width === 686);
				if (width <= 1024) return images.find((img: any) => img.dimension.width === 1080);
				if (width <= 1440) return images.find((img: any) => img.dimension.width === 1400);
				return images.find((img: any) => img.dimension.width === 3130);
			};

			const resize = () => {
				const img = pick(window.innerWidth);
				setSelected((prev: any) => (prev?.uid !== img?.uid ? img : prev));
			};

			resize();
			window.addEventListener("resize", resize);
			return () => window.removeEventListener("resize", resize);
		}, [images]);

		if (!selected) return null;
		return (
			<div>
				<span>{locale} - {selected.dimension.width} x {selected.dimension.height} </span>
				<Image
					src={selected.url}
					alt={alt}
					width={selected.dimension.width}
					height={selected.dimension.height}
					className="w-full h-auto mb-4"
					priority
				/>{" "}
				
			</div>
		);
	};

	return (
		<main className="max-w-(--breakpoint-md) mx-auto p-4">
			{loading && <p>Loading banners...</p>}
			{!loading && page.length === 0 && <p>No banners found.</p>}
			<section>
				{page.map((entry: any, i: number) => (
					<ResponsiveImage
						key={i}
						images={entry.image || []}
						locale={entry.locale}
						alt={`Banner ${i + 1}`}
					/>
				))}
			</section>
		</main>
	);
}
