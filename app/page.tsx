"use client"; // This directive indicates that the code is meant to run on the client side and the server side

import DOMPurify from "dompurify";
import Image from "next/image"; // Importing the Image component from Next.js for optimized image rendering
import { getPage, initLivePreview } from "@/lib/contentstack"; // Importing functions to get page data and initialize live preview from a local library
import { useEffect, useState } from "react"; // Importing React hooks for side effects and state management
import { ResponsiveImage } from "./utils";
import ContentstackLivePreview, {
	VB_EmptyBlockParentClass,
} from "@contentstack/live-preview-utils"; // Importing live preview utilities from Contentstack
import { useSearchParams } from "next/navigation";

export default function Home() {
	const [page, setPage] = useState<any>();

	const getContent = async () => {
		const page = await getPage("/");
		setPage(page);
	};

	useEffect(() => {
		initLivePreview();
		ContentstackLivePreview.onEntryChange(getContent);
	}, []);


	return (
		<main className="max-w-(--breakpoint-md) mx-auto">
			<section className="p-4">
				{page?.title ? (
					<h1 className="text-4xl font-bold mb-4 text-center" {...(page?.$ && page?.$.title)}>
						{page?.title}
					</h1>
				) : null}
				{page?.description ? (
					<p className="mb-4 text-center" {...(page?.$ && page?.$.description)}>
						{page?.description}
					</p>
				) : null}
				{page?.image && page.image.length > 0 && (
					<div {...(page?.$ && page?.$.image)}>
						<ResponsiveImage images={page.image} alt="Banner for promo" />
					</div>
				)}

				{page?.rich_text ? (
					<div
						{...(page?.$ && page?.$.rich_text)}
						dangerouslySetInnerHTML={{
							__html: DOMPurify.sanitize(page?.rich_text),
						}}
					/>
				) : null}
				<div
					className={`space-y-8 max-w-full mt-4 ${
						!page?.blocks || page.blocks.length === 0 ? VB_EmptyBlockParentClass : ""
					}`}
					{...(page?.$ && page?.$.blocks)}
				>
					{page?.blocks?.map((item: any, index: any) => {
						const { block } = item;
						const isImageLeft = block.layout === "image_left";

						return (
							<div
								key={block._metadata.uid}
								{...(page?.$ && page?.$[`blocks__${index}`])}
								className={`flex flex-col md:flex-row items-center space-y-4 md:space-y-0 bg-white ${
									isImageLeft ? "md:flex-row" : "md:flex-row-reverse"
								}`}
							>
								<div className="w-full md:w-1/2">
									{block.image ? (
										<Image
											key={`image-${block._metadata.uid}`}
											src={block.image.url}
											alt={block.image.title}
											width={200}
											height={112}
											className="w-full"
											{...(block?.$ && block?.$.image)} // Adding editable tags if available
										/>
									) : null}
								</div>
								<div className="w-full md:w-1/2 p-4">
									{block.title ? (
										<h2
											className="text-2xl font-bold"
											{...(block?.$ && block?.$.title)} // Adding editable tags if available
										>
											{block.title} {/* Rendering the block title */}
										</h2>
									) : null}
									{block.copy ? (
										<div
											{...(block?.$ && block?.$.copy)} // Adding editable tags if available
											dangerouslySetInnerHTML={{
												__html: DOMPurify.sanitize(block.copy),
											}} // Rendering block copy as HTML
											className="prose"
										/>
									) : null}
								</div>
							</div>
						);
					})}
				</div>
				{page?.froala ? (
					<div
						className="fr-view"
						{...(page?.froala && page.$.froala)}
						dangerouslySetInnerHTML={{ __html: page.froala }}
					/>
				) : (
					""
				)}
			</section>
		</main>
	);
}
