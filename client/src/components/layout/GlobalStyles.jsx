
export default function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,500;1,600&family=Cinzel:wght@500;600&family=Jost:ital,wght@0,300;0,400;0,500;1,400&display=swap');

      :root{
        --maroon-950:#2C0812;
        --maroon-800:#5C1225;
        --gold-500:#C89B3C;
        --gold-300:#E8CB86;
        --ivory-50:#FBF3E7;
        --ink-900:#241713;
        --emerald-700:#1F4436;
        --terracotta-700:#8A4A2A;
      }

      *{ box-sizing:border-box; }
      html{ scroll-behavior:smooth; }
      body{ margin:0; }

      .kashida-root{
        background:var(--ivory-50);
        color:var(--ink-900);
        font-family:'Jost', sans-serif;
        font-weight:300;
        overflow-x:hidden;
      }

      .kashida-root a{ text-decoration:none; color:inherit; }
      .kashida-root button{ font-family:inherit; cursor:pointer; }

      .kashida-root :focus-visible{
        outline:2px solid var(--gold-500);
        outline-offset:3px;
      }

      .eyebrow{
        font-family:'Cinzel', serif;
        font-size:12px;
        letter-spacing:0.28em;
        text-transform:uppercase;
        color:var(--terracotta-700);
        margin:0 0 14px;
      }
      .eyebrow--light{ color:var(--gold-300); }

      .h2{
        font-family:'Cormorant Garamond', serif;
        font-weight:500;
        font-style:italic;
        font-size:clamp(28px,4vw,44px);
        margin:0;
        line-height:1.15;
      }
      .h2--light{ color:var(--ivory-50); }
      .h2--stitched{
        display:inline-block;
        border-bottom:1px dashed var(--gold-500);
        padding-bottom:10px;
      }

      .body-text{
        font-size:15.5px;
        line-height:1.85;
        color:#4a3a34;
        max-width:46ch;
      }

      .btn{
        display:inline-flex;
        align-items:center;
        justify-content:center;
        padding:14px 30px;
        font-family:'Cinzel', serif;
        font-size:12px;
        letter-spacing:0.18em;
        text-transform:uppercase;
        border-radius:2px;
        border:1px solid transparent;
        transition:transform .35s ease, background .35s ease, color .35s ease, border-color .35s ease;
      }
      .btn--gold{
        background:var(--gold-500);
        color:var(--maroon-950);
      }
      .btn--gold:hover{ background:var(--gold-300); transform:translateY(-2px); }
.btn--ghost {
  background: rgba(200, 155, 60, 0.05);
  border: 1px solid var(--gold-500);
  color: var(--gold-500) !important; /* Force visible gold text initially */
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), 
              background 0.35s ease, 
              color 0.35s ease, 
              border-color 0.35s ease;
}

/* Hover state */
.btn--ghost:hover {
  background: rgba(200, 155, 60, 0.15);
  border-color: var(--gold-300);
  color: var(--gold-300) !important;
  transform: translateY(-2px);
}

/* Prevent default link visited or focus color shifts */
.btn--ghost:visited,
.btn--ghost:focus {
  color: var(--gold-500);
}

.btn--ghost:hover:visited {
  color: var(--gold-300);
}

      /* ---------- Top bar + Navbar ---------- */
      .topbar{
        display:flex; align-items:center; justify-content:center; gap:24px;
        padding:7px 28px;
        border-bottom:1px solid rgba(232,203,134,0.18);
        max-height:32px;
        overflow:hidden;
        opacity:1;
        transition:max-height .4s ease, opacity .3s ease, padding .4s ease;
        position:relative;
      }
      .nav--solid .topbar{ max-height:0; opacity:0; padding-top:0; padding-bottom:0; border-color:transparent; }
      .topbar__msg{
        font-size:11.5px; letter-spacing:0.03em; color:rgba(251,243,231,0.75);
      }
      .topbar__msg a{ color:var(--gold-300); text-decoration:underline; text-underline-offset:2px; }
      .topbar__social{ display:flex; gap:12px; position:absolute; right:28px; color:rgba(251,243,231,0.7); }
      @media (max-width:640px){ .topbar__social{ display:none; } }

      .nav{
        position:fixed; top:0; left:0; right:0; z-index:50;
        transition:background .4s ease, box-shadow .4s ease;
      }
      .nav--solid{
        background:var(--ivory-50);
        box-shadow:0 4px 24px rgba(44,8,18,0.08);
      }
      .nav__inner{
        max-width:1240px; margin:0 auto; padding:16px 28px;
        display:flex; align-items:center; justify-content:space-between;
        transition:padding .4s ease;
      }
      .nav--solid .nav__inner{ padding:10px 28px; }
      .nav__logo{
        font-family:'Cinzel', serif;
        font-size:20px;
        letter-spacing:0.22em;
        color:var(--gold-300);
      }
      .nav--solid .nav__logo{ color:var(--maroon-800); }
      .nav__links{ display:flex; gap:32px; }
      .nav__link{
        font-family:'Cinzel', serif;
        font-size:11px;
        letter-spacing:0.14em;
        text-transform:uppercase;
        color:var(--ivory-50);
        position:relative;
        padding-bottom:4px;
      }
      .nav--solid .nav__link{ color:var(--ink-900); }
      .nav__link::after{
        content:''; position:absolute; left:0; bottom:0; width:0; height:1px;
        background:var(--gold-500); transition:width .3s ease;
      }
      .nav__link:hover::after{ width:100%; }
      .nav__icons{ display:flex; align-items:center; gap:16px; }
      .icon-btn{
        background:none; border:none; color:var(--ivory-50);
        display:flex; padding:4px; position:relative;
        transition:transform .25s ease, color .25s ease;
      }
      .icon-btn:hover{ transform:translateY(-2px); color:var(--gold-300); }
      .nav--solid .icon-btn{ color:var(--ink-900); }
      .icon-btn--badge::after{
        content:attr(data-badge);
        position:absolute; top:-6px; right:-7px;
        width:15px; height:15px; border-radius:50%;
        background:var(--maroon-800); color:var(--ivory-50);
        font-size:9px; line-height:15px; text-align:center;
        font-family:'Jost', sans-serif;
      }
      .nav--solid .icon-btn--badge::after{ background:var(--gold-500); color:var(--maroon-950); }
      .nav__burger{ display:none; }

      .nav__mobile{ display:none; }

      @media (max-width:860px){
        .nav__links{ display:none; }
        .nav__burger{ display:flex; }
        .nav__mobile{
          display:flex; flex-direction:column; gap:2px;
          background:var(--ivory-50);
          padding:10px 28px 18px;
        }
        .nav__mobile a{
          padding:10px 0; font-family:'Cinzel', serif; font-size:12px;
          letter-spacing:0.12em; text-transform:uppercase; color:var(--ink-900);
          border-bottom:1px solid rgba(44,8,18,0.08);
        }
      }

      /* ---------- Full-Width Responsive Hero & Video ---------- */
.hero {
  position: relative;
  background: radial-gradient(circle at 50% 28%, #4a0f1f 0%, var(--maroon-950) 55%, #1c0308 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
  padding: 60px 0 40px; /* Reduced side padding to 0 for full width edge-to-edge */
  text-align: center;
}

.garment-ro {
  position: relative;
  z-index: 2;
  width: 100%;
  margin-top: -4%;
}

.garment-ro video {
  width: 100%;
  height: auto;
  display: block;
  object-fit: contain;
  border-radius: 0; /* Flat edges on mobile for edge-to-edge look */
}

/* Add horizontal padding back specifically to text/button containers */
.hero__inner {
  padding: 0 20px;
}

@media (min-width: 640px) {
  .hero {
    padding: 130px 0px 50px;
  }

  .garment-ro {
  position:relative;
  margin-top:-8%;
    width:100%
  }

  .garment-ro video {
    width:100%;
    border-radius: 12px; /* Restore rounded corners on tablet and desktop */
  }
}

      @keyframes flyInL{
        0%{ opacity:0; transform:translate(-70px,-90px) rotate(-30deg) scale(.55); }
        100%{ opacity:1; transform:translate(0,0) rotate(0) scale(1); }
      }
      @keyframes flyInR{
        0%{ opacity:0; transform:translate(70px,-90px) rotate(30deg) scale(.55); }
        100%{ opacity:1; transform:translate(0,0) rotate(0) scale(1); }
      }
      .garment__svg{ display:block; filter:drop-shadow(0 18px 22px rgba(0,0,0,0.35)); }
      .garment__svg.is-sway{ animation:sway 7s ease-in-out infinite; transform-origin:top center; }
      @keyframes sway{ 0%,100%{ transform:rotate(-1.1deg); } 50%{ transform:rotate(1.1deg); } }
      @media (max-width:760px){ .garment-row{ transform:scale(0.62); margin-top:-30px; } }
      @media (max-width:460px){ .garment-row{ transform:scale(0.44); margin-top:-60px; } }

      .sparkle-swirl{
        position:absolute; z-index:3; top:30%; left:50%; transform:translate(-50%,-50%);
        width:min(560px,80vw); height:auto; pointer-events:none;
      }
      .sparkle-swirl__path{ stroke-dasharray:900; stroke-dashoffset:900; opacity:0.85; }
      .sparkle-swirl__path.draw{ transition:stroke-dashoffset 1.6s ease .1s; stroke-dashoffset:0; }
      .sparkle-dot{ opacity:0; transform-origin:center; }
      .sparkle-dot.twinkle{ animation:twinkle 1.8s ease forwards; }
      @keyframes twinkle{
        0%{ opacity:0; transform:scale(0.2); }
        40%{ opacity:1; transform:scale(1.15); }
        60%{ opacity:0.7; transform:scale(0.9); }
        100%{ opacity:0; transform:scale(0.2); }
      }

      .hero__inner{
        position:relative; z-index:4; max-width:640px;
        margin-top:18px;
        opacity:0; transform:translateY(18px);
        transition:opacity 1s ease, transform 1s ease;
      }
      .hero__inner.is-on{ opacity:1; transform:translateY(0); }
      .hero__eyebrow{ margin-bottom:10px; }
      .hero__title{
        margin:0;
        font-family:'Cormorant Garamond', serif;
        font-weight:500; font-style:italic;
        font-size:clamp(48px,8vw,92px);
        line-height:1;
        color:var(--ivory-50);
        text-shadow:0 0 40px rgba(232,203,134,0.25);
      }
      .hero__tagline{
        font-family:'Cinzel', serif; font-size:13px; letter-spacing:0.3em;
        text-transform:uppercase; color:var(--gold-300); margin:10px 0 22px;
      }
      .hero__rule{
        display:inline-block; width:56px; height:2px; background:var(--gold-500);
        margin-bottom:0;
      }
      .hero__body{
        display:none;
        color:rgba(251,243,231,0.82);
        font-size:15.5px; line-height:1.8; max-width:44ch;
        margin:22px auto 0;
      }
      .hero__ctas{
        display:flex; gap:16px; margin-top:28px; flex-wrap:wrap; justify-content:center;
      }

      .carousel-dots{
        position:relative; z-index:4; display:flex; gap:7px; margin-top:26px;
        opacity:0; transition:opacity .8s ease .3s;
      }
      .carousel-dots.is-on{ opacity:1; }
      .dot{ width:6px; height:6px; border-radius:50%; background:rgba(232,203,134,0.35); transition:all .4s ease; }
      .dot--active{ width:20px; border-radius:4px; background:var(--gold-300); }

      .lookstrip{
        position:relative; z-index:4;
        display:flex; gap:14px; margin-top:34px;
        max-width:920px; width:100%;
        justify-content:center;
      }
      .look-card{
        position:relative;
        width:110px; height:130px; border-radius:4px;
        opacity:0; transform:translateY(20px);
        transition:opacity .6s ease, transform .6s ease;
        border:1px solid rgba(232,203,134,0.3);
        overflow:hidden;
      }
      .lookstrip.is-on .look-card{ opacity:1; transform:translateY(0); }
      .look-card:hover{ transform:translateY(-4px); }
      .look-card__badge{
        position:absolute; top:8px; left:8px;
        background:var(--maroon-800); color:var(--gold-300);
        font-size:9px; letter-spacing:0.04em; text-transform:uppercase;
        padding:3px 6px; border-radius:2px;
        font-family:'Cinzel', serif;
      }
      @media (max-width:760px){ .look-card{ width:78px; height:96px; } .lookstrip{ gap:9px; } }
      @media (max-width: 480px) {
  .lookstrip {
    display: flex !important;
    overflow-x: auto;
    justify-content: flex-start;
    padding: 10px 16px;
    width: 100%;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none; /* Hide scrollbar for Firefox */
  }
  .lookstrip::-webkit-scrollbar {
    display: none; /* Hide scrollbar for Chrome/Safari */
  }
  .look-card {
    flex-shrink: 0;
    width: 90px;
    height: 110px;
  }
}

      .hero__scrollcue{
        position:relative; z-index:4;
        margin-top:34px;
        width:22px; height:36px; border:1px solid rgba(232,203,134,0.6); border-radius:12px;
      }
      .hero__scrollcue span{
        position:absolute; top:6px; left:50%; width:4px; height:4px; margin-left:-2px;
        background:var(--gold-300); border-radius:50%;
        animation:cue 1.8s ease infinite;
      }
      @keyframes cue{ 0%{ opacity:1; top:6px; } 70%{ opacity:0; top:20px; } 100%{ opacity:0; top:6px; } }

      /* ---------- Floating chat button ---------- */
      .fab{
        position:fixed; right:22px; bottom:22px; z-index:60;
        width:52px; height:52px; border-radius:50%;
        background:#1f7a4c; border:none;
        display:flex; align-items:center; justify-content:center;
        box-shadow:0 8px 20px rgba(0,0,0,0.25);
        animation:fabPulse 2.6s ease-in-out infinite;
      }
      .fab__badge{
        position:absolute; top:-3px; right:-3px;
        width:17px; height:17px; border-radius:50%;
        background:var(--maroon-800); color:var(--ivory-50);
        font-size:10px; line-height:17px; font-family:'Jost', sans-serif;
      }
      @keyframes fabPulse{ 0%,100%{ transform:scale(1); } 50%{ transform:scale(1.06); } }

      /* ---------- Marquee ---------- */
      .marquee{
        background:var(--maroon-950);
        overflow:hidden;
        white-space:nowrap;
        padding:14px 0;
      }
      .marquee__track{
        display:inline-flex;
        animation:marquee 26s linear infinite;
      }
      .marquee__item{
        display:inline-flex; align-items:center; gap:10px;
        font-family:'Cinzel', serif;
        font-size:12px; letter-spacing:0.2em; text-transform:uppercase;
        color:var(--gold-300);
        padding:0 26px;
        border-right:1px solid rgba(200,155,60,0.25);
      }
      @keyframes marquee{ from{ transform:translateX(0); } to{ transform:translateX(-50%); } }

      /* ---------- Sections generic ---------- */
      .section{ padding: 28px; max-width:1200px; margin:0 auto; }
      .section--ivory{ background:var(--ivory-50); }
      .section--maroon{
        background:linear-gradient(160deg, var(--maroon-950), #40101d);
        max-width:none; padding:110px 28px;
      }
      .section--maroon .section__head{ max-width:1200px; margin:0 auto 56px; }
      .section--maroon .testimonials{ max-width:1200px; margin:0 auto; }
      .section__head{ margin-bottom:52px; }

      /* ---------- Collections ---------- */
      .collections{
        display:grid;
        grid-template-columns:repeat(4,1fr);
        grid-auto-rows:190px;
        gap:20px;
      }
      .coll-card{
        position:relative;
        grid-row:span 1;
        border-radius:4px;
        padding:26px;
        display:flex; flex-direction:column; justify-content:space-between;
        overflow:hidden;
        opacity:0; transform:translateY(28px);
        transition:opacity .7s ease, transform .7s ease;
        border:1px solid transparent;
      }
      .coll-card.is-visible{ opacity:1; transform:translateY(0); }
      .coll-card--big{ grid-row:span 2; }
      .coll-card:hover{ border-color:rgba(200,155,60,0.6); }
      .coll-card:hover .coll-card__corner{ transform:scale(1); opacity:1; }
      .coll-card__text h3{
        margin:0 0 4px; font-family:'Cormorant Garamond', serif; font-style:italic;
        font-size:24px; color:var(--ivory-50); font-weight:500;
      }
      .coll-card__text span{
        font-family:'Jost', sans-serif; font-size:12px; letter-spacing:0.08em;
        color:rgba(251,243,231,0.65);
      }
      .coll-card__corner{
        position:absolute; top:14px; right:14px; width:14px; height:14px;
        border-top:1px solid var(--gold-300); border-right:1px solid var(--gold-300);
        opacity:0; transform:scale(0.6); transition:all .35s ease;
      }

      @media (max-width:900px){
        .collections{ grid-template-columns:1fr 1fr; grid-auto-rows:170px; }
        .coll-card--big{ grid-row:span 1; }
      }
      @media (max-width:540px){
        .collections{ grid-template-columns:1fr; }
      }

      /* ---------- Divider ---------- */
      .divider{
        display:flex; flex-direction:column; align-items:center; gap:14px;
        padding:60px 28px 20px;
      }
      .paisley-path{
        stroke-dasharray:520; stroke-dashoffset:520;
      }
      .paisley-path.draw{
        transition:stroke-dashoffset 2.2s cubic-bezier(.4,0,.2,1);
        stroke-dashoffset:0;
      }
      .divider__caption{
        font-family:'Cormorant Garamond', serif; font-style:italic;
        color:var(--terracotta-700); font-size:16px;
      }

      /* ---------- Products ---------- */
      .products{
        display:grid; grid-template-columns:repeat(3,1fr); gap:28px;
      }
      .product{
        opacity:0; transform:translateY(28px);
        transition:opacity .7s ease, transform .7s ease;
      }
      .product.is-visible{ opacity:1; transform:translateY(0); }
      .product__swatch{
        position:relative; height:280px; border-radius:4px; overflow:hidden;
      }
      .product__corner{ position:absolute; top:16px; right:16px; }
      .product__addbar{
        position:absolute; left:0; right:0; bottom:0;
        transform:translateY(100%);
        transition:transform .35s ease;
        padding:14px;
        background:rgba(36,23,19,0.55);
        backdrop-filter:blur(2px);
      }
      .product__swatch:hover .product__addbar{ transform:translateY(0); }
      .product__addbtn{
        width:100%; padding:11px; background:var(--gold-500); border:none;
        font-family:'Cinzel', serif; font-size:11px; letter-spacing:0.15em;
        text-transform:uppercase; color:var(--maroon-950); border-radius:2px;
        transition:background .3s ease;
      }
      .product__addbtn:hover{ background:var(--gold-300); }
      .product__info{ padding-top:14px; display:flex; flex-direction:column; gap:4px; }
      .product__tag{
        font-family:'Cinzel', serif; font-size:10px; letter-spacing:0.14em;
        text-transform:uppercase; color:var(--terracotta-700);
      }
      .product__info h3{
        margin:0; font-family:'Cormorant Garamond', serif; font-style:italic;
        font-weight:500; font-size:21px;
      }
      .product__price{ font-size:14px; color:var(--gold-500); font-weight:500; }

      @media (max-width:900px){ .products{ grid-template-columns:repeat(2,1fr);gap:1% } }
      @media (max-width:560px){ .products{ grid-template-columns:repeat(2,1fr);gap:1% } }

      /* ---------- Story ---------- */
      .section--split{
        display:grid; grid-template-columns:1fr 1fr; gap:64px; align-items:center;
      }
      .story__visual{
        border-radius:4px; overflow:hidden;
        opacity:0; transform:translateX(-24px);
        transition:opacity .8s ease, transform .8s ease;
      }
      .story__visual.is-visible{ opacity:1; transform:translateX(0); }
      .story__pattern{ width:100%; height:auto; display:block; }
      /* 1. Add keyframes to your CSS */
@keyframes weavePath {
  0% {
    stroke-dashoffset: 200;
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  100% {
    stroke-dashoffset: 0;
    opacity: 1;
  }
}

@keyframes threadGlow {
  0%, 100% {
    filter: drop-shadow(0 0 1px rgba(200, 155, 60, 0.2));
  }
  50% {
    filter: drop-shadow(0 0 6px rgba(200, 155, 60, 0.8));
  }
}

/* 2. Utility classes to apply */
.animate-pattern-weave {
  stroke-dasharray: 200;
  stroke-dashoffset: 200;
  animation: 
    weavePath 2.2s cubic-bezier(0.4, 0, 0.2, 1) forwards infinite,
    threadGlow 4s ease-in-out infinite 2.2s;
}
      .story__text{
        opacity:0; transform:translateX(24px);
        transition:opacity .8s ease .15s, transform .8s ease .15s;
      }
      .story__text.is-visible{ opacity:1; transform:translateX(0); }
      .story__text .h2{ margin-bottom:22px; }
      .story__text .body-text{ margin-bottom:36px; }
      .story__stats{ display:flex; gap:38px; flex-wrap:wrap; }
      .story__stat{ display:flex; flex-direction:column; }
      .story__stat-num{
        font-family:'Cormorant Garamond', serif; font-size:32px; color:var(--maroon-800); font-weight:600;
      }
      .story__stat-label{ font-size:12px; color:#6b5a52; letter-spacing:0.02em; }

      @media (max-width:860px){
        .section--split{ grid-template-columns:1fr; }
      }

      /* ---------- Testimonials ---------- */
      .testimonials{
        display:grid; grid-template-columns:repeat(3,1fr); gap:26px;
      }
      .testimonial{
        background:rgba(251,243,231,0.05);
        border:1px solid rgba(200,155,60,0.25);
        border-radius:4px;
        padding:30px;
        margin:0;
        opacity:0; transform:translateY(24px);
        transition:opacity .7s ease, transform .7s ease;
      }
      .testimonial.is-visible{ opacity:1; transform:translateY(0); }
      .testimonial p{
        font-family:'Cormorant Garamond', serif; font-style:italic; font-size:18px;
        line-height:1.6; color:var(--ivory-50); margin:16px 0 22px;
      }
      .testimonial footer{ display:flex; flex-direction:column; }
      .testimonial__name{
        font-family:'Cinzel', serif; font-size:12px; letter-spacing:0.08em; color:var(--gold-300);
      }
      .testimonial__city{ font-size:12px; color:rgba(251,243,231,0.5); }

      @media (max-width:860px){ .testimonials{ grid-template-columns:1fr; } }

      /* ---------- Newsletter ---------- */
      .newsletter{
        position:relative;
        background:var(--maroon-800);
        padding:100px 28px 80px;
        text-align:center;
        overflow:hidden;
      }
      .newsletter__zigzag{
        position:absolute; top:0; left:0; right:0; height:18px;
        background:var(--ivory-50);
        clip-path:polygon(0% 0%,100% 0%,100% 40%,95% 100%,90% 40%,85% 100%,80% 40%,75% 100%,70% 40%,65% 100%,60% 40%,55% 100%,50% 40%,45% 100%,40% 40%,35% 100%,30% 40%,25% 100%,20% 40%,15% 100%,10% 40%,5% 100%,0% 40%);
      }
      .newsletter__inner{ max-width:560px; margin:0 auto; }
      .newsletter__sub{ color:rgba(251,243,231,0.75); margin:14px 0 34px; font-size:14px; }
      .newsletter__form{
        display:flex; gap:12px; flex-wrap:wrap; justify-content:center;
      }
      .newsletter__form input{
        flex:1; min-width:220px;
        background:transparent; border:1px solid rgba(232,203,134,0.5);
        color:var(--ivory-50); padding:14px 18px; border-radius:2px; font-size:14px;
        font-family:'Jost', sans-serif;
      }
      .newsletter__form input::placeholder{ color:rgba(251,243,231,0.45); }
      .newsletter__form input:focus{ outline:none; border-color:var(--gold-300); }
      .newsletter__thanks{
        font-family:'Cormorant Garamond', serif; font-style:italic; font-size:20px; color:var(--gold-300);
      }

      /* ---------- Footer ---------- */
      .footer{ background:var(--ivory-50); padding-top:0; }
      .footer__border{
        height:10px;
        background-image:repeating-linear-gradient(135deg, var(--gold-500) 0 8px, transparent 8px 16px);
        opacity:0.4;
      }
      .footer__inner{
        max-width:1200px; margin:0 auto; padding:64px 28px 40px;
        display:grid; grid-template-columns:1.4fr 1fr 1fr 1fr; gap:40px;
      }
      .footer__col h4{
        font-family:'Cinzel', serif; font-size:12px; letter-spacing:0.14em;
        text-transform:uppercase; margin:0 0 16px; color:var(--maroon-800);
      }
      .footer__col a, .footer__col p{
        display:block; font-size:13.5px; color:#5a4a43; margin-bottom:10px; line-height:1.5;
      }
      .footer__col a:hover{ color:var(--maroon-800); }
      .footer__brand .nav__logo{ color:var(--maroon-800); display:block; margin-bottom:14px; }
      .footer__brand p{ max-width:26ch; }
      .footer__bottom{
        border-top:1px solid rgba(44,8,18,0.1);
        padding:20px 28px;
        text-align:center;
        font-size:12px; color:#8a7a72;
      }
        

      @media (max-width:760px){
        .footer__inner{ grid-template-columns:1fr 1fr; }
      }
      @media (max-width:480px){
        .footer__inner{ grid-template-columns:1fr; }
      }

      @media (prefers-reduced-motion: reduce){
        .kashida-root *{ animation:none !important; transition:none !important; }
      }
        .coll-card__badge {
  color: #ffffff !important; /* Forces the badge text to white */
}
    `}</style>
  );
}