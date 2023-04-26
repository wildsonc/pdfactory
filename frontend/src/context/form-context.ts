import { createFormContext } from "@mantine/form";

interface TemplateFormValues {
  id?: number;
  name: string;
  html: string;
  css: string;
  json: string;
  settings: { [key: string]: any };
}

export const [TemplateFormProvider, useTemplateFormContext, useTemplateForm] = createFormContext<TemplateFormValues>();
