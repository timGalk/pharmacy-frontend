import { Paper, Typography, TextField, Button, Link, Box } from "@mui/material";

interface AuthCardProps {
  title: string;
  subtitle: string;
  buttonText: string;
  footerText: string;
  footerLink: string;
  footerLinkText: string;
}

export default function AuthCard({
  title,
  subtitle,
  buttonText,
  footerText,
  footerLink,
  footerLinkText,
}: AuthCardProps) {
  return (
    <Paper
      elevation={4}
      sx={{
        p: 4,
        width: 400,
        borderRadius: 4,
        textAlign: "center",
      }}
    >
      <Typography variant="h5" fontWeight="bold" mb={1}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        {subtitle}
      </Typography>
      <Box component="form">
        <TextField label="Email" fullWidth margin="normal" />
        <TextField label="Password" type="password" fullWidth margin="normal" />
        <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          {buttonText}
        </Button>
      </Box>
      <Typography variant="body2" sx={{ mt: 2 }}>
        {footerText}{" "}
        <Link href={footerLink} underline="hover">
          {footerLinkText}
        </Link>
      </Typography>
    </Paper>
  );
}
