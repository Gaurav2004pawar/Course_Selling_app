import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../utils/utils";

const Buy = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("user");

  useEffect(() => {
    const handlePurchase = async () => {
      try {
        setLoading(true);
        setError("");

        if (!token) {
          setError("Please login first");
          return;
        }

        const query = new URLSearchParams(window.location.search);

        const success = query.get("success");
        const canceled = query.get("canceled");
        const sessionId = query.get("session_id");

        // Payment Cancelled
        if (canceled) {
          setError("Payment cancelled");
          return;
        }

        // Payment Success
        if (success && sessionId) {
          await axios.post(
            `${BACKEND_URL}/courseName/verify-payment`,
            {
              sessionId,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          navigate("/purchases");
          return;
        }

        // Create Stripe Checkout Session
        const response = await axios.post(
          `http://localhost:3000/courseName/buy/${courseId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Redirect to Stripe
        window.location.href = response.data.url;

      } catch (error) {
        console.error(error);

        setError(
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Purchase Failed"
        );
      } finally {
        setLoading(false);
      }
    };

    handlePurchase();
  }, [courseId, token, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-black via-blue-950 to-blue-900 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-xl text-center w-96">
        <h1 className="text-3xl font-bold mb-6 text-black">
          Purchase Course
        </h1>

        {loading && (
          <p className="text-blue-600">
            Processing Payment...
          </p>
        )}

        {error && (
          <p className="text-red-500">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default Buy;