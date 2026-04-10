# Exploration 3D "Clos Lucé" — Design Spec

> **Objectif** : Explorer 3 approches de rendu 3D pour une page produit joaillerie optimisée conversion. Prototype fonctionnel présentable à Florence en boutique.

## Contexte

Le projet `presentation-joaillerie` contient 11 explorations visuelles pour La Joaillerie Nice. Aucune n'utilise de 3D. On dispose maintenant de :
- `clos-luce.glb` (2 Mo) — modèle 3D bague Clos Lucé exporté depuis RhinoGold/KeyShot
- `studio_small_03_4k.hdr` (25 Mo, version web 1K : 1.6 Mo) — environment map studio HDRI extraite du package KeyShot
- `rendus-3d-package.ksp` — archive KeyShot originale (scène complète pour rendus offline futurs)

Benchmark : Gemmyo utilise des rendus CGI offline (JPG 2200x2200 + vidéo turntable MP4), zéro 3D navigateur. Qualité photoréaliste grâce au rendu KeyShot offline, pas au temps réel.

## Charte graphique La Joaillerie

| Token | Valeur | Usage |
|-------|--------|-------|
| `--emeraude` | `#1E393B` | Couleur principale, fonds, CTA secondaire |
| `--rouge` | `#A63437` | Accent chaud |
| `--or` | `#CB8C4D` | Accent luxe, CTA primaire, cadres |
| `--rose-pale` | `#E6D1CC` | Fond doux |
| `--gris-clair` | `#EDE9E8` | Fond neutre |
| `--fond-creme` | `#F5F0EC` | Fond principal |
| `--font-display` | Playfair Display | Titres, accroches |
| `--font-body` | Source Sans Pro | Corps, boutons |

Forme signature : losange (diamant). Ambiance : luxe discret, lumière chaude, espaces généreux.

## Structure commune aux 3 pistes

### Arborescence

```
JOAILLERIE/clos-luce/
├── assets/                          # Partagé entre les 3 pistes
│   ├── clos-luce.glb               # Modèle 3D (2 Mo)
│   ├── studio_small_03_4k.hdr      # HDRI originale (25 Mo, dev only)
│   ├── studio_1k.hdr               # HDRI web (1.6 Mo)
│   └── rendus-3d-package.ksp       # Archive KeyShot originale
├── v1-cinema/
│   ├── index.html
│   ├── css/style.css
│   └── js/app.js
├── v2-interactive/
│   ├── index.html
│   ├── css/style.css
│   └── js/app.js
└── v3-hybride/
    ├── index.html
    ├── css/style.css
    └── js/app.js
```

### Sections communes (même contenu, layout adapté par piste)

1. **Hero** — le bijou capte l'attention (traitement 3D spécifique à chaque piste)
2. **Détails produit** — "Clos Lucé", Or Blanc 18 carats, Diamants, ~2 500€
3. **Sélecteur taille** — 14 tailles (48-62), états stock/commande
4. **Gravure** — toggle activé/désactivé, choix police (script/serif/sans), +30€
5. **Double CTA** :
   - Primaire : "Ajouter au panier" — bouton plein `--or`, large
   - Secondaire : "Découvrir en boutique" — bouton outline `--emeraude` + icône localisation
   - Sous les CTA : "30 rue Pastorelli, Nice — Mar-Sam 10h30-18h"
6. **Storytelling atelier** — timeline du savoir-faire (Design 3D → Cire perdue → Fonte → Sertissage → Polissage)
7. **Cross-sell** — 3-4 pièces complémentaires (cards photo + nom + prix)

### Tech commune

- HTML/CSS/JS vanilla (pas de framework)
- CDN : GSAP 3 + ScrollTrigger, Lenis (smooth scroll)
- Google Fonts : Playfair Display + Source Sans Pro
- Responsive mobile-first (breakpoints : 1100px, 768px, 480px)
- Pas de build tool (fichiers statiques, cohérent avec le projet existant)

### Données produit Clos Lucé

```
Nom : Clos Lucé
Type : Bague (BAG)
Métal : Or Blanc 18 carats
Pierres : Diamants
Prix : à confirmer (placeholder 2 390€, basé sur le référentiel Longwood Blanche similaire)
Slug : clos-luce
Tailles : 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 62
Gravure : Oui, +30€, délai 1 semaine
```

---

## Piste 1 — "Cinéma KeyShot" (`v1-cinema/`)

### Concept
Rendus offline photoréalistes. Zéro WebGL en production. L'utilisateur est spectateur d'une expérience cinématique.

### Hero (100vh)
- Vidéo turntable plein écran en fond (MP4, autoplay, loop, muted)
- **Ce soir** : `<model-viewer>` en auto-rotation lente, mode non-interactif (interaction-prompt="none", camera-controls désactivé), comme placeholder de la vidéo KeyShot que Florian produira
- Titre "Clos Lucé" en Playfair Display, centré, apparition GSAP fade-in + slide-up
- Losange doré en filigrane décoratif
- Flèche scroll animée (bounce infini)
- Fond dégradé sombre : `--emeraude` → noir en bas

### Galerie packshots
- Swiper.js horizontal, 5-6 vues multi-angles
- Zoom on click (lightbox CSS)
- **Ce soir** : captures automatiques du GLB sous différents angles via `<model-viewer>` screenshots ou images placeholder

### Section lifestyle
- Image plein width avec overlay gradient `--emeraude` (opacity 0.6)
- Citation artisan en Playfair italic, blanc sur fond émeraude
- Parallax léger au scroll (GSAP, y: -50px)

### Section produit
- Layout 2 colonnes : image principale sticky à gauche / infos scroll à droite
- Sélecteur taille, gravure, double CTA
- Accordéon specs techniques

### Section atelier
- Timeline verticale : 5 étapes avec icônes minimalistes
- Scroll-triggered reveal GSAP (stagger 0.2s)

### Cross-sell
- Grille 3-4 cards, hover : élévation + bordure or

---

## Piste 2 — "Viewer 3D Interactif" (`v2-interactive/`)

### Concept
Le client manipule le bijou. Engagement tactile = lien émotionnel. `<model-viewer>` + HDRI studio.

### Hero (100vh)
- `<model-viewer>` plein écran
  - `src="assets/clos-luce.glb"`
  - `environment-image="assets/studio_1k.hdr"`
  - `camera-controls` activé
  - `auto-rotate` au chargement, s'arrête au premier touch/click
  - `shadow-intensity="1"` pour l'ombre au sol
  - `exposure="1.2"` pour un rendu plus lumineux
- Fond dégradé `--fond-creme` → `--rose-pale`
- Titre + sous-titre "Explorez chaque détail" en Playfair
- Indicateur tactile animé (icône main/doigt, fade-out après 3s ou premier touch)

### Scroll-driven 3D
- Le `<model-viewer>` passe en sticky à gauche (50% largeur desktop, 40vh mobile)
- GSAP ScrollTrigger pilote les attributs `camera-orbit` et `camera-target` du model-viewer
- Sections info à droite, chacune déclenche un angle caméra :
  - "Or blanc 18 carats" → vue de profil, focus métal
  - "Sertissage diamants" → zoom macro sur les pierres (field-of-view réduit)
  - "Gravure personnalisée" → vue intérieure de l'anneau (rotation 180°)
- Transitions caméra interpolées (model-viewer le fait nativement)

### Section produit
- Quand on atteint le CTA, le viewer se réduit en vignette flottante (coin bas-gauche, 120x120px, border-radius 50%, bordure or)
- L'utilisateur peut toujours manipuler le bijou pendant la configuration
- Double CTA identique

### AR Quick Look
- Bouton "Essayer sur votre main" avec icône AR
- `<model-viewer>` supporte AR nativement (`ar` attribut)
- Fonctionnel sur Android (WebXR), placeholder sur iOS (USDZ nécessaire, conversion ultérieure)

### Section atelier + cross-sell
- Identique à piste 1

---

## Piste 3 — "Hybride Luxe" (`v3-hybride/`)

### Concept
Vidéo KeyShot en hero (première impression parfaite) → transition vers viewer 3D interactif (engagement). Narration scroll complète.

### Hero (100vh) — Phase cinéma
- `<model-viewer>` en auto-rotation lente, non-interactif (comme piste 1)
- Post-processing CSS pour simuler le rendu cinématique :
  - Filtre : `contrast(1.1) brightness(1.05)`
  - Overlay vignette radiale sombre
  - Léger grain film (pseudo-element avec background noise)
- Titre "Clos Lucé" grande typo Playfair Display (font-size: clamp(3rem, 8vw, 6rem))
- Sous-titre "L'art du sertissage" en Source Sans Pro light
- Fond sombre : gradient `--emeraude` → `rgba(0,0,0,0.8)`

### Transition cinéma → 3D (~50vh)
- Le fond passe de sombre à `--fond-creme` (GSAP color tween)
- Texte "Prenez-le en main" apparaît en fade-in centré
- Le modèle 3D scale de 0.5 → 1.0 avec rotation (GSAP)
- L'indicateur tactile apparaît
- **Le moment clé** : `camera-controls` s'active, `auto-rotate` se désactive → l'objet passif devient interactif

### Exploration 3D interactive
- Même mécanique que piste 2 (sticky viewer + sections scroll)
- Enrichi de moments narratifs entre les sections :
  - Après le métal : citation artisan en Playfair italic, fond émeraude plein width
  - Après le sertissage : bande photo atelier avec parallax
- Le scroll pilote la caméra 3D ET le storytelling

### Section produit
- Viewer 3D en vignette flottante (comme piste 2)
- Layout colonne centrale large (max-width: 600px, centré)
- Sélecteur taille en pastilles horizontales
- Gravure toggle + aperçu (texte simple sous le toggle)
- Double CTA côte à côte, large

### Configurateur métal (si le GLB le permet)
- 3 pastilles : Or jaune #CB8C4D / Or blanc #C0C0C0 / Or rose #B76E79
- Si le GLB contient des material variants → switch natif `<model-viewer>`
- Sinon → mock visuel CSS filter (hue-rotate) sur la vignette 3D

### Section atelier
- Timeline horizontale scrollable (overflow-x: auto, snap scroll)
- Cards avec icônes minimalistes + texte court
- Background texture papier subtile (CSS)

### Cross-sell
- Carrousel horizontal avec cards photo, hover élégant
- Transition douce au survol (scale 1.02, box-shadow or)

### AR Quick Look
- Même logique que piste 2

---

## Assets à préparer avant le lancement des 3 agents

1. **GLB** : déjà copié → `assets/clos-luce.glb` (2 Mo) ✅
2. **HDRI 1K** : déjà convertie → `assets/studio_1k.hdr` (1.6 Mo) ✅
3. **HDRI originale** : conservée pour référence → `assets/studio_small_03_4k.hdr` ✅
4. **KSP** : conservé pour Florian → `assets/rendus-3d-package.ksp` ✅
5. **Photos placeholder** : les agents généreront des screenshots du GLB ou utiliseront des images d'ambiance

## Dépendances CDN

```html
<!-- 3D Viewer -->
<script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js"></script>

<!-- Animation -->
<script src="https://cdn.jsdelivr.net/npm/lenis@1/dist/lenis.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/ScrollTrigger.min.js"></script>

<!-- Galerie (piste 1 seulement) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css">
<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>

<!-- Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Source+Sans+Pro:wght@300;400;600&display=swap" rel="stylesheet">
```

## Critères de succès

- Chaque piste est un prototype fonctionnel navigable dans le navigateur
- Le GLB + HDRI se chargent et rendent correctement (pistes 2 et 3)
- La charte La Joaillerie est respectée (couleurs, typos, ambiance)
- Les interactions scroll (GSAP) fonctionnent sur desktop et mobile
- Le double CTA est présent et visuellement impactant sur chaque piste
- Florence peut comparer les 3 côte à côte en boutique

## Hors scope ce soir

- Rendus KeyShot offline (dépend de Florian) → placeholders utilisés
- Conversion USDZ pour AR iOS → bouton présent, fonctionnel Android uniquement
- Paiement réel / backend → maquette frontend uniquement
- Configurateur métal complet → mock si le GLB n'a pas de variants
- Optimisation performance poussée → prototype, pas production
