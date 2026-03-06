import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { url } = await request.json();

        if (!url) {
            return NextResponse.json(
                { error: "URL is required" },
                { status: 400 }
            );
        }

        const apifyToken = process.env.APIFY_API_TOKEN;
        if (!apifyToken) {
            return NextResponse.json(
                { error: "Server configuration error: Missing APIFY_API_TOKEN" },
                { status: 500 }
            );
        }

        // Call Apify actor to run synchronously and get dataset items
        // Apify endpoint for synchronous run & fetch dataset
        const apifyUrl = `https://api.apify.com/v2/acts/xMc5Ga1oCONPmWJIa/run-sync-get-dataset-items?token=${apifyToken}`;

        const apifyResponse = await fetch(apifyUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: [url],
            }),
        });

        if (!apifyResponse.ok) {
            const errorText = await apifyResponse.text();
            console.error("Apify error:", errorText);
            return NextResponse.json(
                { error: "Failed to fetch from Apify actor" },
                { status: apifyResponse.status }
            );
        }

        const items = await apifyResponse.json();

        if (!items || items.length === 0) {
            return NextResponse.json(
                { error: "No data returned from scraper" },
                { status: 404 }
            );
        }

        // The actor usually returns videoUrl in its dataset for IG reels
        // We'll extract that.
        const item = items[0];
        const videoUrl = item.videoUrl;

        if (!videoUrl) {
            console.error("Scraped item data:", item);
            return NextResponse.json(
                { error: "Could not find video URL in the reel data" },
                { status: 404 }
            );
        }

        return NextResponse.json({ videoUrl });
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json(
            { error: "An unexpected error occurred" },
            { status: 500 }
        );
    }
}
