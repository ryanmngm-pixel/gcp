import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { supabase } from "../supabase";

export default function InquiryForm({ kind = "contact" }) {
  const [replyVia, setReplyVia] = useState("Email");
  const [status, setStatus] = useState("idle");
  const volunteer = kind === "volunteer";

  async function submit(event) {
    event.preventDefault();
    if (status === "sending") return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    setStatus("sending");

    try {
      const { error } = await supabase.rpc("gcp_submit_inquiry", {
        p_kind: kind,
        p_name: fields.get("name").trim(),
        p_email: fields.get("email").trim(),
        p_phone: fields.get("phone").trim(),
        p_reply_via: replyVia,
        p_message: fields.get("message").trim(),
        p_website: fields.get("website"),
      });
      if (error) {
        setStatus(error.code === "P0001" ? "limit" : "error");
        return;
      }
      form.reset();
      setReplyVia("Email");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form className="gcp-inquiry" onSubmit={submit} aria-label={volunteer ? "Volunteer inquiry" : "Contact form"}>
      <div className="gcp-field-row">
        <label>Full name<input name="name" autoComplete="name" maxLength={120} required /></label>
        <label>Email<input type="email" name="email" autoComplete="email" maxLength={254} required /></label>
      </div>
      <div className="gcp-field-row">
        <label>Best way to reach you
          <select name="replyVia" value={replyVia} onChange={(event) => setReplyVia(event.target.value)}>
            <option>Email</option><option>Text</option><option>Phone</option>
          </select>
        </label>
        <label>Phone{replyVia === "Email" ? " (optional)" : ""}
          <input name="phone" type="tel" autoComplete="tel" maxLength={40} required={replyVia !== "Email"} />
        </label>
      </div>
      <label>{volunteer ? "What would you like to know about volunteering?" : "How can we help?"}
        <textarea name="message" rows={5} minLength={10} maxLength={4000} required />
      </label>
      <div hidden><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <button className="button button-dark" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : volunteer ? "Send volunteer inquiry" : "Send message"} <ArrowUpRight size={17} />
      </button>
      <div role="status" aria-live="polite">
        {status === "success" && "Your message was sent. Thank you for reaching out."}
        {status === "error" && "We couldn’t send your message. Try again or reach us on Facebook."}
        {status === "limit" && "Too many recent messages. Please try again later."}
      </div>
    </form>
  );
}
