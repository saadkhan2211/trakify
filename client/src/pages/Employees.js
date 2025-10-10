import React, { useEffect, useState } from "react";
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
import { PersonAddAlt1, Delete as DeleteIcon } from "@mui/icons-material";
import api from "../api/axios";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", position: "" });

  const fetchEmployees = async () => {
    try {
      const res = await api.get("/employees");
      setEmployees(res.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.position) return;
    try {
      await api.post("/employees", form);
      setForm({ name: "", email: "", position: "" });
      fetchEmployees();
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/employees/${id}`);
      fetchEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
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
        <Typography
          variant="h4"
          fontWeight={600}
          gutterBottom
          sx={{
            background: "linear-gradient(90deg, #2563eb, #60a5fa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Employee Management
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={2}>
          Add, view, and manage all employees in your organization.
        </Typography>

        <Divider sx={{ mb: 3 }} />

        {/* Form */}
        <Box display="flex" flexWrap="wrap" gap={2} alignItems="center" mb={3}>
          <TextField
            label="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            sx={{ flex: 1, minWidth: 200 }}
          />
          <TextField
            label="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            sx={{ flex: 1, minWidth: 200 }}
          />
          <TextField
            label="Position"
            value={form.position}
            onChange={(e) => setForm({ ...form, position: e.target.value })}
            sx={{ flex: 1, minWidth: 200 }}
          />
          <Button
            variant="contained"
            startIcon={<PersonAddAlt1 />}
            onClick={handleSubmit}
            sx={{
              px: 3,
              py: 1,
              fontWeight: 600,
              background: "linear-gradient(90deg, #2563eb, #60a5fa)",
              "&:hover": {
                background: "linear-gradient(90deg, #1d4ed8, #3b82f6)",
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
                <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Position</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.length > 0 ? (
                employees.map((emp) => (
                  <TableRow key={emp._id} hover>
                    <TableCell>{emp.name}</TableCell>
                    <TableCell>{emp.email}</TableCell>
                    <TableCell>{emp.position}</TableCell>
                    <TableCell>
                      <Button
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDelete(emp._id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No employees found.
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

export default Employees;
