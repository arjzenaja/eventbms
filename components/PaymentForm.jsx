"use client";
import React, { useContext, useState } from "react";
import { PaymentContext } from "@/context/PaymentContext";
import { BiInfoCircle, BiCreditCard, BiShield, BiCheck } from "react-icons/bi";

const PaymentForm = ({ orderData, onPaymentSuccess }) => {
  const {
    selectedPaymentMethod,
    paymentForm,
    updatePaymentForm,
    validatePaymentForm,
    processPayment,
    paymentStatus
  } = useContext(PaymentContext);

  const [showCardDetails, setShowCardDetails] = useState(false);

  const formatPrice = (price) => `Rp ${Number(price || 0).toLocaleString("id-ID")}`;

  const handleInputChange = (field, value) => {
    updatePaymentForm(field, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validation = validatePaymentForm();
    if (!validation.valid) {
      alert(validation.message);
      return;
    }

    const result = await processPayment(orderData);
    if (result.success && onPaymentSuccess) {
      onPaymentSuccess(result);
    }
  };

  const renderBankTransferForm = () => (
    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-blue-600/10 border border-blue-400/20">
        <div className="flex items-center gap-2 mb-2">
          <BiInfoCircle className="text-blue-400" />
          <span className="text-sm font-medium text-blue-300">Instruksi Pembayaran</span>
        </div>
        <p className="text-xs text-blue-200">
          Transfer ke rekening berikut sesuai dengan total pembayaran. Pastikan nominal transfer tepat.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Pilih Bank Tujuan
        </label>
        <select
          value={paymentForm.bankCode}
          onChange={(e) => handleInputChange("bankCode", e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-100 focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
        >
          <option value="">Pilih Bank</option>
          {selectedPaymentMethod?.banks?.map((bank) => (
            <option key={bank.code} value={bank.code}>
              {bank.name} - {bank.account}
            </option>
          ))}
        </select>
      </div>

      {paymentForm.bankCode && (
        <div className="p-4 rounded-xl bg-green-600/10 border border-green-400/20">
          <div className="text-sm font-medium text-green-300 mb-2">Detail Rekening</div>
          {(() => {
            const bank = selectedPaymentMethod.banks.find(b => b.code === paymentForm.bankCode);
            return bank ? (
              <div className="space-y-1 text-xs text-green-200">
                <div>Bank: {bank.name}</div>
                <div>No. Rekening: {bank.account}</div>
                <div>Atas Nama: {bank.holder}</div>
                <div className="font-semibold">Jumlah: {formatPrice(orderData?.totalPrice || 0)}</div>
              </div>
            ) : null;
          })()}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Catatan Transfer (Opsional)
        </label>
        <input
          type="text"
          value={paymentForm.transferNote}
          onChange={(e) => handleInputChange("transferNote", e.target.value)}
          placeholder="Contoh: Pembayaran tiket event ABC"
          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-100 placeholder-gray-400 focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
        />
      </div>
    </div>
  );

  const renderEWalletForm = () => (
    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-orange-600/10 border border-orange-400/20">
        <div className="flex items-center gap-2 mb-2">
          <BiInfoCircle className="text-orange-400" />
          <span className="text-sm font-medium text-orange-300">Instruksi Pembayaran</span>
        </div>
        <p className="text-xs text-orange-200">
          Transfer ke nomor e-wallet berikut sesuai dengan total pembayaran.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Pilih E-Wallet
        </label>
        <select
          value={paymentForm.walletCode}
          onChange={(e) => handleInputChange("walletCode", e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-100 focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
        >
          <option value="">Pilih E-Wallet</option>
          {selectedPaymentMethod?.wallets?.map((wallet) => (
            <option key={wallet.code} value={wallet.code}>
              {wallet.name} - {wallet.account}
            </option>
          ))}
        </select>
      </div>

      {paymentForm.walletCode && (
        <div className="p-4 rounded-xl bg-green-600/10 border border-green-400/20">
          <div className="text-sm font-medium text-green-300 mb-2">Detail E-Wallet</div>
          {(() => {
            const wallet = selectedPaymentMethod.wallets.find(w => w.code === paymentForm.walletCode);
            return wallet ? (
              <div className="space-y-1 text-xs text-green-200">
                <div>E-Wallet: {wallet.name}</div>
                <div>Nomor: {wallet.account}</div>
                <div>Atas Nama: {wallet.holder}</div>
                <div className="font-semibold">Jumlah: {formatPrice(orderData?.totalPrice || 0)}</div>
              </div>
            ) : null;
          })()}
        </div>
      )}
    </div>
  );

  const renderCreditCardForm = () => (
    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-purple-600/10 border border-purple-400/20">
        <div className="flex items-center gap-2 mb-2">
          <BiShield className="text-purple-400" />
          <span className="text-sm font-medium text-purple-300">Pembayaran Aman</span>
        </div>
        <p className="text-xs text-purple-200">
          Data kartu kredit Anda aman dan terenkripsi. Kami tidak menyimpan informasi kartu Anda.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Nomor Kartu Kredit
        </label>
        <input
          type="text"
          value={paymentForm.cardNumber}
          onChange={(e) => handleInputChange("cardNumber", e.target.value)}
          placeholder="1234 5678 9012 3456"
          maxLength="19"
          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-100 placeholder-gray-400 focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Nama Pemegang Kartu
        </label>
        <input
          type="text"
          value={paymentForm.cardHolder}
          onChange={(e) => handleInputChange("cardHolder", e.target.value)}
          placeholder="JOHN DOE"
          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-100 placeholder-gray-400 focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Tanggal Kadaluarsa
          </label>
          <input
            type="text"
            value={paymentForm.expiryDate}
            onChange={(e) => handleInputChange("expiryDate", e.target.value)}
            placeholder="MM/YY"
            maxLength="5"
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-100 placeholder-gray-400 focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            CVV
          </label>
          <input
            type="text"
            value={paymentForm.cvv}
            onChange={(e) => handleInputChange("cvv", e.target.value)}
            placeholder="123"
            maxLength="4"
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-100 placeholder-gray-400 focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
          />
        </div>
      </div>
    </div>
  );

  const renderQRISForm = () => (
    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-green-600/10 border border-green-400/20">
        <div className="flex items-center gap-2 mb-2">
          <BiInfoCircle className="text-green-400" />
          <span className="text-sm font-medium text-green-300">Instruksi Pembayaran</span>
        </div>
        <p className="text-xs text-green-200">
          Scan QR Code dengan aplikasi e-wallet atau mobile banking Anda.
        </p>
      </div>

      <div className="text-center">
        <div className="w-48 h-48 mx-auto bg-white rounded-xl flex items-center justify-center mb-4">
          <div className="text-center">
            <div className="text-6xl mb-2">📱</div>
            <div className="text-xs text-gray-600">QR Code</div>
            <div className="text-xs text-gray-500">Scan untuk membayar</div>
          </div>
        </div>
        <div className="text-sm font-semibold text-gray-200">
          Jumlah: {formatPrice(orderData?.totalPrice || 0)}
        </div>
      </div>
    </div>
  );

  const renderCashForm = () => (
    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-yellow-600/10 border border-yellow-400/20">
        <div className="flex items-center gap-2 mb-2">
          <BiInfoCircle className="text-yellow-400" />
          <span className="text-sm font-medium text-yellow-300">Pembayaran Tunai</span>
        </div>
        <p className="text-xs text-yellow-200">
          {selectedPaymentMethod?.note}
        </p>
      </div>

      <div className="text-center">
        <div className="text-6xl mb-4">💵</div>
        <div className="text-lg font-semibold text-gray-200 mb-2">
          Bayar di Lokasi
        </div>
        <div className="text-sm text-gray-300">
          Jumlah: {formatPrice(orderData?.totalPrice || 0)}
        </div>
      </div>
    </div>
  );

  const renderPaymentMethodForm = () => {
    if (!selectedPaymentMethod) return null;

    switch (selectedPaymentMethod.id) {
      case "bank_transfer":
        return renderBankTransferForm();
      case "e_wallet":
        return renderEWalletForm();
      case "credit_card":
        return renderCreditCardForm();
      case "qris":
        return renderQRISForm();
      case "cash":
        return renderCashForm();
      default:
        return null;
    }
  };

  if (!selectedPaymentMethod) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-2">Pilih metode pembayaran terlebih dahulu</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Customer Information */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-100">Informasi Pelanggan</h4>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Nama Lengkap *
          </label>
          <input
            type="text"
            value={paymentForm.customerName}
            onChange={(e) => handleInputChange("customerName", e.target.value)}
            required
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-100 placeholder-gray-400 focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Email *
          </label>
          <input
            type="email"
            value={paymentForm.customerEmail}
            onChange={(e) => handleInputChange("customerEmail", e.target.value)}
            required
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-100 placeholder-gray-400 focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Nomor Telepon *
          </label>
          <input
            type="tel"
            value={paymentForm.customerPhone}
            onChange={(e) => handleInputChange("customerPhone", e.target.value)}
            required
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-100 placeholder-gray-400 focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Catatan (Opsional)
          </label>
          <textarea
            value={paymentForm.notes}
            onChange={(e) => handleInputChange("notes", e.target.value)}
            rows={3}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-100 placeholder-gray-400 focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
          />
        </div>
      </div>

      {/* Payment Method Specific Form */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-100">Detail Pembayaran</h4>
        {renderPaymentMethodForm()}
      </div>

      {/* Payment Summary */}
      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
        <h4 className="text-lg font-semibold text-gray-100 mb-3">Ringkasan Pembayaran</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-300">Subtotal</span>
            <span className="text-gray-100">{formatPrice(orderData?.totalPrice || 0)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Biaya Admin</span>
            <span className="text-gray-100">{formatPrice(selectedPaymentMethod?.fee || 0)}</span>
          </div>
          <div className="h-px bg-white/10 my-2" />
          <div className="flex justify-between text-base font-semibold">
            <span className="text-gray-200">Total</span>
            <span className="text-purple-300">
              {formatPrice((orderData?.totalPrice || 0) + (selectedPaymentMethod?.fee || 0))}
            </span>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={paymentStatus.isProcessing}
        className={`w-full py-3 px-6 rounded-xl font-semibold transition-all ${
          paymentStatus.isProcessing
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-500 hover:via-pink-600 hover:to-rose-600 shadow-lg hover:shadow-xl"
        }`}
      >
        {paymentStatus.isProcessing ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Memproses Pembayaran...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <BiCreditCard className="text-lg" />
            <span>Lanjutkan Pembayaran</span>
          </div>
        )}
      </button>

      {/* Error Message */}
      {paymentStatus.isFailed && (
        <div className="p-3 rounded-lg bg-red-600/10 border border-red-400/20">
          <div className="text-sm text-red-300">{paymentStatus.errorMessage}</div>
        </div>
      )}
    </form>
  );
};

export default PaymentForm;
