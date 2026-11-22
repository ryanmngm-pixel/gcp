import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function InquiryInbox() {
  const [result, setResult] = useState(null);

  useEffect(() => {
    let active = true;
    async function load() {
      const { data, error } = await supabase.from("gcp_inquiries").select("*").order("created_at", { ascending: false }).limit(100);
      if (active) setResult(error ? { error: "The inbox is unavailable." } : { messages: data });
    }
    load();
    return () => { active = false; };
  }, []);

  return (
    <section className="studio-overview gcp-inbox">
      <h1>Inquiries</h1>
      {!result && <p>Loading messages…</p>}
      {result?.error && <p role="alert">{result.error}</p>}
      {result?.messages?.length === 0 && <p>No messages yet.</p>}
      {result?.messages?.map((message) => (
        <article className="interior-card" key={message.id}>
          <span>{message.kind === "volunteer" ? "Volunteer" : "Contact"} · {new Date(message.created_at).toLocaleDateString()}</span>
          <h2>{message.name}</h2>
          <a href={`mailto:${message.email}`}>{message.email}</a>
          {message.phone && <span>{message.phone}</span>}
          <span>Preferred reply: {message.reply_via}</span>
          <p>{message.message}</p>
        </article>
      ))}
    </section>
  );
}
