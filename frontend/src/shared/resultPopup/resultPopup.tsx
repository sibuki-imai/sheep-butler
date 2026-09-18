import React, { useEffect } from "react";

type Props = {
  status: number;
  message?: string;
  onClose: () => void;
};

export const ResultPopup: React.FC<Props> = ({ status, message, onClose }) => {
  const isSuccess = status === 200;

  // ★ 表示されたら 2 秒後に自動で閉じる
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <div
        className={`
          w-80 p-4 rounded-lg shadow-md
          animate-[fadeIn_0.2s_ease-out]
          flex flex-col items-center
          ${isSuccess ? "bg-green-100 border-green-500" : "bg-red-100 border-red-500"}
          border
        `}
      >
        <h2 className="text-base font-bold mb-1">
          {isSuccess ? "完了しました" : "エラーが発生しました"}
        </h2>

        {!isSuccess && (
          <p className="text-sm text-gray-700 mb-1 text-center">
            {message ?? "不明なエラーです"}
          </p>
        )}
      </div>
    </div>
  );
};
