/* TAB SWITCHING + INDICATOR */
const indicator = document.getElementById("indicator");
const hotbar = document.getElementById("hotbar");

function updateIndicator(btn) {
  const r = btn.getBoundingClientRect();
  const p = hotbar.getBoundingClientRect();
  indicator.style.left = (r.left - p.left) + "px";
  indicator.style.width = r.width + "px";
}

window.onload = () => updateIndicator(document.querySelector(".hotbar .active"));

function switchTab(id, btn) {
  document.querySelectorAll(".section").forEach(s=>s.classList.remove("active"));
  document.getElementById(id).classList.add("active");

  document.querySelectorAll(".hotbar button").forEach(b=>b.classList.remove("active"));
  btn.classList.add("active");

  updateIndicator(btn);
}

/* PROXY */
function openProxy() {
  const input = document.getElementById("urlInput").value.trim();
  if (!input) return;
  const proxyBase = "https://YOUR-PROXY-DOMAIN/service/";
  const target = input.startsWith("http") ? input : "https://" + input;
  window.open(proxyBase + encodeURIComponent(target), "_blank");
}

/* PARTICLES */
const pc = document.getElementById("particles");
for (let i=0;i<50;i++){
  const p=document.createElement("div");
  p.className="particle";
  const s=3+Math.random()*6;
  p.style.width=p.style.height=s+"px";
  p.style.left=Math.random()*100+"vw";
  p.style.animationDuration=12+Math.random()*20+"s";
  p.style.animationDelay=Math.random()*20+"s";
  pc.appendChild(p);
}
