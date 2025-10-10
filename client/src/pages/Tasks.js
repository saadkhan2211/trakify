import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Box,
  MenuItem,
  Select,
  IconButton,
  Stack,
} from "@mui/material";
import { Delete as DeleteIcon, AddTask as TaskIcon } from "@mui/icons-material";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import toast from "react-hot-toast";
import api from "../api/axios";

const STATUSES = ["Pending", "In Progress", "Completed"];

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
      toast.error("Failed to fetch tasks");
      console.error("Error fetching tasks:", error);
    }
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) return toast.error("Task title required");

    try {
      const res = await api.post("/tasks", form);
      if (res.status === 201) {
        toast.success("Task created");
        setForm({ title: "", description: "", status: "Pending" });
        fetchTasks();
      }
    } catch (error) {
      toast.error("Failed to add task");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await api.delete(`/tasks/${id}`);
      if (res.status === 200) {
        toast.success("Task deleted");
        fetchTasks();
      }
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;

    setTasks((prev) =>
      prev.map((task) =>
        task._id === draggableId
          ? { ...task, status: destination.droppableId }
          : task
      )
    );

    try {
      const res = await api.patch(`/tasks/${draggableId}`, {
        status: destination.droppableId,
      });

      if (res.status === 200) toast.success("Task moved");
    } catch (error) {
      console.log(error);

      toast.error("Failed to update task");
      fetchTasks();
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <Container maxWidth="xl" sx={{ mt: 5, mb: 5 }}>
      <Typography
        variant="h4"
        fontWeight={700}
        gutterBottom
        sx={{
          background: "linear-gradient(90deg, #1e40af, #3b82f6)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Task Board
      </Typography>

      <Typography variant="body2" color="text.secondary" mb={3}>
        Manage and move tasks easily between stages, just like Trello.
      </Typography>

      {/* Add Task Form */}
      <Card sx={{ p: 2, mb: 4, borderRadius: 3 }}>
        <Box display="flex" flexWrap="wrap" gap={2} alignItems="center">
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
            sx={{ flex: 2, minWidth: 200 }}
          />
          <Select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            sx={{ minWidth: 150 }}
          >
            {STATUSES.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
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
            Add Task
          </Button>
        </Box>
      </Card>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Stack direction="row" spacing={3} justifyContent="space-between">
          {STATUSES.map((status) => (
            <Droppable droppableId={status} key={status}>
              {(provided) => (
                <Box
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  sx={{
                    flex: 1,
                    backgroundColor: "#f8fafc",
                    borderRadius: 3,
                    p: 2,
                    minHeight: "70vh",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    mb={2}
                    sx={{
                      color:
                        status === "Pending"
                          ? "#6b7280"
                          : status === "In Progress"
                          ? "#f59e0b"
                          : "#16a34a",
                    }}
                  >
                    {status}
                  </Typography>

                  {tasks
                    .filter((t) => t.status === status)
                    .map((t, index) => (
                      <Draggable key={t._id} draggableId={t._id} index={index}>
                        {(provided) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{
                              mb: 2,
                              p: 2,
                              borderRadius: 2,
                              cursor: "grab",
                              transition: "0.2s",
                              "&:hover": { boxShadow: "0 4px 12px #00000020" },
                            }}
                          >
                            <CardContent sx={{ p: "8px !important" }}>
                              <Typography
                                variant="subtitle1"
                                fontWeight={600}
                                gutterBottom
                              >
                                {t.title}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                gutterBottom
                              >
                                {t.description}
                              </Typography>
                              <Box display="flex" justifyContent="flex-end">
                                <IconButton
                                  color="error"
                                  onClick={() => handleDelete(t._id)}
                                  size="small"
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          ))}
        </Stack>
      </DragDropContext>
    </Container>
  );
};

export default Tasks;
