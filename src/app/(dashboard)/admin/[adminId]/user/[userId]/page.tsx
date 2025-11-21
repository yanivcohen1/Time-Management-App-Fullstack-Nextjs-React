"use client";

import { Paper, Stack, Typography } from "@mui/material";
import { useParams, useSearchParams } from "next/navigation";
import { AdminPageLayout } from "../../../page";

const getQueryValue = (searchParams: ReturnType<typeof useSearchParams>, key: string) => {
  const value = searchParams.getAll(key);
  if (value.length === 0) {
    return "Not provided";
  }
  return value.join(", ");
};

export default function AdminUserPage() {
  const params = useParams<{ adminId?: string; userId?: string }>();
  const searchParams = useSearchParams();
  const adminId = params?.adminId ?? "Unknown";
  const userId = params?.userId ?? "Unknown";
  const queryId = getQueryValue(searchParams, "id");
  const queryName = getQueryValue(searchParams, "name");

  return (
    <AdminPageLayout>
      <Stack spacing={2}>
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Stack spacing={1}>
            <Typography variant="h4" fontWeight={700}>
              Admin details
            </Typography>
            <Typography variant="body1">Admin id from path: {adminId}</Typography>
            <Typography variant="body2" color="text.secondary">
              The breadcrumb command navigates here via /admin/3/user/2?id=1&name=yar, so this section shows admin id:3 for that URL.
            </Typography>
          </Stack>
        </Paper>

        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Stack spacing={1}>
            <Typography variant="h4" fontWeight={700}>
              User details
            </Typography>
            <Typography variant="body1">User id from path: {userId}</Typography>
            <Typography variant="body2" color="text.secondary">
              Query parameters
            </Typography>
            <Typography variant="body2">id: {queryId}</Typography>
            <Typography variant="body2">name: {queryName}</Typography>
          </Stack>
        </Paper>
      </Stack>
    </AdminPageLayout>
  );
}
