"use client";
import React from "react";
import { BiCopy, BiCheck } from "react-icons/bi";

const PaymentInstructions = ({ paymentMethod, amount, paymentForm }) => {
  const [copiedField, setCopiedField] = React.useState(null);

  const formatPrice = (price) => `Rp ${Number(price || 0).toLocaleString("id-ID")}`;

  const copyToClipboard = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const renderBankTransferInstructions = () => {
    const bank = paymentMethod.banks.find(b => b.code === paymentForm.bankCode);
    if (!bank) return null;

    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-100 mb-2">Transfer Bank</div>
          <div className="text-gray-400">Transfer ke rekening berikut sesuai dengan total pembayaran</div>
        </div>

        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Bank Tujuan</span>
              <span className="text-gray-100 font-semibold">{bank.name}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Nomor Rekening</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-100 font-mono text-lg">{bank.account}</span>
                <button
                  onClick={() => copyToClipboard(bank.account, 'account')}
                  className="p-1 rounded hover:bg-white/10 transition-colors"
                >
                  {copiedField === 'account' ? (
                    <BiCheck className="text-green-400" />
                  ) : (
                    <BiCopy className="text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Atas Nama</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-100 font-semibold">{bank.holder}</span>
                <button
                  onClick={() => copyToClipboard(bank.holder, 'holder')}
                  className="p-1 rounded hover:bg-white/10 transition-colors"
                >
                  {copiedField === 'holder' ? (
                    <BiCheck className="text-green-400" />
                  ) : (
                    <BiCopy className="text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            
            <div className="h-px bg-white/10" />
            
            <div className="flex items-center justify-between text-lg">
              <span className="text-gray-200 font-semibold">Jumlah Transfer</span>
              <div className="flex items-center gap-2">
                <span className="text-purple-300 font-bold text-xl">{formatPrice(amount)}</span>
                <button
                  onClick={() => copyToClipboard(amount.toString(), 'amount')}
                  className="p-1 rounded hover:bg-white/10 transition-colors"
                >
                  {copiedField === 'amount' ? (
                    <BiCheck className="text-green-400" />
                  ) : (
                    <BiCopy className="text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-600/10 border border-blue-400/20 rounded-xl p-4">
          <div className="text-sm text-blue-200">
            <strong>Catatan Penting:</strong>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li>Pastikan nominal transfer tepat sesuai dengan jumlah yang tertera</li>
              <li>Gunakan catatan transfer: "{paymentForm.transferNote || `Pembayaran tiket ${paymentForm.customerName}`}"</li>
              <li>Simpan bukti transfer untuk keperluan verifikasi</li>
              <li>Pembayaran akan diverifikasi dalam 1x24 jam</li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  const renderEWalletInstructions = () => {
    const wallet = paymentMethod.wallets.find(w => w.code === paymentForm.walletCode);
    if (!wallet) return null;

    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-100 mb-2">Transfer E-Wallet</div>
          <div className="text-gray-400">Transfer ke e-wallet berikut sesuai dengan total pembayaran</div>
        </div>

        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">E-Wallet</span>
              <span className="text-gray-100 font-semibold">{wallet.name}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Nomor Telepon</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-100 font-mono text-lg">{wallet.account}</span>
                <button
                  onClick={() => copyToClipboard(wallet.account, 'phone')}
                  className="p-1 rounded hover:bg-white/10 transition-colors"
                >
                  {copiedField === 'phone' ? (
                    <BiCheck className="text-green-400" />
                  ) : (
                    <BiCopy className="text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Atas Nama</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-100 font-semibold">{wallet.holder}</span>
                <button
                  onClick={() => copyToClipboard(wallet.holder, 'holder')}
                  className="p-1 rounded hover:bg-white/10 transition-colors"
                >
                  {copiedField === 'holder' ? (
                    <BiCheck className="text-green-400" />
                  ) : (
                    <BiCopy className="text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            
            <div className="h-px bg-white/10" />
            
            <div className="flex items-center justify-between text-lg">
              <span className="text-gray-200 font-semibold">Jumlah Transfer</span>
              <div className="flex items-center gap-2">
                <span className="text-purple-300 font-bold text-xl">{formatPrice(amount)}</span>
                <button
                  onClick={() => copyToClipboard(amount.toString(), 'amount')}
                  className="p-1 rounded hover:bg-white/10 transition-colors"
                >
                  {copiedField === 'amount' ? (
                    <BiCheck className="text-green-400" />
                  ) : (
                    <BiCopy className="text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-orange-600/10 border border-orange-400/20 rounded-xl p-4">
          <div className="text-sm text-orange-200">
            <strong>Cara Transfer:</strong>
            <ol className="mt-2 space-y-1 list-decimal list-inside">
              <li>Buka aplikasi {wallet.name} di smartphone Anda</li>
              <li>Pilih menu "Transfer" atau "Kirim Uang"</li>
              <li>Masukkan nomor telepon: <strong>{wallet.account}</strong></li>
              <li>Masukkan jumlah: <strong>{formatPrice(amount)}</strong></li>
              <li>Tambahkan catatan: "{paymentForm.customerName}"</li>
              <li>Konfirmasi dan selesaikan transfer</li>
            </ol>
          </div>
        </div>
      </div>
    );
  };

  const renderQRISInstructions = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-2xl font-bold text-gray-100 mb-2">Pembayaran QRIS</div>
        <div className="text-gray-400">Scan QR Code dengan aplikasi e-wallet atau mobile banking</div>
      </div>

      <div className="flex justify-center">
        <div className="w-64 h-64 bg-white rounded-xl flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">📱</div>
            <div className="text-gray-600 font-semibold">QR Code</div>
            <div className="text-gray-500 text-sm">Scan untuk membayar</div>
          </div>
        </div>
      </div>

      <div className="bg-white/5 rounded-xl p-6 border border-white/10 text-center">
        <div className="text-lg font-semibold text-gray-100 mb-2">Jumlah Pembayaran</div>
        <div className="text-3xl font-bold text-purple-300">{formatPrice(amount)}</div>
      </div>

      <div className="bg-green-600/10 border border-green-400/20 rounded-xl p-4">
        <div className="text-sm text-green-200">
          <strong>Cara Pembayaran:</strong>
          <ol className="mt-2 space-y-1 list-decimal list-inside">
            <li>Buka aplikasi e-wallet atau mobile banking</li>
            <li>Pilih menu "Scan QR" atau "QRIS"</li>
            <li>Scan QR Code yang tertera di atas</li>
            <li>Periksa detail pembayaran dan konfirmasi</li>
            <li>Selesaikan pembayaran</li>
          </ol>
        </div>
      </div>
    </div>
  );

  const renderCashInstructions = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-2xl font-bold text-gray-100 mb-2">Pembayaran Tunai</div>
        <div className="text-gray-400">Bayar di lokasi acara saat check-in</div>
      </div>

      <div className="bg-white/5 rounded-xl p-6 border border-white/10 text-center">
        <div className="text-6xl mb-4">💵</div>
        <div className="text-lg font-semibold text-gray-100 mb-2">Jumlah Pembayaran</div>
        <div className="text-3xl font-bold text-purple-300">{formatPrice(amount)}</div>
      </div>

      <div className="bg-yellow-600/10 border border-yellow-400/20 rounded-xl p-4">
        <div className="text-sm text-yellow-200">
          <strong>Instruksi:</strong>
          <ul className="mt-2 space-y-1 list-disc list-inside">
            <li>Datang ke lokasi acara sesuai jadwal</li>
            <li>Bawa bukti pemesanan (email atau SMS konfirmasi)</li>
            <li>Bayar tunai saat check-in di lokasi</li>
            <li>Dapatkan tiket fisik setelah pembayaran</li>
          </ul>
        </div>
      </div>
    </div>
  );

  if (!paymentMethod) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400">Metode pembayaran tidak ditemukan</div>
      </div>
    );
  }

  switch (paymentMethod.id) {
    case 'bank_transfer':
      return renderBankTransferInstructions();
    case 'e_wallet':
      return renderEWalletInstructions();
    case 'qris':
      return renderQRISInstructions();
    case 'cash':
      return renderCashInstructions();
    default:
      return (
        <div className="text-center py-8">
          <div className="text-gray-400">Instruksi pembayaran tidak tersedia</div>
        </div>
      );
  }
};

export default PaymentInstructions;
