"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [product, setProduct] = useState("basic");
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [amount, setAmount] = useState(300000);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  function handleProductChange(p: string) {
    setProduct(p);
    setAmount(p === "pro" ? 500000 : 300000);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // Mock order creation
    setTimeout(() => {
      const id = `ord-${Math.random().toString(36).slice(2, 9)}`;
      setOrderId(id);
      setLoading(false);
    }, 600);
  }

  if (!user) {
    return (
      <div className="p-8">
        <p className="text-gray-600">결제를 진행하려면 먼저 로그인하세요.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">샘플 결제 (모의)</h1>

      {!orderId ? (
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white p-6 rounded-md shadow-sm"
        >
          <div>
            <label className="text-sm font-medium block mb-2">플랜 선택</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => handleProductChange("basic")}
                className={`px-4 py-2 rounded-md ${
                  product === "basic" ? "bg-indigo-600 text-white" : "border"
                }`}
              >
                베이직 - ₩300,000
              </button>
              <button
                type="button"
                onClick={() => handleProductChange("pro")}
                className={`px-4 py-2 rounded-md ${
                  product === "pro" ? "bg-indigo-600 text-white" : "border"
                }`}
              >
                프로 - ₩500,000
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="buyerName"
              className="block text-sm font-medium text-gray-700"
            >
              이름
            </label>
            <input
              id="buyerName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border px-3 py-2"
            />
          </div>

          <div>
            <label
              htmlFor="buyerEmail"
              className="block text-sm font-medium text-gray-700"
            >
              이메일
            </label>
            <input
              id="buyerEmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border px-3 py-2"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">총 금액</div>
            <div className="text-lg font-bold">₩{amount.toLocaleString()}</div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-4 py-2 text-white"
              disabled={loading}
            >
              {loading ? "결제 처리 중..." : "모의 결제 진행"}
            </button>
            <button
              type="button"
              className="rounded-md border px-4 py-2"
              onClick={() => router.back()}
            >
              취소
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white p-6 rounded-md shadow-sm">
          <h2 className="text-lg font-semibold mb-2">주문 완료</h2>
          <p className="text-sm text-gray-600 mb-4">
            주문 ID: <span className="font-mono">{orderId}</span>
          </p>
          <p className="mb-4">
            결제는 모의 상태이며 실제 결제는 처리되지 않았습니다.
          </p>
          <button
            className="rounded-md bg-admin-accent px-4 py-2 text-white"
            onClick={() => router.push("/admin/influencer")}
          >
            대시보드로 이동
          </button>
        </div>
      )}
    </div>
  );
}
