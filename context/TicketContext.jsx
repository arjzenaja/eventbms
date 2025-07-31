"use client";
import React, { createContext, useState, useEffect, Children, use } from "react";

export const TicketContext = createContext();

const TicketProvider = ({ children }) => {
  const [event, setEvent] = useState(null); // state to store the event data
  const [seat, setSeat] = useState({ seat: null, price: null }); // state to store the selected sett
  const [showMenu, setShowMenu] = useState(true); // state to manage menu visibility
  const [itemAmount, setItemAmount] = useState(1); // state to track item amount (quanity of items)
  const [totalPrice, setTotalPrice] = useState(0); // state to store the total price
  const [checkoutData, setCheckoutData] = useState(null); //state to store the checkout data 

  const initalizeEvent = (fetchEvent) => {
    setEvent(fetchEvent);
    // reset item amount when a new event is initialized 
    setItemAmount(1);
    // initialize the "frontseat" if it exists in the fetched event data
    const frontseat = fetchEvent?.seats.find(
     (seat) => seat.seat === "frontseat" 
    );
    if (frontseat) {
      setSeat({ seat: frontseat.seat, price: frontseat.price });
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
    setTotalPrice(seat.price * itemAmount);
  }, [seat.price, itemAmount]);

  // function to handle the seat selection 
  const handleSeat = (seat, price) => {
    setSeat({ seat, price });
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
      totalPrice,
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