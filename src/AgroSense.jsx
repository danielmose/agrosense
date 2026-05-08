import { useState, useEffect, useRef } from "react";

const SUPABASE_URL  = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON;
const GROQ_KEY      = import.meta.env.VITE_GROQ_KEY;

const sb = {
  async req(method, path, body = null) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
      method,
      headers: {
        apikey: SUPABASE_ANON,
        Authorization: `Bearer ${SUPABASE_ANON}`,
        "Content-Type": "application/json",
        Prefer: method === "POST" ? "return=representation" : "",
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) { const e = await res.json(); throw new Error(e.message || e.details || "DB error"); }
    return res.status === 204 ? null : res.json();
  },
  select: (t, q = "") => sb.req("GET", `${t}?${q}`),
  insert: (t, d)       => sb.req("POST", t, d),
  update: (t, q, d)    => sb.req("PATCH", `${t}?${q}`, d),
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Raleway:wght@300;400;500;600;700&family=Source+Code+Pro:wght@400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --g:#2d6a4f;--gl:#40916c;--gb:#52b788;--gp:#95d5b2;
  --bg:#080e0a;--bg2:#0c1510;--bg3:#111a13;
  --bdr:rgba(82,183,136,0.15);--bdrs:rgba(82,183,136,0.32);
  --t:#e8f5e9;--tm:#6b9a7a;--td:#3a5e4a;
  --fd:'Cinzel',serif;--fb:'Raleway',sans-serif;--fm:'Source Code Pro',monospace;
}
html,body{font-family:var(--fb);background:var(--bg);color:var(--t);overflow-x:hidden;min-height:100vh}
::-webkit-scrollbar{width:3px;height:3px}
::-webkit-scrollbar-thumb{background:var(--g);border-radius:3px}
.aw{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;
  padding:24px 16px;
  background:radial-gradient(ellipse at 20% 70%,rgba(45,106,79,.22) 0%,transparent 52%),
             radial-gradient(ellipse at 85% 15%,rgba(45,106,79,.1) 0%,transparent 45%),var(--bg)}
.brand{text-align:center;margin-bottom:26px}
.brand-leaf{font-size:2.4rem;display:block;animation:sway 3s ease-in-out infinite}
@keyframes sway{0%,100%{transform:rotate(-7deg)}50%{transform:rotate(7deg)}}
.brand-name{font-family:var(--fd);font-size:1.12rem;letter-spacing:.26em;color:var(--gb);margin-top:10px}
.brand-sub{font-size:.57rem;color:var(--tm);letter-spacing:.15em;margin-top:4px;text-transform:uppercase}
.acard{width:100%;max-width:440px;background:var(--bg2);border:1px solid var(--bdr);border-radius:20px;overflow:hidden;
  box-shadow:0 24px 64px rgba(0,0,0,.65),0 0 50px rgba(45,106,79,.12)}
.abar{height:3px;background:linear-gradient(90deg,var(--g),var(--gb),var(--gp),var(--gb),var(--g));
  background-size:200%;animation:shine 3s linear infinite}
@keyframes shine{to{background-position:200%}}
.atabs{display:flex;border-bottom:1px solid var(--bdr)}
.atab{flex:1;padding:14px;text-align:center;cursor:pointer;font-family:var(--fd);font-size:.7rem;
  letter-spacing:.13em;color:var(--tm);background:transparent;border:none;
  border-bottom:2px solid transparent;outline:none;transition:all .25s}
.atab.on{color:var(--gb);border-bottom:2px solid var(--gb);background:rgba(82,183,136,.05)}
.atab:hover:not(.on){color:var(--t)}
.abody{padding:24px 24px 28px}
.awelcome{text-align:center;margin-bottom:20px;padding:16px 12px;
  background:linear-gradient(135deg,rgba(45,106,79,.14),rgba(9,26,15,.4));
  border-radius:13px;border:1px solid var(--bdr)}
.awelcome .wico{font-size:1.5rem;margin-bottom:6px}
.awelcome h3{font-family:var(--fd);font-size:.92rem;color:var(--t);letter-spacing:.05em;margin-bottom:5px}
.awelcome p{font-size:.69rem;color:var(--tm);line-height:1.75}
.irow{position:relative;margin-bottom:15px}
.irow label{display:block;font-size:.58rem;letter-spacing:.13em;text-transform:uppercase;color:var(--tm);margin-bottom:5px}
.irow input{width:100%;background:var(--bg3);border:1px solid var(--bdr);border-radius:10px;
  padding:12px 40px 12px 14px;color:var(--t);font-family:var(--fb);font-size:.86rem;outline:none;
  transition:border-color .25s,box-shadow .25s}
.irow input::placeholder{color:var(--td)}
.irow input:focus{border-color:var(--gb);box-shadow:0 0 0 3px rgba(82,183,136,.1)}
.irow .ico{position:absolute;right:13px;bottom:13px;color:var(--tm);font-size:.88rem;pointer-events:none}
.irow .eye{position:absolute;right:13px;bottom:13px;color:var(--tm);font-size:.88rem;cursor:pointer;background:none;border:none;padding:0}
.aerr{display:flex;align-items:center;gap:7px;background:rgba(192,57,43,.12);
  border:1px solid rgba(192,57,43,.28);border-radius:8px;padding:9px 12px;
  font-size:.74rem;color:#f1948a;margin-bottom:13px}
.aok{display:flex;align-items:center;gap:7px;background:rgba(45,106,79,.15);
  border:1px solid rgba(82,183,136,.3);border-radius:8px;padding:9px 12px;
  font-size:.74rem;color:var(--gb);margin-bottom:13px}
.abtn{width:100%;padding:13px;margin-top:5px;background:linear-gradient(135deg,var(--gl),var(--g));
  border:none;border-radius:10px;color:white;font-family:var(--fd);font-size:.78rem;
  letter-spacing:.14em;cursor:pointer;transition:all .25s;box-shadow:0 5px 20px rgba(45,106,79,.35)}
.abtn:hover{transform:translateY(-1px);box-shadow:0 9px 28px rgba(45,106,79,.5)}
.abtn:disabled{opacity:.6;cursor:not-allowed;transform:none}
.afooter{margin-top:14px;text-align:center;font-size:.72rem;color:var(--tm)}
.afooter button{background:none;border:none;color:var(--gb);font-weight:700;cursor:pointer;font-family:var(--fb);font-size:.72rem}
.forgot-link{display:block;text-align:right;margin-top:-8px;margin-bottom:12px;font-size:.68rem;color:var(--gb);cursor:pointer;background:none;border:none;font-family:var(--fb)}
.forgot-link:hover{text-decoration:underline}
.dash{display:flex;flex-direction:column;min-height:100vh}
.topbar{display:flex;align-items:center;justify-content:space-between;padding:0 14px;height:54px;
  background:var(--bg2);border-bottom:1px solid var(--bdr);position:sticky;top:0;z-index:300}
.tbn{font-family:var(--fd);font-size:.8rem;letter-spacing:.2em;color:var(--gb)}
.tbs{font-size:.51rem;color:var(--tm);letter-spacing:.1em}
.tbr{display:flex;align-items:center;gap:8px}
.uchip{display:flex;align-items:center;gap:6px;background:var(--bg3);border:1px solid var(--bdr);
  border-radius:20px;padding:5px 11px;font-size:.73rem;color:var(--tm)}
.uav{width:22px;height:22px;background:var(--g);border-radius:50%;display:flex;align-items:center;
  justify-content:center;font-size:.6rem;color:white;font-weight:700}
.obtn{background:transparent;border:1px solid rgba(192,57,43,.35);color:#f1948a;padding:5px 11px;
  border-radius:16px;font-size:.68rem;cursor:pointer;font-family:var(--fb);transition:all .2s}
.obtn:hover{background:rgba(192,57,43,.1)}
.db{display:flex;flex:1}
.sidebar{width:232px;background:var(--bg2);border-right:1px solid var(--bdr);
  display:flex;flex-direction:column;position:sticky;top:54px;
  height:calc(100vh - 54px);overflow-y:auto;padding:10px 0;flex-shrink:0}
.slbl{font-size:.56rem;letter-spacing:.2em;color:var(--td);text-transform:uppercase;padding:10px 14px 5px}
.ni{display:flex;align-items:center;gap:8px;padding:10px 14px;cursor:pointer;transition:all .18s;
  border-left:3px solid transparent;font-size:.79rem;color:var(--tm)}
.ni:hover{background:rgba(82,183,136,.05);color:var(--t)}
.ni.act{background:rgba(82,183,136,.09);border-left-color:var(--gb);color:var(--gb)}
.nic{font-size:.9rem;width:18px;text-align:center}
.lcard{margin:10px;background:var(--bg3);border:1px solid var(--bdr);border-radius:10px;padding:12px}
.llbl{font-size:.56rem;letter-spacing:.13em;color:var(--tm);text-transform:uppercase;margin-bottom:5px}
.lplace{font-size:.77rem;color:var(--t);line-height:1.5}
.lcoord{font-family:var(--fm);font-size:.62rem;color:var(--gb);margin-top:3px}
.lnone{font-size:.74rem;color:var(--tm);font-style:italic}
.lbtn{width:100%;margin-top:9px;padding:8px;background:linear-gradient(135deg,var(--gl),var(--g));
  border:none;border-radius:6px;color:white;font-size:.67rem;font-family:var(--fb);font-weight:600;
  cursor:pointer;letter-spacing:.05em;transition:opacity .2s}
.lbtn:hover{opacity:.85}.lbtn:disabled{opacity:.5;cursor:not-allowed}
.mobnav{display:none;position:fixed;bottom:0;left:0;right:0;z-index:300;
  background:var(--bg2);border-top:1px solid var(--bdr)}
.mobnav-row{display:flex}
.mni{flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;padding:8px 2px;
  cursor:pointer;color:var(--tm);font-size:.48rem;letter-spacing:.03em;
  border:none;background:transparent;outline:none;transition:color .18s}
.mni.act{color:var(--gb)}
.mnic{font-size:1.05rem}
.ct{flex:1;padding:18px 14px 88px;overflow-y:auto}
@media(min-width:769px){.ct{padding:22px 26px 24px}}
.ph{margin-bottom:18px}
.ph h2{font-family:var(--fd);font-size:1.15rem;color:var(--t);letter-spacing:.05em}
.ph p{font-size:.72rem;color:var(--tm);margin-top:3px}
.sg{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px}
@media(min-width:560px){.sg.four{grid-template-columns:repeat(4,1fr)}}
.sc{background:var(--bg2);border:1px solid var(--bdr);border-radius:11px;padding:13px;transition:border-color .2s}
.sc:hover{border-color:var(--bdrs)}
.scl{font-size:.57rem;letter-spacing:.11em;color:var(--tm);text-transform:uppercase;margin-bottom:5px}
.scv{font-family:var(--fd);font-size:1.5rem;color:var(--t)}
.scu{font-size:.68rem;color:var(--tm);margin-left:3px}
.sci{font-size:1.3rem;margin-bottom:5px}
.scc{font-size:.65rem;color:var(--gb);margin-top:3px}
.card{background:var(--bg2);border:1px solid var(--bdr);border-radius:12px;padding:16px;margin-bottom:14px}
.card h4{font-family:var(--fd);font-size:.86rem;letter-spacing:.07em;color:var(--t);margin-bottom:13px;display:flex;align-items:center;gap:7px}
.hscroll{display:flex;gap:7px;overflow-x:auto;padding-bottom:5px}
.hscroll::-webkit-scrollbar{height:2px}
.hchip{flex-shrink:0;background:var(--bg3);border:1px solid var(--bdr);border-radius:10px;
  padding:9px 11px;text-align:center;min-width:56px}
.hchip.now{border-color:var(--gb);background:rgba(82,183,136,.08)}
.htime{font-size:.58rem;color:var(--tm);margin-bottom:3px}
.hico{font-size:1.05rem;margin-bottom:3px}
.htemp{font-family:var(--fm);font-size:.72rem;color:var(--t)}
.hrain{font-size:.57rem;color:#74b9d6;margin-top:2px}
.rbars{display:flex;align-items:flex-end;gap:4px;height:96px}
.rbw{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;height:100%;justify-content:flex-end}
.rbar{width:100%;border-radius:3px 3px 0 0;background:linear-gradient(to top,var(--g),var(--gb));
  min-height:2px;position:relative;cursor:pointer;transition:height .5s ease}
.rbar:hover::after{content:attr(data-v);position:absolute;top:-20px;left:50%;transform:translateX(-50%);
  background:var(--bg3);border:1px solid var(--bdr);border-radius:4px;padding:2px 5px;
  font-size:.6rem;color:var(--gb);white-space:nowrap;font-family:var(--fm);z-index:10}
.rbl{font-size:.53rem;color:var(--tm)}
.cgrid{display:grid;grid-template-columns:1fr;gap:11px}
@media(min-width:480px){.cgrid{grid-template-columns:1fr 1fr}}
@media(min-width:900px){.cgrid{grid-template-columns:1fr 1fr 1fr}}
.cc{background:var(--bg3);border:1px solid var(--bdr);border-radius:11px;padding:14px;
  transition:all .2s;position:relative;overflow:hidden}
.cc::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;
  background:linear-gradient(90deg,var(--g),var(--gb));transform:scaleX(0);transform-origin:left;transition:transform .3s}
.cc:hover{border-color:var(--bdrs)}.cc:hover::before{transform:scaleX(1)}
.cico{font-size:1.75rem;margin-bottom:6px}
.cname{font-family:var(--fd);font-size:.86rem;color:var(--t);margin-bottom:4px}
.cbadge{display:inline-block;padding:2px 8px;border-radius:10px;font-size:.63rem;font-weight:600;margin-bottom:8px}
.ex{background:rgba(82,183,136,.2);color:var(--gb)}
.gd{background:rgba(149,213,178,.15);color:var(--gp)}
.fr{background:rgba(139,94,60,.2);color:#c9956a}
.cspec{display:flex;align-items:flex-start;gap:5px;margin-top:3px;font-size:.69rem;color:var(--tm)}
.cspec .k{color:var(--td);font-size:.59rem;text-transform:uppercase;letter-spacing:.08em;width:54px;flex-shrink:0;padding-top:1px}
.aibox{background:linear-gradient(135deg,rgba(45,106,79,.08),rgba(9,26,15,.5));
  border:1px solid var(--bdrs);border-radius:12px;padding:18px;margin-bottom:14px}
.aihead{display:flex;align-items:center;gap:10px;margin-bottom:13px;flex-wrap:wrap}
.aibadge{background:linear-gradient(135deg,var(--gl),var(--g));color:white;padding:3px 10px;
  border-radius:20px;font-size:.62rem;font-weight:700;letter-spacing:.1em}
.aitext{font-size:.8rem;line-height:2;color:var(--t);white-space:pre-wrap}
.aidots{display:flex;align-items:center;gap:7px;color:var(--tm);font-size:.78rem;padding:6px 0}
.adot{width:6px;height:6px;background:var(--gb);border-radius:50%;animation:pulse 1.2s ease-in-out infinite}
.adot:nth-child(2){animation-delay:.2s}.adot:nth-child(3){animation-delay:.4s}
@keyframes pulse{0%,80%,100%{transform:scale(.6);opacity:.4}40%{transform:scale(1);opacity:1}}
.aibtn{padding:10px 20px;background:linear-gradient(135deg,var(--gl),var(--g));border:none;
  border-radius:8px;color:white;font-family:var(--fd);font-size:.74rem;letter-spacing:.1em;
  cursor:pointer;transition:all .2s;box-shadow:0 4px 16px rgba(45,106,79,.3);margin-top:12px;display:inline-block}
.aibtn:hover{transform:translateY(-1px)}.aibtn:disabled{opacity:.5;cursor:not-allowed;transform:none}
.banner{background:rgba(139,94,60,.1);border:1px solid rgba(139,94,60,.28);border-radius:10px;
  padding:12px 15px;text-align:center;color:#c9956a;font-size:.76rem;margin-bottom:14px;line-height:1.6}
.lbox{background:var(--bg2);border:1px solid var(--bdr);border-radius:12px;padding:36px;text-align:center;color:var(--tm)}
.spin{width:28px;height:28px;border:2px solid var(--bdr);border-top-color:var(--gb);
  border-radius:50%;animation:spin .8s linear infinite;margin:0 auto 10px}
@keyframes spin{to{transform:rotate(360deg)}}
.tbl{width:100%;border-collapse:collapse;font-size:.74rem}
.tbl th{padding:7px 9px;text-align:left;font-size:.6rem;letter-spacing:.1em;text-transform:uppercase;
  color:var(--tm);border-bottom:1px solid var(--bdr);font-weight:600}
.tbl td{padding:8px 9px;border-bottom:1px solid rgba(82,183,136,.06);white-space:nowrap;color:var(--tm)}
.tbl td.hl{color:var(--t)}
.action-btn{padding:11px 18px;background:linear-gradient(135deg,var(--gl),var(--g));border:none;
  border-radius:9px;color:white;font-family:var(--fd);font-size:.76rem;letter-spacing:.1em;
  cursor:pointer;transition:all .2s;box-shadow:0 4px 16px rgba(45,106,79,.3);margin-top:12px}
.action-btn:hover{transform:translateY(-1px)}
.rain-alert{border-radius:13px;padding:15px 17px;margin-bottom:14px;display:flex;align-items:flex-start;gap:13px;border:1px solid}
.rain-alert.rain{background:rgba(41,128,185,.1);border-color:rgba(41,128,185,.3)}
.rain-alert.dry{background:rgba(230,126,34,.1);border-color:rgba(230,126,34,.3)}
.rain-alert.good{background:rgba(45,106,79,.12);border-color:rgba(82,183,136,.25)}
.ra-icon{font-size:1.8rem;flex-shrink:0;margin-top:2px}
.ra-title{font-family:var(--fd);font-size:.85rem;letter-spacing:.04em;margin-bottom:5px}
.rain-alert.rain .ra-title{color:#74b9d6}
.rain-alert.dry .ra-title{color:#e67e22}
.rain-alert.good .ra-title{color:var(--gb)}
.ra-body{font-size:.75rem;color:var(--tm);line-height:1.8}
.ra-body strong{color:var(--t)}
.ra-tip{margin-top:8px;font-size:.72rem;background:rgba(0,0,0,.2);border-radius:6px;padding:7px 10px;color:var(--t);line-height:1.6}
.chips{display:flex;gap:8px;flex-wrap:wrap}
.chip{background:var(--bg3);border:1px solid var(--bdr);border-radius:8px;padding:8px 11px;
  display:flex;align-items:center;gap:8px;cursor:pointer;transition:border-color .2s}
.chip:hover{border-color:var(--bdrs)}
.farmer-count{display:inline-flex;align-items:center;gap:8px;background:rgba(82,183,136,.1);
  border:1px solid var(--bdr);border-radius:20px;padding:5px 14px;font-size:.72rem;color:var(--gb);margin-bottom:14px}
.farmer-count .dot{width:7px;height:7px;background:var(--gb);border-radius:50%;animation:pulse 2s ease infinite}
.scan-zone{border:2px dashed var(--bdr);border-radius:16px;padding:28px 20px;text-align:center;
  background:rgba(82,183,136,.03);transition:all .25s;position:relative;margin-bottom:14px;cursor:pointer}
.scan-zone:hover{border-color:var(--gb);background:rgba(82,183,136,.07)}
.scan-zone input[type=file]{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%}
.scan-icon{font-size:3rem;margin-bottom:10px;display:block}
.scan-title{font-family:var(--fd);font-size:.9rem;color:var(--t);letter-spacing:.05em;margin-bottom:6px}
.scan-sub{font-size:.72rem;color:var(--tm);line-height:1.6}
.scan-btns{display:flex;gap:10px;margin-bottom:14px;flex-wrap:wrap}
.scan-btn{flex:1;min-width:120px;padding:12px 16px;border:1px solid var(--bdrs);border-radius:10px;
  background:rgba(82,183,136,.06);color:var(--gb);font-family:var(--fd);font-size:.72rem;
  letter-spacing:.08em;cursor:pointer;transition:all .2s;display:flex;align-items:center;justify-content:center;gap:8px}
.scan-btn:hover{background:rgba(82,183,136,.13);border-color:var(--gb)}
.scan-btn.primary{background:linear-gradient(135deg,var(--gl),var(--g));color:white;border-color:transparent}
.scan-btn:disabled{opacity:.4;cursor:not-allowed}
.preview-wrap{position:relative;margin-bottom:14px;border-radius:12px;overflow:hidden;
  border:1px solid var(--bdr);background:var(--bg3)}
.preview-wrap img{width:100%;max-height:300px;object-fit:contain;display:block}
.preview-label{position:absolute;top:10px;left:10px;background:rgba(0,0,0,.6);
  border:1px solid var(--bdr);border-radius:20px;padding:3px 10px;font-size:.65rem;color:var(--gb)}
.preview-clear{position:absolute;top:10px;right:10px;background:rgba(192,57,43,.7);
  border:none;border-radius:50%;width:28px;height:28px;color:white;cursor:pointer;
  font-size:.9rem;display:flex;align-items:center;justify-content:center}
.result-card{border-radius:14px;padding:18px;margin-bottom:14px;border:1px solid}
.result-card.disease{background:rgba(192,57,43,.08);border-color:rgba(192,57,43,.3)}
.result-card.healthy{background:rgba(45,106,79,.1);border-color:rgba(82,183,136,.3)}
.result-card.unknown{background:rgba(139,94,60,.08);border-color:rgba(139,94,60,.3)}
.result-header{display:flex;align-items:center;gap:12px;margin-bottom:12px}
.result-icon{font-size:2.2rem}
.result-name{font-family:var(--fd);font-size:1rem;letter-spacing:.04em}
.result-card.disease .result-name{color:#f1948a}
.result-card.healthy .result-name{color:var(--gb)}
.result-card.unknown .result-name{color:#c9956a}
.result-confidence{font-size:.68rem;margin-top:3px;color:var(--tm)}
.cam-wrap{position:relative;width:100%;border-radius:12px;overflow:hidden;background:#000;margin-bottom:14px}
.cam-wrap video{width:100%;display:block;max-height:300px;object-fit:cover}
.cam-snap{position:absolute;bottom:12px;left:50%;transform:translateX(-50%);
  width:52px;height:52px;border-radius:50%;background:white;border:4px solid rgba(255,255,255,.4);
  cursor:pointer;transition:transform .2s;display:flex;align-items:center;justify-content:center;font-size:1.2rem}
.cam-snap:hover{transform:translateX(-50%) scale(1.05)}
.cam-close{position:absolute;top:10px;right:10px;background:rgba(0,0,0,.5);border:none;
  border-radius:50%;width:30px;height:30px;color:white;cursor:pointer;font-size:1rem;
  display:flex;align-items:center;justify-content:center}
@media(max-width:768px){.sidebar{display:none}.mobnav{display:block}}
@media(min-width:769px){.mobnav{display:none}}
`;

const wIcon = c => { if(c===0)return'☀️';if(c<=2)return'⛅';if(c<=3)return'☁️';if(c<=48)return'🌫️';if(c<=57)return'🌦️';if(c<=67)return'🌧️';if(c<=77)return'❄️';if(c<=82)return'🌦️';if(c<=86)return'🌨️';return'⛈️'; };
const wDesc = c => { if(c===0)return'Clear sky';if(c<=2)return'Partly cloudy';if(c<=3)return'Overcast';if(c<=48)return'Foggy';if(c<=57)return'Drizzle';if(c<=67)return'Rain';if(c<=77)return'Snow';if(c<=82)return'Rain showers';if(c<=86)return'Snow showers';return'Thunderstorm'; };
const CROPS = [
  {name:'Maize',icon:'🌽',rMin:500,rMax:800,tMin:18,tMax:32,soil:'Well-drained loamy',season:'3–4 months',npk:'120:60:40 kg/ha',spacing:'75×25cm',yld:'4–8 t/ha'},
  {name:'Rice',icon:'🌾',rMin:1000,rMax:2000,tMin:20,tMax:35,soil:'Clay/loamy waterlogged',season:'3–6 months',npk:'80:40:40 kg/ha',spacing:'20×20cm',yld:'3–6 t/ha'},
  {name:'Wheat',icon:'🌿',rMin:300,rMax:600,tMin:10,tMax:24,soil:'Clay loam',season:'4–5 months',npk:'100:50:50 kg/ha',spacing:'20cm rows',yld:'2–4 t/ha'},
  {name:'Soybean',icon:'🫘',rMin:450,rMax:700,tMin:20,tMax:30,soil:'Well-drained loamy',season:'3–5 months',npk:'20:60:40 kg/ha',spacing:'60×5cm',yld:'1.5–3 t/ha'},
  {name:'Tomato',icon:'🍅',rMin:400,rMax:600,tMin:18,tMax:29,soil:'Sandy loam',season:'2–3 months',npk:'100:80:80 kg/ha',spacing:'60×45cm',yld:'20–60 t/ha'},
  {name:'Cassava',icon:'🥔',rMin:500,rMax:1500,tMin:25,tMax:35,soil:'Sandy loam',season:'9–24 months',npk:'60:30:90 kg/ha',spacing:'1×1m',yld:'10–30 t/ha'},
  {name:'Banana',icon:'🍌',rMin:1200,rMax:2200,tMin:22,tMax:35,soil:'Deep rich loam',season:'9–12 months',npk:'200:30:300 kg/ha',spacing:'3×3m',yld:'20–40 t/ha'},
  {name:'Groundnut',icon:'🥜',rMin:400,rMax:700,tMin:24,tMax:33,soil:'Sandy loam',season:'3–5 months',npk:'20:40:40 kg/ha',spacing:'45×15cm',yld:'1–2.5 t/ha'},
  {name:'Sorghum',icon:'🌾',rMin:250,rMax:600,tMin:22,tMax:34,soil:'Drought-tolerant',season:'3–4 months',npk:'80:40:40 kg/ha',spacing:'75×20cm',yld:'2–5 t/ha'},
  {name:'Sweet Potato',icon:'🍠',rMin:500,rMax:800,tMin:21,tMax:30,soil:'Sandy loam',season:'3–5 months',npk:'40:60:80 kg/ha',spacing:'30×30cm',yld:'10–30 t/ha'},
  {name:'Cabbage',icon:'🥦',rMin:380,rMax:500,tMin:15,tMax:25,soil:'Fertile loam',season:'2–3 months',npk:'120:80:60 kg/ha',spacing:'60×45cm',yld:'20–40 t/ha'},
  {name:'Mango',icon:'🥭',rMin:900,rMax:1500,tMin:24,tMax:37,soil:'Deep alluvial',season:'5–6 yrs',npk:'100:50:100/tree',spacing:'10×10m',yld:'20–40 kg/tree'},
];
const cropScore = (c,rain,temp) => { const r=rain>=c.rMin&&rain<=c.rMax?100:rain<c.rMin?Math.max(0,100-(c.rMin-rain)/5):Math.max(0,100-(rain-c.rMax)/10);const t=temp>=c.tMin&&temp<=c.tMax?100:temp<c.tMin?Math.max(0,100-(c.tMin-temp)*10):Math.max(0,100-(temp-c.tMax)*10);return Math.round(r*0.6+t*0.4); };
const rainAlert = (wx) => { if(!wx)return null;const rain=wx.daily.precipitation_sum;const today=rain[0],next7=rain.slice(0,7).reduce((a,b)=>a+b,0);const nrd=rain.findIndex(r=>r>1);const rd=rain.filter(r=>r>0.5).length;if(today>5)return{type:'rain',icon:'🌧️',title:'Rain Today — Protect Your Crops',body:`<strong>${today.toFixed(1)}mm</strong> falling today. 7-day total: <strong>${next7.toFixed(0)}mm</strong> across <strong>${rd} rainy days</strong>.`,tip:'Avoid harvesting. Clear drainage channels. Hold off fertilizer.'};if(nrd===-1)return{type:'dry',icon:'☀️',title:'Dry Spell — No Rain in 14 Days',body:`Only <strong>${next7.toFixed(0)}mm</strong> over next 7 days.`,tip:'Irrigate moisture-sensitive crops. Mulch soil. Consider drought-tolerant crops.'};if(nrd<=2)return{type:'good',icon:'🌱',title:`Rain in ${nrd===0?'Hours':nrd+' Days'} — Prepare to Plant!`,body:`<strong>${rain[nrd].toFixed(1)}mm</strong> expected ${nrd===0?'today':nrd===1?'tomorrow':`in ${nrd} days`}. 7-day total: <strong>${next7.toFixed(0)}mm</strong>.`,tip:'Excellent planting window. Prepare seedbeds now.'};return{type:'good',icon:'🌤️',title:`Next Rain in ${nrd} Days`,body:`<strong>${rain[nrd].toFixed(1)}mm</strong> in ${nrd} days. 7-day total: <strong>${next7.toFixed(0)}mm</strong>.`,tip:'Good time for land prep. Check irrigation for crops in critical stages.'}; };
const reverseGeo = async (lat,lon) => { try{const r=await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);const d=await r.json();const a=d.address;return[a.village||a.town||a.city||a.county,a.state,a.country].filter(Boolean).join(', ');}catch{return`${lat.toFixed(4)}°, ${lon.toFixed(4)}°`;} };
const toBase64 = (file) => new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result.split(',')[1]);r.onerror=rej;r.readAsDataURL(file);});

export default function AgroSense() {
  useEffect(()=>{if(!document.getElementById('agro-css')){const s=document.createElement('style');s.id='agro-css';s.textContent=CSS;document.head.appendChild(s);}},[]);
  const [screen,setScreen]     = useState('auth');
  const [mode,setMode]         = useState('login');
  const [form,setForm]         = useState({name:'',email:'',password:'',phone:'',newPassword:''});
  const [err,setErr]           = useState('');
  const [ok,setOk]             = useState('');
  const [authLoad,setAuthLoad] = useState(false);
  const [showPass,setShowPass] = useState(false);
  const [showNewPass,setShowNewPass] = useState(false);
  const [me,setMe]             = useState(()=>JSON.parse(localStorage.getItem('agro_me')||'null'));
  const [tab,setTab]           = useState('overview');
  const [loc,setLoc]           = useState(null);
  const [locating,setLocating] = useState(false);
  const [wx,setWx]             = useState(null);
  const [wxLoad,setWxLoad]     = useState(false);
  const [aiText,setAiText]     = useState('');
  const [aiLoad,setAiLoad]     = useState(false);
  const [farmers,setFarmers]   = useState([]);
  const [farmLoad,setFarmLoad] = useState(false);
  const [scanImg,setScanImg]   = useState(null);
  const [scanPrev,setScanPrev] = useState(null);
  const [scanLoad,setScanLoad] = useState(false);
  const [scanRes,setScanRes]   = useState(null);
  const [camOn,setCamOn]       = useState(false);
  const videoRef = useRef(null);
  const canvasRef= useRef(null);
  const streamRef= useRef(null);
  const aiRan    = useRef(false);

  useEffect(()=>{if(me)setScreen('dash');},[]);
  useEffect(()=>{if(wx&&loc&&!aiRan.current){aiRan.current=true;runFarmAI(wx,loc);}},[wx,loc]);
  useEffect(()=>()=>{if(streamRef.current)streamRef.current.getTracks().forEach(t=>t.stop());},[]);

  const upd = v => setForm(p=>({...p,...v}));
  const sw  = m => {setMode(m);setErr('');setOk('');setForm({name:'',email:'',password:'',phone:'',newPassword:''});setShowPass(false);setShowNewPass(false);};

  const doAuth = async () => {
    setErr('');setOk('');setAuthLoad(true);
    try {
      if(mode==='register'){
        if(!form.name||!form.email||!form.password){setErr('All fields required.');setAuthLoad(false);return;}
        const ex=await sb.select('farmers',`email=eq.${encodeURIComponent(form.email)}&select=id`);
        if(ex?.length>0){setErr('Email already registered.');setAuthLoad(false);return;}
        const rows=await sb.insert('farmers',{name:form.name,email:form.email,phone:form.phone||null,password:form.password,created_at:new Date().toISOString(),last_login:new Date().toISOString()});
        const u=rows[0];
        localStorage.setItem('agro_me',JSON.stringify(u));
        setMe(u);setScreen('dash');
      } else if(mode==='login'){
        const rows=await sb.select('farmers',`email=eq.${encodeURIComponent(form.email)}&password=eq.${encodeURIComponent(form.password)}&select=*`);
        if(!rows?.length){setErr('Invalid email or password.');setAuthLoad(false);return;}
        await sb.update('farmers',`id=eq.${rows[0].id}`,{last_login:new Date().toISOString()});
        localStorage.setItem('agro_me',JSON.stringify(rows[0]));
        setMe(rows[0]);setScreen('dash');
      } else if(mode==='forgot'){
        if(!form.email){setErr('Enter your email.');setAuthLoad(false);return;}
        const rows=await sb.select('farmers',`email=eq.${encodeURIComponent(form.email)}&select=id`);
        if(!rows?.length){setErr('No account found with that email.');setAuthLoad(false);return;}
        if(!form.newPassword){setErr('Enter a new password.');setAuthLoad(false);return;}
        await sb.update('farmers',`id=eq.${rows[0].id}`,{password:form.newPassword});
        setOk('Password updated! You can now log in.');
        setTimeout(()=>sw('login'),2000);
      }
    } catch(e){setErr(`Error: ${e.message}`);}
    setAuthLoad(false);
  };

  const logout = ()=>{localStorage.removeItem('agro_me');setMe(null);setScreen('auth');setWx(null);setLoc(null);setAiText('');setScanImg(null);setScanPrev(null);setScanRes(null);aiRan.current=false;};

  const getLoc = ()=>{
    if(!navigator.geolocation)return alert('Geolocation not supported.');
    setLocating(true);aiRan.current=false;
    navigator.geolocation.getCurrentPosition(async pos=>{
      const{latitude:lat,longitude:lon}=pos.coords;
      const place=await reverseGeo(lat,lon);
      setLoc({lat,lon,place});setLocating(false);fetchWx(lat,lon);
      try{await sb.update('farmers',`id=eq.${me.id}`,{location_name:place,latitude:lat,longitude:lon});}catch{}
    },()=>{setLocating(false);alert('Location denied.');});
  };

  const fetchWx = async(lat,lon)=>{setWxLoad(true);try{const url=`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,precipitation,weathercode,relativehumidity_2m&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max,uv_index_max&current_weather=true&timezone=auto&forecast_days=14`;setWx(await(await fetch(url)).json());}catch(e){console.error(e);}setWxLoad(false);};

  const runFarmAI = async(wxD,locD)=>{
    setAiLoad(true);
    const rain14=wxD.daily.precipitation_sum.reduce((a,b)=>a+b,0);
    const rainEst=Math.round(rain14/14*365);
    const avgMax=(wxD.daily.temperature_2m_max.reduce((a,b)=>a+b,0)/wxD.daily.temperature_2m_max.length).toFixed(1);
    const avgMin=(wxD.daily.temperature_2m_min.reduce((a,b)=>a+b,0)/wxD.daily.temperature_2m_min.length).toFixed(1);
    const nrd=wxD.daily.precipitation_sum.findIndex(r=>r>1);
    const top5=CROPS.map(c=>({...c,score:cropScore(c,rainEst,parseFloat(avgMax))})).sort((a,b)=>b.score-a.score).slice(0,5).map(c=>`${c.icon}${c.name}(${c.score}%)`).join(', ');
    const prompt=`You are a senior agronomist advising a farmer in ${locD.place}.\nWeather: ${wxD.current_weather.temperature}°C, ${wDesc(wxD.current_weather.weathercode)}, Wind ${wxD.current_weather.windspeed}km/h\n14-day rain: ${rain14.toFixed(1)}mm | Est annual: ${rainEst}mm | Avg max: ${avgMax}°C | Avg min: ${avgMin}°C\nNext rain: ${nrd===-1?'none in 14 days':`in ${nrd} day(s) — ${wxD.daily.precipitation_sum[Math.max(0,nrd)]?.toFixed(1)}mm`}\nTop crops: ${top5}\n\nWrite a complete farm advisory:\n\n🌍 CLIMATE ZONE\n🌧️ RAINFALL ANALYSIS\n🌡️ TEMPERATURE PROFILE\n🌱 TOP 5 CROPS — for each: WHY it suits this location + one success tip\n📅 PLANTING CALENDAR — best months for top 3 crops\n⚠️ TOP 3 RISKS & SOLUTIONS\n💡 THIS WEEK'S ACTION PLAN — 3 steps to take right now\n\nBe specific and farmer-friendly.`;
    try{const res=await fetch('https://api.groq.com/openai/v1/chat/completions',{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${GROQ_KEY}`},body:JSON.stringify({model:'llama-3.3-70b-versatile',messages:[{role:'user',content:prompt}],max_tokens:1600,temperature:0.65})});const d=await res.json();if(d.choices?.[0]?.message?.content)setAiText(d.choices[0].message.content);else setAiText(`❌ ${d.error?.message||'API error.'}`);}catch(e){setAiText(`❌ ${e.message}`);}
    setAiLoad(false);
  };

  const handleFile = async(e)=>{const f=e.target.files?.[0];if(!f)return;setScanPrev(URL.createObjectURL(f));setScanImg(await toBase64(f));setScanRes(null);};
  const startCam = async()=>{try{const s=await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'}});streamRef.current=s;setCamOn(true);setTimeout(()=>{if(videoRef.current){videoRef.current.srcObject=s;videoRef.current.play();}},100);}catch{alert('Camera access denied.');}};
  const stopCam = ()=>{if(streamRef.current)streamRef.current.getTracks().forEach(t=>t.stop());setCamOn(false);};
  const snap = ()=>{const v=videoRef.current,c=canvasRef.current;if(!v||!c)return;c.width=v.videoWidth;c.height=v.videoHeight;c.getContext('2d').drawImage(v,0,0);const d=c.toDataURL('image/jpeg',.85);setScanPrev(d);setScanImg(d.split(',')[1]);setScanRes(null);stopCam();};

  const runScan = async()=>{
    if(!scanImg){alert('Upload or take a photo first.');return;}
    setScanLoad(true);setScanRes(null);
    const prompt=`You are an expert agricultural pathologist and veterinarian.\nAnalyze this image and respond in EXACTLY this format:\n\nSUBJECT: [crop/plant name OR animal species/breed]\nTYPE: [CROP or ANIMAL]\nHEALTH STATUS: [HEALTHY or DISEASED or UNKNOWN]\nIDENTIFIED AS: [disease name or "No disease detected"]\nCONFIDENCE: [High / Medium / Low]\n\nIDENTIFICATION DETAILS:\n[Describe what you see — species, variety, growth stage or age]\n\nDIAGNOSIS:\n[Symptoms visible, affected parts, severity]\n\nCAUSE:\n[Fungal/bacterial/viral/pest/nutritional/environmental]\n\nTREATMENT & MANAGEMENT:\n[Step-by-step treatment with specific products and dosages]\n\nPREVENTION:\n[How to prevent in future]\n\nURGENCY: [Immediate action needed / Monitor closely / No action needed]`;
    try{
      const res=await fetch('https://api.groq.com/openai/v1/chat/completions',{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${GROQ_KEY}`},body:JSON.stringify({model:'meta-llama/llama-4-scout-17b-16e-instruct',messages:[{role:'user',content:[{type:'text',text:prompt},{type:'image_url',image_url:{url:`data:image/jpeg;base64,${scanImg}`}}]}],max_tokens:1000,temperature:0.3})});
      const data=await res.json();
      if(data.choices?.[0]?.message?.content){
        const raw=data.choices[0].message.content;
        const get=(k)=>{const m=raw.match(new RegExp(`${k}:\\s*(.+)`));return m?m[1].trim():'–';};
        const getB=(k)=>{const m=raw.match(new RegExp(`${k}:\\n([\\s\\S]+?)(?=\\n[A-Z &]+:|$)`));return m?m[1].trim():'–';};
        setScanRes({subject:get('SUBJECT'),type:get('TYPE'),status:get('HEALTH STATUS'),disease:get('IDENTIFIED AS'),confidence:get('CONFIDENCE'),identification:getB('IDENTIFICATION DETAILS'),diagnosis:getB('DIAGNOSIS'),cause:getB('CAUSE'),treatment:getB('TREATMENT & MANAGEMENT'),prevention:getB('PREVENTION'),urgency:get('URGENCY')});
      } else {setScanRes({subject:'Unknown',type:'–',status:'UNKNOWN',disease:data.error?.message||'Analysis failed',confidence:'–',identification:'Could not process.',diagnosis:'–',cause:'–',treatment:'–',prevention:'–',urgency:'–'});}
    }catch(e){setScanRes({subject:'Error',type:'–',status:'UNKNOWN',disease:e.message,confidence:'–',identification:'–',diagnosis:'–',cause:'–',treatment:'–',prevention:'–',urgency:'–'});}
    setScanLoad(false);
  };

  const clearScan=()=>{setScanImg(null);setScanPrev(null);setScanRes(null);};
  const loadFarmers=async()=>{setFarmLoad(true);try{setFarmers(await sb.select('farmers','select=id,name,email,phone,location_name,created_at,last_login&order=created_at.desc')||[]);}catch(e){console.error(e);}setFarmLoad(false);};

  const rain14  = wx?wx.daily.precipitation_sum.reduce((a,b)=>a+b,0):0;
  const rainEst = Math.round(rain14/14*365);
  const avgTemp = wx?wx.daily.temperature_2m_max.reduce((a,b)=>a+b,0)/wx.daily.temperature_2m_max.length:25;
  const maxRain = wx?Math.max(...wx.daily.precipitation_sum,1):1;
  const humidity= wx?Math.round(wx.hourly.relativehumidity_2m.slice(0,24).reduce((a,b)=>a+b,0)/24):0;
  const ranked  = CROPS.map(c=>({...c,score:cropScore(c,rainEst,avgTemp)})).sort((a,b)=>b.score-a.score);
  const sLabel  = s=>s>=80?'Excellent':s>=60?'Good':'Fair';
  const sCls    = s=>s>=80?'ex':s>=60?'gd':'fr';
  const nowIdx  = wx?Math.max(wx.hourly.time.findIndex(t=>new Date(t)>=new Date()),0):0;
  const hourly  = wx?Array.from({length:12},(_,i)=>{const idx=nowIdx+i;if(idx>=wx.hourly.time.length)return null;return{time:new Date(wx.hourly.time[idx]).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}),temp:wx.hourly.temperature_2m[idx],rain:wx.hourly.precipitation[idx],code:wx.hourly.weathercode[idx],isNow:i===0};}).filter(Boolean):[];
  const alert   = rainAlert(wx);
  const stCls   = s=>s==='DISEASED'?'disease':s==='HEALTHY'?'healthy':'unknown';
  const stIco   = s=>s==='DISEASED'?'🦠':s==='HEALTHY'?'✅':'❓';

  const NAV=[{id:'overview',icon:'📊',label:'Overview'},{id:'rain',icon:'🌧️',label:'Rainfall'},{id:'crops',icon:'🌱',label:'Crops'},{id:'scan',icon:'🔬',label:'Scan'},{id:'ai',icon:'🤖',label:'AI Report'},{id:'farmers',icon:'👥',label:'Farmers'}];

  if(screen==='auth') return (
    <div className="aw">
      <div className="brand"><span className="brand-leaf">🌿</span><div className="brand-name">AGROSENSE</div><div className="brand-sub">Intelligent Farm Intelligence System</div></div>
      <div className="acard">
        <div className="abar"/>
        <div className="atabs">
          <button className={`atab ${mode==='login'?'on':''}`} onClick={()=>sw('login')}>LOGIN</button>
          <button className={`atab ${mode==='register'?'on':''}`} onClick={()=>sw('register')}>REGISTER</button>
        </div>
        <div className="abody">
          <div className="awelcome">
            <div className="wico">{mode==='forgot'?'🔑':mode==='login'?'👋':'🌱'}</div>
            <h3>{mode==='forgot'?'Reset Password':mode==='login'?'Welcome Back!':'Join AgroSense'}</h3>
            <p>{mode==='forgot'?'Enter your email and choose a new password.':mode==='login'?'Login to access live weather, crop recommendations, and AI disease scanning.':'Register to get AI-powered crop guidance, real-time weather, and disease detection for your farm.'}</p>
          </div>
          {err&&<div className="aerr">⚠️ {err}</div>}
          {ok&&<div className="aok">✅ {ok}</div>}
          {mode==='register'&&<>
            <div className="irow"><label>Full Name</label><input type="text" placeholder="e.g. John Banda" value={form.name} onChange={e=>upd({name:e.target.value})}/><span className="ico">👤</span></div>
            <div className="irow"><label>Phone (optional)</label><input type="tel" placeholder="+254 999 000 000" value={form.phone} onChange={e=>upd({phone:e.target.value})}/><span className="ico">📱</span></div>
          </>}
          <div className="irow"><label>Email Address</label><input type="email" placeholder="you@example.com" value={form.email} onChange={e=>upd({email:e.target.value})} onKeyDown={e=>e.key==='Enter'&&doAuth()}/><span className="ico">✉️</span></div>
          {mode!=='forgot'&&<div className="irow"><label>Password</label><input type={showPass?'text':'password'} placeholder="••••••••" value={form.password} onChange={e=>upd({password:e.target.value})} onKeyDown={e=>e.key==='Enter'&&doAuth()}/><button className="eye" onClick={()=>setShowPass(p=>!p)}>{showPass?'🙈':'👁️'}</button></div>}
          {mode==='forgot'&&<div className="irow"><label>New Password</label><input type={showNewPass?'text':'password'} placeholder="Enter new password" value={form.newPassword} onChange={e=>upd({newPassword:e.target.value})} onKeyDown={e=>e.key==='Enter'&&doAuth()}/><button className="eye" onClick={()=>setShowNewPass(p=>!p)}>{showNewPass?'🙈':'👁️'}</button></div>}
          {mode==='login'&&<button className="forgot-link" onClick={()=>sw('forgot')}>Forgot password?</button>}
          <button className="abtn" onClick={doAuth} disabled={authLoad}>{authLoad?'⏳ Please wait...':(mode==='forgot'?'RESET PASSWORD':mode==='login'?'LOGIN TO DASHBOARD':'CREATE MY ACCOUNT')}</button>
          {mode==='forgot'&&<p className="afooter"><span>Remember it? </span><button onClick={()=>sw('login')}>Back to Login</button></p>}
          {mode==='login'&&<p className="afooter"><span>No account? </span><button onClick={()=>sw('register')}>Sign Up Free</button></p>}
          {mode==='register'&&<p className="afooter"><span>Have account? </span><button onClick={()=>sw('login')}>Sign In</button></p>}
        </div>
      </div>
    </div>
  );

  return (
    <div className="dash">
      <div className="topbar">
        <div style={{display:'flex',alignItems:'center',gap:8}}><span style={{fontSize:'1.3rem'}}>🌿</span><div><div className="tbn">AGROSENSE</div><div className="tbs">FARM INTELLIGENCE</div></div></div>
        <div className="tbr"><div className="uchip"><div className="uav">{me?.name?.[0]?.toUpperCase()}</div><span style={{fontSize:'.72rem'}}>{me?.name?.split(' ')[0]}</span></div><button className="obtn" onClick={logout}>Sign Out</button></div>
      </div>
      <div className="db">
        <div className="sidebar">
          <div className="slbl">Navigation</div>
          {NAV.map(n=><div key={n.id} className={`ni ${tab===n.id?'act':''}`} onClick={()=>setTab(n.id)}><span className="nic">{n.icon}</span>{n.label}</div>)}
          <div style={{flex:1}}/>
          <div className="slbl">Farm Location</div>
          <div className="lcard">
            <div className="llbl">📍 Location</div>
            {loc?<><div className="lplace">{loc.place}</div><div className="lcoord">{loc.lat.toFixed(4)}°N {loc.lon.toFixed(4)}°E</div></>:<div className="lnone">Not set yet</div>}
            <button className="lbtn" onClick={getLoc} disabled={locating}>{locating?'📡 Detecting...':loc?'🔄 Refresh':'📡 Get My Location'}</button>
          </div>
        </div>

        <div className="ct">
          {tab==='overview'&&<>
            <div className="ph"><h2>🌿 Farm Overview</h2><p>{loc?loc.place:'Enable location for live data'}</p></div>
            <div style={{marginBottom:14,display:'flex',gap:10,alignItems:'center',flexWrap:'wrap'}}>
              <button className="lbtn" style={{width:'auto',padding:'10px 18px',borderRadius:9,fontSize:'.74rem'}} onClick={getLoc} disabled={locating}>{locating?'📡 Detecting...':`📡 ${loc?loc.place.split(',')[0]:'Get My Location'}`}</button>
              {wx&&<span style={{fontSize:'.68rem',color:'var(--gb)'}}>✅ Live data loaded</span>}
            </div>
            {!loc&&!wxLoad&&<div className="banner">🌍 Tap <strong>Get My Location</strong> to load real weather, rain forecasts and crop recommendations for your farm</div>}
            {wxLoad&&<div className="lbox"><div className="spin"/><div>Fetching live meteorological data...</div></div>}
            {wx&&<>
              {alert&&<div className={`rain-alert ${alert.type}`}><div className="ra-icon">{alert.icon}</div><div><div className="ra-title">{alert.title}</div><div className="ra-body" dangerouslySetInnerHTML={{__html:alert.body}}/><div className="ra-tip">💡 {alert.tip}</div></div></div>}
              <div className="sg four">{[{icon:'🌡️',label:'Temperature',val:wx.current_weather.temperature,unit:'°C',note:wDesc(wx.current_weather.weathercode)},{icon:'🌧️',label:'14-Day Rain',val:rain14.toFixed(0),unit:'mm',note:`≈${rainEst}mm/year`},{icon:'💧',label:'Humidity',val:humidity,unit:'%',note:'Current avg'},{icon:'💨',label:'Wind',val:wx.current_weather.windspeed,unit:'km/h',note:`Max ${Math.max(...wx.daily.windspeed_10m_max).toFixed(0)}km/h`}].map((s,i)=><div key={i} className="sc"><div className="sci">{s.icon}</div><div className="scl">{s.label}</div><div><span className="scv">{s.val}</span><span className="scu">{s.unit}</span></div><div className="scc">{s.note}</div></div>)}</div>
              <div className="card"><h4>⏰ Next 12 Hours</h4><div className="hscroll">{hourly.map((h,i)=><div key={i} className={`hchip ${h.isNow?'now':''}`}><div className="htime">{h.isNow?'NOW':h.time}</div><div className="hico">{wIcon(h.code)}</div><div className="htemp">{Math.round(h.temp)}°</div><div className="hrain">{h.rain>0?`${h.rain.toFixed(1)}mm`:'–'}</div></div>)}</div></div>
              <div className="card"><h4>🌱 Best Crops For Your Location</h4><div className="chips">{ranked.slice(0,6).map((c,i)=><div key={i} className="chip"><span style={{fontSize:'1.2rem'}}>{c.icon}</span><div><div style={{fontSize:'.78rem',color:'var(--t)',fontWeight:600}}>{c.name}</div><div style={{fontSize:'.62rem',color:c.score>=80?'var(--gb)':c.score>=60?'var(--gp)':'#c9956a'}}>{c.score}% match</div></div></div>)}</div><button className="action-btn" onClick={()=>setTab('ai')}>🤖 View Full AI Report →</button></div>
              <div className="card" style={{background:'linear-gradient(135deg,rgba(192,57,43,.06),rgba(9,26,15,.3))',borderColor:'rgba(192,57,43,.2)'}}><h4>🔬 Disease & Health Scanner</h4><p style={{fontSize:'.78rem',color:'var(--tm)',lineHeight:1.8,marginBottom:12}}>Take or upload a photo of any <strong style={{color:'var(--t)'}}>crop or animal</strong> to instantly identify species and detect diseases or health issues.</p><button className="action-btn" style={{marginTop:0}} onClick={()=>setTab('scan')}>🔬 Open Scanner →</button></div>
            </>}
          </>}

          {tab==='rain'&&<>
            <div className="ph"><h2>🌧️ Rainfall Tracker</h2><p>14-day forecast — Open-Meteo meteorological data</p></div>
            {!loc&&<div className="banner">📡 Enable location to load rainfall data</div>}
            {wxLoad&&<div className="lbox"><div className="spin"/><div>Loading...</div></div>}
            {wx&&<>
              {alert&&<div className={`rain-alert ${alert.type}`}><div className="ra-icon">{alert.icon}</div><div><div className="ra-title">{alert.title}</div><div className="ra-body" dangerouslySetInnerHTML={{__html:alert.body}}/><div className="ra-tip">💡 {alert.tip}</div></div></div>}
              <div className="sg">{[{label:'14-Day Total',val:rain14.toFixed(1),unit:'mm'},{label:'Est. Annual',val:rainEst,unit:'mm/yr'},{label:'Peak Day',val:Math.max(...wx.daily.precipitation_sum).toFixed(1),unit:'mm'},{label:'Rainy Days',val:wx.daily.precipitation_sum.filter(r=>r>0.5).length,unit:'/14 days'}].map((s,i)=><div key={i} className="sc"><div className="scl">{s.label}</div><div><span className="scv">{s.val}</span><span className="scu">{s.unit}</span></div></div>)}</div>
              <div className="card"><h4>📊 14-Day Rainfall Chart</h4><div className="rbars">{wx.daily.precipitation_sum.map((r,i)=><div key={i} className="rbw"><div className="rbar" style={{height:`${Math.max((r/maxRain)*100,2)}%`}} data-v={`${r.toFixed(1)}mm`}/><div className="rbl">{new Date(wx.daily.time[i]).getDate()}</div></div>)}</div></div>
              <div className="card"><h4>📅 Detailed Forecast</h4><div style={{overflowX:'auto'}}><table className="tbl"><thead><tr>{['Date','','Max','Min','Rain','Wind'].map(h=><th key={h}>{h}</th>)}</tr></thead><tbody>{wx.daily.time.map((t,i)=><tr key={i}><td className="hl">{new Date(t).toLocaleDateString([],{weekday:'short',month:'short',day:'numeric'})}</td><td>{wIcon(wx.daily.weathercode[i])}</td><td style={{color:'#f1948a'}}>{wx.daily.temperature_2m_max[i].toFixed(0)}°C</td><td style={{color:'#74b9d6'}}>{wx.daily.temperature_2m_min[i].toFixed(0)}°C</td><td style={{color:wx.daily.precipitation_sum[i]>0?'var(--gb)':'var(--tm)'}}>{wx.daily.precipitation_sum[i].toFixed(1)}mm</td><td>{wx.daily.windspeed_10m_max[i].toFixed(0)}km/h</td></tr>)}</tbody></table></div></div>
            </>}
          </>}

          {tab==='crops'&&<>
            <div className="ph"><h2>🌱 Crop Advisor</h2><p>12 crops scored against your real weather data</p></div>
            {!wx&&<div className="banner">📡 Enable location to score crops against your actual weather</div>}
            <div className="cgrid">{ranked.map((c,i)=><div key={i} className="cc"><div className="cico">{c.icon}</div><div className="cname">{c.name}</div><span className={`cbadge ${sCls(c.score)}`}>{sLabel(c.score)} — {c.score}%</span>{[['Rain',`${c.rMin}–${c.rMax}mm/yr`],['Temp',`${c.tMin}–${c.tMax}°C`],['Season',c.season],['Spacing',c.spacing],['N:P:K',c.npk],['Soil',c.soil],['Yield',c.yld]].map(([k,v])=><div key={k} className="cspec"><span className="k">{k}</span><span style={{color:'var(--t)'}}>{v}</span></div>)}</div>)}</div>
          </>}

          {tab==='scan'&&<>
            <div className="ph"><h2>🔬 Disease & Health Scanner</h2><p>Photo AI — identifies crops/animals and detects diseases instantly</p></div>
            {camOn&&<div className="cam-wrap"><video ref={videoRef} playsInline muted/><canvas ref={canvasRef} style={{display:'none'}}/><button className="cam-snap" onClick={snap}>📸</button><button className="cam-close" onClick={stopCam}>✕</button></div>}
            {!camOn&&<canvas ref={canvasRef} style={{display:'none'}}/>}
            {!camOn&&!scanPrev&&<div className="scan-zone"><input type="file" accept="image/*" onChange={handleFile}/><span className="scan-icon">🌿</span><div className="scan-title">Upload a Photo</div><div className="scan-sub">Take or upload a photo of a crop, plant leaf, animal or livestock to identify species and detect any disease or health issue</div></div>}
            {!scanPrev&&<div className="scan-btns"><button className="scan-btn primary" onClick={startCam} disabled={camOn}>📷 Take Photo</button><label className="scan-btn" style={{cursor:'pointer'}}>📁 Upload Image<input type="file" accept="image/*" style={{display:'none'}} onChange={handleFile}/></label></div>}
            {scanPrev&&<div className="preview-wrap"><img src={scanPrev} alt="scan"/><div className="preview-label">📸 Ready to scan</div><button className="preview-clear" onClick={clearScan}>✕</button></div>}
            {scanPrev&&!scanRes&&<div className="scan-btns"><button className="scan-btn primary" onClick={runScan} disabled={scanLoad}>{scanLoad?'⏳ Analyzing...':'🔬 Analyze Photo'}</button><button className="scan-btn" onClick={clearScan}>🔄 New Photo</button></div>}
            {scanLoad&&<div className="lbox"><div className="spin"/><div>AI is analyzing your photo...</div><div style={{fontSize:'.7rem',color:'var(--td)',marginTop:6}}>Identifying species and scanning for diseases</div></div>}
            {scanRes&&!scanLoad&&<>
              <div className={`result-card ${stCls(scanRes.status)}`}>
                <div className="result-header"><div className="result-icon">{stIco(scanRes.status)}</div><div><div className="result-name">{scanRes.disease}</div><div className="result-confidence"><strong style={{color:'var(--t)'}}>{scanRes.subject}</strong> · {scanRes.type} · Confidence: {scanRes.confidence}</div></div></div>
                {[{t:'🔍 Identification',b:scanRes.identification},{t:'🩺 Diagnosis',b:scanRes.diagnosis},{t:'🦠 Cause',b:scanRes.cause},{t:'💊 Treatment & Management',b:scanRes.treatment},{t:'🛡️ Prevention',b:scanRes.prevention}].map(s=>s.b&&s.b!=='–'&&<div key={s.t} style={{marginTop:10,background:'rgba(0,0,0,.18)',borderRadius:9,padding:'10px 13px'}}><div style={{fontSize:'.62rem',textTransform:'uppercase',letterSpacing:'.12em',color:'var(--tm)',marginBottom:5}}>{s.t}</div><div style={{fontSize:'.78rem',color:'var(--t)',lineHeight:1.8,whiteSpace:'pre-wrap'}}>{s.b}</div></div>)}
                {scanRes.urgency&&scanRes.urgency!=='–'&&<div style={{marginTop:12,padding:'8px 13px',borderRadius:8,background:scanRes.status==='DISEASED'?'rgba(192,57,43,.2)':'rgba(45,106,79,.15)',border:`1px solid ${scanRes.status==='DISEASED'?'rgba(192,57,43,.3)':'rgba(82,183,136,.3)'}`,fontSize:'.74rem',color:scanRes.status==='DISEASED'?'#f1948a':'var(--gb)',fontWeight:600}}>⚡ {scanRes.urgency}</div>}
              </div>
              <div className="scan-btns"><button className="scan-btn primary" onClick={clearScan}>🔄 Scan Another</button></div>
            </>}
          </>}

          {tab==='ai'&&<>
            <div className="ph"><h2>🤖 AI Farm Report</h2><p>Auto-generated by Groq Llama 3 70B when you enable location</p></div>
            {!loc&&<div className="banner">📍 Enable your location — AI analysis runs automatically</div>}
            <div className="aibox">
              <div className="aihead"><span style={{fontSize:'1.4rem'}}>🤖</span><div style={{flex:1}}><div style={{fontFamily:'var(--fd)',fontSize:'.9rem',color:'var(--t)'}}>Agricultural Intelligence Report</div>{loc&&<div style={{fontSize:'.68rem',color:'var(--tm)',marginTop:2}}>{loc.place}</div>}</div><span className="aibadge">GROQ AI</span></div>
              {aiLoad&&<div className="aidots"><div className="adot"/><div className="adot"/><div className="adot"/><span style={{marginLeft:4}}>Analyzing your farm with Llama 3 70B...</span></div>}
              {!aiLoad&&aiText&&<div className="aitext">{aiText}</div>}
              {!aiLoad&&!aiText&&<div style={{color:'var(--tm)',fontSize:'.78rem',lineHeight:1.85}}>Enable location to automatically generate your full farm advisory covering climate, rainfall, crop picks, planting calendar, risks, and action steps.</div>}
              {!aiLoad&&loc&&<button className="aibtn" onClick={()=>{aiRan.current=false;runFarmAI(wx,loc);}}>🔄 Regenerate Report</button>}
            </div>
          </>}

          {tab==='farmers'&&<>
            <div className="ph"><h2>👥 Registered Farmers</h2><p>Live from Supabase database</p></div>
            <button className="action-btn" style={{marginTop:0,marginBottom:14}} onClick={loadFarmers} disabled={farmLoad}>{farmLoad?'⏳ Loading...':'🔄 Load All Farmers'}</button>
            {farmers.length>0&&<><div className="farmer-count"><span className="dot"/><strong>{farmers.length}</strong> farmer{farmers.length!==1?'s':''} registered</div><div className="card" style={{padding:0,overflow:'hidden'}}><div style={{overflowX:'auto'}}><table className="tbl"><thead><tr>{['#','Name','Email','Phone','Location','Registered','Last Login'].map(h=><th key={h}>{h}</th>)}</tr></thead><tbody>{farmers.map((f,i)=><tr key={f.id||i}><td>{i+1}</td><td className="hl">{f.name}</td><td>{f.email}</td><td>{f.phone||'–'}</td><td>{f.location_name||'–'}</td><td>{f.created_at?new Date(f.created_at).toLocaleDateString():'-'}</td><td>{f.last_login?new Date(f.last_login).toLocaleDateString():'-'}</td></tr>)}</tbody></table></div></div></>}
            {farmers.length===0&&!farmLoad&&<div className="banner" style={{textAlign:'left'}}>Click <strong>Load All Farmers</strong> to fetch from Supabase.</div>}
          </>}
        </div>
      </div>
      <div className="mobnav"><div className="mobnav-row">{NAV.map(n=><button key={n.id} className={`mni ${tab===n.id?'act':''}`} onClick={()=>setTab(n.id)}><span className="mnic">{n.icon}</span>{n.label}</button>)}</div></div>
    </div>
  );
}