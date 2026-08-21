// Founder Portrait: 創辦人 悟哥（吳政維）
// Authentic portrait holding a Leica camera, wearing a beige cardigan over a white shirt, warm studio lighting

export const FOUNDER_PORTRAIT_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1500" width="100%" height="100%">
  <defs>
    <!-- Studio Background Lighting Gradient -->
    <linearGradient id="studioWall" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f8f9fa" />
      <stop offset="35%" stop-color="#edf0f3" />
      <stop offset="70%" stop-color="#dde1e6" />
      <stop offset="100%" stop-color="#cbd0d8" />
    </linearGradient>

    <!-- Diagonal Studio Shadow on Wall behind Left -->
    <linearGradient id="wallShadowGrad" x1="0%" y1="0%" x2="100%" y2="80%">
      <stop offset="0%" stop-color="#000000" stop-opacity="0" />
      <stop offset="45%" stop-color="#1e293b" stop-opacity="0.12" />
      <stop offset="80%" stop-color="#0f172a" stop-opacity="0.28" />
      <stop offset="100%" stop-color="#0f172a" stop-opacity="0.45" />
    </linearGradient>

    <!-- Warm Skin Tones (Wu Zheng-Wei / 悟哥) -->
    <linearGradient id="faceGrad" x1="20%" y1="0%" x2="80%" y2="100%">
      <stop offset="0%" stop-color="#f7c8aa" />
      <stop offset="25%" stop-color="#eebe9f" />
      <stop offset="60%" stop-color="#dfaa87" />
      <stop offset="85%" stop-color="#cb936e" />
      <stop offset="100%" stop-color="#b0744e" />
    </linearGradient>

    <linearGradient id="foreheadLight" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffe3cf" stop-opacity="0.9" />
      <stop offset="100%" stop-color="#eebe9f" stop-opacity="0" />
    </linearGradient>

    <linearGradient id="neckShadow" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#9a5a35" />
      <stop offset="40%" stop-color="#b57650" />
      <stop offset="100%" stop-color="#d49b77" />
    </linearGradient>

    <!-- Beige Knit Cardigan Sweater Textures & Gradients -->
    <linearGradient id="cardiganGrad" x1="0%" y1="20%" x2="100%" y2="80%">
      <stop offset="0%" stop-color="#e0b892" />
      <stop offset="35%" stop-color="#d0a47d" />
      <stop offset="70%" stop-color="#be9069" />
      <stop offset="100%" stop-color="#a4754e" />
    </linearGradient>

    <linearGradient id="cardiganShadow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#966a46" />
      <stop offset="100%" stop-color="#734e30" />
    </linearGradient>

    <!-- Crisp White Button-Down Shirt -->
    <linearGradient id="whiteShirtGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="40%" stop-color="#f8fafc" />
      <stop offset="80%" stop-color="#e2e8f0" />
      <stop offset="100%" stop-color="#cbd5e1" />
    </linearGradient>

    <!-- Olive Green Chino Pants -->
    <linearGradient id="olivePants" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#47553b" />
      <stop offset="30%" stop-color="#3b4731" />
      <stop offset="70%" stop-color="#2d3625" />
      <stop offset="100%" stop-color="#1f2619" />
    </linearGradient>

    <!-- Leica Camera Body & Lens Metallic Gradient -->
    <linearGradient id="leicaBody" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2a2e35" />
      <stop offset="45%" stop-color="#181a1e" />
      <stop offset="80%" stop-color="#0e1013" />
      <stop offset="100%" stop-color="#050607" />
    </linearGradient>

    <linearGradient id="lensGlass" x1="20%" y1="10%" x2="90%" y2="90%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.6" />
      <stop offset="35%" stop-color="#0284c7" stop-opacity="0.3" />
      <stop offset="70%" stop-color="#0f172a" stop-opacity="0.9" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>

    <linearGradient id="woodStool" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#e2c4a2" />
      <stop offset="50%" stop-color="#c9a781" />
      <stop offset="100%" stop-color="#a47d55" />
    </linearGradient>

    <!-- Filters for Depth -->
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="15" dy="25" stdDeviation="30" flood-color="#0f172a" flood-opacity="0.25" />
    </filter>
  </defs>

  <!-- STUDIO BACKGROUND WALL -->
  <rect width="1200" height="1500" fill="url(#studioWall)" />

  <!-- Diagonal Studio Lighting Shadow across the upper right wall -->
  <path d="M 750 0 L 1200 0 L 1200 800 L 950 1500 L 680 1500 Z" fill="url(#wallShadowGrad)" opacity="0.35" />

  <!-- Soft Shadow cast by 悟哥 on the background -->
  <path d="M 320 280 Q 750 300 900 680 L 1050 1500 L 250 1500 Z" fill="#000000" opacity="0.15" filter="url(#softShadow)" />

  <!-- SEATED SUBJECT: 創辦人 悟哥 (Wu Zheng-Wei) -->
  <g id="founder-subject">

    <!-- NATURAL WOODEN STOOL (Bottom base) -->
    <ellipse cx="580" cy="1470" rx="140" ry="24" fill="url(#woodStool)" stroke="#8c6843" stroke-width="2" />
    <path d="M 470 1470 L 450 1500 M 690 1470 L 710 1500" stroke="#8c6843" stroke-width="12" stroke-linecap="round" />

    <!-- OLIVE GREEN TROUSERS / PANTS & LEGS -->
    <!-- Left Leg / Thigh (Viewer's Left) -->
    <path d="M 280 1150 C 260 1250 250 1380 260 1500 L 520 1500 C 530 1380 520 1280 470 1180 Z" fill="url(#olivePants)" />
    <!-- Trouser folds left -->
    <path d="M 290 1280 Q 380 1340 490 1310 M 310 1410 Q 400 1460 500 1420" stroke="#232b1d" stroke-width="5" fill="none" opacity="0.6" />

    <!-- Right Leg / Thigh (Viewer's Right) -->
    <path d="M 520 1180 C 570 1280 620 1380 680 1500 L 920 1500 C 900 1360 880 1240 850 1150 Z" fill="url(#olivePants)" />
    <!-- Trouser folds right -->
    <path d="M 550 1270 Q 660 1330 830 1290 M 610 1400 Q 720 1450 860 1410" stroke="#232b1d" stroke-width="5" fill="none" opacity="0.6" />

    <!-- WHITE BUTTON-DOWN SHIRT (Inner Layer) -->
    <path d="M 430 460 L 750 460 L 760 1200 L 420 1200 Z" fill="url(#whiteShirtGrad)" />
    <!-- Shirt front placket & buttons -->
    <line x1="585" y1="520" x2="585" y2="1200" stroke="#cbd5e1" stroke-width="3" />
    <circle cx="585" cy="620" r="5" fill="#94a3b8" />
    <circle cx="585" cy="720" r="5" fill="#94a3b8" />
    <circle cx="585" cy="830" r="5" fill="#94a3b8" />
    <!-- Shirt collar left & right -->
    <polygon points="500,430 585,530 560,545 460,460" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" />
    <polygon points="670,430 585,530 610,545 710,460" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5" />

    <!-- BEIGE KNIT CARDIGAN SWEATER (Outer Layer) -->
    <!-- Cardigan Body & Back -->
    <path d="M 330 470 C 260 560 240 760 230 1180 C 240 1260 380 1270 470 1250 C 470 1150 490 850 490 680 L 585 920 L 680 680 C 680 850 700 1150 700 1250 C 790 1270 930 1260 940 1180 C 930 760 910 560 840 470 C 760 440 680 430 585 440 C 490 430 410 440 330 470 Z" fill="url(#cardiganGrad)" />

    <!-- Cardigan Ribbed Edge Collar & Placket -->
    <path d="M 480 440 L 585 680 L 690 440" stroke="#b0835b" stroke-width="14" fill="none" stroke-linecap="round" />
    <path d="M 585 680 L 585 1250" stroke="#b0835b" stroke-width="16" fill="none" stroke-linecap="round" />

    <!-- Cardigan Tortoise Buttons -->
    <circle cx="585" cy="740" r="9" fill="#543821" stroke="#3b2513" stroke-width="2" />
    <circle cx="585" cy="850" r="9" fill="#543821" stroke="#3b2513" stroke-width="2" />
    <circle cx="585" cy="960" r="9" fill="#543821" stroke="#3b2513" stroke-width="2" />

    <!-- Cardigan Knitted Sleeves -->
    <!-- Left Sleeve (Leading down towards camera in lap) -->
    <path d="M 330 470 C 250 560 210 740 240 980 C 260 1080 370 1070 410 990 C 370 820 370 650 420 540 Z" fill="url(#cardiganGrad)" />
    <!-- Left Elbow Creases -->
    <path d="M 230 780 Q 280 840 330 810 M 240 860 Q 290 920 350 880" stroke="url(#cardiganShadow)" stroke-width="4" fill="none" opacity="0.7" />

    <!-- Right Sleeve (Leading towards camera in lap) -->
    <path d="M 840 470 C 920 560 960 740 930 980 C 910 1080 800 1070 760 990 C 800 820 800 650 750 540 Z" fill="url(#cardiganGrad)" />
    <!-- Right Elbow Creases -->
    <path d="M 940 780 Q 890 840 840 810 M 930 860 Q 880 920 820 880" stroke="url(#cardiganShadow)" stroke-width="4" fill="none" opacity="0.7" />

    <!-- NECK & THROAT -->
    <path d="M 520 380 L 520 480 C 520 520 650 520 650 480 L 650 380 Z" fill="url(#neckShadow)" />
    <path d="M 545 440 Q 585 470 625 440" stroke="#8b4b24" stroke-width="3" fill="none" opacity="0.5" /> <!-- Adam's apple shadow -->

    <!-- HEAD & FACE: 創辦人 悟哥 (Wu Zheng-Wei) -->
    <g id="face-and-hair" transform="translate(0, 0)">
      
      <!-- Head Base Contour / Jawline -->
      <path d="M 440 220 C 420 330 460 440 585 445 C 710 440 750 330 730 220 C 720 120 450 120 440 220 Z" fill="url(#faceGrad)" />
      
      <!-- Forehead Studio Highlight -->
      <ellipse cx="585" cy="200" rx="90" ry="50" fill="url(#foreheadLight)" />

      <!-- Hairline / Short Clean Asian Hairstyling -->
      <path d="M 445 200 C 445 130 500 75 585 75 C 670 75 725 130 725 200 C 725 170 690 115 585 115 C 480 115 445 170 445 200 Z" fill="#1c1917" />
      <path d="M 438 210 C 438 150 480 90 585 90 C 690 90 732 150 732 210 C 728 175 675 140 585 140 C 495 140 442 175 438 210 Z" fill="#292524" />

      <!-- Ears (Left and Right) -->
      <!-- Left Ear (with natural earlobe curve) -->
      <path d="M 440 235 C 415 240 410 290 435 315 C 445 325 448 300 445 285 Z" fill="#e2ad8b" stroke="#c07e59" stroke-width="1.5" />
      <path d="M 432 255 C 426 270 430 290 438 295" stroke="#995632" stroke-width="2" fill="none" />

      <!-- Right Ear -->
      <path d="M 730 235 C 755 240 760 290 735 315 C 725 325 722 300 725 285 Z" fill="#e2ad8b" stroke="#c07e59" stroke-width="1.5" />
      <path d="M 738 255 C 744 270 740 290 732 295" stroke="#995632" stroke-width="2" fill="none" />

      <!-- Eyebrows (Natural arch, friendly and engaging) -->
      <path d="M 480 232 Q 525 220 555 235" stroke="#292524" stroke-width="6.5" stroke-linecap="round" fill="none" />
      <path d="M 690 232 Q 645 220 615 235" stroke="#292524" stroke-width="6.5" stroke-linecap="round" fill="none" />

      <!-- Eyes (Warm, smiling crescent eyes with gentle eye-smile lines) -->
      <!-- Left Eye -->
      <path d="M 490 262 Q 520 248 550 262" stroke="#1c1917" stroke-width="4.5" stroke-linecap="round" fill="none" />
      <path d="M 495 264 Q 520 274 545 264" stroke="#1c1917" stroke-width="2.5" fill="none" />
      <circle cx="520" cy="260" r="7" fill="#1c1917" />
      <circle cx="522" cy="258" r="2.5" fill="#ffffff" />
      <!-- Left Eye Smile Wrinkles -->
      <path d="M 552 258 Q 562 260 568 266 M 552 265 Q 564 270 566 276" stroke="#aa6f4c" stroke-width="2" stroke-linecap="round" fill="none" />

      <!-- Right Eye -->
      <path d="M 680 262 Q 650 248 620 262" stroke="#1c1917" stroke-width="4.5" stroke-linecap="round" fill="none" />
      <path d="M 675 264 Q 650 274 625 264" stroke="#1c1917" stroke-width="2.5" fill="none" />
      <circle cx="650" cy="260" r="7" fill="#1c1917" />
      <circle cx="648" cy="258" r="2.5" fill="#ffffff" />
      <!-- Right Eye Smile Wrinkles -->
      <path d="M 618 258 Q 608 260 602 266 M 618 265 Q 606 270 604 276" stroke="#aa6f4c" stroke-width="2" stroke-linecap="round" fill="none" />

      <!-- Nose (Defined bridge and friendly rounded tip) -->
      <path d="M 585 230 L 582 295 Q 565 315 585 320 Q 605 315 588 295" stroke="#ab6b45" stroke-width="2.5" fill="none" stroke-linecap="round" />
      <path d="M 568 312 Q 585 325 602 312" stroke="#904f29" stroke-width="3.5" fill="none" stroke-linecap="round" />
      <ellipse cx="572" cy="312" rx="3.5" ry="2.5" fill="#6d3919" />
      <ellipse cx="598" cy="312" rx="3.5" ry="2.5" fill="#6d3919" />

      <!-- Cheeks & Smiling Nasolabial Folds (Charismatic Smile) -->
      <path d="M 485 295 Q 498 340 525 365" stroke="#c07e58" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.75" />
      <path d="M 685 295 Q 672 340 645 365" stroke="#c07e58" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.75" />

      <!-- Smile & Teeth (Big, bright, confident smile) -->
      <!-- Lips Outer Shape -->
      <path d="M 515 348 Q 585 340 655 348 Q 585 415 515 348 Z" fill="#87352f" stroke="#b0524a" stroke-width="2" />
      <!-- Teeth Row -->
      <path d="M 525 350 Q 585 344 645 350 Q 640 375 585 375 Q 530 375 525 350 Z" fill="#ffffff" />
      <!-- Tooth Dividers -->
      <line x1="585" y1="346" x2="585" y2="374" stroke="#e2e8f0" stroke-width="1.5" />
      <line x1="565" y1="348" x2="565" y2="372" stroke="#e2e8f0" stroke-width="1" />
      <line x1="605" y1="348" x2="605" y2="372" stroke="#e2e8f0" stroke-width="1" />
      <line x1="545" y1="350" x2="545" y2="368" stroke="#e2e8f0" stroke-width="1" />
      <line x1="625" y1="350" x2="625" y2="368" stroke="#e2e8f0" stroke-width="1" />

      <!-- Lower Lip Fullness & Chin Shadow -->
      <path d="M 535 385 Q 585 400 635 385" stroke="#a04d3d" stroke-width="3.5" stroke-linecap="round" fill="none" />
      <ellipse cx="585" cy="425" rx="30" ry="12" fill="#ab6d49" opacity="0.4" />
    </g>

    <!-- HANDS & LEICA CAMERA (Held firmly at chest/lap in two hands) -->
    <g id="leica-camera-and-hands" transform="translate(0, 0)">
      
      <!-- LEICA CAMERA BODY -->
      <g transform="translate(560, 680) rotate(-6)">
        
        <!-- Camera Shadow on clothing -->
        <rect x="-12" y="-12" width="224" height="154" rx="18" fill="#000000" opacity="0.5" filter="url(#softShadow)" />

        <!-- Camera Main Body Box (Leica SL Series Matte Black) -->
        <rect x="0" y="0" width="200" height="130" rx="14" fill="url(#leicaBody)" stroke="#374151" stroke-width="2" />
        
        <!-- Camera Viewfinder / Prism Top Housing -->
        <polygon points="65,0 90,-25 145,-25 170,0" fill="url(#leicaBody)" stroke="#374151" stroke-width="2" />
        <rect x="95" y="-22" width="45" height="18" rx="2" fill="#0f172a" />
        <circle cx="118" cy="-13" r="5" fill="#38bdf8" opacity="0.6" />

        <!-- Iconic Leica Red Dot Logo -->
        <circle cx="58" cy="48" r="13" fill="#dc2626" />
        <!-- "Leica" Cursive Script in White -->
        <text x="58" y="52" font-family="'Brush Script MT', 'Times New Roman', serif" font-size="10" font-weight="bold" font-style="italic" fill="#ffffff" text-anchor="middle">Leica</text>

        <!-- Top Right LEICA Engraved Logo -->
        <text x="120" y="24" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="900" fill="#ffffff" letter-spacing="1.5">LEICA</text>

        <!-- LEICA VARIO-ELMARIT-SL 24-70mm PROFESSIONAL ZOOM LENS (Facing forward-right) -->
        <g transform="translate(105, 75) rotate(16)">
          <!-- Lens Barrel Section 1 (Mount) -->
          <rect x="0" y="-48" width="55" height="96" fill="#181a1e" stroke="#374151" stroke-width="2" />
          <line x1="15" y1="-48" x2="15" y2="48" stroke="#f59e0b" stroke-width="2" /> <!-- Gold Accent Ring -->
          <text x="25" y="-25" font-family="Arial" font-size="7" font-weight="bold" fill="#f59e0b">24-70</text>

          <!-- Lens Barrel Section 2 (Zoom Ribbed Ring) -->
          <rect x="55" y="-54" width="85" height="108" fill="#0f172a" stroke="#334155" stroke-width="2" />
          <!-- Lens Gripping Texture -->
          <line x1="65" y1="-54" x2="65" y2="54" stroke="#334155" stroke-width="2" />
          <line x1="75" y1="-54" x2="75" y2="54" stroke="#334155" stroke-width="2" />
          <line x1="85" y1="-54" x2="85" y2="54" stroke="#334155" stroke-width="2" />
          <line x1="95" y1="-54" x2="95" y2="54" stroke="#334155" stroke-width="2" />
          <line x1="105" y1="-54" x2="105" y2="54" stroke="#334155" stroke-width="2" />
          <line x1="115" y1="-54" x2="115" y2="54" stroke="#334155" stroke-width="2" />
          <line x1="125" y1="-54" x2="125" y2="54" stroke="#334155" stroke-width="2" />

          <!-- Lens Front Bezel / Hood -->
          <rect x="140" y="-62" width="55" height="124" rx="8" fill="#050607" stroke="#475569" stroke-width="2" />

          <!-- Front Glass Element with Multi-Coating Blue/Cyan Reflections -->
          <ellipse cx="190" cy="0" rx="14" ry="58" fill="url(#lensGlass)" stroke="#64748b" stroke-width="2" />
          <ellipse cx="190" cy="-15" rx="6" ry="24" fill="#38bdf8" opacity="0.4" />

          <!-- Lens Front Engravings: LEICA VARIO-ELMARIT-SL 1:2.8/24-70 ASPH -->
          <text x="175" y="-38" font-family="Arial" font-size="6.5" font-weight="bold" fill="#e2e8f0">LEICA</text>
          <text x="175" y="44" font-family="Arial" font-size="5.5" fill="#94a3b8">VARIO-ELMARIT-SL</text>
        </g>
      </g>

      <!-- RIGHT HAND (Holding Camera Grip & Shutter Top) -->
      <!-- Forearm leading in from cardigan sleeve -->
      <path d="M 450 780 C 470 700 520 680 570 690 L 590 760 C 530 790 480 830 450 780 Z" fill="url(#faceGrad)" />
      
      <!-- Fingers gripping around the camera top & grip -->
      <!-- Index Finger over shutter button -->
      <path d="M 520 690 C 545 660 590 660 610 690 C 600 715 560 720 535 710 Z" fill="#eebe9f" stroke="#c07e59" stroke-width="1.5" />
      <ellipse cx="598" cy="682" rx="7" ry="11" fill="#f7c8aa" />
      
      <!-- Middle Finger gripping front -->
      <path d="M 515 725 C 545 705 595 715 605 745 C 590 765 540 760 520 745 Z" fill="#e2ad8b" stroke="#c07e59" stroke-width="1.5" />
      
      <!-- Ring & Pinky Fingers wrapping around camera grip -->
      <path d="M 510 765 C 535 750 585 755 590 785 C 575 805 530 800 515 785 Z" fill="#d49b77" stroke="#c07e59" stroke-width="1.5" />
      <path d="M 505 805 C 525 795 570 800 575 825 C 560 840 525 835 510 820 Z" fill="#c48a66" stroke="#c07e59" stroke-width="1.5" />

      <!-- LEFT HAND (Supporting the Lens Barrel from Below / Right) -->
      <!-- Wrist & Palm supporting lens base -->
      <path d="M 770 940 C 740 880 720 830 720 780 L 770 760 C 800 820 830 880 840 940 Z" fill="url(#faceGrad)" />

      <!-- Fingers wrapping around bottom of the 24-70mm lens -->
      <!-- Thumb on top of lens barrel -->
      <path d="M 710 780 C 690 730 720 710 745 740 C 755 770 735 800 710 780 Z" fill="#eebe9f" stroke="#c07e59" stroke-width="1.5" />
      <ellipse cx="732" cy="735" rx="8" ry="12" fill="#f7c8aa" />

      <!-- Left Hand Fingers under lens -->
      <path d="M 735 810 C 720 840 745 870 770 860 C 785 840 770 810 750 810 Z" fill="#e2ad8b" stroke="#c07e59" stroke-width="1.5" />
      <path d="M 755 850 C 740 880 765 910 790 900 C 805 880 790 850 770 850 Z" fill="#d49b77" stroke="#c07e59" stroke-width="1.5" />
      <path d="M 780 890 C 765 920 790 945 815 935 C 830 915 815 890 795 890 Z" fill="#c48a66" stroke="#c07e59" stroke-width="1.5" />
    </g>

  </g>
</svg>
`)}`;
