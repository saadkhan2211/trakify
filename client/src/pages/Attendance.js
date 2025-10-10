import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  Select,
  Box,
  Card,
  CardContent,
  Divider,
  IconButton,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  CheckCircleOutline,
  AccessTime,
} from "@mui/icons-material";
import { Toaster, toast } from "react-hot-toast";
import api from "../api/axios";

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [form, setForm] = useState({ employee: "", status: "Present" });
  const [loading, setLoading] = useState(false);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const res = await api.get("/attendance");
      setAttendance(res.data);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      toast.error("Failed to load attendance data.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.employee.trim()) {
      toast.error("Please enter employee name or ID.");
      return;
    }

    const payload = {
      ...(form.employee.match(/^[0-9a-fA-F]{24}$/)
        ? { employee: form.employee }
        : { employeeName: form.employee }),
      status: form.status,
      date: new Date(),
    };

    try {
      const res = await api.post("/attendance", payload);
      if (res.status === 201) {
        toast.success("Attendance marked successfully!");
        setForm({ employee: "", status: "Present" });
        fetchAttendance();
      }
    } catch (error) {
      console.error("Error submitting attendance:", error);
      toast.error(
        error.response?.data?.message || "Failed to mark attendance."
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/attendance/${id}`);
      toast.success("Attendance deleted.");
      fetchAttendance();
    } catch (error) {
      console.error("Error deleting attendance:", error);
      toast.error("Failed to delete attendance.");
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 5 }}>
      <Toaster position="top-right" />

      <Card
        elevation={5}
        sx={{
          borderRadius: 4,
          background: "linear-gradient(135deg, #f9fafb, #eef2ff)",
          p: 3,
        }}
      >
        <CardContent>
          {/* Header */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
          >
            <Box>
              <Typography
                variant="h4"
                fontWeight={700}
                sx={{
                  background: "linear-gradient(90deg, #2563eb, #60a5fa)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Attendance Tracker
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Easily record and monitor employee attendance in real-time.
              </Typography>
            </Box>
            <AccessTime sx={{ fontSize: 40, color: "#2563eb" }} />
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Form Section */}
          <Box
            display="flex"
            flexWrap="wrap"
            gap={2}
            alignItems="center"
            mb={3}
          >
            <TextField
              label="Employee Name or ID"
              value={form.employee}
              onChange={(e) => setForm({ ...form, employee: e.target.value })}
              sx={{ flex: 1, minWidth: 200 }}
            />
            <Select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              sx={{ width: 160 }}
            >
              <MenuItem value="Present">✅ Present</MenuItem>
              <MenuItem value="Absent">❌ Absent</MenuItem>
            </Select>
            <Button
              variant="contained"
              startIcon={<CheckCircleOutline />}
              onClick={handleSubmit}
              disabled={loading}
              sx={{
                px: 3,
                py: 1,
                fontWeight: 600,
                borderRadius: 2,
                background: "linear-gradient(90deg, #2563eb, #3b82f6)",
                "&:hover": {
                  background: "linear-gradient(90deg, #1d4ed8, #2563eb)",
                },
              }}
            >
              {loading ? "Saving..." : "Mark"}
            </Button>
          </Box>

          {/* Table Section */}
          <Paper
            sx={{
              mt: 2,
              overflow: "hidden",
              borderRadius: 3,
              boxShadow: "0px 2px 12px rgba(0,0,0,0.06)",
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f1f5f9" }}>
                  <TableCell sx={{ fontWeight: 700 }}>Employee</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700, textAlign: "right" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendance.length > 0 ? (
                  attendance.map((a) => (
                    <TableRow
                      key={a._id}
                      hover
                      sx={{
                        transition: "0.2s",
                        "&:hover": {
                          backgroundColor: "#f8fafc",
                        },
                      }}
                    >
                      <TableCell>{a.employee?.name || a.employee}</TableCell>
                      <TableCell>
                        {new Date(a.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell
                        sx={{
                          color:
                            a.status === "Present"
                              ? "success.main"
                              : "error.main",
                          fontWeight: 600,
                        }}
                      >
                        {a.status}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(a._id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                      No attendance records found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Paper>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Attendance;
