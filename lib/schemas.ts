import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export const harvestSchema = z.object({
  species: z.enum(["Catfish", "Tilapia"]),
  weight: z.number().min(0.1, "Weight must be greater than 0"),
  unit: z.enum(["kg", "tons"]),
  price: z.number().min(1, "Price must be at least 1"),
  harvestDate: z.string().min(1, "Harvest date is required"),
  location: z.string().min(1, "Location is required"),
  description: z.string().optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type OtpFormValues = z.infer<typeof otpSchema>;
export type HarvestFormValues = z.infer<typeof harvestSchema>;

export const marketplaceItemSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  category: z.string().min(1, "Category is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  unit: z.string().min(1, "Unit is required"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  image: z.any().optional(),
});

export type MarketplaceItemFormValues = z.infer<typeof marketplaceItemSchema>;

export const postToMarketplaceSchema = z.object({
  harvestId: z.number({ required_error: "Please select a harvest batch" }),
  quantity: z.number().min(0.1, "Quantity must be greater than 0"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  image: z.any().optional(),
});

export type PostToMarketplaceFormValues = z.infer<typeof postToMarketplaceSchema>;
