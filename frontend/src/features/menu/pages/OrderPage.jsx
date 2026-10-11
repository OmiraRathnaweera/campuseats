import { useState } from "react";

function OrderPage() {
  const [form, setForm] = useState({ name: "", email: "", qty: 1 });
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);

  function validate(v) {
    const e = {};
    if (v.name.trim().length < 2) e.name = "Name too short";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.email))
      e.email = "Enter a valid email";
    if (Number(v.qty) < 1) e.qty = "Qty must be ≥ 1";
    return e;
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length === 0) setDone(true);
  }

  if (done) {
    return (
      <div className="success-box">✅ Thanks, {form.name}! Order received.</div>
    );
  }

  return (
    <form className="order-form" onSubmit={handleSubmit} noValidate>
      <h2>Place Your Order</h2>

      <div className="field">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          className={errors.name ? "input-error" : ""}
          value={form.name}
          onChange={handleChange}
        />
        {errors.name && <span className="field-error">{errors.name}</span>}
      </div>

      <div className="field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          className={errors.email ? "input-error" : ""}
          value={form.email}
          onChange={handleChange}
        />
        {errors.email && <span className="field-error">{errors.email}</span>}
      </div>

      <div className="field">
        <label htmlFor="qty">Quantity</label>
        <input
          id="qty"
          name="qty"
          type="number"
          className={errors.qty ? "input-error" : ""}
          value={form.qty}
          onChange={handleChange}
        />
        {errors.qty && <span className="field-error">{errors.qty}</span>}
      </div>

      <button className="btn" type="submit">
        Place order
      </button>
    </form>
  );
}

export default OrderPage;
