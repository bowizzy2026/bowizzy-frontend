import api from "../api";

export const checkCoupon = async (couponCode) => {
  try {
    const response = await api.post("/auth/check-coupon", {
      coupon_code: couponCode.trim(),
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};
