import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import Navbar from '../components/Navbar';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white text-[#333333] flex flex-col">
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 8, pt: 10 }}>
        <Box sx={{ mb: 8, textAlign: "center", mt: 4 }}>
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-relaxed text-gray-900 mb-2 text-center">
            Privacy Policy
          </h1>
        </Box>
        
        <Box sx={{ maxWidth: '800px', mx: 'auto', lineHeight: 1.7, color: '#333333', mt: 8 }}>
          <Typography variant="body1" paragraph sx={{ color: '#333333' }}>
            <strong>Effective Date:</strong> April 21, 2025
          </Typography>

          <Typography variant="body1" paragraph sx={{ color: '#333333' }}>
            At <strong>SummarAIze</strong>, your privacy is important to us. This Privacy Policy outlines the types of
            information we collect, how we use it, and your rights regarding your data.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mt: 4, color: '#333333' }}>1. Information We Collect</Typography>
          <ul style={{ paddingLeft: '1.5rem', color: '#333333' }}>
            <li><strong>Email Address and Password:</strong> Collected to authenticate users and manage accounts.</li>
            <li><strong>Cookies:</strong> Functional cookies are used to maintain user sessions and enable saving summaries from our Chrome extension.</li>
            <li><strong>User-Generated Content:</strong> Summaries saved by users are stored in our secure Firebase database.</li>
          </ul>

          <Typography variant="h6" sx={{ fontWeight: 600, mt: 4, color: '#333333' }}>2. How We Use Your Information</Typography>
          <ul style={{ paddingLeft: '1.5rem', color: '#333333' }}>
            <li>To authenticate and manage user accounts.</li>
            <li>To allow users to save and access their summaries across devices.</li>
            <li>To support essential functionality through the use of cookies.</li>
          </ul>

          <Typography variant="h6" sx={{ fontWeight: 600, mt: 4, color: '#333333' }}>3. Data Security</Typography>
          <Typography variant="body1" paragraph sx={{ color: '#333333' }}>
            All data is securely stored using Google Firebase services. We implement appropriate safeguards to protect your data from unauthorized access, disclosure, or misuse.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mt: 4, color: '#333333' }}>4. No Data Selling</Typography>
          <Typography variant="body1" paragraph sx={{ color: '#333333' }}>
            We do <strong>not</strong> sell, trade, or share your personal data with third parties for commercial purposes.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mt: 4, color: '#333333' }}>5. Consent</Typography>
          <Typography variant="body1" paragraph sx={{ color: '#333333' }}>
            By logging in and using SummarAIze (including our Chrome extension), you consent to the collection and use of your information
            as described in this policy. You also agree to the use of cookies for session management and functionality.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mt: 4, color: '#333333' }}>6. Updates</Typography>
          <Typography variant="body1" paragraph sx={{ color: '#333333' }}>
            This Privacy Policy may be updated periodically. Any changes will be posted on this page with an updated effective date.
          </Typography>

          {/* No email support for now */}
          {/* <Typography variant="body1" paragraph sx={{ color: '#333333' }}>
            If you have any questions or concerns, feel free to contact us at <a href="mailto:support@summaraize.com" style={{ color: '#478cde' }}>support@summaraize.com</a>.
          </Typography> */}
        </Box>
      </Container>
    </div>
  );
};

export default PrivacyPolicy; 