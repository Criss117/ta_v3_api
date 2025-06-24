import { z } from "zod";

export const clientId = z
  .string({
    invalid_type_error: "El ID debe ser una cadena de texto",
    required_error: "El ID es requerido",
  })
  .uuid("El ID del cliente debe ser un UUID válido");

export const clientCode = z
  .string({
    invalid_type_error: "El código debe ser una cadena de texto",
    required_error: "El código es requerido",
  })
  .min(2, "El código debe tener al menos 2 caracteres")
  .max(225, "El código no puede exceder los 225 caracteres");
