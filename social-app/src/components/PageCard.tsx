import { FC } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  CardActions,
} from "@mui/material";
import LikeButton from "./LikeButton";

interface PageCardProps {
  commentId: number;
  userId: number;
  userAnswered: string;
  description: string;
  dateCreated: string;
  handleDelete: () => void;
}

const PageCard: FC<PageCardProps> = ({
  commentId,
  userAnswered,
  description,
  dateCreated,
}) => {
  return (
    <Box marginBottom="40px" position={"relative"} width={"100%"}>
      <Box
        sx={{
          position: "absolute",
          right: "0px",
          top: "0px",
          justifyContent: "center",
          alignItems: "center",
        }}
      ></Box>

      <Card>
        <CardContent>
          <Typography variant="body2">Posted by: {userAnswered}</Typography>
          <Typography variant="subtitle2" marginBottom={"20px"}>
            {dateCreated}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {description}
          </Typography>
        </CardContent>
        <CardActions>
          <LikeButton initialLikes={0} commentId={commentId} />
        </CardActions>
      </Card>
    </Box>
  );
};

export default PageCard;
