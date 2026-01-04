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

export const subscribeUser = async (userId, planType, durationMonths, token) => {
  try {
    const response = await api.post(
      `/users/${userId}/subscription`,
      {
        plan_type: planType,
        duration_months: durationMonths,
        status: "active",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating subscription:", error);
    throw error;
  }
};

export default {
  getSubscriptionByUserId,
  subscribeUser,
};
