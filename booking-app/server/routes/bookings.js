import { Router } from "express";
import Booking from "../models/Booking.js";
import requireAuth from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

router.get("/", async (req, res) => {
  const bookings = await Booking.find({ user: req.user.id }).sort({ bookingDate: 1 });
  res.json(bookings);
});

router.post("/", async (req, res) => {
  const { guestName, service, bookingDate, notes, status } = req.body;

  if (!guestName || !service || !bookingDate) {
    return res.status(400).json({ message: "Guest name, service and booking date are required." });
  }

  const booking = await Booking.create({
    user: req.user.id,
    guestName,
    service,
    bookingDate,
    notes: notes || "",
    status: status || "pending"
  });

  res.status(201).json(booking);
});

router.put("/:id", async (req, res) => {
  const { guestName, service, bookingDate, notes, status } = req.body;

  const booking = await Booking.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { guestName, service, bookingDate, notes, status },
    { new: true, runValidators: true }
  );

  if (!booking) {
    return res.status(404).json({ message: "Booking not found." });
  }

  res.json(booking);
});

router.delete("/:id", async (req, res) => {
  const booking = await Booking.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id
  });

  if (!booking) {
    return res.status(404).json({ message: "Booking not found." });
  }

  res.status(204).end();
});

export default router;
