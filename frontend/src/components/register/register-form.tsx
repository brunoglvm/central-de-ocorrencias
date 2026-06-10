"use client";

import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { incidentLocations } from "@/constants/incidents";
import { AttachmentDropzone } from "@/components/register/attachment-dropzone";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, type SelectOption } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  CUSTOM_LOCATION_VALUE,
  type RegisterIncidentFormValues,
  registerIncidentSchema,
} from "@/lib/validations/register-incident";

const locationOptions: SelectOption[] = [
  ...incidentLocations.map((location) => ({
    label: location,
    value: location,
  })),
  {
    label: "Outro local",
    value: CUSTOM_LOCATION_VALUE,
  },
];

const userTypeOptions: SelectOption[] = [
  { label: "Morador", value: "resident" },
  { label: "Funcionário", value: "staff" },
];

const initialForm: RegisterIncidentFormValues = {
  attachmentName: "",
  customLocation: "",
  description: "",
  location: "",
  title: "",
  userType: "",
};

export function RegisterForm() {
  const [feedback, setFeedback] = useState<string>("");
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    setValue,
  } = useForm<RegisterIncidentFormValues>({
    defaultValues: initialForm,
    resolver: zodResolver(registerIncidentSchema),
  });
  const selectedLocation = useWatch({ control, name: "location" });
  const shouldShowCustomLocation = selectedLocation === CUSTOM_LOCATION_VALUE;

  function onSubmit(values: RegisterIncidentFormValues) {
    const resolvedLocation =
      values.location === CUSTOM_LOCATION_VALUE
        ? values.customLocation.trim()
        : values.location;

    setFeedback(
      `Ocorrência "${values.title}" enviada localmente com sucesso para ${resolvedLocation}. A integração persistente será conectada depois.`,
    );
    reset(initialForm);
  }

  return (
    <Card className="w-full rounded-[36px] p-6 shadow-none sm:p-8">
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Input
              className="min-h-12"
              error={errors.title?.message}
              label="Título"
              placeholder="Ex.: Vazamento no bloco B"
              {...register("title")}
              required
            />
          </div>

          <div className="lg:col-span-6">
            <Controller
              control={control}
              name="location"
              render={({ field }) => (
                <Select
                  className="min-h-12"
                  error={errors.location?.message}
                  label="Local do problema"
                  onBlur={field.onBlur}
                  onValueChange={(value) => {
                    field.onChange(value);
                    if (value !== CUSTOM_LOCATION_VALUE) {
                      setValue("customLocation", "");
                    }
                  }}
                  options={locationOptions}
                  value={field.value}
                />
              )}
            />
          </div>
        </div>

        {shouldShowCustomLocation ? (
          <Input
            className="min-h-12"
            error={errors.customLocation?.message}
            label="Qual é o local do problema?"
            placeholder="Ex.: Escadaria lateral do bloco C"
            {...register("customLocation")}
            required
          />
        ) : null}

        <Textarea
          className="min-h-44"
          error={errors.description?.message}
          label="Descrição"
          placeholder="Descreva o contexto, local exato e impacto percebido."
          {...register("description")}
          required
        />

        <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-6">
            <Controller
              control={control}
              name="userType"
              render={({ field }) => (
                <Select
                  className="min-h-12"
                  error={errors.userType?.message}
                  label="Quem está registrando?"
                  onBlur={field.onBlur}
                  onValueChange={field.onChange}
                  options={userTypeOptions}
                  placeholder="Selecione"
                  value={field.value}
                />
              )}
            />
          </div>

          <Controller
            control={control}
            name="attachmentName"
            render={({ field }) => (
              <AttachmentDropzone
                className="lg:col-span-6"
                fileName={field.value}
                onFileSelect={field.onChange}
              />
            )}
          />
        </div>

        <div className="flex justify-center">
          <Button type="submit" disabled={isSubmitting}>
            Enviar ocorrência
          </Button>
        </div>

        {feedback ? (
          <div className="rounded-[24px] bg-[var(--color-surface-container-highest)] px-4 py-3 text-sm leading-7 text-[var(--color-on-surface)]">
            {feedback}
          </div>
        ) : null}
      </form>
    </Card>
  );
}
