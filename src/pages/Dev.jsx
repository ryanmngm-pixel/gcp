
import { useCallback, useEffect, useState } from "react";
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Globe2,
  Image as ImageIcon,
  LayoutDashboard,
  LoaderCircle,
  LockKeyhole,
  LogOut,
  Menu,
  Monitor,
  PanelLeftClose,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { supabase } from "../supabase";
import { checkEditorAccess } from "../dev/contentApi";
import MediaWorkspace from "../dev/MediaWorkspace";
import VisualEditor from "../dev/VisualEditor";
import "./Dev.css";

const navigation = [
  {
    title: "Workspace",
    items: [
      {
        id: "overview",
        label: "Overview",
        icon: LayoutDashboard,
      },
      {
        id: "visual",
        label: "Edit Website",
        icon: Monitor,
      },
      {
        id: "photography",
        label: "Photography",
        icon: ImageIcon,
      },
    ],
  },
  {
    title: "Management",
    items: [
      {
        id: "account",
        label: "Account",
        icon: ShieldCheck,
      },
    ],
  },
];

function LoadingScreen() {
  return (
    <div className="studio-loading">
      <div className="studio-loading-brand">
        gcp<span>.</span>
      </div>

      <LoaderCircle
        size={22}
        className="studio-spin"
      />

      <p>Opening GCP Studio</p>
    </div>
  );
}

function LoginScreen({ onLogin, loading, error }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    if (loading) return;

    await onLogin(email.trim(), password);
  }

  return (
    <div className="studio-auth">
      <div className="studio-auth-top">
        <a href="/" className="studio-auth-logo">
          gcp<span>.</span>
        </a>

        <span>STUDIO</span>
      </div>

      <div className="studio-auth-main">
        <div className="studio-auth-card">
          <div className="studio-auth-symbol">
            <LockKeyhole
              size={25}
              strokeWidth={1.7}
            />
          </div>

          <div className="studio-auth-eyebrow">
            GCP STUDIO
          </div>

          <h1>
            Welcome
            <br />
            back.
          </h1>

          <p className="studio-auth-description">
            Your space to shape the stories,
            photographs, and experiences shared
            with the world.
          </p>

          <form
            className="studio-auth-form"
            onSubmit={handleSubmit}
          >
            <label htmlFor="studio-email">
              Email address
            </label>

            <input
              id="studio-email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
            />

            <label htmlFor="studio-password">
              Password
            </label>

            <input
              id="studio-password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
            />

            {error && (
              <div
                className="studio-auth-error"
                role="alert"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              className="studio-auth-submit"
              disabled={loading}
            >
              {loading ? (
                <LoaderCircle
                  size={18}
                  className="studio-spin"
                />
              ) : (
                <>
                  Sign in to Studio
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="studio-auth-secure">
            <ShieldCheck size={15} />
            Secure editor access
          </div>
        </div>
      </div>

      <div className="studio-auth-footer">
        <span>
          Guatemala Children's Project
        </span>

        <a href="/">
          Return to website
          <ArrowRight size={13} />
        </a>
      </div>
    </div>
  );
}

function AccessDenied({
  onSignOut,
  loading,
  error,
}) {
  return (
    <div className="studio-access-denied">
      <div className="studio-access-icon">
        <LockKeyhole size={28} />
      </div>

      <h1>Access restricted.</h1>

      <p>
        This account is signed in, but it
        hasn't been granted permission to
        edit the GCP website.
      </p>

      {error && (
        <p role="alert">{error}</p>
      )}

      <button
        type="button"
        onClick={onSignOut}
        disabled={loading}
      >
        {loading ? (
          <LoaderCircle
            size={17}
            className="studio-spin"
          />
        ) : (
          <>
            Sign out
            <ArrowRight size={17} />
          </>
        )}
      </button>
    </div>
  );
}

function Overview({ onNavigate, user }) {
  const firstName =
    user?.user_metadata?.first_name ||
    user?.user_metadata?.name?.split(" ")[0] ||
    "there";

  return (
    <div className="studio-overview">
      <div className="studio-page-heading">
        <span className="studio-eyebrow">
          YOUR WORKSPACE
        </span>

        <h1>
          Good to see you,
          <br />
          <span>{firstName}.</span>
        </h1>

        <p>
          Your website, your stories, your impact.
          Everything starts here.
        </p>
      </div>

      <div className="studio-overview-feature">
        <div className="studio-feature-copy">
          <div className="studio-feature-kicker">
            <Sparkles size={15} />
            GCP STUDIO
          </div>

          <h2>
            Every story
            <br />
            deserves to
            <br />
            be seen.
          </h2>

          <p>
            Open your website, click the content
            you want to change, and publish
            when you're ready.
          </p>

          <button
            type="button"
            onClick={() =>
              onNavigate("visual")
            }
          >
            Edit your website
            <ArrowRight size={17} />
          </button>
        </div>

        <div
          className="studio-feature-art"
          aria-hidden="true"
        >
          <div className="studio-art-frame studio-art-back" />

          <div className="studio-art-frame studio-art-middle" />

          <div className="studio-art-frame studio-art-front">
            <Monitor
              size={54}
              strokeWidth={1.1}
            />
          </div>
        </div>
      </div>

      <div className="studio-section-heading">
        <div>
          <span className="studio-eyebrow">
            QUICK ACCESS
          </span>

          <h2>Your tools.</h2>
        </div>
      </div>

      <div className="studio-tool-grid">
        <button
          type="button"
          className="studio-tool-card"
          onClick={() =>
            onNavigate("visual")
          }
        >
          <div className="studio-tool-icon blue">
            <Monitor size={23} />
          </div>

          <h3>Edit Website</h3>

          <p>
            Click directly on headlines,
            descriptions, and photographs
            to update your website.
          </p>

          <div className="studio-tool-bottom">
            Open visual editor
            <ChevronRight size={16} />
          </div>
        </button>

        <button
          type="button"
          className="studio-tool-card"
          onClick={() =>
            onNavigate("photography")
          }
        >
          <div className="studio-tool-icon gray">
            <ImageIcon size={23} />
          </div>

          <h3>Photography</h3>

          <p>
            Organize your photo collections
            and manage the images shared
            across the website.
          </p>

          <div className="studio-tool-bottom">
            Manage photos
            <ChevronRight size={16} />
          </div>
        </button>
      </div>

      <div className="studio-workflow">
        <div className="studio-workflow-icon">
          <CheckCircle2 size={22} />
        </div>

        <div>
          <h3>You're in control.</h3>

          <p>
            Make changes, save drafts, and publish
            when you're ready. Your unpublished
            changes stay private.
          </p>
        </div>
      </div>
    </div>
  );
}

function AccountPage({
  user,
  onSignOut,
  signingOut,
  error,
}) {
  return (
    <div className="studio-account">
      <div className="studio-page-heading compact">
        <span className="studio-eyebrow">
          YOUR PROFILE
        </span>

        <h1>Account.</h1>

        <p>
          Manage your GCP Studio session.
        </p>
      </div>

      <div className="studio-account-card">
        <div className="studio-account-avatar">
          {(user?.email || "G")
            .charAt(0)
            .toUpperCase()}
        </div>

        <div>
          <h2>{user?.email}</h2>
          <p>Authorized website editor</p>
        </div>

        <span className="studio-account-verified">
          <CheckCircle2 size={15} />
          Verified
        </span>
      </div>

      <div className="studio-account-section">
        <div>
          <h3>Session</h3>

          <p>
            Sign out when you're finished
            editing, especially on shared
            computers.
          </p>
        </div>

        <button
          type="button"
          onClick={onSignOut}
          disabled={signingOut}
        >
          {signingOut ? (
            <LoaderCircle
              size={17}
              className="studio-spin"
            />
          ) : (
            <LogOut size={17} />
          )}

          Sign out
        </button>
      </div>

      {error && (
        <p role="alert">{error}</p>
      )}

      <div className="studio-account-security">
        <ShieldCheck size={18} />

        <span>
          Editor permissions are verified
          through Supabase.
        </span>
      </div>
    </div>
  );
}

export default function Dev() {
  const [user, setUser] = useState(null);
  const [authorized, setAuthorized] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState("");
  const [page, setPage] = useState("overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false);

  const refreshAccess = useCallback(async () => {
    try {
      const { data, error } =
        await supabase.auth.getUser();

      if (error || !data?.user) {
        setUser(null);
        setAuthorized(false);
        return;
      }

      setUser(data.user);

      const allowed = await checkEditorAccess();

      setAuthorized(Boolean(allowed));
    } catch (error) {
      console.error(
        "GCP Studio authentication error:",
        error
      );

      setAuthorized(false);
      setAuthError(
        "Unable to verify editor permissions."
      );
    } finally {
      setInitializing(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    let timeoutId;

    refreshAccess();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      timeoutId = window.setTimeout(() => {
        if (active) refreshAccess();
      }, 0);
    });

    return () => {
      active = false;

      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }

      subscription.unsubscribe();
    };
  }, [refreshAccess]);

  async function handleLogin(email, password) {
    if (authBusy) return;

    setAuthBusy(true);
    setAuthError("");

    try {
      const { error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (error) throw error;

      await refreshAccess();
    } catch (error) {
      console.error("Studio login error:", error);

      setAuthError(
        error?.message || "Unable to sign in."
      );
    } finally {
      setAuthBusy(false);
    }
  }

  async function handleSignOut() {
    if (authBusy) return;

    setAuthBusy(true);
    setAuthError("");

    try {
      const { error } =
        await supabase.auth.signOut();

      if (error) throw error;

      setUser(null);
      setAuthorized(false);
      setPage("overview");
      setMobileOpen(false);
    } catch (error) {
      console.error(
        "Studio sign out error:",
        error
      );

      setAuthError(
        error?.message || "Unable to sign out."
      );
    } finally {
      setAuthBusy(false);
    }
  }

  function navigate(id) {
    setPage(id);
    setMobileOpen(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  if (initializing) {
    return <LoadingScreen />;
  }

  if (!user) {
    return (
      <LoginScreen
        onLogin={handleLogin}
        loading={authBusy}
        error={authError}
      />
    );
  }

  if (!authorized) {
    return (
      <AccessDenied
        onSignOut={handleSignOut}
        loading={authBusy}
        error={authError}
      />
    );
  }

  if (page === "visual") {
    return (
      <VisualEditor
        onExit={() => navigate("overview")}
      />
    );
  }

  const allNavigationItems = navigation.flatMap(
    (group) => group.items
  );

  const activeLabel =
    allNavigationItems.find(
      (item) => item.id === page
    )?.label || "Overview";

  return (
    <div
      className={`gcp-studio ${
        sidebarCollapsed
          ? "sidebar-collapsed"
          : ""
      }`}
    >
      {mobileOpen && (
        <button
          className="studio-mobile-backdrop"
          type="button"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`studio-sidebar ${
          mobileOpen ? "mobile-open" : ""
        }`}
      >
        <div className="studio-sidebar-header">
          <button
            className="studio-brand"
            type="button"
            onClick={() => navigate("overview")}
          >
            <span className="studio-brand-mark">
              g<span>.</span>
            </span>

            <span className="studio-brand-name">
              GCP Studio
              <small>
                CONTENT MANAGEMENT
              </small>
            </span>
          </button>

          <button
            className="studio-collapse-button"
            type="button"
            aria-label="Toggle sidebar"
            onClick={() =>
              setSidebarCollapsed(
                (previous) => !previous
              )
            }
          >
            <PanelLeftClose size={18} />
          </button>
        </div>

        <div className="studio-sidebar-content">
          {navigation.map((group) => (
            <div
              className="studio-nav-group"
              key={group.title}
            >
              <div className="studio-nav-title">
                {group.title}
              </div>

              {group.items.map((item) => {
                const Icon = item.icon;
                const active = page === item.id;

                return (
                  <button
                    type="button"
                    key={item.id}
                    title={item.label}
                    aria-current={
                      active ? "page" : undefined
                    }
                    className={`studio-nav-item ${
                      active ? "active" : ""
                    }`}
                    onClick={() =>
                      navigate(item.id)
                    }
                  >
                    <Icon
                      size={19}
                      strokeWidth={1.8}
                    />

                    <span>{item.label}</span>

                    {active && (
                      <div className="studio-nav-active-dot" />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div className="studio-sidebar-bottom">
          <a
            className="studio-website-link"
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            title="View public website"
          >
            <Globe2 size={18} />
            <span>View website</span>
            <ExternalLink
              size={14}
              className="studio-external"
            />
          </a>

          <div className="studio-sidebar-user">
            <div className="studio-user-avatar">
              {(user.email || "G")
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="studio-user-info">
              <strong>GCP Editor</strong>
              <span>{user.email}</span>
            </div>

            <button
              type="button"
              title="Sign out"
              aria-label="Sign out"
              onClick={handleSignOut}
              disabled={authBusy}
            >
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </aside>

      <main className="studio-main">
        <header className="studio-topbar">
          <div className="studio-topbar-left">
            <button
              className="studio-mobile-toggle"
              type="button"
              aria-label="Open navigation"
              onClick={() =>
                setMobileOpen(true)
              }
            >
              <Menu size={22} />
            </button>

            <span className="studio-topbar-parent">
              GCP Studio
            </span>

            <ChevronRight size={14} />

            <strong>{activeLabel}</strong>
          </div>

          <div className="studio-topbar-right">
            <span className="studio-status">
              <span />
              Studio online
            </span>

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="studio-topbar-site"
            >
              Website
              <ExternalLink size={14} />
            </a>
          </div>
        </header>

        <div
          className={`studio-main-content ${
            page === "photography"
              ? "studio-media-content"
              : ""
          }`}
        >
          {page === "overview" && (
            <Overview
              onNavigate={navigate}
              user={user}
            />
          )}

          {page === "photography" && (
            <MediaWorkspace />
          )}

          {page === "account" && (
            <AccountPage
              user={user}
              onSignOut={handleSignOut}
              signingOut={authBusy}
              error={authError}
            />
          )}
        </div>

        <footer className="studio-main-footer">
          <span>GCP Studio</span>
          <span>Built by MNGM Studios</span>
        </footer>
      </main>
    </div>
  );
}
