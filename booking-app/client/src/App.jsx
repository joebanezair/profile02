import { useEffect, useMemo, useState } from "react";
import { api } from "./api.js";

const emptyBooking = {
  guestName: "",
  service: "",
  bookingDate: "",
  notes: "",
  status: "pending"
};

function Auth({ onAuthenticated }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      const data = mode === "register"
        ? await api.register(form)
        : await api.login({ email: form.email, password: form.password });

      localStorage.setItem("booking_token", data.token);
      localStorage.setItem("booking_user", JSON.stringify(data.user));
      onAuthenticated(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <p className="eyebrow">MERN BOOKING APP</p>
        <h1>{mode === "login" ? "Welcome back" : "Create your account"}</h1>
        <p className="muted">Sign in to manage your bookings securely.</p>

        <form onSubmit={submit}>
          {mode === "register" && (
            <label>
              Name
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </label>
          )}
          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              minLength="8"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </label>

          {error && <p className="error">{error}</p>}
          <button disabled={busy}>{busy ? "Please wait..." : mode === "login" ? "Sign in" : "Register"}</button>
        </form>

        <button className="link-button" onClick={() => setMode(mode === "login" ? "register" : "login")}>
          {mode === "login" ? "Need an account? Register" : "Already have an account? Sign in"}
        </button>
      </section>
    </main>
  );
}

function Dashboard({ user, onLogout }) {
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState(emptyBooking);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const sortedBookings = useMemo(
    () => [...bookings].sort((a, b) => new Date(a.bookingDate) - new Date(b.bookingDate)),
    [bookings]
  );

  async function loadBookings() {
    try {
      setBookings(await api.bookings.list());
      setError("");
    } catch (err) {
      setError(err.message);
      if (/token|auth/i.test(err.message)) onLogout();
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBookings();
  }, []);

  async function submit(event) {
    event.preventDefault();
    setError("");

    try {
      if (editingId) {
        const updated = await api.bookings.update(editingId, form);
        setBookings((items) => items.map((item) => item._id === editingId ? updated : item));
      } else {
        const created = await api.bookings.create(form);
        setBookings((items) => [...items, created]);
      }
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  }

  function editBooking(booking) {
    setEditingId(booking._id);
    setForm({
      guestName: booking.guestName,
      service: booking.service,
      bookingDate: new Date(booking.bookingDate).toISOString().slice(0, 16),
      notes: booking.notes || "",
      status: booking.status
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function removeBooking(id) {
    if (!window.confirm("Delete this booking?")) return;
    try {
      await api.bookings.remove(id);
      setBookings((items) => items.filter((item) => item._id !== id));
      if (editingId === id) resetForm();
    } catch (err) {
      setError(err.message);
    }
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyBooking);
  }

  return (
    <main className="page-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">BOOKING MANAGER</p>
          <h1>Hello, {user?.name || "there"}</h1>
        </div>
        <button className="secondary" onClick={onLogout}>Sign out</button>
      </header>

      <section className="grid">
        <form className="panel booking-form" onSubmit={submit}>
          <div className="panel-title">
            <h2>{editingId ? "Edit booking" : "New booking"}</h2>
            {editingId && <button type="button" className="link-button" onClick={resetForm}>Cancel edit</button>}
          </div>

          <label>
            Guest name
            <input value={form.guestName} onChange={(e) => setForm({ ...form, guestName: e.target.value })} required />
          </label>
          <label>
            Service
            <input placeholder="Consultation, demo, meeting..." value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} required />
          </label>
          <label>
            Date and time
            <input type="datetime-local" value={form.bookingDate} onChange={(e) => setForm({ ...form, bookingDate: e.target.value })} required />
          </label>
          <label>
            Status
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </label>
          <label>
            Notes
            <textarea rows="4" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </label>

          {error && <p className="error">{error}</p>}
          <button>{editingId ? "Save changes" : "Create booking"}</button>
        </form>

        <section className="panel">
          <div className="panel-title">
            <h2>Your bookings</h2>
            <span className="count">{bookings.length}</span>
          </div>

          {loading ? (
            <p className="muted">Loading bookings...</p>
          ) : sortedBookings.length === 0 ? (
            <div className="empty-state">
              <h3>No bookings yet</h3>
              <p className="muted">Create your first booking using the form.</p>
            </div>
          ) : (
            <div className="booking-list">
              {sortedBookings.map((booking) => (
                <article className="booking-card" key={booking._id}>
                  <div>
                    <div className="booking-heading">
                      <h3>{booking.guestName}</h3>
                      <span className={`status ${booking.status}`}>{booking.status}</span>
                    </div>
                    <p><strong>{booking.service}</strong></p>
                    <p>{new Date(booking.bookingDate).toLocaleString()}</p>
                    {booking.notes && <p className="muted">{booking.notes}</p>}
                  </div>
                  <div className="row-actions">
                    <button className="secondary" onClick={() => editBooking(booking)}>Edit</button>
                    <button className="danger" onClick={() => removeBooking(booking._id)}>Delete</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("booking_user"));
    } catch {
      return null;
    }
  });

  function logout() {
    localStorage.removeItem("booking_token");
    localStorage.removeItem("booking_user");
    setUser(null);
  }

  return user
    ? <Dashboard user={user} onLogout={logout} />
    : <Auth onAuthenticated={setUser} />;
}
