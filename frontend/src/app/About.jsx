import React from 'react';
import { Typography, Box, Grid, Container, Paper, Avatar, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const teamMembers = [
  {
    name: "Leo Cherevko",
    bio: "2nd year CSE @ UF\nFull Stack Developer\nBackend",
    image: "/developerpics/leocherevkopic.jpg"
  },
  {
    name: "Brock Gilman",
    bio: "2nd year CSE @ UF\nFull Stack Developer\nFrontend",
    image: "/developerpics/brockgilmanpic.jpg" 
  },
  {
    name: "Shri Kumarasri",
    bio: "2nd year CSE @ UF\nFull Stack Developer\nExtension, DB",
    image: "/developerpics/shrikumarasripic.jpg"
  },
  {
    name: "Kyle Scarmack",
    bio: "2nd year CSE @ UF\nFull Stack Developer\nFrontend",
    image: "/developerpics/kylescarmackpic.jpg"
  }
];

const faqItems = [
  {
    question: "How do I install the SummarAIze Chrome extension?",
    answer: "You can easily install the SummarAIze Chrome extension by searching for \"SummarAIze\" in the Chrome Web Store. Simply look for our logo, click \"Add to Chrome,\" and start summarizing. Alternatively, you can directly follow this link: Insert link here."
  },
  {
    question: "What types of content can SummarAIze summarize?",
    answer: "SummarAIze can generate customized summaries for a variety of content types, including articles, academic journals, research papers, and much more. We're continually expanding our supported content formats, so stay tuned for exciting new updates."
  },
  {
    question: "Can I edit my saved summaries later?",
    answer: "Absolutely! SummarAIze allows you to revisit and edit your saved summaries at any time. Additionally, you can organize your summaries into dedicated folders by course, topic, or whatever you desire to keep your work structured and easily accessible."
  },
  {
    question: "Is SummarAIze free to use?",
    answer: "Yes, SummarAIze is currently completely free for all users. As we continue to develop and add new student-oriented features, our pricing model may evolve to accommodate these enhancements in the future."
  }
];


const AboutUs = () => {
  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white flex flex-col">
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 8, pt: 10, flex: 1 }}>
        {/* About Us Section */}
        <Box sx={{ mb: 8, textAlign: "center", mt: 4 }}>
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-relaxed text-white mb-2">
            About Us
          </h1>
          <Typography variant="h6" 
            sx={{ 
              maxWidth: '800px', 
              mx: 'auto', 
              color: 'text.secondary',
              lineHeight: 1.8
            }}>
            SummarAIze is a streamlined web application integrated with a Chrome extension designed to simplify your reading experience. 
            We instantly generate customizable summaries from articles, research papers, and other texts, allowing you to tailor each 
            summary by tone or length. With our intuitive journal feature, you can effortlessly save, revisit, and edit your summaries—keeping 
            all your important information organized and at your fingertips.
          </Typography>
        </Box>

        {/* Meet Our Team Section */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" component="h2" 
            sx={{ 
              fontWeight: 700, 
              mb: 6, 
              textAlign: "center",
              fontSize: { xs: '2rem', md: '2.75rem' }
            }}>
            Meet Our Team
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {teamMembers.map((member, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper 
                  elevation={2}
                  sx={{
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    borderRadius: 2,
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)'
                    }
                  }}
                >
                  <Avatar
                    src={member.image}
                    sx={{
                      width: 150,
                      height: 150,
                      mb: 2,
                      boxShadow: 2,
                      '& img': {
                        width: '110%',
                        height: '110%',
                        objectFit: 'cover',
                      },
                    }}
                  />
                  <Typography variant="h6" component="h3" sx={{ mb: 1, fontWeight: 600 }}>
                    {member.name}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                    {member.bio}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Our Mission Section */}
        <Box sx={{ mb: 8 }}>
          <Paper 
            elevation={2}
            sx={{
              p: 6,
              borderRadius: 4,
              background: 'linear-gradient(45deg, #0F2841 30%, #1a365d 90%)',
              color: 'white'
            }}
          >
            <Typography variant="h3" component="h2" 
              sx={{ 
                fontWeight: 700, 
                mb: 4, 
                textAlign: "center",
                fontSize: { xs: '2rem', md: '2.75rem' }
              }}>
              Our Mission
            </Typography>
            <Typography variant="h6" 
              sx={{ 
                maxWidth: '800px', 
                mx: 'auto', 
                textAlign: 'center',
                lineHeight: 1.8,
                opacity: 0.9
              }}>
              Built by students, for students, SummarAIze aims to optimize productivity by addressing the unique demands of student life. 
              We are committed to continuously enhancing your academic experience by saving you time, improving information retention, 
              and providing intuitive tools that align with your needs.
            </Typography>
          </Paper>
        </Box>

        {/* FAQ Section */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" component="h2" 
            sx={{ 
              fontWeight: 700, 
              mb: 6, 
              textAlign: "center",
              fontSize: { xs: '2rem', md: '2.75rem' }
            }}>
            Frequently Asked Questions
          </Typography>
          <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
            {faqItems.map((item, index) => (
              <Accordion 
                key={index}
                sx={{
                  mb: 2,
                  borderRadius: '8px !important',
                  '&:before': { display: 'none' },
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  '&:first-of-type': {
                    borderRadius: '8px !important',
                  },
                  '&:last-of-type': {
                    borderRadius: '8px !important',
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px !important',
                    '&.Mui-expanded': {
                      borderBottomLeftRadius: '0 !important',
                      borderBottomRightRadius: '0 !important',
                    }
                  }}
                >
                  <Typography 
                    sx={{ 
                      fontWeight: 600,
                      color: '#0F2841'
                    }}
                  >
                    {item.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails
                  sx={{
                    backgroundColor: 'white',
                    borderBottomLeftRadius: '8px',
                    borderBottomRightRadius: '8px',
                  }}
                >
                  <Typography
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.7
                    }}
                  >
                    {item.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Box>
      </Container>
      <Footer />
    </div>
  );
};

export default AboutUs; 