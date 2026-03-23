import { useState, useEffect } from "react";
import api from "../../../api";
import InterviewCard from "./InterviewCard";
import SavedInterviewCard from "./SavedInterviewCard";
import InterviewDetailsView from "./InterviewDetailsView";
import VerifiedDashboardHeader from "./VerifiedDashboardHeader";
import {
  saveInterviewSlot,
  getSavedInterviewSlots,
  removeSavedInterviewSlot,
} from "@/services/interviewPrepService";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Interview {
  id: string;
  job_role?: string;
  title: string;
  experience: string;
  date: string;
  time: string;
  credits?: number;
  priority?: string;
  interview_slot_id?: string;
  interview_schedule_id?: string;
  start_time_utc?: string;
  end_time_utc?: string;
  skills?: string[];
  resume_url?: string;
  interview_code?: string;
  interview_mode?: string;
  candidate_id?: string | number;
  is_payment_done?: boolean;
  saved_slot_id?: string | number;
}

interface VerifiedDashboardProps {
  onViewDetails?: (
    interview: Interview,
    type: "scheduled" | "available" | "saved"
  ) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Pull auth info from localStorage once */
function getAuth() {
  const parsed = JSON.parse(localStorage.getItem("user") || "{}");
  return {
    token: parsed?.token || localStorage.getItem("token") || "",
    userId:
      parsed?.user_id ||
      parsed?.userId ||
      parsed?.id ||
      localStorage.getItem("user_id") ||
      "",
  };
}

/** Normalise a raw API slot object into our Interview shape */
function normalizeSlot(raw: Record<string, unknown>): Interview {
  const get = (k: string) => raw[k];

  const startRaw =
    get("start_time_utc") ?? get("start_time") ?? get("startTime") ?? null;
  const endRaw =
    get("end_time_utc") ?? get("end_time") ?? get("endTime") ?? null;

  const fmtDate = (v: unknown) =>
    v
      ? new Date(v as string).toLocaleDateString(undefined, {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "";

  const fmtTime = (v: unknown) =>
    v
      ? new Date(v as string).toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      : "";

  return {
    id: String(
      get("id") ??
        get("_id") ??
        get("interview_slot_id") ??
        get("slotId") ??
        Math.random()
    ),
    interview_slot_id: String(
      get("interview_slot_id") ??
        get("interviewSlotId") ??
        get("slotId") ??
        get("slot_id") ??
        get("id") ??
        ""
    ),
    interview_schedule_id: String(
      get("interview_schedule_id") ??
        get("interviewScheduleId") ??
        get("scheduleId") ??
        ""
    ),
    job_role: (get("job_role") ?? get("title") ?? get("role")) as
      | string
      | undefined,
    title: String(
      get("job_role") ?? get("title") ?? get("role") ?? "Interview"
    ),
    experience: String(get("experience") ?? get("experienceLevel") ?? ""),
    date: startRaw ? fmtDate(startRaw) : String(get("date") ?? ""),
    time: startRaw
      ? `${fmtTime(startRaw)}${endRaw ? " - " + fmtTime(endRaw) : ""}`
      : String(get("time") ?? ""),
    start_time_utc: (startRaw ?? undefined) as string | undefined,
    end_time_utc: (endRaw ?? undefined) as string | undefined,
    skills: (get("skills") ?? []) as string[],
    resume_url: (get("resume_url") ?? get("resumeUrl")) as string | undefined,
    interview_code: (get("interview_code") ?? get("code")) as
      | string
      | undefined,
    interview_mode: (get("interview_mode") ?? get("mode")) as
      | string
      | undefined,
    candidate_id: (get("candidate_id") ?? get("candidateId")) as
      | string
      | number
      | undefined,
    is_payment_done: (get("is_payment_done") ?? get("isPaymentDone")) as
      | boolean
      | undefined,
    credits: (get("credits") ?? get("credit")) as number | undefined,
    priority: get("priority") as string | undefined,
  };
}

/** Normalise a saved-slot API item (may be nested under interview_slot key) */
function normalizeSavedItem(item: Record<string, unknown>): Interview {
  const slot = (item.interview_slot as Record<string, unknown>) ?? item;
  const base = normalizeSlot(slot);
  return {
    ...base,
    saved_slot_id: (item.saved_slot_id ?? item.id ?? slot.saved_slot_id) as
      | string
      | number
      | undefined,
  };
}

/** Drop interviews whose end (or start) time is already in the past */
function filterFuture(interviews: Interview[]): Interview[] {
  const now = Date.now();
  return interviews.filter((i) => {
    const ref = i.end_time_utc ?? i.start_time_utc;
    return ref ? new Date(ref).getTime() >= now : true;
  });
}

/** Fetch a list from the API and map each item through a normaliser */
async function fetchList(
  path: string,
  token: string,
  extractArray: (data: unknown) => unknown[]
): Promise<Interview[]> {
  const res = await api.get(path, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  const data = res?.data ?? [];
  const arr = extractArray(data);
  return filterFuture(
    arr.map((item) => normalizeSlot(item as Record<string, unknown>))
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

const VerifiedDashboard = ({
  onViewDetails: externalOnViewDetails,
}: VerifiedDashboardProps) => {
  // ── UI state ──────────────────────────────────────────────────────────────
  const [showAllScheduled, setShowAllScheduled] = useState(false);
  const [showAllAvailable, setShowAllAvailable] = useState(true);
  const [showAllSaved, setShowAllSaved] = useState(false);

  // ── Detail view state ──────────────────────────────────────────────────────
  const [selectedInterview, setSelectedInterview] =
    useState<Interview | null>(null);
  const [viewType, setViewType] = useState<
    "scheduled" | "available" | "saved" | null
  >(null);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);

  // ── Data state ──────────────────────────────────────────────────────────────
  const [scheduledInterviews, setScheduledInterviews] = useState<Interview[]>(
    []
  );
  const [isScheduledLoading, setIsScheduledLoading] = useState(false);
  const [scheduledError, setScheduledError] = useState<string | null>(null);

  const [availableInterviews, setAvailableInterviews] = useState<Interview[]>(
    []
  );
  const [isAvailableLoading, setIsAvailableLoading] = useState(false);
  const [availableError, setAvailableError] = useState<string | null>(null);

  const [savedInterviews, setSavedInterviews] = useState<Interview[]>([]);
  const [isSavedLoading, setIsSavedLoading] = useState(false);
  const [savedError, setSavedError] = useState<string | null>(null);

  // ── API 1: Available interview slots ──────────────────────────────────────
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setIsAvailableLoading(true);
      setAvailableError(null);
      try {
        const { token } = getAuth();
        const interviews = await fetchList(
          "/users/mock-interview/interview-slots",
          token,
          (data) =>
            Array.isArray(data)
              ? data
              : Array.isArray((data as any).slots)
              ? (data as any).slots
              : []
        );
        if (mounted) setAvailableInterviews(interviews);
      } catch (err) {
        if (mounted)
          setAvailableError(
            (err as Error)?.message ?? "Failed to load available interviews"
          );
      } finally {
        if (mounted) setIsAvailableLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  // ── API 2: Saved interview slots ──────────────────────────────────────────
  const loadSaved = async () => {
    setIsSavedLoading(true);
    setSavedError(null);
    try {
      const { token, userId } = getAuth();
      if (!userId || !token) {
        setSavedInterviews([]);
        return;
      }
      const data = await getSavedInterviewSlots(userId, token);
      const items: unknown[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.saved_interview_slots)
        ? data.saved_interview_slots
        : [];
      const mapped = filterFuture(
        items.map((i) =>
          normalizeSavedItem(i as Record<string, unknown>)
        )
      );
      setSavedInterviews(mapped);
    } catch (err) {
      setSavedError(
        (err as Error)?.message ?? "Failed to load saved interviews"
      );
    } finally {
      setIsSavedLoading(false);
    }
  };

  useEffect(() => {
    loadSaved();
  }, []);

  // ── API 3: Scheduled interviews ───────────────────────────────────────────
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setIsScheduledLoading(true);
      setScheduledError(null);
      try {
        const { token, userId } = getAuth();
        const path = userId
          ? `/users/${userId}/mock-interview/interview-schedule`
          : `/users/mock-interview/interview-schedule`;
        const interviews = await fetchList(path, token, (data) =>
          Array.isArray(data)
            ? data
            : Array.isArray((data as any).schedules)
            ? (data as any).schedules
            : Array.isArray((data as any).slots)
            ? (data as any).slots
            : []
        );
        if (mounted) setScheduledInterviews(interviews);
      } catch (err) {
        if (mounted)
          setScheduledError(
            (err as Error)?.message ?? "Failed to load scheduled interviews"
          );
      } finally {
        if (mounted) setIsScheduledLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleViewDetails = async (
    interview: Interview,
    type: "scheduled" | "available" | "saved"
  ) => {
    // Saved items can be shown immediately without an extra fetch
    if (type === "saved") {
      setSelectedInterview(interview);
      setViewType(type);
      externalOnViewDetails?.(interview, type);
      return;
    }

    setDetailsError(null);
    setIsDetailsLoading(true);
    setViewType(type); // Show loading screen immediately

    try {
      const { token, userId } = getAuth();
      const slotId =
        type === "scheduled"
          ? interview.interview_schedule_id || interview.id
          : interview.interview_slot_id || interview.id;

      const path =
        type === "scheduled"
          ? userId
            ? `/users/${userId}/mock-interview/interview-schedule/${slotId}`
            : `/users/mock-interview/interview-schedule/${slotId}`
          : `/mock-interview/interview-slot/${slotId}`;

      const res = await api.get(path, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const raw = res?.data ?? res;
      const slot = Array.isArray(raw) ? raw[0] : raw;
      const detailed = normalizeSlot(slot as Record<string, unknown>);

      setSelectedInterview(detailed);
      externalOnViewDetails?.(detailed, type);
    } catch (err) {
      setDetailsError(
        (err as Error)?.message ?? "Failed to load interview details"
      );
    } finally {
      setIsDetailsLoading(false);
    }
  };

  const handleBack = () => {
    setSelectedInterview(null);
    setViewType(null);
    setDetailsError(null);
  };

  const handleBookInterview = () => {
    setSelectedInterview(null);
    setViewType(null);
  };

  const handleToggleSaveInterview = async (interview: Interview) => {
    const alreadySaved = savedInterviews.some(
      (s) =>
        s.interview_slot_id === (interview.interview_slot_id ?? interview.id) ||
        s.id === interview.id
    );

    if (alreadySaved) {
      setSavedInterviews((prev) =>
        prev.filter(
          (s) =>
            !(
              s.interview_slot_id ===
                (interview.interview_slot_id ?? interview.id) ||
              s.id === interview.id
            )
        )
      );
      return;
    }

    const { token, userId } = getAuth();
    const slotId = interview.interview_slot_id ?? interview.id;

    if (userId && token) {
      try {
        await saveInterviewSlot(userId, token, {
          interview_slot_id: Number(slotId),
          interview_priority: interview.priority ?? "normal",
        });
        await loadSaved();
      } catch (err) {
        console.error("Failed to save interview slot:", err);
        setSavedInterviews((prev) => [...prev, interview]);
      }
    } else {
      setSavedInterviews((prev) => [...prev, interview]);
    }
  };

  const handleRemoveSaved = async (
    interview: Interview,
    index: number
  ) => {
    const { token, userId } = getAuth();
    const resolvedSavedSlotId =
      (savedInterviews[index] as any)?.saved_slot_id ??
      interview.saved_slot_id ??
      interview.id;

    try {
      if (userId && token && resolvedSavedSlotId) {
        await removeSavedInterviewSlot(userId, token, resolvedSavedSlotId);
      }
    } catch (err) {
      console.error("Failed to remove saved slot:", err);
    } finally {
      await loadSaved();
    }
  };

  const isInterviewSaved = (id: string) =>
    savedInterviews.some((s) => s.id === id);

  // ── Sliced lists for "show more" ───────────────────────────────────────────
  const displayedScheduled = showAllScheduled
    ? scheduledInterviews
    : scheduledInterviews.slice(0, 2);
  const displayedAvailable = showAllAvailable
    ? availableInterviews
    : availableInterviews.slice(0, 2);
  const displayedSaved = showAllSaved
    ? savedInterviews
    : savedInterviews.slice(0, 2);

  // ── Render: loading / error / detail view ─────────────────────────────────
  if (isDetailsLoading && viewType) {
    return (
      <div className="space-y-6">
        <VerifiedDashboardHeader onBack={handleBack} title="Take Mock Interview" />
        <div className="p-6">
          <p className="text-sm text-gray-500">Loading interview details…</p>
        </div>
      </div>
    );
  }

  if (detailsError && viewType) {
    return (
      <div className="space-y-6">
        <VerifiedDashboardHeader onBack={handleBack} title="Take Mock Interview" />
        <div className="p-6">
          <p className="text-sm text-red-500">{detailsError}</p>
        </div>
      </div>
    );
  }

  if (selectedInterview && viewType) {
    return (
      <div className="space-y-6">
        <VerifiedDashboardHeader onBack={handleBack} title="Take Mock Interview" />
        <InterviewDetailsView
          interview={selectedInterview}
          viewType={viewType}
          onBack={handleBack}
          savedInterviews={savedInterviews}
          showAllSaved={showAllSaved}
          onToggleSaved={() => setShowAllSaved((v) => !v)}
          onViewDetails={handleViewDetails}
          onBook={handleBookInterview}
          onToggleSaveInterview={handleToggleSaveInterview}
          isInterviewSaved={isInterviewSaved(selectedInterview.id)}
        />
      </div>
    );
  }

  // ── Render: main dashboard ─────────────────────────────────────────────────

  const CollapseButton = ({
    expanded,
    onToggle,
  }: {
    expanded: boolean;
    onToggle: () => void;
  }) => (
    <button
      onClick={onToggle}
      className="text-gray-400 hover:text-gray-600 transition-colors"
    >
      <svg
        className={`w-5 h-5 transition-transform ${expanded ? "rotate-0" : "rotate-180"}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 15l7-7 7 7"
        />
      </svg>
    </button>
  );

  const SectionBody = ({
    isLoading,
    error,
    empty,
    children,
  }: {
    isLoading: boolean;
    error: string | null;
    empty: boolean;
    children: React.ReactNode;
  }) => {
    if (isLoading) return <p className="text-sm text-gray-500">Loading…</p>;
    if (error) return <p className="text-sm text-red-500">{error}</p>;
    if (empty)
      return <p className="text-sm text-gray-500">No interviews found</p>;
    return <>{children}</>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-[#FFF5F0] text-[#FF8351] hover:bg-[#FF8351] hover:text-white transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            Take Mock Interview
          </h1>
        </div>
        <div className="flex items-center gap-2 bg-white rounded-md px-4 py-3 text-sm text-gray-700">
          <div className="w-3 h-3 bg-green-500 rounded-full" />
          <span className="font-medium">You are verified as Interviewer</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main column */}
        <div className="flex-1 space-y-6">
          {/* Scheduled Interviews */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-5 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-medium text-[#FF8351]">
                Scheduled Interview(s)
              </h2>
              <CollapseButton
                expanded={showAllScheduled}
                onToggle={() => setShowAllScheduled((v) => !v)}
              />
            </div>
            <div className="p-5 space-y-4">
              <SectionBody
                isLoading={isScheduledLoading}
                error={scheduledError}
                empty={displayedScheduled.length === 0}
              >
                {displayedScheduled.map((interview, i) => (
                  <InterviewCard
                    key={interview.id ?? i}
                    interview={interview}
                    isScheduled
                    onViewDetails={() =>
                      handleViewDetails(interview, "scheduled")
                    }
                  />
                ))}
              </SectionBody>
            </div>
          </div>

          {/* Available Interviews */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-5 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-medium text-[#FF8351]">
                Available Interview(s)
              </h2>
              <CollapseButton
                expanded={showAllAvailable}
                onToggle={() => setShowAllAvailable((v) => !v)}
              />
            </div>
            <div className="p-5 space-y-4">
              <SectionBody
                isLoading={isAvailableLoading}
                error={availableError}
                empty={displayedAvailable.length === 0}
              >
                {displayedAvailable.map((interview, i) => (
                  <InterviewCard
                    key={interview.id ?? i}
                    interview={interview}
                    isScheduled={false}
                    onViewDetails={() =>
                      handleViewDetails(interview, "available")
                    }
                  />
                ))}
              </SectionBody>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 space-y-4">
          {/* Credits */}
          <div className="bg-[#FFF9F0] rounded-lg p-4 flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
              W
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">
                100 Credit(s) available
              </p>
              <a href="#" className="text-sm text-[#FF8351] font-medium">
                Redeem in store →
              </a>
            </div>
          </div>

          {/* Saved Interviews */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-base font-medium text-[#FF8351]">
                Saved Interview(s)
              </h2>
              <CollapseButton
                expanded={showAllSaved}
                onToggle={() => setShowAllSaved((v) => !v)}
              />
            </div>
            <div className="p-4 space-y-3">
              <SectionBody
                isLoading={isSavedLoading}
                error={savedError}
                empty={displayedSaved.length === 0}
              >
                {displayedSaved.map((interview, i) => (
                  <SavedInterviewCard
                    key={interview.id ?? i}
                    interview={interview}
                    onViewDetails={() =>
                      handleViewDetails(interview, "saved")
                    }
                    onRemove={(payload) =>
                      handleRemoveSaved(
                        payload as unknown as Interview,
                        i
                      )
                    }
                  />
                ))}
              </SectionBody>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifiedDashboard;