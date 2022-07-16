export type ExplainedAvailability = {
  isAvailable: boolean;
  reason: string;
};

export const getAvailable = (): ExplainedAvailability => ({
  isAvailable: true,
  reason: '',
});

export const getNotAvailable = (reason: string): ExplainedAvailability => ({
  isAvailable: false,
  reason,
});
