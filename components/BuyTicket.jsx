"use client";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { TicketContext } from "@/context/TicketContext";
import { BiPlus, BiMinus, BiCheck, BiInfoCircle } from "react-icons/bi";
import { HiTicket } from "react-icons/hi2";

const BuyTicket = ({ event }) => {
  const {
    buyNow,
    itemAmount,
    totalPrice,
    increaseAmount,
    decreaseAmount,
    initalizeEvent,
    handleSeat,
    seat,
  } = useContext(TicketContext);

  const [isLoading, setIsLoading] = useState(false);

  // Normalize seats array from event
  const seats = useMemo(() => {
    if (!event) return [];
    const raw = Array.isArray(event.seats) ? event.seats : [];
    return raw
      .map((s) => {
        const seatName = s?.seat || s?.name || s?.type || null;
        const seatPrice = s?.price ?? s?.harga ?? s?.cost ?? 0;
        const desc = s?.desc || s?.description || "";
        const numericPrice = seatPrice && !isNaN(Number(seatPrice)) ? Number(seatPrice) : 0;
        return seatName ? { seat: String(seatName), price: numericPrice, desc } : null;
      })
      .filter(Boolean);
  }, [event]);

  // Initialize context with current event
  useEffect(() => {
    if (event) {
      const normalizedEvent = { ...event, seats };
      initalizeEvent(normalizedEvent);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);

  const handleBuyNow = () => {
    setIsLoading(true);
    buyNow(event);
    
    // Navigate to checkout page after a short delay
    setTimeout(() => {
      setIsLoading(false);
      window.location.href = '/checkout';
    }, 1000);
  };

  const formatPrice = (value) => `Rp ${Number(value || 0).toLocaleString("id-ID")}`;

  return (
    <div className="flex flex-col gap-5">
      {/* Seat selector (radio list) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">Pilih Kursi</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Harga per kursi</div>
          </div>
        </div>

        {seats.length > 0 ? (
          <div className="space-y-2">
            {seats.map((s, idx) => {
              const isSelected = seat?.seat === s.seat;
              return (
                <button
                  key={`${s.seat}-${idx}`}
                  type="button"
                  onClick={() => handleSeat(s.seat, s.price)}
                  className={`w-full rounded-xl border px-4 py-3 flex items-start justify-between gap-3 transition-all text-left ${
                    isSelected
                      ? "bg-gradient-to-r from-purple-100/80 to-pink-100/80 dark:from-purple-600/20 dark:to-pink-600/20 border-purple-300/60 dark:border-purple-400/60 shadow"
                      : "bg-gray-50/80 dark:bg-white/5 border-gray-200/60 dark:border-white/10 hover:bg-gray-100/80 dark:hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full border ${
                        isSelected ? "bg-purple-600 border-purple-500" : "border-gray-300/60 dark:border-white/40"
                      }`}
                    >
                      {isSelected && <BiCheck className="text-white text-sm" />}
                    </span>
                    <div>
                      <div className="font-semibold capitalize text-gray-800 dark:text-gray-100">{s.seat}</div>
                      {s.desc && (
                        <div className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                          <BiInfoCircle className="w-3.5 h-3.5" /> {s.desc}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={`text-sm font-semibold ${isSelected ? "text-purple-600 dark:text-purple-300" : "text-gray-700 dark:text-gray-200"}`}>
                    {formatPrice(s.price)}
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="text-sm text-gray-600 dark:text-gray-300">Belum ada data kursi.</div>
        )}
      </div>

      {/* Price list moved to EventPackages component */}

      {/* Quantity */}
      <div className="flex items-center justify-between rounded-xl bg-gray-50/80 dark:bg-white/5 border border-gray-200/60 dark:border-white/10 px-3 py-2">
        <div className="text-sm text-gray-700 dark:text-gray-300">Jumlah</div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={decreaseAmount}
            className="h-9 w-9 rounded-full bg-purple-600/90 hover:bg-purple-600 flex items-center justify-center shadow"
          >
            <BiMinus className="text-white" />
          </button>
          <div className="min-w-[24px] text-center font-semibold tabular-nums text-gray-800 dark:text-gray-100">{itemAmount}</div>
          <button
            type="button"
            onClick={increaseAmount}
            className="h-9 w-9 rounded-full bg-purple-600/90 hover:bg-purple-600 flex items-center justify-center shadow"
          >
            <BiPlus className="text-white" />
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="rounded-xl bg-gray-50/80 dark:bg-white/5 border border-gray-200/60 dark:border-white/10 px-4 py-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-300">Kursi dipilih</span>
          <span className="font-semibold text-gray-800 dark:text-gray-100">{seat?.seat ? seat.seat : "-"}</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-gray-600 dark:text-gray-300">Harga per kursi</span>
          <span className="font-semibold text-gray-800 dark:text-gray-100">{seat?.price ? formatPrice(seat.price) : "-"}</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-gray-600 dark:text-gray-300">Jumlah</span>
          <span className="font-semibold text-gray-800 dark:text-gray-100">{itemAmount}</span>
        </div>
        <div className="h-px bg-gray-200/60 dark:bg-white/10 my-3" />
        <div className="flex items-center justify-between text-base">
          <span className="font-semibold text-gray-700 dark:text-gray-200">Total</span>
          <span className="font-extrabold text-purple-600 dark:text-purple-300">{formatPrice(totalPrice)}</span>
        </div>
      </div>

      {/* Buy CTA */}
      <button
        onClick={handleBuyNow}
        disabled={!seat?.seat}
        className={`relative overflow-hidden rounded-2xl w-full px-6 py-4 font-semibold transition-all ${
          !seat?.seat
            ? "bg-gradient-to-r from-purple-600 to-pink-600 opacity-60 cursor-not-allowed"
            : "bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-500 hover:via-pink-600 hover:to-rose-600 shadow-lg hover:shadow-xl"
        }`}
      >
        <div className="relative z-[1] flex items-center justify-center gap-3 text-white">
          {isLoading ? (
            <div>Processing..</div>
          ) : (
            <>
              <HiTicket className="text-2xl" />
              <div className="text-left">
                <div>{seat?.seat ? `Beli ${itemAmount} tiket` : "Pilih kursi"}</div>
                <div className="text-sm opacity-90">Total: {formatPrice(totalPrice)}</div>
              </div>
            </>
          )}
        </div>
        <span className="absolute inset-0 opacity-0 hover:opacity-10 transition-opacity bg-gradient-to-br from-white via-white to-transparent" />
      </button>
    </div>
  );
};

export default BuyTicket;