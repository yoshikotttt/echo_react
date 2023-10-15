import { Modal } from "antd";

const useConfirmModal = () => {

  const confirmModal = (title, content, onOk, customOptions = {}) => {
    // デフォルトのオプション設定
    const defaultOptions = {
      title, // モーダルのタイトル
      content, // モーダルの内容
      onOk, // OKボタンが押された時のコールバック関数
      cancelText: null, // キャンセルボタンのテキスト（デフォルトでは非表示）
      cancelButtonProps: { style: { display: "none" } }, // キャンセルボタン自体を非表示にするスタイル
    };

    // ユーザーが指定したカスタムオプションとデフォルトのオプションを統合
    const combinedOptions = { ...defaultOptions, ...customOptions };

    // モーダルの表示
    Modal.confirm(combinedOptions);
  };

  // confirmModal関数を返す
  return confirmModal;
};

export default useConfirmModal;
