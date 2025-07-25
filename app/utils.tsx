import { useEffect, useState } from "react";
import Image from "next/image"; // Importing the Image component from Next.js for optimized image rendering

export const ResponsiveImage = ({ images = [], alt = "Responsive banner" }: any) => {
	const [selectedImage, setSelectedImage] = useState<any>(null);

	const pickImage = (width: number) => {
		if (width <= 640) {
			return images.find((img: any) => img.dimension.width === 640);
		} else if (width <= 768) {
			return images.find((img: any) => img.dimension.width === 686);
		} else if (width <= 1024) {
			return images.find((img: any) => img.dimension.width === 1080);
		} else if (width <= 1440) {
			return images.find((img: any) => img.dimension.width === 1400);
		} else {
			return images.find((img: any) => img.dimension.width === 3130);
		}
	};

	useEffect(() => {
		if (!images.length) return;

		const handleResize = () => {
			const width = window.innerWidth;
			const img = pickImage(width);
			setSelectedImage((prev: any) => (prev?.uid !== img?.uid ? img : prev));
		};

		// Initial selection
		handleResize();

		// Attach listener
		window.addEventListener("resize", handleResize);

		// Cleanup on unmount
		return () => window.removeEventListener("resize", handleResize);
	}, [images]);

	if (!selectedImage) return null;

	return (
		<Image
			src={selectedImage.url}
			alt={alt}
			width={selectedImage.dimension.width}
			height={selectedImage.dimension.height}
			className="mb-4 w-full h-auto"
			priority
		/>
	);
};
