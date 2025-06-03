import { Box } from "@mui/material";
import AuthCard from "./components/AuthCard";

export default function RegisterPage() {
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        background: "linear-gradient(135deg, #f1f8e9, #e0f7fa)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <AuthCard
        title="Create an Account"
        subtitle="Register for your pharmacy account"
        buttonText="Register"
        footerText="Already have an account?"
        footerLink="/login"
        footerLinkText="Log in here"
      />
    </Box>
  );
}
