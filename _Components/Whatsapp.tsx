import { FaWhatsapp } from "react-icons/fa";

function WhatsappBtn() {
  return (
    <a
      href="https://wa.me/message/77EK6DIZCRHWH1"
      target="_blank"
      rel="noopener noreferrer"
      className="
        fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4
        z-[99999]
        flex items-center justify-center
        w-12 h-12
        bg-green-600 text-white
        rounded-full shadow-2xl
        hover:scale-110 active:scale-95
        transition
      "
    >
      <FaWhatsapp size={22} />
    </a>
  );
}

export default WhatsappBtn;