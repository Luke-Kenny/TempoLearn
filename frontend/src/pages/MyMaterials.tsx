import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Divider,
  Button,
} from "@mui/material";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useAuth } from "../context/AuthContext";
import ResponsiveAppBar from "../components/ResponsiveAppBar";
import dayjs from "dayjs";

interface Material {
  id: string;
  topic: string;
  fileName: string;
  deadline: any;
  uploadedAt: any;
  textContent?: string;
}

const MyMaterials: React.FC = () => {
  const { user } = useAuth();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMaterials = async () => {
      if (!user) return;

      try {
        const q = query(
          collection(db, "study_materials"),
          where("uid", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        const fetched: Material[] = [];
        querySnapshot.forEach((doc) => {
          fetched.push({ id: doc.id, ...doc.data() } as Material);
        });
        setMaterials(fetched);
      } catch (error) {
        console.error("Failed to fetch materials:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, [user]);

  return (
    <Box sx={{ backgroundColor: "#0f172a", minHeight: "100vh", pb: 6 }}>
      <ResponsiveAppBar />
      <Box sx={{ maxWidth: 900, mx: "auto", pt: 12, px: 3 }}>
        <Typography
          variant="h4"
          sx={{
            color: "#ffffff",
            fontWeight: 600,
            mb: 4,
            textAlign: "center",
          }}
        >
          Your Uploaded Study Materials
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" mt={6}>
            <CircularProgress color="inherit" />
          </Box>
        ) : materials.length === 0 ? (
          <Typography
            variant="body1"
            color="gray"
            textAlign="center"
            mt={6}
          >
            No study materials uploaded yet.
          </Typography>
        ) : (
          materials.map((item) => (
            <Paper
              key={item.id}
              elevation={5}
              sx={{
                backgroundColor: "#1e293b",
                color: "#f1f5f9",
                p: 3,
                mb: 3,
                borderRadius: 3,
              }}
            >
              <Typography variant="h6" fontWeight={600}>
                📚 {item.topic}
              </Typography>
              <Typography variant="body2" color="#cbd5e1" mb={1}>
                File: {item.fileName}
              </Typography>
              <Typography variant="body2" color="#cbd5e1">
                Deadline: {dayjs(item.deadline?.toDate()).format("DD MMM YYYY, HH:mm")}
              </Typography>
              <Typography variant="body2" color="#cbd5e1" mb={2}>
                Uploaded: {dayjs(item.uploadedAt?.toDate()).format("DD MMM YYYY, HH:mm")}
              </Typography>

              {item.textContent && (
                <>
                  <Divider sx={{ my: 2, borderColor: "#334155" }} />
                  <Typography variant="subtitle2" color="#94a3b8" mb={1}>
                    Preview Extract:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      backgroundColor: "#0f172a",
                      borderRadius: 2,
                      p: 2,
                      color: "#e2e8f0",
                      fontSize: "0.9rem",
                      lineHeight: 1.5,
                    }}
                  >
                    {item.textContent.slice(0, 300)}...
                  </Typography>
                </>
              )}

              <Box sx={{ mt: 2, textAlign: "right" }}>
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    backgroundColor: "#3b82f6",
                    textTransform: "none",
                    "&:hover": { backgroundColor: "#2563eb" },
                  }}
                >
                  Generate Quiz
                </Button>
              </Box>
            </Paper>
          ))
        )}
      </Box>
    </Box>
  );
};

export default MyMaterials;
