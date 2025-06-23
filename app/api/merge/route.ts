import { NextRequest, NextResponse } from "next/server";
import PDFMerger from "pdf-merger-js";

// Ensure this route uses the default Node.js runtime (no Edge export)
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files");

    if (!files || files.length < 2) {
      return NextResponse.json({ error: "At least two PDF files required." }, { status: 400 });
    }

    const merger = new PDFMerger();

    for (const file of files) {
      if (typeof file === "string") {
        throw new Error("Received a string instead of a File/Blob. PDF upload failed.");
      }
      const arrayBuffer = await (file as Blob).arrayBuffer();
      // pdf-merger-js expects a Buffer
      await merger.add(Buffer.from(arrayBuffer));
    }

    const mergedPdfBuffer = await merger.saveAsBuffer();

    return new NextResponse(mergedPdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=merged.pdf",
      },
    });
  } catch (e) {
    console.error("PDF Merge Error:", e);
    return NextResponse.json({ error: "Failed to merge PDFs." }, { status: 500 });
  }
}
