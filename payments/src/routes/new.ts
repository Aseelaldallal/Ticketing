import express, { Request, Response } from 'express';
import { requireAuth, validateRequest, BadRequestError, NotFoundError } from '@gettix/common';
import { body } from 'express-validator';

const router = express.Router();

router.post(
  '/api/payments',
  requireAuth,
  [body('token').not().isEmpty(), body('orderId').not().isEmpty()],
  async (req: Request, res: Response) => {
    res.send({ sucess: true });
  }
);

export { router as CreateChargeRouter };
