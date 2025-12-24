import {
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
} from "@mui/material";

import UploadIcon from "@mui/icons-material/Upload";
import HourglassIcon from "@mui/icons-material/HourglassEmpty";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PaymentsIcon from "@mui/icons-material/Payments";
import CancelIcon from "@mui/icons-material/Cancel";
import InfoIcon from "@mui/icons-material/Info";


type Props = {
  type: string;
  message: string;
  userId: string;
  createdAt: string;
};

function getEventMeta(type: string) {
  switch (type) {
    case "CLAIM_SUBMITTED":
      return { label: "Submitted", color: "info", icon: <UploadIcon /> };

    case "UNDER_REVIEW":
      return { label: "Under Review", color: "warning", icon: <HourglassIcon /> };

    case "APPROVED":
      return { label: "Approved", color: "success", icon: <CheckCircleIcon /> };

    case "PAID":
      return { label: "Payment Issued", color: "success", icon: <PaymentsIcon /> };

    case "REJECTED":
      return { label: "Rejected", color: "error", icon: <CancelIcon /> };

    default:
      return { label: type, color: "default", icon: <InfoIcon /> };
  }
}


export default function ActivityCard({
  type,
  message,
  userId,
  createdAt,
}: Props) {
  const meta = getEventMeta(type);

  return (
    <Card
      elevation={0}
      sx={{
        border: "1px solid #eee",
        borderRadius: 3,
        mb: 2,
        transition: "0.2s",
        "&:hover": {
          boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardContent>
        <Stack direction="row" justifyContent="space-between">
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip
              icon={meta.icon}
              label={meta.label}
              color={meta.color as any}
              size="small"
            />
          </Stack>

          <Typography variant="caption" color="text.secondary">
            {new Date(createdAt).toLocaleString()}
          </Typography>
        </Stack>

        <Typography variant="body1" mt={1} fontWeight={500}>
          {message}
        </Typography>

        <Typography variant="caption" color="text.secondary">
          user: {userId}
        </Typography>
      </CardContent>
    </Card>
  );
}
