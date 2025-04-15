"use client"

import { useState } from "react"
import { Box, Typography, Button, Select, MenuItem, FormControl } from "@mui/material"
import GoogleIcon from "@mui/icons-material/Google"
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder"
import OpenInNewIcon from "@mui/icons-material/OpenInNew"

const AccountProfile = () => {
  const [name, setName] = useState("Name")
  const [email, setEmail] = useState("email")
  const [writingPurpose, setWritingPurpose] = useState("School")

  return (
    <Box sx={{ maxWidth: 800, width: "100%" }}>
      {/* Header with bookmark */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Profile
        </Typography>
        <BookmarkBorderIcon sx={{ color: "text.secondary", cursor: "pointer" }} />
      </Box>

      {/* Name Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
          Name
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6">{name}</Typography>
          <Button
            variant="outlined"
            color="inherit"
            size="small"
            sx={{
              textTransform: "none",
              borderRadius: "4px",
              minWidth: "80px",
            }}
          >
            Update
          </Button>
        </Box>
      </Box>

      {/* Email Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
          Email
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6">{email}</Typography>
          <Button
            variant="outlined"
            color="inherit"
            size="small"
            sx={{
              textTransform: "none",
              borderRadius: "4px",
              minWidth: "80px",
            }}
          >
            Update
          </Button>
        </Box>
      </Box>

      {/* Password Section */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
          Password
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6">••••••</Typography>
          <Button
            variant="outlined"
            color="inherit"
            size="small"
            sx={{
              textTransform: "none",
              borderRadius: "4px",
              minWidth: "80px",
            }}
          >
            Update
          </Button>
        </Box>
      </Box>

      {/* Linked Accounts */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
          Linked Accounts
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <GoogleIcon sx={{ color: "#4285F4", mr: 1 }} />
            <Typography>Google</Typography>
          </Box>
          <Button
            variant="outlined"
            color="inherit"
            size="small"
            sx={{
              textTransform: "none",
              borderRadius: "4px",
              minWidth: "80px",
            }}
          >
            Unlink
          </Button>
        </Box>
      </Box>

      {/* Email Preferences */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
          Email Preferences
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="body1">Choose the types of emails you want to receive.</Typography>
          <Button
            variant="outlined"
            color="inherit"
            size="small"
            sx={{
              textTransform: "none",
              borderRadius: "4px",
              minWidth: "140px",
            }}
            endIcon={<OpenInNewIcon fontSize="small" />}
          >
            Update preference
          </Button>
        </Box>
      </Box>

      {/* About You */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
          About You
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          Understanding how you use our service helps us develop features tailored to your writing needs.
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="body1">Most of my writing is for:</Typography>
          <FormControl sx={{ minWidth: 200 }}>
            <Select
              value={writingPurpose}
              onChange={(e) => setWritingPurpose(e.target.value)}
              displayEmpty
              size="small"
            >
              <MenuItem value="School">School</MenuItem>
              <MenuItem value="Work">Work</MenuItem>
              <MenuItem value="Personal">Personal</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
    </Box>
  )
}

export default AccountProfile
