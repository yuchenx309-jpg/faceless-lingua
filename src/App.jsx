import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "./supabaseClient";

// ============================================================
// FACELESS LINGUA v3 — With Supabase Backend
// ============================================================

const CATEGORIES = [
  { id: "work", zh: "工作", en: "Work", color: "#FF69B4" },
  { id: "play", zh: "娛樂", en: "Play", color: "#4ECDC4" },
  { id: "growth", zh: "成長", en: "Growth", color: "#8B7355" },
  { id: "connection", zh: "連結", en: "Connection", color: "#E8A838" },
  { id: "survival", zh: "維生", en: "Survival", color: "#C0392B" },
  { id: "void", zh: "發呆", en: "Void", color: "#9B59B6" },
];

// Full native emoji set grouped by category
const EMOJI_DATA = {
  faces: ["😀","😃","😄","😁","😆","😅","🤣","😂","🙂","🙃","😉","😊","😇","🥰","😍","🤩","😘","😗","😚","😙","🥲","😋","😛","😜","🤪","😝","🤑","🤗","🤭","🤫","🤔","🫡","🤐","🤨","😐","😑","😶","🫥","😏","😒","🙄","😬","🤥","😌","😔","😪","🤤","😴","😷","🤒","🤕","🤢","🤮","🥵","🥶","🥴","😵","🤯","🤠","🥳","🥸","😎","🤓","🧐","😕","🫤","😟","🙁","😮","😯","😲","😳","🥺","🥹","😦","😧","😨","😰","😥","😢","😭","😱","😖","😣","😞","😓","😩","😫","🥱","😤","😡","😠","🤬","😈","👿","💀","☠️","💩","🤡","👹","👺","👻","👽","👾","🤖"],
  hands: ["👋","🤚","🖐️","✋","🖖","🫱","🫲","🫳","🫴","👌","🤌","🤏","✌️","🤞","🫰","🤟","🤘","🤙","👈","👉","👆","🖕","👇","☝️","🫵","👍","👎","✊","👊","🤛","🤜","👏","🙌","🫶","👐","🤲","🤝","🙏"],
  nature: ["🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐻‍❄️","🐨","🐯","🦁","🐮","🐷","🐸","🐵","🐔","🐧","🐦","🦆","🦅","🦉","🦇","🐺","🐗","🐴","🦄","🐝","🪱","🐛","🦋","🐌","🐞","🐜","🪰","🪲","🪳","🦟","🦗","🕷️","🌸","🌺","🌻","🌼","🌷","🌹","🪻","🌱","🌲","🌳","🌴","🌵","🍀","🍁","🍂","🍃","🪹","🪺","🌍","🌎","🌏","🌕","🌖","🌗","🌘","🌑","🌒","🌓","🌔","🌚","🌝","🌛","🌜","🌞","⭐","🌟","💫","✨","☀️","🌤️","⛅","🌥️","☁️","🌦️","🌧️","⛈️","🌩️","🌨️","❄️","☃️","⛄","🌬️","💨","🌪️","🌫️","🌈","☔","💧","💦","🌊"],
  food: ["🍎","🍊","🍋","🍌","🍉","🍇","🍓","🫐","🍈","🍒","🍑","🥭","🍍","🥥","🥝","🍅","🥑","🥦","🥬","🥒","🌽","🥕","🫒","🧄","🧅","🥔","🍠","🫘","🥐","🍞","🥖","🥨","🧀","🥚","🍳","🧈","🥞","🧇","🥓","🥩","🍗","🍖","🌭","🍔","🍟","🍕","🫓","🥪","🌮","🌯","🫔","🥗","🍝","🍜","🍲","🍛","🍣","🍱","🥟","🍤","🍙","🍘","🍥","🥠","🍡","🧁","🎂","🍰","🍮","🍭","🍬","🍫","🍩","🍪","🍦","🧋","☕","🍵"],
  objects: ["⌚","📱","💻","⌨️","🖥️","🖨️","🖱️","💾","💿","📷","📸","📹","🎥","📽️","📞","☎️","📺","📻","🎙️","🎚️","🎛️","⏱️","⏲️","⏰","🕰️","💡","🔦","🕯️","📔","📕","📖","📗","📘","📙","📚","📓","📒","📃","📜","📄","📰","🗞️","📑","🔖","🏷️","✉️","📧","📨","📩","📤","📥","📦","📫","📪","📬","📭","🗳️","✏️","✒️","🖊️","🖋️","📝","💼","📁","📂","🗂️","📅","📆","🗒️","🗓️","📇","📈","📉","📊","📋","📌","📍","📎","🖇️","📏","📐","✂️","🗃️","🗄️","🗑️","🔒","🔓","🔏","🔐","🔑","🗝️","🎨","🖌️","🖍️","🎭","🎪","🎵","🎶","🎹","🥁","🎸","🎺","🎻","🪕","🎷"],
  symbols: ["❤️","🧡","💛","💚","💙","💜","🖤","🤍","🤎","💔","❤️‍🔥","❤️‍🩹","❣️","💕","💞","💓","💗","💖","💝","💘","💟","🔴","🟠","🟡","🟢","🔵","🟣","⚫","⚪","🟤","🔺","🔻","🔸","🔹","🔶","🔷","🔳","🔲","▪️","▫️","◾","◽","◼️","◻️","🟥","🟧","🟨","🟩","🟦","🟪","⬛","⬜","🟫","💯","🔥","✨","⚡","💥","💫","🌟","⭐","🎯","♠️","♣️","♥️","♦️","🃏","🀄","➕","➖","➗","✖️","♾️","‼️","⁉️","❓","❗","〽️","⚠️","♻️","✅","❌","❎","➡️","⬅️","⬆️","⬇️","↗️","↘️","↙️","↖️","↕️","↔️","🔄"],
  travel: ["🚗","🚕","🚙","🚌","🚎","🏎️","🚓","🚑","🚒","🚐","🛻","🚚","🚛","🚜","🏍️","🛵","🚲","🛴","🛹","🛼","🚁","🛸","🚀","🛶","⛵","🚤","🛥️","🛳️","⛴️","🚢","✈️","🛩️","🛫","🛬","🪂","💺","🚂","🚃","🚄","🚅","🚆","🚇","🚈","🚉","🚊","🚝","🚞","🗼","🗽","🏰","🏯","🏟️","🎡","🎢","🎠","⛲","⛱️","🏖️","🏝️","🏜️","🌋","⛰️","🏔️","🗻","🏕️","🛖","🏠","🏡","🏘️","🏚️","🏗️","🏭","🏢","🏬","🏣","🏤","🏥","🏦","🏨","🏪","🏫","🏩","💒","🏛️","⛪","🕌","🕍","🛕","🕋","⛩️"],
};

const EMOJI_TAB_ICONS = [
  { key: "faces", icon: "😀" },
  { key: "hands", icon: "👋" },
  { key: "nature", icon: "🐶" },
  { key: "food", icon: "🍎" },
  { key: "objects", icon: "💡" },
  { key: "symbols", icon: "♥️" },
  { key: "travel", icon: "🚗" },
];

const CONTRIBUTORS_LIST = [
  "User_0001", "Caspian_X", "Pixel_Pioneer", "Alpha_Mode_99",
  "Zero_Logic", "Momo_Design", "Cyber_Flaneur", "Loon_Seeker",
  "Aether_01", "Root_Access", "Komorebi_7", "Ghost_In_Shell",
  "Vector_Soul", "Null_Pointer", "Atlas_Grid", "Neon_Scribe",
  "Bit_Walker", "Proto_Type_2",
];

// ============================================================
// Responsive hook
// ============================================================
function useWindowSize() {
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight });
  useEffect(() => {
    const handle = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);
  return size;
}

// ============================================================
// Supabase helpers
// ============================================================
async function fetchArtworks() {
  const { data, error } = await supabase
    .from("artwork")
    .select("*")
    .order("created-at", { ascending: false });
  if (error) {
    console.error("Error fetching artworks:", error);
    return [];
  }
  return data || [];
}

async function uploadArtwork({ userName, type, grid, gridSize }) {
  const { data, error } = await supabase
    .from("artwork")
    .insert([{ userName, type, grid, gridSize }])
    .select();
  if (error) {
    console.error("Error uploading artwork:", error);
    return null;
  }
  return data?.[0] || null;
}

// ============================================================
// Wavy SVG
// ============================================================
function WavyLine({ side }) {
  return (
    <img
      src={side === "right" ? "/wavyline-right.png" : "/wavyline-left.png"}
      alt=""
      style={{
        width: "100%",
        height: 200,
        objectFit: "contain",
        position: "absolute",
        top: 80,
        left: 0,
        zIndex: 0,
      }}
    />
  );
}
// ============================================================
// Category Label
// ============================================================
function CategoryLabel({ cat, onClick, style }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onClick={() => onClick(cat.id)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        cursor: "pointer",
        transform: hover ? "scale(1.25)" : "scale(1)",
        transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
        zIndex: 1,
        position: "relative",
        ...style,
      }}
    >
      <span style={{
        fontFamily: "'HYPixel 11px U', 'HYQiHei', sans-serif",
        fontSize: 11,
        fontWeight: "bold",
        color: cat.color,
        display: "inline",
        letterSpacing: 2,
      }}>
        {cat.zh}
      </span>
      <span style={{
        fontFamily: "'HYPixel 11px U', 'HYQiHei', sans-serif",
        fontSize: 11,
        color: cat.color,
        marginLeft: 4,
      }}>
        {cat.en}
      </span>
    </div>
  );
}

// ============================================================
// HOME PAGE
// ============================================================
function HomePage({ onNavigate }) {
  const { w } = useWindowSize();
  const isMobile = w < 768;
  const [loaded, setLoaded] = useState(false);
  const [bubbleHover, setBubbleHover] = useState(false);

  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#FAFAFA",
      display: "flex",
      flexDirection: "column",
      opacity: loaded ? 1 : 0,
      transition: "opacity 0.8s ease",
    }}>
      {/* Title — 左對齊, 旗黑字體, 大標題 */}
      <header style={{ padding: isMobile ? "24px 16px 40px" : "40px 40px 60px" }}>
        <h1 style={{
          fontFamily: "'HYQiHei', sans-serif",
          fontSize: isMobile ? 36 : 56,
          fontWeight: 400,
          color: "#222",
          margin: 0,
          textAlign: "left",
          letterSpacing: -1,
        }}>
          Faceless Lingua
        </h1>
      </header>

      {/* Grey content area */}
      <div style={{
        background: "#D5D5D5",
        position: "relative",
        minHeight: isMobile ? "auto" : 280,
        overflow: "visible",
      }}>
        {/* 目錄 contents — 在灰色區塊左上角裡面 */}
        <div style={{
          position: "absolute",
          top: isMobile ? 12 : 16,
          left: isMobile ? 12 : 20,
          zIndex: 2,
        }}>
          <span style={{
            fontFamily: "'HYPixel 11px U'",
            fontSize: 16,
            color: "#333",
            fontWeight: "bold",
            display: "block",
          }}>
            目錄
          </span>
          <span style={{
            fontFamily: "'HYPixel 11px U', 'HYQiHei', sans-serif",
            fontSize: 14,
            color: "#333",
          }}>
            contents
          </span>
        </div>

        {isMobile ? (
          /* ===== MOBILE LAYOUT ===== */
          <div style={{ padding: "50px 16px 24px" }}>
            {/* Emoji character */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
              <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div
                  onClick={() => onNavigate("about")}
                  onMouseEnter={() => setBubbleHover(true)}
                  onMouseLeave={() => setBubbleHover(false)}
                  style={{
                    width: 50, height: 42, background: "#fff", borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                    transform: bubbleHover ? "scale(1.15)" : "scale(1)",
                    transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                    position: "absolute", top: -20, right: -30, zIndex: 3,
                  }}
                >
                  <span style={{ fontSize: 16, letterSpacing: 1, color: "#333" }}>•••</span>
                  <div style={{ position: "absolute", bottom: -6, left: "25%", width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: "7px solid #fff" }} />
                </div>
                <div style={{ fontSize: 64, lineHeight: 1 }}>👩‍💻</div>
              </div>
            </div>
            <p style={{ fontFamily: "'HYPixel 11px U', 'HYQiHei', sans-serif", fontSize: 11, color: "#555", textAlign: "center", marginBottom: 16 }}>
              Someone who is working all the time.
            </p>
            {/* Categories in grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, width: "100%" }}>
              {CATEGORIES.map((cat) => (
                <CategoryLabel key={cat.id} cat={cat} onClick={(id) => onNavigate("category", id)} style={{ textAlign: "center" }} />
              ))}
            </div>
          </div>
        ) : (
          /* ===== DESKTOP LAYOUT ===== */
          <div style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            padding: "20px 40px 0",
            minHeight: 280,
            position: "relative",
          }}>
            {/* Left categories — 階梯式排列 */}
            <div style={{
              flex: "1 1 280px",
              maxWidth: 320,
              position: "relative",
              alignSelf: "stretch",
              paddingTop: 40,
            }}>
              <WavyLine side="life" />
              {/* 娛 Play — 最上面，往右偏 */}
              <CategoryLabel
                cat={CATEGORIES.find(c => c.id === "play")}
                onClick={(id) => onNavigate("category", id)}
                style={{ position: "relative", marginLeft: 60, marginBottom: 8 }}
              />
              {/* 工作 Work — 中間，最左邊 */}
              <CategoryLabel
                cat={CATEGORIES.find(c => c.id === "work")}
                onClick={(id) => onNavigate("category", id)}
                style={{ position: "relative", marginLeft: 0, marginBottom: 8 }}
              />
              {/* 成長 Growth — 最下面，更往右 */}
              <CategoryLabel
                cat={CATEGORIES.find(c => c.id === "growth")}
                onClick={(id) => onNavigate("category", id)}
                style={{ position: "relative", marginLeft: 100 }}
              />
            </div>

            {/* Center — Emoji character + speech bubble */}
            <div style={{
              flex: "0 0 auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              position: "relative",
              marginBottom: 0,
              zIndex: 2,
            }}>
              {/* Speech bubble — 右上方 */}
              

              {/* Emoji 小人 — 底部對齊灰色區塊 */}
              <div style={{ position: "relative", marginTop: 30 }}>
  <img src="/womanlight.png" alt="Woman working" style={{ width: 150, height: "auto", display: "block" }} />
  <img
    src="/speech.png"
    alt="Speech bubble"
    onClick={() => onNavigate("about")}
    onMouseEnter={() => setBubbleHover(true)}
    onMouseLeave={() => setBubbleHover(false)}
    style={{
      width: 80,
      height: "auto",
      position: "absolute",
      top: -30,
      right: -50,
      cursor: "pointer",
      transform: bubbleHover ? "scale(1.15)" : "scale(1)",
      transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
    }}
  />
</div>

              {/* "Someone who is working..." 文字在灰色區塊下方 */}
              <p style={{
                fontFamily: "'HYPixel 11px U', 'HYQiHei', sans-serif",
                fontSize: 14,
                color: "#666",
                marginTop: 8,
                marginBottom: -30,
                textAlign: "center",
                position: "relative",
                zIndex: 2,
              }}>
                Someone who is working all<br />the time.
              </p>
            </div>

            {/* Right categories — 階梯式排列 */}
            <div style={{
              flex: "1 1 280px",
              maxWidth: 320,
              position: "relative",
              alignSelf: "stretch",
              paddingTop: 40,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
            }}>
              <WavyLine side="right" />
              {/* 維生 Survival — 最上面，靠右 */}
              <CategoryLabel
                cat={CATEGORIES.find(c => c.id === "survival")}
                onClick={(id) => onNavigate("category", id)}
                style={{ position: "relative", marginRight: 0, marginBottom: 8 }}
              />
              {/* 連結 Connection — 中間 */}
              <CategoryLabel
                cat={CATEGORIES.find(c => c.id === "connection")}
                onClick={(id) => onNavigate("category", id)}
                style={{ position: "relative", marginRight: 80, marginBottom: 8 }}
              />
              {/* 發呆 Void — 最下面，最右邊 */}
              <CategoryLabel
                cat={CATEGORIES.find(c => c.id === "void")}
                onClick={(id) => onNavigate("category", id)}
                style={{ position: "relative", marginRight: 0 }}
              />
            </div>
          </div>
        )}
      </div>

      {/* "Someone who is working" text — outside grey box on desktop */}
      {!isMobile && <div style={{ height: 40 }} />}

      {/* Footer */}
      <footer style={{
        marginTop: "auto",
        padding: isMobile ? "30px 16px" : "40px",
        textAlign: "left",
        fontFamily: "'HYPixel 11px U', 'HYQiHei', sans-serif",
        fontSize: 15,
        color: "#555",
      }}>
        <p style={{ margin: "4px 0" }}>Email:yuchenx309@gmail.com</p>
        <p style={{ margin: "4px 0" }}>© 2025 XYC. Portfolio Website.</p>
      </footer>
    </div>
  );
}


// ============================================================
// ABOUT PAGE
// ============================================================
function AboutPage({ onNavigate }) {
  const { w } = useWindowSize();
  const isMobile = w < 768;
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#FAFAFA",
      padding: isMobile ? "24px 16px" : "40px",
      opacity: loaded ? 1 : 0,
      transition: "opacity 0.6s ease",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
        <BackButton label="About our project" onClick={() => onNavigate("home")} />
        <div style={{ display: "flex", gap: isMobile ? 12 : 24, alignItems: "flex-start" }}>
          <div onClick={() => onNavigate("contributors")} style={{ cursor: "pointer", textAlign: "center" }}>
  <p style={{ fontFamily: "'HYQiHei', sans-serif", fontSize: 12, color: "#333", margin: "0 0 4px 0" }}>Contributors</p>
  <img src="/notebook.png" alt="Contributors" style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 4 }} />
</div>
<div onClick={() => onNavigate("create")} style={{ cursor: "pointer", textAlign: "center" }}>
  <p style={{ fontFamily: "'HYQiHei', sans-serif", fontSize: 12, color: "#333", margin: "0 0 4px 0" }}>Join us</p>
  <img src="/joinbook.png" alt="Join us" style={{ width: 130, height: 120, objectFit: "cover", borderRadius: 4 }} />
</div>
        </div>
      </div>

      <div style={{
  display: "flex",
  gap: isMobile ? 24 : 40,
  marginTop: 32,
  flexDirection: isMobile ? "column" : "row",
}}>
  <div style={{ flex: "1 1 300px", maxWidth: isMobile ? "100%" : 500 }}>
    <img
      src="/faces.jpg"
      alt="Faces"
      style={{
        width: "100%",
        maxWidth: 300,
        borderRadius: 2,
        marginBottom: 16,
        display: "block",
      }}
    />
    <Dot />
    <p style={proseStyle}>
      The inception of this project stems from my observation of the "lightweight" phenomenon in daily communication. In the digital age, emojis have become one of our most ubiquitous languages. They are lighter than any text; a single symbol can transcend nationalities, languages, and cultural backgrounds, allowing any two people on Earth to exchange emotions with nearly zero barriers.
    </p>
  </div>
  <div style={{ flex: "1 1 300px", maxWidth: isMobile ? "100%" : 500, paddingTop: isMobile ? 0 : 60 }}>
          <p style={proseStyle}>
            However, I began to realize that a complex issue lies beneath this lightness. Emojis compress continuous, subtle, and multifaceted human expressions into dozens of standardized icons. We believe we are expressing emotions, but often, we are merely "performing" them. Every time we send an emoji, it is a choice—not of what to express, but of which mask to use for our self-presentation.
          </p>
          <p style={{ ...proseStyle, marginTop: 20 }}>
            Simultaneously, emojis represent a history of "who has the right to be seen." From the original monolithic icons to the gradual inclusion of diverse skin tones, genders, and disability symbols, every update is a discourse on inclusion and representation. This project seeks to re-examine this visual language: when we send an emoji, are we truly drawing closer to one another, or are we replacing our unique identity with a collective, standardized face?
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// CONTRIBUTORS PAGE (independent)
// ============================================================
function ContributorsPage({ onNavigate, contributors }) {
  const { w } = useWindowSize();
  const isMobile = w < 768;
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#FAFAFA",
      padding: isMobile ? "24px 16px" : "40px",
      opacity: loaded ? 1 : 0,
      transition: "opacity 0.6s ease",
    }}>
      <BackButton label="Contributors" onClick={() => onNavigate("about")} />

      <p style={{ ...proseStyle, textAlign: "left", maxWidth: 700, margin: "30px auto 24px", fontStyle: "italic" }}>
        Beyond the barriers of text, weaving resonance through symbols.
      </p>

      <div style={{
        maxWidth: 500,
        margin: "0 auto",
        background: "#B8A88A",
        borderRadius: 8,
        padding: isMobile ? 12 : 20,
        display: "flex",
        gap: isMobile ? 8 : 16,
        boxShadow: "3px 6px 20px rgba(0,0,0,0.25)",
      }}>
        <div style={{
          flex: "0 0 30%",
          background: "#A89878",
          borderRadius: 6,
          minHeight: 240,
          border: "2px dashed #9A8A6A",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <span style={{ fontSize: 32 }}>🖊️</span>
        </div>
        <div style={{
          flex: 1,
          background: "#fff",
          borderRadius: 4,
          padding: isMobile ? "12px 10px" : "16px 14px",
          maxHeight: 360,
          overflowY: "auto",
        }}>
          <p style={{ fontFamily: "'HYQiHei', sans-serif", fontSize: 13, fontWeight: "bold", margin: "0 0 10px 0", color: "#222" }}>
            User name
          </p>
          {contributors.map((name, i) => (
            <p key={`${name}-${i}`} style={{ fontFamily: "'HYQiHei', sans-serif", fontSize: 12, margin: "3px 0", color: "#333" }}>
              • {name}
            </p>
          ))}
        </div>
      </div>

      <p style={{ ...proseStyle, textAlign: "left", maxWidth: 700, margin: "28px auto 0" }}>
        Since the inception of this project, we have been collecting every non-standard soul here. Thanks to the builders who cross boundaries through symbols and graphics. Every line of code and every emoji array here is redefining how we connect.
      </p>
    </div>
  );
}

// ============================================================
// CATEGORY PAGE
// ============================================================
function CategoryPage({ categoryId, artworks, onNavigate }) {
  const { w } = useWindowSize();
  const isMobile = w < 768;
  const cat = CATEGORIES.find((c) => c.id === categoryId);
  const items = artworks.filter((a) => a.type === categoryId);
  const scrollRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

  // Auto-scroll using CSS animation
  const scrollContentRef = useRef(null);
  const [scrollWidth, setScrollWidth] = useState(0);

  useEffect(() => {
    const el = scrollContentRef.current;
    if (!el || items.length === 0) return;
    // Measure half the scroll content (original items width)
    const halfWidth = el.scrollWidth / 2;
    setScrollWidth(halfWidth);
  }, [items.length, isMobile]);

  if (!cat) return null;

  const cardSize = isMobile ? 200 : 280;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#FAFAFA",
      padding: isMobile ? "24px 16px" : "40px",
      opacity: loaded ? 1 : 0,
      transition: "opacity 0.6s ease",
    }}>
      <BackButton label={cat.en} onClick={() => onNavigate("home")} />

      {items.length === 0 ? (
        <div style={{
          textAlign: "left",
          marginTop: 80,
          fontFamily: "'HYQiHei', sans-serif",
          color: "#999",
          fontSize: 16,
        }}>
          <p style={{ fontSize: 48, marginBottom: 16 }}>🫥</p>
          <p>No artworks yet. Be the first to create one!</p>
          <button
            onClick={() => onNavigate("create")}
            style={{
              marginTop: 16,
              fontFamily: "'HYQiHei', sans-serif",
              fontSize: 14,
              padding: "10px 24px",
              background: "#333",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Create →
          </button>
        </div>
      ) : (
        <div
          ref={scrollRef}
          style={{
            overflow: "hidden",
            marginTop: 30,
            paddingBottom: 20,
          }}
        >
          <div
            ref={scrollContentRef}
            style={{
              display: "flex",
              gap: isMobile ? 16 : 24,
              width: "max-content",
              animation: scrollWidth > 0 ? `marqueeScroll ${items.length * 5}s linear infinite` : "none",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.animationPlayState = "paused"; }}
            onMouseLeave={(e) => { e.currentTarget.style.animationPlayState = "running"; }}
            onTouchStart={(e) => { e.currentTarget.style.animationPlayState = "paused"; }}
            onTouchEnd={(e) => { e.currentTarget.style.animationPlayState = "running"; }}
          >
            {/* Render items twice for seamless loop */}
            {[...items, ...items].map((art, i) => (
              <div key={`${art.id || i}-${i}`} style={{ flexShrink: 0, width: cardSize }}>
                <div style={{
                  width: cardSize,
                  height: cardSize,
                  background: art.grid
                    ? "#f5f5f5"
                    : `linear-gradient(135deg, ${cat.color}22 0%, ${cat.color}44 100%)`,
                  border: "1px solid #ddd",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 2,
                  overflow: "hidden",
                }}>
                  {art.grid ? (
                    <MiniEmojiGrid grid={art.grid} gridSize={art.gridSize} containerSize={cardSize} />
                  ) : (
                    <span style={{ fontFamily: "'HYQiHei', sans-serif", fontSize: 13, color: "#999" }}>
                      [ emoji artwork ]
                    </span>
                  )}
                </div>
                <p style={{ fontFamily: "'HYQiHei', sans-serif", fontSize: 12, color: "#555", marginTop: 8 }}>
                  {art.userName}
                </p>
              </div>
            ))}
          </div>
          <style>{`
            @keyframes marqueeScroll {
              0% { transform: translateX(0); }
              100% { transform: translateX(-${scrollWidth}px); }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}

// ============================================================
// Mini Emoji Grid (renders saved artworks)
// ============================================================
function MiniEmojiGrid({ grid, gridSize, containerSize }) {
  const cellSize = containerSize / gridSize;
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)` }}>
      {grid.map((cell, i) => (
        <div key={i} style={{
          width: cellSize,
          height: cellSize,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: cellSize * 0.7,
          lineHeight: 1,
        }}>
          {cell || ""}
        </div>
      ))}
    </div>
  );
}

// ============================================================
// CREATE PAGE
// ============================================================
function CreatePage({ onNavigate, onUpload }) {
  const { w } = useWindowSize();
  const isMobile = w < 768;
  const [loaded, setLoaded] = useState(false);
  const [userName, setUserName] = useState("");
  const [gridSize, setGridSize] = useState(7);
  const [selectedType, setSelectedType] = useState("work");
  const [hasBackdrop, setHasBackdrop] = useState(false);
  const [fillColor, setFillColor] = useState("#CCCCCC");
  const [selectedEmoji, setSelectedEmoji] = useState("😀");
  const [grid, setGrid] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [emojiTab, setEmojiTab] = useState("faces");
  const [uploadHover, setUploadHover] = useState(false);
  const [isEraser, setIsEraser] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);
  useEffect(() => { setGrid(Array(gridSize * gridSize).fill(null)); }, [gridSize]);

  const handleCellClick = (index) => {
    const newGrid = [...grid];
    if (isEraser) {
      newGrid[index] = null;
    } else {
      newGrid[index] = newGrid[index] === selectedEmoji ? null : selectedEmoji;
    }
    setGrid(newGrid);
  };

  const handleUpload = async () => {
    if (!userName.trim()) {
      alert("Please enter your user name!");
      return;
    }
    const hasContent = grid.some((cell) => cell !== null);
    if (!hasContent) {
      alert("Please create some emoji art first!");
      return;
    }

    setUploading(true);

    try {
      // Upload to Supabase
      const result = await uploadArtwork({
        userName: userName.trim(),
        type: selectedType,
        grid: grid,
        gridSize: gridSize,
      });

      if (result) {
        setShowSuccess(true);
        setTimeout(() => {
          setFadeOut(true);
          setTimeout(() => {
            onUpload(); // trigger re-fetch
            onNavigate("category", selectedType);
          }, 1500);
        }, 2500);
      } else {
        alert("Upload failed. Please try again!");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed. Please try again!");
    } finally {
      setUploading(false);
    }
  };

  if (showSuccess) return <SuccessPage fadeOut={fadeOut} />;

  const cellSize = Math.min(isMobile ? 32 : 40, (isMobile ? (w - 64) : 400) / gridSize);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#FAFAFA",
      padding: isMobile ? "24px 16px" : "40px",
      opacity: loaded ? 1 : 0,
      transition: "opacity 0.6s ease",
    }}>
      <BackButton label="Create Your Own Emoji Puzzle" onClick={() => onNavigate("about")} />

      <div style={{ display: "flex", gap: isMobile ? 24 : 40, flexDirection: isMobile ? "column" : "row", marginTop: 24 }}>
        {/* Left panel */}
        <div style={{ flex: "0 0 auto", width: isMobile ? "100%" : 320 }}>
          <Field label="user name:">
            <input value={userName} onChange={(e) => setUserName(e.target.value)} style={inputStyle} placeholder="Enter your name" />
          </Field>

          <Field label="size:">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input type="range" min={3} max={20} value={gridSize} onChange={(e) => setGridSize(Number(e.target.value))} style={{ flex: 1 }} />
              <input type="number" min={3} max={20} value={gridSize} onChange={(e) => setGridSize(Math.max(3, Math.min(20, Number(e.target.value))))}
                style={{ ...inputStyle, width: 54, textAlign: "left", padding: "6px 4px" }} />
            </div>
          </Field>

          <Field label="type:">
            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} style={inputStyle}>
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.zh} {cat.en}</option>
              ))}
            </select>
          </Field>

          <div style={{ display: "flex", gap: 20, marginBottom: 18, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <label style={labelStyle}>Square Backdrop</label>
              <input type="checkbox" checked={hasBackdrop} onChange={(e) => setHasBackdrop(e.target.checked)} style={{ width: 18, height: 18, cursor: "pointer" }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <label style={labelStyle}>Fill Color</label>
              <input type="color" value={fillColor} onChange={(e) => setFillColor(e.target.value)} style={{ width: 32, height: 26, border: "none", cursor: "pointer", background: "none" }} />
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
            <ToolButton active={!isEraser} onClick={() => setIsEraser(false)} label="✏️ Draw" />
            <ToolButton active={isEraser} onClick={() => setIsEraser(true)} label="🧹 Erase" />
            <ToolButton onClick={() => setGrid(Array(gridSize * gridSize).fill(null))} label="🗑️ Clear" />
          </div>

          {/* Emoji picker */}
          <div style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12, background: "#fff" }}>
            <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
              <div style={{
                flex: 1, background: "#f0f0f0", borderRadius: 8, padding: "6px 10px",
                fontFamily: "'HYQiHei', sans-serif", fontSize: 12, color: "#999",
              }}>🔍 描述表情符號</div>
              <div style={{
                background: "#f0f0f0", borderRadius: 8, padding: "6px 10px",
                fontFamily: "'HYQiHei', sans-serif", fontSize: 11, color: "#4A90D9", fontWeight: "bold",
              }}>✨ Genmoji</div>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: `repeat(${isMobile ? 7 : 8}, 1fr)`,
              gap: 2,
              maxHeight: 200,
              overflowY: "auto",
              scrollbarWidth: "thin",
            }}>
              {(EMOJI_DATA[emojiTab] || []).map((emoji, i) => (
                <div
                  key={`${emojiTab}-${i}`}
                  onClick={() => { setSelectedEmoji(emoji); setIsEraser(false); }}
                  style={{
                    fontSize: isMobile ? 22 : 26,
                    cursor: "pointer",
                    padding: 3,
                    borderRadius: 6,
                    textAlign: "left",
                    background: selectedEmoji === emoji && !isEraser ? "#DCE8FF" : "transparent",
                    transition: "background 0.12s",
                  }}
                >
                  {emoji}
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 4, marginTop: 8, paddingTop: 8, borderTop: "1px solid #eee", justifyContent: "space-around" }}>
              {EMOJI_TAB_ICONS.map((t) => (
                <span
                  key={t.key}
                  onClick={() => setEmojiTab(t.key)}
                  style={{
                    fontSize: 18, cursor: "pointer",
                    opacity: emojiTab === t.key ? 1 : 0.4,
                    transition: "opacity 0.2s",
                    padding: "2px 4px",
                    borderBottom: emojiTab === t.key ? "2px solid #333" : "2px solid transparent",
                  }}
                >{t.icon}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ ...proseStyle, marginBottom: 20, maxWidth: 460 }}>
            Unleash your creativity! Turn unique emoji tiles into stunning art. Piece together your imagination, upload your masterpiece, and share it with the world!
          </p>

          <div style={{ marginBottom: 12, fontFamily: "'HYQiHei', sans-serif", fontSize: 13, color: "#666" }}>
            {isEraser ? "🧹 Eraser mode" : `Selected: ${selectedEmoji}`}
          </div>

          <div style={{
            display: "inline-grid",
            gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`,
            gap: 0,
            background: hasBackdrop ? fillColor : "#f5f5f5",
            padding: 2,
            borderRadius: 2,
            border: "1px solid #ddd",
          }}>
            {grid.map((cell, i) => (
              <div
                key={i}
                onClick={() => handleCellClick(i)}
                style={{
                  width: cellSize,
                  height: cellSize,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: cellSize * 0.7,
                  cursor: isEraser ? "crosshair" : "pointer",
                  background: cell ? "transparent" : (hasBackdrop ? fillColor : "rgba(255,255,255,0.3)"),
                  border: "0.5px solid rgba(0,0,0,0.06)",
                  userSelect: "none",
                  lineHeight: 1,
                }}
              >
                {cell || ""}
              </div>
            ))}
          </div>

          <div style={{ marginTop: 28, textAlign: "right" }}>
            <button
              onClick={handleUpload}
              disabled={uploading}
              onMouseEnter={() => setUploadHover(true)}
              onMouseLeave={() => setUploadHover(false)}
              style={{
                fontFamily: "'HYQiHei', sans-serif",
                fontSize: 15,
                padding: "10px 32px",
                background: uploading ? "#999" : (uploadHover ? "#333" : "#E0E0E0"),
                color: uploading ? "#fff" : (uploadHover ? "#fff" : "#333"),
                border: "1px solid #bbb",
                borderRadius: 4,
                cursor: uploading ? "not-allowed" : "pointer",
                transform: uploadHover && !uploading ? "scale(1.08)" : "scale(1)",
                transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
              }}
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SUCCESS PAGE
// ============================================================
function SuccessPage({ fadeOut }) {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#FAFAFA",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 40,
      opacity: fadeOut ? 0 : 1,
      transition: "opacity 1.5s ease",
    }}>
      <div style={{ maxWidth: 500, textAlign: "left" }}>
        <div style={{ fontSize: 72, marginBottom: 24 }}>🖨️</div>
        <Dot />
        <p style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: 17,
          lineHeight: 2.4,
          color: "#333",
          fontStyle: "italic",
          marginTop: 20,
        }}>
          We think we live in different situations,
          <br />
          <span style={{ paddingLeft: 30 }}>but in fact we are always repeating similar feelings,</span>
          <br />
          <span style={{ paddingLeft: 70 }}>just with different masks.</span>
        </p>
      </div>
    </div>
  );
}

// ============================================================
// SHARED COMPONENTS
// ============================================================
function BackButton({ label, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", marginBottom: 8 }}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <span style={{
        fontSize: 26,
        fontFamily: "'HYQiHei', sans-serif",
        color: "#222",
        transform: hover ? "translateX(-4px)" : "none",
        transition: "transform 0.2s",
      }}>←</span>
      <h1 style={{
        fontFamily: "'HYQiHei', sans-serif",
        fontSize: "clamp(22px, 3.5vw, 44px)",
        fontWeight: 400,
        margin: 0,
        color: "#222",
      }}>
        {label}
      </h1>
    </div>
  );
}

function NavChip({ label, emoji, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        cursor: "pointer",
        textAlign: "left",
        transform: hover ? "scale(1.1)" : "scale(1)",
        transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
      }}
    >
      <p style={{ fontFamily: "'HYQiHei', sans-serif", fontSize: 12, color: "#333", margin: "0 0 4px 0" }}>{label}</p>
      <div style={{
        width: 70, height: 80,
        background: "linear-gradient(135deg, #E8E0D4 0%, #F5F0EA 100%)",
        borderRadius: 4,
        boxShadow: "1px 2px 8px rgba(0,0,0,0.1)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 24,
      }}>
        {emoji}
      </div>
    </div>
  );
}

function Dot() {
  return <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#222", margin: "0 0 14px 0" }} />;
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

function ToolButton({ active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: "'HYQiHei', sans-serif",
        fontSize: 12,
        padding: "5px 10px",
        background: active ? "#333" : "#eee",
        color: active ? "#fff" : "#333",
        border: "1px solid #ccc",
        borderRadius: 4,
        cursor: "pointer",
        transition: "all 0.2s",
      }}
    >
      {label}
    </button>
  );
}

// ============================================================
// STYLES
// ============================================================
const labelStyle = {
  fontFamily: "'HYQiHei', sans-serif",
  fontSize: 13,
  color: "#333",
  display: "block",
  marginBottom: 5,
};

const inputStyle = {
  fontFamily: "'HYQiHei', sans-serif",
  fontSize: 14,
  padding: "8px 12px",
  border: "1px solid #ccc",
  borderRadius: 4,
  width: "100%",
  boxSizing: "border-box",
  outline: "none",
  background: "#fff",
  color: "#222",
};

const proseStyle = {
  fontFamily: "'HYQiHei', sans-serif",
  fontSize: 14,
  lineHeight: 1.8,
  color: "#333",
  margin: 0,
  textAlign: "left",
};

// ============================================================
// APP — Main with Supabase data loading
// ============================================================
export default function App() {
  const [page, setPage] = useState("home");
  const [categoryId, setCategoryId] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const [contributors, setContributors] = useState([...CONTRIBUTORS_LIST]);
  const [loading, setLoading] = useState(true);

  // Load artworks from Supabase on first render
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchArtworks();
      setArtworks(data);

      // Extract unique usernames and merge with default list
      const dbUsers = data.map((a) => a.userName).filter(Boolean);
      const allUsers = [...new Set([...CONTRIBUTORS_LIST, ...dbUsers])];
      setContributors(allUsers);

      setLoading(false);
    }
    loadData();
  }, []);

  const handleNavigate = useCallback((target, data) => {
    if (target === "category") {
      setCategoryId(data);
      setPage("category");
    } else {
      setPage(target);
    }
    window.scrollTo(0, 0);
  }, []);

  const handleUpload = useCallback(async () => {
    // Re-fetch all artworks from Supabase
    const data = await fetchArtworks();
    setArtworks(data);
    const dbUsers = data.map((a) => a.userName).filter(Boolean);
    const allUsers = [...new Set([...CONTRIBUTORS_LIST, ...dbUsers])];
    setContributors(allUsers);
  }, []);

  // Loading screen
  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#FAFAFA",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'HYQiHei', sans-serif",
        fontSize: 16,
        color: "#666",
      }}>
        <div style={{ textAlign: "left" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>👩‍💻</div>
          <p>Loading Faceless Lingua...</p>
        </div>
      </div>
    );
  }

  const props = { onNavigate: handleNavigate };

  switch (page) {
    case "home":
      return <HomePage {...props} />;
    case "about":
      return <AboutPage {...props} />;
    case "contributors":
      return <ContributorsPage {...props} contributors={contributors} />;
    case "category":
      return <CategoryPage {...props} categoryId={categoryId} artworks={artworks} />;
    case "create":
      return <CreatePage {...props} onUpload={handleUpload} />;
    default:
      return <HomePage {...props} />;
  }
}
