import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Success = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/purchases");
  }, [navigate]);

  return <h1>Payment Successful 🎉</h1>;
};

export default Success;