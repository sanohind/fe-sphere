import { useCallback } from "react";
import { useNavigate } from "react-router";
import { ensureSignInHash } from "../utils/hashNavigation";

export const useSignInRedirect = () => {
  const navigate = useNavigate();

  return useCallback(() => {
    navigate("/signin");
    ensureSignInHash();
  }, [navigate]);
};

