import React, { useState } from "react";
import DashNav from "@/components/dashnav/dashnav";
import { useNavigate } from "react-router-dom";

export default function TemplateSelection() {
  const navigate = useNavigate();

  // State for available templates - will be populated from API
  const [templates] = useState([
    { id: 1, thumbnail: "https://via.placeholder.com/329x439/FFE29F/000000?text=Template+1", name: "Professional" },
    { id: 2, thumbnail: "https://via.placeholder.com/329x439/A9D4FF/000000?text=Template+2", name: "Creative" },
    { id: 3, thumbnail: "https://via.placeholder.com/329x439/FFA99F/000000?text=Template+3", name: "Modern" },
    { id: 4, thumbnail: "https://via.placeholder.com/329x439/D4A9FF/000000?text=Template+4", name: "Minimal" },
    { id: 5, thumbnail: "https://via.placeholder.com/329x439/A9FFD4/000000?text=Template+5", name: "Executive" },
    { id: 6, thumbnail: "https://via.placeholder.com/329x439/FFD4A9/000000?text=Template+6", name: "Classic" },
  ]);

  const handleTemplateSelect = (template: any) => {
    navigate(`/resume/editor?templateId=${template.id}`);
  };



  return (
    <div className="flex flex-col h-screen overflow-hidden font-['Baloo_2']">
      {/* Top Navigation */}
      <DashNav heading="Resume Builder" />

      {/* Page Container */}
      <div className="flex-1 bg-gray-50 overflow-auto">
        <div className="bg-white rounded-lg m-3 md:m-5 w-full max-w-[1210px] mx-auto">
          
          {/* Header with Back Button */}
          <div className="flex items-center justify-between px-4 md:px-5 pt-5 mb-5">
            <div className="flex flex-col gap-1">
              <span className="text-[#1A1A43] text-base font-semibold">
                Select a Template to continue
              </span>
              <span className="text-[#7F7F7F] text-sm">
                Choose a template that best fits your professional style
              </span>
            </div>
          </div>

          {/* Template Grid - First Row */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10 mb-10 px-4 md:px-5 flex-wrap justify-center md:justify-start">
            {templates.slice(0, 3).map((template) => (
              <button
                key={template.id}
                className="relative w-[329px] rounded-lg border-0 hover:shadow-xl transition-all hover:scale-[1.02] overflow-hidden group"
                style={{ boxShadow: "0px 0px 1px #00000040" }}
                onClick={() => handleTemplateSelect(template)}
              >
                <img
                  src={template.thumbnail}
                  alt={template.name}
                  className="w-full h-[439px] object-cover"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-end p-6">
                  <span className="text-white text-lg font-semibold mb-3">{template.name}</span>
                  <div className="px-6 py-2 bg-white text-[#1A1A43] rounded-lg font-medium text-sm">
                    Use This Template
                  </div>
                </div>

                {/* Template Name at Bottom */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 group-hover:opacity-0 transition-opacity">
                  <span className="text-white text-sm font-medium">{template.name}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Template Grid - Second Row */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10 mb-10 px-4 md:px-5 flex-wrap justify-center md:justify-start">
            {templates.slice(3, 6).map((template) => (
              <button
                key={template.id}
                className="relative w-[329px] rounded-lg border-0 hover:shadow-xl transition-all hover:scale-[1.02] overflow-hidden group"
                style={{ boxShadow: "0px 0px 1px #00000040" }}
                onClick={() => handleTemplateSelect(template)}
              >
                <img
                  src={template.thumbnail}
                  alt={template.name}
                  className="w-full h-[439px] object-cover"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-end p-6">
                  <span className="text-white text-lg font-semibold mb-3">{template.name}</span>
                  <div className="px-6 py-2 bg-white text-[#1A1A43] rounded-lg font-medium text-sm">
                    Use This Template
                  </div>
                </div>

                {/* Template Name */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 group-hover:opacity-0 transition-opacity">
                  <span className="text-white text-sm font-medium">{template.name}</span>
                </div>
              </button>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
