// Importing necessary React hooks and MUI components
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

// Custom Google icon
import { GoogleIcon } from "../app/sign-up/components/CustomIcons";

// Firebase utilities for retrieving user info
import { getUserName } from "../components/firebase/firebaseUserName";
import { getUserEmail } from "../components/firebase/firebaseUserEmail";

// Firebase config, authentication, and Firestore
import { auth, db } from "../components/firebase/firebaseConfig";
import {
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  GoogleAuthProvider,
  linkWithPopup,
  unlink,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

// Main Account Profile component
const AccountProfile = () => {
  // State variables for user information and UI interaction
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [summaryPurpose, setSummaryPurpose] = useState("School");
  const [emailUpdates, setEmailUpdates] = useState(false);
  const [googleLinked, setGoogleLinked] = useState(false);

  // Dialog states for editing profile fields
  const [openDialog, setOpenDialog] = useState(null);
  const [newValue, setNewValue] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  // Effect hook to fetch user info and auth status
  useEffect(() => {
    const unsubscribeEmail = getUserEmail(setEmail);
    const unsubscribeName = getUserName(setName);

    // Track auth state
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Reference to Firestore user document
        const userDocRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userDocRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          setEmailUpdates(!!data.emailUpdates);
          if (data.summaryPurpose) {
            setSummaryPurpose(data.summaryPurpose);
          }
        }

        // Check if Google is linked
        const isGoogleLinked = user.providerData.some(
          (provider) => provider.providerId === "google.com"
        );
        setGoogleLinked(isGoogleLinked);
      }
    });

    // Cleanup subscriptions on unmount
    return () => {
      unsubscribeEmail();
      unsubscribeName();
      unsubscribeAuth();
    };
  }, []);

  // Handle email update preference change
  const handleEmailUpdatesChange = async (value) => {
    setEmailUpdates(value);
    const user = auth.currentUser;
    if (!user) return;
    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, { emailUpdates: value });
    } catch (err) {
      console.error("Failed to update email preference:", err);
    }
  };

  // Handle summary purpose dropdown selection
  const handleSummaryPurposeChange = async (value) => {
    setSummaryPurpose(value);
    const user = auth.currentUser;
    if (!user) return;
    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, { summaryPurpose: value });
    } catch (err) {
      console.error("Failed to update summary purpose:", err);
    }
  };

  // Open modal dialog
  const handleOpen = (field) => {
    setOpenDialog(field);
    setNewValue("");
    setCurrentPassword("");
  };

  // Close modal dialog
  const handleClose = () => {
    setOpenDialog(null);
    setNewValue("");
    setCurrentPassword("");
  };

  // Handle saving updated name or password
  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const trimmedValue = newValue.trim();
    const userDocRef = doc(db, "users", user.uid);

    try {
      // Handle name update
      if (openDialog === "name") {
        if (!trimmedValue) {
          alert("Name cannot be empty.");
          return;
        }
        await updateDoc(userDocRef, { name: trimmedValue });
        setName(trimmedValue);
      }

      // Handle password update
      if (openDialog === "password") {
        if (!currentPassword || currentPassword.length < 6) {
          alert("Please enter your current password.");
          return;
        }
        if (trimmedValue.length < 6) {
          alert("New password must be at least 6 characters.");
          return;
        }

        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, trimmedValue);
        alert("Password updated successfully.");
      }

      handleClose();
    } catch (error) {
      console.error("Update failed:", error.message);
      alert(`Failed to update ${openDialog}: ${error.message}`);
    }
  };

  // Handle linking Google account
  const handleLinkGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await linkWithPopup(auth.currentUser, provider);
      setGoogleLinked(true);
      alert("Google account linked successfully.");
    } catch (error) {
      console.error("Linking failed:", error.message);
      alert(`Link failed: ${error.message}`);
    }
  };

  // Handle unlinking Google account
  const handleUnlinkGoogle = async () => {
    try {
      await unlink(auth.currentUser, "google.com");
      setGoogleLinked(false);
      alert("Google account unlinked successfully.");
    } catch (error) {
      console.error("Unlinking failed:", error.message);
      alert(`Unlink failed: ${error.message}`);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography variant="h3" fontWeight="bold">Profile</Typography>
      </Box>

      {/* Account info */}
      <InfoRow label="Name" value={name} onClick={() => handleOpen("name")} />
      <InfoRow label="Email" value={email} showUpdate={false} />
      <InfoRow label="Password" value="••••••" onClick={() => handleOpen("password")} />

      {/* Linked account */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>Linked Accounts</Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <GoogleIcon />
            <Typography>Google</Typography>
          </Box>
          {googleLinked ? (
            <ActionButton label="Unlink" onClick={handleUnlinkGoogle} />
          ) : (
            <ActionButton label="Link" onClick={handleLinkGoogle} />
          )}
        </Box>
      </Box>

      {/* Email preferences */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>Email Preferences</Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <FormControlLabel
            control={<Checkbox checked={emailUpdates} onChange={(e) => handleEmailUpdatesChange(e.target.checked)} />}
            label="Yes, I want to receive email updates"
          />
          <FormControlLabel
            control={<Checkbox checked={!emailUpdates} onChange={(e) => handleEmailUpdatesChange(!e.target.checked)} />}
            label="No, I don't want email updates"
          />
        </Box>
      </Box>

      {/* Summary purpose */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>About You</Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          Understanding how you use our service helps us develop features tailored to your summarizing needs.
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="body1">Most of my summarizing is for:</Typography>
          <FormControl sx={{ minWidth: 200 }}>
            <Select
              value={summaryPurpose}
              onChange={(e) => handleSummaryPurposeChange(e.target.value)}
              size="small"
            >
              <MenuItem value="School">School</MenuItem>
              <MenuItem value="Researcher">Researcher</MenuItem>
              <MenuItem value="Reader">Reader</MenuItem>
              <MenuItem value="Professional">Professional</MenuItem>
              <MenuItem value="Personal">Personal</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Edit dialog */}
      <Dialog open={!!openDialog} onClose={handleClose}>
        <DialogTitle>Update {openDialog}</DialogTitle>
        <DialogContent>
          {openDialog === "password" && (
            <>
              <TextField
                margin="dense"
                label="Current Password"
                type="password"
                fullWidth
                variant="outlined"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <TextField
                margin="dense"
                label="New Password"
                type="password"
                fullWidth
                variant="outlined"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
              />
            </>
          )}
          {openDialog === "name" && (
            <TextField
              autoFocus
              margin="dense"
              label="New Name"
              type="text"
              fullWidth
              variant="outlined"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} sx={{ color: "#0F2841" }}>
            CANCEL
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{ backgroundColor: "#0F2841", color: "#fff" }}
          >
            UPDATE
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Reusable row component for displaying profile fields
const InfoRow = ({ label, value, onClick, showUpdate = true }) => (
  <Box sx={{ mb: 4 }}>
    <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>{label}</Typography>
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Typography variant="h6">{value || "—"}</Typography>
      {showUpdate && <ActionButton label="Update" onClick={onClick} />}
    </Box>
  </Box>
);

// Reusable button
const ActionButton = ({ label, icon, width = 80, onClick }) => (
  <Button
    variant="outlined"
    color="inherit"
    size="small"
    onClick={onClick}
    sx={{
      textTransform: "none",
      borderRadius: "4px",
      minWidth: `${width}px`,
    }}
    endIcon={icon}
  >
    {label}
  </Button>
);

export default AccountProfile;
