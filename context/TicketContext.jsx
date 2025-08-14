"use client";
import React, { createContext, useState, useEffect, Children, use } from "react";

export const TicketContext = createContext();

const TicketProvider = ({ children }) => {
  const [event, setEvent] = useState(null); // state to store the event data
  const [seat, setSeat] = useState({ seat: null, price: null }); // state to store the selected sett
  const [showMenu, setShowMenu] = useState(false); // state to manage menu visibility
  const [itemAmount, setItemAmount] = useState(1); // state to track item amount (quanity of items)
  const [totalPrice, setTotalPrice] = useState(0); // state to store the total price
  const [checkoutData, setCheckoutData] = useState(null); //state to store the checkout data 

  const initalizeEvent = (fetchEvent) => {
    setEvent(fetchEvent);
    // reset item amount when a new event is initialized 
    setItemAmount(1);
    // safely read seats array
    const seats = Array.isArray(fetchEvent?.seats) ? fetchEvent.seats : [];
    const preferredSeat = seats.find((s) => s.seat === "frontseat") || seats[0];
    if (preferredSeat) {
      const validPrice = preferredSeat.price && !isNaN(Number(preferredSeat.price)) ? Number(preferredSeat.price) : 0;
      setSeat({ seat: preferredSeat.seat, price: validPrice });
    } else {
      setSeat({ seat: null, price: 0 });
    }
  };

  // effect to handle click outside of the menu to close it 
  useEffect(() => {
    const handleClickOutside = (e) => {
      if(!e.target.closest(".custom-select")) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // calculate total price whenever the seat price or item amount changes
  useEffect(() => {
    // Ensure seat.price is a valid number before calculation
    const validPrice = seat.price && !isNaN(Number(seat.price)) ? Number(seat.price) : 0;
    const validAmount = itemAmount && !isNaN(Number(itemAmount)) ? Number(itemAmount) : 1;
    setTotalPrice(validPrice * validAmount);
  }, [seat.price, itemAmount]);

  // function to handle the seat selection 
  const handleSeat = (seat, price) => {
    // Ensure price is a valid number
    const validPrice = price && !isNaN(Number(price)) ? Number(price) : 0;
    setSeat({ seat, price: validPrice });
    setShowMenu(false);
  };

  // function to handle "Buy Now"
  const buyNow = (event) => {
    const ticketData ={
      eventId: event.id,
      eventName: event.title,
      ticketType: seat.seat,
      ticketPrice: seat.price,
      amount: itemAmount,
      totalPrice: totalPrice || 0, // Ensure totalPrice is never NaN
    };

    setCheckoutData(ticketData); // in case if we want to use the data for the checkout page
  };

  const increaseAmount = () => {
    setItemAmount((prevAmount) => prevAmount + 1);
  };

  const decreaseAmount = () => {
    setItemAmount((prevAmount) => (prevAmount > 1 ? prevAmount -1 :1)); // if prevAmount is bigger then 1 you can decrease otherwise keep it to 1
  }

  return (
    <TicketContext.Provider 
      value={{
       event,
       seat,
       showMenu,
       itemAmount,
       totalPrice,
       checkoutData,
       handleSeat,
       setSeat,
       setShowMenu,
       buyNow,
       initalizeEvent,
       increaseAmount,
       decreaseAmount,
      }}
       >
      {children}
    </TicketContext.Provider>
  );
};

export default TicketProvider;