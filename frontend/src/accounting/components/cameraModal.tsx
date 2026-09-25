import React, { useEffect, useRef, useState } from "react";

type Props = {
  onClose: () => void;
  onCapture?: (image: string) => void;
};

type CropRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type DragMode =
  | "move"
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | null;

type DragInfo = {
  mode: DragMode;
  startX: number;
  startY: number;
  startCrop: CropRect;
};

function CameraModal({ onClose, onCapture }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // カメラのstream
  const streamRef = useRef<MediaStream | null>(null);

  // ドラッグ情報
  const dragRef = useRef<DragInfo | null>(null);

  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCropMode, setIsCropMode] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ドラッグ中かどうか
  const [isDragging, setIsDragging] = useState(false);

  /*
   * 初期の有効範囲
   *
   * カメラ側の補助線と同じ割合
   *
   * top    : 10%
   * bottom : 10%
   * left   : 15%
   * right  : 15%
   */
  const [crop, setCrop] = useState<CropRect>({
    x: 15,
    y: 10,
    width: 70,
    height: 80,
  });

  /*
   * カメラ停止
   */
  const stopCamera = () => {
    const stream = streamRef.current;

    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });

      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }
  };

  /*
   * カメラ起動
   */
  useEffect(() => {
    let active = true;

    const start = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: {
              ideal: "environment",
            },
            width: {
              ideal: 1920,
            },
            height: {
              ideal: 1080,
            },
          },
          audio: false,
        });

        if (!active) {
          mediaStream.getTracks().forEach((track) => {
            track.stop();
          });

          return;
        }

        streamRef.current = mediaStream;

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          await videoRef.current.play();
        }
      } catch (error) {
        console.error("カメラ起動エラー:", error);
        setError("カメラを起動できませんでした。");
      }
    };

    start();

    return () => {
      active = false;
      stopCamera();
    };
  }, []);

  /*
   * モーダルを閉じる
   */
  const handleClose = () => {
    stopCamera();
    onClose();
  };

  /*
   * カメラ起動
   */
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: {
            ideal: 1920,
          },
          height: {
            ideal: 1080,
          },
        },
        audio: false,
      });

      streamRef.current = mediaStream;

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }
    } catch (error) {
      console.error("カメラ起動エラー:", error);
      setError("カメラを起動できませんでした。");
    }
  };

  /*
   * 写真撮影
   */
  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    if (video.videoWidth === 0 || video.videoHeight === 0) {
      console.log("カメラ映像の準備ができていません");
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");

    if (!context) return;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const image = canvas.toDataURL("image/jpeg", 0.9);

    setCapturedImage(image);
  };

  /*
   * 撮り直し
   */
  const handleRetake = async () => {
    setCapturedImage(null);
    setIsCropMode(false);
    setIsDragging(false);

    // 初期範囲に戻す
    setCrop({
      x: 15,
      y: 10,
      width: 70,
      height: 80,
    });

    await startCamera();
  };

  /*
   * 範囲選択開始
   */
  const handleCropPointerDown = (
    event: React.PointerEvent<HTMLDivElement>,
    mode: DragMode,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    dragRef.current = {
      mode,
      startX: event.clientX,
      startY: event.clientY,
      startCrop: {
        ...crop,
      },
    };

    setIsDragging(true);

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  /*
   * 範囲選択中の移動
   */
  const handleCropPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;

    if (!drag) return;

    const container = event.currentTarget.parentElement;

    if (!container) return;

    const rect = container.getBoundingClientRect();

    if (rect.width === 0 || rect.height === 0) return;

    // px → %
    const deltaX = ((event.clientX - drag.startX) / rect.width) * 100;
    const deltaY = ((event.clientY - drag.startY) / rect.height) * 100;

    const start = drag.startCrop;

    let newX = start.x;
    let newY = start.y;
    let newWidth = start.width;
    let newHeight = start.height;

    const minSize = 10;

    switch (drag.mode) {
      /*
       * 枠そのものを移動
       */
      case "move":
        newX = start.x + deltaX;
        newY = start.y + deltaY;

        newX = Math.max(0, Math.min(newX, 100 - start.width));
        newY = Math.max(0, Math.min(newY, 100 - start.height));

        break;

      /*
       * 上
       */
      case "top":
        newY = start.y + deltaY;
        newY = Math.max(0, newY);

        newHeight = start.height + (start.y - newY);

        if (newHeight < minSize) {
          newHeight = minSize;
          newY = start.y + start.height - minSize;
        }

        break;

      /*
       * 下
       */
      case "bottom":
        newHeight = start.height + deltaY;

        newHeight = Math.max(minSize, newHeight);
        newHeight = Math.min(newHeight, 100 - start.y);

        break;

      /*
       * 左
       */
      case "left":
        newX = start.x + deltaX;
        newX = Math.max(0, newX);

        newWidth = start.width + (start.x - newX);

        if (newWidth < minSize) {
          newWidth = minSize;
          newX = start.x + start.width - minSize;
        }

        break;

      /*
       * 右
       */
      case "right":
        newWidth = start.width + deltaX;

        newWidth = Math.max(minSize, newWidth);
        newWidth = Math.min(newWidth, 100 - start.x);

        break;

      /*
       * 左上
       */
      case "top-left":
        newX = start.x + deltaX;
        newY = start.y + deltaY;

        newX = Math.max(0, newX);
        newY = Math.max(0, newY);

        newWidth = start.width + (start.x - newX);
        newHeight = start.height + (start.y - newY);

        if (newWidth < minSize) {
          newWidth = minSize;
          newX = start.x + start.width - minSize;
        }

        if (newHeight < minSize) {
          newHeight = minSize;
          newY = start.y + start.height - minSize;
        }

        break;

      /*
       * 右上
       */
      case "top-right":
        newY = start.y + deltaY;
        newY = Math.max(0, newY);

        newWidth = start.width + deltaX;
        newHeight = start.height + (start.y - newY);

        newWidth = Math.max(minSize, newWidth);
        newWidth = Math.min(newWidth, 100 - start.x);

        if (newHeight < minSize) {
          newHeight = minSize;
          newY = start.y + start.height - minSize;
        }

        break;

      /*
       * 左下
       */
      case "bottom-left":
        newX = start.x + deltaX;
        newX = Math.max(0, newX);

        newWidth = start.width + (start.x - newX);
        newHeight = start.height + deltaY;

        if (newWidth < minSize) {
          newWidth = minSize;
          newX = start.x + start.width - minSize;
        }

        newHeight = Math.max(minSize, newHeight);
        newHeight = Math.min(newHeight, 100 - start.y);

        break;

      /*
       * 右下
       */
      case "bottom-right":
        newWidth = start.width + deltaX;
        newHeight = start.height + deltaY;

        newWidth = Math.max(minSize, newWidth);
        newHeight = Math.max(minSize, newHeight);

        newWidth = Math.min(newWidth, 100 - start.x);
        newHeight = Math.min(newHeight, 100 - start.y);

        break;

      default:
        return;
    }

    setCrop({
      x: newX,
      y: newY,
      width: newWidth,
      height: newHeight,
    });
  };

  /*
   * 範囲選択終了
   */
  const handleCropPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragRef.current) {
      dragRef.current = null;
    }

    setIsDragging(false);

    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      // pointer capture が解除済みの場合は何もしない
    }
  };

  /*
   * 枠内だけを切り出す
   */
  const cropImage = async (
    image: string,
    cropRect: CropRect,
  ): Promise<string | null> => {
    return new Promise((resolve) => {
      const img = new Image();

      img.onload = () => {
        const sourceX = (img.naturalWidth * cropRect.x) / 100;
        const sourceY = (img.naturalHeight * cropRect.y) / 100;

        const sourceWidth = (img.naturalWidth * cropRect.width) / 100;

        const sourceHeight = (img.naturalHeight * cropRect.height) / 100;

        if (sourceWidth <= 0 || sourceHeight <= 0) {
          resolve(null);
          return;
        }

        const canvas = document.createElement("canvas");

        canvas.width = Math.round(sourceWidth);
        canvas.height = Math.round(sourceHeight);

        const context = canvas.getContext("2d");

        if (!context) {
          resolve(null);
          return;
        }

        context.drawImage(
          img,
          sourceX,
          sourceY,
          sourceWidth,
          sourceHeight,
          0,
          0,
          canvas.width,
          canvas.height,
        );

        resolve(canvas.toDataURL("image/jpeg", 0.9));
      };

      img.onerror = () => {
        resolve(null);
      };

      img.src = image;
    });
  };

  /*
   * 撮影画像を確定
   *
   * 赤枠内だけを切り出して送る
   */
  const handleConfirm = async () => {
    if (!capturedImage) return;

    const croppedImage = await cropImage(capturedImage, crop);

    if (!croppedImage) {
      setError("画像の切り出しに失敗しました。");
      return;
    }

    onCapture?.(croppedImage);

    stopCamera();
    onClose();
  };

  /*
   * 赤枠のスタイル
   */
  const cropStyle: React.CSSProperties = {
    position: "absolute",
    left: `${crop.x}%`,
    top: `${crop.y}%`,
    width: `${crop.width}%`,
    height: `${crop.height}%`,
    border: "3px solid #ff3333",
    boxSizing: "border-box",
    cursor: isDragging ? "grabbing" : "grab",
    touchAction: "none",
  };

  /*
   * リサイズハンドル共通スタイル
   */
  const handleStyle: React.CSSProperties = {
    position: "absolute",
    width: "18px",
    height: "18px",
    backgroundColor: "#ff3333",
    border: "2px solid #ffffff",
    borderRadius: "50%",
    boxSizing: "border-box",
    touchAction: "none",
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        boxSizing: "border-box",
      }}
      onClick={handleClose}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "500px",
          maxHeight: "90vh",
          backgroundColor: "#000",
          borderRadius: "12px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 閉じる */}
        <button
          type="button"
          onClick={handleClose}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            zIndex: 10,
            width: "40px",
            height: "40px",
            border: "none",
            borderRadius: "50%",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            color: "#fff",
            fontSize: "24px",
            cursor: "pointer",
          }}
        >
          ×
        </button>

        {error ? (
          /* =========================
             カメラエラー
          ========================= */
          <div
            style={{
              minHeight: "300px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              padding: "30px",
              color: "#fff",
              textAlign: "center",
            }}
          >
            <p>{error}</p>

            <button type="button" onClick={handleClose}>
              閉じる
            </button>
          </div>
        ) : capturedImage ? (
          /* =========================
             撮影後
          ========================= */
          <div>
            {/* 画像表示エリア */}
            <div
              style={{
                width: "100%",
                backgroundColor: "#000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              {/* 画像 + 赤枠 */}
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "3 / 4",
                  backgroundColor: "#000",
                  overflow: "hidden",
                }}
              >
                <img
                  src={capturedImage}
                  alt="撮影した画像"
                  style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />

                {/* =========================
                   有効範囲
                ========================= */}
                <div
                  style={cropStyle}
                  onPointerDown={(event) =>
                    handleCropPointerDown(event, "move")
                  }
                  onPointerMove={handleCropPointerMove}
                  onPointerUp={handleCropPointerUp}
                  onPointerCancel={handleCropPointerUp}
                >
                  {/* 左上 */}
                  <div
                    style={{
                      ...handleStyle,
                      left: "-9px",
                      top: "-9px",
                      cursor: "nwse-resize",
                    }}
                    onPointerDown={(event) =>
                      handleCropPointerDown(event, "top-left")
                    }
                    onPointerMove={handleCropPointerMove}
                    onPointerUp={handleCropPointerUp}
                    onPointerCancel={handleCropPointerUp}
                  />

                  {/* 右上 */}
                  <div
                    style={{
                      ...handleStyle,
                      right: "-9px",
                      top: "-9px",
                      cursor: "nesw-resize",
                    }}
                    onPointerDown={(event) =>
                      handleCropPointerDown(event, "top-right")
                    }
                    onPointerMove={handleCropPointerMove}
                    onPointerUp={handleCropPointerUp}
                    onPointerCancel={handleCropPointerUp}
                  />

                  {/* 左下 */}
                  <div
                    style={{
                      ...handleStyle,
                      left: "-9px",
                      bottom: "-9px",
                      cursor: "nesw-resize",
                    }}
                    onPointerDown={(event) =>
                      handleCropPointerDown(event, "bottom-left")
                    }
                    onPointerMove={handleCropPointerMove}
                    onPointerUp={handleCropPointerUp}
                    onPointerCancel={handleCropPointerUp}
                  />

                  {/* 右下 */}
                  <div
                    style={{
                      ...handleStyle,
                      right: "-9px",
                      bottom: "-9px",
                      cursor: "nwse-resize",
                    }}
                    onPointerDown={(event) =>
                      handleCropPointerDown(event, "bottom-right")
                    }
                    onPointerMove={handleCropPointerMove}
                    onPointerUp={handleCropPointerUp}
                    onPointerCancel={handleCropPointerUp}
                  />

                  {/* 上 */}
                  <div
                    style={{
                      position: "absolute",
                      left: "25%",
                      right: "25%",
                      top: "-6px",
                      height: "12px",
                      cursor: "ns-resize",
                      touchAction: "none",
                    }}
                    onPointerDown={(event) =>
                      handleCropPointerDown(event, "top")
                    }
                    onPointerMove={handleCropPointerMove}
                    onPointerUp={handleCropPointerUp}
                    onPointerCancel={handleCropPointerUp}
                  />

                  {/* 下 */}
                  <div
                    style={{
                      position: "absolute",
                      left: "25%",
                      right: "25%",
                      bottom: "-6px",
                      height: "12px",
                      cursor: "ns-resize",
                      touchAction: "none",
                    }}
                    onPointerDown={(event) =>
                      handleCropPointerDown(event, "bottom")
                    }
                    onPointerMove={handleCropPointerMove}
                    onPointerUp={handleCropPointerUp}
                    onPointerCancel={handleCropPointerUp}
                  />

                  {/* 左 */}
                  <div
                    style={{
                      position: "absolute",
                      top: "25%",
                      bottom: "25%",
                      left: "-6px",
                      width: "12px",
                      cursor: "ew-resize",
                      touchAction: "none",
                    }}
                    onPointerDown={(event) =>
                      handleCropPointerDown(event, "left")
                    }
                    onPointerMove={handleCropPointerMove}
                    onPointerUp={handleCropPointerUp}
                    onPointerCancel={handleCropPointerUp}
                  />

                  {/* 右 */}
                  <div
                    style={{
                      position: "absolute",
                      top: "25%",
                      bottom: "25%",
                      right: "-6px",
                      width: "12px",
                      cursor: "ew-resize",
                      touchAction: "none",
                    }}
                    onPointerDown={(event) =>
                      handleCropPointerDown(event, "right")
                    }
                    onPointerMove={handleCropPointerMove}
                    onPointerUp={handleCropPointerUp}
                    onPointerCancel={handleCropPointerUp}
                  />
                </div>
              </div>
            </div>

            {isCropMode ? (
              /* =========================
                 有効範囲調節モード
              ========================= */
              <div>
                <div
                  style={{
                    padding: "10px",
                    backgroundColor: "#000",
                    color: "#fff",
                    textAlign: "center",
                    fontSize: "14px",
                  }}
                >
                  赤枠をドラッグして移動できます。
                  <br />
                  枠の四隅・上下左右から大きさを変更できます。
                </div>

                <div
                  style={{
                    display: "flex",
                    padding: "10px",
                    backgroundColor: "#000",
                    flexShrink: 0,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setIsCropMode(false);
                      setIsDragging(false);
                    }}
                    style={{
                      flex: 1,
                      padding: "14px",
                      border: "solid 3px #83A5C4",
                      borderRadius: "30px",
                      fontSize: "16px",
                      cursor: "pointer",
                      color: "#ffffff",
                      backgroundColor: "#000",
                    }}
                  >
                    範囲の決定
                  </button>
                </div>
              </div>
            ) : (
              /* =========================
                 通常の撮影後画面
              ========================= */
              <div>
                {/* 操作ボタン */}
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    padding: "15px",
                    backgroundColor: "#000",
                    flexShrink: 0,
                  }}
                >
                  <button
                    type="button"
                    onClick={handleRetake}
                    style={{
                      flex: 1,
                      padding: "14px",
                      border: "solid 3px #83A5C4",
                      borderRadius: "8px",
                      fontSize: "16px",
                      cursor: "pointer",
                      color: "#ffffff",
                      backgroundColor: "#000",
                    }}
                  >
                    撮り直す
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsCropMode(true)}
                    style={{
                      flex: 1,
                      padding: "14px",
                      border: "solid 3px #83A5C4",
                      borderRadius: "8px",
                      fontSize: "16px",
                      cursor: "pointer",
                      color: "#ffffff",
                      backgroundColor: "#000",
                    }}
                  >
                    有効範囲の調節
                  </button>
                </div>

                {/* 確定 */}
                <div
                  style={{
                    display: "flex",
                    padding: "10px",
                    backgroundColor: "#000",
                    flexShrink: 0,
                  }}
                >
                  <button
                    type="button"
                    onClick={handleConfirm}
                    style={{
                      flex: 1,
                      padding: "14px",
                      border: "solid 3px #83A5C4",
                      borderRadius: "30px",
                      fontSize: "16px",
                      cursor: "pointer",
                      color: "#ffffff",
                      backgroundColor: "#000",
                    }}
                  >
                    この画像を使用
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* =========================
             カメラ
          ========================= */
          <>
            {/* カメラ領域 */}
            <div
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "3 / 4",
                backgroundColor: "#000",
                overflow: "hidden",
              }}
            >
              {/* カメラ映像 */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{
                  display: "block",
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />

              {/* 補助線 */}
              <div
                style={{
                  position: "absolute",
                  top: "10%",
                  bottom: "10%",
                  left: "15%",
                  right: "15%",
                  border: "2px solid rgba(255, 255, 255, 0.9)",
                  borderRadius: "4px",
                  pointerEvents: "none",
                  boxSizing: "border-box",
                }}
              />

              {/* 説明 */}
              <div
                style={{
                  position: "absolute",
                  top: "4%",
                  left: 0,
                  right: 0,
                  textAlign: "center",
                  color: "#fff",
                  fontSize: "14px",
                  textShadow: "0 1px 3px rgba(0, 0, 0, 0.8)",
                  pointerEvents: "none",
                }}
              >
                レシートを枠内に合わせてください
              </div>
            </div>

            {/* シャッターボタン領域 */}
            <div
              style={{
                height: "100px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#000",
                flexShrink: 0,
              }}
            >
              <button
                type="button"
                onClick={takePhoto}
                aria-label="撮影"
                style={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "50%",
                  border: "5px solid #fff",
                  backgroundColor: "#fff",
                  cursor: "pointer",
                  padding: 0,
                }}
              />
            </div>
          </>
        )}

        <canvas
          ref={canvasRef}
          style={{
            display: "none",
          }}
        />
      </div>
    </div>
  );
}

export default CameraModal;
