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
  Box,
  Card,
  Divider,
  MenuItem,
  Select,
} from "@mui/material";
import { TaskAlt as TaskIcon, Delete as DeleteIcon } from "@mui/icons-material";
import api from "../api/axios";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "Pending",
  });

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.description.trim()) return;
    try {
      await api.post("/tasks", form);
      setForm({ title: "", description: "", status: "Pending" });
      fetchTasks();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 5 }}>
      <Card
        elevation={4}
        sx={{
          borderRadius: 3,
          background: "linear-gradient(135deg, #f8fafc, #f1f5f9)",
          p: 3,
        }}
      >
        {/* Header */}
        <Typography
          variant="h4"
          fontWeight={600}
          gutterBottom
          sx={{
            background: "linear-gradient(90deg, #1e40af, #3b82f6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Task Management
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={2}>
          Create, manage, and track tasks across your organization.
        </Typography>

        <Divider sx={{ mb: 3 }} />

        {/* Form Section */}
        <Box
          display="flex"
          flexWrap="wrap"
          gap={2}
          alignItems="center"
          mb={3}
          sx={{ mt: 2 }}
        >
          <TextField
            label="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            sx={{ flex: 1, minWidth: 200 }}
          />
          <TextField
            label="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            sx={{ flex: 1, minWidth: 200 }}
          />
          <Select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </Select>
          <Button
            variant="contained"
            startIcon={<TaskIcon />}
            onClick={handleSubmit}
            sx={{
              px: 3,
              py: 1,
              fontWeight: 600,
              background: "linear-gradient(90deg, #1e3a8a, #3b82f6)",
              "&:hover": {
                background: "linear-gradient(90deg, #1e40af, #2563eb)",
              },
            }}
          >
            Add
          </Button>
        </Box>

        {/* Table Section */}
        <Paper
          sx={{
            mt: 2,
            overflow: "hidden",
            borderRadius: 3,
            boxShadow: "0px 2px 10px rgba(0,0,0,0.05)",
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f1f5f9" }}>
                <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.length > 0 ? (
                tasks.map((t) => (
                  <TableRow key={t._id} hover>
                    <TableCell>{t.title}</TableCell>
                    <TableCell>{t.description}</TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color:
                            t.status === "Completed"
                              ? "green"
                              : t.status === "In Progress"
                              ? "orange"
                              : "gray",
                        }}
                      >
                        {t.status}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Button
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDelete(t._id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No tasks found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
      </Card>
    </Container>
  );
};

export default Tasks;
