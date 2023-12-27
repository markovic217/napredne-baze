import { Card, CardContent, Typography } from "@mui/material";
import React, { FC } from "react";
import { useNavigate } from "react-router-dom";

interface QuestionCardComponentProps {
  title: string;
  user: string;
  id: number;
}

const QuestionCardComponent: FC<QuestionCardComponentProps> = ({
  title,
  user,
  id,
}) => {
  //const loggedUser = useContext(UserContext);
  const navigate = useNavigate();
  return (
    <Card
      variant="outlined"
      sx={{
        width: {
          xs: 300,
          sm: 550,
          md: 700,
        },
        marginBottom: "20px",
      }}
      onClick={() => {
        navigate(`question/${id}`);
      }}
    >
      <CardContent>
        <Typography variant="h5" component="div">
          {title}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          Question by: {user}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default QuestionCardComponent;
