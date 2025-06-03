import React from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Link,
  TextField,
  InputAdornment,
  Button,
  Container,
  Card,
  CardMedia,
  Chip,
  IconButton,
  Stack,
  CardContent,
} from '@mui/material';
import { Search, Chat, FileUpload, LocalShipping, Twitter, Facebook, Instagram } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

// Define a theme to customize fonts and colors similar to the original design
const theme = createTheme({
  palette: {
    background: {
      default: '#ffffff',
      paper: '#f0f2f5',
    },
    text: {
      primary: '#111418',
      secondary: '#60758a',
    },
  },
  typography: {
    fontFamily: ['Lexend', 'Noto Sans', 'sans-serif'].join(','),
    h2: {
      fontSize: '22px',
      fontWeight: 'bold',
      letterSpacing: '-0.015em',
    },
    h6: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
    },
    body1: {
      fontSize: '1rem',
    },
    body2: {
      fontSize: '0.875rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 'bold',
    },
  },
});

// Data for mapping
const navLinks = ['Home', 'Medicines', 'Categories', 'Services', 'Contact'];
const highlights = [
  { label: 'Top Medicines', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCm5l6YSsNWh60FS_mQZc73h8z_86JadhQ2MCQrlUcpFERyNPhZAnuzye_MN4Qc1kiFrbxIxesUZo0zKyM5AUnO-9ruePZtkNWhmzf2AtnsU1Fi-HE3hFrKYD6_wWmwuyDDc_s7WBRU0YQGiJiHU72BIYNO7yfK7KHz3VbHDlbaeW9FrD5A9R4SzFtEii3ZTiujyOf-jt3NbhIzdgjP1n2KLv6TtbTLAi394KYQe2CIVcGy8o7MoAG-lT5pQsu9zwI1LDZrzjvExSk' },
  { label: 'Featured Products', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbmhbgtynFz1alJYOg6hdzPe0h7wNrMoWvzj9XOJYL-stHQiJdyaRECoC12D3jFzFkbuN22Q4N314maBm0Ldr8hpNEW0HNhWFLVw58cSd9l3ENop3VwJjr2MKKA3h52ZV2qsuMgf6CV_b48aDcd4wRUtrZ5onckltWgSaLpcwXd10qLzYh6a_Z6M9PaSxfEEhukrkpw4-abskNKx7mJdL1x4b7Jxjh6SrLQWHYHjrHnMwLfjVwmce2kS-6t3tR8NBKPKCH4NZJuuU' },
  { label: 'Special Offers', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPtfrRhI-mIaiBsk5utZ0OVmW0OFsev94Zr3HEV6UW7cRHTCeLWYWAoT5dnVHw5SI8JORRZesL_FLdlmcM35_vOz0A_2Ex90qdXfvZ_CU4GZPMO8VuJ-k-ifLcfIiKfLuWvR68aU0FEzy9LmpBEwdkIwIEcHK1tJmO1dKL4wvDqQC52wN0ADccidNBwfT1krlAePRzyLVFa3RoKB77WC0ucGdFSDhNTHLMYSBo8PccRVQa9e36IN-J3H3lte03NGjR6crwJkHMKBw' },
];
type Category = {
  label: string;
  image: string;
};

const categories: Category[] = [
  { label: 'Pain Relief', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3jmphpE1RPb8hnuhsarBEoDFVRKQN097jQswpIN8J3NgOReaje0ApvX5wTFheUJTb8GofqiEEOBSAkchTz4WbhGRo7X3M-bLBahxPvSeDuglm1y9fGAGGb5gTC_yc5vZroUAV6zhOg39BThk9QwJYnXczgLdCbkrAPpg07tZOp5ZYnQFLHUQuXVkdaEXWb25b4VSgiWVLDpM99vMIktF-yNFEFUgy_1mjmOcPpG5Q52QsbGrZIJoI8yZigqtyzNELB87wIkzNTnE' },
  { label: 'Antibiotics', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDx9QK6RSB9JZqG3Z1CVjpbSEn1yEJr25NlH0CwOj70R0wv_-56dmRk9Jpkuaal6o8bxpCIsANNgPyQtkxUh1XmYCBgm_9Pwk3vcO3TvDK_OIZFuoeK0RHBRRqokmpVMlfeJKYztbDTId1EmnfVtdDxyWBcFt3yNn9ytXM6F8BFm9yRUfZl4f57wFCOSi7hZDV9gkxo8I_9JBDGjYdY2mh6SJFv1nhuWumLlc1B8Hg2Y1tg9J9gXlfFPtmDtV_8Kl0AovylsUwQ08E' },
  { label: 'Vitamins', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAioGXpmEUEwaE4OcHeA5FwOgfS02kqPzwQOs_Iisb1PShYBZgtJSw93akBMv98QkSL_9B7h1HBjj3VObc1LZI0MOxaH-ufLZvtVY2QU52CIRdg3JDUWipA19mqIWmV7h65eeKY1OQ3KADLvu0meVLhGC8HIX_aFjBO4Qk3ks2I7w3gyybT7FnjVlJn7o_DHC-gMlcPUL7ev9CN2HgWao1NwT4EZbdifhp6UvhqzivIq_mVGFCOQbpRRvL9hm6PpQjV_1-mau0eqCc' },
  { label: 'Skin Care', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPitUaRDGl-TSG0uRZs8VvvENg2Rzo5yPKkYovp-r_eMGatDxtf6-E0bdSTQdMIxkhXeI2QAShJS36I4pF7Kx9BUFgqUmt_cL-OfDr40Va6-eOZpJWiBEmGdkP9XORHLnfs2WVsmA7xeWe9DL-Nap9UcpW0JDxQhjt6cF0tXMeSKL7Ia1OMshitr5OaZHBdB3gqa2bE5q_XzDmW7XZwup7kofT_7PoL8vuUWUqxmlQqcd0H_s3XCSO5LaFuvYovDShpw2p6vH7t2k' },
  { label: 'Digestive Health', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuClfnKsCpVPT4FsPoVjYu0DQfursLZkgiQMx1Odqxc_IRFHf7jHz6-wXBIhBJ3S17NGZJj3VnLQRVKS_jcW93hQ_RvZa8IYIGUc2znmHV5r52KmRTmno_c_tCOGwHsZAT9edu7dyzbZHfbIhJBPUy7b8qcq4Us50IFKOwkUmRSCSXD_mMMcq5VFlOy8ziruxRTdXxk6opOisjxl9CdKZnoSsN5ZDeLugUzxh_N9Hb79V0vPrhVD5dG3pp8E51rdhEkME3X8B1UFWBU' },
  { label: 'Respiratory Care', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCB9l45GhsrcoP3ZZ92mWeMD7Lx7X7d_7YNG6iT4CAnRYxUkvHLHatDYQ8ubZxmnJ-P5xjw9yCzRPIJPriQlfj2iUG3gXom34n3GTzfXvfd4MRWLRF63W-XrP_2Gx-wR9xMTKu4pRkoqs6FCYOOhW-PiTBfqmoPZ2W7HXovn1nIEbJf5TH3wyomPl3ama5TZnl0OL2utkzLhbIuEWMWoS_4ktXwXJvbIHztlJN9YhIzzyvetC2yAKXo2M3V3t0yLnnhTjyKEMmNdWU' },
];

const healthTips = [
  {
    title: 'Managing Seasonal Allergies',
    description: 'Tips for dealing with pollen and other allergens.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCO6j8oDukBQwYtIHVKPsO9V4gxhpk4uhdMtYXqhvqgBUmGnNB54J5jHC_QmD1ygO_aEndcdIEOjzqsJvkfqDCCiHHRc99QizH8hmx0AWNoFaHko5mmoGTITQTcpn0Uf1d9tzjaU--4kJNZxoe7x_VmiCGa2pb8u8saZoxs0fjWuf2iouH-pi0S_w9Iw8iV8YQahcFbjlJJkLDipZ6F-gwfrnisQyiaCpCKEqXyhGspcY2D7kOC_CZ2SUR8OI1R6GUbO4RYmYWwFk',
  },
  {
    title: 'Understanding Your Medications',
    description: 'Learn about common drug interactions and side effects.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMwYVrzqXcs3GbDh5-A4QeU2mMGw-edj502C2z3BhW2e4ZlE7EaQ27balCbm21NEvqw5AvphnFvsk9u_LQWBZnmbId9WoQeUHnRVcVxu6rx7ln4RcY-YCYqvzpeRKu3ngC8lFNYku63FOJ6z3w079P95p3ZoRXPzc6t0dBWreI7VmkPYml8RW9yevqR130D0LMWlKM0N7fW7VtV2RgFyaF_JSXG3FvjNIdsq4R3IjeyVKpWCkTcc14iwae0It6CBqen6f4AcIECUs',
  },
];
const services = [
  { label: 'Online Consultations', icon: <Chat /> },
  { label: 'Prescription Upload', icon: <FileUpload /> },
  { label: 'Delivery Options', icon: <LocalShipping /> },
];
const socialLinks = [
  { icon: <Twitter /> },
  { icon: <Facebook /> },
  { icon: <Instagram /> },
];


const CategoryCard = ({ label, image }: { label: string; image: string }) => (
  <Card sx={{ maxWidth: 180, minWidth: 140, m: 1, boxShadow: 2, borderRadius: 2, textAlign: 'center' }}>
    <CardMedia
      component="img"
      height="100"
      image={image}
      alt={label}
      sx={{ objectFit: 'contain', p: 1, bgcolor: '#f8f8f8' }}
    />
    <CardContent sx={{ p: 1 }}>
      <Typography variant="subtitle2" component="div" sx={{ fontWeight: 500 }}>
        {label}
      </Typography>
    </CardContent>
  </Card>
);

const HealthHubPharmacy: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
        {/* Header */}
        <AppBar position="static" color="default" elevation={0} sx={{ borderBottom: '1px solid #f0f2f5' }}>
          <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 10 }, py: 1 }}>
            <Stack direction="row" alignItems="center" spacing={4}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box
                  component="svg"
                  viewBox="0 0 48 48"
                  sx={{ width: 24, height: 24, color: 'text.primary' }}
                >
                  <path d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z" />
                </Box>
                <Typography variant="h6" component="h1" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                  HealthHub Pharmacy
                </Typography>
              </Stack>
              <Stack direction="row" spacing={3.5} sx={{ display: { xs: 'none', md: 'flex' } }}>
                {navLinks.map((link) => (
                  <Link
                    href="#"
                    key={link}
                    color="text.primary"
                    sx={{ textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}
                  >
                    {link}
                  </Link>
                ))}
              </Stack>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
              <TextField
                variant="standard"
                placeholder="Search"
                size="small"
                sx={{
                  display: { xs: 'none', sm: 'block' },
                  '& .MuiInputBase-root': {
                    bgcolor: 'background.paper',
                    borderRadius: '8px',
                    height: '40px',
                    px: 2,
                  },
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                    disableUnderline: true,
                  }
                }}
              />
              <Button
                variant="contained"
                color="inherit"
                sx={{ bgcolor: 'background.paper', color: 'text.primary', '&:hover': { bgcolor: '#e0e2e5' } }}
              >
                Login/Register
              </Button>
            </Stack>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Container maxWidth="md" sx={{ flexGrow: 1, py: 3 }}>
          {/* Search Bar */}
          <Box sx={{ px: { xs: 0, md: 2 }, py: 2 }}>
            <TextField
              variant="standard"
              fullWidth
              placeholder="Search for medicines"
              sx={{
                '& .MuiInputBase-root': {
                  bgcolor: 'background.paper',
                  borderRadius: '8px',
                  height: '48px',
                  px: 2,
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                  disableUnderline: true,
                }
              }}
            />
          </Box>

          {/* Highlights Section */}
          <Box
            sx={{
              display: 'flex',
              overflowX: 'auto',
              p: 2,
              gap: 2,
              '&::-webkit-scrollbar': { display: 'none' },
              scrollbarWidth: 'none',
            }}
          >
            {highlights.map((item) => (
              <Box key={item.label} sx={{ minWidth: 240, flexShrink: 0 }}>
                <CardMedia
                  component="div"
                  sx={{
                    width: '100%',
                    aspectRatio: '16/9',
                    backgroundImage: `url(${item.image})`,
                    backgroundSize: 'cover',
                    borderRadius: 2,
                  }}
                />
                <Typography variant="body1" sx={{ mt: 1.5, fontWeight: 500 }}>
                  {item.label}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Medicine Categories */}
          <Box sx={{ p: 2 }}>
            <Typography variant="h2" gutterBottom>
              Medicine Categories
            </Typography>
            <Box
              sx={{
                display: 'flex',
                overflowX: 'auto',
                gap: 2,
                py: 1,
                '&::-webkit-scrollbar': { display: 'none' },
                scrollbarWidth: 'none',
              }}
            >
              {categories.map((item) => (
                <CategoryCard key={item.label} label={item.label} image={item.image} />
              ))}
            </Box>
          </Box>

          {/* Health Tips */}
          <Box sx={{ p: 2 }}>
            <Typography variant="h2" gutterBottom>
              Health Tips
            </Typography>
            <Stack spacing={2}>
              {healthTips.map((tip) => (
                <Card
                  key={tip.title}
                  elevation={0}
                  sx={{ display: 'flex', gap: 2, alignItems: 'center', p: 2, borderRadius: 2, bgcolor: 'transparent' }}
                >
                  <Box sx={{ flex: 2 }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      {tip.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {tip.description}
                    </Typography>
                  </Box>
                  <CardMedia
                    component="div"
                    sx={{
                      flex: 1,
                      aspectRatio: '16/9',
                      backgroundImage: `url(${tip.image})`,
                      backgroundSize: 'cover',
                      borderRadius: 2,
                    }}
                  />
                </Card>
              ))}
            </Stack>
          </Box>

          {/* Our Services */}
          <Box sx={{ p: 2 }}>
            <Typography variant="h2" gutterBottom>
              Our Services
            </Typography>
            <Stack direction="row" spacing={2} useFlexGap flexWrap="wrap">
              {services.map((service) => (
                <Chip
                  key={service.label}
                  icon={service.icon}
                  label={service.label}
                  sx={{ bgcolor: 'background.paper', color: 'text.primary', fontWeight: 500, fontSize: '14px', p: 2 }}
                />
              ))}
            </Stack>
          </Box>

          {/* Personalized Suggestions */}
          <Box sx={{ p: 2 }}>
            <Typography variant="h2" gutterBottom>
              Personalized Suggestions
            </Typography>
            <Card
              elevation={0}
              sx={{ display: 'flex', gap: 2, alignItems: 'center', p: 2, borderRadius: 2, bgcolor: 'transparent' }}
            >
              <Box sx={{ flex: 2 }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  Recommended for you
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Based on your purchase history
                </Typography>
              </Box>
              <CardMedia
                component="div"
                sx={{
                  flex: 1,
                  aspectRatio: '16/9',
                  backgroundImage: `url(https://lh3.googleusercontent.com/aida-public/AB6AXuBioqJgFaIScgmkgsemeGt4Lk5-gV1veY_tl33blsQjfdGFK8cvKiSACwwWZfkU6Gn49ONNtWq1r98QIKhzy-qdWxmL0dQbv90kd2XarSFHp6c0NZJ202FNK5dO5bbiC2YOGMLoB0tyDumIaXwjIPhkLa6h8AcPNIwRAqEDXupVqgEm2hRLtQZL7MAll6xxiqc-qHR1UNwFl5XsxaXSp52I514uAE4zHNkUKCWi1IVa3GNDXG3W8SyR3QdpumjvGp8J0HfTl1UUGHg)`,
                  backgroundSize: 'cover',
                  borderRadius: 2,
                }}
              />
            </Card>
            <Stack alignItems="center" spacing={2} py={4} textAlign="center">
              <Box
                component="img"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJqMGFH6xOG3SWwhHuxnDNO4MZ2QsO08SEDSUb-wT7S7GJewkyqthOd9TmQAJCaXWHAiFXpqElMSHEoHHiD3D62mrT7tJx8O6iJ58PzRcUY_8GmmGp2-ntL0-_mBTJLq5rWAAUi0iXtAgjsKdaXy-8o5vEw7YqZ_Ig9-UD4ysgeLjwAmOIBeTiRj2Yt-sn4adJm9WiYuf_WnBEPq88nIm0930gHLQU72p0_dufD72q3VHltBgLIWbF5ZKNWvGxRUdSJCCC3ftnVT4"
                alt="No suggestions yet"
                sx={{ width: '100%', maxWidth: 360, aspectRatio: '16/9', borderRadius: 2, objectFit: 'cover' }}
              />
              <Typography variant="h6" component="p">
                No personalized suggestions yet
              </Typography>
              <Typography variant="body2" color="text.primary">
                Your suggestions will appear here once you start shopping.
              </Typography>
              <Button
                variant="contained"
                color="inherit"
                sx={{ bgcolor: 'background.paper', color: 'text.primary', '&:hover': { bgcolor: '#e0e2e5' } }}
              >
                Browse Medicines
              </Button>
            </Stack>
          </Box>
        </Container>

        {/* Footer */}
        <Box component="footer" sx={{ bgcolor: 'background.default', py: 5 }}>
          <Container maxWidth="md">
            <Stack spacing={4} alignItems="center" textAlign="center">
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={{ xs: 2, sm: 4 }}
                justifyContent="center"
                useFlexGap
                flexWrap="wrap"
              >
                <Link href="#" color="text.secondary" sx={{ textDecoration: 'none' }}>
                  About Us
                </Link>
                <Link href="#" color="text.secondary" sx={{ textDecoration: 'none' }}>
                  Terms & Conditions
                </Link>
                <Link href="#" color="text.secondary" sx={{ textDecoration: 'none' }}>
                  Help Center
                </Link>
              </Stack>
              <Stack direction="row" spacing={1}>
                {socialLinks.map((social, index) => (
                  <IconButton key={index} href="#" sx={{ color: 'text.secondary' }}>
                    {social.icon}
                  </IconButton>
                ))}
              </Stack>
              <Typography variant="body2" color="text.secondary">
                ©2024 HealthHub Pharmacy. All rights reserved.
              </Typography>
            </Stack>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default HealthHubPharmacy;