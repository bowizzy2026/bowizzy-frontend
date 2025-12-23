import api from "@/api";

// Save bank details for verification (POST)
export const saveBankDetails = async (userId, token, payload) => {
  const response = await api.post(
    `/users/${userId}/verification/bank-details`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// Get bank details list for a user (may return array or single object)
export const getBankDetails = async (userId, token) => {
  const response = await api.get(`/users/${userId}/verification/bank-details`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Get specific bank detail by id
export const getBankDetailById = async (userId, token, bankId) => {
  const response = await api.get(`/users/${userId}/verification/bank-details/${bankId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Update bank details (PUT)
export const updateBankDetails = async (userId, token, bankId, payload) => {
  const response = await api.put(
    `/users/${userId}/verification/bank-details/${bankId}`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// Delete bank detail
export const deleteBankDetails = async (userId, token, bankId) => {
  const response = await api.delete(`/users/${userId}/verification/bank-details/${bankId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export default {
  saveBankDetails,
};
