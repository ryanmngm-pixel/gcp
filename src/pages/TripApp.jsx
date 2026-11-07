
import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Check,
  Copy,
  ImagePlus,
  Lock,
  LogOut,
  MessageCircle,
  Plus,
  Send,
  ShieldCheck,
  Users,
} from "lucide-react";
import { supabase } from "../supabase";
import "./TripApp.css";

const BUCKET = "gcp-trip-photos";

function getError(error) {
  return error?.message || "Something went wrong.";
}

function formatTime(value) {
  return new Date(value).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function TripApp() {
  const [session, setSession] = useState(null);
  const [ready, setReady] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [trips, setTrips] = useState([]);
  const [trip, setTrip] = useState(null);
  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [tab, setTab] = useState("messages");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newTrip, setNewTrip] = useState("");
  const [destination, setDestination] = useState("");
  const [invite, setInvite] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const path = window.location.pathname;
  const inviteToken = path.split("/trip/invite/")[1];
  const isAdminPage = path.startsWith("/trip/admin");

  const loadTrips = useCallback(async () => {
    const { data, error: err } = await supabase
      .from("gcp_trips")
      .select("*")
      .order("created_at", { ascending: false });

    if (err) throw err;
    setTrips(data || []);
    return data || [];
  }, []);

  const loadTrip = useCallback(async (tripId) => {
    const [
      tripResult,
      memberResult,
      messageResult,
      photoResult,
    ] = await Promise.all([
      supabase.from("gcp_trips")
        .select("*").eq("id", tripId).single(),
      supabase.from("gcp_members")
        .select("*").eq("trip_id", tripId),
      supabase.from("gcp_messages")
        .select("*").eq("trip_id", tripId)
        .order("created_at", { ascending: true })
        .limit(500),
      supabase.from("gcp_photos")
        .select("*").eq("trip_id", tripId)
        .order("created_at", { ascending: false }),
    ]);

    for (const result of [
      tripResult,
      memberResult,
      messageResult,
      photoResult,
    ]) {
      if (result.error) throw result.error;
    }

    const people = memberResult.data || [];
    setTrip(tripResult.data);
    setMembers(people);

    const names = Object.fromEntries(
      people.map((person) => [
        person.user_id,
        person.display_name,
      ])
    );

    setMessages(
      (messageResult.data || []).map((item) => ({
        ...item,
        sender: names[item.user_id] || "Traveler",
      }))
    );

    const photoRecords = photoResult.data || [];

    const signed = await Promise.all(
      photoRecords.map(async (item) => {
        const { data } = await supabase.storage
          .from(BUCKET)
          .createSignedUrl(item.storage_path, 3600);

        return {
          ...item,
          url: data?.signedUrl || "",
          sender: names[item.user_id] || "Traveler",
        };
      })
    );

    setPhotos(signed);
  }, []);

  useEffect(() => {
    if (!supabase) {
      setError("Supabase is not configured.");
      setReady(true);
      return;
    }

    let active = true;

    async function initialize() {
      const { data } = await supabase.auth.getSession();

      let currentSession = data.session;

      if (!currentSession && inviteToken) {
        const result = await supabase.auth
          .signInAnonymously();

        if (result.error) {
          if (active) setError(getError(result.error));
        } else {
          currentSession = result.data.session;
        }
      }

      if (active) {
        setSession(currentSession);
        setReady(true);
      }
    }

    initialize();

    const { data: listener } = supabase.auth
      .onAuthStateChange((_event, nextSession) => {
        if (active) setSession(nextSession);
      });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [inviteToken]);

  useEffect(() => {
    if (!session || inviteToken) return;

    let active = true;

    async function initializeTrips() {
      try {
        const { data } = await supabase.rpc("gcp_is_admin");
        if (active) setAdmin(Boolean(data));

        const available = await loadTrips();

        if (active && !isAdminPage && available.length) {
          await loadTrip(available[0].id);
        }
      } catch (err) {
        if (active) setError(getError(err));
      }
    }

    initializeTrips();

    return () => {
      active = false;
    };
  }, [session?.user?.id, inviteToken, isAdminPage,
      loadTrips, loadTrip]);

  useEffect(() => {
    if (!trip?.id) return;

    const channel = supabase
      .channel(`gcp-trip-${trip.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "gcp_messages",
          filter: `trip_id=eq.${trip.id}`,
        },
        () => loadTrip(trip.id)
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "gcp_trips",
          filter: `id=eq.${trip.id}`,
        },
        () => loadTrip(trip.id)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [trip?.id, loadTrip]);

  async function redeem(event) {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      const { data, error: err } = await supabase.rpc(
        "gcp_redeem_invite",
        {
          p_token: inviteToken,
          p_name: name.trim(),
        }
      );

      if (err) throw err;

      window.location.replace(`/trip?joined=${data}`);
    } catch (err) {
      setError(getError(err));
    } finally {
      setBusy(false);
    }
  }

  async function login(event) {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      const { error: err } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (err) throw err;
    } catch (err) {
      setError(getError(err));
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/trip";
  }

  async function createTrip(event) {
    event.preventDefault();
    if (!newTrip.trim()) return;

    setBusy(true);
    setError("");

    try {
      const { error: err } = await supabase
        .from("gcp_trips")
        .insert({
          title: newTrip.trim(),
          destination: destination.trim(),
        });

      if (err) throw err;

      setNewTrip("");
      setDestination("");
      await loadTrips();
    } catch (err) {
      setError(getError(err));
    } finally {
      setBusy(false);
    }
  }

  async function createInvite(tripId) {
    setBusy(true);
    setError("");

    try {
      const { data, error: err } = await supabase.rpc(
        "gcp_create_invite",
        { p_trip: tripId }
      );

      if (err) throw err;

      setInvite(
        `${window.location.origin}/trip/invite/${data}`
      );
    } catch (err) {
      setError(getError(err));
    } finally {
      setBusy(false);
    }
  }

  async function toggleChat(item) {
    setError("");

    try {
      const { error: err } = await supabase
        .from("gcp_trips")
        .update({ chat_open: !item.chat_open })
        .eq("id", item.id);

      if (err) throw err;

      await loadTrips();

      if (trip?.id === item.id) {
        await loadTrip(item.id);
      }
    } catch (err) {
      setError(getError(err));
    }
  }

  async function sendMessage(event) {
    event.preventDefault();

    const body = message.trim();
    if (!body || !trip?.chat_open) return;

    setBusy(true);
    setError("");

    try {
      const { error: err } = await supabase
        .from("gcp_messages")
        .insert({
          trip_id: trip.id,
          user_id: session.user.id,
          body,
        });

      if (err) throw err;

      setMessage("");
      await loadTrip(trip.id);
    } catch (err) {
      setError(getError(err));
    } finally {
      setBusy(false);
    }
  }

  async function uploadPhoto(event) {
    const file = event.target.files?.[0];
    if (!file || !trip) return;

    setBusy(true);
    setError("");

    try {
      const allowed = [
        "image/jpeg",
        "image/png",
        "image/webp",
      ];

      if (!allowed.includes(file.type)) {
        throw new Error("Choose a JPG, PNG or WebP image.");
      }

      if (file.size > 10 * 1024 * 1024) {
        throw new Error("Photos must be under 10 MB.");
      }

      const extension = {
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/webp": "webp",
      }[file.type];

      const storagePath =
        `${trip.id}/${session.user.id}/` +
        `${crypto.randomUUID()}.${extension}`;

      const { error: uploadError } =
        await supabase.storage
          .from(BUCKET)
          .upload(storagePath, file, {
            contentType: file.type,
            upsert: false,
          });

      if (uploadError) throw uploadError;

      const { error: recordError } = await supabase
        .from("gcp_photos")
        .insert({
          trip_id: trip.id,
          user_id: session.user.id,
          storage_path: storagePath,
        });

      if (recordError) {
        await supabase.storage
          .from(BUCKET)
          .remove([storagePath]);
        throw recordError;
      }

      await loadTrip(trip.id);
    } catch (err) {
      setError(getError(err));
    } finally {
      setBusy(false);
      event.target.value = "";
    }
  }

  if (!ready) {
    return <div className="gcp-app-loading">Loading GCP...</div>;
  }

  if (inviteToken) {
    return (
      <main className="gcp-app gcp-app-center">
        <section className="gcp-panel gcp-invite-panel">
          <div className="gcp-mark">GCP<span>.</span></div>
          <span className="gcp-kicker">YOU'RE INVITED</span>
          <h1>Good things are better together.</h1>
          <p>
            You've been invited to a private GCP trip.
            Enter your name to join your group.
          </p>

          <form onSubmit={redeem} className="gcp-form">
            <label>Your name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="First and last name"
              maxLength={60}
              required
            />
            <button disabled={busy || !session}>
              {busy ? "Joining..." : "Accept invitation"}
              <ArrowRight size={18} />
            </button>
          </form>

          {error && <p className="gcp-error">{error}</p>}
          <small>
            Each invitation can only be used once.
          </small>
        </section>
      </main>
    );
  }

  if (!session) {
    if (!isAdminPage) {
      return (
        <main className="gcp-app gcp-app-center">
          <section className="gcp-panel">
            <div className="gcp-mark">GCP<span>.</span></div>
            <Lock size={32} />
            <h1>Your trip starts with an invitation.</h1>
            <p>
              Open the unique invitation sent by your
              organizer to join your private trip.
            </p>
            <a className="gcp-text-link" href="/">
              <ArrowLeft size={16} /> Back to website
            </a>
          </section>
        </main>
      );
    }

    return (
      <main className="gcp-app gcp-app-center">
        <section className="gcp-panel">
          <div className="gcp-mark">GCP<span>.</span></div>
          <span className="gcp-kicker">ORGANIZER ACCESS</span>
          <h1>Welcome back.</h1>
          <p>Sign in to manage your GCP trips.</p>

          <form className="gcp-form" onSubmit={login}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button disabled={busy}>
              Sign in <ArrowRight size={18} />
            </button>
          </form>

          {error && <p className="gcp-error">{error}</p>}
        </section>
      </main>
    );
  }

  if (isAdminPage) {
    if (!admin) {
      return (
        <main className="gcp-app gcp-app-center">
          <section className="gcp-panel">
            <Lock size={30} />
            <h1>Organizer access required.</h1>
            <p>
              This account has not been approved
              as a GCP organizer.
            </p>
            <button onClick={logout}>Sign out</button>
          </section>
        </main>
      );
    }

    return (
      <main className="gcp-app">
        <header className="gcp-app-header">
          <a className="gcp-mark" href="/">GCP<span>.</span></a>
          <span>ORGANIZER STUDIO</span>
          <button className="gcp-icon-button" onClick={logout}>
            <LogOut size={18} />
          </button>
        </header>

        <div className="gcp-app-container">
          <span className="gcp-kicker">THE CONTROL ROOM</span>
          <h1>Manage the journey.</h1>
          <p className="gcp-muted">
            Create trips, invite travelers and control messaging.
          </p>

          <section className="gcp-panel">
            <h2>Create a trip</h2>
            <form className="gcp-form" onSubmit={createTrip}>
              <label>Trip name</label>
              <input
                placeholder="Summer Adventure 2027"
                value={newTrip}
                onChange={(e) => setNewTrip(e.target.value)}
                required
              />
              <label>Destination</label>
              <input
                placeholder="Italy"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
              <button disabled={busy}>
                <Plus size={18} /> Create trip
              </button>
            </form>
          </section>

          <h2 className="gcp-section-title">Your trips</h2>

          <div className="gcp-admin-grid">
            {trips.map((item) => (
              <section className="gcp-panel" key={item.id}>
                <span className="gcp-kicker">
                  {item.destination || "GCP TRIP"}
                </span>
                <h2>{item.title}</h2>
                <p className="gcp-muted">
                  Chat is {item.chat_open ? "open" : "closed"}.
                </p>

                <div className="gcp-admin-actions">
                  <button
                    onClick={() => createInvite(item.id)}
                    disabled={busy}
                  >
                    <Plus size={16} /> Generate invite
                  </button>
                  <button
                    className="gcp-secondary-button"
                    onClick={() => toggleChat(item)}
                  >
                    {item.chat_open ? "Close chat" : "Open chat"}
                  </button>
                  <button
                    className="gcp-secondary-button"
                    onClick={() => loadTrip(item.id)}
                  >
                    <Users size={16} /> View trip
                  </button>
                </div>
              </section>
            ))}
          </div>

          {invite && (
            <section className="gcp-panel gcp-invite-result">
              <span className="gcp-kicker">NEW INVITATION</span>
              <h2>One person. One link.</h2>
              <p>
                Copy this link and send it to one traveler.
                It will stop working after they claim it.
              </p>
              <input value={invite} readOnly />
              <button onClick={() => navigator.clipboard.writeText(invite)}>
                <Copy size={16} /> Copy invitation
              </button>
            </section>
          )}

          {trip && (
            <section className="gcp-panel">
              <h2>{trip.title} — Travelers</h2>
              {members.map((person) => (
                <p key={person.user_id}>
                  <Check size={14} className="gcp-inline-icon" />
                  {person.display_name}
                </p>
              ))}
              {members.length === 0 && (
                <p className="gcp-muted">No travelers yet.</p>
              )}
            </section>
          )}

          {error && <p className="gcp-error">{error}</p>}
        </div>
      </main>
    );
  }

  return (
    <main className="gcp-app">
      <header className="gcp-app-header">
        <a className="gcp-mark" href="/">GCP<span>.</span></a>
        <span>YOUR TRIP</span>
        <button className="gcp-icon-button" onClick={logout}>
          <LogOut size={18} />
        </button>
      </header>

      <div className="gcp-app-container">
        {!trip ? (
          <section className="gcp-panel">
            <h1>Your adventures</h1>
            {trips.length === 0 ? (
              <p>
                No trips are linked to this session.
                Open your invitation to join.
              </p>
            ) : (
              trips.map((item) => (
                <button
                  key={item.id}
                  className="gcp-trip-option"
                  onClick={() => loadTrip(item.id)}
                >
                  {item.title} <ArrowRight size={18} />
                </button>
              ))
            )}
          </section>
        ) : (
          <>
            <button
              className="gcp-back-button"
              onClick={() => setTrip(null)}
            >
              <ArrowLeft size={16} /> All trips
            </button>

            <span className="gcp-kicker">
              {trip.destination || "YOUR NEXT ADVENTURE"}
            </span>
            <h1>{trip.title}</h1>
            <p className="gcp-muted">
              Your people. Your moments. Your journey.
            </p>

            <div className="gcp-tabs">
              <button
                className={tab === "messages" ? "active" : ""}
                onClick={() => setTab("messages")}
              >
                <MessageCircle size={18} /> Messages
              </button>
              <button
                className={tab === "photos" ? "active" : ""}
                onClick={() => setTab("photos")}
              >
                <Camera size={18} /> Photos
              </button>
            </div>

            {tab === "messages" ? (
              <section className="gcp-chat">
                <div className="gcp-chat-heading">
                  <div>
                    <h2>Group conversation</h2>
                    <p>{members.length} travelers</p>
                  </div>
                  <span className="gcp-chat-status">
                    {trip.chat_open ? "Chat open" : "Chat closed"}
                  </span>
                </div>

                <div className="gcp-chat-messages">
                  {messages.map((item) => (
                    <div
                      key={item.id}
                      className={
                        "gcp-message " +
                        (item.user_id === session.user.id
                          ? "mine"
                          : "")
                      }
                    >
                      <span>{item.sender}</span>
                      <p>{item.body}</p>
                      <small>{formatTime(item.created_at)}</small>
                    </div>
                  ))}

                  {messages.length === 0 && (
                    <div className="gcp-empty">
                      <MessageCircle size={30} />
                      <p>No messages yet.</p>
                    </div>
                  )}
                </div>

                {trip.chat_open ? (
                  <form
                    className="gcp-chat-compose"
                    onSubmit={sendMessage}
                  >
                    <input
                      placeholder="Write a message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      maxLength={2000}
                    />
                    <button disabled={busy || !message.trim()}>
                      <Send size={18} />
                    </button>
                  </form>
                ) : (
                  <div className="gcp-chat-closed">
                    <Lock size={17} />
                    The organizer hasn't opened messaging.
                  </div>
                )}
              </section>
            ) : (
              <section>
                <div className="gcp-gallery-header">
                  <div>
                    <h2>Shared memories.</h2>
                    <p className="gcp-muted">
                      Every moment, all in one place.
                    </p>
                  </div>

                  <label className="gcp-upload-button">
                    <ImagePlus size={18} />
                    {busy ? "Uploading..." : "Add photo"}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={uploadPhoto}
                      disabled={busy}
                      hidden
                    />
                  </label>
                </div>

                <div className="gcp-photo-grid">
                  {photos.map((photo) => (
                    <div className="gcp-photo" key={photo.id}>
                      {photo.url && (
                        <img
                          src={photo.url}
                          alt={`Uploaded by ${photo.sender}`}
                          loading="lazy"
                        />
                      )}
                      <span>{photo.sender}</span>
                    </div>
                  ))}
                </div>

                {photos.length === 0 && (
                  <div className="gcp-empty gcp-panel">
                    <Camera size={36} />
                    <h2>The gallery is waiting.</h2>
                    <p>Be the first to share a memory.</p>
                  </div>
                )}
              </section>
            )}

            {error && <p className="gcp-error">{error}</p>}
          </>
        )}
      </div>
    </main>
  );
}
