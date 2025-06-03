import { Box } from "@mui/material";
import AuthCard from "./components/AuthCard";

export default function LoginPage() {
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        background: "linear-gradient(135deg, #e0f7fa, #f1f8e9)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <AuthCard
        title="Welcome Back"
        subtitle="Log in to your pharmacy account"
        buttonText="Log In"
        footerText="Don’t have an account?"
        footerLink="/register"
        footerLinkText="Register here"
      />
    </Box>
  );
}
