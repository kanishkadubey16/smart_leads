import { Router } from 'express';
import {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
  exportLeadsCsv,
} from '../controllers/lead.controller';
import { protect } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createLeadSchema, updateLeadSchema } from '../validators/lead.validator';
import { Role } from '../types';

const router = Router();

// Protect all lead routes
router.use(protect);

router.get('/export/csv', exportLeadsCsv);

router
  .route('/')
  .get(getLeads)
  .post(validate(createLeadSchema), createLead);

router
  .route('/:id')
  .get(getLead)
  .put(validate(updateLeadSchema), updateLead)
  .delete(authorize(Role.ADMIN), deleteLead);

export default router;
