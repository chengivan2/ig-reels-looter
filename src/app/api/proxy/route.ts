import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url) {
        return new NextResponse("Missing URL parameters", { status: 400 });
    }

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch media from upstream: ${response.status}`);
        }

        // Pass along necessary headers and force the download with Content-Disposition
        const headers = new Headers();
        headers.set("Content-Type", response.headers.get("Content-Type") || "video/mp4");
        headers.set("Content-Disposition", 'attachment; filename="ig-reel.mp4"');

        // We can also pass along the content length if available
        const contentLength = response.headers.get("Content-Length");
        if (contentLength) {
            headers.set("Content-Length", contentLength);
        }

        return new NextResponse(response.body, {
            status: 200,
            headers,
        });
    } catch (error) {
        console.error("Download proxy error:", error);
        return new NextResponse("Error proxying download", { status: 500 });
    }
}
