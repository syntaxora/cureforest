"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Lock, Eye, EyeOff, TreePine, Loader2, UserPlus, LogIn } from "lucide-react"
import { useRouter } from "next/navigation"

type Mode = "login" | "register"

export function AdminLogin() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [hasAdmin, setHasAdmin] = useState<boolean | null>(null)

  useEffect(() => {
    // Check if any admin exists
    fetch("/api/admin/register")
      .then((res) => res.json())
      .then((data) => setHasAdmin(data.hasAdmin))
      .catch(() => setHasAdmin(null))
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "로그인에 실패했습니다.")
      }

      router.push("/cure-mgmt-2410/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "로그인에 실패했습니다.")
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/admin/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, phone }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "회원가입에 실패했습니다.")
      }

      if (data.autoApproved) {
        // First admin - auto login
        setSuccess("첫 번째 관리자로 등록되었습니다. 로그인합니다...")
        setTimeout(() => {
          handleLoginAfterRegister()
        }, 1000)
      } else {
        setSuccess("가입 신청이 완료되었습니다. 기존 관리자의 승인 후 로그인할 수 있습니다.")
        setLoading(false)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "회원가입에 실패했습니다.")
      setLoading(false)
    }
  }

  const handleLoginAfterRegister = async () => {
    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        router.push("/cure-mgmt-2410/dashboard")
      } else {
        setMode("login")
        setLoading(false)
      }
    } catch {
      setMode("login")
      setLoading(false)
    }
  }

  const resetForm = () => {
    setEmail("")
    setPassword("")
    setName("")
    setPhone("")
    setError("")
    setSuccess("")
  }

  const switchMode = (newMode: Mode) => {
    resetForm()
    setMode(newMode)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-sm border-border/60 shadow-lg">
        <CardHeader className="items-center pb-2 pt-8">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary">
            <TreePine className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="font-serif text-xl font-bold text-foreground">
            {"CureForest"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {mode === "login" ? "관리자 로그인" : "관리자 회원가입"}
          </p>
          {hasAdmin === false && mode === "register" && (
            <p className="mt-2 rounded-md bg-primary/10 px-3 py-1.5 text-center text-xs text-primary">
              {"첫 번째 관리자로 가입하면 즉시 활성화됩니다"}
            </p>
          )}
          {hasAdmin === true && mode === "register" && (
            <p className="mt-2 rounded-md bg-muted px-3 py-1.5 text-center text-xs text-muted-foreground">
              {"가입 후 기존 관리자의 승인이 필요합니다"}
            </p>
          )}
        </CardHeader>
        <CardContent className="px-6 pb-8 pt-4">
          {mode === "login" ? (
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  {"이메일"}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@cureforest.kr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  {"비밀번호"}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="비밀번호 입력"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              <Button type="submit" className="mt-2 gap-2" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {"로그인 중..."}
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4" />
                    {"로그인"}
                  </>
                )}
              </Button>

              <div className="mt-2 text-center">
                <button
                  type="button"
                  onClick={() => switchMode("register")}
                  className="text-sm text-muted-foreground hover:text-primary hover:underline"
                >
                  {"계정이 없으신가요? 회원가입"}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  {"이름"}
                  <span className="text-destructive">{" *"}</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="홍길동"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="reg-email" className="text-sm font-medium">
                  {"이메일"}
                  <span className="text-destructive">{" *"}</span>
                </Label>
                <Input
                  id="reg-email"
                  type="email"
                  placeholder="example@cureforest.kr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="reg-password" className="text-sm font-medium">
                  {"비밀번호"}
                  <span className="text-destructive">{" *"}</span>
                </Label>
                <div className="relative">
                  <Input
                    id="reg-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="4자 이상"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={4}
                    autoComplete="new-password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                  {"연락처"}
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="010-0000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                />
              </div>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              {success && (
                <p className="text-sm text-primary">{success}</p>
              )}

              <Button type="submit" className="mt-2 gap-2" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {"처리 중..."}
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" />
                    {"회원가입"}
                  </>
                )}
              </Button>

              <div className="mt-2 text-center">
                <button
                  type="button"
                  onClick={() => switchMode("login")}
                  className="text-sm text-muted-foreground hover:text-primary hover:underline"
                >
                  {"이미 계정이 있으신가요? 로그인"}
                </button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
