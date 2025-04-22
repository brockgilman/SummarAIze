import { useState } from "react";
import {
  Typography,
  Box,
  Grid,
  Button,
  Paper,
  Container,
} from "@mui/material";
import Navbar from "../components/Navbar";
import Footer from '../components/Footer';

const Features = () => {
  const [selectedTone, setSelectedTone] = useState("casual");
  const [selectedLength, setSelectedLength] = useState("short");
  const [selectedOrgFeature, setSelectedOrgFeature] = useState("save");

  const toneFeatures = [
    {
      value: "casual",
      label: "Casual",
      description:
        "Gives you a clear and concise summary using everyday language. Great when you just want the gist without any jargon—perfect for fast, casual reading.",
    },
    {
      value: "knowledgeable",
      label: "Knowledgeable",
      description:
        "Breaks down complex ideas using clear explanations and relevant context. Ideal for building a solid understanding of a topic without getting too technical.",
    },
    {
      value: "expert",
      label: "Expert",
      description:
        "Delivers a detailed, formal summary using academic language and precise terminology. Best suited for research, scholarly use, or professional environments.",
    },
  ];

  const lengthFeatures = [
    {
      value: "short",
      label: "Short",
      description:
        "Summarizes only the most important points in 1-2 paragraphs (about 150 words). Quick and efficient when you're short on time.",
    },
    {
      value: "medium",
      label: "Medium",
      description:
        "Covers key takeaways in 3-4 paragraphs (around 300 words), balancing depth and readability. Great for when you want more context without the full deep dive.",
    },
    {
      value: "long",
      label: "Long",
      description:
        "Provides a thorough summary in 5-6 paragraphs (up to 500 words), explaining concepts in detail with supporting examples and analysis. Ideal for comprehensive understanding.",
    },
  ];

  const organizationFeatures = [
    {
      value: "save",
      label: "Save to Account",
      description:
        "Store all your summaries securely in your personal account. Access them anytime, anywhere, from any device with your login credentials.",
    },
    {
      value: "folders",
      label: "Create Folders",
      description:
        "Organize your summaries into custom folders for different subjects, projects, or categories. Keep your research structured and easily accessible.",
    },
    {
      value: "trash",
      label: "Trash Management",
      description:
        "Accidentally deleted a summary? No problem. Recover items from your trash within 30 days, or permanently delete them when you're sure.",
    },
  ];

  const buttonStyle = {
    width: "100%",
    maxWidth: "300px",
    marginBottom: "12px",
    fontWeight: 600,
    textTransform: "none",
    justifyContent: "center",
    padding: "8px 16px",
  };

  const selectedButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#0F2841",
    color: "white",
    "&:hover": {
      backgroundColor: "rgba(15, 40, 65, 0.9)",
    },
  };

  const unselectedButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#CFD4DA",
    color: "#000",
    "&:hover": {
      backgroundColor: "#BABFC4",
    },
  };

  const renderFeatureSection = (title, description, features, selected, setSelected) => {
    const isFlipped = title === "Control Summary Length";

    return (
      <Paper elevation={1} sx={{ mb: 6, overflow: "hidden", borderRadius: "8px" }}>
        <Grid container direction={isFlipped ? "row-reverse" : "row"}>
          <Grid item xs={12} md={7}>
            <Box sx={{ p: 4 }}>
              <Typography variant="h4" component="h2" sx={{ fontWeight: 600, mb: 2 }}>
                {title}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {description}
              </Typography>
              <Box sx={{ mt: 3 }}>
                {features.map((item) => (
                  <Box
                    key={item.value}
                    sx={{
                      display: selected === item.value ? "block" : "none",
                      p: 2,
                      borderLeft: "4px solid #0F2841",
                      bgcolor: "#f5f5f5",
                    }}
                  >
                    <Typography variant="body1">{item.description}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={5} sx={{ bgcolor: "#f5f5f5" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                p: 4,
                height: "100%",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  maxWidth: 360,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {features.map((item) => (
                  <Button
                    key={item.value}
                    variant={selected === item.value ? "contained" : "outlined"}
                    onClick={() => setSelected(item.value)}
                    sx={selected === item.value ? selectedButtonStyle : unselectedButtonStyle}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Container maxWidth="lg" sx={{ py: 8, pt: 10 }}>
          <Box sx={{ mb: 8, textAlign: "center" }}>
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-relaxed text-gray-900 mb-2">
              Features
            </h1>
            <p className="text-2xl md:text-3xl text-gray-700 leading-relaxed max-w-[800px] mx-auto">
              SummarAIze offers powerful customization options to make your reading and learning experience truly personalized.
            </p>
          </Box>

          {renderFeatureSection(
            "Customize Your Summaries",
            "Adjust the tone of your summaries to fit your needs. Whether you're studying academic papers or need quick insights, we've got you covered.",
            toneFeatures,
            selectedTone,
            setSelectedTone
          )}

          {renderFeatureSection(
            "Control Summary Length",
            "Choose how detailed you want your summaries to be. From comprehensive breakdowns to quick highlights, you're in control.",
            lengthFeatures,
            selectedLength,
            setSelectedLength
          )}

          {renderFeatureSection(
            "Organize Your Summaries",
            "Keep your summaries organized and accessible with our powerful management tools. Save, categorize, and manage your content with ease.",
            organizationFeatures,
            selectedOrgFeature,
            setSelectedOrgFeature
          )}
        </Container>
      </main>
      <Footer isFixed={false} />
    </div>
  );
};

export default Features;
