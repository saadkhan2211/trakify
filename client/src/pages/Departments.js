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
import { Business, Delete as DeleteIcon } from "@mui/icons-material";
import { Toaster, toast } from "react-hot-toast";
import api from "../api/axios";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState("");

  // 🧩 Fetch Departments
  const fetchDepartments = async () => {
    try {
      const res = await api.get("/departments");
      setDepartments(res.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast.error("Failed to fetch departments.");
    }
  };

  // ➕ Add Department
  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Please enter a department name.");
      return;
    }

    try {
      await api.post("/departments", { name });
      toast.success("Department added successfully!");
      setName("");
      fetchDepartments();
    } catch (error) {
      console.error("Error adding department:", error);
      toast.error(error.response?.data?.message || "Error adding department.");
    }
  };

  // ❌ Delete Department
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this department?"))
      return;

    try {
      await api.delete(`/departments/${id}`);
      toast.success("Department deleted.");
      fetchDepartments();
    } catch (error) {
      console.error("Error deleting department:", error);
      toast.error("Failed to delete department.");
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 5 }}>
      <Toaster position="top-right" reverseOrder={false} />

      <Card
        elevation={4}
        sx={{
          borderRadius: 3,
          background: "linear-gradient(135deg, #f8fafc, #f1f5f9)",
          p: 3,
        }}
      >
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
          Department Management
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={2}>
          Add or remove departments for your organization.
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Box display="flex" flexWrap="wrap" gap={2} alignItems="center" mb={3}>
          <TextField
            label="Department Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ flex: 1, minWidth: 200 }}
          />
          <Button
            variant="contained"
            startIcon={<Business />}
            onClick={handleSubmit}
            sx={{
              px: 3,
              py: 1,
              fontWeight: 600,
              background: "linear-gradient(90deg, #1e40af, #3b82f6)",
              "&:hover": {
                background: "linear-gradient(90deg, #1e3a8a, #2563eb)",
              },
            }}
          >
            Add
          </Button>
        </Box>

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
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {departments.length > 0 ? (
                departments.map((dept) => (
                  <TableRow key={dept._id} hover>
                    <TableCell>{dept.name}</TableCell>
                    <TableCell>
                      <Button
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDelete(dept._id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    No departments found.
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

export default Departments;
