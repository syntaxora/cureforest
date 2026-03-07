"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  MessageSquare,
  Search,
  Clock,
  Loader2,
  CheckCircle2,
  XCircle,
  Eye,
  User,
  Phone,
  Mail,
  Building2,
  Tag,
  CalendarDays,
  RefreshCw,
} from "lucide-react";

type InquiryStatus = "pending" | "in_progress" | "completed" | "rejected";

interface Inquiry {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  organization: string | null;
  category_name: string | null;
  title: string;
  content: string;
  status: InquiryStatus;
  admin_note: string | null;
  created_at: string;
  processed_at: string | null;
}

interface InquiryCounts {
  all: number;
  pending: number;
  in_progress: number;
  completed: number;
  rejected: number;
}

const statusConfig: Record<
  InquiryStatus,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    icon: typeof Clock;
  }
> = {
  pending: { label: "처리 전", variant: "outline", icon: Clock },
  in_progress: { label: "처리 중", variant: "secondary", icon: Loader2 },
  completed: { label: "처리 완료", variant: "default", icon: CheckCircle2 },
  rejected: { label: "거부", variant: "destructive", icon: XCircle },
};

export function AdminInquiries() {
  const [loading, setLoading] = useState(true);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [counts, setCounts] = useState<InquiryCounts>({
    all: 0,
    pending: 0,
    in_progress: 0,
    completed: 0,
    rejected: 0,
  });
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [processOpen, setProcessOpen] = useState(false);
  const [processStatus, setProcessStatus] =
    useState<InquiryStatus>("completed");
  const [processNote, setProcessNote] = useState("");
  const [processing, setProcessing] = useState(false);

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus !== "all") params.set("status", filterStatus);
      if (search) params.set("search", search);

      const res = await fetch(`/api/admin/inquiries?${params}`);
      if (res.ok) {
        const data = await res.json();
        setInquiries(data.inquiries || []);
        setCounts(
          data.counts || {
            all: 0,
            pending: 0,
            in_progress: 0,
            completed: 0,
            rejected: 0,
          },
        );
      }
    } catch (error) {
      console.error("Failed to fetch inquiries:", error);
    } finally {
      setLoading(false);
    }
  }, [filterStatus, search]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  function openDetail(inq: Inquiry) {
    setSelectedInquiry(inq);
    setDetailOpen(true);
  }

  function openProcess(inq: Inquiry) {
    setSelectedInquiry(inq);
    setProcessStatus(inq.status === "pending" ? "in_progress" : "completed");
    setProcessNote(inq.admin_note || "");
    setProcessOpen(true);
  }

  async function handleProcess() {
    if (!selectedInquiry) return;
    setProcessing(true);
    try {
      const res = await fetch("/api/admin/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inquiryId: selectedInquiry.id,
          status: processStatus,
          note: processNote,
        }),
      });
      if (res.ok) {
        setProcessOpen(false);
        fetchInquiries();
      } else {
        const data = await res.json();
        alert(data.error || "처리 실패");
      }
    } catch (error) {
      console.error("Failed to process inquiry:", error);
    } finally {
      setProcessing(false);
    }
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("ko-KR");
  };

  return (
    <div className="flex min-h-screen bg-muted/20">
      <AdminSidebar />

      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="border-b border-border bg-card px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {"문의 관리"}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {"접수된 고객 문의를 확인하고 처리 상태를 관리합니다."}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchInquiries}
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
          {/* Status summary */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {(
              [
                {
                  key: "all",
                  label: "전체",
                  count: counts.all,
                  color: "text-foreground",
                },
                {
                  key: "pending",
                  label: "처리 전",
                  count: counts.pending,
                  color: "text-chart-2",
                },
                {
                  key: "in_progress",
                  label: "처리 중",
                  count: counts.in_progress,
                  color: "text-chart-4",
                },
                {
                  key: "completed",
                  label: "처리 완료",
                  count: counts.completed,
                  color: "text-primary",
                },
                {
                  key: "rejected",
                  label: "거부",
                  count: counts.rejected,
                  color: "text-destructive",
                },
              ] as const
            ).map((item) => (
              <button
                key={item.key}
                onClick={() => setFilterStatus(item.key)}
                className={`rounded-xl border p-3 text-left transition-all ${
                  filterStatus === item.key
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border bg-card hover:border-primary/30"
                }`}
              >
                <p className="text-xs font-medium text-muted-foreground">
                  {item.label}
                </p>
                <p className={`text-xl font-bold ${item.color}`}>
                  {item.count}
                </p>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="이름, 제목, 카테고리로 검색..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-card pl-10"
            />
          </div>

          {/* Inquiry list */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {inquiries.length === 0 ? (
                <Card className="border-border/60">
                  <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
                    <MessageSquare className="h-8 w-8 text-muted-foreground/40" />
                    <p className="text-sm text-muted-foreground">
                      {"문의가 없습니다."}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                inquiries.map((inq) => {
                  const status = statusConfig[inq.status];
                  const StatusIcon = status.icon;
                  return (
                    <Card
                      key={inq.id}
                      className="border-border/60 transition-shadow hover:shadow-sm"
                    >
                      <CardContent className="p-5">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          {/* Left: Info */}
                          <div className="flex-1">
                            <div className="mb-1.5 flex flex-wrap items-center gap-2">
                              <Badge variant={status.variant} className="gap-1">
                                <StatusIcon className="h-3 w-3" />
                                {status.label}
                              </Badge>
                              {inq.category_name && (
                                <Badge
                                  variant="outline"
                                  className="gap-1 text-xs"
                                >
                                  <Tag className="h-3 w-3" />
                                  {inq.category_name}
                                </Badge>
                              )}
                            </div>
                            <h3 className="mb-1 font-medium text-foreground">
                              {inq.title}
                            </h3>
                            <p className="line-clamp-2 text-sm text-muted-foreground">
                              {inq.content}
                            </p>
                            <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {inq.name}
                              </span>
                              <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {inq.phone}
                              </span>
                              {inq.organization && (
                                <span className="flex items-center gap-1">
                                  <Building2 className="h-3 w-3" />
                                  {inq.organization}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <CalendarDays className="h-3 w-3" />
                                {formatDate(inq.created_at)}
                              </span>
                            </div>
                            {inq.admin_note && (
                              <div className="mt-2 rounded-lg bg-secondary/50 px-3 py-2 text-xs text-secondary-foreground">
                                <span className="font-medium">
                                  {"관리자 메모: "}
                                </span>
                                {inq.admin_note}
                              </div>
                            )}
                          </div>

                          {/* Right: Actions */}
                          <div className="flex shrink-0 gap-2 sm:flex-col">
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1.5"
                              onClick={() => openDetail(inq)}
                            >
                              <Eye className="h-3.5 w-3.5" />
                              {"상세"}
                            </Button>
                            <Button
                              size="sm"
                              className="gap-1.5"
                              onClick={() => openProcess(inq)}
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              {"처리"}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          )}
        </div>
      </main>

      {/* Detail dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              {"문의 상세"}
            </DialogTitle>
          </DialogHeader>
          {selectedInquiry && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant={statusConfig[selectedInquiry.status].variant}>
                  {statusConfig[selectedInquiry.status].label}
                </Badge>
                {selectedInquiry.category_name && (
                  <Badge variant="outline">
                    {selectedInquiry.category_name}
                  </Badge>
                )}
              </div>

              <h3 className="font-serif text-lg font-bold text-foreground">
                {selectedInquiry.title}
              </h3>

              <div className="grid grid-cols-2 gap-3 rounded-xl bg-secondary/50 p-4 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedInquiry.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedInquiry.phone}</span>
                </div>
                {selectedInquiry.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedInquiry.email}</span>
                  </div>
                )}
                {selectedInquiry.organization && (
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedInquiry.organization}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span>{formatDate(selectedInquiry.created_at)}</span>
                </div>
              </div>

              <div className="rounded-xl border border-border p-4">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                  {selectedInquiry.content}
                </p>
              </div>

              {selectedInquiry.admin_note && (
                <div className="rounded-xl bg-primary/5 border border-primary/20 p-4">
                  <p className="mb-1 text-xs font-semibold text-primary">
                    {"관리자 메모"}
                  </p>
                  <p className="text-sm text-foreground">
                    {selectedInquiry.admin_note}
                  </p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDetailOpen(false);
                if (selectedInquiry) openProcess(selectedInquiry);
              }}
            >
              {"상태 변경하기"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Process dialog */}
      <Dialog open={processOpen} onOpenChange={setProcessOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{"문의 처리"}</DialogTitle>
          </DialogHeader>
          {selectedInquiry && (
            <div className="flex flex-col gap-5">
              <div className="rounded-xl bg-secondary/50 p-4">
                <p className="text-sm font-medium text-foreground">
                  {selectedInquiry.title}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {selectedInquiry.name} |{" "}
                  {formatDate(selectedInquiry.created_at)}
                </p>
              </div>

              <div className="flex flex-col gap-2.5">
                <label className="text-sm font-semibold text-foreground">
                  {"처리 상태"}
                </label>
                <Select
                  value={processStatus}
                  onValueChange={(v) => setProcessStatus(v as InquiryStatus)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">{"처리 전"}</SelectItem>
                    <SelectItem value="in_progress">{"처리 중"}</SelectItem>
                    <SelectItem value="completed">{"처리 완료"}</SelectItem>
                    <SelectItem value="rejected">{"거부"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2.5">
                <label className="text-sm font-semibold text-foreground">
                  {"처리 사유 / 메모"}
                </label>
                <Textarea
                  placeholder="처리 내용이나 거부 사유를 입력하세요..."
                  value={processNote}
                  onChange={(e) => setProcessNote(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setProcessOpen(false)}>
              {"취소"}
            </Button>
            <Button onClick={handleProcess} disabled={processing}>
              {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {"저장"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
