

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { getPersonalDetailsByUserId } from "@/services/personalService";

interface PersonalDetailsProps {
  formData: any;
  setFormData: (data: any) => void;
  onNext: () => void;
}

const PersonalDetails = ({ formData, setFormData, onNext }: PersonalDetailsProps) => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const parsed = JSON.parse(localStorage.getItem("user") || "{}");
        const userId = parsed?.user_id;
        const token = parsed?.token;
        if (!userId || !token) return setLoading(false);

        const personal = await getPersonalDetailsByUserId(userId, token);
        // Map API response similar to ProfileForms
        const calculateAge = (dob: string | undefined | null) => {
          if (!dob) return null;
          const d = new Date(dob);
          if (isNaN(d.getTime())) return null;
          const diff = Date.now() - d.getTime();
          const ageDt = new Date(diff);
          return Math.abs(ageDt.getUTCFullYear() - 1970);
        };

        const mapped = {
          firstName: personal?.first_name || "",
          lastName: personal?.last_name || "",
          email: personal?.email || "",
          mobileNumber: personal?.mobile_number || "",
          linkedin_url: personal?.linkedin_url || personal?.linkedin_url || "",
          profilePhotoUrl: personal?.profile_photo_url || "",
          dateOfBirth: personal?.date_of_birth || "",
          age: calculateAge(personal?.date_of_birth),
        };
        setProfile(mapped);
      } catch (err) {
        console.error("Error loading personal details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Render a readonly form-like view using divs and disabled inputs styling
  return (
    <div className="bg-white rounded-md p-6">
      <div className="grid grid-cols-1 gap-6">
        {/* Photo Display */}
        <div className="flex items-start gap-4">
          <div className="relative w-32 h-32 bg-gray-100 rounded-md border border-gray-200 flex items-center justify-center overflow-hidden">
            {profile?.profilePhotoUrl ? (
              <img
                src={profile.profilePhotoUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-gray-400">No Photo</div>
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-[#3A3A3A] mb-1">Upload Photo</p>
            <p className="text-xs text-gray-500">Photo is pulled from your profile and not editable here</p>
          </div>
        </div>

        {/* Name Fields (readonly) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#3A3A3A] mb-2">First Name</label>
            <div className="w-full px-4 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-[#3A3A3A]">{loading ? "Loading..." : profile?.firstName || "-"}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#3A3A3A] mb-2">Last Name</label>
            <div className="w-full px-4 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-[#3A3A3A]">{loading ? "Loading..." : profile?.lastName || "-"}</div>
          </div>
        </div>

        {/* Email and Mobile (readonly) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#3A3A3A] mb-2">Email</label>
            <div className="w-full px-4 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-[#3A3A3A]">{loading ? "Loading..." : profile?.email || "-"}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#3A3A3A] mb-2">Mobile Number</label>
            <div className="flex gap-2">
              <div className="w-16 px-3 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-center">+91</div>
              <div className="flex-1 px-4 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-[#3A3A3A]">{loading ? "Loading..." : profile?.mobileNumber || "-"}</div>
            </div>
          </div>
        </div>

        {/* LinkedIn Profile (readonly) */}
        <div>
          <label className="block text-sm font-medium text-[#3A3A3A] mb-2">LinkedIn Profile URL</label>
          <div className="w-full px-4 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-[#3A3A3A]">{loading ? "Loading..." : profile?.linkedin_url || "-"}</div>
        </div>

        {/* Age (readonly) */}
        <div>
          <label className="block text-sm font-medium text-[#3A3A3A] mb-2">Age</label>
          <div className="w-full px-4 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-[#3A3A3A]">{loading ? "Loading..." : (profile?.age ?? "-")}</div>
        </div>

        {/* Next Button */}
        <div className="flex justify-end mt-4">
          <button
            onClick={onNext}
            className="px-6 py-2.5 rounded-md text-white font-semibold transition-transform hover:scale-105"
            style={{
              background: "linear-gradient(180deg, #FF9D48 0%, #FF8251 100%)",
            }}
          >
            Proceed to next
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalDetails;