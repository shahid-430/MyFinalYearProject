// 

import React, { useContext, useEffect, useState } from "react";
import Title from "../component/Title";
import { ShopDataContext } from "../context/ShopContext";
import { AuthDataContext } from "../context/AuthContext";
import axios from "axios";

/* =========================
   ORDER TRACKING STEPS
========================= */
const TRACKING_STEPS = [
  "Order Placed",
  "Packing",
  "Shipped",
  "Out for delivery",
  "Delivered",
];

/* =========================
   COMMON BADGE STYLE
========================= */
const badgeClass =
  "px-4 py-2 bg-[#518080b4] rounded-md border border-[#9ff9f9] text-[14px] md:text-[16px] text-[#f3f9fc] font-medium text-center whitespace-nowrap";

function Orders() {

  /* =========================
     STATES
  ========================= */
  const [orderData, setOrderData] = useState([]);
  const [trackingOrderId, setTrackingOrderId] = useState(null);

  /* =========================
     CONTEXT DATA
  ========================= */
  const { currency, products } = useContext(ShopDataContext);
  const { serverUrl } = useContext(AuthDataContext);

  /* =========================
     GET PRODUCT IMAGE
  ========================= */
  const getItemImage = (item) => {
    if (item.image1) return item.image1;

    const product = products.find((p) => p._id === item._id);
    return product?.image1 || "";
  };

  /* =========================
     FORMAT DATE
  ========================= */
  const formatDate = (timestamp) => {
    if (!timestamp) return "";

    return new Date(timestamp).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  /* =========================
     CANCEL USER ORDER
  ========================= */
  const cancelOrder = async (orderId) => {
    if (!window.confirm("Cancel this order?")) return;

    try {
      const result = await axios.post(
        serverUrl + `/api/order/cancel/${orderId}`,
        {},
        { withCredentials: true }
      );

      if (result.data?.order) {
        setOrderData((prev) =>
          prev.map((item) =>
            item.orderId === orderId
              ? { ...item, status: result.data.order.status }
              : item
          )
        );
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to cancel order");
    }
  };

  /* =========================
     DELETE CANCELLED ORDER
  ========================= */
  const deleteOrder = async (orderId) => {
    if (
      !window.confirm(
        "Remove this cancelled order from your list? It will only hide it from your account."
      )
    ) {
      return;
    }

    try {
      await axios.delete(serverUrl + `/api/order/delete/${orderId}`, {
        withCredentials: true,
      });

      setOrderData((prev) => prev.filter((item) => item.orderId !== orderId));
      setTrackingOrderId((prev) => (prev === orderId ? null : prev));
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete order");
    }
  };

  /* =========================
     ACTIVE TRACKING STEP
  ========================= */
  const getActiveStepIndex = (status) => {
    const index = TRACKING_STEPS.findIndex(
      (step) => step.toLowerCase() === status?.toLowerCase()
    );

    return index >= 0 ? index : 0;
  };

  /* =========================
     LOAD ORDERS FROM BACKEND
  ========================= */
  const loadOrderData = async () => {
    try {
      const result = await axios.post(
        serverUrl + "/api/order/userorder",
        {},
        { withCredentials: true }
      );

      if (result.data) {
        const allOrdersItem = [];

        // Flatten orders into single list
        result.data.forEach((order) => {
          order.items.forEach((item) => {
            allOrdersItem.push({
              ...item,
              orderId: order._id,
              address: order.address,
              amount: order.amount,
              status: order.status,
              payment: order.payment,
              paymentMethod: order.PaymentMethod,
              date: order.date,
            });
          });
        });

        setOrderData(allOrdersItem.reverse());
      }
    } catch (error) {
      console.log("ORDER LOAD ERROR:", error);
    }
  };

  /* =========================
     INITIAL LOAD
  ========================= */
  useEffect(() => {
    loadOrderData();
  }, []);

  return (
    <div className="w-[98vw] min-h-[105vh] p-[20px] px-[20px] md:px-[150px] overflow-hidden bg-gradient-to-l from-[#141414] to-[#0c2025]">

      {/* PAGE TITLE */}
      <div className="text-center mt-[80px]">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>

      {/* ORDER LIST */}
      <div className="w-full flex flex-col gap-[20px] mt-6">

        {/* EMPTY STATE */}
        {orderData.length === 0 ? (
          <p className="text-[#aaf4e7] text-center text-lg mt-10">
            No orders yet.
          </p>
        ) : (

          /* ORDER MAP */
          orderData.map((item, index) => {

            const activeStep = getActiveStepIndex(item.status);
            const isTrackingOpen = trackingOrderId === item.orderId;

            return (
              <div key={index} className="w-full border-t border-b">

                {/* ORDER CARD */}
                <div className="flex items-start gap-6 bg-[#51808048] py-[10px] px-[20px] rounded-2xl">

                  {/* PRODUCT IMAGE */}
                  <img
                    src={getItemImage(item)}
                    alt={item.name || "Product"}
                    className="w-[100px] h-[100px] md:w-[130px] md:h-[130px] rounded-lg object-cover"
                  />

                  {/* PRODUCT DETAILS */}
                  <div className="flex flex-col gap-[10px] flex-1">

                    <p className="text-[20px] md:text-[25px] text-[#f3f9fc]">
                      {item.name}
                    </p>

                    <div className="flex flex-wrap gap-[10px] items-center">

                      <p className="text-[16px] md:text-[20px] text-[#aaf4e7]">
                        {currency} {item.price}
                      </p>

                      {item.size && (
                        <span className="px-2 py-1 text-white bg-[#518080b4] rounded-md border border-[#9ff9f9]">
                          {item.size}
                        </span>
                      )}

                      <p className="text-[16px] text-[#aaf4e7]">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    <p className="text-[14px] text-[#9ff9f9]">
                      Payment: {item.payment ? "Paid" : "Pending"} ({item.paymentMethod})
                    </p>

                    <p className="text-[14px] text-[#9ff9f9]">
                      Date: {formatDate(item.date)}
                    </p>
                  </div>

                  {/* STATUS + BUTTON */}
                  <div className="flex flex-col gap-2 ml-auto">

                    <div className={badgeClass}>
                      {item.status}
                    </div>

                    {item.status === "Cancelled" ? (
                      <button
                        onClick={() => deleteOrder(item.orderId)}
                        className={`${badgeClass} cursor-pointer bg-red-600/80 border-red-400 hover:bg-red-600`}
                      >
                        Delete Order
                      </button>
                    ) : (
                      <>
                        {(item.status === "Order Placed" || item.status === "Packing") && (
                          <button
                            onClick={() => cancelOrder(item.orderId)}
                            className={`${badgeClass} cursor-pointer bg-red-600/80 border-red-400 hover:bg-red-600`}
                          >
                            Cancel Order
                          </button>
                        )}

                        <button
                          onClick={() =>
                            setTrackingOrderId(
                              isTrackingOpen ? null : item.orderId
                            )
                          }
                          className={`${badgeClass} cursor-pointer`}
                        >
                          {isTrackingOpen ? "Hide Tracking" : "Track Order"}
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* TRACKING SECTION */}
                {isTrackingOpen && (
                  <div className="mt-[5px] p-5 bg-[#51808030] rounded-2xl border border-[#9ff9f9]/40">

                    {/* ORDER ID */}
                    <p className="text-sm text-[#aaf4e7]">
                      Order ID:{" "}
                      <span className="text-[#f3f9fc]">{item.orderId}</span>
                    </p>

                    {/* ADDRESS */}
                    {item.address && (
                      <p className="text-sm text-[#9ff9f9] mb-4">
                        Delivery: {item.address.street}, {item.address.city},{" "}
                        {item.address.state} - {item.address.pinCode}
                      </p>
                    )}

                    {/* TRACKING STEPS */}
                    <div>
                      {TRACKING_STEPS.map((step, stepIndex) => {

                        const isCompleted = stepIndex <= activeStep;
                        const isLast = stepIndex === TRACKING_STEPS.length - 1;

                        return (
                          <div key={step} className="flex gap-4">

                            {/* STEP DOT + LINE */}
                            <div className="flex flex-col items-center">

                              <div
                                className={`w-4 h-4 rounded-full border-2 ${isCompleted
                                  ? "bg-[#9ff9f9] border-[#9ff9f9]"
                                  : "border-gray-500"
                                  }`}
                              />

                              {!isLast && (
                                <div
                                  className={`w-0.5 h-10 ${stepIndex < activeStep
                                    ? "bg-[#9ff9f9]"
                                    : "bg-gray-600"
                                    }`}
                                />
                              )}
                            </div>

                            {/* STEP LABEL */}
                            <p
                              className={`pb-6 text-[14px] md:text-[16px] ${isCompleted
                                ? "text-[#f3f9fc] font-medium"
                                : "text-gray-500"
                                }`}
                            >
                              {step}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Orders;