export type Currency = {
  code: string;
  name: string;
  emoji: string;
  emojiCode: string;
};

export type ConversionResult = {
  from: string;
  to: string;
  amount: number;
  result: number;
  rate: number;
  timestamp: string;
};

export type Favorite = {
  from: string;
  to: string;
};