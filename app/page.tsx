"use client";

import React, { useRef, useState } from "react";
import { FaFilePdf, FaPlus, FaTrash, FaCloudUploadAlt } from "react-icons/fa";

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [merged, setMerged] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Set a KB limit for merging (e.g., 10 MB = 10240 KB)
  const MAX_TOTAL_SIZE_KB = 10240;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files).filter(
      (file) => file.type === "application/pdf"
    );
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMerge = async () => {
    if (files.length < 2) return;
    setLoading(true);
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    const res = await fetch("/api/merge", {
      method: "POST",
      body: formData,
    });

    setLoading(false);

    if (res.ok) {
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);
      setMerged(true);
    } else {
      alert("Failed to merge PDFs.");
    }
  };

  const handleDownload = () => {
    if (downloadUrl) {
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = "merged.pdf";
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(null);
      setMerged(false);
    }
  };

  const handleDeleteAll = () => {
    setFiles([]);
    setMerged(false);
    if (downloadUrl) {
      window.URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(null);
    }
  };

  // Calculate total size in KB and MB
  const totalSizeKB = files.reduce((sum, file) => sum + file.size, 0) / 1024;
  const totalSizeMB = totalSizeKB / 1024;
  const maxTotalSizeMB = MAX_TOTAL_SIZE_KB / 1024;
  const overLimit = totalSizeKB > MAX_TOTAL_SIZE_KB;

  return (
    <main className="min-h-screen" style={{ background: 'none' }}>
      {/* Hero Section */}
      <section className="container py-16 md:py-24 animate-fade-in">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <div className="inline-block p-2 px-3 mb-4 rounded-full bg-primary/10 text-primary border border-primary/20">
            <span className="text-sm font-medium">Simple & Fast PDF Tools</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-text mb-6 tracking-tight">
            Merge PDF Files Effortlessly
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Combine multiple PDF files into one document in seconds. No registration required, 
            completely free, and your files stay private.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button 
              onClick={() => inputRef.current?.click()} 
              className="action-button animate-slide-up"
            >
              <FaPlus className="mr-2" /> Select PDF Files
            </button>
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section className="container max-w-3xl mx-auto mb-16">
        <label
          className={`drag-zone flex flex-col items-center justify-center animate-fade-in cursor-pointer`}
          onDrop={(e) => {
            e.preventDefault();
            const droppedFiles = Array.from(e.dataTransfer.files).filter(
              (file) => file.type === "application/pdf"
            );
            setFiles((prev) => [...prev, ...droppedFiles]);
          }}
          onDragOver={(e) => e.preventDefault()}
          htmlFor="pdf-upload-input"
          tabIndex={0}
          style={{ width: '100%' }}
        >
          <div className="p-4 rounded-full bg-primary/10 mb-4">
            <FaCloudUploadAlt className="text-4xl md:text-5xl text-primary" />
          </div>
          <h3 className="text-xl md:text-2xl font-bold mb-2">
            Drag & Drop PDF Files Here
          </h3>
          <p className="text-muted-foreground mb-4">
            or tap to browse your files
          </p>
          <input
            ref={inputRef}
            id="pdf-upload-input"
            type="file"
            accept="application/pdf"
            multiple
            className="hidden"
            onChange={handleFileChange}
            tabIndex={-1}
          />
        </label>

        {/* File List */}
        {files.length > 0 && (
          <div className="mt-8 bg-card border border-border/50 rounded-xl shadow-sm p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FaFilePdf className="text-primary" /> Selected Files
              </h2>
              <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full">
                {files.length} {files.length === 1 ? 'file' : 'files'}
              </span>
            </div>
            
            <div className="file-list">
              <ul>
                {files.map((file, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between bg-accent/50 dark:bg-accent/20 rounded-lg px-4 py-3 border border-border/30 hover:border-primary/30 transition-all"
                  >
                    <span className="flex items-center gap-3 truncate">
                      <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-primary/10 rounded-lg">
                        <FaFilePdf className="text-primary text-lg" />
                      </span>
                      <div className="flex flex-col">
                        <span className="font-medium truncate max-w-xs">{file.name}</span>
                        <span className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</span>
                      </div>
                    </span>
                    <button
                      className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                      onClick={() => removeFile(idx)}
                      aria-label="Remove file"
                    >
                      <FaTrash size={14} />
                    </button>
                  </li>
                ))}
              </ul>
              <div style={{marginTop: '0.7rem', fontSize: '0.98rem', color: overLimit ? '#ef4444' : '#7c3aed', fontWeight: 500}}>
                Total size: {totalSizeKB.toFixed(1)} KB ({totalSizeMB.toFixed(2)} MB) / {MAX_TOTAL_SIZE_KB} KB ({maxTotalSizeMB.toFixed(2)} MB)
                {overLimit && <span style={{marginLeft: 8, color: '#ef4444'}}> (Limit exceeded!)</span>}
              </div>
            </div>
          </div>
        )}

        {/* Merge & Download Buttons */}
        <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-stretch sm:items-center mt-8 mb-16 gap-4 w-full">
          <button
            className="action-button group w-full sm:w-auto"
            disabled={files.length < 2 || loading || overLimit}
            onClick={handleMerge}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <FaPlus className="mr-2 group-hover:rotate-90 transition-transform duration-300" />
                Merge PDFs
              </>
            )}
          </button>
          {merged && (
            <>
              <button
                className="action-button group bg-primary text-white hover:bg-primary/80 w-full sm:w-auto"
                onClick={handleDownload}
                disabled={!downloadUrl}
              >
                <FaFilePdf className="mr-2" /> Download Merged PDF
              </button>
              <button
                className="action-button group bg-destructive text-white hover:bg-destructive/80 w-full sm:w-auto sm:ml-auto"
                onClick={handleDeleteAll}
                disabled={loading}
                style={{ alignSelf: 'stretch', justifySelf: 'flex-end' }}
              >
                <FaTrash className="mr-2" /> Delete All
              </button>
            </>
          )}
        </div>
        
        {/* Features Section */}
        <section id="features" className="container py-16 border-t border-border/40">
          <h2 className="features-title">Why Use Our PDF Merger?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">100% Secure</h3>
              <p className="text-muted-foreground">Your files stay private. All processing happens in your browser - files are never uploaded to any server.</p>
            </div>
            
            <div className="feature-card">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-muted-foreground">Merge PDFs in seconds with our optimized processing engine. No waiting, no delays.</p>
            </div>
            
            <div className="feature-card">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Free Forever</h3>
              <p className="text-muted-foreground">No hidden fees, no subscriptions. Our PDF merger is completely free to use, now and always.</p>
            </div>
          </div>
        </section>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="container py-16 border-t border-border/40">
        <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-text inline-block mx-auto">How It Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-24 left-1/2 h-0.5 w-[calc(66%-4rem)] -translate-x-1/2 bg-gradient-to-r from-indigo-200 via-purple-200 to-indigo-200 dark:from-indigo-900 dark:via-purple-900 dark:to-indigo-900"></div>
          
          {/* Step 1 */}
          <div className="relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:right-4 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold z-10">
              1
            </div>
            <div className="feature-card mt-8 text-center md:text-left md:mr-4">
              <h3 className="text-xl font-semibold mb-2">Upload Your PDFs</h3>
              <p className="text-muted-foreground">Select multiple PDF files by dragging and dropping them into the upload area or by clicking to browse your files.</p>
            </div>
          </div>
          
          {/* Step 2 */}
          <div className="relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold z-10">
              2
            </div>
            <div className="feature-card mt-8 text-center md:text-left md:mx-4">
              <h3 className="text-xl font-semibold mb-2">Arrange Your Files</h3>
              <p className="text-muted-foreground">Review your selected files. You can remove any files you don&apos;t want to include in the final merged document.</p>
            </div>
          </div>
          
          {/* Step 3 */}
          <div className="relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-4 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold z-10">
              3
            </div>
            <div className="feature-card mt-8 text-center md:text-left md:ml-4">
              <h3 className="text-xl font-semibold mb-2">Merge & Download</h3>
              <p className="text-muted-foreground">Click the &quot;Merge PDFs&quot; button and your combined PDF file will be generated and downloaded automatically.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-brand">
            {/* Use the same icon as Navbar (FaFilePdf) */}
            <FaFilePdf className="footer-logo" />
            <span className="footer-title">PDF Merger</span>
          </div>
          <div className="footer-links">
            <a href="https://github.com/ArpitSingh4010" className="footer-link" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.987 1.029-2.687-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.594 1.028 2.687 0 3.847-2.337 4.695-4.566 4.944.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.749 0 .267.18.577.688.48C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2Z"/></svg>
            </a>
            <a href="https://www.linkedin.com/in/arpit-singh-ab056a322/" className="footer-link" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.27c-.966 0-1.75-.79-1.75-1.76 0-.97.784-1.76 1.75-1.76s1.75.79 1.75 1.76c0 .97-.784 1.76-1.75 1.76zm13.5 11.27h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-10h2.89v1.36h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.59v5.61z"/></svg>
            </a>
          </div>
          <div className="footer-copy">
            © {new Date().getFullYear()} PDF Merger. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
