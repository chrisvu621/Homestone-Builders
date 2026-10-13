import type { EstimateFields, FieldErrors } from "./validation";

export type EstimateFormState = {
  status: "idle" | "success" | "invalid" | "error" | "not_configured";
  message?: string;
  errors?: FieldErrors;
  values?: EstimateFields;
  /** Increments on every submission so the client can reset widgets. */
  attempt: number;
};

export const initialEstimateState: EstimateFormState = { status: "idle", attempt: 0 };
