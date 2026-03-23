import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "개인정보처리방침 | CureForest 큐어포레스트",
  description: "큐어포레스트의 개인정보처리방침을 안내합니다.",
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-20">
        {/* Hero Section */}
        <section className="bg-primary/5 py-16">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <h1 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
              개인정보처리방침
            </h1>
            <p className="mt-4 text-muted-foreground">
              큐어포레스트는 이용자의 개인정보를 소중히 여기며, 관련 법령을 준수합니다.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16">
          <div className="mx-auto max-w-4xl px-6">
            <div className="prose prose-gray max-w-none">
              {/* 제1조 */}
              <article className="mb-12">
                <h2 className="mb-4 text-xl font-bold text-foreground">제1조 (개인정보의 처리 목적)</h2>
                <p className="mb-4 leading-relaxed text-muted-foreground">
                  큐어포레스트(이하 &quot;회사&quot;)는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
                </p>
                <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                  <li>프로그램 예약 및 서비스 제공: 프로그램 예약 접수, 예약 확인, 서비스 제공, 고객 문의 응대</li>
                  <li>마케팅 및 광고 활용: 이벤트 및 프로모션 정보 제공 (동의한 경우에 한함)</li>
                  <li>서비스 개선: 서비스 이용 통계 분석, 서비스 품질 향상</li>
                </ul>
              </article>

              {/* 제2조 */}
              <article className="mb-12">
                <h2 className="mb-4 text-xl font-bold text-foreground">제2조 (개인정보의 처리 및 보유 기간)</h2>
                <p className="mb-4 leading-relaxed text-muted-foreground">
                  회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
                </p>
                <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                  <li>프로그램 예약 정보: 예약 완료일로부터 1년</li>
                  <li>문의 내역: 문의 처리 완료일로부터 3년</li>
                  <li>마케팅 동의 정보: 동의 철회 시까지</li>
                </ul>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  다만, 관계 법령의 규정에 의하여 보존할 필요가 있는 경우 회사는 아래와 같이 관계 법령에서 정한 일정한 기간 동안 개인정보를 보관합니다.
                </p>
                <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                  <li>계약 또는 청약철회 등에 관한 기록: 5년 (전자상거래 등에서의 소비자보호에 관한 법률)</li>
                  <li>대금결제 및 재화 등의 공급에 관한 기록: 5년 (전자상거래 등에서의 소비자보호에 관한 법률)</li>
                  <li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년 (전자상거래 등에서의 소비자보호에 관한 법률)</li>
                </ul>
              </article>

              {/* 제3조 */}
              <article className="mb-12">
                <h2 className="mb-4 text-xl font-bold text-foreground">제3조 (처리하는 개인정보의 항목)</h2>
                <p className="mb-4 leading-relaxed text-muted-foreground">
                  회사는 다음의 개인정보 항목을 처리하고 있습니다.
                </p>
                <div className="mb-4">
                  <h3 className="mb-2 font-semibold text-foreground">필수 항목</h3>
                  <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                    <li>프로그램 예약: 이름, 연락처(휴대전화번호), 이메일 주소</li>
                    <li>문의하기: 이름, 연락처, 이메일 주소, 문의 내용</li>
                  </ul>
                </div>
                <div>
                  <h3 className="mb-2 font-semibold text-foreground">선택 항목</h3>
                  <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                    <li>소속(회사/단체명), 참가 인원, 희망 일정, 추가 요청사항</li>
                  </ul>
                </div>
              </article>

              {/* 제4조 */}
              <article className="mb-12">
                <h2 className="mb-4 text-xl font-bold text-foreground">제4조 (개인정보의 제3자 제공)</h2>
                <p className="leading-relaxed text-muted-foreground">
                  회사는 정보주체의 개인정보를 제1조(개인정보의 처리 목적)에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등 개인정보 보호법 제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.
                </p>
              </article>

              {/* 제5조 */}
              <article className="mb-12">
                <h2 className="mb-4 text-xl font-bold text-foreground">제5조 (개인정보처리의 위탁)</h2>
                <p className="leading-relaxed text-muted-foreground">
                  회사는 원활한 개인정보 업무처리를 위하여 필요한 경우 개인정보 처리업무를 외부에 위탁할 수 있습니다. 위탁 계약 시 개인정보가 안전하게 관리될 수 있도록 필요한 사항을 규정하고 있으며, 위탁업무의 내용이나 수탁자가 변경될 경우 지체없이 본 개인정보 처리방침을 통하여 공개하겠습니다.
                </p>
              </article>

              {/* 제6조 */}
              <article className="mb-12">
                <h2 className="mb-4 text-xl font-bold text-foreground">제6조 (정보주체의 권리·의무 및 행사방법)</h2>
                <p className="mb-4 leading-relaxed text-muted-foreground">
                  정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.
                </p>
                <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                  <li>개인정보 열람 요구</li>
                  <li>오류 등이 있을 경우 정정 요구</li>
                  <li>삭제 요구</li>
                  <li>처리정지 요구</li>
                </ul>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  권리 행사는 회사에 대해 서면, 전자우편 등을 통하여 하실 수 있으며 회사는 이에 대해 지체없이 조치하겠습니다.
                </p>
              </article>

              {/* 제7조 */}
              <article className="mb-12">
                <h2 className="mb-4 text-xl font-bold text-foreground">제7조 (개인정보의 파기)</h2>
                <p className="mb-4 leading-relaxed text-muted-foreground">
                  회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.
                </p>
                <div className="mb-4">
                  <h3 className="mb-2 font-semibold text-foreground">파기 절차</h3>
                  <p className="text-muted-foreground">
                    불필요한 개인정보는 개인정보의 처리가 불필요한 것으로 인정되는 날로부터 5일 이내에 그 개인정보를 파기합니다.
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 font-semibold text-foreground">파기 방법</h3>
                  <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                    <li>전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용합니다.</li>
                    <li>종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각을 통하여 파기합니다.</li>
                  </ul>
                </div>
              </article>

              {/* 제8조 */}
              <article className="mb-12">
                <h2 className="mb-4 text-xl font-bold text-foreground">제8조 (개인정보의 안전성 확보조치)</h2>
                <p className="mb-4 leading-relaxed text-muted-foreground">
                  회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.
                </p>
                <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                  <li>관리적 조치: 내부관리계획 수립·시행, 정기적 직원 교육</li>
                  <li>기술적 조치: 개인정보처리시스템 등의 접근권한 관리, 접근통제시스템 설치, 개인정보의 암호화, 보안프로그램 설치</li>
                  <li>물리적 조치: 전산실, 자료보관실 등의 접근통제</li>
                </ul>
              </article>

              {/* 제9조 */}
              <article className="mb-12">
                <h2 className="mb-4 text-xl font-bold text-foreground">제9조 (개인정보 보호책임자)</h2>
                <p className="mb-4 leading-relaxed text-muted-foreground">
                  회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
                </p>
                <div className="rounded-lg bg-muted/50 p-6">
                  <h3 className="mb-3 font-semibold text-foreground">개인정보 보호책임자</h3>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>성명: 큐어포레스트 대표</li>
                    <li>이메일: cureforest@naver.com</li>
                  </ul>
                </div>
              </article>

              {/* 제10조 */}
              <article className="mb-12">
                <h2 className="mb-4 text-xl font-bold text-foreground">제10조 (개인정보 처리방침 변경)</h2>
                <p className="leading-relaxed text-muted-foreground">
                  이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
                </p>
                <p className="mt-4 text-sm text-muted-foreground">
                  본 방침은 2026년 1월 1일부터 시행됩니다.
                </p>
              </article>

              {/* 제11조 */}
              <article>
                <h2 className="mb-4 text-xl font-bold text-foreground">제11조 (권익침해 구제방법)</h2>
                <p className="mb-4 leading-relaxed text-muted-foreground">
                  정보주체는 개인정보침해로 인한 구제를 받기 위하여 개인정보분쟁조정위원회, 한국인터넷진흥원 개인정보침해신고센터 등에 분쟁해결이나 상담 등을 신청할 수 있습니다.
                </p>
                <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                  <li>개인정보분쟁조정위원회: (국번없이) 1833-6972 (www.kopico.go.kr)</li>
                  <li>개인정보침해신고센터: (국번없이) 118 (privacy.kisa.or.kr)</li>
                  <li>대검찰청: (국번없이) 1301 (www.spo.go.kr)</li>
                  <li>경찰청: (국번없이) 182 (ecrm.cyber.go.kr)</li>
                </ul>
              </article>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
