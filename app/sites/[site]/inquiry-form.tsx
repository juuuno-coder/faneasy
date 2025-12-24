'use client';

import UnifiedInquiryForm from "@/components/shared/unified-inquiry-form";

export default function InquiryForm({
  influencerId,
  variant = "default",
}: {
  influencerId: string;
  variant?: "default" | "bold" | "clean" | "tech";
}) {
  return (
    <UnifiedInquiryForm 
      influencerId={influencerId}
      variant={variant}
    />
  );
}
