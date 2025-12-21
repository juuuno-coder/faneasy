"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle, Minus, Plus } from "lucide-react";

const faqs = [
  {
    question: "홈페이지는 어떻게 구매하나요?",
    answer:
      "프리미엄 템플릿을 선택하시고 요청사항란에 원하시는 내용을 자유롭게 입력해주세요. 결제 후 로고나 사진등을 전달해주시면, 즉시 런칭 가능한 상태로 전문 개발팀이 세팅해 드립니다.",
  },
  {
    question: "코딩이나 디자인을 전혀 몰라도 운영할 수 있나요?",
    answer:
      "물론입니다. 복잡한 코딩과 유지보수는 저희 기술팀이 전담합니다. 대표님은 제공해드리는 관리자 페이지에서 블로그 글을 쓰듯이 쉽고 편하게 내용을 수정하고 고객을 관리하실 수 있습니다.",
  },
  {
    question: "월 관리비에는 어떤 서비스가 포함되나요?",
    answer:
      "홈페이지 운영에 필수적인 고성능 서버 호스팅, 보안 인증서(SSL), 도메인 연결 유지 비용이 포함되어 있습니다. 또한 매월 1~4회 텍스트나 이미지 교체 등 간단한 유지보수 서비스도 제공해 드립니다.",
  },
  {
    question: "기존에 구매한 도메인을 연결할 수 있나요?",
    answer:
      "네, 가능합니다! 가지고 계신 도메인 정보를 알려주시면 저희가 기술적인 연결 작업을 모두 대행해 드립니다. 도메인이 없으신 경우 구매 가이드도 제공해 드립니다.",
  },
  {
    question: "고객 문의(DB)가 들어오면 어떻게 알 수 있나요?",
    answer:
      "제공해드리는 인플루언서 관리자 대시보드에서 실시간으로 모든 문의 내역을 확인하실 수 있습니다. PRO 플랜 이상 이용 시, 문의가 접수될 때마다 카카오톡 알림톡으로 실시간 알림을 보내드립니다.(카카오톡 채널 관리자센터 연동 필요)",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-black/40 relative">
      {/* Background Decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-[100px] -z-10" />

      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-1.5 text-xs font-semibold text-purple-400 mb-4 border border-white/5">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>자주 묻는 질문</span>
          </div>
          <h2 className="text-3xl font-bold md:text-5xl text-white">
            궁금한 점이 있으신가요?
          </h2>
          <p className="mt-4 text-gray-400">
            예비 사장님들이 가장 많이 묻는 질문들을 모았습니다.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`rounded-2xl border transition-all duration-300 ${
                openIndex === index
                  ? "bg-white/10 border-purple-500/30 shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
                  : "bg-white/5 border-white/5 hover:bg-white/[0.07]"
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between p-6 text-left"
              >
                <span
                  className={`text-lg font-bold transition-colors ${
                    openIndex === index ? "text-white" : "text-gray-300"
                  }`}
                >
                  {faq.question}
                </span>
                <div
                  className={`ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all ${
                    openIndex === index
                      ? "border-purple-500 bg-purple-500 text-white rotate-180"
                      : "border-white/10 bg-white/5 text-gray-400"
                  }`}
                >
                  <ChevronDown className="h-5 w-5" />
                </div>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index
                    ? "max-h-40 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 pb-6 pt-0 text-gray-400 leading-relaxed border-t border-white/5 mt-2 pt-4">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
