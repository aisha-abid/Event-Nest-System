import toast from "react-hot-toast";
import CloseIcon from "../assets/closeIcon.svg"; // path adjust karo apne project k hisaab se

export const showCustomToast = (msg) => {
  toast.custom((t) => (
    <div
      className={`${
        t.visible ? "animate-enter" : "animate-leave"
      } flex items-center justify-between gap-2 bg-white text-gray-800 border border-gray-300 shadow-md rounded-lg px-4 py-2`}
    >
      <span>{msg}</span>
      <button onClick={() => toast.dismiss(t.id)}>
        <img
          src={CloseIcon}
          alt="close"
          className="w-4 h-4 cursor-pointer hover:opacity-70"
        />
      </button>
    </div>
  ));
};
