import ModeAchat from "@/_Components/ModeAchat";
import Nouveau from "@/_Components/Nouveau";
import ProduitVedette from "@/_Components/ProduitVedette";
import Slider from "@/_Components/Slider";
import VenteFlash from "@/_Components/VenteFlash";

export default function Home() {
  return (
    <div className="flex flex-col space-y-10">
      <Slider />
      <Nouveau />
      <ProduitVedette />
      <ModeAchat />
      <VenteFlash />
    </div>
  );
}
