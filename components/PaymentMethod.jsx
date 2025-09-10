"use client";
import React, { useContext } from "react";
import { PaymentContext } from "@/context/PaymentContext";
import { BiCheck, BiInfoCircle } from "react-icons/bi";

const PaymentMethod = ({ onMethodSelect }) => {
  const { paymentMethods, selectedPaymentMethod, selectPaymentMethod } = useContext(PaymentContext);

  const handleMethodSelect = (method) => {
    selectPaymentMethod(method.id);
    if (onMethodSelect) {
      onMethodSelect(method);
    }
  };

  const formatPrice = (price) => `Rp ${Number(price || 0).toLocaleString("id-ID")}`;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-lg font-semibold text-gray-100">Pilih Metode Pembayaran</h3>
        <BiInfoCircle className="text-gray-400 text-sm" />
      </div>

      <div className="grid gap-3">
        {paymentMethods.map((method) => {
          const isSelected = selectedPaymentMethod?.id === method.id;
          const isDisabled = !method.available;

          return (
            <button
              key={method.id}
              type="button"
              onClick={() => !isDisabled && handleMethodSelect(method)}
              disabled={isDisabled}
              className={`w-full rounded-xl border px-4 py-4 flex items-center justify-between gap-4 transition-all text-left ${
                isSelected
                  ? "bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-400/60 shadow-lg"
                  : isDisabled
                  ? "bg-gray-800/50 border-gray-600/50 cursor-not-allowed opacity-50"
                  : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="text-2xl">{method.icon}</div>
                <div>
                  <div className="font-semibold text-gray-100 flex items-center gap-2">
                    {method.name}
                    {isSelected && <BiCheck className="text-purple-400 text-lg" />}
                  </div>
                  <div className="text-sm text-gray-400">{method.description}</div>
                  {method.fee > 0 && (
                    <div className="text-xs text-yellow-400 mt-1">
                      Biaya admin: {formatPrice(method.fee)}
                    </div>
                  )}
                  {!method.available && (
                    <div className="text-xs text-red-400 mt-1">
                      Sementara tidak tersedia
                    </div>
                  )}
                </div>
              </div>

              <div className="text-right">
                {method.fee === 0 && (
                  <div className="text-xs text-green-400 font-medium">Gratis</div>
                )}
                {method.fee > 0 && (
                  <div className="text-xs text-yellow-400 font-medium">
                    +{formatPrice(method.fee)}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {selectedPaymentMethod && (
        <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-purple-600/10 to-pink-600/10 border border-purple-400/20">
          <div className="flex items-center gap-2 mb-2">
            <div className="text-lg">{selectedPaymentMethod.icon}</div>
            <div className="font-semibold text-gray-100">{selectedPaymentMethod.name}</div>
          </div>
          <div className="text-sm text-gray-300">
            {selectedPaymentMethod.description}
          </div>
          {selectedPaymentMethod.fee > 0 && (
            <div className="text-xs text-yellow-400 mt-1">
              Biaya admin: {formatPrice(selectedPaymentMethod.fee)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentMethod;
