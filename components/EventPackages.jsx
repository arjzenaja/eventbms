"use client";
import React, { useContext, useState, useEffect } from "react";
import { TicketContext } from "@/context/TicketContext";
import { BiInfoCircle, BiStar, BiCube, BiCart, BiMoney, BiTime, BiCamera, BiMessageRounded, BiCalendar, BiMap, BiUser, BiPhone } from "react-icons/bi";

const EventPackages = ({ event }) => {
  const { handleSeat } = useContext(TicketContext);
  const seats = Array.isArray(event?.seats) ? event.seats : [];
  const pricing = event?.pricing || {};

  const formatPrice = (value) => {
    const num = Number(value || 0);
    if (!num) return "Rp Gratis";
    return `Rp ${num.toLocaleString("id-ID")}`;
  };


  // Check if event is free - only if pricing.free is explicitly true
  const isFreeEvent = pricing && pricing.free === true;
  

  if (isFreeEvent) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl bg-gradient-to-br from-green-900/40 to-emerald-900/20 border border-green-400/30 p-6 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <BiMoney className="text-white text-2xl" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-white mb-2">Event Gratis!</h3>
          <p className="text-green-200">Tidak perlu membeli tiket untuk event ini</p>
          <div className="mt-4 inline-flex items-center gap-2 bg-green-600/20 text-green-200 border border-green-500/40 px-4 py-2 rounded-full text-sm font-semibold">
            <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" /> 
            Gratis Masuk
          </div>
        </div>
      </div>
    );
  }

  // Show pricing structure if available - check for actual pricing values
  const hasPricing = (pricing.presale && pricing.presale > 0) || 
                     (pricing.normal && pricing.normal > 0) || 
                     (pricing.vip && pricing.vip > 0);
  const hasSeats = seats.length > 0;
  

  // Force show event info for events without proper pricing/seats
  // Also show for events with empty pricing object
  if (!hasPricing && !hasSeats || (pricing && Object.keys(pricing).length === 0)) {
    return (
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 border border-white/30 dark:border-gray-700/30 shadow-2xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Informasi Event</h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Informasi lengkap tentang {event?.title || "event ini"}
          </p>
        </div>

        {/* Event Information */}
        <div className="space-y-6">
          {/* Event Details */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <BiInfoCircle className="w-5 h-5 text-blue-500 dark:text-blue-400" />
              Detail Event
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {event?.date && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <BiCalendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Tanggal</p>
                    <p className="text-gray-900 dark:text-white font-medium">{event.date}</p>
                  </div>
                </div>
              )}
              {event?.time && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-500/20 rounded-lg flex items-center justify-center">
                    <BiTime className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Waktu</p>
                    <p className="text-gray-900 dark:text-white font-medium">{event.time}</p>
                  </div>
                </div>
              )}
              {event?.location && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <BiMap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Lokasi</p>
                    <p className="text-gray-900 dark:text-white font-medium">{event.location}</p>
                  </div>
                </div>
              )}
              {event?.organizer && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 dark:bg-orange-500/20 rounded-lg flex items-center justify-center">
                    <BiUser className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Penyelenggara</p>
                    <p className="text-gray-900 dark:text-white font-medium">{event.organizer}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Event Features */}
          {event?.features && event.features.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <BiStar className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />
                Fasilitas & Fitur
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {event.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 bg-white dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                    <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full"></div>
                    <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact Information */}
          {event?.contact && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <BiPhone className="w-5 h-5 text-green-600 dark:text-green-400" />
                Informasi Kontak
              </h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-500/20 rounded-lg flex items-center justify-center">
                  <BiPhone className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Kontak</p>
                  <p className="text-gray-900 dark:text-white font-medium">{event.contact}</p>
                </div>
              </div>
            </div>
          )}

          {/* Registration Notice */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-600/20 dark:to-purple-600/20 border border-blue-200 dark:border-blue-500/30 rounded-xl p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <BiInfoCircle className="text-white text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Informasi Pendaftaran</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Untuk informasi lebih lanjut tentang pendaftaran dan tiket, silakan hubungi penyelenggara event.
            </p>
            {event?.contact && (
              <a 
                href={`tel:${event.contact}`}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300"
              >
                <BiPhone className="w-4 h-4" />
                Hubungi Penyelenggara
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Pricing Structure */}
      {hasPricing && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-gradient-to-br from-gray-900/40 to-purple-900/20 border border-white/10 p-5">
            <div className="flex items-center justify-center mb-3">
              <span className="inline-flex items-center gap-2 bg-emerald-600/20 text-emerald-200 border border-emerald-500/40 px-3 py-1 rounded-full text-xs font-semibold">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Harga Tiket
              </span>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-extrabold text-white">Struktur Harga</h3>
              <p className="text-sm text-gray-300 mt-1">Pilih kategori tiket yang sesuai</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pricing.presale && (
              <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-400/30 rounded-xl p-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <BiTime className="text-white text-xl" />
                  </div>
                  <h4 className="font-bold text-white mb-2">Presale</h4>
                  <div className="text-2xl font-black text-blue-200 mb-2">{formatPrice(pricing.presale)}</div>
                  <p className="text-xs text-blue-300">Harga awal</p>
                </div>
              </div>
            )}

            {pricing.normal && (
              <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-400/30 rounded-xl p-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <BiMoney className="text-white text-xl" />
                  </div>
                  <h4 className="font-bold text-white mb-2">Normal</h4>
                  <div className="text-2xl font-black text-purple-200 mb-2">{formatPrice(pricing.normal)}</div>
                  <p className="text-xs text-purple-300">Harga reguler</p>
                </div>
              </div>
            )}

            {pricing.vip && (
              <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border border-yellow-400/30 rounded-xl p-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <BiStar className="text-white text-xl" />
                  </div>
                  <h4 className="font-bold text-white mb-2">VIP</h4>
                  <div className="text-2xl font-black text-yellow-200 mb-2">{formatPrice(pricing.vip)}</div>
                  <p className="text-xs text-yellow-300">Fasilitas premium</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Detailed Packages */}
      {hasSeats && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-gradient-to-br from-gray-900/40 to-purple-900/20 border border-white/10 p-5">
            <div className="flex items-center justify-center mb-3">
              <span className="inline-flex items-center gap-2 bg-emerald-600/20 text-emerald-200 border border-emerald-500/40 px-3 py-1 rounded-full text-xs font-semibold">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Paket Detail
              </span>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-extrabold text-white">Pilihan Paket Tiket</h3>
              <p className="text-sm text-gray-300 mt-1">Pilih paket yang sesuai dengan kebutuhan Anda</p>
            </div>
          </div>

          <div className="space-y-3">
            {seats.map((s, idx) => {
              const isVip = /vip/i.test(s?.seat || s?.name || "");
              const isReg = /regul(er|ar)/i.test(s?.seat || s?.name || "");
              const includes = Array.isArray(s.includes) && s.includes.length > 0
                ? s.includes
                : ["Tiket Masuk", "Panduan Wisata", "Fasilitas Dasar", "Asuransi"];
              const requirementTerms = Array.isArray(s.terms_requirements)
                ? s.terms_requirements
                : ["Min. 1 orang", "Bayar full H-7", "Konfirmasi H-3"];
              const cancellationTerms = Array.isArray(s.terms_cancellation)
                ? s.terms_cancellation
                : ["H-7: 100%", "H-3: 50%", "H-1: 0%"];
              return (
                <div
                  key={`pkg-${idx}`}
                  className={`relative rounded-2xl p-4 border shadow-inner transition-all ${
                    isVip
                      ? "bg-gradient-to-br from-indigo-700/20 via-purple-700/10 to-rose-700/10 border-purple-400/40"
                      : isReg
                      ? "bg-gradient-to-br from-purple-600/10 to-pink-600/10 border-purple-400/30"
                      : "bg-white/5 border-white/10"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="h-12 w-12 rounded-2xl bg-white/15 flex items-center justify-center border border-white/20">
                        <BiCube className="text-white/90 text-xl" />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-lg font-extrabold capitalize text-white">{s.seat || s.name}</div>
                        {(isVip || s?.recommended) && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-200">
                            <BiStar className="w-3.5 h-3.5" /> Recommended
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-indigo-200">{formatPrice(s.price)}</div>
                      <div className="text-[10px] text-gray-400 -mt-1">per orang</div>
                    </div>
                  </div>
                  {s.desc && (
                    <div className="text-xs text-gray-300 flex items-center gap-1 mt-1">
                      <BiInfoCircle className="w-3.5 h-3.5" /> {s.desc}
                    </div>
                  )}

                  <div className="mt-4 rounded-xl bg-white/5 border border-white/10 p-3">
                    <div className="text-sm font-semibold text-gray-100 mb-2">Fitur yang termasuk:</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {includes.map((it, i) => (
                        <div key={`inc-${idx}-${i}`} className="flex items-center gap-2 text-sm text-gray-300">
                          <span className="h-2 w-2 rounded-full bg-blue-400 inline-block" /> {it}
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-semibold text-gray-100 mb-2">Syarat:</div>
                        <ul className="space-y-1">
                          {requirementTerms.map((it, i) => (
                            <li key={`req-${idx}-${i}`} className="flex items-center gap-2 text-sm text-gray-300">
                              <span className="h-2 w-2 rounded-full bg-orange-400 inline-block" /> {it}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-100 mb-2">Pembatalan:</div>
                        <ul className="space-y-1">
                          {cancellationTerms.map((it, i) => (
                            <li key={`can-${idx}-${i}`} className="flex items-center gap-2 text-sm text-gray-300">
                              <span className="h-2 w-2 rounded-full bg-rose-400 inline-block" /> {it}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => handleSeat(s.seat || s.name, Number(s.price || 0))}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold transition-all bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg hover:shadow-xl"
                    >
                      <BiCart className="text-lg" /> Pilih Paket Ini
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventPackages;


