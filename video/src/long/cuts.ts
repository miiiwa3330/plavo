// 長い版（1分40秒）の台本。縦画面・横画面で共通。録画のどこを使い、どこへ寄り、どこで音を鳴らすか。
// **撮り直したら、ここを録画に合わせて見直す。**
//
// 時刻はどれも**録画の先頭からの秒**（from / to / zoom.at / sfx.at）。
// 位置はアプリの画面のポイント（iPhone 17 の 402×874・左上が原点）。
//
// 章は BGM の小節の頭から始まる（timeline.ts）。章の中の切り出しが足りなければ、
// 最後の切り出しを録画の先まで伸ばして埋める。

export type Source = "tour" | "camera" | "flipbook";

export const sources: Record<Source, string> = {
  tour: "tour.mp4",
  camera: "camera.mp4",
  flipbook: "flipbook.mp4",
};

export type SfxName = "tap" | "shutter" | "pop" | "send" | "water" | "chime" | "sun" | "insert";

/** 寄る先。at から寄り始める（省けば切り出しの頭から） */
export type Zoom = { x: number; y: number; scale: number; at?: number };

export type Clip = {
  source: Source;
  from: number;
  to: number;
  rate?: number;
  /** 語り手の一言（使い方の説明）。同じ一言が続くあいだは出し直さない */
  narration: string;
  zoom?: Zoom[];
  sfx?: { at: number; name: SfxName; volume?: number }[];
  /** 水やりのしずくを重ねる時刻 */
  water?: number;
  /** 日向の光の筋を重ねる時刻 */
  sun?: number;
};

export type ActName = "出会う" | "話す" | "記録する" | "共有する";

export type Act = {
  name: ActName;
  /** BGM の何小節目から始めるか */
  bar: number;
  clips: Clip[];
};

export const actNames: ActName[] = ["出会う", "話す", "記録する", "共有する"];

/** 寄らない（端末の全体を見せる） */
const whole = (at?: number): Zoom => ({ x: 201, y: 437, scale: 1, at });

export const acts: Act[] = [
  {
    name: "出会う",
    bar: 2,
    clips: [
      // 誰も選ばれていないので、映像がぼけている（D52）
      { source: "camera", from: 12.2, to: 14.2, narration: "新しい子を、迎えましょう。" },
      // シャッターを「迎える」へ滑らせる
      {
        source: "camera", from: 14.2, to: 15.3, narration: "新しい子を、迎えましょう。",
        zoom: [{ x: 250, y: 700, scale: 1.55 }], sfx: [{ at: 14.5, name: "tap", volume: 0.5 }],
      },
      { source: "camera", from: 15.7, to: 16.8, narration: "新しい子を、迎えましょう。", sfx: [{ at: 15.95, name: "tap", volume: 0.5 }] },
      // 撮る → その1枚で止まり、植物に枠
      {
        source: "camera", from: 17.55, to: 18.95, narration: "カメラで見つけて",
        zoom: [{ x: 201, y: 450, scale: 1.2, at: 18.55 }], sfx: [{ at: 18.0, name: "shutter" }],
      },
      { source: "camera", from: 18.95, to: 21.35, narration: "カメラで見つけて" },
      // 「話しかける」→ 名前の入力
      {
        source: "camera", from: 21.65, to: 23.15, narration: "名前をつけたら",
        zoom: [{ x: 250, y: 740, scale: 1.35 }, { x: 201, y: 330, scale: 1.5, at: 22.65 }],
        sfx: [{ at: 21.95, name: "tap" }],
      },
      { source: "camera", from: 23.15, to: 24.35, narration: "名前をつけたら" },
      { source: "camera", from: 25.4, to: 27.6, narration: "名前をつけたら" },
      // 「はじめる」→ 話しかけてくる（台本の最初は「やあ」）
      {
        source: "camera", from: 27.6, to: 28.6, narration: "話しかけてきます。",
        // ここから「あったかい、ありがとう」までは寄らない。セリフのたびに寄り先が移ると、
        // 画面があちこちへ動いて見づらい。名前の入力欄から引いて、全体を見せたままにする
        zoom: [whole(27.7)],
        sfx: [{ at: 27.85, name: "tap" }, { at: 28.2, name: "chime" }],
      },
      { source: "camera", from: 28.6, to: 29.2, narration: "話しかけてきます。" },
    ],
  },
  {
    // 台本（アプリの DemoCamera.script）: お水欲しいな → 水 → 気持ち良い！ありがとう →
    // もう少しだけ日向ぼっこしたい → 日向 → あったかい、ありがとう → センサーを刺す
    name: "話す",
    bar: 11,
    clips: [
      // 区切りは録画の中でセリフが変わる時刻に合わせる（お水欲しいな 29.3 → 気持ち良い 33.3 →
      // 日向ぼっこしたい 37.5 → あったかい 41.5）。語り手とキャラクターの一言がセリフと食い違わないように
      { source: "camera", from: 29.2, to: 33.2, narration: "困っている時には" },
      // 水をあげたことにする（台本）。しずくは動画の側で重ねる
      {
        source: "camera", from: 33.2, to: 37.4, narration: "困っている時には",
        water: 33.2, sfx: [{ at: 33.25, name: "water" }],
      },
      // 日陰で「もう少しだけ日向ぼっこしたい」→ 日向へ →「あったかい、ありがとう」。
      // 映像の明るさはアプリの側（DemoStage）、差し込む光の筋は動画の側で重ねる
      { source: "camera", from: 37.4, to: 41.4, narration: "助けてあげましょう。" },
      {
        source: "camera", from: 41.4, to: 45.1, narration: "助けてあげましょう。",
        sun: 41.5, sfx: [{ at: 41.6, name: "sun" }],
      },
      // センサーを鉢に刺す（D64）。刺さり始め 45.6・刺さり切り 46.3（つまみが緑になるのは 47.0）。刺さってから引くまでの待ちは切る
      {
        source: "camera", from: 45.1, to: 48.6, narration: "センサーを刺すと、",
        zoom: [{ x: 225, y: 600, scale: 1.4, at: 45.2 }], sfx: [{ at: 46.25, name: "insert" }],
      },
      // 右端のつまみを左へ引く（49.3〜50.0）→ 値を見る → 右へ払って閉じる（55.5〜56.0）
      {
        source: "camera", from: 49.1, to: 56.3, narration: "今の状態を詳しく見られます。",
        zoom: [{ x: 240, y: 420, scale: 1.2, at: 49.4 }, whole(55.3)],
        sfx: [{ at: 49.3, name: "tap" }, { at: 55.5, name: "tap", volume: 0.5 }],
      },
      // 撮る。画面の下（シャッター・左下の枠・「日記に追加しました」）へ寄る
      {
        source: "camera", from: 56.85, to: 59.35, narration: "写真を撮ると、日記へ追加されます。",
        zoom: [{ x: 201, y: 690, scale: 1.45, at: 56.95 }],
        sfx: [{ at: 58.15, name: "shutter" }],
      },
    ],
  },
  {
    name: "記録する",
    bar: 26,
    clips: [
      { source: "tour", from: 12.0, to: 12.8, narration: "育てている子ごとに", zoom: [whole()], sfx: [{ at: 12.5, name: "tap" }] },
      { source: "tour", from: 14.5, to: 15.9, narration: "育てている子ごとに" },
      {
        source: "tour", from: 18.8, to: 20.4, narration: "育成状態の詳細を見たり",
        zoom: [{ x: 201, y: 330, scale: 1.3, at: 19.6 }], sfx: [{ at: 19.3, name: "tap" }],
      },
      { source: "tour", from: 21.6, to: 24.2, rate: 1.3, narration: "育成状態の詳細を見たり" },
      { source: "tour", from: 26.4, to: 27.7, narration: "写真や動画を、\n振り返ることができます。", zoom: [whole()], sfx: [{ at: 26.7, name: "tap" }] },
      // ひまりの一生を、パラパラで
      {
        source: "flipbook", from: 13.6, to: 16.6, narration: "写真や動画を、\n振り返ることができます。",
        zoom: [{ x: 201, y: 330, scale: 1.3, at: 13.8 }], sfx: [{ at: 13.9, name: "tap" }],
      },
    ],
  },
  {
    name: "共有する",
    bar: 33,
    clips: [
      { source: "tour", from: 33.8, to: 35.4, narration: "日記は 自分・友達・みんなのように公開範囲が決められます。", zoom: [whole()], sfx: [{ at: 34.2, name: "tap" }] },
      { source: "tour", from: 37.6, to: 38.9, narration: "日記は 自分・友達・みんなのように公開範囲が決められます。" },
      // スタンプの枠 → 🌸 → 写真の上を流れる
      {
        source: "tour", from: 41.2, to: 42.4, narration: "スタンプで気持ちを送り合うこともできます。",
        zoom: [{ x: 130, y: 580, scale: 1.7 }], sfx: [{ at: 41.5, name: "tap" }],
      },
      {
        source: "tour", from: 43.9, to: 46.0, narration: "スタンプで気持ちを送り合うこともできます。",
        zoom: [{ x: 201, y: 460, scale: 1.3, at: 44.4 }], sfx: [{ at: 44.2, name: "pop" }],
      },
      { source: "tour", from: 47.3, to: 48.6, narration: "スタンプで気持ちを送り合うこともできます。", zoom: [whole()] },
      {
        source: "tour", from: 49.8, to: 52.0, narration: "スタンプで気持ちを送り合うこともできます。",
        zoom: [{ x: 201, y: 420, scale: 1.4, at: 50.0 }], sfx: [{ at: 50.1, name: "pop" }],
      },
      { source: "tour", from: 54.1, to: 55.1, narration: "一緒に育てている家族と話し合うこともできます。", zoom: [whole()], sfx: [{ at: 54.3, name: "tap" }] },
      { source: "tour", from: 58.2, to: 59.2, narration: "一緒に育てている家族と話し合うこともできます。", sfx: [{ at: 58.4, name: "tap" }] },
      {
        source: "tour", from: 62.7, to: 63.7, narration: "一緒に育てている家族と話し合うこともできます。",
        zoom: [{ x: 240, y: 500, scale: 1.5, at: 63.0 }], sfx: [{ at: 62.9, name: "tap" }],
      },
      { source: "tour", from: 64.6, to: 65.2, narration: "一緒に育てている家族と話し合うこともできます。" },
      { source: "tour", from: 66.9, to: 67.9, narration: "一緒に育てている家族と話し合うこともできます。", sfx: [{ at: 67.1, name: "send" }] },
    ],
  },
];

/**
 * 終盤に並べる画面（3列×2段）。どれも短く流して、最後のコマで止める。
 * 並びは話の流れのとおり: 上段 カメラ・育成のグラフ・パラパラ／下段 日記の ❤️・トーク・プロフィール
 */
export const overview: { source: Source; from: number; to: number }[] = [
  // カメラはセンサーの枠を開いているところ（D64）
  { source: "camera", from: 50.1, to: 53.1 },
  { source: "tour", from: 20.6, to: 24.2 },
  { source: "flipbook", from: 13.8, to: 16.6 },
  { source: "tour", from: 49.9, to: 52.2 },
  { source: "tour", from: 64.4, to: 68.0 },
  { source: "tour", from: 78.9, to: 81.8 },
];

/** はじめのタイトルの一言。ロゴを消した背景の上に出す。縦画面は \n で2行にする（横画面は1行） */
export const introCaption = "Plavoアプリ\n紹介動画！☘️";

/** 画面を並べる場面の語り手の一言 */
export const overviewCaption = "植物との毎日を、ひとつのアプリに";

/**
 * 案内役のキャラクターの一言（植物の気持ちの代弁・感想）。**動画の秒**で置く（切り出しには付けない）。
 * 画面のセリフや操作に合わせて、切り出しの区切りをまたいで出したい場面があるため。
 * 一覧に無い時間は、キャラクターは黙って立っている
 */
export const comments: { text: string; from: number; to: number }[] = [
  { text: "どんな子かな？", from: 6, to: 9 },
  { text: "この子にする！", from: 11, to: 14 },
  { text: "名前は“まる”にしよう", from: 15, to: 19 },
  { text: "わぁ！しゃべった！！！", from: 21, to: 24 },
  { text: "お水をあげると、うれしそう", from: 27, to: 30 },
  { text: "日向に連れてっても、うれしそう", from: 35, to: 38 },
  { text: "ん、なんだこれは？", from: 39, to: 42 },
  { text: "今の状態が丸わかりだね！", from: 44, to: 49 },
  { text: "日記に残せるの？", from: 50.5, to: 53.03 },
  { text: "すごい。大切に育てられそう", from: 57.77, to: 62.97 },
  { text: "パラパラマンガみたい", from: 64.27, to: 67.3 },
  { text: "この子可愛い！", from: 71, to: 75 },
  { text: "ダブルタップ❤️", from: 78.2, to: 81.23 },
  { text: "これならみんなで育てられるね", from: 85.93, to: 89.7 },
];
