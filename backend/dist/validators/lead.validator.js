"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLeadValidator = exports.createLeadValidator = void 0;
const zod_1 = require("zod");
exports.createLeadValidator = zod_1.z.object({
    name: zod_1.z
        .string({ required_error: 'Name is required' })
        .trim()
        .min(2, 'Name must be at least 2 characters'),
    email: zod_1.z
        .string({ required_error: 'Email is required' })
        .trim()
        .email('Please enter a valid email address'),
    status: zod_1.z
        .enum(['New', 'Contacted', 'Qualified', 'Lost'], {
        errorMap: () => ({
            message: 'Status must be New, Contacted, Qualified, or Lost',
        }),
    })
        .default('New'),
    source: zod_1.z.enum(['Website', 'Instagram', 'Referral'], {
        errorMap: (issue) => {
            if (issue.code === 'invalid_enum_value') {
                return { message: 'Source must be Website, Instagram, or Referral' };
            }
            return { message: 'Source is required' };
        },
    }),
});
exports.updateLeadValidator = exports.createLeadValidator.partial();
