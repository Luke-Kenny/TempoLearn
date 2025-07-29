export const postCustomNotes = async ({
  uid,
  materialId,
  parsedText,
}: {
  uid: string;
  materialId: string;
  parsedText: string;
}) => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/custom-notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ uid, materialId, parsedText }),
  });

  if (!res.ok) throw new Error("Failed to generate custom notes");
  return res.json();
};
