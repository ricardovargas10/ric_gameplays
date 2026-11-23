// Põe o ícone da plataforma nos botões marcados com data-icone="twitch" (ou youtube, discord, spotify, livepix).
import { ICONES } from "./componentes.js";
document.querySelectorAll("[data-icone]").forEach(b => {
  const svg = ICONES[b.dataset.icone];
  if (svg && !b.querySelector("svg")) b.insertAdjacentHTML("afterbegin", svg);
});
