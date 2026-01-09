import { z } from 'zod';

export const collegeSchema = z.object({
    name: z.string().min(2),
    city: z.string().min(2),
});

export type CollegeInput = z.infer<typeof collegeSchema>;
