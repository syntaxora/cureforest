"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  ClipboardList,
  Users,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Loader2,
  RefreshCw,
} from "lucide-react";

interface DashboardStats {
  todayReservations: number;
  weekSchedules: number;
  monthParticipants: number;
  conversionRate: number;
}

interface RecentReservation {
  id: number;
  name: string;
  program_title: string;
  date: string;
  participants: number;
  status: string;
}

interface UpcomingSchedule {
  id: number;
  program_title: string;
  location_name: string;
  schedule_date: string;
  reserved_count: number;
  capacity: number;
}

interface InquiryCounts {
  all: number;
  pending: number;
  in_progress: number;
  completed: number;
  rejected: number;
}

const statusConfig: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  pending: { label: "대기", variant: "outline" },
  confirmed: { label: "확정", variant: "default" },
  cancelled: { label: "취소", variant: "destructive" },
  completed: { label: "완료", variant: "secondary" },
};

export function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    todayReservations: 0,
    weekSchedules: 0,
    monthParticipants: 0,
    conversionRate: 0,
  });
  const [recentReservations, setRecentReservations] = useState<
    RecentReservation[]
  >([]);
  const [upcomingSchedules, setUpcomingSchedules] = useState<
    UpcomingSchedule[]
  >([]);
  const [inquiryCounts, setInquiryCounts] = useState<InquiryCounts>({
    all: 0,
    pending: 0,
    in_progress: 0,
    completed: 0,
    rejected: 0,
  });

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/dashboard");
      if (res.ok) {
        const data = await res.json();
        setStats(
          data.stats || {
            todayReservations: 0,
            weekSchedules: 0,
            monthParticipants: 0,
            conversionRate: 0,
          },
        );
        setRecentReservations(data.recentReservations || []);
        setUpcomingSchedules(data.upcomingSchedules || []);
        setInquiryCounts(
          data.inquiryCounts || {
            all: 0,
            pending: 0,
            in_progress: 0,
            completed: 0,
            rejected: 0,
          },
        );
      }
    } catch (error) {
      console.error("Failed to fetch dashboard:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const statCards = [
    {
      label: "오늘 예약",
      value: String(stats.todayReservations),
      icon: ClipboardList,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "이번 주 일정",
      value: String(stats.weekSchedules),
      icon: CalendarDays,
      color: "text-chart-2",
      bg: "bg-chart-2/10",
    },
    {
      label: "이번 달 참가자",
      value: String(stats.monthParticipants),
      icon: Users,
      color: "text-chart-4",
      bg: "bg-chart-4/10",
    },
    {
      label: "미처리 문의",
      value: String(inquiryCounts.pending),
      icon: MessageSquare,
      color: "text-chart-5",
      bg: "bg-chart-5/10",
    },
  ];

  return (
    <div className="flex min-h-screen bg-muted/20">
      <AdminSidebar />

      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="border-b border-border bg-card px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {"대시보드"}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {"CureForest 관리자 대시보드에 오신 것을 환영합니다."}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchDashboard}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-6 px-8 py-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <Card key={stat.label} className="border-border/60">
                      <CardContent className="flex items-center gap-4 p-5">
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${stat.bg}`}
                        >
                          <Icon className={`h-5 w-5 ${stat.color}`} />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">
                            {stat.label}
                          </p>
                          <p className="text-2xl font-bold text-foreground">
                            {stat.value}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="grid gap-6 lg:grid-cols-5">
                {/* Recent Reservations */}
                <Card className="border-border/60 lg:col-span-3">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <ClipboardList className="h-4 w-4 text-primary" />
                      {"최근 예약"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-6 pb-4">
                    {recentReservations.length === 0 ? (
                      <div className="flex flex-col items-center gap-2 py-8 text-center">
                        <ClipboardList className="h-8 w-8 text-muted-foreground/40" />
                        <p className="text-sm text-muted-foreground">
                          {"최근 예약이 없습니다."}
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col divide-y divide-border">
                        {recentReservations.map((res) => {
                          const status =
                            statusConfig[res.status] || statusConfig.pending;
                          const displayName = res.name || "익명";
                          return (
                            <div
                              key={res.id}
                              className="flex items-center justify-between py-3"
                            >
                              <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
                                  {displayName.charAt(0)}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-foreground">
                                    {displayName}
                                    <span className="ml-2 text-muted-foreground">
                                      ({res.participants || 1}
                                      {"명"})
                                    </span>
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {res.program_title || "프로그램"}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-xs text-muted-foreground">
                                  {res.date || "-"}
                                </span>
                                <Badge variant={status.variant}>
                                  {status.label}
                                </Badge>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Upcoming Schedules */}
                <Card className="border-border/60 lg:col-span-2">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <CalendarDays className="h-4 w-4 text-primary" />
                      {"다가오는 일정"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3 px-6 pb-4">
                    {upcomingSchedules.length === 0 ? (
                      <div className="flex flex-col items-center gap-2 py-8 text-center">
                        <CalendarDays className="h-8 w-8 text-muted-foreground/40" />
                        <p className="text-sm text-muted-foreground">
                          {"예정된 일정이 없습니다."}
                        </p>
                      </div>
                    ) : (
                      upcomingSchedules.map((schedule) => {
                        const isFull =
                          schedule.reserved_count >= schedule.capacity;
                        const percentage = Math.round(
                          (schedule.reserved_count / schedule.capacity) * 100,
                        );
                        return (
                          <div
                            key={schedule.id}
                            className="rounded-lg border border-border/60 p-3"
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="text-sm font-medium text-foreground">
                                  {schedule.program_title}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {schedule.location_name}
                                </p>
                              </div>
                              {isFull ? (
                                <Badge variant="destructive" className="gap-1">
                                  <AlertCircle className="h-3 w-3" />
                                  {"마감"}
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="gap-1">
                                  <CheckCircle2 className="h-3 w-3" />
                                  {"접수중"}
                                </Badge>
                              )}
                            </div>
                            <div className="mt-2 flex items-center gap-2">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {schedule.schedule_date}
                              </span>
                            </div>
                            {/* Progress bar */}
                            <div className="mt-2">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">
                                  {schedule.reserved_count}/{schedule.capacity}
                                  {"명"}
                                </span>
                                <span
                                  className={
                                    isFull
                                      ? "font-medium text-destructive"
                                      : "text-muted-foreground"
                                  }
                                >
                                  {percentage}%
                                </span>
                              </div>
                              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-secondary">
                                <div
                                  className={`h-full rounded-full transition-all ${isFull ? "bg-destructive" : "bg-primary"}`}
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
