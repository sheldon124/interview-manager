import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Snackbar,
  Alert,
  SnackbarCloseReason,
  Chip,
} from "@mui/material";
import { AxiosError } from "axios";
import { SelectChangeEvent } from "@mui/material/Select";
import Autocomplete from "@mui/material/Autocomplete";
import moment from "moment";
import axios from "axios";

interface FormData {
  date: string;
  time: string;
  durationValue: string;
  durationUnit: "minutes" | "hours";
  department: string;
  interviewers: string;
  interviewee: string;
  role: string;
  notes: string;
  email?: string; // Optional email field
  phone?: string; // Optional phone number field
}

interface Interview {
  id: number | null;
  interviewee: string;
  date: string;
  time: string;
  duration: string;
  department: string;
  role: string;
  interviewer: string;
  additional_notes: string;
  email: string;
  phone: string;
}

interface InterviewFormProps {
  postApiCallback: (message: string, interviewDataObj: any) => void;
  currId: number | null;
  register: boolean;
  interviewData: Interview | null;
}

interface ErrorResponse {
  [key: string]: string[];
}

function convertDuration(duration: string): [string, "hours" | "minutes"] {
  // Split the duration string into hours and minutes
  const [hours, minutes] = duration.split(":").map(Number);

  // If there are no minutes, return the duration in hours
  if (minutes === 0) {
    return [`${hours}`, "hours"];
  }

  // Otherwise, return the total minutes
  const totalMinutes = hours * 60 + minutes;
  return [`${totalMinutes}`, "minutes"];
}

const InterviewForm: React.FC<InterviewFormProps> = ({
  postApiCallback,
  currId,
  register,
  interviewData,
}) => {
  const [formData, setFormData] = useState<FormData>({
    date: "",
    time: "",
    durationValue: "",
    durationUnit: "minutes",
    department: "",
    interviewers: "",
    interviewee: "",
    role: "",
    notes: "",
    email: "", // Default value for email
    phone: "", // Default value for phone
  });

  const [userSuggestions, setUserSuggestions] = useState<any[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [activeField, setActiveField] = useState<string>("");
  const [loading, setLoading] = useState(false); // Loading state
  const [open, setOpen] = useState(false);

  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (interviewData) {
      // Pre-fill the form data when editing an existing interview
      setFormData({
        date: interviewData.date,
        time: moment(interviewData.time, "HH:mm:ss").format("HH:mm"),
        durationValue: interviewData.duration
          ? convertDuration(interviewData.duration)[0]
          : "",
        durationUnit: interviewData.duration
          ? convertDuration(interviewData.duration)[1]
          : "minutes",
        department: interviewData.department || "",
        interviewers: interviewData.interviewer || "",
        interviewee: interviewData.interviewee,
        role: interviewData.role,
        notes: interviewData.additional_notes,
        email: interviewData.email || "",
        phone: interviewData.phone || "",
      });
    } else {
      // Initialize form data with default values when creating a new interview
      setFormData({
        date: "",
        time: "",
        durationValue: "",
        durationUnit: "minutes",
        department: "",
        interviewers: "",
        interviewee: "",
        role: "",
        notes: "",
        email: "",
        phone: "",
      });
    }
  }, [interviewData]);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setApiError(null);

    setOpen(false);
  };

  // Fetch suggestions from backend
  const fetchSuggestions = async (query: string) => {
    if (!query) {
      setUserSuggestions([]);
      return;
    }

    setLoadingSuggestions(true);
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/users/search/?q=${query}`
      );
      setUserSuggestions(response.data.users || []); // Use correct response key
    } catch (error) {
      console.error("Error fetching user suggestions:", error);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name && name in formData) {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    if (name && name in formData) {
      setFormData({ ...formData, [name]: value });
    }
  };

  const registerInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when starting the API call

    // Formatting time using moment.js
    const formattedTime = moment(formData.time, "HH:mm").format("HH:mm:ss");
    const durationInHours =
      formData.durationUnit === "minutes"
        ? `${Math.floor(Number(formData.durationValue) / 60)
            .toString()
            .padStart(2, "0")}:${(Number(formData.durationValue) % 60)
            .toString()
            .padStart(2, "0")}:00`
        : `${formData.durationValue.padStart(2, "0")}:00:00`;

    const requestBody = {
      interviewee: formData.interviewee,
      date: formData.date,
      time: formattedTime,
      duration: durationInHours,
      role: formData.role,
      department: formData.department,
      interviewer: formData.interviewers,
      job_title: formData.role,
      business_area: "Development", // Placeholder value
      additional_notes: formData.notes,
      email: formData.email || "", // Include email if available
      phone: formData.phone || "", // Include phone number if available
    };

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/interview/schedule/",
        requestBody
      );
      const interviewData: Interview = {
        id: currId ? currId + 1 : null, // Set a default value if `id` is not available; adjust if needed
        interviewee: requestBody.interviewee,
        date: requestBody.date,
        time: requestBody.time,
        duration: requestBody.duration,
        role: requestBody.role,
        department: requestBody.department,
        interviewer: requestBody.interviewer,
        email: requestBody.email,
        phone: requestBody.phone,
        additional_notes: requestBody.additional_notes,
      };
      postApiCallback("success", interviewData); // Call the onSuccess callback
    } catch (error) {
      console.error("Error scheduling interview:", error);

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        if (axiosError.response && axiosError.response.data) {
          // Backend validation errors
          const errorData = axiosError.response.data;

          // Format errors into a readable string
          const formattedErrors = Object.keys(errorData)
            .map((key) => `<strong>${key}</strong>: ${errorData[key][0]}`)
            .join("<br />");

          setApiError(formattedErrors);
        } else if (axiosError.request) {
          // No response received (network error)
          setApiError("Network error. Please check your internet connection.");
        } else {
          // Unknown Axios error
          setApiError("An unexpected error occurred. Please try again.");
        }
      } else {
        // Handle non-Axios errors
        setApiError("An unknown error occurred. Please try again.");
      }

      setOpen(true); // Open the Snackbar

      const emptyInterview: Interview = {
        id: null,
        interviewee: "",
        date: "",
        time: "",
        duration: "",
        role: "",
        department: "",
        interviewer: "",
        email: "",
        phone: "",
        additional_notes: "",
      };

      // postApiCallback(
      //   "Error scheduling interview. Please try again later.",
      //   emptyInterview
      // );
    } finally {
      setLoading(false); // Set loading to false when the API call is finished
    }
  };

  const modifyInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when starting the API call

    // Formatting time using moment.js
    const formattedTime = moment(formData.time, "HH:mm").format("HH:mm:ss");
    const durationInHours =
      formData.durationUnit === "minutes"
        ? `${Math.floor(Number(formData.durationValue) / 60)
            .toString()
            .padStart(2, "0")}:${(Number(formData.durationValue) % 60)
            .toString()
            .padStart(2, "0")}:00`
        : `${formData.durationValue.padStart(2, "0")}:00:00`;

    // Initialize the request body with only changed fields
    const updatedFields: Record<string, any> = {};

    if (formData.interviewee !== interviewData?.interviewee) {
      updatedFields.interviewee = formData.interviewee;
    }
    if (formData.date !== interviewData?.date) {
      updatedFields.date = formData.date;
    }
    if (formData.time !== interviewData?.time) {
      updatedFields.time = formattedTime;
    }

    // Correct the duration comparison (convert strings to numbers before arithmetic operation)
    const currentDurationInMinutes = interviewData?.duration
      ? Number(interviewData.duration.split(":")[0]) * 60 +
        Number(interviewData.duration.split(":")[1])
      : 0;

    if (Number(formData.durationValue) !== currentDurationInMinutes) {
      updatedFields.duration = durationInHours;
    }

    if (formData.role !== interviewData?.role) {
      updatedFields.role = formData.role;
    }
    if (formData.interviewers !== interviewData?.interviewer) {
      updatedFields.interviewer = formData.interviewers;
    }
    if (formData.notes !== interviewData?.additional_notes) {
      updatedFields.additional_notes = formData.notes;
    }
    if (formData.email !== interviewData?.email) {
      updatedFields.email = formData.email;
    }
    if (formData.phone !== interviewData?.phone) {
      updatedFields.phone = formData.phone;
    }

    // Check if there are any changes
    if (Object.keys(updatedFields).length === 0) {
      setLoading(false);
      postApiCallback("No changes detected", null);
      return;
    }

    // Add id to the updated fields to send it in the request URL
    const interviewId = interviewData?.id;

    if (!interviewId) {
      setLoading(false);
      postApiCallback("Interview ID is missing", null);
      return;
    }

    try {
      // Send PATCH request with updated fields
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/interview/${interviewId}/`,
        updatedFields
      );
      postApiCallback("success", response.data.interview); // Call the onSuccess callback
    } catch (error) {
      console.error("Error updating interview:", error);
      postApiCallback(
        "Error updating interview. Please try again later.",
        null
      );
      // Handle error (e.g., show error message)
    } finally {
      setLoading(false); // Set loading to false when the API call is finished
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    if (register) registerInterview(e);
    else modifyInterview(e);
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "auto" }}>
      <Typography variant="h4" gutterBottom>
        {register ? "Schedule an Interview" : "Modify Interview"}
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={1}>
          <Grid item xs={12} container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Date"
                name="date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formData.date}
                onChange={handleInputChange}
                inputProps={{ min: moment().format("YYYY-MM-DD") }}
                required
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Time"
                name="time"
                type="time"
                InputLabelProps={{ shrink: true }}
                value={formData.time}
                onChange={handleInputChange}
                required
              />
            </Grid>
          </Grid>

          <Grid item xs={12} container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Duration"
                name="durationValue"
                type="number"
                value={formData.durationValue}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id="duration-unit-label">Unit</InputLabel>
                <Select
                  labelId="duration-unit-label"
                  name="durationUnit"
                  value={formData.durationUnit}
                  onChange={handleSelectChange}
                  required
                  label="Unit"
                >
                  <MenuItem value="minutes">Minutes</MenuItem>
                  <MenuItem value="hours">Hours</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          {/* Department Dropdown */}

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="department-label" required>
                Department
              </InputLabel>
              <Select
                labelId="department-label"
                name="department"
                value={formData.department}
                onChange={handleSelectChange}
                label="Department"
              >
                <MenuItem value="Software">Software</MenuItem>
                <MenuItem value="Testing">Testing</MenuItem>
                <MenuItem value="Cyber-Security">Cyber-Security</MenuItem>
                <MenuItem value="Finance">Finance</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Interviewers"
              name="interviewers"
              value={formData.interviewers}
              onChange={(e) => {
                const inputValue = e.target.value;
                handleInputChange(e); // Update the input value
                const lastInput = inputValue.split(",").pop()?.trim(); // Get the last typed name
                if (lastInput) fetchSuggestions(lastInput); // Fetch suggestions if last input is not empty
              }}
              onFocus={() => {
                setActiveField("interviewers");
                const lastInput = formData.interviewers
                  .split(",")
                  .pop()
                  ?.trim();
                if (lastInput) fetchSuggestions(lastInput);
              }}
              onBlur={() => {
                setTimeout(() => setActiveField(""), 200);
              }}
              placeholder="Type and press ',' to add multiple interviewers"
            />
            {activeField === "interviewers" && userSuggestions.length > 0 && (
              <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
                {userSuggestions.map((suggestion) => (
                  <Chip
                    key={suggestion.id}
                    label={`${suggestion.first_name} ${suggestion.last_name} (${suggestion.email})`}
                    size="small"
                    onClick={() => {
                      const currentValues = formData.interviewers
                        .split(",")
                        .map((val) => val.trim()); // Split by commas
                      currentValues.pop(); // Remove the last partially typed value
                      const newValue = `${suggestion.email}`; // Use only the email
                      setFormData({
                        ...formData,
                        interviewers: [...currentValues, newValue].join(", "), // Replace the last input with email
                      });
                    }}
                    sx={{ cursor: "pointer" }}
                  />
                ))}
              </Box>
            )}
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Interviewee"
              name="interviewee"
              value={formData.interviewee}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Role/Title"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Additional Notes"
              name="notes"
              value={formData.notes}
              multiline
              rows={3}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading} // Disable button while loading
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "white", mr: 1 }} />
              ) : register ? (
                "Schedule Interview"
              ) : (
                "Modify Interview"
              )}
            </Button>
          </Grid>
        </Grid>
      </form>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          <div
            dangerouslySetInnerHTML={{
              __html: apiError || "",
            }}
          />
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default InterviewForm;
