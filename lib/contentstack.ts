import contentstack, { QueryOperation } from "@contentstack/delivery-sdk";
import ContentstackLivePreview, { IStackSdk } from "@contentstack/live-preview-utils";
import { Page } from "./types";
import {
	getContentstackEndpoints,
	getRegionForString,
} from "@timbenniks/contentstack-endpoints";
import axios from "axios";

const region = getRegionForString(process.env.NEXT_PUBLIC_CONTENTSTACK_REGION || "EU");
const endpoints = getContentstackEndpoints(region, true);

export const stack = contentstack.stack({
	apiKey: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY as string,
	deliveryToken: process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN as string,
	environment: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT as string,
	region: region,
	live_preview: {
		enable: process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW === "true",
		preview_token: process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW_TOKEN,
		host: endpoints.preview,
	},
});

export function initLivePreview() {
	ContentstackLivePreview.init({
		ssr: false,
		enable: process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW === "true",
		mode: "builder",
		stackSdk: stack.config as IStackSdk,
		stackDetails: {
			apiKey: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY as string, // Setting the API key from environment variables
			environment: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT as string, // Setting the environment from environment variables
		},
		clientUrlParams: {
			host: endpoints.application,
		},
		editButton: {
			enable: true, // Enabling the edit button for live preview
			exclude: ["outsideLivePreviewPortal"], // Excluding the edit button from the live preview portal
		},
	});
}
// Function to fetch page data based on the URL
export async function getPage(url: string) {
	const result = await stack
		.contentType("page")
		.entry()
		.query()
		.where("url", QueryOperation.EQUALS, url)
		.addParams({ include_dimension: "true" })
		.find<Page>();

	if (result.entries) {
		const entry = result.entries[0];
		if (process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW === "true") {
			contentstack.Utils.addEditableTags(entry, "page", true);
		}
		return entry;
	}
}

export async function getDataForTemplate(url: string) {
	const locales = await fetchLocales();
	let entries: any[] = [];

	if (locales && Array.isArray(locales)) {
		const allPromises = locales.map(async (locale) => {
			try {
				let result: any;
				let livePreviewData: any = stack.config.live_preview;
				if (livePreviewData.entry_uid) {
					result = await stack
						.contentType(livePreviewData.content_type_uid)
						.entry(livePreviewData.entry_uid)
						.locale(locale.code)
						.addParams({ include_dimension: "true" })
						.fetch();
				} 
				if (result.entries && result.entries?.length > 0) {
					return result?.entries[0]; // Return the first entry for the locale
				}
				return result;
			} catch (error) {
				console.warn(`Failed to fetch data for locale ${locale.code}:`, error);
				return undefined;
			}
		});

		const resolvedEntries = await Promise.all(allPromises);
		entries = resolvedEntries.filter(Boolean); // Remove undefined/null entries
	}
	return entries;
}

const fetchLocales = async (): Promise<any[]> => {
	try {
		const response = await axios.get("https://api.contentstack.io/v3/locales", {
			headers: {
				api_key: "blt7864fd3bf1ff3b8e",
				authorization: "cs62b99a370a1046c773b69db9",
				"Content-Type": "application/json",
			},
		});

		// Assuming response.data.locales is the array of locales
		return response.data.locales || [];
	} catch (error: any) {
		console.error("Failed to fetch locales:", error?.response?.data || error.message);
		return [];
	}
};
