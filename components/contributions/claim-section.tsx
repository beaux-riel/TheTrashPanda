"use client";

import { useState } from "react";

import { ClaimModal } from "./claim-button";
import { CommunityBadge } from "./community-badge";

type ClaimSectionProps = {
  producerId: string;
  producerName: string;
};

export function ClaimSection({ producerId, producerName }: ClaimSectionProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <CommunityBadge onClaim={() => setOpen(true)} />
      <ClaimModal
        open={open}
        onClose={() => setOpen(false)}
        producerId={producerId}
        producerName={producerName}
      />
    </>
  );
}
