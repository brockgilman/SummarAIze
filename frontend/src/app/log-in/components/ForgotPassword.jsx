// Import necessary dependencies and UI components
import * as React from 'react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../components/firebase/firebaseConfig";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

// ForgotPassword component handles password reset dialog logic
function ForgotPassword({ open, handleClose }) {
  // State to store user's email input
  const [email, setEmail] = useState('');
  // State to track loading status while submitting
  const [isLoading, setIsLoading] = useState(false);
  // Snackbar state for displaying success/error feedback to the user
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Handle changes in the email input field
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  // Close the Snackbar notification
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Submit handler to send a password reset email via Firebase
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    
    try {
      // Attempt to send password reset email
      await sendPasswordResetEmail(auth, email);
      // If successful, show success message and close dialog
      setSnackbar({
        open: true,
        message: 'Password reset email sent! Please check your inbox.',
        severity: 'success'
      });
      setIsLoading(false);
      handleClose();
    } catch (error) {
      // If error occurs, show error message
      setSnackbar({
        open: true,
        message: error.message || 'Failed to send reset email. Please try again.',
        severity: 'error'
      });
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Password reset dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            component: 'form',
            onSubmit: handleSubmit,
            sx: { backgroundImage: 'none' },
          },
        }}
      >
        <DialogTitle>Reset password</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}
        >
          <DialogContentText>
            Enter your account&apos;s email address, and we&apos;ll send you a link to
            reset your password.
          </DialogContentText>
          {/* Input field for email address */}
          <OutlinedInput
            autoFocus
            required
            margin="dense"
            id="email"
            name="email"
            label="Email address"
            placeholder="Email address"
            type="email"
            fullWidth
            value={email}
            onChange={handleEmailChange}
          />
        </DialogContent>
        <DialogActions sx={{ pb: 3, px: 3 }}>
          {/* Cancel button to close dialog */}
          <Button onClick={handleClose} disabled={isLoading} sx={{ color: '#0F2841' }}>Cancel</Button>
          {/* Submit button to trigger password reset */}
          <Button 
            variant="contained" 
            type="submit"
            disabled={isLoading}
            sx={{ backgroundColor: '#0F2841', '&:hover': { backgroundColor: '#0c1f33' } }}
          >
            {isLoading ? 'Sending...' : 'Continue'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for success or error feedback */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleSnackbarClose}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

// Prop type validation for the component props
ForgotPassword.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

// Export the component for external use
export default ForgotPassword;