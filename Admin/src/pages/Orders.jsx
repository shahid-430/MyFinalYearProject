import React, { useContext, useEffect, useState } from "react";
import Sidebar from "../component/Sidebar";
import Nav from "../component/Nav";
import { authDataContext } from "../context/AuthContext";
import axios from "axios";
import {
  FaBox,
  FaCalendarAlt,
  FaCreditCard,
  FaHashtag,
  FaMapMarkerAlt,
  FaShippingFast,
  FaUser,
  FaTrashAlt,
  FaBan,
} from "react-icons/fa";
import { SiTicktick } from "react-icons/si";
import BackToHomeButton from '../component/BackToHomeButton'

const ORDER_STATUSES = [
  "Order Placed",
  "Packing",
  "Shipped",
  "Out for delivery",
  "Delivered",
  "Cancelled",
];

const CANCELLABLE_STATUSES = ["Order Placed", "Packing"];

const STATUS_STYLES = {
  "Order Placed": "bg-cyan-500/20 text-cyan-200 border-cyan-400/50",
  Packing: "bg-amber-500/20 text-amber-200 border-amber-400/50",
  Shipped: "bg-violet-500/20 text-violet-200 border-violet-400/50",
  "Out for delivery": "bg-orange-500/20 text-orange-200 border-orange-400/50",
  Delivered: "bg-emerald-500/20 text-emerald-200 border-emerald-400/50",
  Cancelled: "bg-red-500/20 text-red-200 border-red-400/50",
};

const shortId = (id) => (id ? `${id.slice(0, 8)}…${id.slice(-6)}` : "");

function Orders() {
  const [orders, setOrders] = useState([]);
  const [trackingDraft, setTrackingDraft] = useState({});
  const { serverUrl } = useContext(authDataContext);

  const fetchOrders = async () => {
    try {
      const result = await axios.get(serverUrl + "/api/order/list", {
        withCredentials: true,
      });
      setOrders(result.data || []);
      const draft = {};
      (result.data || []).forEach((order) => {
        draft[order._id] = order.trackingNumber || "";
      });
      setTrackingDraft(draft);
    } catch (error) {
      console.log("fetchOrders error:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getPaymentMethod = (order) =>
    order.PaymentMethod ||
    order.paymentMethod ||
    (order.payment ? "Stripe" : "COD");

  const getPaymentLabel = (order) => (order.payment ? "Paid" : "Pending");

  const updateStatus = async (orderId, status) => {
    try {
      const result = await axios.patch(
        `${serverUrl}/api/order/${orderId}/status`,
        { status },
        { withCredentials: true }
      );
      if (result.data?.order) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? result.data.order : o))
        );
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update status");
    }
  };

  const saveTracking = async (orderId) => {
    try {
      const result = await axios.patch(
        `${serverUrl}/api/order/${orderId}/tracking`,
        { trackingNumber: trackingDraft[orderId] || "" },
        { withCredentials: true }
      );
      if (result.data?.order) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? result.data.order : o))
        );
        alert("Tracking number saved");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save tracking");
    }
  };

  const cancelOrder = async (orderId) => {
    if (!window.confirm("Cancel this order?")) return;
    try {
      const result = await axios.post(
        `${serverUrl}/api/order/admin/cancel/${orderId}`,
        {},
        { withCredentials: true }
      );
      if (result.data?.order) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? result.data.order : o))
        );
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to cancel order");
    }
  };

  const deleteOrder = async (orderId) => {
    if (
      !window.confirm(
        "Remove this cancelled order from the admin panel? The customer will still see it in their orders."
      )
    )
      return;
    try {
      await axios.delete(`${serverUrl}/api/order/admin/delete/${orderId}`, {
        withCredentials: true,
      });
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete order");
    }
  };

  return (
    <div className="w-[99vw] min-h-[100vh] bg-gradient-to-l from-[#141414] to-[#0c2025] text-white">
      <Nav />
      <div className="w-full flex">
        <Sidebar />

        <div className="w-[82%] lg:ml-[320px] md:ml-[230px] sm:ml-[100px] ml-[100px] mt-[70px] py-8 pr-6 pb-16 flex flex-col gap-6">
          {/* PAGE HEADER */}
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[#9ff9f9] text-sm uppercase tracking-widest mb-1">
                Dashboard
              </p>
              <h1 className="text-3xl md:text-4xl font-semibold text-[#f3f9fc]">
                All Orders
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-[#51808048] border border-[#9ff9f9]/30 mr-3">
                <SiTicktick className="text-[#9ff9f9] text-xl" />
                <div>
                  <p className="text-xs text-[#aaf4e7]">Total orders</p>
                  <p className="text-2xl font-bold text-[#f3f9f9]">{orders.length}</p>
                </div>
              </div>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="w-[95%] py-20 text-center rounded-2xl bg-[#51808030] border border-dashed border-[#9ff9f9]/40">
              <FaBox className="mx-auto text-4xl text-[#9ff9f9]/60 mb-3" />
              <p className="text-[#aaf4e7] text-lg">No orders yet.</p>
            </div>
          ) : (
            orders.map((order) => {
              const statusClass =
                STATUS_STYLES[order.status] ||
                "bg-[#518080b4] text-[#f3f9fc] border-[#9ff9f9]/40";

              return (
                <article
                  key={order._id}
                  className="w-[95%] rounded-2xl overflow-hidden border border-[#9ff9f9]/25 bg-gradient-to-br from-[#51808035] to-[#0c202580] shadow-lg shadow-black/20 hover:border-[#9ff9f9]/45 transition-colors"
                >
                  {/* CARD HEADER */}
                  <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 bg-[#51808055] border-b border-[#9ff9f9]/20">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-[#0c2025]/60 border border-[#9ff9f9]/30 flex items-center justify-center shrink-0">
                        <FaBox className="text-[#9ff9f9]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-[#aaf4e7] uppercase tracking-wide">
                          Order
                        </p>
                        <p
                          className="text-[#f3f9fc] font-mono text-sm md:text-base truncate"
                          title={order._id}
                        >
                          {shortId(order._id)}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`px-4 py-1.5 rounded-full text-sm font-medium border ${statusClass}`}
                    >
                      {order.status}
                    </span>

                    <p className="text-2xl md:text-3xl font-bold text-[#9ff9f9]">
                      Rs {order.amount}
                    </p>
                  </div>

                  {/* META ROW */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 px-5 py-4">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0c2025]/40 border border-[#9ff9f9]/15">
                      <FaHashtag className="text-[#9ff9f9] shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[11px] text-[#aaf4e7] uppercase">Order ID</p>
                        <p
                          className="text-sm text-[#f3f9fc] font-mono truncate"
                          title={order._id}
                        >
                          {order._id}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0c2025]/40 border border-[#9ff9f9]/15">
                      <FaUser className="text-[#9ff9f9] shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[11px] text-[#aaf4e7] uppercase">Customer</p>
                        <p
                          className="text-sm text-[#f3f9fc] font-mono truncate"
                          title={order.userId}
                        >
                          {shortId(order.userId)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0c2025]/40 border border-[#9ff9f9]/15">
                      <FaCreditCard className="text-[#9ff9f9] shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[11px] text-[#aaf4e7] uppercase">Payment</p>
                        <p className="text-sm text-[#f3f9fc] truncate">
                          {getPaymentMethod(order)} · {getPaymentLabel(order)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0c2025]/40 border border-[#9ff9f9]/15">
                      <FaCalendarAlt className="text-[#9ff9f9] shrink-0" />
                      <div>
                        <p className="text-[11px] text-[#aaf4e7] uppercase">Date</p>
                        <p className="text-sm text-[#f3f9fc]">{formatDate(order.date)}</p>
                      </div>
                    </div>
                  </div>

                  {/* ADDRESS */}
                  {order.address && (
                    <div className="mx-5 mb-4 flex gap-3 p-4 rounded-xl bg-[#51808030] border border-[#9ff9f9]/20">
                      <FaMapMarkerAlt className="text-[#9ff9f9] mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-[#aaf4e7] uppercase mb-1">
                          Delivery address
                        </p>
                        <p className="text-[#f3f9fc] text-sm leading-relaxed">
                          <span className="font-medium">
                            {order.address.firstName} {order.address.lastName}
                          </span>
                          <br />
                          {order.address.street}, {order.address.city},{" "}
                          {order.address.state} — {order.address.pinCode}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* ITEMS */}
                  <div className="px-5 pb-4">
                    <p className="text-xs text-[#aaf4e7] uppercase tracking-wide mb-3">
                      Items ({order.items?.length || 0})
                    </p>
                    <div className="flex flex-col gap-2">
                      {order.items?.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-4 p-3 rounded-xl bg-[#0c2025]/50 border border-[#9ff9f9]/10 hover:border-[#9ff9f9]/25 transition-colors"
                        >
                          {item.image1 ? (
                            <img
                              src={item.image1}
                              alt={item.name}
                              className="w-14 h-14 rounded-lg object-cover border border-[#9ff9f9]/20"
                            />
                          ) : (
                            <div className="w-14 h-14 rounded-lg bg-[#51808060] border border-[#9ff9f9]/20 flex items-center justify-center">
                              <FaBox className="text-[#9ff9f9]/70" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-[#f3f9fc] font-medium truncate">
                              {item.name}
                            </p>
                            <p className="text-sm text-[#aaf4e7]">
                              Qty: {item.quantity}
                              {item.size && (
                                <span className="ml-2 px-2 py-0.5 rounded-md bg-[#518080b4] border border-[#9ff9f9]/40 text-[#f3f9fc] text-xs">
                                  {item.size}
                                </span>
                              )}
                            </p>
                          </div>
                          <p className="text-[#9ff9f9] font-semibold shrink-0">
                            Rs {item.price}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="px-5 py-4 bg-[#0c2025]/30 border-t border-[#9ff9f9]/15 flex flex-wrap gap-4 items-end">
                    <div className="min-w-[200px]">
                      <label className="flex items-center gap-2 text-xs text-[#aaf4e7] uppercase mb-2">
                        <SiTicktick className="text-[#9ff9f9]" />
                        Update status
                      </label>
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                        disabled={order.status === "Cancelled"}
                        className="w-full p-2.5 rounded-lg bg-[#51808060] border border-[#9ff9f9]/40 text-[#f3f9fc] focus:outline-none focus:ring-2 focus:ring-[#9ff9f9]/50 cursor-pointer disabled:opacity-50"
                      >
                        {ORDER_STATUSES.map((s) => (
                          <option key={s} value={s} className="bg-[#0c2025]">
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex-1 min-w-[260px]">
                      <label className="flex items-center gap-2 text-xs text-[#aaf4e7] uppercase mb-2">
                        <FaShippingFast className="text-[#9ff9f9]" />
                        Tracking number
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={trackingDraft[order._id] ?? ""}
                          onChange={(e) =>
                            setTrackingDraft((prev) => ({
                              ...prev,
                              [order._id]: e.target.value,
                            }))
                          }
                          placeholder="e.g. TRACK123456"
                          disabled={order.status === "Cancelled"}
                          className="flex-1 p-2.5 rounded-lg bg-[#51808060] border border-[#9ff9f9]/40 text-[#f3f9fc] placeholder:text-[#aaf4e7]/50 focus:outline-none focus:ring-2 focus:ring-[#9ff9f9]/50 disabled:opacity-50"
                        />
                        <button
                          type="button"
                          onClick={() => saveTracking(order._id)}
                          disabled={order.status === "Cancelled"}
                          className="px-5 py-2.5 rounded-lg bg-[#2c7b89] border border-[#9ff9f9]/50 text-[#f3f9fc] font-medium hover:bg-[#3a9aad] transition-colors disabled:opacity-50"
                        >
                          Save
                        </button>
                      </div>
                    </div>

                    {CANCELLABLE_STATUSES.includes(order.status) && (
                      <button
                        type="button"
                        onClick={() => cancelOrder(order._id)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-red-600/80 border border-red-400/50 text-white font-medium hover:bg-red-600 transition-colors"
                      >
                        <FaBan className="text-sm" />
                        Cancel Order
                      </button>
                    )}

                    {order.status === "Cancelled" && (
                      <button
                        type="button"
                        onClick={() => deleteOrder(order._id)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gray-700/90 border border-gray-500/50 text-white font-medium hover:bg-gray-600 transition-colors"
                      >
                        <FaTrashAlt className="text-sm" />
                        Delete Order
                      </button>
                    )}
                  </div>
                </article>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default Orders;
