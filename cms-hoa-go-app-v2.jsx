import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════════
   DESIGN SYSTEM — 3D Minimal · Outline Icons · Glass + Depth
═══════════════════════════════════════════════════════════════════ */
const T = {
  bg:      "#F2F4F8",
  surface: "#FFFFFF",
  glass:   "rgba(255,255,255,0.72)",
  navy:    "#0A1628",
  ink:     "#1C2B3A",
  slate:   "#4A5568",
  muted:   "#8896A7",
  border:  "#DDE3EC",
  teal:    "#0B8A8A",
  tealLt:  "#E0F4F4",
  blue:    "#1A5CFF",
  blueLt:  "#E8EEFF",
  green:   "#0D7A4E",
  greenLt: "#E0F5EC",
  amber:   "#B45309",
  amberLt: "#FEF3C7",
  red:     "#C0392B",
  redLt:   "#FEE8E6",
  purple:  "#6B3FA0",
  purpleLt:"#F0EAFA",
  grad:    "linear-gradient(160deg,#0A1628 0%,#0F2540 45%,#0A3D62 100%)",
  gradCard:"linear-gradient(145deg,#ffffff 0%,#f7f9fc 100%)",
  shadow:  "0 2px 8px rgba(10,22,40,0.08), 0 8px 24px rgba(10,22,40,0.06)",
  shadowHv:"0 4px 16px rgba(10,22,40,0.12), 0 16px 40px rgba(10,22,40,0.10)",
  shadow3d:"0 1px 0 rgba(255,255,255,0.8) inset, 0 4px 12px rgba(10,22,40,0.12), 0 1px 3px rgba(10,22,40,0.08)",
};

const AVATAR_PALETTE = [
  ["#0B8A8A","#E0F4F4"],["#1A5CFF","#E8EEFF"],["#6B3FA0","#F0EAFA"],
  ["#C0392B","#FEE8E6"],["#B45309","#FEF3C7"],["#0D7A4E","#E0F5EC"],["#1C2B3A","#F2F4F8"],
];

const fmt  = n => `₱${Number(n).toLocaleString("en-PH",{minimumFractionDigits:2})}`;
const today= () => new Date().toISOString().split("T")[0];
const genRef= m => ({gcash:"GC",paymaya:"PM",bank:"BNK",cash:"CSH"}[m]||"TXN")+"-"+
  new Date().toISOString().replace(/-/g,"").slice(0,8)+"-"+Math.floor(Math.random()*9000+1000);

/* ═══════════════════════════════════════════════════════════════════
   OUTLINE ICON LIBRARY (SVG, no fill)
═══════════════════════════════════════════════════════════════════ */
const SZ = { xs:14, sm:16, md:18, lg:22, xl:28 };
const Icon = ({ name, size="md", color="currentColor", strokeWidth=1.6, style={} }) => {
  const s = typeof size==="number" ? size : SZ[size]||18;
  const props = { width:s, height:s, viewBox:"0 0 24 24", fill:"none", stroke:color, strokeWidth, strokeLinecap:"round", strokeLinejoin:"round", style:{flexShrink:0,...style} };
  const icons = {
    home:       <svg {...props}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    receipt:    <svg {...props}><path d="M4 2v20l3-3 3 3 3-3 3 3 3-3V2"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="15" y2="13"/></svg>,
    users:      <svg {...props}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    chart:      <svg {...props}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    bell:       <svg {...props}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
    lock:       <svg {...props}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
    logout:     <svg {...props}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    user:       <svg {...props}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    shield:     <svg {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    settings:   <svg {...props}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
    edit:       <svg {...props}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    trash:      <svg {...props}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
    plus:       <svg {...props}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    download:   <svg {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
    upload:     <svg {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
    mail:       <svg {...props}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
    phone:      <svg {...props}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.77 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
    check:      <svg {...props}><polyline points="20 6 9 17 4 12"/></svg>,
    x:          <svg {...props}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    eye:        <svg {...props}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    eyeOff:     <svg {...props}><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
    send:       <svg {...props}><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
    alertTri:   <svg {...props}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    info:       <svg {...props}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
    calendar:   <svg {...props}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    credit:     <svg {...props}><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
    printer:    <svg {...props}><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>,
    grid:       <svg {...props}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
    list:       <svg {...props}><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
    droplet:    <svg {...props}><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>,
    building:   <svg {...props}><rect x="4" y="2" width="16" height="20" rx="1"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01"/></svg>,
    clock:      <svg {...props}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    search:     <svg {...props}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    filter:     <svg {...props}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
    smartphone: <svg {...props}><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>,
    key:        <svg {...props}><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>,
    chevDown:   <svg {...props}><polyline points="6 9 12 15 18 9"/></svg>,
    chevRight:  <svg {...props}><polyline points="9 18 15 12 9 6"/></svg>,
    arrowLeft:  <svg {...props}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
    more:       <svg {...props}><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>,
    star:       <svg {...props}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    refresh:    <svg {...props}><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
    percent:    <svg {...props}><line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>,
    package:    <svg {...props}><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
    sparkle:    <svg {...props}><path d="M12 3L13.5 8.5H19L14.5 12L16 17.5L12 14L8 17.5L9.5 12L5 8.5H10.5L12 3Z"/></svg>,
  };
  return icons[name] || <svg {...props}><circle cx="12" cy="12" r="10"/></svg>;
};

/* ═══════════════════════════════════════════════════════════════════
   SEED DATA
═══════════════════════════════════════════════════════════════════ */
const USERS_INIT = [
  { id:"sa1",  role:"superadmin", name:"Super Admin",      email:"superadmin@cmshoa.ph", password:"super123",  unit:"", mobile:"09001112222", notifDays:[7,3,1,0] },
  { id:"adm1", role:"admin",      name:"HOA Admin",        email:"admin@cmshoa.ph",      password:"admin123",  unit:"", mobile:"09003334444", notifDays:[7,3,1,0] },
  { id:"adm2", role:"admin",      name:"Maria Admin",      email:"maria.admin@cmshoa.ph",password:"mariaadm",  unit:"", mobile:"09005556666", notifDays:[7,3,1,0] },
  { id:"r1",   role:"resident",   name:"Maria Santos",     email:"maria@email.com",      password:"maria123",  unit:"Block 1 Lot 2", residentId:1, mobile:"09171234567", notifDays:[7,3,1,0] },
  { id:"r2",   role:"resident",   name:"Jose Reyes",       email:"jose@email.com",       password:"jose123",   unit:"Block 1 Lot 5", residentId:2, mobile:"09182345678", notifDays:[3,1,0] },
  { id:"r3",   role:"resident",   name:"Ana Cruz",         email:"ana@email.com",        password:"ana123",    unit:"Block 2 Lot 1", residentId:3, mobile:"09193456789", notifDays:[7,1,0] },
  { id:"r4",   role:"resident",   name:"Carlos Dela Cruz", email:"carlos@email.com",     password:"carlos123", unit:"Block 2 Lot 8", residentId:4, mobile:"09204567890", notifDays:[7,3,1,0] },
  { id:"r5",   role:"resident",   name:"Liza Mendoza",     email:"liza@email.com",       password:"liza123",   unit:"Block 3 Lot 3", residentId:5, mobile:"09215678901", notifDays:[1,0] },
  { id:"r6",   role:"resident",   name:"Ramon Villanueva", email:"ramon@email.com",      password:"ramon123",  unit:"Block 3 Lot 7", residentId:6, mobile:"09226789012", notifDays:[7,3,1,0] },
  { id:"r7",   role:"resident",   name:"Grace Tan",        email:"grace@email.com",      password:"grace123",  unit:"Block 4 Lot 2", residentId:7, mobile:"09237890123", notifDays:[7,3,1,0] },
];

const RESIDENTS_INIT = [
  { id:1, name:"Maria Santos",     unit:"Block 1 Lot 2", email:"maria@email.com",  phone:"09171234567", joinDate:"2022-01-15" },
  { id:2, name:"Jose Reyes",       unit:"Block 1 Lot 5", email:"jose@email.com",   phone:"09182345678", joinDate:"2021-06-10" },
  { id:3, name:"Ana Cruz",         unit:"Block 2 Lot 1", email:"ana@email.com",    phone:"09193456789", joinDate:"2020-03-22" },
  { id:4, name:"Carlos Dela Cruz", unit:"Block 2 Lot 8", email:"carlos@email.com", phone:"09204567890", joinDate:"2023-08-01" },
  { id:5, name:"Liza Mendoza",     unit:"Block 3 Lot 3", email:"liza@email.com",   phone:"09215678901", joinDate:"2022-11-30" },
  { id:6, name:"Ramon Villanueva", unit:"Block 3 Lot 7", email:"ramon@email.com",  phone:"09226789012", joinDate:"2021-02-14" },
  { id:7, name:"Grace Tan",        unit:"Block 4 Lot 2", email:"grace@email.com",  phone:"09237890123", joinDate:"2023-01-05" },
];

const BILLS_INIT = [
  { id:1,  residentId:1, type:"water", amount:850,  dueDate:"2026-05-15", status:"unpaid",  month:"May 2026", issuedDate:"2026-05-01", ref:null, method:null, paidDate:null },
  { id:2,  residentId:1, type:"dues",  amount:500,  dueDate:"2026-05-15", status:"paid",    month:"May 2026", issuedDate:"2026-05-01", ref:"GC-20260503-1001", method:"gcash",   paidDate:"2026-05-03" },
  { id:3,  residentId:1, type:"water", amount:790,  dueDate:"2026-04-15", status:"paid",    month:"Apr 2026", issuedDate:"2026-04-01", ref:"GC-20260410-0882", method:"gcash",   paidDate:"2026-04-10" },
  { id:4,  residentId:1, type:"dues",  amount:500,  dueDate:"2026-04-15", status:"paid",    month:"Apr 2026", issuedDate:"2026-04-01", ref:"BNK-20260412-4421",method:"bank",    paidDate:"2026-04-12" },
  { id:5,  residentId:2, type:"water", amount:1200, dueDate:"2026-05-15", status:"overdue", month:"May 2026", issuedDate:"2026-05-01", ref:null, method:null, paidDate:null },
  { id:6,  residentId:2, type:"dues",  amount:500,  dueDate:"2026-05-15", status:"unpaid",  month:"May 2026", issuedDate:"2026-05-01", ref:null, method:null, paidDate:null },
  { id:7,  residentId:2, type:"water", amount:1150, dueDate:"2026-04-15", status:"paid",    month:"Apr 2026", issuedDate:"2026-04-01", ref:"PM-20260408-7710", method:"paymaya", paidDate:"2026-04-08" },
  { id:8,  residentId:3, type:"water", amount:630,  dueDate:"2026-05-15", status:"paid",    month:"May 2026", issuedDate:"2026-05-01", ref:"GC-20260504-2233", method:"gcash",   paidDate:"2026-05-04" },
  { id:9,  residentId:3, type:"dues",  amount:500,  dueDate:"2026-05-15", status:"paid",    month:"May 2026", issuedDate:"2026-05-01", ref:"GC-20260504-2234", method:"gcash",   paidDate:"2026-05-04" },
  { id:10, residentId:4, type:"water", amount:980,  dueDate:"2026-05-15", status:"unpaid",  month:"May 2026", issuedDate:"2026-05-01", ref:null, method:null, paidDate:null },
  { id:11, residentId:4, type:"dues",  amount:500,  dueDate:"2026-05-15", status:"overdue", month:"May 2026", issuedDate:"2026-05-01", ref:null, method:null, paidDate:null },
  { id:12, residentId:5, type:"water", amount:750,  dueDate:"2026-05-15", status:"unpaid",  month:"May 2026", issuedDate:"2026-05-01", ref:null, method:null, paidDate:null },
  { id:13, residentId:5, type:"dues",  amount:500,  dueDate:"2026-05-15", status:"unpaid",  month:"May 2026", issuedDate:"2026-05-01", ref:null, method:null, paidDate:null },
  { id:14, residentId:6, type:"water", amount:910,  dueDate:"2026-05-15", status:"paid",    month:"May 2026", issuedDate:"2026-05-01", ref:"CSH-20260502-0011",method:"cash",    paidDate:"2026-05-02" },
  { id:15, residentId:6, type:"dues",  amount:500,  dueDate:"2026-05-15", status:"paid",    month:"May 2026", issuedDate:"2026-05-01", ref:"CSH-20260502-0012",method:"cash",    paidDate:"2026-05-02" },
  { id:16, residentId:7, type:"water", amount:670,  dueDate:"2026-05-15", status:"unpaid",  month:"May 2026", issuedDate:"2026-05-01", ref:null, method:null, paidDate:null },
  { id:17, residentId:7, type:"dues",  amount:500,  dueDate:"2026-05-15", status:"unpaid",  month:"May 2026", issuedDate:"2026-05-01", ref:null, method:null, paidDate:null },
];

const ANNOUNCEMENTS_INIT = [
  { id:1, title:"Water Interruption — May 10", body:"Scheduled water maintenance from 8AM–12PM. Please store water in advance.", date:"2026-05-05", type:"alert" },
  { id:2, title:"HOA General Assembly — May 20", body:"All residents are invited to the annual general assembly at the clubhouse. 6:00 PM.", date:"2026-05-03", type:"event" },
  { id:3, title:"New Security Personnel Starting June", body:"Two new security personnel will begin duty on June 1.", date:"2026-04-28", type:"info" },
];

/* ═══════════════════════════════════════════════════════════════════
   SHARED STYLES
═══════════════════════════════════════════════════════════════════ */
const inp = {
  width:"100%", padding:"11px 14px", borderRadius:10,
  border:`1.5px solid ${T.border}`, fontSize:14, outline:"none",
  fontFamily:"'Plus Jakarta Sans',sans-serif", color:T.ink,
  boxSizing:"border-box", background:"#FAFBFD",
  transition:"border-color .2s, box-shadow .2s",
};
const lbl = { display:"block", fontSize:11, fontWeight:700, color:T.muted, marginBottom:5, letterSpacing:0.7, textTransform:"uppercase" };
const btn = (bg, c="#fff", outline=false) => ({
  width:"100%", padding:"12px 18px", borderRadius:10,
  border: outline ? `1.5px solid ${bg}` : "none",
  background: outline ? "transparent" : bg,
  color: outline ? bg : c,
  fontWeight:700, fontSize:14, cursor:"pointer",
  fontFamily:"'Plus Jakarta Sans',sans-serif",
  transition:"all .2s", letterSpacing:0.2,
  boxShadow: outline ? "none" : T.shadow3d,
});
const card = {
  background: T.surface,
  borderRadius: 18,
  boxShadow: T.shadow,
  border: `1px solid ${T.border}`,
  overflow: "hidden",
};

/* ═══════════════════════════════════════════════════════════════════
   AVATAR
═══════════════════════════════════════════════════════════════════ */
function Av({name="?", size=36, idx=0}) {
  const initials = name.split(" ").slice(0,2).map(w=>w[0]).join("").toUpperCase();
  const [fg, bg] = AVATAR_PALETTE[idx % AVATAR_PALETTE.length];
  return (
    <div style={{width:size, height:size, borderRadius:"50%", background:bg,
      color:fg, display:"flex", alignItems:"center", justifyContent:"center",
      fontWeight:800, fontSize:size*.36, flexShrink:0, border:`1.5px solid ${fg}22`,
      fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
      {initials}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   BADGE
═══════════════════════════════════════════════════════════════════ */
function Badge({status}) {
  const M = {
    paid:    {bg:T.greenLt, c:T.green,  t:"Paid",    icon:"check"},
    unpaid:  {bg:T.amberLt, c:T.amber,  t:"Unpaid",  icon:"clock"},
    overdue: {bg:T.redLt,   c:T.red,    t:"Overdue", icon:"alertTri"},
  };
  const s = M[status]||M.unpaid;
  return (
    <span style={{background:s.bg, color:s.c, borderRadius:20, padding:"3px 10px 3px 6px",
      fontSize:11, fontWeight:700, display:"inline-flex", alignItems:"center", gap:4, whiteSpace:"nowrap"}}>
      <Icon name={s.icon} size={12} color={s.c} strokeWidth={2.2}/>{s.t}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MODAL
═══════════════════════════════════════════════════════════════════ */
function Modal({title, onClose, children, wide, icon}) {
  useEffect(()=>{document.body.style.overflow="hidden"; return()=>{document.body.style.overflow="";};},[]);
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(10,22,40,.55)",display:"flex",
      alignItems:"center",justifyContent:"center",zIndex:9999,backdropFilter:"blur(8px)",padding:16}}
      onClick={onClose}>
      <div style={{background:T.surface, borderRadius:22, padding:"28px 30px",
        width:"100%", maxWidth:wide?740:500, maxHeight:"92vh", overflowY:"auto",
        boxShadow:"0 32px 80px rgba(10,22,40,.3), 0 0 0 1px rgba(255,255,255,.8) inset",
        animation:"popIn .22s cubic-bezier(.34,1.56,.64,1)"}}
        onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            {icon&&<div style={{width:34,height:34,borderRadius:9,background:T.blueLt,
              display:"flex",alignItems:"center",justifyContent:"center"}}>
              <Icon name={icon} size="sm" color={T.blue}/>
            </div>}
            <span style={{fontFamily:"'Sora',sans-serif",fontSize:17,fontWeight:700,color:T.navy}}>{title}</span>
          </div>
          <button onClick={onClose} style={{border:"none",background:T.bg,borderRadius:"50%",width:30,height:30,
            cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Icon name="x" size="sm" color={T.muted}/>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   TOAST NOTIFICATION
═══════════════════════════════════════════════════════════════════ */
function Toast({message, type="success", onDone}) {
  useEffect(()=>{ const t=setTimeout(onDone,3000); return()=>clearTimeout(t); },[]);
  const bg = type==="error"?T.red:type==="warn"?T.amber:T.teal;
  return (
    <div style={{position:"fixed",top:20,right:20,zIndex:99999,
      background:T.navy,color:"#fff",borderRadius:14,padding:"14px 20px",
      boxShadow:"0 8px 32px rgba(0,0,0,.25)",animation:"slideInRight .3s ease",
      display:"flex",alignItems:"center",gap:10,maxWidth:340,
      borderLeft:`4px solid ${bg}`}}>
      <Icon name={type==="error"?"x":type==="warn"?"alertTri":"check"} size="sm" color={bg} strokeWidth={2.2}/>
      <span style={{fontSize:13,fontWeight:600}}>{message}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   AUTO REMINDER ENGINE — simulates scheduled notifications
═══════════════════════════════════════════════════════════════════ */
function computeReminders(bills, users) {
  const todayDate = new Date(today());
  const reminders = [];
  bills.filter(b=>b.status!=="paid").forEach(b=>{
    const user = users.find(u=>u.residentId===b.residentId);
    if(!user) return;
    const due = new Date(b.dueDate);
    const diff = Math.round((due-todayDate)/(1000*60*60*24));
    const days = user.notifDays||[7,3,1,0];
    if(days.includes(diff) || days.includes(Math.abs(diff)&&diff<0?-1:diff)) {
      reminders.push({
        residentId:b.residentId, name:user.name, mobile:user.mobile, email:user.email,
        billId:b.id, type:b.type, amount:b.amount, dueDate:b.dueDate, month:b.month,
        daysUntil:diff,
        message: diff===0 ? `[CMS HOA GO] Hi ${user.name}, your ${b.type==="water"?"Water Bill":"Monthly Dues"} of ${fmt(b.amount)} is DUE TODAY. Pay now via the app.`
          : diff<0 ? `[CMS HOA GO] Hi ${user.name}, your ${b.type==="water"?"Water Bill":"Monthly Dues"} of ${fmt(b.amount)} is OVERDUE by ${Math.abs(diff)} day(s). Please pay immediately.`
          : `[CMS HOA GO] Hi ${user.name}, your ${b.type==="water"?"Water Bill":"Monthly Dues"} of ${fmt(b.amount)} for ${b.month} is due in ${diff} day(s) (${b.dueDate}). Pay via CMS HOA GO APP.`,
      });
    }
  });
  return reminders;
}

/* ═══════════════════════════════════════════════════════════════════
   LOGIN SCREEN
═══════════════════════════════════════════════════════════════════ */
function LoginScreen({onLogin}) {
  const [email,setEmail]=useState("");
  const [pw,setPw]=useState("");
  const [showPw,setShowPw]=useState(false);
  const [err,setErr]=useState("");
  const [loading,setLoading]=useState(false);

  const handle=()=>{
    setErr("");
    if(!email||!pw){setErr("Please fill in all fields.");return;}
    setLoading(true);
    setTimeout(()=>{
      const u=USERS_INIT.find(u=>u.email.toLowerCase()===email.toLowerCase()&&u.password===pw);
      if(u) onLogin({...u});
      else { setErr("Invalid email or password."); setLoading(false); }
    },900);
  };

  return (
    <div style={{minHeight:"100vh",background:T.grad,display:"flex",alignItems:"center",justifyContent:"center",padding:16,position:"relative",overflow:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        @keyframes fadeUp{from{transform:translateY(24px);opacity:0}to{transform:translateY(0);opacity:1}}
        @keyframes popIn{from{transform:scale(.88);opacity:0}to{transform:scale(1);opacity:1}}
        @keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:.6}50%{opacity:1}}
        @keyframes slideInRight{from{transform:translateX(120%);opacity:0}to{transform:translateX(0);opacity:1}}
        @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:10px}
        input:focus,select:focus,textarea:focus{border-color:${T.teal}!important;box-shadow:0 0 0 3px ${T.tealLt}!important;outline:none}
        button:focus{outline:none}
        .navbtn:hover{background:rgba(255,255,255,.12)!important}
        .row-hover:hover{background:#f9fafc!important;transition:background .15s}
        .card-hover:hover{transform:translateY(-2px);box-shadow:${T.shadowHv}!important;transition:all .2s}
      `}</style>

      {/* decorative circles */}
      {[["-100px","-100px","400px","rgba(14,154,167,.12)"],["-50px","60%","300px","rgba(26,92,255,.08)"],["auto","auto","500px","rgba(255,255,255,.03)"]].map(([t,l,s,c],i)=>(
        <div key={i} style={{position:"absolute",top:t,left:l,width:s,height:s,borderRadius:"50%",background:c,pointerEvents:"none"}}/>
      ))}

      <div style={{width:"100%",maxWidth:420,animation:"fadeUp .5s ease"}}>
        {/* Logo */}
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{width:72,height:72,borderRadius:22,
            background:"rgba(255,255,255,.1)",border:"1.5px solid rgba(255,255,255,.2)",
            display:"flex",alignItems:"center",justifyContent:"center",
            margin:"0 auto 16px",animation:"floatY 4s ease-in-out infinite",
            boxShadow:"0 8px 32px rgba(0,0,0,.2)"}}>
            <Icon name="building" size={36} color="#fff" strokeWidth={1.4}/>
          </div>
          <div style={{fontFamily:"'Sora',sans-serif",color:"#fff",fontSize:26,fontWeight:800,letterSpacing:-.5}}>CMS HOA GO APP</div>
          <div style={{color:"rgba(255,255,255,.45)",fontSize:12,marginTop:6,fontWeight:500,letterSpacing:1.5,textTransform:"uppercase"}}>Community Management System</div>
        </div>

        {/* Card */}
        <div style={{background:"rgba(255,255,255,.97)",borderRadius:24,padding:"32px",
          boxShadow:"0 32px 80px rgba(0,0,0,.3), 0 0 0 1px rgba(255,255,255,.5) inset"}}>
          <div style={{fontFamily:"'Sora',sans-serif",fontSize:20,fontWeight:700,color:T.navy,marginBottom:6}}>Welcome back</div>
          <div style={{fontSize:13,color:T.muted,marginBottom:24}}>Sign in to your account to continue</div>

          <label style={lbl}>Email Address</label>
          <div style={{position:"relative",marginBottom:14}}>
            <Icon name="mail" size="sm" color={T.muted} style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)"}}/>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
              placeholder="your@email.com" style={{...inp,paddingLeft:38}}
              onKeyDown={e=>e.key==="Enter"&&handle()}/>
          </div>

          <label style={lbl}>Password</label>
          <div style={{position:"relative",marginBottom:8}}>
            <Icon name="lock" size="sm" color={T.muted} style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)"}}/>
            <input type={showPw?"text":"password"} value={pw} onChange={e=>setPw(e.target.value)}
              placeholder="••••••••" style={{...inp,paddingLeft:38,paddingRight:44}}
              onKeyDown={e=>e.key==="Enter"&&handle()}/>
            <button onClick={()=>setShowPw(s=>!s)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",border:"none",background:"none",cursor:"pointer",padding:0,display:"flex"}}>
              <Icon name={showPw?"eyeOff":"eye"} size="sm" color={T.muted}/>
            </button>
          </div>

          {err&&<div style={{background:T.redLt,color:T.red,borderRadius:9,padding:"9px 14px",fontSize:13,fontWeight:600,marginBottom:12,display:"flex",alignItems:"center",gap:6}}>
            <Icon name="alertTri" size="sm" color={T.red}/>{err}
          </div>}

          <button onClick={handle} disabled={loading} style={{...btn(T.navy),marginTop:10,display:"flex",alignItems:"center",justifyContent:"center",gap:8,height:46}}>
            {loading?<span style={{width:16,height:16,border:"2px solid rgba(255,255,255,.3)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin .7s linear infinite"}}/>:<><Icon name="key" size="sm" color="#fff"/>Sign In</>}
          </button>

          <div style={{marginTop:22,paddingTop:20,borderTop:`1px solid ${T.border}`}}>
            <div style={{fontSize:11,color:T.muted,fontWeight:700,letterSpacing:0.8,textTransform:"uppercase",textAlign:"center",marginBottom:10}}>Quick Demo Access</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
              {[
                {label:"Super Admin",user:USERS_INIT[0],icon:"shield",c:T.purple},
                {label:"Admin",     user:USERS_INIT[1],icon:"settings",c:T.blue},
                {label:"Resident",  user:USERS_INIT[3],icon:"home",c:T.teal},
              ].map(x=>(
                <button key={x.label} onClick={()=>onLogin({...x.user})} style={{
                  padding:"10px 6px",borderRadius:10,border:`1.5px solid ${x.c}22`,
                  background:`${x.c}0D`,cursor:"pointer",textAlign:"center",
                  transition:"all .2s",
                }}>
                  <Icon name={x.icon} size="md" color={x.c} style={{display:"block",margin:"0 auto 4px"}}/>
                  <div style={{fontSize:10,fontWeight:700,color:x.c}}>{x.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div style={{color:"rgba(255,255,255,.25)",fontSize:11,textAlign:"center",marginTop:20}}>© 2026 CMS HOA GO APP · All rights reserved</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   CHANGE PASSWORD MODAL
═══════════════════════════════════════════════════════════════════ */
function ChangePasswordModal({user, onSave, onClose}) {
  const [f,setF]=useState({cur:"",nw:"",cf:""});
  const [err,setErr]=useState("");
  const [showAll,setShowAll]=useState(false);
  const go=()=>{
    if(!f.cur||!f.nw||!f.cf){setErr("All fields required.");return;}
    if(f.cur!==user.password){setErr("Current password is incorrect.");return;}
    if(f.nw.length<6){setErr("New password must be at least 6 characters.");return;}
    if(f.nw!==f.cf){setErr("Passwords do not match.");return;}
    onSave(f.nw); onClose();
  };
  return(
    <Modal title="Change Password" onClose={onClose} icon="key">
      {[["cur","Current Password"],["nw","New Password"],["cf","Confirm New Password"]].map(([k,lbl_])=>(
        <div key={k} style={{marginBottom:14}}>
          <label style={lbl}>{lbl_}</label>
          <div style={{position:"relative"}}>
            <input type={showAll?"text":"password"} value={f[k]} onChange={e=>setF(x=>({...x,[k]:e.target.value}))}
              placeholder="••••••••" style={{...inp,paddingRight:40}}/>
            <button onClick={()=>setShowAll(s=>!s)} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",border:"none",background:"none",cursor:"pointer",padding:0,display:"flex"}}>
              <Icon name={showAll?"eyeOff":"eye"} size="sm" color={T.muted}/>
            </button>
          </div>
        </div>
      ))}
      {err&&<div style={{background:T.redLt,color:T.red,borderRadius:9,padding:"9px 14px",fontSize:13,fontWeight:600,marginBottom:12,display:"flex",gap:6,alignItems:"center"}}>
        <Icon name="alertTri" size="sm" color={T.red}/>{err}
      </div>}
      <button onClick={go} style={btn(T.navy)}>Update Password</button>
    </Modal>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   ACCOUNT SETTINGS (resident/admin)
═══════════════════════════════════════════════════════════════════ */
function AccountSettings({user, onUpdate, onClose}) {
  const [mobile,setMobile]=useState(user.mobile||"");
  const [notifDays,setND]=useState(user.notifDays||[7,3,1,0]);
  const [showPwModal,setShowPw]=useState(false);
  const [saved,setSaved]=useState(false);
  const toggle=(d)=>setND(n=>n.includes(d)?n.filter(x=>x!==d):[...n,d].sort((a,b)=>b-a));

  const save=()=>{onUpdate({mobile,notifDays});setSaved(true);setTimeout(()=>setSaved(false),2000);};

  if(showPwModal) return <ChangePasswordModal user={user} onSave={(pw)=>onUpdate({password:pw})} onClose={()=>setShowPw(false)}/>;

  return(
    <Modal title="Account Settings" onClose={onClose} icon="settings" wide>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
        {/* Profile */}
        <div>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20,
            padding:16,background:T.bg,borderRadius:14}}>
            <Av name={user.name} size={48} idx={0}/>
            <div>
              <div style={{fontWeight:700,color:T.navy,fontSize:15}}>{user.name}</div>
              <div style={{fontSize:12,color:T.muted,marginTop:2}}>{user.email}</div>
              <div style={{fontSize:11,background:T.blueLt,color:T.blue,borderRadius:20,padding:"2px 8px",display:"inline-block",marginTop:4,fontWeight:700,textTransform:"uppercase",letterSpacing:0.5}}>{user.role}</div>
            </div>
          </div>

          <label style={lbl}>Mobile Number (for SMS)</label>
          <div style={{position:"relative",marginBottom:16}}>
            <Icon name="smartphone" size="sm" color={T.muted} style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)"}}/>
            <input value={mobile} onChange={e=>setMobile(e.target.value)} placeholder="e.g. 09171234567" style={{...inp,paddingLeft:38}}/>
          </div>
          <button onClick={()=>setShowPw(true)} style={{...btn(T.navy,"#fff",true),width:"auto",padding:"10px 16px",display:"flex",alignItems:"center",gap:8,fontSize:13}}>
            <Icon name="key" size="sm" color={T.navy}/>Change Password
          </button>
        </div>

        {/* Notification preferences */}
        <div>
          <div style={{fontWeight:700,color:T.navy,fontSize:14,marginBottom:4}}>Bill Reminder Schedule</div>
          <div style={{fontSize:12,color:T.muted,marginBottom:14,lineHeight:1.6}}>
            Choose when to receive automatic reminders before your bill due date. Paid bills are automatically skipped.
          </div>
          {[
            {d:7,  label:"7 days before due"},
            {d:3,  label:"3 days before due"},
            {d:1,  label:"1 day before due"},
            {d:0,  label:"On the due date"},
            {d:-1, label:"Day after (overdue alert)"},
          ].map(({d,label})=>(
            <div key={d} onClick={()=>toggle(d)} style={{
              display:"flex",alignItems:"center",gap:12,padding:"11px 14px",borderRadius:11,
              marginBottom:8,cursor:"pointer",transition:"all .15s",
              background:notifDays.includes(d)?T.tealLt:T.bg,
              border:`1.5px solid ${notifDays.includes(d)?T.teal:T.border}`,
            }}>
              <div style={{width:20,height:20,borderRadius:6,border:`2px solid ${notifDays.includes(d)?T.teal:T.border}`,
                background:notifDays.includes(d)?T.teal:"#fff",flexShrink:0,
                display:"flex",alignItems:"center",justifyContent:"center"}}>
                {notifDays.includes(d)&&<Icon name="check" size={10} color="#fff" strokeWidth={3}/>}
              </div>
              <div>
                <div style={{fontWeight:600,fontSize:13,color:T.ink}}>{label}</div>
                <div style={{fontSize:11,color:T.muted}}>SMS + in-app notification</div>
              </div>
            </div>
          ))}

          <button onClick={save} style={{...btn(T.teal),marginTop:4,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            {saved?<><Icon name="check" size="sm" color="#fff"/>Saved!</>:<><Icon name="settings" size="sm" color="#fff"/>Save Preferences</>}
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   ADMIN MANAGEMENT (Super Admin only)
═══════════════════════════════════════════════════════════════════ */
function AdminManagePage({users, onAdd, onEdit, onDelete, currentUser}) {
  const [showForm,setForm]=useState(false);
  const [editTarget,setET]=useState(null);
  const [f,setF]=useState({name:"",email:"",password:"",mobile:""});
  const [err,setErr]=useState("");
  const admins=users.filter(u=>u.role==="admin"||u.role==="superadmin");

  const openAdd=()=>{setF({name:"",email:"",password:"",mobile:""});setET(null);setErr("");setForm(true);};
  const openEdit=(u)=>{setF({name:u.name,email:u.email,password:u.password,mobile:u.mobile||""});setET(u);setErr("");setForm(true);};
  const save=()=>{
    if(!f.name||!f.email||(!editTarget&&!f.password)){setErr("Fill all required fields.");return;}
    if(!editTarget&&users.find(u=>u.email.toLowerCase()===f.email.toLowerCase())){setErr("Email already in use.");return;}
    if(!editTarget) onAdd({...f,id:"adm"+Date.now(),role:"admin",notifDays:[7,3,1,0]});
    else onEdit({...editTarget,...f});
    setForm(false);
  };

  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:12}}>
        <div>
          <h2 style={{fontFamily:"'Sora',sans-serif",fontSize:20,fontWeight:700,color:T.navy,margin:0}}>Admin Management</h2>
          <div style={{fontSize:13,color:T.muted,marginTop:3}}>Super Admin only · Full access control</div>
        </div>
        <button onClick={openAdd} style={{...btn(T.navy),width:"auto",padding:"10px 18px",display:"flex",alignItems:"center",gap:8,fontSize:13}}>
          <Icon name="plus" size="sm" color="#fff"/>Add Admin
        </button>
      </div>

      {showForm&&(
        <div style={{...card,padding:24,marginBottom:20}}>
          <div style={{fontWeight:700,color:T.navy,fontSize:14,marginBottom:16}}>{editTarget?"Edit Admin":"New Admin Account"}</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
            {[["name","Full Name","text"],["email","Email","email"],
              ["password",editTarget?"New Password (leave blank to keep)":"Password","password"],
              ["mobile","Mobile Number","text"],
            ].map(([k,lb,tp])=>(
              <div key={k}>
                <label style={lbl}>{lb}</label>
                <input type={tp} value={f[k]||""} onChange={e=>setF(x=>({...x,[k]:e.target.value}))} style={inp}/>
              </div>
            ))}
          </div>
          {err&&<div style={{background:T.redLt,color:T.red,borderRadius:8,padding:"8px 12px",fontSize:13,marginBottom:12}}>{err}</div>}
          <div style={{display:"flex",gap:10}}>
            <button onClick={()=>setForm(false)} style={{...btn(T.bg,T.slate,false),flex:1,boxShadow:"none",border:`1px solid ${T.border}`}}>Cancel</button>
            <button onClick={save} style={{...btn(T.navy),flex:2,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
              <Icon name={editTarget?"check":"plus"} size="sm" color="#fff"/>{editTarget?"Save Changes":"Create Admin"}
            </button>
          </div>
        </div>
      )}

      <div style={card}>
        <div style={{padding:"14px 20px",borderBottom:`1px solid ${T.border}`,background:T.bg}}>
          <div style={{fontSize:11,fontWeight:700,color:T.muted,letterSpacing:0.5}}>ADMIN ACCOUNTS ({admins.length})</div>
        </div>
        {admins.map((u,i)=>(
          <div key={u.id} className="row-hover" style={{display:"flex",alignItems:"center",justifyContent:"space-between",
            padding:"14px 20px",borderBottom:i<admins.length-1?`1px solid ${T.border}`:"none",flexWrap:"wrap",gap:10}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <Av name={u.name} size={40} idx={i}/>
              <div>
                <div style={{fontWeight:700,fontSize:14,color:T.ink}}>{u.name}</div>
                <div style={{fontSize:12,color:T.muted}}>{u.email} · {u.mobile||"No mobile"}</div>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{
                background:u.role==="superadmin"?T.purpleLt:T.blueLt,
                color:u.role==="superadmin"?T.purple:T.blue,
                borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:700,
                display:"flex",alignItems:"center",gap:4,
              }}>
                <Icon name={u.role==="superadmin"?"shield":"settings"} size={11} color={u.role==="superadmin"?T.purple:T.blue} strokeWidth={2}/>
                {u.role==="superadmin"?"Super Admin":"Admin"}
              </span>
              {u.id!==currentUser.id&&u.role!=="superadmin"&&(
                <>
                  <button onClick={()=>openEdit(u)} style={{padding:"7px",borderRadius:8,border:`1px solid ${T.border}`,background:"#fff",cursor:"pointer",display:"flex"}}>
                    <Icon name="edit" size="sm" color={T.blue}/>
                  </button>
                  <button onClick={()=>{if(window.confirm(`Delete ${u.name}?`)) onDelete(u.id);}} style={{padding:"7px",borderRadius:8,border:`1px solid ${T.redLt}`,background:T.redLt,cursor:"pointer",display:"flex"}}>
                    <Icon name="trash" size="sm" color={T.red}/>
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Privilege matrix */}
      <div style={{...card,marginTop:16}}>
        <div style={{padding:"14px 20px",borderBottom:`1px solid ${T.border}`,background:T.bg}}>
          <div style={{fontSize:11,fontWeight:700,color:T.muted,letterSpacing:0.5}}>PRIVILEGE MATRIX</div>
        </div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <thead><tr style={{background:"#f8fafc"}}>
              {["Feature","Resident","Admin","Super Admin"].map(h=>(
                <th key={h} style={{padding:"10px 16px",textAlign:"left",fontWeight:700,color:T.muted,fontSize:11,letterSpacing:0.5,textTransform:"uppercase"}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {[
                ["View own bills","✓","✓","✓"],
                ["Pay bills","✓","✓","✓"],
                ["Change password","✓","✓","✓"],
                ["Set notification prefs","✓","✓","✓"],
                ["Issue / edit bills","—","✓","✓"],
                ["Manage residents","—","✓","✓"],
                ["Import / export data","—","✓","✓"],
                ["Send reminders","—","✓","✓"],
                ["Post announcements","—","✓","✓"],
                ["View reports","—","✓","✓"],
                ["Add / edit admins","—","—","✓"],
                ["Delete admins","—","—","✓"],
                ["Full system access","—","—","✓"],
              ].map(([f,...vals],i)=>(
                <tr key={f} style={{borderBottom:`1px solid ${T.border}`,background:i%2===0?"#fff":"#fafbfd"}}>
                  <td style={{padding:"10px 16px",fontWeight:600,color:T.ink}}>{f}</td>
                  {vals.map((v,j)=>(
                    <td key={j} style={{padding:"10px 16px"}}>
                      {v==="✓"?<Icon name="check" size="sm" color={T.green} strokeWidth={2.5}/>:<span style={{color:T.border,fontWeight:700}}>—</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   PAY MODAL
═══════════════════════════════════════════════════════════════════ */
function PayModal({bill, resident, onPay, onClose}) {
  const [step,setStep]=useState(1);
  const [method,setMethod]=useState("gcash");
  const [customRef,setCustomRef]=useState("");
  const autoRef=useRef(genRef("gcash"));
  const changeM=m=>{setMethod(m);autoRef.current=genRef(m);};
  const finalRef=()=>customRef.trim()||autoRef.current;
  const confirm=()=>{onPay(bill.id,finalRef(),method);setStep(3);};
  const METHS=[
    {id:"gcash",label:"GCash",icon:"smartphone",color:"#0070FF"},
    {id:"paymaya",label:"PayMaya",icon:"credit",color:"#7B2FF7"},
    {id:"bank",label:"Bank Transfer",icon:"building",color:T.navy},
    {id:"cash",label:"Cash On-site",icon:"package",color:T.green},
  ];
  return(
    <Modal title={step===3?"Payment Confirmed":"Pay Bill"} onClose={onClose} icon={step===3?"check":"credit"}>
      <div style={{background:T.bg,borderRadius:14,padding:"14px 18px",marginBottom:20,border:`1px solid ${T.border}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><div style={{fontWeight:700,color:T.ink,fontSize:15}}>{resident.name}</div><div style={{fontSize:12,color:T.muted}}>{resident.unit} · {bill.month}</div></div>
          <div style={{textAlign:"right"}}><div style={{fontWeight:800,fontSize:22,color:T.navy,fontFamily:"'Sora',sans-serif"}}>{fmt(bill.amount)}</div></div>
        </div>
      </div>
      {step===1&&(<>
        <label style={lbl}>Payment Method</label>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:18}}>
          {METHS.map(m=>(
            <button key={m.id} onClick={()=>changeM(m.id)} style={{
              padding:"14px",borderRadius:14,border:`2px solid ${method===m.id?m.color:T.border}`,
              background:method===m.id?`${m.color}0F`:"#fff",cursor:"pointer",textAlign:"left",transition:"all .15s",
            }}>
              <Icon name={m.icon} size="md" color={method===m.id?m.color:T.muted} style={{marginBottom:6}}/>
              <div style={{fontWeight:700,fontSize:13,color:method===m.id?m.color:T.ink}}>{m.label}</div>
            </button>
          ))}
        </div>
        <label style={lbl}>Reference No. (auto-generated if blank)</label>
        <input value={customRef} onChange={e=>setCustomRef(e.target.value)} placeholder={autoRef.current} style={{...inp,marginBottom:18}}/>
        <button onClick={()=>setStep(2)} style={{...btn(T.navy),display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
          Review Payment <Icon name="chevRight" size="sm" color="#fff"/>
        </button>
      </>)}
      {step===2&&(<>
        <div style={{background:T.greenLt,borderRadius:14,padding:18,marginBottom:18,border:`1px solid ${T.green}33`}}>
          {[["Resident",`${resident.name} · ${resident.unit}`],["Bill",`${bill.type==="water"?"💧 Water":"🏘️ Dues"} — ${bill.month}`],
            ["Amount",fmt(bill.amount)],["Method",method.toUpperCase()],["Reference",finalRef()],["Date",today()]
          ].map(([k,v])=>(
            <div key={k} style={{display:"flex",justifyContent:"space-between",marginBottom:8,fontSize:14}}>
              <span style={{color:T.muted}}>{k}</span><span style={{fontWeight:700,color:T.ink}}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={()=>setStep(1)} style={{...btn(T.bg,T.slate,false),flex:1,boxShadow:"none",border:`1px solid ${T.border}`}}>← Back</button>
          <button onClick={confirm} style={{...btn(T.green),flex:2,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            <Icon name="check" size="sm" color="#fff"/>Confirm Payment
          </button>
        </div>
      </>)}
      {step===3&&(
        <div style={{textAlign:"center",padding:"8px 0"}}>
          <div style={{width:64,height:64,borderRadius:"50%",background:T.greenLt,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}>
            <Icon name="check" size="xl" color={T.green} strokeWidth={2}/>
          </div>
          <div style={{fontWeight:800,fontSize:17,color:T.green,marginBottom:8}}>Payment Recorded!</div>
          <div style={{color:T.muted,fontSize:14,lineHeight:1.7}}>{resident.name}<br/><strong style={{color:T.ink}}>{fmt(bill.amount)}</strong> via <strong>{method.toUpperCase()}</strong></div>
          <button onClick={onClose} style={{...btn(T.navy),marginTop:18}}>Done</button>
        </div>
      )}
    </Modal>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   RECEIPT MODAL
═══════════════════════════════════════════════════════════════════ */
function ReceiptModal({bill, resident, onClose}) {
  const print=()=>{
    const w=window.open("","_blank","width=380,height=640");
    w.document.write(`<html><head><title>Receipt</title><style>
      body{font-family:'Courier New',monospace;padding:24px;font-size:13px;color:#111}
      h2{text-align:center;font-size:16px;margin:0 0 2px}
      .sub{text-align:center;color:#666;font-size:10px;margin-bottom:16px}
      .row{display:flex;justify-content:space-between;margin:5px 0}
      .line{border:none;border-top:1px dashed #999;margin:12px 0}
      .big{text-align:center;font-size:24px;font-weight:bold;margin:10px 0}
      .paid{text-align:center;background:#d1fae5;color:#065f46;padding:4px 12px;border-radius:4px;font-size:11px;font-weight:bold;display:inline-block}
      .foot{text-align:center;font-size:10px;color:#888;margin-top:16px}
    </style></head><body>
      <h2>CMS HOA GO APP</h2>
      <div class="sub">Official Payment Receipt</div>
      <hr class="line"/>
      ${[["Date",bill.paidDate||today()],["Resident",resident.name],["Unit",resident.unit],
        ["Bill Type",bill.type==="water"?"Water Bill":"Monthly Dues"],["Period",bill.month],
        ["Method",(bill.method||"").toUpperCase()],["Reference",bill.ref||"—"],["Paid On",bill.paidDate||today()]
      ].map(([k,v])=>`<div class="row"><span>${k}:</span><span><b>${v}</b></span></div>`).join("")}
      <hr class="line"/>
      <div class="big">₱${Number(bill.amount).toLocaleString("en-PH",{minimumFractionDigits:2})}</div>
      <div style="text-align:center"><span class="paid">PAID IN FULL</span></div>
      <hr class="line"/>
      <div class="foot">CMS HOA GO APP · Villa Verde HOA<br/>Thank you for your payment!</div>
    </body></html>`);
    w.document.close(); w.print();
  };
  return(
    <Modal title="Payment Receipt" onClose={onClose} icon="printer">
      <div style={{background:"#fafafa",border:`1.5px dashed ${T.border}`,borderRadius:14,padding:"22px",fontFamily:"'Courier New',monospace",fontSize:13,marginBottom:16}}>
        <div style={{textAlign:"center",marginBottom:14}}>
          <div style={{fontWeight:800,fontSize:15,color:T.navy}}>CMS HOA GO APP</div>
          <div style={{color:T.muted,fontSize:10,marginTop:2}}>Official Payment Receipt</div>
        </div>
        <div style={{borderTop:`1px dashed ${T.border}`,borderBottom:`1px dashed ${T.border}`,padding:"12px 0",margin:"10px 0"}}>
          {[["Resident",resident.name],["Unit",resident.unit],["Type",bill.type==="water"?"Water Bill":"Monthly Dues"],
            ["Period",bill.month],["Method",(bill.method||"").toUpperCase()],["Ref",bill.ref||"—"],["Paid",bill.paidDate||today()]
          ].map(([k,v])=>(
            <div key={k} style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
              <span style={{color:T.muted}}>{k}:</span><span style={{fontWeight:700}}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{textAlign:"center",fontSize:22,fontWeight:800,color:T.navy,margin:"12px 0"}}>{fmt(bill.amount)}</div>
        <div style={{textAlign:"center"}}><span style={{background:T.greenLt,color:T.green,borderRadius:6,padding:"3px 12px",fontSize:11,fontWeight:800}}>PAID IN FULL</span></div>
      </div>
      <button onClick={print} style={{...btn(T.navy),display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
        <Icon name="printer" size="sm" color="#fff"/>Print Receipt
      </button>
    </Modal>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   IMPORT/EXPORT RESIDENTS
═══════════════════════════════════════════════════════════════════ */
function ImportExportModal({residents, onImport, onClose}) {
  const [tab,setTab]=useState("export");
  const [importText,setIT]=useState("");
  const [err,setErr]=useState("");
  const [success,setSuccess]=useState("");

  const doExport=()=>{
    const header=["id","name","unit","email","phone","joinDate"];
    const rows=[header.join(","),...residents.map(r=>header.map(k=>`"${r[k]||""}"`).join(","))];
    const blob=new Blob([rows.join("\n")],{type:"text/csv"});
    const url=URL.createObjectURL(blob); const a=document.createElement("a");
    a.href=url; a.download=`cms_hoa_residents_${today()}.csv`; a.click();
    URL.revokeObjectURL(url);
    setSuccess("Residents exported successfully!");
  };

  const doImport=()=>{
    setErr(""); setSuccess("");
    try {
      const lines=importText.trim().split("\n").filter(l=>l.trim());
      if(lines.length<2){setErr("No data rows found. Include a header row.");return;}
      const keys=lines[0].split(",").map(k=>k.replace(/"/g,"").trim());
      const required=["name","unit","email","phone"];
      if(!required.every(k=>keys.includes(k))){setErr(`Missing columns: ${required.filter(k=>!keys.includes(k)).join(", ")}`);return;}
      const newRows=lines.slice(1).map(l=>{
        const vals=l.split(",").map(v=>v.replace(/"/g,"").trim());
        const obj={}; keys.forEach((k,i)=>obj[k]=vals[i]||"");
        return {...obj,id:obj.id?Number(obj.id):Date.now()+Math.random(),joinDate:obj.joinDate||today()};
      });
      onImport(newRows); setSuccess(`${newRows.length} residents imported!`); setIT("");
    } catch(e){ setErr("Invalid CSV format. Check your data."); }
  };

  const template="name,unit,email,phone,joinDate\n\"Sample Resident\",\"Block 5 Lot 1\",\"sample@email.com\",\"09111234567\",\"2026-01-15\"";

  return(
    <Modal title="Import / Export Residents" onClose={onClose} wide icon="package">
      <div style={{display:"flex",gap:4,marginBottom:20,background:T.bg,borderRadius:12,padding:4}}>
        {["export","import"].map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{flex:1,padding:"9px",borderRadius:9,border:"none",
            background:tab===t?T.surface:"transparent",cursor:"pointer",
            fontWeight:700,fontSize:13,color:tab===t?T.navy:T.muted,
            boxShadow:tab===t?T.shadow:"none",transition:"all .2s",textTransform:"capitalize"}}>
            {t==="export"?"Export Residents":"Import Residents"}
          </button>
        ))}
      </div>

      {tab==="export"&&(
        <div>
          <div style={{background:T.bg,borderRadius:12,padding:16,marginBottom:16}}>
            <div style={{fontWeight:600,color:T.ink,fontSize:14,marginBottom:6}}>{residents.length} residents will be exported</div>
            <div style={{fontSize:12,color:T.muted}}>Downloads as CSV with columns: name, unit, email, phone, joinDate</div>
          </div>
          <div style={{border:`1px solid ${T.border}`,borderRadius:10,overflow:"hidden",marginBottom:16,maxHeight:180,overflowY:"auto"}}>
            {residents.slice(0,5).map((r,i)=>(
              <div key={r.id} style={{display:"flex",gap:12,padding:"10px 14px",borderBottom:i<4?`1px solid ${T.border}`:"none",alignItems:"center"}}>
                <Av name={r.name} size={28} idx={i}/>
                <div><div style={{fontWeight:600,fontSize:13,color:T.ink}}>{r.name}</div><div style={{fontSize:11,color:T.muted}}>{r.unit}</div></div>
              </div>
            ))}
            {residents.length>5&&<div style={{padding:"10px 14px",color:T.muted,fontSize:12,fontStyle:"italic"}}>...and {residents.length-5} more</div>}
          </div>
          <button onClick={doExport} style={{...btn(T.navy),display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            <Icon name="download" size="sm" color="#fff"/>Download CSV
          </button>
        </div>
      )}

      {tab==="import"&&(
        <div>
          <div style={{background:T.bg,borderRadius:12,padding:14,marginBottom:14}}>
            <div style={{fontWeight:700,color:T.ink,fontSize:13,marginBottom:6}}>CSV Format</div>
            <pre style={{fontSize:11,color:T.muted,fontFamily:"monospace",margin:0,whiteSpace:"pre-wrap"}}>{template}</pre>
            <button onClick={()=>{const b=new Blob([template],{type:"text/csv"});const u=URL.createObjectURL(b);const a=document.createElement("a");a.href=u;a.download="cms_hoa_template.csv";a.click();}} style={{...btn(T.teal,"#fff",true),width:"auto",padding:"7px 14px",fontSize:12,marginTop:10,display:"inline-flex",alignItems:"center",gap:6}}>
              <Icon name="download" size={12} color={T.teal}/>Download Template
            </button>
          </div>
          <label style={lbl}>Paste CSV Data</label>
          <textarea value={importText} onChange={e=>setIT(e.target.value)} rows={6}
            placeholder="Paste your CSV content here..." style={{...inp,resize:"vertical",marginBottom:12,fontFamily:"monospace",fontSize:12}}/>
          {err&&<div style={{background:T.redLt,color:T.red,borderRadius:8,padding:"9px 12px",fontSize:13,marginBottom:10,display:"flex",gap:6}}><Icon name="x" size="sm" color={T.red}/>{err}</div>}
          {success&&<div style={{background:T.greenLt,color:T.green,borderRadius:8,padding:"9px 12px",fontSize:13,marginBottom:10,display:"flex",gap:6}}><Icon name="check" size="sm" color={T.green}/>{success}</div>}
          <button onClick={doImport} style={{...btn(T.teal),display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            <Icon name="upload" size="sm" color="#fff"/>Import Residents
          </button>
        </div>
      )}
    </Modal>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   AUTO REMINDER PANEL
═══════════════════════════════════════════════════════════════════ */
function ReminderPanel({bills, users, smsLog, onSendReminders}) {
  const reminders = computeReminders(bills, users);
  const [sent,setSent]=useState(false);
  const [sending,setSending]=useState(false);

  const doSend=()=>{
    setSending(true);
    setTimeout(()=>{
      onSendReminders(reminders.map(r=>({...r,time:new Date().toLocaleTimeString("en-PH",{hour:"2-digit",minute:"2-digit"})})));
      setSending(false); setSent(true);
    },1500);
  };

  const groupByDays=()=>{
    const g={};
    reminders.forEach(r=>{
      const k=r.daysUntil===0?"Due Today":r.daysUntil<0?"Overdue":`${r.daysUntil} days left`;
      if(!g[k]) g[k]=[];
      g[k].push(r);
    });
    return g;
  };
  const groups=groupByDays();

  return(
    <div style={{...card,padding:24}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
        <div>
          <div style={{fontFamily:"'Sora',sans-serif",fontWeight:700,fontSize:16,color:T.navy}}>Auto Reminder Engine</div>
          <div style={{fontSize:12,color:T.muted,marginTop:3}}>Smart scheduling · Paid bills auto-skipped · Based on each resident's notification preferences</div>
        </div>
        <span style={{background:T.blueLt,color:T.blue,borderRadius:20,padding:"4px 12px",fontSize:12,fontWeight:700,whiteSpace:"nowrap"}}>{reminders.length} queued</span>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10,marginBottom:20}}>
        {[
          {label:"Due Today",count:reminders.filter(r=>r.daysUntil===0).length,c:T.amber},
          {label:"Overdue",count:reminders.filter(r=>r.daysUntil<0).length,c:T.red},
          {label:"Upcoming (1–3d)",count:reminders.filter(r=>r.daysUntil>=1&&r.daysUntil<=3).length,c:T.blue},
          {label:"Advanced (4–7d)",count:reminders.filter(r=>r.daysUntil>=4).length,c:T.teal},
        ].map((s,i)=>(
          <div key={i} style={{background:T.bg,borderRadius:12,padding:"12px 14px",borderLeft:`3px solid ${s.c}`}}>
            <div style={{fontWeight:800,fontSize:20,color:s.c,fontFamily:"'Sora',sans-serif"}}>{s.count}</div>
            <div style={{fontSize:11,color:T.muted,fontWeight:600,marginTop:2}}>{s.label}</div>
          </div>
        ))}
      </div>

      {Object.entries(groups).map(([label,items])=>(
        <div key={label} style={{marginBottom:16}}>
          <div style={{fontSize:11,fontWeight:700,color:T.muted,letterSpacing:0.5,textTransform:"uppercase",marginBottom:8}}>{label} ({items.length})</div>
          <div style={{border:`1px solid ${T.border}`,borderRadius:12,overflow:"hidden"}}>
            {items.map((r,i)=>(
              <div key={r.billId} style={{padding:"11px 14px",borderBottom:i<items.length-1?`1px solid ${T.border}`:"none",background:"#fff"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
                  <div style={{fontSize:13,fontWeight:600,color:T.ink}}>{r.name} <span style={{color:T.muted,fontWeight:400}}>· {r.type==="water"?"Water":"Dues"}</span></div>
                  <span style={{fontWeight:700,fontSize:13,color:T.navy,whiteSpace:"nowrap"}}>{fmt(r.amount)}</span>
                </div>
                <div style={{fontSize:11,color:T.muted,marginTop:4,lineHeight:1.5}}>{r.message}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
      {reminders.length===0&&(
        <div style={{textAlign:"center",padding:"32px 0",color:T.muted}}>
          <Icon name="check" size="xl" color={T.green} style={{display:"block",margin:"0 auto 8px"}}/>
          <div style={{fontWeight:700,color:T.green}}>All bills paid or no reminders scheduled!</div>
        </div>
      )}

      {!sent?(
        <button onClick={doSend} disabled={sending||reminders.length===0}
          style={{...btn(T.blue),marginTop:16,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
          {sending?<span style={{width:14,height:14,border:"2px solid rgba(255,255,255,.3)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin .7s linear infinite"}}/>:<Icon name="send" size="sm" color="#fff"/>}
          {sending?"Sending…":`Send ${reminders.length} Reminders`}
        </button>
      ):(
        <div style={{marginTop:16,background:T.greenLt,borderRadius:10,padding:"12px 16px",display:"flex",alignItems:"center",gap:8}}>
          <Icon name="check" size="sm" color={T.green} strokeWidth={2.5}/>
          <span style={{fontWeight:700,color:T.green,fontSize:13}}>Reminders sent! Check SMS Log →</span>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SMS LOG PANEL
═══════════════════════════════════════════════════════════════════ */
function SmsLogFab({log}) {
  const [open,setOpen]=useState(false);
  return(
    <>
      <button onClick={()=>setOpen(true)} style={{
        position:"fixed",bottom:24,right:24,zIndex:500,
        background:T.navy,color:"#fff",border:"none",borderRadius:16,
        padding:"13px 20px",fontWeight:700,fontSize:13,cursor:"pointer",
        boxShadow:"0 8px 28px rgba(10,22,40,.4)",display:"flex",alignItems:"center",gap:8,
      }}>
        <Icon name="smartphone" size="sm" color="#fff"/>
        SMS Log
        {log.length>0&&<span style={{background:T.teal,borderRadius:20,padding:"1px 8px",fontSize:11}}>{log.length}</span>}
      </button>
      {open&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:9998,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={()=>setOpen(false)}>
          <div style={{background:"#0F1923",borderRadius:24,padding:24,width:"100%",maxWidth:440,maxHeight:"80vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <Icon name="smartphone" size="md" color={T.teal}/>
                <span style={{fontFamily:"'Sora',sans-serif",color:"#fff",fontWeight:700,fontSize:15}}>SMS Notification Log</span>
              </div>
              <button onClick={()=>setOpen(false)} style={{border:"none",background:"rgba(255,255,255,.1)",color:"#fff",borderRadius:"50%",width:28,height:28,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <Icon name="x" size="sm" color="#fff"/>
              </button>
            </div>
            {log.length===0&&<div style={{textAlign:"center",color:"rgba(255,255,255,.3)",padding:"32px 0",fontSize:13}}>No messages sent yet.</div>}
            {[...log].reverse().map((n,i)=>(
              <div key={i} style={{background:"rgba(255,255,255,.05)",borderRadius:14,padding:14,marginBottom:10,border:"1px solid rgba(255,255,255,.08)"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                  <span style={{color:T.teal,fontSize:12,fontWeight:700,display:"flex",alignItems:"center",gap:4}}>
                    <Icon name="phone" size={11} color={T.teal}/>{n.mobile||n.phone||"—"}
                  </span>
                  <span style={{color:"rgba(255,255,255,.3)",fontSize:11}}>{n.time}</span>
                </div>
                <div style={{color:"rgba(255,255,255,.8)",fontSize:12,lineHeight:1.6}}>{n.message}</div>
                <div style={{marginTop:8,display:"flex",gap:6}}>
                  <span style={{background:"#22c55e22",color:"#22c55e",borderRadius:20,padding:"2px 8px",fontSize:10,fontWeight:700,display:"flex",alignItems:"center",gap:3}}>
                    <Icon name="check" size={9} color="#22c55e" strokeWidth={2.5}/>DELIVERED
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   DASHBOARD
═══════════════════════════════════════════════════════════════════ */
function Dashboard({user, residents, bills, announcements, setView, openModal, onPay, users, smsLog, onSendReminders}) {
  const isAdminOrSA=user.role==="admin"||user.role==="superadmin";
  const myBills=isAdminOrSA?bills:bills.filter(b=>b.residentId===user.residentId);
  const coll=myBills.filter(b=>b.status==="paid").reduce((s,b)=>s+b.amount,0);
  const pend=myBills.filter(b=>b.status!=="paid").reduce((s,b)=>s+b.amount,0);
  const od=myBills.filter(b=>b.status==="overdue").length;
  const [payBill,setPB]=useState(null);
  const [recBill,setRB]=useState(null);

  const mData=(()=>{const m={};bills.filter(b=>b.status==="paid"&&b.paidDate).forEach(b=>{const k=b.paidDate.slice(0,7);m[k]=(m[k]||0)+b.amount;});return Object.entries(m).sort((a,b)=>a[0]>b[0]?1:-1).slice(-5);})();
  const maxV=Math.max(...mData.map(([,v])=>v),1);

  if(payBill) return <PayModal bill={payBill} resident={residents.find(r=>r.id===payBill.residentId)} onPay={(id,ref,m)=>{onPay(id,ref,m);setPB(null);}} onClose={()=>setPB(null)}/>;
  if(recBill) return <ReceiptModal bill={recBill} resident={residents.find(r=>r.id===recBill.residentId)} onClose={()=>setRB(null)}/>;

  const STATS=isAdminOrSA?[
    {icon:"percent",label:"Collected",val:fmt(coll),sub:`${bills.filter(b=>b.status==="paid").length} payments`,c:T.green},
    {icon:"clock",label:"Pending",val:fmt(pend),sub:`${bills.filter(b=>b.status!=="paid").length} bills`,c:T.amber},
    {icon:"alertTri",label:"Overdue",val:od,sub:"Needs action",c:T.red},
    {icon:"users",label:"Residents",val:residents.length,sub:"Active",c:T.teal},
  ]:[
    {icon:"receipt",label:"My Bills",val:myBills.length,sub:"Total",c:T.teal},
    {icon:"check",label:"Paid",val:myBills.filter(b=>b.status==="paid").length,sub:fmt(coll),c:T.green},
    {icon:"clock",label:"Balance Due",val:fmt(pend),sub:`${myBills.filter(b=>b.status!=="paid").length} unpaid`,c:T.amber},
    {icon:"alertTri",label:"Overdue",val:od,sub:od>0?"Pay now!":"All clear",c:od>0?T.red:T.green},
  ];

  return (
    <div>
      {/* Welcome */}
      <div style={{background:T.grad,borderRadius:20,padding:"22px 26px",marginBottom:22,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",right:-20,top:-20,width:180,height:180,borderRadius:"50%",background:"rgba(255,255,255,.04)"}}/>
        <div style={{position:"absolute",right:60,bottom:-40,width:120,height:120,borderRadius:"50%",background:"rgba(14,154,167,.12)"}}/>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12,position:"relative"}}>
          <div>
            <div style={{color:"rgba(255,255,255,.5)",fontSize:12,marginBottom:4,letterSpacing:0.5}}>Welcome back,</div>
            <div style={{fontFamily:"'Sora',sans-serif",color:"#fff",fontSize:22,fontWeight:700}}>{user.name}</div>
            <div style={{color:"rgba(255,255,255,.45)",fontSize:12,marginTop:4,display:"flex",alignItems:"center",gap:5}}>
              <Icon name={user.role==="superadmin"?"shield":user.role==="admin"?"settings":"home"} size={12} color="rgba(255,255,255,.45)"/>
              {user.role==="superadmin"?"Super Administrator":user.role==="admin"?"HOA Administrator":"Resident · "+user.unit}
            </div>
          </div>
          {!isAdminOrSA&&od>0&&(
            <div style={{background:"rgba(192,57,43,.8)",borderRadius:14,padding:"12px 18px",backdropFilter:"blur(4px)",display:"flex",alignItems:"center",gap:8}}>
              <Icon name="alertTri" size="md" color="#fff"/>
              <div><div style={{color:"#fff",fontWeight:800,fontSize:16}}>{od} OVERDUE</div><div style={{color:"rgba(255,255,255,.7)",fontSize:11}}>Pay immediately</div></div>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(175px,1fr))",gap:14,marginBottom:22}}>
        {STATS.map((s,i)=>(
          <div key={i} className="card-hover" style={{...card,padding:"18px 20px",borderLeft:`3px solid ${s.c}`,animation:`fadeUp .3s ease ${i*60}ms both`}}>
            <div style={{width:36,height:36,borderRadius:10,background:`${s.c}15`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:12}}>
              <Icon name={s.icon} size="md" color={s.c} strokeWidth={1.8}/>
            </div>
            <div style={{fontSize:22,fontWeight:800,color:T.navy,fontFamily:"'Sora',sans-serif"}}>{s.val}</div>
            <div style={{fontSize:12,color:T.muted,marginTop:2}}>{s.label}</div>
            <div style={{fontSize:11,color:s.c,fontWeight:700,marginTop:6}}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Admin actions */}
      {isAdminOrSA&&(
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:10,marginBottom:22}}>
          {[
            {l:"Issue Bill",a:"issueBill",i:"receipt",c:T.navy},
            {l:"Bulk Bills",a:"bulkBill",i:"grid",c:T.purple},
            {l:"Send Reminders",a:"notify",i:"send",c:T.blue},
            {l:"Announce",a:"announce",i:"bell",c:T.teal},
          ].map(x=>(
            <button key={x.a} onClick={()=>openModal(x.a)} style={{
              padding:"13px 12px",borderRadius:12,border:`1px solid ${T.border}`,
              background:T.surface,cursor:"pointer",boxShadow:T.shadow3d,
              display:"flex",flexDirection:"column",alignItems:"center",gap:8,transition:"all .2s",
            }}>
              <div style={{width:36,height:36,borderRadius:10,background:`${x.c}12`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <Icon name={x.i} size="md" color={x.c} strokeWidth={1.8}/>
              </div>
              <span style={{fontSize:12,fontWeight:700,color:T.ink}}>{x.l}</span>
            </button>
          ))}
        </div>
      )}

      <div style={{display:"grid",gridTemplateColumns:isAdminOrSA?"2fr 1.2fr":"1fr",gap:16,marginBottom:22}}>
        {/* Recent bills */}
        <div style={card}>
          <div style={{padding:"14px 20px 12px",borderBottom:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <Icon name="receipt" size="sm" color={T.navy} strokeWidth={1.8}/>
              <span style={{fontWeight:700,color:T.navy,fontSize:14,fontFamily:"'Sora',sans-serif"}}>Recent Bills</span>
            </div>
            <button onClick={()=>setView("bills")} style={{fontSize:12,color:T.teal,background:"none",border:"none",cursor:"pointer",fontWeight:700,display:"flex",alignItems:"center",gap:4}}>
              View all <Icon name="chevRight" size={12} color={T.teal}/>
            </button>
          </div>
          {myBills.slice(0,6).map((b,i)=>{
            const res=residents.find(r=>r.id===b.residentId);
            return(
              <div key={b.id} className="row-hover" style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"11px 20px",borderBottom:`1px solid ${T.border}`,flexWrap:"wrap",gap:8,background:T.surface}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <Av name={res?.name||"?"} size={34} idx={i}/>
                  <div><div style={{fontWeight:600,fontSize:13,color:T.ink}}>{res?.name}</div><div style={{fontSize:11,color:T.muted}}>{b.type==="water"?"💧":"🏘️"} {b.month}</div></div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:7}}>
                  <span style={{fontWeight:800,color:T.navy,fontSize:14}}>{fmt(b.amount)}</span>
                  <Badge status={b.status}/>
                  {b.status==="paid"&&<button onClick={()=>setRB(b)} style={{padding:"5px",borderRadius:7,border:`1px solid ${T.border}`,background:"#fff",cursor:"pointer",display:"flex"}}><Icon name="printer" size="sm" color={T.muted}/></button>}
                  {b.status!=="paid"&&<button onClick={()=>setPB(b)} style={{padding:"5px 12px",borderRadius:7,border:"none",background:T.green,color:"#fff",fontSize:11,cursor:"pointer",fontWeight:700,display:"flex",alignItems:"center",gap:4}}><Icon name="credit" size={11} color="#fff"/>Pay</button>}
                </div>
              </div>
            );
          })}
          {myBills.length===0&&<div style={{padding:32,textAlign:"center",color:T.muted,fontSize:14}}>No bills yet.</div>}
        </div>

        {/* Chart or announcements */}
        {isAdminOrSA?(
          <div style={{...card,padding:"18px 20px"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
              <Icon name="chart" size="sm" color={T.navy} strokeWidth={1.8}/>
              <span style={{fontWeight:700,color:T.navy,fontSize:14,fontFamily:"'Sora',sans-serif"}}>Collections</span>
            </div>
            <div style={{display:"flex",alignItems:"flex-end",gap:8,height:120,marginBottom:8}}>
              {mData.map(([m,v])=>(
                <div key={m} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                  <div style={{width:"100%",height:`${(v/maxV)*110}px`,background:`linear-gradient(180deg,${T.teal},${T.navy})`,
                    borderRadius:"5px 5px 0 0",minHeight:3,transition:"height .5s",boxShadow:"0 2px 8px rgba(11,138,138,.3)"}}/>
                  <div style={{fontSize:9,color:T.muted,fontWeight:600}}>{m.slice(5)}</div>
                </div>
              ))}
            </div>
            <div style={{paddingTop:12,borderTop:`1px solid ${T.border}`}}>
              {[[T.blue,"Water"],[T.teal,"Dues"]].map(([c,l])=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                  <div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:8,height:8,borderRadius:2,background:c}}/><span style={{fontSize:12,color:T.muted}}>{l}</span></div>
                  <span style={{fontWeight:700,color:T.navy,fontSize:12}}>{fmt(bills.filter(b=>b.status==="paid"&&b.type===(l==="Water"?"water":"dues")).reduce((s,b)=>s+b.amount,0))}</span>
                </div>
              ))}
            </div>
          </div>
        ):(
          <div style={card}>
            <div style={{padding:"14px 20px 12px",borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",gap:8}}>
              <Icon name="bell" size="sm" color={T.navy} strokeWidth={1.8}/>
              <span style={{fontWeight:700,color:T.navy,fontSize:14,fontFamily:"'Sora',sans-serif"}}>Announcements</span>
            </div>
            {announcements.slice(0,3).map((a,i)=>{
              const TS={info:{bg:T.blueLt,c:T.blue,ic:"info"},alert:{bg:T.amberLt,c:T.amber,ic:"alertTri"},event:{bg:T.greenLt,c:T.green,ic:"calendar"}};
              const s=TS[a.type]||TS.info;
              return(
                <div key={a.id} style={{padding:"12px 20px",borderBottom:i<2?`1px solid ${T.border}`:"none"}}>
                  <div style={{display:"flex",gap:6,marginBottom:4}}>
                    <span style={{background:s.bg,color:s.c,borderRadius:20,padding:"2px 8px 2px 6px",fontSize:10,fontWeight:700,display:"inline-flex",alignItems:"center",gap:3}}>
                      <Icon name={s.ic} size={10} color={s.c} strokeWidth={2}/>{a.type}
                    </span>
                    <span style={{fontSize:11,color:T.muted}}>{a.date}</span>
                  </div>
                  <div style={{fontWeight:700,color:T.ink,fontSize:13}}>{a.title}</div>
                  <div style={{fontSize:12,color:T.muted,marginTop:3,lineHeight:1.5}}>{a.body}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Auto-reminder engine (admin/SA) */}
      {isAdminOrSA&&<ReminderPanel bills={bills} users={users} smsLog={smsLog} onSendReminders={onSendReminders}/>}

      {/* Announcements below (admin/SA) */}
      {isAdminOrSA&&(
        <div style={{...card,marginTop:16}}>
          <div style={{padding:"14px 20px 12px",borderBottom:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <Icon name="bell" size="sm" color={T.navy} strokeWidth={1.8}/>
              <span style={{fontWeight:700,color:T.navy,fontSize:14,fontFamily:"'Sora',sans-serif"}}>Announcements</span>
            </div>
            <button onClick={()=>openModal("announce")} style={{fontSize:12,color:T.teal,background:"none",border:"none",cursor:"pointer",fontWeight:700,display:"flex",alignItems:"center",gap:4}}>
              <Icon name="plus" size="sm" color={T.teal}/>New
            </button>
          </div>
          {announcements.slice(0,3).map((a,i)=>{
            const TS={info:{bg:T.blueLt,c:T.blue,ic:"info"},alert:{bg:T.amberLt,c:T.amber,ic:"alertTri"},event:{bg:T.greenLt,c:T.green,ic:"calendar"}};
            const s=TS[a.type]||TS.info;
            return(
              <div key={a.id} style={{padding:"12px 20px",borderBottom:i<2?`1px solid ${T.border}`:"none"}}>
                <div style={{display:"flex",gap:6,marginBottom:4}}>
                  <span style={{background:s.bg,color:s.c,borderRadius:20,padding:"2px 8px 2px 6px",fontSize:10,fontWeight:700,display:"inline-flex",alignItems:"center",gap:3}}>
                    <Icon name={s.ic} size={10} color={s.c} strokeWidth={2}/>{a.type}
                  </span>
                  <span style={{fontSize:11,color:T.muted}}>{a.date}</span>
                </div>
                <div style={{fontWeight:700,color:T.ink,fontSize:14}}>{a.title}</div>
                <div style={{fontSize:13,color:T.muted,marginTop:3,lineHeight:1.5}}>{a.body}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   BILLS PAGE
═══════════════════════════════════════════════════════════════════ */
function BillsPage({user, residents, bills, onPay, onAdd, onBulkAdd}) {
  const isAdminOrSA=user.role==="admin"||user.role==="superadmin";
  const [fS,setFS]=useState("all"); const [fT,setFT]=useState("all");
  const [search,setSrch]=useState(""); const [sort,setSort]=useState("date");
  const [payBill,setPB]=useState(null); const [recBill,setRB]=useState(null);
  const [showIssue,setIssue]=useState(false); const [showBulk,setBulk]=useState(false);

  const base=isAdminOrSA?bills:bills.filter(b=>b.residentId===user.residentId);
  const vis=base.filter(b=>{
    if(fS!=="all"&&b.status!==fS) return false;
    if(fT!=="all"&&b.type!==fT) return false;
    if(search){const r=residents.find(x=>x.id===b.residentId);if(!r?.name.toLowerCase().includes(search.toLowerCase())&&!b.month.toLowerCase().includes(search.toLowerCase()))return false;}
    return true;
  }).sort((a,b2)=>sort==="amount"?b2.amount-a.amount:sort==="status"?({overdue:0,unpaid:1,paid:2})[a.status]-({overdue:0,unpaid:1,paid:2})[b2.status]:b2.issuedDate>a.issuedDate?1:-1);

  const exportBills=()=>{
    const h=["ID","Resident","Unit","Type","Amount","Month","Due","Status","Paid On","Method","Ref"];
    const rows=[h,...vis.map(b=>{const r=residents.find(x=>x.id===b.residentId);return[b.id,r?.name,r?.unit,b.type,b.amount,b.month,b.dueDate,b.status,b.paidDate||"",b.method||"",b.ref||""];})];
    const csv=rows.map(r=>r.map(v=>`"${v||""}"`).join(",")).join("\n");
    const blob=new Blob([csv],{type:"text/csv"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`cms_hoa_bills_${today()}.csv`;a.click();URL.revokeObjectURL(url);
  };

  if(payBill) return <PayModal bill={payBill} resident={residents.find(r=>r.id===payBill.residentId)} onPay={(id,ref,m)=>{onPay(id,ref,m);setPB(null);}} onClose={()=>setPB(null)}/>;
  if(recBill) return <ReceiptModal bill={recBill} resident={residents.find(r=>r.id===recBill.residentId)} onClose={()=>setRB(null)}/>;

  return (
    <div>
      {showIssue&&<IssueBillModal residents={residents} onAdd={onAdd} onClose={()=>setIssue(false)}/>}
      {showBulk&&<BulkBillModal residents={residents} onBulkAdd={onBulkAdd} onClose={()=>setBulk(false)}/>}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:12}}>
        <h2 style={{fontFamily:"'Sora',sans-serif",fontSize:20,fontWeight:700,color:T.navy,margin:0}}>{isAdminOrSA?"All Bills":"My Bills"}</h2>
        {isAdminOrSA&&<div style={{display:"flex",gap:8}}>
          <button onClick={exportBills} style={{padding:"9px 14px",borderRadius:10,border:`1px solid ${T.border}`,background:"#fff",fontWeight:600,fontSize:12,cursor:"pointer",color:T.slate,display:"flex",alignItems:"center",gap:6,boxShadow:T.shadow3d}}>
            <Icon name="download" size="sm" color={T.slate}/>Export
          </button>
          <button onClick={()=>setBulk(true)} style={{padding:"9px 14px",borderRadius:10,border:`1px solid ${T.border}`,background:"#fff",fontWeight:600,fontSize:12,cursor:"pointer",color:T.purple,display:"flex",alignItems:"center",gap:6,boxShadow:T.shadow3d}}>
            <Icon name="grid" size="sm" color={T.purple}/>Bulk
          </button>
          <button onClick={()=>setIssue(true)} style={{padding:"9px 14px",borderRadius:10,border:"none",background:T.navy,color:"#fff",fontWeight:700,fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",gap:6,boxShadow:T.shadow3d}}>
            <Icon name="plus" size="sm" color="#fff"/>Issue
          </button>
        </div>}
      </div>
      <div style={{...card,padding:16,marginBottom:14}}>
        <div style={{position:"relative",marginBottom:12}}>
          <Icon name="search" size="sm" color={T.muted} style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)"}}/>
          <input value={search} onChange={e=>setSrch(e.target.value)} placeholder="Search by name or billing period…" style={{...inp,paddingLeft:38}}/>
        </div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
          {["all","paid","unpaid","overdue"].map(s=>(
            <button key={s} onClick={()=>setFS(s)} style={{padding:"6px 13px",borderRadius:20,border:`1.5px solid ${fS===s?T.navy:T.border}`,background:fS===s?T.navy:"#fff",color:fS===s?"#fff":T.muted,fontWeight:600,fontSize:11,cursor:"pointer",transition:"all .15s"}}>
              {s==="all"?"All":s.charAt(0).toUpperCase()+s.slice(1)}
            </button>
          ))}
          <span style={{color:T.border,fontSize:16}}>|</span>
          {["all","water","dues"].map(t=>(
            <button key={t} onClick={()=>setFT(t)} style={{padding:"6px 13px",borderRadius:20,border:`1.5px solid ${fT===t?T.blue:T.border}`,background:fT===t?T.blue:"#fff",color:fT===t?"#fff":T.muted,fontWeight:600,fontSize:11,cursor:"pointer"}}>
              {t==="all"?"All Types":t==="water"?"Water":"Dues"}
            </button>
          ))}
          <select value={sort} onChange={e=>setSort(e.target.value)} style={{padding:"6px 10px",borderRadius:20,border:`1.5px solid ${T.border}`,fontSize:11,fontWeight:600,cursor:"pointer",background:"#fff",color:T.ink}}>
            <option value="date">Latest</option><option value="amount">Amount</option><option value="status">Status</option>
          </select>
        </div>
      </div>
      <div style={card}>
        <div style={{padding:"10px 20px",borderBottom:`1px solid ${T.border}`,background:T.bg,display:"flex",justifyContent:"space-between"}}>
          <span style={{fontSize:11,color:T.muted,fontWeight:700}}>{vis.length} bill{vis.length!==1?"s":""}</span>
          <span style={{fontSize:11,color:T.muted}}>Total: <strong style={{color:T.navy}}>{fmt(vis.reduce((s,b)=>s+b.amount,0))}</strong></span>
        </div>
        {vis.length===0&&<div style={{padding:48,textAlign:"center",color:T.muted,fontSize:14}}>No bills match your filters.</div>}
        {vis.map((b,i)=>{
          const res=residents.find(r=>r.id===b.residentId);
          return(
            <div key={b.id} className="row-hover" style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"13px 20px",borderBottom:i<vis.length-1?`1px solid ${T.border}`:"none",flexWrap:"wrap",gap:10,background:T.surface}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <Av name={res?.name||"?"} size={38} idx={i}/>
                <div>
                  <div style={{fontWeight:700,fontSize:14,color:T.ink}}>{res?.name}</div>
                  <div style={{fontSize:11,color:T.muted}}>{res?.unit} · {b.month} · Due {b.dueDate}</div>
                  {b.paidDate&&<div style={{fontSize:11,color:T.green,fontWeight:600,display:"flex",alignItems:"center",gap:3}}><Icon name="check" size={10} color={T.green} strokeWidth={2.5}/>Paid {b.paidDate} · {(b.method||"").toUpperCase()}</div>}
                </div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                <span style={{background:b.type==="water"?T.blueLt:T.amberLt,color:b.type==="water"?T.blue:T.amber,borderRadius:20,padding:"3px 10px 3px 8px",fontSize:11,fontWeight:700,display:"inline-flex",alignItems:"center",gap:4}}>
                  <Icon name={b.type==="water"?"droplet":"building"} size={10} color={b.type==="water"?T.blue:T.amber} strokeWidth={2}/>
                  {b.type==="water"?"Water":"Dues"}
                </span>
                <span style={{fontWeight:800,color:T.navy,fontSize:16,minWidth:80,textAlign:"right"}}>{fmt(b.amount)}</span>
                <Badge status={b.status}/>
                {b.status==="paid"&&<button onClick={()=>setRB(b)} style={{padding:"6px",borderRadius:8,border:`1px solid ${T.border}`,background:"#fff",cursor:"pointer",display:"flex"}}><Icon name="printer" size="sm" color={T.muted}/></button>}
                {b.status!=="paid"&&<button onClick={()=>setPB(b)} style={{padding:"8px 16px",borderRadius:9,border:"none",background:T.green,color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",gap:6,boxShadow:T.shadow3d}}>
                  <Icon name="credit" size="sm" color="#fff"/>Pay
                </button>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   RESIDENTS PAGE
═══════════════════════════════════════════════════════════════════ */
function ResidentsPage({residents, bills, onAdd, onEdit, users}) {
  const [search,setSrch]=useState(""); const [editR,setER]=useState(null); const [showAdd,setAdd]=useState(false);
  const [showIE,setIE]=useState(false);
  const fil=residents.filter(r=>r.name.toLowerCase().includes(search.toLowerCase())||r.unit.toLowerCase().includes(search.toLowerCase()));

  const ResidentForm=({r,onSave,onClose_})=>{
    const [f,setF]=useState(r||{name:"",unit:"",email:"",phone:"",joinDate:today()});
    const s=(k,v)=>setF(x=>({...x,[k]:v}));
    const go=()=>{if(!f.name||!f.unit||!f.email||!f.phone){alert("Fill all fields.");return;}onSave(f);onClose_();};
    return(
      <Modal title={r?"Edit Resident":"Add Resident"} onClose={onClose_} icon="user">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
          {[["name","Full Name","text"],["unit","Unit / Lot","text"],["email","Email","email"],["phone","Phone","text"],["joinDate","Date Joined","date"]].map(([k,lb,tp])=>(
            <div key={k} style={{gridColumn:k==="email"?"1 / span 2":"auto"}}>
              <label style={lbl}>{lb}</label>
              <input type={tp} value={f[k]||""} onChange={e=>s(k,e.target.value)} style={inp}/>
            </div>
          ))}
        </div>
        <button onClick={go} style={btn(T.navy)}>{r?"Save Changes":"Add Resident"}</button>
      </Modal>
    );
  };

  return(
    <div>
      {showAdd&&<ResidentForm onSave={r=>{onAdd({...r,id:Date.now()});setAdd(false);}} onClose_={()=>setAdd(false)}/>}
      {editR&&<ResidentForm r={editR} onSave={d=>{onEdit({...editR,...d});setER(null);}} onClose_={()=>setER(null)}/>}
      {showIE&&<ImportExportModal residents={residents} onImport={rows=>{rows.forEach(r=>onAdd(r));setIE(false);}} onClose={()=>setIE(false)}/>}

      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:12}}>
        <h2 style={{fontFamily:"'Sora',sans-serif",fontSize:20,fontWeight:700,color:T.navy,margin:0}}>Residents ({residents.length})</h2>
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>setIE(true)} style={{padding:"9px 14px",borderRadius:10,border:`1px solid ${T.border}`,background:"#fff",fontWeight:600,fontSize:12,cursor:"pointer",color:T.teal,display:"flex",alignItems:"center",gap:6,boxShadow:T.shadow3d}}>
            <Icon name="package" size="sm" color={T.teal}/>Import / Export
          </button>
          <button onClick={()=>setAdd(true)} style={{padding:"9px 14px",borderRadius:10,border:"none",background:T.navy,color:"#fff",fontWeight:700,fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",gap:6,boxShadow:T.shadow3d}}>
            <Icon name="plus" size="sm" color="#fff"/>Add Resident
          </button>
        </div>
      </div>
      <div style={{position:"relative",marginBottom:16}}>
        <Icon name="search" size="sm" color={T.muted} style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)"}}/>
        <input value={search} onChange={e=>setSrch(e.target.value)} placeholder="Search by name or unit…" style={{...inp,paddingLeft:38}}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:14}}>
        {fil.map((r,i)=>{
          const rb=bills.filter(b=>b.residentId===r.id);
          const due=rb.filter(b=>b.status!=="paid").reduce((s,b)=>s+b.amount,0);
          const hasOD=rb.some(b=>b.status==="overdue");
          const u=users?.find(x=>x.residentId===r.id);
          return(
            <div key={r.id} className="card-hover" style={{...card,padding:"18px 20px",animation:`fadeUp .3s ease ${i*40}ms both`,borderTop:`3px solid ${hasOD?T.red:due>0?T.amber:T.green}`}}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
                <Av name={r.name} size={44} idx={i}/>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:14,color:T.navy,fontFamily:"'Sora',sans-serif"}}>{r.name}</div>
                  <div style={{fontSize:12,color:T.muted}}>{r.unit}</div>
                </div>
                {due===0&&<span style={{background:T.greenLt,color:T.green,borderRadius:20,padding:"2px 9px",fontSize:10,fontWeight:700,display:"flex",alignItems:"center",gap:3}}><Icon name="check" size={9} color={T.green} strokeWidth={2.5}/>Clear</span>}
                {hasOD&&<span style={{background:T.redLt,color:T.red,borderRadius:20,padding:"2px 9px",fontSize:10,fontWeight:700,display:"flex",alignItems:"center",gap:3}}><Icon name="alertTri" size={9} color={T.red} strokeWidth={2}/>Overdue</span>}
              </div>
              <div style={{fontSize:12,color:T.muted,marginBottom:3,display:"flex",alignItems:"center",gap:5}}><Icon name="mail" size={11} color={T.muted}/>{r.email}</div>
              <div style={{fontSize:12,color:T.muted,marginBottom:3,display:"flex",alignItems:"center",gap:5}}><Icon name="phone" size={11} color={T.muted}/>{r.phone}</div>
              {u?.mobile&&<div style={{fontSize:12,color:T.muted,marginBottom:12,display:"flex",alignItems:"center",gap:5}}><Icon name="smartphone" size={11} color={T.muted}/>{u.mobile}</div>}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:10,borderTop:`1px solid ${T.border}`}}>
                <div>
                  <div style={{fontSize:10,color:T.muted,fontWeight:700,letterSpacing:0.5}}>BALANCE DUE</div>
                  <div style={{fontSize:18,fontWeight:800,color:due>0?T.red:T.green,fontFamily:"'Sora',sans-serif"}}>{fmt(due)}</div>
                </div>
                <button onClick={()=>setER(r)} style={{padding:"7px 14px",borderRadius:9,border:`1px solid ${T.border}`,background:"#fff",cursor:"pointer",fontSize:12,fontWeight:700,color:T.navy,display:"flex",alignItems:"center",gap:6,boxShadow:T.shadow3d}}>
                  <Icon name="edit" size="sm" color={T.navy}/>Edit
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   REPORTS PAGE
═══════════════════════════════════════════════════════════════════ */
function ReportsPage({residents, bills}) {
  const months=["Jan 2026","Feb 2026","Mar 2026","Apr 2026","May 2026"];
  const mData=months.map(m=>({m,w:bills.filter(b=>b.month===m&&b.type==="water"&&b.status==="paid").reduce((s,b)=>s+b.amount,0),d:bills.filter(b=>b.month===m&&b.type==="dues"&&b.status==="paid").reduce((s,b)=>s+b.amount,0)}));
  const maxB=Math.max(...mData.map(x=>x.w+x.d),1);
  const debtors=residents.map(r=>({...r,due:bills.filter(b=>b.residentId===r.id&&b.status!=="paid").reduce((s,b)=>s+b.amount,0)})).filter(r=>r.due>0).sort((a,b)=>b.due-a.due);
  const total=bills.reduce((s,b)=>s+b.amount,0);
  const coll=bills.filter(b=>b.status==="paid").reduce((s,b)=>s+b.amount,0);
  const rate=bills.length?Math.round(bills.filter(b=>b.status==="paid").length/bills.length*100):0;
  const exportAll=()=>{const h=["Resident","Unit","Total Billed","Paid","Pending","Rate %"];const rows=[h,...residents.map(r=>{const rb=bills.filter(b=>b.residentId===r.id);const p=rb.filter(b=>b.status==="paid").reduce((s,b)=>s+b.amount,0);const pend=rb.filter(b=>b.status!=="paid").reduce((s,b)=>s+b.amount,0);const t=rb.reduce((s,b)=>s+b.amount,0);return[r.name,r.unit,t,p,pend,t?Math.round(p/t*100):0];})];const csv=rows.map(r=>r.map(v=>`"${v}"`).join(",")).join("\n");const blob=new Blob([csv],{type:"text/csv"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`cms_hoa_report_${today()}.csv`;a.click();URL.revokeObjectURL(url);};

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:12}}>
        <h2 style={{fontFamily:"'Sora',sans-serif",fontSize:20,fontWeight:700,color:T.navy,margin:0}}>Reports & Analytics</h2>
        <button onClick={exportAll} style={{padding:"9px 14px",borderRadius:10,border:`1px solid ${T.border}`,background:"#fff",fontWeight:600,fontSize:12,cursor:"pointer",color:T.slate,display:"flex",alignItems:"center",gap:6,boxShadow:T.shadow3d}}>
          <Icon name="download" size="sm" color={T.slate}/>Export Report
        </button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))",gap:14,marginBottom:22}}>
        {[["Total Billed",fmt(total),"receipt","#1C2B3A"],["Collected",fmt(coll),"check",T.green],["Uncollected",fmt(total-coll),"alertTri",T.red],["Collection Rate",`${rate}%`,"percent",T.teal]].map(([l,v,ic,c],i)=>(
          <div key={i} style={{...card,padding:"18px 20px"}}>
            <div style={{width:36,height:36,borderRadius:10,background:`${c}15`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:10}}><Icon name={ic} size="md" color={c} strokeWidth={1.8}/></div>
            <div style={{fontWeight:800,fontSize:18,color:T.navy,fontFamily:"'Sora',sans-serif"}}>{v}</div>
            <div style={{fontSize:12,color:T.muted,marginTop:2}}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"3fr 2fr",gap:16,marginBottom:22}}>
        <div style={{...card,padding:"20px"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}><Icon name="chart" size="sm" color={T.navy} strokeWidth={1.8}/><span style={{fontWeight:700,color:T.navy,fontSize:14,fontFamily:"'Sora',sans-serif"}}>Monthly Collections</span></div>
          <div style={{display:"flex",alignItems:"flex-end",gap:12,height:150,marginBottom:8}}>
            {mData.map(({m,w,d})=>(
              <div key={m} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                <div style={{width:"100%",display:"flex",flexDirection:"column",justifyContent:"flex-end",height:130,gap:1}}>
                  <div style={{width:"100%",height:`${(w/maxB)*125}px`,background:T.blue,borderRadius:"4px 4px 0 0",minHeight:w?2:0,transition:"height .5s",boxShadow:"0 2px 6px rgba(26,92,255,.25)"}}/>
                  <div style={{width:"100%",height:`${(d/maxB)*125}px`,background:T.teal,borderRadius:"4px 4px 0 0",minHeight:d?2:0,transition:"height .5s",boxShadow:"0 2px 6px rgba(11,138,138,.25)"}}/>
                </div>
                <div style={{fontSize:9,color:T.muted,fontWeight:600}}>{m.slice(0,3)}</div>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:16,justifyContent:"center"}}>
            {[[T.blue,"Water"],[T.teal,"Dues"]].map(([c,l])=>(
              <div key={l} style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:10,height:10,borderRadius:2,background:c}}/><span style={{fontSize:11,color:T.muted,fontWeight:600}}>{l}</span></div>
            ))}
          </div>
        </div>
        <div style={{...card,padding:"20px"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}><Icon name="alertTri" size="sm" color={T.red} strokeWidth={1.8}/><span style={{fontWeight:700,color:T.navy,fontSize:14,fontFamily:"'Sora',sans-serif"}}>Outstanding Balances</span></div>
          {debtors.length===0&&<div style={{color:T.muted,fontSize:13,textAlign:"center",padding:"20px 0",display:"flex",flexDirection:"column",alignItems:"center",gap:8}}><Icon name="check" size="xl" color={T.green}/><span style={{color:T.green,fontWeight:700}}>All settled!</span></div>}
          {debtors.slice(0,6).map((r,i)=>(
            <div key={r.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"9px 0",borderBottom:i<debtors.length-1?`1px solid ${T.border}`:"none"}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{width:20,height:20,borderRadius:"50%",background:i===0?T.redLt:T.bg,color:i===0?T.red:T.muted,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800}}>{i+1}</span>
                <div><div style={{fontWeight:700,fontSize:13,color:T.ink}}>{r.name}</div><div style={{fontSize:11,color:T.muted}}>{r.unit}</div></div>
              </div>
              <div style={{fontWeight:800,color:T.red,fontSize:14}}>{fmt(r.due)}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={card}>
        <div style={{padding:"14px 20px",borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",gap:8}}><Icon name="users" size="sm" color={T.navy} strokeWidth={1.8}/><span style={{fontWeight:700,color:T.navy,fontSize:14,fontFamily:"'Sora',sans-serif"}}>Per-Resident Summary</span></div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr style={{background:T.bg}}>{["Resident","Unit","Billed","Paid","Pending","Rate","Status"].map(h=>(
              <th key={h} style={{padding:"10px 16px",textAlign:"left",fontSize:10,fontWeight:700,color:T.muted,letterSpacing:0.5,textTransform:"uppercase",whiteSpace:"nowrap"}}>{h}</th>
            ))}</tr></thead>
            <tbody>{residents.map((r,i)=>{
              const rb=bills.filter(b=>b.residentId===r.id);
              const paid=rb.filter(b=>b.status==="paid").reduce((s,b)=>s+b.amount,0);
              const pend=rb.filter(b=>b.status!=="paid").reduce((s,b)=>s+b.amount,0);
              const tot=rb.reduce((s,b)=>s+b.amount,0);
              const rt=tot?Math.round(paid/tot*100):0;
              const hasOD=rb.some(b=>b.status==="overdue");
              return(<tr key={r.id} style={{borderBottom:`1px solid ${T.border}`,background:i%2===0?"#fff":T.bg}}>
                <td style={{padding:"11px 16px"}}><div style={{display:"flex",alignItems:"center",gap:8}}><Av name={r.name} size={26} idx={i}/><span style={{fontWeight:700,fontSize:13,color:T.ink}}>{r.name}</span></div></td>
                <td style={{padding:"11px 16px",fontSize:12,color:T.muted,whiteSpace:"nowrap"}}>{r.unit}</td>
                <td style={{padding:"11px 16px",fontWeight:700,color:T.navy,fontSize:13}}>{fmt(tot)}</td>
                <td style={{padding:"11px 16px",fontWeight:700,color:T.green,fontSize:13}}>{fmt(paid)}</td>
                <td style={{padding:"11px 16px",fontWeight:700,color:pend>0?T.red:T.muted,fontSize:13}}>{fmt(pend)}</td>
                <td style={{padding:"11px 16px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <div style={{width:50,height:5,background:T.border,borderRadius:10,overflow:"hidden"}}><div style={{width:`${rt}%`,height:"100%",background:rt===100?T.green:rt>50?T.amber:T.red,borderRadius:10}}/></div>
                    <span style={{fontSize:11,fontWeight:700,color:T.muted}}>{rt}%</span>
                  </div>
                </td>
                <td style={{padding:"11px 16px"}}><Badge status={hasOD?"overdue":pend===0?"paid":"unpaid"}/></td>
              </tr>);})}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   BULK BILL MODAL
═══════════════════════════════════════════════════════════════════ */
function BulkBillModal({residents, onBulkAdd, onClose}) {
  const [type,setType]=useState("dues"); const [amount,setAmount]=useState("500");
  const [dueDate,setDD]=useState("2026-06-15"); const [month,setMonth]=useState("Jun 2026");
  const [sel,setSel]=useState(residents.map(r=>r.id)); const [done,setDone]=useState(false);
  const toggle=id=>setSel(s=>s.includes(id)?s.filter(x=>x!==id):[...s,id]);
  const go=()=>{if(!amount||!dueDate||!sel.length){alert("Fill all fields.");return;}onBulkAdd(sel.map(rId=>({id:Date.now()+Math.random(),residentId:rId,type,amount:Number(amount),dueDate,status:"unpaid",month,issuedDate:today(),ref:null,method:null,paidDate:null})));setDone(true);};
  if(done) return(<Modal title="Bills Created!" onClose={onClose} icon="check"><div style={{textAlign:"center",padding:"16px 0"}}><div style={{width:64,height:64,borderRadius:"50%",background:T.greenLt,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px"}}><Icon name="check" size="xl" color={T.green} strokeWidth={2}/></div><div style={{fontWeight:800,fontSize:17,color:T.navy}}>{sel.length} bills issued!</div><button onClick={onClose} style={{...btn(T.navy),marginTop:20}}>Done</button></div></Modal>);
  return(
    <Modal title="Generate Monthly Bills" onClose={onClose} wide icon="grid">
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
        <div><label style={lbl}>Bill Type</label><select value={type} onChange={e=>{setType(e.target.value);setAmount(e.target.value==="dues"?"500":"");}} style={inp}><option value="dues">Monthly Dues</option><option value="water">Water Bill</option></select></div>
        <div><label style={lbl}>Amount (₱)</label><input type="number" value={amount} onChange={e=>setAmount(e.target.value)} style={inp}/></div>
        <div><label style={lbl}>Billing Period</label><input value={month} onChange={e=>setMonth(e.target.value)} style={inp}/></div>
        <div><label style={lbl}>Due Date</label><input type="date" value={dueDate} onChange={e=>setDD(e.target.value)} style={inp}/></div>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <label style={lbl}>Select Residents</label>
        <button onClick={()=>setSel(sel.length===residents.length?[]:residents.map(r=>r.id))} style={{fontSize:11,color:T.blue,background:"none",border:"none",cursor:"pointer",fontWeight:700}}>
          {sel.length===residents.length?"Deselect All":"Select All"}
        </button>
      </div>
      <div style={{border:`1px solid ${T.border}`,borderRadius:12,overflow:"hidden",maxHeight:230,overflowY:"auto",marginBottom:14}}>
        {residents.map((r,i)=>(
          <div key={r.id} onClick={()=>toggle(r.id)} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 14px",borderBottom:i<residents.length-1?`1px solid ${T.border}`:"none",cursor:"pointer",background:sel.includes(r.id)?T.blueLt:"#fff",transition:"background .15s"}}>
            <div style={{width:20,height:20,borderRadius:5,border:`2px solid ${sel.includes(r.id)?T.blue:T.border}`,background:sel.includes(r.id)?T.blue:"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              {sel.includes(r.id)&&<Icon name="check" size={10} color="#fff" strokeWidth={3}/>}
            </div>
            <Av name={r.name} size={28} idx={i}/>
            <div><div style={{fontWeight:600,fontSize:13,color:T.ink}}>{r.name}</div><div style={{fontSize:11,color:T.muted}}>{r.unit}</div></div>
          </div>
        ))}
      </div>
      <div style={{background:T.greenLt,borderRadius:10,padding:"10px 14px",marginBottom:14,fontSize:13,color:T.green,fontWeight:600}}>
        Creating {sel.length} bills · Total: {fmt(Number(amount||0)*sel.length)}
      </div>
      <button onClick={go} style={{...btn(T.teal),display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><Icon name="grid" size="sm" color="#fff"/>Generate Bills</button>
    </Modal>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   ISSUE SINGLE BILL
═══════════════════════════════════════════════════════════════════ */
function IssueBillModal({residents, onAdd, onClose}) {
  const [f,setF]=useState({residentId:"",type:"dues",amount:"500",dueDate:"2026-05-15",month:"May 2026"});
  const s=(k,v)=>setF(x=>({...x,[k]:v}));
  const go=()=>{if(!f.residentId||!f.amount||!f.dueDate){alert("Fill all fields.");return;}onAdd({...f,residentId:Number(f.residentId),amount:Number(f.amount),id:Date.now(),status:"unpaid",issuedDate:today(),ref:null,method:null,paidDate:null});onClose();};
  return(
    <Modal title="Issue New Bill" onClose={onClose} icon="receipt">
      <label style={lbl}>Resident</label><select value={f.residentId} onChange={e=>s("residentId",e.target.value)} style={{...inp,marginBottom:14}}><option value="">Select resident…</option>{residents.map(r=><option key={r.id} value={r.id}>{r.name} — {r.unit}</option>)}</select>
      <label style={lbl}>Bill Type</label><select value={f.type} onChange={e=>{s("type",e.target.value);s("amount",e.target.value==="dues"?"500":"");}} style={{...inp,marginBottom:14}}><option value="dues">Monthly Dues</option><option value="water">Water Bill</option></select>
      <label style={lbl}>Amount (₱)</label><input type="number" value={f.amount} onChange={e=>s("amount",e.target.value)} style={{...inp,marginBottom:14}}/>
      <label style={lbl}>Billing Period</label><input value={f.month} onChange={e=>s("month",e.target.value)} style={{...inp,marginBottom:14}}/>
      <label style={lbl}>Due Date</label><input type="date" value={f.dueDate} onChange={e=>s("dueDate",e.target.value)} style={{...inp,marginBottom:14}}/>
      <button onClick={go} style={btn(T.navy)}>Issue Bill</button>
    </Modal>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   ANNOUNCEMENT MODAL
═══════════════════════════════════════════════════════════════════ */
function AnnouncementModal({onSave, onClose}) {
  const [f,setF]=useState({title:"",body:"",type:"info"});
  const s=(k,v)=>setF(x=>({...x,[k]:v}));
  const go=()=>{if(!f.title||!f.body){alert("Fill all fields.");return;}onSave({...f,id:Date.now(),date:today(),author:"Admin"});onClose();};
  return(
    <Modal title="New Announcement" onClose={onClose} icon="bell">
      <label style={lbl}>Title</label><input value={f.title} onChange={e=>s("title",e.target.value)} placeholder="Announcement title" style={{...inp,marginBottom:14}}/>
      <label style={lbl}>Type</label><select value={f.type} onChange={e=>s("type",e.target.value)} style={{...inp,marginBottom:14}}><option value="info">Info</option><option value="alert">Alert</option><option value="event">Event</option></select>
      <label style={lbl}>Message</label><textarea value={f.body} onChange={e=>s("body",e.target.value)} rows={4} style={{...inp,resize:"vertical",marginBottom:14}}/>
      <button onClick={go} style={btn(T.blue)}>Post Announcement</button>
    </Modal>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   NOTIFY MODAL
═══════════════════════════════════════════════════════════════════ */
function NotifyModal({residents, bills, onNotify, onClose}) {
  const [sent,setSent]=useState(false); const [sending,setSending]=useState(false);
  const [tpl,setTpl]=useState("Dear {name}, your {type} bill of {amount} for {month} is due on {due}. Please pay via CMS HOA GO APP.");
  const pending=residents.filter(r=>bills.some(b=>b.residentId===r.id&&b.status!=="paid"));
  const preview=r=>{const rb=bills.filter(b=>b.residentId===r.id&&b.status!=="paid");const types=rb.map(b=>b.type==="water"?"Water":"Dues").join(" & ");const total=rb.reduce((s,b)=>s+b.amount,0);return tpl.replace("{name}",r.name).replace("{type}",types).replace("{amount}",fmt(total)).replace("{month}",rb[0]?.month||"").replace("{due}",rb[0]?.dueDate||"");};
  const doSend=()=>{setSending(true);setTimeout(()=>{onNotify(pending.map(r=>({name:r.name,phone:r.phone,mobile:r.phone,message:preview(r),time:new Date().toLocaleTimeString("en-PH",{hour:"2-digit",minute:"2-digit"})})));setSending(false);setSent(true);},1800);};
  return(
    <Modal title="Send Billing Reminders" onClose={onClose} wide icon="send">
      {!sent?(<>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
          <div style={{background:T.amberLt,borderRadius:12,padding:"14px",textAlign:"center"}}><div style={{fontWeight:800,fontSize:24,color:T.amber}}>{pending.length}</div><div style={{fontSize:11,color:T.amber,fontWeight:700}}>Recipients</div></div>
          <div style={{background:T.redLt,borderRadius:12,padding:"14px",textAlign:"center"}}><div style={{fontWeight:800,fontSize:24,color:T.red}}>{bills.filter(b=>b.status==="overdue").length}</div><div style={{fontSize:11,color:T.red,fontWeight:700}}>Overdue Bills</div></div>
        </div>
        <label style={lbl}>Message Template</label>
        <textarea value={tpl} onChange={e=>setTpl(e.target.value)} rows={3} style={{...inp,resize:"vertical",marginBottom:6,fontSize:13}}/>
        <div style={{fontSize:11,color:T.muted,marginBottom:14}}>Variables: <code>{"{name}"}</code> <code>{"{type}"}</code> <code>{"{amount}"}</code> <code>{"{month}"}</code> <code>{"{due}"}</code></div>
        {pending.length>0&&<><label style={lbl}>Preview</label><div style={{background:T.bg,borderRadius:10,padding:"12px 14px",fontSize:13,color:T.slate,marginBottom:14,lineHeight:1.5,fontStyle:"italic"}}>"{preview(pending[0])}"</div></>}
        <div style={{border:`1px solid ${T.border}`,borderRadius:12,overflow:"hidden",maxHeight:200,overflowY:"auto",marginBottom:14}}>
          {pending.map((r,i)=>{const owes=bills.filter(b=>b.residentId===r.id&&b.status!=="paid").reduce((s,b)=>s+b.amount,0);return(<div key={r.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px",borderBottom:i<pending.length-1?`1px solid ${T.border}`:"none"}}><div style={{display:"flex",alignItems:"center",gap:10}}><Av name={r.name} size={30} idx={i}/><div><div style={{fontWeight:700,fontSize:13,color:T.ink}}>{r.name}</div><div style={{fontSize:11,color:T.muted}}>{r.phone}</div></div></div><span style={{fontWeight:700,color:T.red,fontSize:13}}>{fmt(owes)}</span></div>);})}
        </div>
        <button onClick={doSend} disabled={sending||!pending.length} style={{...btn(T.blue),display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
          {sending?<span style={{width:14,height:14,border:"2px solid rgba(255,255,255,.3)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin .7s linear infinite"}}/>:<Icon name="send" size="sm" color="#fff"/>}{sending?"Sending…":"Send Reminders"}
        </button>
      </>):(
        <div style={{textAlign:"center",padding:"20px 0"}}>
          <div style={{fontSize:48,marginBottom:12}}>🎉</div>
          <div style={{fontWeight:800,fontSize:18,color:T.green,marginBottom:8}}>Reminders Sent!</div>
          <div style={{color:T.muted,fontSize:14}}>SMS & Email to <strong>{pending.length}</strong> residents.</div>
          <button onClick={onClose} style={{...btn(T.navy),marginTop:20}}>Done</button>
        </div>
      )}
    </Modal>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════════════════════ */
export default function App() {
  const [user,setUser]=useState(null);
  const [users,setUsers]=useState(USERS_INIT);
  const [residents,setResidents]=useState(RESIDENTS_INIT);
  const [bills,setBills]=useState(BILLS_INIT);
  const [announcements,setAnnouncements]=useState(ANNOUNCEMENTS_INIT);
  const [smsLog,setSmsLog]=useState([]);
  const [view,setView]=useState("dashboard");
  const [modal,setModal]=useState(null);
  const [toast,setToast]=useState(null);
  const [showAccount,setShowAccount]=useState(false);

  const showToast=(msg,type="success")=>{setToast({msg,type});};
  const isAdminOrSA=user?.role==="admin"||user?.role==="superadmin";

  const handlePay=(billId,ref,method)=>setBills(bs=>bs.map(b=>b.id===billId?{...b,status:"paid",paidDate:today(),ref,method}:b));
  const handleAddBill=d=>setBills(bs=>[...bs,d]);
  const handleBulkAdd=newBills=>{setBills(bs=>[...bs,...newBills]);showToast(`${newBills.length} bills created!`);};
  const handleAddResident=d=>{setResidents(rs=>[...rs,d]);showToast("Resident added!");};
  const handleEditResident=d=>{setResidents(rs=>rs.map(r=>r.id===d.id?d:r));showToast("Resident updated!");};
  const handleImportResidents=rows=>{setResidents(rs=>[...rs,...rows]);showToast(`${rows.length} residents imported!`);};
  const handleAnnounce=d=>{setAnnouncements(a=>[d,...a]);showToast("Announcement posted!");};
  const handleNotify=entries=>{setSmsLog(l=>[...l,...entries]);showToast(`${entries.length} notifications sent!`);};
  const handleUserUpdate=(updates)=>{setUsers(us=>us.map(u=>u.id===user.id?{...u,...updates}:u));setUser(u=>({...u,...updates}));showToast("Settings saved!");};

  const handleAddAdmin=d=>{setUsers(us=>[...us,d]);showToast("Admin account created!");};
  const handleEditAdmin=d=>{setUsers(us=>us.map(u=>u.id===d.id?d:u));showToast("Admin updated!");};
  const handleDeleteAdmin=id=>{setUsers(us=>us.filter(u=>u.id!==id));showToast("Admin removed.");};

  const overdueCount=bills.filter(b=>b.status==="overdue").length;

  const NAV = isAdminOrSA ? [
    {id:"dashboard",label:"Dashboard",icon:"home"},
    {id:"bills",label:"Bills",icon:"receipt"},
    {id:"residents",label:"Residents",icon:"users"},
    {id:"reports",label:"Reports",icon:"chart"},
    ...(user?.role==="superadmin"?[{id:"admins",label:"Admins",icon:"shield"}]:[]),
  ]:[
    {id:"dashboard",label:"Overview",icon:"home"},
    {id:"bills",label:"My Bills",icon:"receipt"},
  ];

  if(!user) return <LoginScreen onLogin={u=>{ setUser({...u}); setView("dashboard"); }}/>;

  return (
    <div style={{minHeight:"100vh",background:T.bg,fontFamily:"'Plus Jakarta Sans',sans-serif",color:T.ink}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        @keyframes fadeUp{from{transform:translateY(18px);opacity:0}to{transform:translateY(0);opacity:1}}
        @keyframes popIn{from{transform:scale(.88);opacity:0}to{transform:scale(1);opacity:1}}
        @keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
        @keyframes slideInRight{from{transform:translateX(120%);opacity:0}to{transform:translateX(0);opacity:1}}
        @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-thumb{background:#D1D9E6;border-radius:10px}
        input:focus,select:focus,textarea:focus{border-color:${T.teal}!important;box-shadow:0 0 0 3px ${T.tealLt}!important;outline:none}
        button:focus{outline:none}
        .navbtn:hover{background:rgba(255,255,255,.12)!important}
        .row-hover:hover{background:#F8FAFD!important}
        .card-hover:hover{transform:translateY(-2px);box-shadow:${T.shadowHv}!important}
      `}</style>

      {toast&&<Toast message={toast.msg} type={toast.type} onDone={()=>setToast(null)}/>}

      {/* Modals */}
      {modal==="notify"&&<NotifyModal residents={residents} bills={bills} onNotify={handleNotify} onClose={()=>setModal(null)}/>}
      {modal==="bulkBill"&&<BulkBillModal residents={residents} onBulkAdd={handleBulkAdd} onClose={()=>setModal(null)}/>}
      {modal==="issueBill"&&<IssueBillModal residents={residents} onAdd={handleAddBill} onClose={()=>setModal(null)}/>}
      {modal==="announce"&&<AnnouncementModal onSave={handleAnnounce} onClose={()=>setModal(null)}/>}
      {showAccount&&<AccountSettings user={user} onUpdate={handleUserUpdate} onClose={()=>setShowAccount(false)}/>}

      {/* Header */}
      <div style={{background:T.grad,position:"sticky",top:0,zIndex:100,boxShadow:"0 4px 24px rgba(10,22,40,.25)"}}>
        <div style={{maxWidth:1120,margin:"0 auto",padding:"0 20px"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",height:60}}>
            {/* Logo */}
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:36,height:36,borderRadius:10,background:"rgba(255,255,255,.1)",border:"1.5px solid rgba(255,255,255,.15)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <Icon name="building" size="md" color="#fff" strokeWidth={1.5}/>
              </div>
              <div>
                <div style={{fontFamily:"'Sora',sans-serif",color:"#fff",fontWeight:700,fontSize:14,lineHeight:1.1}}>CMS HOA GO APP</div>
                <div style={{color:"rgba(255,255,255,.4)",fontSize:9,fontWeight:600,letterSpacing:1.3,textTransform:"uppercase"}}>Community Management System</div>
              </div>
            </div>

            {/* Nav */}
            <div style={{display:"flex",alignItems:"center",gap:1}}>
              {NAV.map(n=>(
                <button key={n.id} onClick={()=>setView(n.id)} className="navbtn" style={{
                  padding:"8px 14px",borderRadius:9,border:"none",cursor:"pointer",
                  background:view===n.id?"rgba(255,255,255,.15)":"transparent",
                  color:view===n.id?"#fff":"rgba(255,255,255,.45)",
                  fontWeight:view===n.id?700:500,fontSize:12,
                  display:"flex",alignItems:"center",gap:5,transition:"all .15s",position:"relative",
                }}>
                  <Icon name={n.icon} size="sm" color={view===n.id?"#fff":"rgba(255,255,255,.45)"} strokeWidth={1.8}/>
                  {n.label}
                  {n.id==="bills"&&overdueCount>0&&isAdminOrSA&&<span style={{position:"absolute",top:0,right:0,background:T.red,color:"#fff",borderRadius:"50%",width:15,height:15,fontSize:9,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center"}}>{overdueCount}</span>}
                </button>
              ))}
            </div>

            {/* User */}
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <button onClick={()=>setShowAccount(true)} style={{display:"flex",alignItems:"center",gap:8,border:"none",background:"rgba(255,255,255,.08)",borderRadius:10,padding:"6px 12px",cursor:"pointer",border:"1px solid rgba(255,255,255,.1)"}}>
                <Av name={user.name} size={28} idx={0}/>
                <div style={{display:"flex",flexDirection:"column",alignItems:"flex-start"}}>
                  <span style={{fontFamily:"'Sora',sans-serif",color:"#fff",fontSize:11,fontWeight:700,lineHeight:1.1}}>{user.name.split(" ")[0]}</span>
                  <span style={{color:"rgba(255,255,255,.4)",fontSize:9,textTransform:"uppercase",letterSpacing:0.8}}>{user.role==="superadmin"?"Super Admin":user.role}</span>
                </div>
                <Icon name="settings" size="sm" color="rgba(255,255,255,.4)" strokeWidth={1.5}/>
              </button>
              <button onClick={()=>{setUser(null);setView("dashboard");}} style={{padding:"8px",borderRadius:9,border:"1px solid rgba(255,255,255,.15)",background:"transparent",cursor:"pointer",display:"flex",alignItems:"center"}}>
                <Icon name="logout" size="sm" color="rgba(255,255,255,.55)" strokeWidth={1.8}/>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Page */}
      <div style={{maxWidth:1120,margin:"0 auto",padding:"26px 20px 80px"}}>
        {view==="dashboard"&&<Dashboard user={user} residents={residents} bills={bills} announcements={announcements} setView={setView} openModal={setModal} onPay={handlePay} users={users} smsLog={smsLog} onSendReminders={handleNotify}/>}
        {view==="bills"&&<BillsPage user={user} residents={residents} bills={bills} onPay={handlePay} onAdd={handleAddBill} onBulkAdd={handleBulkAdd}/>}
        {view==="residents"&&isAdminOrSA&&<ResidentsPage residents={residents} bills={bills} onAdd={handleAddResident} onEdit={handleEditResident} users={users} onImport={rows=>handleImportResidents(rows)}/>}
        {view==="reports"&&isAdminOrSA&&<ReportsPage residents={residents} bills={bills}/>}
        {view==="admins"&&user?.role==="superadmin"&&<AdminManagePage users={users} onAdd={handleAddAdmin} onEdit={handleEditAdmin} onDelete={handleDeleteAdmin} currentUser={user}/>}
      </div>

      {isAdminOrSA&&<SmsLogFab log={smsLog}/>}
    </div>
  );
}
