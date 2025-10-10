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
} from "@mui/material";
import { Work, Delete as DeleteIcon } from "@mui/icons-material";
import api from "../api/axios";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects");
      setProjects(res.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.description.trim()) return;
    try {
      await api.post("/projects", form);
      setForm({ name: "", description: "" });
      fetchProjects();
    } catch (error) {
      console.error("Error adding project:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/projects/${id}`);
      fetchProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
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
            background: "linear-gradient(90deg, #1e3a8a, #3b82f6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Project Management
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={2}>
          Add, manage, and remove projects for your organization.
        </Typography>

        <Divider sx={{ mb: 3 }} />

        {/* Form Section */}
        <Box display="flex" flexWrap="wrap" gap={2} alignItems="center" mb={3}>
          <TextField
            label="Project Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            sx={{ flex: 1, minWidth: 200 }}
          />
          <TextField
            label="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            sx={{ flex: 1, minWidth: 200 }}
          />
          <Button
            variant="contained"
            startIcon={<Work />}
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
                <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.length > 0 ? (
                projects.map((p) => (
                  <TableRow key={p._id} hover>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>{p.description}</TableCell>
                    <TableCell>
                      <Button
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDelete(p._id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No projects found.
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

export default Projects;
