import React, { useState, useRef } from "react";
import { X, Download, Printer } from "lucide-react";
import type { ResumeData } from "@/types/resume";
import { getTemplateById } from "@/templates/templateRegistry";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PageBreakMarkers from "../PageBreakMarkers";
import { usePageMarkers } from "@/hooks/usePageMarkers";

interface ResumePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  resumeData: ResumeData;
  templateId: string | null;
}

export const ResumePreviewModal: React.FC<ResumePreviewModalProps> = ({
  isOpen,
  onClose,
  resumeData,
  templateId,
}) => {
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [resumeName, setResumeName] = useState("");
  
  const previewContentRef = useRef<HTMLDivElement>(null);
  
  // Get template
  const template = templateId ? getTemplateById(templateId) : null;
  const DisplayComponent = template?.displayComponent || template?.component;
  const PDFComponent = template?.pdfComponent;
  
  // Calculate page markers for preview
  const { markers, totalPages } = usePageMarkers(previewContentRef, [resumeData]);

  if (!isOpen) return null;

  const handleDownloadClick = () => {
    setShowNameDialog(true);
  };

  const handlePrintClick = () => {
    window.print();
  };

  const handleNameSubmit = () => {
    if (!resumeName.trim()) return;
    setShowNameDialog(false);
    setShowDownloadDialog(true);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        style={{
          left: "255px",
          top: "83px",
        }}
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="fixed right-0 top-0 bottom-0 z-50 flex items-center">
        {/* Resume Preview */}
        <div
          className="h-[calc(100vh-160px)] overflow-auto scrollbar-hide"
          style={{ width: "calc(100vw - 320px)", maxWidth: "1100px" }}
        >
          <div className="p-8 flex justify-center">
            <div className="flex flex-col items-center">
              {/* Live Preview */}
              <div
                className="shadow-lg w-full relative resume-preview-wrapper"
                style={{
                  transform: "scale(1)",
                  transformOrigin: "center",
                  maxWidth: "100%",
                }}
              >
                <div ref={previewContentRef} className="resume-preview-content relative">
                  {DisplayComponent && <DisplayComponent data={resumeData} />}
                  <PageBreakMarkers markers={markers} />
                </div>
              </div>

              {/* Hidden Print Version (no markers) */}
              <div className="print-version hidden">
                {DisplayComponent && <DisplayComponent data={resumeData} />}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 ml-0 transform -translate-x-30">
          {/* Back to Edit Button */}
          <button
            onClick={onClose}
            className="flex items-center bg-white text-left py-3 px-4 rounded-full border-0 hover:bg-gray-50 transition-colors shadow-md cursor-pointer"
          >
            <X className="w-5 h-5 mr-2" />
            <span className="text-black text-sm font-medium whitespace-nowrap">
              Back to Edit
            </span>
          </button>

          {/* Print Button */}
          <button
            onClick={handlePrintClick}
            className="flex items-center bg-white text-left py-3 px-4 rounded-full border-0 hover:bg-gray-50 transition-colors shadow-md cursor-pointer"
          >
            <Printer className="w-5 h-5 mr-2 text-orange-500" />
            <span className="text-black text-sm font-medium whitespace-nowrap">
              Print / Save as PDF
            </span>
          </button>

          {/* Download PDF Button */}
          <button
            onClick={handleDownloadClick}
            className="flex items-center bg-white text-left py-3 px-4 rounded-full border-0 hover:bg-gray-50 transition-colors shadow-md cursor-pointer"
          >
            <Download className="w-5 h-5 mr-2 text-orange-500" />
            <span className="text-black text-sm font-medium whitespace-nowrap">
              Download PDF
            </span>
          </button>
        </div>
      </div>

      {/* Resume Name Dialog */}
      {showNameDialog && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-[60]"
            onClick={() => setShowNameDialog(false)}
          />
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
              <button
                onClick={() => setShowNameDialog(false)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>

              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Resume Name
              </h3>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Save As (Name)
                </label>
                <input
                  type="text"
                  value={resumeName}
                  onChange={(e) => setResumeName(e.target.value)}
                  placeholder="Enter Resume Name"
                  className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowNameDialog(false)}
                  className="px-6 py-2.5 text-sm font-medium text-orange-500 border border-orange-500 rounded-full hover:bg-orange-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleNameSubmit}
                  disabled={!resumeName.trim()}
                  className="px-6 py-2.5 text-sm font-medium text-white bg-orange-500 rounded-full hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Download Dialog */}
      {showDownloadDialog && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-[60]"
            onClick={() => setShowDownloadDialog(false)}
          />
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-[50%] max-w-3xl p-8 relative max-h-[65vh] overflow-y-auto">
              <button
                onClick={() => setShowDownloadDialog(false)}
                className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>

              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Download Your Resume
              </h3>

              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resume Name
                </label>
                <input
                  type="text"
                  value={resumeName}
                  onChange={(e) => setResumeName(e.target.value)}
                  className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  placeholder="Enter resume name"
                />
              </div>

              {/* Download Options */}
              <div className="space-y-4">
                {/* Option 1: Browser Print (Save as PDF) */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Option 1: Print to PDF (Recommended)
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Use your browser's print function to save as PDF. This preserves all formatting perfectly.
                  </p>
                  <button
                    onClick={handlePrintClick}
                    className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
                  >
                    <Printer className="w-4 h-4" />
                    Print / Save as PDF
                  </button>
                </div>

                {/* Option 2: Direct PDF Download (if PDF component exists) */}
                {PDFComponent && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Option 2: Direct PDF Download
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Download a pre-rendered PDF file instantly.
                    </p>
                    <PDFDownloadLink
                      document={<PDFComponent data={resumeData} />}
                      fileName={`${resumeName || "resume"}.pdf`}
                    >
                      {({ loading }) => (
                        <button
                          disabled={loading || !resumeName.trim()}
                          className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 disabled:opacity-50 flex items-center gap-2"
                        >
                          {loading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Preparing...
                            </>
                          ) : (
                            <>
                              <Download className="w-4 h-4" />
                              Download PDF
                            </>
                          )}
                        </button>
                      )}
                    </PDFDownloadLink>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
};

export default ResumePreviewModal;