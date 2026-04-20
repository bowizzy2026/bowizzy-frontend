import React from "react";
import { X, RotateCcw } from "lucide-react";

export interface DataChip {
  id: string;
  label: string;
  sublabel?: string;
  deleted: boolean;
}

interface DataChipsProps {
  chips: DataChip[];
  onDelete: (id: string) => void;
  onUndo: (id: string) => void;
}

export default function DataChips({ chips, onDelete, onUndo }: DataChipsProps) {
  if (!chips.length) return null;

  return (
    <div className="mt-3 flex flex-col gap-1.5">
      {chips.map((chip) => (
        <div
          key={chip.id}
          className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm border transition-all duration-200 ${
            chip.deleted
              ? "bg-gray-50 border-gray-200 opacity-40"
              : "bg-orange-50/60 border-orange-100"
          }`}
        >
          {/* Dot indicator */}
          <span
            className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors duration-200 ${
              chip.deleted ? "bg-gray-300" : "bg-orange-400"
            }`}
          />

          {/* Label */}
          <div className="flex-1 min-w-0">
            <span
              className={`block font-medium truncate transition-all duration-200 ${
                chip.deleted
                  ? "line-through text-gray-400"
                  : "text-gray-700"
              }`}
            >
              {chip.label}
            </span>
            {chip.sublabel && (
              <span
                className={`block text-xs truncate transition-all duration-200 ${
                  chip.deleted ? "text-gray-300" : "text-gray-400"
                }`}
              >
                {chip.sublabel}
              </span>
            )}
          </div>

          {/* Action button */}
          {chip.deleted ? (
            <button
              onClick={() => onUndo(chip.id)}
              title="Undo"
              className="p-1 rounded-lg hover:bg-orange-100 text-gray-300 hover:text-orange-500 transition-colors flex-shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={() => onDelete(chip.id)}
              title="Remove"
              className="p-1 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-400 transition-colors flex-shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ))}

      {/* Deleted count hint */}
      {chips.some((c) => c.deleted) && (
        <p className="text-xs text-gray-400 mt-0.5 pl-1">
          {chips.filter((c) => c.deleted).length} item
          {chips.filter((c) => c.deleted).length > 1 ? "s" : ""} removed · hit ↩ to restore
        </p>
      )}
    </div>
  );
}