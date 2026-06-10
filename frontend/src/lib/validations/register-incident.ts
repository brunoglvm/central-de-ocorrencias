import { z } from "zod";

export const CUSTOM_LOCATION_VALUE = "__custom_location__";

export const registerIncidentSchema = z.object({
  attachmentName: z.string(),
  customLocation: z.string(),
  description: z
    .string()
    .min(10, "Descreva o problema com pelo menos 10 caracteres."),
  location: z.string().min(1, "Selecione o local do problema."),
  title: z
    .string()
    .min(3, "Informe um titulo com pelo menos 3 caracteres."),
  userType: z
    .string()
    .min(1, "Selecione quem esta registrando."),
}).superRefine((values, context) => {
  if (
    values.location === CUSTOM_LOCATION_VALUE &&
    values.customLocation.trim().length < 3
  ) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Informe o local do problema.",
      path: ["customLocation"],
    });
  }
});

export type RegisterIncidentFormValues = z.infer<typeof registerIncidentSchema>;
