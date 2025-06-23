import { NextRequest, NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";

// Ensure this route uses the default Node.js runtime (no Edge export)

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length < 2) {
      return NextResponse.json({ error: "At least two PDF files required." }, { status: 400 });
    }

    const mergedPdf = await PDFDocument.create();

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedBytes = await mergedPdf.save();

    // Use Buffer only in Node.js runtime
    return new NextResponse(Buffer.from(mergedBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=merged.pdf",
      },
    });
  } catch (e) {
    // Add error logging for debugging
    console.error("PDF Merge Error:", e);
    return NextResponse.json({ error: "Failed to merge PDFs." }, { status: 500 });
  }
}
