/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-useless-assignment */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import './index.css';
import WaitlistPage from './WaitlistPage';

// ============================================================
// IMPORT PATCH IMAGES
// ============================================================
import crossImg from './assets/images/patches/Chrome-Style-real.png';
import mickeyImg from './assets/images/patches/mickey-mouse.jpg';
import mickeySadImg from './assets/images/patches/mickey-mouse-sad.jpg';
import spidermanBabyImg from './assets/images/patches/spider-man-baby.jpg';
import spidermanSprayImg from './assets/images/patches/spider-man-spray.jpg';
import stitchHeartsImg from './assets/images/patches/stitch-hearts.jpg';
import stitchPopoutImg from './assets/images/patches/stitch-popout.jpg';
import stitchWavingImg from './assets/images/patches/stitch-waving.jpg';
import blackSpiderManImg from './assets/images/patches/black-spider-man.jpg';
import blackWebImg from './assets/images/patches/black-web.jpg';

import pinkSketchHeart from './assets/images/patches/pink-sketch-heart.jpg';
import pinkHeart from './assets/images/patches/pink-heart.jpg';
import redSketchHeart from './assets/images/patches/red-sketch-heart.jpg';
import redPixelHeart from './assets/images/patches/red-pixel-heart.jpg';
import starClipart from './assets/images/patches/star-clipart.jpg';
import starBlack from './assets/images/patches/star-black.jpg';
import diamondBlueCartoon from './assets/images/patches/diamond-blue-cartoon.jpg';

// ============================================================
// DATA
// ============================================================
const BASE_PRICE = 240;
const MAX_ITEMS = 12;

// ✅ Fixed: paths now point to /images/base/ (public folder)
const COLORS = [
  { id: 'black', name: 'Black', hex: '#2a2a2a', price: 0, frontImg: '/images/base/black-front.jpg', sideImg: '/images/base/black-side.jpg' },
  { id: 'brown', name: 'Brown', hex: '#8B4513', price: 0, frontImg: '/images/base/brown-front.jpg', sideImg: '/images/base/brown-side.jpg' },
  { id: 'beige', name: 'Beige', hex: '#e8d5c4', price: 0, frontImg: '/images/base/beige-front.jpg', sideImg: '/images/base/beige-side.jpg' },
  { id: 'chantilly', name: 'Chantilly', hex: '#f5efe6', price: 0, frontImg: '/images/base/chantilly-front.jpg', sideImg: '/images/base/chantilly-side.jpg' },
  { id: 'grey', name: 'Grey', hex: '#a0a0a0', price: 0, frontImg: '/images/base/grey-arialview.jpg', sideImg: '/images/base/grey-side.jpg' },
  { id: 'mocha', name: 'Mocha Brown', hex: '#8B5A3C', price: 0, frontImg: '/images/base/mocha-brown-arial.jpg', sideImg: '/images/base/mocha-brown-arial.jpg' },
];

const MAIN_PATCHES = [
  { id: 'cross', name: 'Cross', price: 35, img: crossImg },
  { id: 'mickey', name: 'Mickey Mouse', price: 35, img: mickeyImg },
  { id: 'mickey-sad', name: 'Mickey (Sad)', price: 35, img: mickeySadImg },
  { id: 'spider-baby', name: 'Spider‑Man (Baby)', price: 35, img: spidermanBabyImg },
  { id: 'spider-spray', name: 'Spider‑Man (Spray)', price: 35, img: spidermanSprayImg },
  { id: 'stitch-hearts', name: 'Stitch (Hearts)', price: 35, img: stitchHeartsImg },
  { id: 'stitch-popout', name: 'Stitch (Popout)', price: 35, img: stitchPopoutImg },
  { id: 'stitch-waving', name: 'Stitch (Waving)', price: 35, img: stitchWavingImg },
  { id: 'black-spider', name: 'Black Spider‑Man', price: 35, img: blackSpiderManImg },
  { id: 'black-web', name: 'Black Web', price: 35, img: blackWebImg },
];

const ADDONS = [
  { id: 'pink-sketch-heart', name: 'Pink Sketch Heart', price: 10, img: pinkSketchHeart },
  { id: 'pink-heart', name: 'Pink Heart', price: 10, img: pinkHeart },
  { id: 'red-sketch-heart', name: 'Red Sketch Heart', price: 10, img: redSketchHeart },
  { id: 'red-pixel-heart', name: 'Red Pixel Heart', price: 10, img: redPixelHeart },
  { id: 'star-clipart', name: 'Star Clipart', price: 10, img: starClipart },
  { id: 'star-black', name: 'Star Black', price: 10, img: starBlack },
  { id: 'diamond-blue-cartoon', name: 'Diamond Blue Cartoon', price: 10, img: diamondBlueCartoon },
];

const FONT_STYLES = [
  { id: 'normal', name: 'Normal' },
  { id: 'bold', name: 'Bold' },
  { id: 'bubble', name: 'Cartoonish (letters)' },
];

const INITIALS_COLORS = ['#d4a574', '#c0c0c0', '#111', '#ff4f98', '#ffffff'];

// ============================================================
// MAIN APP
// ============================================================
function App() {
  // ---- Page routing ----
  const [currentPage, setCurrentPage] = useState('studio');

  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/waitlist') {
      setCurrentPage('waitlist');
    } else {
      setCurrentPage('studio');
    }
  }, []);

  // ---- Studio State ----
  const [studioDropdown, setStudioDropdown] = useState(false);
  const [step, setStep] = useState(1);
  const [color, setColor] = useState(COLORS[0]);
  const [viewAngle, setViewAngle] = useState('front');
  const [mainPatches, setMainPatches] = useState([]);
  const [addons, setAddons] = useState([]);
  const [letterPatches, setLetterPatches] = useState([]);
  const [initials, setInitials] = useState('');
  const [initialsColor, setInitialsColor] = useState('#d4a574');
  const [isGold, setIsGold] = useState(false);
  const [fontSize, setFontSize] = useState(60);
  const [fontStyle, setFontStyle] = useState('normal');
  const [initialsPos, setInitialsPos] = useState({ x: 0.5, y: 0.55 });
  const [globalPatchSize, setGlobalPatchSize] = useState(0.14);
  const [whatsapp, setWhatsapp] = useState('');
  const [whatsappConfirm, setWhatsappConfirm] = useState('');

  // ---- Screenshot preview ----
  const [showScreenshot, setShowScreenshot] = useState(false);
  const [screenshotData, setScreenshotData] = useState(null);

  // ---- Collapsible sections ----
  const [showPatches, setShowPatches] = useState(true);
  const [showAddons, setShowAddons] = useState(true);
  const [showText, setShowText] = useState(true);

  // ---- Letter definitions ----
  const [allLetterPatches, setAllLetterPatches] = useState([]);

  // ---- Refs ----
  const canvasRef = useRef(null);
  const baseImageRef = useRef(null);
  const patchImagesRef = useRef({});

  // ---- renderCanvas ----
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    const img = baseImageRef.current;
    if (img) {
      const aspect = img.width / img.height;
      let dw, dh, dx, dy;
      if (aspect > w / h) {
        dw = w;
        dh = w / aspect;
        dx = 0;
        dy = (h - dh) / 2;
      } else {
        dh = h;
        dw = h * aspect;
        dx = (w - dw) / 2;
        dy = 0;
      }
      ctx.drawImage(img, dx, dy, dw, dh);
    } else {
      ctx.fillStyle = '#eee';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#999';
      ctx.font = '18px Poppins';
      ctx.textAlign = 'center';
      ctx.fillText('Place your image in /images/base/', w/2, h/2);
    }

    const drawItem = (item, defs) => {
      const def = defs.find(d => d.id === item.id);
      if (!def) return;
      const patchImg = patchImagesRef.current[item.id];
      if (!patchImg) return;
      const x = item.x !== undefined ? item.x : 0.4;
      const y = item.y !== undefined ? item.y : 0.3;
      const px = x * w;
      const py = y * h;
      const sizeRatio = item.size !== undefined ? item.size : globalPatchSize;
      const size = Math.min(w, h) * sizeRatio;
      const rotation = item.rotation || 0;

      ctx.save();
      ctx.translate(px, py);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.shadowColor = 'rgba(0,0,0,0.3)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.drawImage(patchImg, -size/2, -size/2, size, size);
      ctx.restore();
    };

    mainPatches.forEach(p => drawItem(p, MAIN_PATCHES));
    addons.forEach(p => drawItem(p, ADDONS));
    letterPatches.forEach(p => drawItem(p, allLetterPatches));

    // Text initials (only when not using cartoonish letters, or if no letter patches)
    if (initials.length > 0 && (fontStyle !== 'bubble' || letterPatches.length === 0)) {
      const text = initials;
      let fontStr = '';
      if (fontStyle === 'bold') fontStr = 'bold ';
      const fontFamily = "'Georgia', serif";
      ctx.font = `${fontStr}${fontSize}px ${fontFamily}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const x = initialsPos.x * w;
      const y = initialsPos.y * h;
      const colorVal = isGold ? '#d4a574' : initialsColor;
      ctx.shadowColor = isGold ? 'rgba(212,165,116,0.6)' : 'transparent';
      ctx.shadowBlur = isGold ? 25 : 0;
      ctx.fillStyle = colorVal;
      ctx.fillText(text, x, y);
      ctx.shadowBlur = 0;
    }
  }, [mainPatches, addons, letterPatches, initials, initialsColor, isGold, fontSize, fontStyle, initialsPos, globalPatchSize, allLetterPatches]);

  // ---- Load images for main patches and add-ons ----
  useEffect(() => {
    [...MAIN_PATCHES, ...ADDONS].forEach(p => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = p.img;
      img.onload = () => {
        patchImagesRef.current[p.id] = img;
        renderCanvas();
      };
      img.onerror = () => {
        patchImagesRef.current[p.id] = null;
        renderCanvas();
      };
    });
  }, [renderCanvas]);

  // ---- Load letter images ----
  useEffect(() => {
    const loadLetters = async () => {
      const images = import.meta.glob('./assets/images/patches/letters/cartoonish-a-z/*.png', { eager: true, import: 'default' });
      const defs = [];
      for (const [path, img] of Object.entries(images)) {
        const fileName = path.split('/').pop().replace('.png', '');
        const id = `letter-${fileName}`;
        defs.push({ id, name: fileName.toUpperCase(), price: 0, img, symbol: fileName.toUpperCase() });
        const imgObj = new Image();
        imgObj.crossOrigin = 'anonymous';
        imgObj.src = img;
        imgObj.onload = () => {
          patchImagesRef.current[id] = imgObj;
          renderCanvas();
        };
      }
      setAllLetterPatches(defs);
    };
    loadLetters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Load base image ----
  useEffect(() => {
    const img = new Image();
    const src = viewAngle === 'front' ? color.frontImg : color.sideImg;
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      baseImageRef.current = img;
      renderCanvas();
    };
    img.onerror = () => {
      baseImageRef.current = null;
      renderCanvas();
    };
    img.src = src;
  }, [color, viewAngle, renderCanvas]);

  // ---- Re-render on changes ----
  useEffect(() => {
    renderCanvas();
  }, [mainPatches, addons, letterPatches, initials, initialsColor, isGold, fontSize, fontStyle, initialsPos, globalPatchSize, renderCanvas]);

  // ---- Scroll helpers ----
  const scrollToCanvas = () => {
    setTimeout(() => {
      const preview = document.querySelector('.preview-panel');
      if (preview) preview.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 150);
  };
  const scrollToPatches = () => {
    const patchGrid = document.getElementById('patchGrid');
    if (patchGrid) patchGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const goToStep = (s) => { if (s >= 1 && s <= 4) setStep(s); };

  // ---- Toggle functions (main patches & add-ons only) ----
  const toggleMainPatch = (patchDef) => {
    if (mainPatches.length + addons.length + letterPatches.length >= MAX_ITEMS) {
      alert(`Max ${MAX_ITEMS} items total.`);
      return;
    }
    const total = mainPatches.length + addons.length + letterPatches.length;
    const baseX = 0.15 + (total % 4) * 0.2;
    const baseY = 0.25 + Math.floor(total / 4) * 0.2;
    setMainPatches([...mainPatches, {
      id: patchDef.id,
      x: Math.min(0.85, baseX),
      y: Math.min(0.8, baseY),
      size: globalPatchSize,
      rotation: 0
    }]);
    scrollToCanvas();
  };

  const toggleAddon = (addonDef) => {
    if (mainPatches.length + addons.length + letterPatches.length >= MAX_ITEMS) {
      alert(`Max ${MAX_ITEMS} items total.`);
      return;
    }
    const total = mainPatches.length + addons.length + letterPatches.length;
    const baseX = 0.15 + (total % 4) * 0.2;
    const baseY = 0.25 + Math.floor(total / 4) * 0.2;
    setAddons([...addons, {
      id: addonDef.id,
      x: Math.min(0.85, baseX),
      y: Math.min(0.8, baseY),
      size: globalPatchSize,
      rotation: 0
    }]);
    scrollToCanvas();
  };

  // ---- Update letter patches from text (Step 3) ----
  const updateLetterPatchesFromText = useCallback((text) => {
    const letters = text.toLowerCase().split('');
    const newLetterPatches = [];
    if (letters.length === 0) {
      setLetterPatches([]);
      return;
    }
    const availableIds = allLetterPatches.map(p => p.id);
    const validLetters = letters.filter(ch => availableIds.includes(`letter-${ch}`));

    if (validLetters.length === 0) {
      setLetterPatches([]);
      return;
    }

    if (mainPatches.length + addons.length + validLetters.length > MAX_ITEMS) {
      alert(`Max ${MAX_ITEMS} items total. You have ${mainPatches.length + addons.length} items already.`);
      return;
    }

    const spacing = 0.6 / (validLetters.length + 1);
    const startX = 0.2;
    validLetters.forEach((ch, i) => {
      const id = `letter-${ch}`;
      const def = allLetterPatches.find(p => p.id === id);
      if (def) {
        newLetterPatches.push({
          id: def.id,
          x: startX + (i + 1) * spacing,
          y: 0.5,
          size: globalPatchSize,
          rotation: 0
        });
      }
    });
    setLetterPatches(newLetterPatches);
  }, [allLetterPatches, globalPatchSize, mainPatches, addons]);

  // ---- Handle text input (Step 3) ----
  const handleInitialsChange = (e) => {
    const text = e.target.value.toUpperCase();
    setInitials(text);
    if (fontStyle === 'bubble') {
      updateLetterPatchesFromText(text);
    }
  };

  // ---- When fontStyle changes (Step 3) ----
  useEffect(() => {
    if (fontStyle === 'bubble' && initials.length > 0) {
      updateLetterPatchesFromText(initials);
    } else if (fontStyle !== 'bubble' && letterPatches.length > 0) {
      setLetterPatches([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fontStyle]);

  // ---- Remove item (main, addon, letter) ----
  const removeItem = (type, index) => {
    if (type === 'main') {
      const newPatches = [...mainPatches];
      newPatches.splice(index, 1);
      setMainPatches(newPatches);
    } else if (type === 'addon') {
      const newAddons = [...addons];
      newAddons.splice(index, 1);
      setAddons(newAddons);
    } else if (type === 'letter') {
      const newLetters = [...letterPatches];
      newLetters.splice(index, 1);
      setLetterPatches(newLetters);
    }
  };

  // ---- Size & rotation controls ----
  const changeItemSize = (type, index, delta) => {
    const step = 0.02;
    const setter = type === 'main' ? setMainPatches : type === 'addon' ? setAddons : setLetterPatches;
    const getter = type === 'main' ? mainPatches : type === 'addon' ? addons : letterPatches;
    const newItems = [...getter];
    const item = newItems[index];
    if (!item) return;
    const newSize = Math.min(0.4, Math.max(0.05, item.size + delta * step));
    item.size = newSize;
    setter(newItems);
  };

  const changeItemRotation = (type, index, delta) => {
    const step = 5;
    const setter = type === 'main' ? setMainPatches : type === 'addon' ? setAddons : setLetterPatches;
    const getter = type === 'main' ? mainPatches : type === 'addon' ? addons : letterPatches;
    const newItems = [...getter];
    const item = newItems[index];
    if (!item) return;
    const newRotation = (item.rotation || 0) + delta * step;
    item.rotation = newRotation;
    setter(newItems);
  };

  // ---- Drag & Drop ----
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragTarget, setDragTarget] = useState(null);

  const getCanvasCoords = (clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
  };

  const handlePointerDown = (e) => {
    const ev = e.touches ? e.touches[0] : e;
    const coords = getCanvasCoords(ev.clientX, ev.clientY);
    if (!coords) return;
    const { x: mouseX, y: mouseY } = coords;

    const checkItems = (items, targetType) => {
      for (let i = items.length - 1; i >= 0; i--) {
        const p = items[i];
        const px = p.x * canvasRef.current.width;
        const py = p.y * canvasRef.current.height;
        const sizeRatio = p.size !== undefined ? p.size : globalPatchSize;
        const size = Math.min(canvasRef.current.width, canvasRef.current.height) * sizeRatio;
        if (Math.abs(mouseX - px) < size/2 && Math.abs(mouseY - py) < size/2) {
          setDraggingIndex(i);
          setDragTarget(targetType);
          setDragOffset({ x: mouseX - px, y: mouseY - py });
          if (e.touches) e.preventDefault();
          return true;
        }
      }
      return false;
    };

    if (checkItems(mainPatches, 'main')) return;
    if (checkItems(addons, 'addon')) return;
    if (checkItems(letterPatches, 'letter')) return;

    if (initials.length > 0 && fontStyle !== 'bubble') {
      const ix = initialsPos.x * canvasRef.current.width;
      const iy = initialsPos.y * canvasRef.current.height;
      const size = fontSize * 1.2;
      if (Math.abs(mouseX - ix) < size/2 && Math.abs(mouseY - iy) < size/2) {
        setDragTarget('initials');
        setDragOffset({ x: mouseX - ix, y: mouseY - iy });
        if (e.touches) e.preventDefault();
        return;
      }
    }
  };

  const handlePointerMove = (e) => {
    if (draggingIndex === null && dragTarget !== 'initials') return;
    const ev = e.touches ? e.touches[0] : e;
    const coords = getCanvasCoords(ev.clientX, ev.clientY);
    if (!coords) return;
    const { x: mouseX, y: mouseY } = coords;

    if (dragTarget === 'main' && draggingIndex !== null) {
      const newPatches = [...mainPatches];
      const p = newPatches[draggingIndex];
      p.x = (mouseX - dragOffset.x) / canvasRef.current.width;
      p.y = (mouseY - dragOffset.y) / canvasRef.current.height;
      p.x = Math.max(0, Math.min(1, p.x));
      p.y = Math.max(0, Math.min(1, p.y));
      setMainPatches(newPatches);
      if (e.touches) e.preventDefault();
    } else if (dragTarget === 'addon' && draggingIndex !== null) {
      const newAddons = [...addons];
      const p = newAddons[draggingIndex];
      p.x = (mouseX - dragOffset.x) / canvasRef.current.width;
      p.y = (mouseY - dragOffset.y) / canvasRef.current.height;
      p.x = Math.max(0, Math.min(1, p.x));
      p.y = Math.max(0, Math.min(1, p.y));
      setAddons(newAddons);
      if (e.touches) e.preventDefault();
    } else if (dragTarget === 'letter' && draggingIndex !== null) {
      const newLetters = [...letterPatches];
      const p = newLetters[draggingIndex];
      p.x = (mouseX - dragOffset.x) / canvasRef.current.width;
      p.y = (mouseY - dragOffset.y) / canvasRef.current.height;
      p.x = Math.max(0, Math.min(1, p.x));
      p.y = Math.max(0, Math.min(1, p.y));
      setLetterPatches(newLetters);
      if (e.touches) e.preventDefault();
    } else if (dragTarget === 'initials') {
      const newX = (mouseX - dragOffset.x) / canvasRef.current.width;
      const newY = (mouseY - dragOffset.y) / canvasRef.current.height;
      setInitialsPos({
        x: Math.max(0, Math.min(1, newX)),
        y: Math.max(0, Math.min(1, newY))
      });
      if (e.touches) e.preventDefault();
    }
  };

  const handlePointerUp = () => {
    setDraggingIndex(null);
    setDragTarget(null);
  };

  // ---- Pricing ----
  const getReview = () => {
    const mainCount = mainPatches.length;
    const addonCount = addons.length;
    const letterCount = letterPatches.length;

    let mainPrice = 0;
    if (mainCount === 0) {
      mainPrice = 0;
    } else if (mainCount >= 8) {
      mainPrice = 210;
    } else if (mainCount >= 3) {
      mainPrice = 110;
    } else {
      mainPrice = mainCount * 35;
    }

    let addonTotal = 0;
    if (addonCount > 0) {
      if (addonCount >= 3) {
        addonTotal = 40;
      } else {
        const perAddon = mainCount > 0 ? 10 : 30;
        addonTotal = addonCount * perAddon;
      }
    }

    let letterPrice = 0;
    if (letterCount > 0) {
      const perLetter = mainCount > 0 ? 10 : 30;
      letterPrice = letterCount * perLetter;
    }

    const initialsPrice = initials.length > 0 ? 5 : 0;
    const total = BASE_PRICE + color.price + mainPrice + addonTotal + letterPrice + initialsPrice;

    return { mainPrice, addonTotal, letterPrice, initialsPrice, total };
  };

  // ---- Screenshot preview ----
  const previewScreenshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataURL = canvas.toDataURL('image/png');
    setScreenshotData(dataURL);
    setShowScreenshot(true);
  };

  // ---- Upload to Cloudinary ----
  const uploadToCloudinary = async (dataURL) => {
    const formData = new FormData();
    formData.append('file', dataURL);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: 'POST', body: formData }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Cloudinary upload failed');
    }
    const data = await response.json();
    return data.secure_url;
  };

  // ---- Place Order ----
  const placeOrder = async () => {
    if (!whatsapp || !whatsappConfirm) {
      alert('Please enter your WhatsApp number and confirm it.');
      return;
    }
    if (whatsapp !== whatsappConfirm) {
      alert('WhatsApp numbers do not match.');
      return;
    }
    const cleaned = whatsapp.replace(/\D/g, '');
    if (cleaned.length < 10 || cleaned.length > 15) {
      alert('Please enter a valid phone number (10-15 digits).');
      return;
    }

    if (!confirm('Are you sure this is your final design? You can still change it before we start crafting.')) return;

    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL('image/png');

    let screenshotUrl;
    try {
      screenshotUrl = await uploadToCloudinary(dataURL);
    } catch (err) {
      alert('Failed to upload your design image. Please try again.');
      console.error('Cloudinary upload error:', err);
      return;
    }

    const orderData = {
      mode: 'studio',
      color: color.name,
      mainPatches: mainPatches.map(p => MAIN_PATCHES.find(pp => pp.id === p.id)?.name || p.id),
      addons: addons.map(p => ADDONS.find(pp => pp.id === p.id)?.name || p.id),
      letterPatches: letterPatches.map(p => allLetterPatches.find(pp => pp.id === p.id)?.name || p.id),
      initials: initials || 'None',
      fontStyle: fontStyle,
      whatsapp: cleaned,
      screenshotUrl: screenshotUrl,
    };

    try {
      const response = await fetch('/api/save-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      const result = await response.json();
      if (result.success) {
        const designUrl = `${window.location.origin}/design/${result.shortCode}`;
        alert(
          `🎉 Your custom clog order has been placed!\n\nOrder code: ${result.shortCode}\n\nWe will contact you via WhatsApp to confirm the details and arrange payment.\n\nView your design: ${designUrl}`
        );
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error('Order error:', err);
      alert('Network error. Please try again.');
    }
  };

  // ---- Render selected badge ----
  const renderSelectedBadge = (type, item, def, index) => {
    const isLetter = type === 'letter';
    const displayName = def ? def.name : item.id.replace('letter-', '').toUpperCase();
    const displayPrice = isLetter ? 0 : (def ? def.price : 0);
    const priceLabel = isLetter ? 'R0' : `+R${displayPrice}`;
    const sizeVal = item.size !== undefined ? item.size : globalPatchSize;
    const rotationVal = item.rotation || 0;

    return (
      <div key={index} className="selected-item-badge">
        <div className="badge-header">
          <span className="badge-icon">{displayName}</span>
          <span className="badge-price">{priceLabel}</span>
          <span className="remove" onClick={() => removeItem(type, index)}>✕</span>
        </div>
        <div className="badge-controls">
          <div className="control-group">
            <span className="ctrl-label">Size</span>
            <button className="ctrl-btn" onClick={() => changeItemSize(type, index, -1)}>−</button>
            <span className="ctrl-value">{Math.round(sizeVal * 100)}%</span>
            <button className="ctrl-btn" onClick={() => changeItemSize(type, index, 1)}>+</button>
          </div>
          <div className="control-group">
            <span className="ctrl-label">Rotate</span>
            <button className="ctrl-btn" onClick={() => changeItemRotation(type, index, -1)}>−</button>
            <span className="ctrl-value">{rotationVal}°</span>
            <button className="ctrl-btn" onClick={() => changeItemRotation(type, index, 1)}>+</button>
          </div>
        </div>
      </div>
    );
  };

  // ---- Render Steps ----
  const renderStepContent = () => {
    switch(step) {
      case 1:
        return (
          <div className="step-content active">
            <h3>Choose Your Base</h3>
            <p className="sub">Select the clog colour.</p>
            <div className="color-grid">
              {COLORS.map(c => (
                <div
                  key={c.id}
                  className={'color-option ' + (color.id === c.id ? 'selected' : '')}
                  onClick={() => setColor(c)}
                >
                  <div className="color-swatch" style={{ background: c.hex }}></div>
                  <div className="name">{c.name}</div>
                  <div className="price">+R {c.price}</div>
                </div>
              ))}
            </div>
            <div className="step-nav">
              <span></span>
              <button className="btn-step next" onClick={() => goToStep(2)}>Next →</button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="step-content active">
            <h3>Add Patches &amp; Add-ons</h3>
            <p className="sub" style={{fontSize:'0.8rem'}}>
              Tap a patch to add it – we'll auto-scroll to show you the preview! (Max {MAX_ITEMS} items total)
            </p>

            <div className="collapsible-section">
              <div className="section-header" onClick={() => setShowPatches(!showPatches)}>
                <span>🧩 Main Patches (R35 each, tiered pricing)</span>
                <span className="toggle-icon">{showPatches ? '−' : '+'}</span>
              </div>
              {showPatches && (
                <div className="section-content" id="patchGrid">
                  <div className="patch-grid">
                    {MAIN_PATCHES.map(p => (
                      <div key={p.id} className="patch-option" onClick={() => toggleMainPatch(p)}>
                        <div className="patch-preview"><img src={p.img} alt={p.name} /></div>
                        <div className="patch-name">{p.name}</div>
                        <div className="patch-price">+R {p.price}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="collapsible-section">
              <div className="section-header" onClick={() => setShowAddons(!showAddons)}>
                <span>✨ Add-ons (tiered pricing)</span>
                <span className="toggle-icon">{showAddons ? '−' : '+'}</span>
              </div>
              {showAddons && (
                <div className="section-content">
                  <div className="patch-grid">
                    {ADDONS.map(p => (
                      <div key={p.id} className="patch-option" onClick={() => toggleAddon(p)}>
                        <div className="patch-preview"><img src={p.img} alt={p.name} /></div>
                        <div className="patch-name">{p.name}</div>
                        <div className="patch-price">+R {p.price}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={{marginTop:20}}>
              <p style={{fontSize:13,color:'#999'}}>
                Your selection ({mainPatches.length + addons.length + letterPatches.length} / {MAX_ITEMS}):
              </p>
              <div className="selected-items">
                {mainPatches.map((p, i) => {
                  const def = MAIN_PATCHES.find(pp => pp.id === p.id);
                  return renderSelectedBadge('main', p, def, i);
                })}
                {addons.map((p, i) => {
                  const def = ADDONS.find(pp => pp.id === p.id);
                  return renderSelectedBadge('addon', p, def, i);
                })}
                {mainPatches.length === 0 && addons.length === 0 && letterPatches.length === 0 &&
                  <span style={{color:'#ccc'}}>None selected</span>
                }
              </div>

              <div style={{marginTop:'10px', padding:'10px', background:'#f5f5f5', borderRadius:'8px'}}>
                <label style={{fontSize:'13px', color:'#666', display:'flex', alignItems:'center', gap:10}}>
                  Global size:
                  <button className="size-btn" onClick={() => setGlobalPatchSize(Math.min(0.4, globalPatchSize + 0.02))}>+</button>
                  <span style={{fontWeight:'bold', minWidth:'40px', textAlign:'center'}}>{Math.round(globalPatchSize * 100)}%</span>
                  <button className="size-btn" onClick={() => setGlobalPatchSize(Math.max(0.05, globalPatchSize - 0.02))}>−</button>
                </label>
              </div>
            </div>

            <div className="step-nav">
              <button className="btn-step prev" onClick={() => goToStep(1)}>← Back</button>
              <button className="btn-step next" onClick={() => goToStep(3)}>Next →</button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="step-content active">
            <div className="collapsible-section">
              <div className="section-header" onClick={() => setShowText(!showText)}>
                <span>✍️ Add Initials / Letters</span>
                <span className="toggle-icon">{showText ? '−' : '+'}</span>
              </div>
              {showText && (
                <div className="section-content" style={{ overflow: 'hidden', maxWidth: '100%' }}>
                  <p className="sub">
                    Type your text (max 8 characters). Choose "Cartoonish" to use image letters instead of text.
                  </p>
                  <div className="initials-input" style={{ flexWrap: 'wrap', maxWidth: '100%' }}>
                    <input
                      type="text"
                      maxLength="8"
                      placeholder="Your text (e.g. JM)"
                      value={initials}
                      onChange={handleInitialsChange}
                      style={{ minWidth: '120px', maxWidth: '100%' }}
                    />
                    <span className="char-count">{initials.length} / 8</span>
                  </div>
                  <div style={{marginTop:15}}>
                    <p style={{fontSize:13,color:'#999'}}>Initials colour (for text mode):</p>
                    <div className="initials-colors">
                      {INITIALS_COLORS.map(c => (
                        <div
                          key={c}
                          className={'color-btn ' + (initialsColor === c ? 'active' : '')}
                          style={{background: c, borderColor: c === '#ffffff' ? '#ddd' : c}}
                          onClick={() => setInitialsColor(c)}
                        ></div>
                      ))}
                    </div>
                  </div>
                  <div style={{marginTop:12}}>
                    <label style={{fontSize:13,color:'#999', display:'flex', alignItems:'center', gap:8}}>
                      <input type="checkbox" checked={isGold} onChange={(e) => setIsGold(e.target.checked)} />
                      Gold foil effect (visual only – no extra cost)
                    </label>
                  </div>
                  <div style={{marginTop:12}}>
                    <label style={{fontSize:13,color:'#999', display:'block'}}>
                      Font style:
                      <select
                        value={fontStyle}
                        onChange={(e) => {
                          const newStyle = e.target.value;
                          setFontStyle(newStyle);
                          if (newStyle === 'bubble' && initials.length > 0) {
                            updateLetterPatchesFromText(initials);
                          } else {
                            setLetterPatches([]);
                          }
                        }}
                        style={{display:'block', width:'100%', padding:'8px', marginTop:'5px', borderRadius:'8px', border:'1px solid #ddd'}}
                      >
                        {FONT_STYLES.map(f => (
                          <option key={f.id} value={f.id}>{f.name}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <div style={{marginTop:12}}>
                    <label style={{fontSize:13,color:'#999', display:'flex', alignItems:'center', gap:10}}>
                      Text size (for text mode):
                      <button className="size-btn" onClick={() => setFontSize(Math.min(100, fontSize + 5))}>+</button>
                      <span style={{fontWeight:'bold', minWidth:'40px', textAlign:'center'}}>{fontSize}px</span>
                      <button className="size-btn" onClick={() => setFontSize(Math.max(20, fontSize - 5))}>−</button>
                    </label>
                  </div>

                  {fontStyle === 'bubble' && letterPatches.length > 0 && (
                    <div style={{marginTop:15}}>
                      <p style={{fontSize:13,color:'#666'}}>
                        🖼️ Your letter patches ({letterPatches.length}) – each can be resized / rotated individually:
                      </p>
                      <div className="selected-items">
                        {letterPatches.map((p, i) => {
                          const def = allLetterPatches.find(pp => pp.id === p.id);
                          return renderSelectedBadge('letter', p, def, i);
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="step-nav">
              <button className="btn-step prev" onClick={() => goToStep(2)}>← Back</button>
              <button className="btn-step next" onClick={() => goToStep(4)}>Preview →</button>
            </div>
          </div>
        );

      case 4: {
        const { mainPrice, addonTotal, letterPrice, initialsPrice, total } = getReview();
        return (
          <div className="step-content active">
            <h3>Review Your Design</h3>
            <div style={{background:'#faf8f7', borderRadius:16, padding:20, margin:'15px 0'}}>
              <div className="price-row"><span>Base</span><span>R {BASE_PRICE}</span></div>
              <div className="price-row"><span>Style: {color.name}</span><span>+R {color.price}</span></div>
              <div className="price-row"><span>Main Patches ({mainPatches.length})</span><span>+R {mainPrice}</span></div>
              <div className="price-row"><span>Add-ons ({addons.length})</span><span>+R {addonTotal}</span></div>
              <div className="price-row"><span>Letters ({letterPatches.length})</span><span>+R {letterPrice}</span></div>
              <div className="price-row"><span>Initials: {initials || 'None'}</span><span>+R {initialsPrice}</span></div>
              <div className="price-row total"><span>Total</span><span className="amount">R {total}</span></div>
            </div>

            <div style={{marginTop:15}}>
              <p style={{fontSize:13, color:'#666', marginBottom:5}}>We'll contact you on WhatsApp to confirm your order.</p>
              <label style={{fontSize:13, color:'#666', display:'block'}}>
                WhatsApp number:
                <input
                  type="tel"
                  placeholder="e.g. 0712345678"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  style={{display:'block', width:'100%', padding:'10px', marginTop:'5px', borderRadius:'8px', border:'1px solid #ddd'}}
                />
              </label>
              <label style={{fontSize:13, color:'#666', marginTop:10, display:'block'}}>
                Confirm WhatsApp number:
                <input
                  type="tel"
                  placeholder="Re-enter number"
                  value={whatsappConfirm}
                  onChange={(e) => setWhatsappConfirm(e.target.value)}
                  style={{display:'block', width:'100%', padding:'10px', marginTop:'5px', borderRadius:'8px', border:'1px solid #ddd'}}
                />
              </label>
            </div>

            <div className="step-nav">
              <button className="btn-step prev" onClick={() => goToStep(3)}>← Back</button>
              <div style={{display:'flex', gap:'10px', flex:1}}>
                <button className="btn-step" style={{background:'#eee', color:'#111', flex:1}} onClick={previewScreenshot}>
                  📸 Preview Screenshot
                </button>
                <button className="btn-step add-to-cart" onClick={placeOrder} style={{flex:1}}>
                  Place Order 🛒
                </button>
              </div>
            </div>
          </div>
        );
      }
      default: return null;
    }
  };

  // ---- Render ----
  if (currentPage === 'waitlist') {
    return <WaitlistPage />;
  }

  return (
    <>
      <nav>
        <a href="#" className="logo" onClick={() => window.location.href = '/'}>CLOG CRAFTS</a>
        <ul>
          <li><a href="#" className="nav-home">Home</a></li>
          <li
            className="dropdown"
            onMouseEnter={() => setStudioDropdown(true)}
            onMouseLeave={() => setStudioDropdown(false)}
          >
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); setStudioDropdown(!studioDropdown); }}
            >
              Design Studio ▾
            </a>
            <ul className={`dropdown-menu ${studioDropdown ? 'open' : ''}`}>
              <li><a href="#upload-design">📤 Upload Your Design</a></li>
              <li><a href="#" style={{color:'#ff4f98', fontWeight:600}}>🛠️ Build Your Own</a></li>
            </ul>
          </li>
          <li><a href="#staff">Staff</a></li>
        </ul>
      </nav>

      {step === 2 && (
        <div className="floating-buttons">
          <button className="float-btn float-btn-patches" onClick={scrollToPatches}>🧩 Patches</button>
          <button className="float-btn float-btn-design" onClick={scrollToCanvas}>🎨 Design</button>
        </div>
      )}

      {showScreenshot && screenshotData && (
        <div className="screenshot-modal" onClick={() => setShowScreenshot(false)}>
          <div className="screenshot-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="screenshot-close" onClick={() => setShowScreenshot(false)}>✕</button>
            <h3 style={{marginBottom:'15px'}}>📸 Your Design Screenshot</h3>
            <img src={screenshotData} alt="Your custom clog design" style={{width:'100%', borderRadius:'12px', border:'1px solid #eee'}} />
            <p style={{marginTop:'15px', fontSize:'13px', color:'#888'}}>
              This is the image that will be attached to your order.
            </p>
            <button 
              className="btn-step" 
              style={{marginTop:'15px', background:'#ff4f98', color:'white'}}
              onClick={() => {
                const link = document.createElement('a');
                link.download = 'my-custom-clog.png';
                link.href = screenshotData;
                link.click();
              }}
            >
              ⬇️ Download PNG
            </button>
          </div>
        </div>
      )}

      <section className="studio-page">
        <div className="studio-container">
          <div className="studio-header">
            <h1>Design Your <span>Clog</span></h1>
            <p>Build your perfect pair — step by step.</p>
          </div>

          <div className="studio-layout">
            <div className="controls-panel">
              <div className="step-indicator">
                {[1,2,3,4].map((s, index) => (
                  <React.Fragment key={s}>
                    <div className={`step-dot ${step === s ? 'active' : ''} ${step > s ? 'completed' : ''}`} onClick={() => goToStep(s)}>
                      <div className="circle">{s}</div>
                      <span className="label">{s === 1 ? 'Color' : s === 2 ? 'Patches' : s === 3 ? 'Initials' : 'Preview'}</span>
                    </div>
                    {index < 3 && <span className="step-arrow">→</span>}
                  </React.Fragment>
                ))}
              </div>
              {renderStepContent()}
            </div>

            <div className="preview-panel" id="previewPanel">
              <h3>Live Preview</h3>
              <p className="preview-sub">See your custom clog come to life</p>

              <div className="angle-toggle" style={{marginBottom:'15px'}}>
                <button className={'angle-btn ' + (viewAngle === 'front' ? 'active' : '')} onClick={() => setViewAngle('front')}>Front</button>
                <button className={'angle-btn ' + (viewAngle === 'side' ? 'active' : '')} onClick={() => setViewAngle('side')}>Side</button>
              </div>

              <div className="clog-preview">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={600}
                  style={{ cursor: 'pointer', touchAction: 'none', maxWidth: '100%', height: 'auto' }}
                  onMouseDown={handlePointerDown}
                  onMouseMove={handlePointerMove}
                  onMouseUp={handlePointerUp}
                  onMouseLeave={handlePointerUp}
                  onTouchStart={handlePointerDown}
                  onTouchMove={handlePointerMove}
                  onTouchEnd={handlePointerUp}
                />
              </div>
              <p style={{fontSize:11, color:'#bbb', marginTop:5}}>
                💡 Drag items or initials to reposition them.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default App;