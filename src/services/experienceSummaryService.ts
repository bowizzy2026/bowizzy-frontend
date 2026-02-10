import api from "@/api";

export interface YearsOfExperience {
  years: number;
  months: number;
  total_days: number;
}

export interface ExperienceSummaryPayload {
  experience_summary: string;
  years_of_experience: YearsOfExperience;
  job_role: string;
}

// Get experience summary for a user
export const getExperienceSummary = async (userId: string, token: string) => {
  const response = await api.get(`/users/${userId}/work-experience-summary`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Create or update experience summary for a user
export const saveExperienceSummary = async (
  userId: string,
  token: string,
  summaryData: ExperienceSummaryPayload
) => {
  const response = await api.post(`/users/${userId}/work-experience-summary`, summaryData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Update existing experience summary
export const updateExperienceSummary = async (
  userId: string,
  token: string,
  summaryData: ExperienceSummaryPayload
) => {
  const response = await api.put(`/users/${userId}/work-experience-summary`, summaryData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Delete experience summary
export const deleteExperienceSummary = async (userId: string, token: string) => {
  const response = await api.delete(`/users/${userId}/work-experience-summary`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
