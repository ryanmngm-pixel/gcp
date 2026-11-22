import { useState } from "react";
import { supabase } from "../supabase";

export function StudioAccess({ emailLink, busy }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event) {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setStatus("");
    try {
      const { error } = emailLink
        ? await supabase.auth.signInWithOtp({
            email: email.trim(),
            options: { emailRedirectTo: window.location.origin + "/dev?setup=1" },
          })
        : await supabase.rpc("gcp_add_studio_email", { p_email: email.trim() });
      if (error) throw error;
      setStatus(emailLink
        ? "Check your inbox for a Studio sign-in link."
        : "Email approved. Share the /dev link so they can request their own sign-in link.");
    } catch {
      setStatus(emailLink
        ? "The sign-in email could not be sent. Try again later."
        : "This email could not be approved.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="studio-auth-form" onSubmit={submit}>
      <label>
        {emailLink ? "Set or reset your password by email" : "Approve a Studio editor"}
        <input type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
      </label>
      <button className="studio-auth-submit" type="submit" disabled={saving || busy}>
        {emailLink ? "Email me a setup link" : "Add email"}
      </button>
      <p role="status">{status}</p>
    </form>
  );
}

export function StudioPassword({ onComplete }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event) {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setError("");
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      onComplete();
    } catch (problem) {
      setError(problem.message || "Could not set your password.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="studio-auth">
      <div className="studio-auth-main">
        <div className="studio-auth-card">
          <h1>Set your Studio password</h1>
          <form className="studio-auth-form" onSubmit={submit}>
            <label>New password
              <input type="password" minLength={8} required autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} />
            </label>
            {error && <p className="studio-auth-error" role="alert">{error}</p>}
            <button className="studio-auth-submit" type="submit" disabled={saving}>Save password</button>
            <button type="button" onClick={onComplete} disabled={saving}>Continue without changing password</button>
          </form>
        </div>
      </div>
    </main>
  );
}
