import type { ProductSlug } from './products';

export type BrewMethod =
  | 'espresso'
  | 'filter'
  | 'v60'
  | 'aeropress'
  | 'french-press'
  | 'moka';

export interface BrewGuide {
  slug: BrewMethod;
  name: string;
  nameTR: string;
  /** Hoffmann-grounded description in English (1–2 sentences). */
  description: string;
  /** Hoffmann-grounded description in Turkish (1–2 sentences). Canonical. */
  descriptionTR: string;
  /** Single-sentence prep summary in English. */
  prep: string;
  /** Single-sentence prep summary in Turkish. Canonical. */
  prepTR: string;
  recommendedSlugs: ProductSlug[];
  available: boolean;
  recipe?: {
    coffee: string;
    water: string;
    grind: string;
    time: string;
    ratio: string;
  };
  /** Short single-phrase description used on the compact home card. Turkish. */
  tagTR: string;
  /** Short single-phrase description used on the compact home card. English. */
  tagEN: string;
  /**
   * Two-line headline numbers shown large in the panel. Each string renders
   * as-is; if it begins with digits, the counter component animates the
   * integer prefix from 0 to that value on viewport entry.
   */
  headline: {
    coffee: string;
    water: string;
    time: string;
    ratio: string;
  };
  /**
   * Timed steps in the right-column recipe timeline. `t` is the timestamp
   * shown left-aligned in mono; `step` is Turkish action, `stepEN` English.
   */
  timeline: Array<{ t: string; step: string; stepEN: string }>;
  /**
   * Three brewing conditions shown in a small grid below the timeline.
   * `labelKey` resolves through i18n in the `demleme` namespace.
   */
  conditions: Array<{ labelKey: string; value: string }>;
  equipment?: string[];
  steps?: string[];
  /** Optional editorial lead used on the dedicated brew-guide page. */
  lead?: string;
}

export const BREW_GUIDES: Record<BrewMethod, BrewGuide> = {
  espresso: {
    slug: 'espresso',
    name: 'Espresso',
    nameTR: 'Espresso',
    description:
      'Espresso is coffee under pressure: a small, concentrated extraction where the high density of dissolved solids makes texture, balance, and timing matter as much as flavour. The most demanding home method — every variable moves the cup.',
    descriptionTR:
      "Espresso, basınç altındaki kahvedir: küçük ve yoğun bir ekstraksiyon. Çözünmüş madde yoğunluğu yüksek olduğu için doku, denge ve zamanlama, lezzet kadar belirleyicidir. Evdeki en zorlu yöntem; her değişken fincana ölçülebilir biçimde yansır.",
    prep:
      'Dose into a clean basket, distribute and tamp level, pull a 1:2 ratio in 25–30 seconds, then adjust the grind until the timing produces the cup you want.',
    prepTR:
      "Temiz sepete net bir doz koy, eşit dağıt ve düz tampla; 25–30 saniyede yaklaşık 1:2 oranına ulaşacak şekilde çek, sonra istediğin fincan için öğütümü kalibre et.",
    tagTR: 'Basınç altındaki kahve. Küçük, yoğun, telaşsız.',
    tagEN: 'Coffee under pressure. Small, concentrated, unhurried.',
    recommendedSlugs: ['brazil', 'ethiopia-lekempti', 'ethiopia-yirgacheffe'],
    available: true,
    recipe: {
      coffee: '18g in',
      water: '36g out',
      grind: 'Fine',
      time: '25–30 seconds',
      ratio: '1:2',
    },
    headline: {
      coffee: '18g',
      water: '36g',
      time: '25–30s',
      ratio: '1:2',
    },
    timeline: [
      { t: '00:00', step: '18g doz · dağıt + tampla', stepEN: '18g dose · distribute + tamp' },
      { t: '00:06', step: 'ilk damla', stepEN: 'first drop' },
      { t: '00:27', step: '36g · çekimi durdur', stepEN: '36g · stop the shot' },
    ],
    conditions: [
      { labelKey: 'grindLabel', value: 'İnce' },
      { labelKey: 'tempLabel', value: '93°C' },
      { labelKey: 'pressureLabel', value: '9 bar' },
    ],
    equipment: [
      'Espresso machine with stable 9 bar pressure',
      'Calibrated grinder',
      'Tamper, scale, distribution tool',
      'Bottomless or spouted portafilter',
    ],
    steps: [
      'Dose 18g into a clean basket. Distribute evenly and tamp level with light, consistent pressure.',
      'Lock in and pull. Aim for the first drop at 6–9 seconds.',
      'Stop the shot when the scale reads 36g. Total time should land at 25–30 seconds.',
      'Taste. Sour means coarser; bitter means finer. Adjust grind, not time.',
    ],
    lead:
      'Espresso is the discipline that exposes everything else. Dial in for a quiet morning shot — short, sweet, unhurried.',
  },
  filter: {
    slug: 'filter',
    name: 'Filter coffee',
    nameTR: 'Filtre Kahve',
    description:
      'Filter coffee is the format that most honestly reveals what a coffee is — paper removes oils and fines, so origin character, processing, and roast development sit legibly in the cup. The method built around clarity, not body.',
    descriptionTR:
      'Filtre kahve, bir kahvenin gerçekte ne olduğunu en dürüst gösteren formdur. Kağıt, yağları ve inceleri süzer; köken karakteri, işleme yöntemi ve roast gelişimi olduğu gibi okunur. Gövde değil, berraklık üzerine kurulmuştur.',
    prep:
      'Use 1:16.6 medium-ground coffee to filtered water near 94°C, bloom with twice the coffee weight, then pour in controlled stages so the bed stays flat and total brew lands around 3:30.',
    prepTR:
      "60 g/L oranında, orta öğütüm kahveyi 94 °C civarındaki yumuşak suyla buluştur; dozun iki katı suyla bloom yap ve kontrollü aşamalarla yataktaki yüzey düz kalacak şekilde 3:30 civarında bitir.",
    tagTR: 'Bir kahvenin kim olduğunu en dürüst gösteren form.',
    tagEN: 'The format that most honestly reveals what a coffee is.',
    recommendedSlugs: ['peru', 'colombia'],
    available: true,
    recipe: {
      coffee: '22g',
      water: '360ml at 94°C',
      grind: 'Medium',
      time: '3:30 total',
      ratio: '1:16.4',
    },
    headline: {
      coffee: '22g',
      water: '360g',
      time: '3:30',
      ratio: '1:16.4',
    },
    timeline: [
      { t: '00:00', step: '50g bloom · 30s bekle', stepEN: '50g bloom · 30s rest' },
      { t: '00:30', step: "spiral pour · 200g'a kadar", stepEN: 'spiral pour to 200g' },
      { t: '01:10', step: "devam et · 360g'a kadar", stepEN: 'continue to 360g' },
      { t: '03:30', step: 'drawdown bitir · çevir + servis', stepEN: 'drawdown complete · swirl + serve' },
    ],
    conditions: [
      { labelKey: 'grindLabel', value: 'Orta' },
      { labelKey: 'tempLabel', value: '94°C' },
      { labelKey: 'agitationLabel', value: 'Spiral · döndür' },
    ],
    equipment: [
      'Pour-over dripper (V60, Kalita, or Origami)',
      'Paper filter, rinsed',
      'Server or cup',
      'Gooseneck kettle, scale, timer',
    ],
    steps: [
      'Rinse the paper. Discard the rinse water. Add 22g of medium-ground coffee.',
      'Pour 50g of 94°C water in a slow spiral. Wait 30 seconds for the bloom.',
      'Pour to 200g over the next 40 seconds. Pour to 360g over the following minute.',
      'Drawdown should complete around 3:30. Stir, swirl, serve.',
    ],
    lead:
      'Filter coffee is the morning that earns the day. Patience pours water in spirals and trusts the grind.',
  },
  v60: {
    slug: 'v60',
    name: 'Hario V60',
    nameTR: 'V60',
    description:
      'A conical, ribbed, single-hole dripper that rewards pour control with exceptional clarity and definition. The format that shows most honestly what a single-origin coffee actually tastes like.',
    descriptionTR:
      "V60, tek delikli, içi yivli ve konik bir damlama yöntemidir. Pour kontrolünü berraklık ve netlikle ödüllendirir; tek-köken bir kahvenin gerçekte ne tattığını en iyi gösteren araçlardan biridir. Tutarsızlığı affetmez, sakin ve kararlı bir eli ister.",
    prep:
      'Rinse the paper, bloom 30g medium-ground coffee with 60g of 93°C water and swirl, pour to 300g by 1:15 and to 500g by 1:45, finish with a stir and swirl for a 3:30 brew.',
    prepTR:
      "Filtreyi yıka, 30 g orta öğütüm kahveyi 60 g 93 °C suyla bloom yap ve döndür; 1:15'te 300 g'a, 1:45'te 500 g'a tamamla, sonunda karıştır-döndür ve 3:30 civarında bitir.",
    tagTR: 'Tek delikli, içi yivli, konik damlama. Berraklığın disiplini.',
    tagEN: 'Conical, ribbed, single-hole pour-over. The discipline of clarity.',
    recommendedSlugs: ['ethiopia-yirgacheffe'],
    available: false,
    recipe: {
      coffee: '30g',
      water: '500g at 93°C',
      grind: 'Medium',
      time: '3:30 total',
      ratio: '1:16.7',
    },
    headline: {
      coffee: '30g',
      water: '500g',
      time: '3:30',
      ratio: '1:16.7',
    },
    timeline: [
      { t: '00:00', step: '60g bloom · döndür', stepEN: '60g bloom · swirl' },
      { t: '00:45', step: "300g'a yavaş konsentrik pour", stepEN: 'slow concentric pour to 300g' },
      { t: '01:15', step: "500g'a tamamla", stepEN: 'pour to 500g' },
      { t: '01:45', step: 'karıştır · döndür', stepEN: 'stir · swirl' },
      { t: '03:30', step: 'drawdown bitir', stepEN: 'drawdown complete' },
    ],
    conditions: [
      { labelKey: 'grindLabel', value: 'Orta' },
      { labelKey: 'tempLabel', value: '93°C' },
      { labelKey: 'agitationLabel', value: 'Karıştır · döndür' },
    ],
  },
  aeropress: {
    slug: 'aeropress',
    name: 'AeroPress',
    nameTR: 'AeroPress',
    description:
      'A short-immersion brewer with a paper-filtered press finish. Forgiving, concentrated, somewhere between filter and espresso in character. Its strength is repeatability, not ceremony.',
    descriptionTR:
      'AeroPress, kısa demlemeli ve kağıt filtreyle preslenen bir yöntemdir. Filtre ile espresso arasında bir karakter sunar: temiz, yoğun, affedici. Töreni değil, tekrar edilebilirliği güçlü yanıdır.',
    prep:
      'In the standard orientation, add 11g medium-fine coffee and 200g just-boiled water, seat the plunger to form a vacuum seal, swirl at 2:00, then press gently over 30 seconds.',
    prepTR:
      "Standart konumda 11 g orta-ince kahveyi 200 g yeni kaynamış suyla doldur, pistonu vakum yaratacak şekilde oturt; 2:00'da hafifçe döndür ve yaklaşık 30 saniyede yumuşak bir basınçla pres uygula.",
    tagTR: 'Kısa demleme, kağıt filtre, hafif basınç. Affedici.',
    tagEN: 'Short immersion, paper filter, light pressure. Forgiving.',
    recommendedSlugs: ['colombia'],
    available: false,
    recipe: {
      coffee: '11g',
      water: '200g',
      grind: 'Medium-fine',
      time: '2:30 total',
      ratio: '1:18',
    },
    headline: {
      coffee: '11g',
      water: '200g',
      time: '2:30',
      ratio: '1:18',
    },
    timeline: [
      { t: '00:00', step: '200g su · pistonu otur', stepEN: '200g water · seat the plunger' },
      { t: '02:00', step: 'hafifçe döndür', stepEN: 'gentle swirl' },
      { t: '02:00', step: 'yaklaşık 30s pres', stepEN: '~30s press' },
    ],
    conditions: [
      { labelKey: 'grindLabel', value: 'Orta-ince' },
      { labelKey: 'tempLabel', value: '100°C (açık)' },
      { labelKey: 'orientationLabel', value: 'Standart' },
    ],
  },
  'french-press': {
    slug: 'french-press',
    name: 'French press',
    nameTR: 'French Press',
    description:
      'A full-immersion, metal-mesh brewer. Done properly, gives a heavier, more textural cup and is one of the most flavour-faithful methods. Sediment and over-agitation are technique problems, not method problems.',
    descriptionTR:
      'French press, tam batırmalı ve metal süzgeçli bir yöntemdir. Doğru uygulandığında daha gövdeli ve dokulu bir fincan verir; lezzete en sadık yöntemlerden biridir. Tortu ve aşırı karıştırma teknik sorundur, yöntemin değil.',
    prep:
      'Brew 1:16.7, leave undisturbed for four minutes, break the crust gently, skim the foam and fines, rest a further 5–8 minutes, then press to the surface and pour.',
    prepTR:
      'Kahveyi 1:16.7 oranıyla demle, 4 dakika dokunma; kabuğu nazikçe kır, köpüğü ve inceleri sıyır; 5–8 dakika daha bekle, pistonu sadece sıvının yüzeyine indir ve yavaşça servis et.',
    tagTR: 'Tam batırma, metal süzgeç. Gövde ve dokuya sadık.',
    tagEN: 'Full immersion, metal mesh. Faithful to body and texture.',
    recommendedSlugs: ['brazil'],
    available: false,
    recipe: {
      coffee: '30g',
      water: '500g at 95°C',
      grind: 'Medium-coarse',
      time: '9–12 min',
      ratio: '1:16.7',
    },
    headline: {
      coffee: '30g',
      water: '500g',
      time: '9 dk',
      ratio: '1:16.7',
    },
    timeline: [
      { t: '00:00', step: 'tüm suyu dök · dokunma', stepEN: 'pour all water · leave undisturbed' },
      { t: '04:00', step: 'kabuğu nazikçe kır', stepEN: 'break the crust gently' },
      { t: '04:30', step: 'köpük + inceleri sıyır', stepEN: 'skim foam + fines' },
      { t: '09:00', step: 'piston · sadece yüzeye', stepEN: 'plunger · only to the surface' },
    ],
    conditions: [
      { labelKey: 'grindLabel', value: 'Orta-iri' },
      { labelKey: 'tempLabel', value: '95°C' },
      { labelKey: 'restLabel', value: '5–8 dk dinlendir' },
    ],
  },
  moka: {
    slug: 'moka',
    name: 'Moka pot',
    nameTR: 'Moka',
    description:
      'A stovetop pressure brewer. Not espresso, but its own concentrated, full-bodied category, particularly suited to medium and medium-dark roasts. Bitterness comes from heat and over-extraction, both avoidable.',
    descriptionTR:
      'Moka, ocak üstünde basınçla demleyen bir yöntemdir; espresso değildir, kendi yoğun ve dolgun kategorisidir. Özellikle orta ve orta-koyu roastlara yakışır. Acılığı çoğu zaman aşırı ısı ve aşırı ekstraksiyondan gelir, ikisi de önlenebilir.',
    prep:
      'Fill the base with just-boiled water to the safety valve, fill the basket level with medium-fine grind, brew on medium heat with the lid open, and pull off the heat the moment the flow lightens and starts to sputter.',
    prepTR:
      'Alt hazneyi emniyet vanasının altına kadar yeni kaynamış suyla doldur, sepeti orta-ince öğütümle düz hizalı doldur; kapağı açık şekilde orta ateşe koy ve akış soluklaşıp tıslamaya başladığı an ateşten al.',
    tagTR: 'Ocak üstü basınç. Yoğun ve dolgun, ev klasiği.',
    tagEN: 'Stovetop pressure. Concentrated, full-bodied, a household classic.',
    recommendedSlugs: ['brazil'],
    available: false,
    recipe: {
      coffee: '20g',
      water: 'to the valve',
      grind: 'Medium-fine',
      time: '~4 min',
      ratio: 'Filled basket',
    },
    headline: {
      coffee: '20g',
      water: 'vana',
      time: '~4 dk',
      ratio: 'sepet düz',
    },
    timeline: [
      { t: '00:00', step: 'kaynamış su · sepet hazır', stepEN: 'boiled water · basket ready' },
      { t: '00:30', step: 'orta ateş · kapak açık', stepEN: 'medium heat · lid open' },
      { t: '~03:00', step: 'akış soluklaşır → ateşten al', stepEN: 'flow lightens → off heat' },
      { t: '~03:30', step: 'altı soğut · servis', stepEN: 'cool the base · serve' },
    ],
    conditions: [
      { labelKey: 'grindLabel', value: 'Orta-ince' },
      { labelKey: 'heatLabel', value: 'Orta · kapak açık' },
      { labelKey: 'finishLabel', value: 'Tıslamada bitir' },
    ],
  },
};

export const BREW_LIST = Object.values(BREW_GUIDES);
