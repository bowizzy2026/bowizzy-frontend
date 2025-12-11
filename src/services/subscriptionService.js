import api from "@/api";

export const getSubscriptionByUserId = async (userId, token) => {
  try {
    const response = await api.get(`/users/${userId}/subscription`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return null;
  }
};

export default {
  getSubscriptionByUserId,
};
