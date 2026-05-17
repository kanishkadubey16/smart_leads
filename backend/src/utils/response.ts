import type { Response } from 'express';

interface SuccessResponseParams {
  res: Response;
  statusCode?: number;
  message?: string;
  data?: any;
}

interface ErrorResponseParams {
  res: Response;
  statusCode?: number;
  message?: string;
  errors?: any[];
}

export const sendSuccessResponse = ({
  res,
  statusCode = 200,
  message = 'Success',
  data = {},
}: SuccessResponseParams) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendErrorResponse = ({
  res,
  statusCode = 500,
  message = 'Internal Server Error',
  errors,
}: ErrorResponseParams) => {
  const response: any = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};
