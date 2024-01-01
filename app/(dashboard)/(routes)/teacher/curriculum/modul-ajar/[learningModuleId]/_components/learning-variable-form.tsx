import { LearningModule } from '@prisma/client';
import * as z from 'zod';
interface LearningVariableFormProps {
  initialData: LearningModule;
}
const formSchema = z.object({
  material: z.string().min(1),
  modaId: z.string().min(1),
  model: z.string().min(1),
  numOfMeeting: z.coerce.number(),
  learningHours: z.coerce.number(),
  studentTargetId: z.string().min(1),
  method: z.string().min(1),
});
export const LearningVariableForm = () => {
  return <div>New</div>;
};
