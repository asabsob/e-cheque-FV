import React from "react";

export default function ChequeCard({
  id,
  receiver,
  amount,
  chequeDate,
  expiryDate,
}) {
  return (
    <div
      className="relative w-[790px] h-[412px] bg-no-repeat bg-cover mb-6"
      style={{ backgroundImage: "url('/cheque-template.png')" }}
    >
      <div className="absolute top-[22px] left-[580px] text-sm font-semibold">
        Cheque #: {id}
      </div>

      <div className="absolute top-[95px] left-[115px] text-sm">
        Pay To: {receiver}
      </div>

      <div className="absolute top-[140px] left-[555px] text-sm font-bold">
        JD {amount}
      </div>

      <div className="absolute top-[58px] left-[625px] text-sm">
        Date: {chequeDate}
      </div>

      <div className="absolute top-[170px] left-[115px] text-sm">
        Expiry: {expiryDate}
      </div>
    </div>
  );
}
